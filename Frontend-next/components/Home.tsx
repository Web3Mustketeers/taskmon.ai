import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddEditBoardModal from "@modals/AddEditBoardModal";
import Column from "./Column";
import EmptyBoard from "./EmptyBoard";
import Sidebar from "./Sidebar";
import { RootState } from "@redux/store";
import useWindowSize from "@hooks/useWindowSize";
import { IBoard, IColumn } from "interfaces";
import { GET_BOARDS } from "queries/BoardQueries";
import { useQuery } from "@apollo/client";
import boardsSlice from "@redux/boardsSlice";

import LoadingModal from "@modals/LoadingModal";


function Home() {
  const size = useWindowSize();
  const dispatch = useDispatch();

  const [windowSize, setWindowSize] = useState<number[]>([]);

  useEffect(() => {
    if (size) {
      setWindowSize([size.width, size.height]);
    }
  }, [size]);

  useEffect(() => {
    if (typeof window == "undefined") return;

    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);

  const boards: IBoard[] = useSelector(
    (state: RootState) => state.boards.boardsList
  );
  const selectedBoard: IBoard | undefined = useSelector(
    (state: RootState) => state.boards.selectedBoard
  );

  //@ts-ignore
  const columns: IColumn[] | [] = selectedBoard ? selectedBoard.columns : [];

  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  return (
    <div
      className={
        windowSize && windowSize[0] >= 768 && isSideBarOpen
          ? " bg-[#f4f7fd]  scrollbar-hide h-screen flex dark:bg-[#20212c]  overflow-x-scroll gap-6  ml-[261px] relative"
          : "bg-[#f4f7fd]  scrollbar-hide h-screen flex    dark:bg-[#20212c] overflow-x-scroll gap-6 relative"
      }
    >
      {windowSize && windowSize[0] >= 768 && (
        <Sidebar
          // setIsBoardModalOpen={setIsBoardModalOpen}
          // isBoardModalOpen={isBoardModalOpen}
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />
      )}

      {/* Columns Section */}

      {columns.length > 0 ? (
        <>
          {columns?.map((col, index) => (
            <Column key={index} colIndex={index} column={col} />
          ))}
          <div
            onClick={() => {
              setIsBoardModalOpen(true);
            }}
            className=" h-screen dark:bg-[#2b2c3740] flex justify-center items-center font-bold text-2xl hover:text-[#635FC7] transition duration-300 cursor-pointer bg-[#E9EFFA] scrollbar-hide mb-2   mx-5 pt-[90px] min-w-[280px] text-[#828FA3] mt-[135px] rounded-lg "
          >
            + New Column
          </div>
        </>
      ) : (
        <>
          <EmptyBoard type="edit" />
        </>
      )}
      {isBoardModalOpen && (
        <AddEditBoardModal
          type="edit"
          setIsBoardModalOpen={setIsBoardModalOpen}
        />
      )}

      {/* {isLoadingModalOpen && (
        <LoadingModal setIsLoadingModalOpen={setIsLoadingModalOpen} />
      )} */}

    </div>
  );
}

export default Home;
