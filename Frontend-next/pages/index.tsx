import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import boardsSlice from "@redux/boardsSlice";
import { RootState } from "@redux/store";
import Home from "@components/Home";
import EmptyBoard from "@components/EmptyBoard";
import Header from "@components/Header";

export default function IndexPage() {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const boards = useSelector((state: RootState) => state.boards);
  const activeBoard = boards.find((board) => board.isActive);
  const [hasMounted, setHasMounted] = useState(false);

  if (!activeBoard && boards.length > 0)
    dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
