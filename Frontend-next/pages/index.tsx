import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import boardsSlice from "@redux/boardsSlice";
import { RootState } from "@redux/store";
import Home from "@components/Home";
import EmptyBoard from "@components/EmptyBoard";
import Header from "@components/Header";
import { useQuery } from "@apollo/client";
import { GET_BOARDS } from "queries/BoardQueries";
import { IBoard } from "interfaces";

import LoadingModal from "@modals/LoadingModal";

export default function IndexPage() {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const boards: IBoard[] = useSelector(
    (state: RootState) => state.boards.boardsList
  );

  const boardGlobalLoading: boolean = useSelector(
    (state: RootState) => state.boards.loadingBoard
  );
  const selectedBoard: IBoard | undefined = useSelector(
    (state: RootState) => state.boards.selectedBoard
  );

  const [hasMounted, setHasMounted] = useState(false);
  const {
    data: boardData,
    loading: loadingboard,
    error: boardError,
  } = useQuery(GET_BOARDS);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [isLoadingModalOpen, setIsLoadingModalOpen] =
    useState(boardGlobalLoading);

  useEffect(() => {
    if (boardError) {
      dispatch(boardsSlice.actions.updateLoading({ act: false }));
      return;
    }
    if (!loadingboard && boardData) {
      dispatch(boardsSlice.actions.addBoardList(boardData.boards));
      if (
        !selectedBoard ||
        Object.keys(selectedBoard ? selectedBoard : {}).length === 0
      ) {
        dispatch(boardsSlice.actions.setBoardActive(boardData.boards[0]));
      } else {
        //get prev selected board from array
        const prevBoard = boardData.boards.find(
          (board: IBoard) => board.id == selectedBoard.id
        );
        dispatch(boardsSlice.actions.setBoardActive(prevBoard));
      }
      dispatch(boardsSlice.actions.updateLoading({ act: false }));
    }
  }, [loadingboard, boardData, boardError]);

  // useEffect(() => {
  //   //if (!activeBoard && boards.length > 0)
  //   // dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));
  // }, [boards]);

  if (!hasMounted) {
    return null;
  }
  return (
    <>
      <div className=" overflow-hidden  overflow-x-scroll relative">
        <>
          {!loadingboard && (
            <>
              <>
                <Header
                  // @ts-ignore
                  setIsBoardModalOpen={setIsBoardModalOpen}
                  isBoardModalOpen={isBoardModalOpen}
                />
                <Home
                  //@ts-ignore
                  setIsBoardModalOpen={setIsBoardModalOpen}
                  isBoardModalOpen={isBoardModalOpen}
                />
              </>
            </>
          )}

          {boardGlobalLoading && (
            <LoadingModal setIsLoadingModalOpen={setIsLoadingModalOpen} />
          )}
        </>
      </div>
    </>
  );
}
