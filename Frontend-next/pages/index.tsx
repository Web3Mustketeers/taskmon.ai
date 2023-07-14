import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import boardsSlice from "@redux/boardsSlice";
import { RootState } from "@redux/store";
import Home from "@components/Home";
import EmptyBoard from "@components/EmptyBoard";
import Header from "@components/Header";
import Head from "next/head";

export default function IndexPage() {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const boards = useSelector((state: RootState) => state.boards);
  const activeBoard = boards.find((board) => board.isActive);

  if (!activeBoard && boards.length > 0)
    dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));
  return (
    <>
      <div className=" overflow-hidden  overflow-x-scroll">
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
