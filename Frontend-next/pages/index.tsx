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

export default function IndexPage() {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const boards: IBoard[] = useSelector(
    (state: RootState) => state.boards.boardsList
  );
  const activeBoard: IBoard | {} | undefined = boards
    ? boards.find((board: IBoard) => board.isActive)
    : {};
  const [hasMounted, setHasMounted] = useState(false);
  const {
    data: boardData,
    loading: loadingboard,
    error: boardError,
  } = useQuery(GET_BOARDS);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!loadingboard && boardData) {
      dispatch(boardsSlice.actions.addBoardList(boardData.boards));
      dispatch(boardsSlice.actions.setBoardActive(boardData.boards[0]));
    }
  }, [loadingboard]);

  useEffect(() => {
    //if (!activeBoard && boards.length > 0)
    // dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));
  }, [boards]);

  if (!hasMounted) {
    return null;
  }
  return (
    <>
      <div className=" overflow-hidden  overflow-x-scroll relative">
        <>
          {boards.length > 0 ? (
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
          ) : (
            <>
              <EmptyBoard type="add" />
            </>
          )}
        </>
      </div>
    </>
  );
}
