import { shuffle } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import boardsSlice from "@redux/boardsSlice";
import Task from "./Task";
import { RootState } from "@redux/store";
import { IBoard, IColumn } from "../interfaces";
import { UPDATE_TASK } from "queries/TaskQueries";
import { useMutation } from "@apollo/client";

function Column({ colIndex, column }: { colIndex: number; column: IColumn }) {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-sky-500",
  ];

  const [
    updateTask,
    {
      data: updateTaskData,
      loading: loadingUpdateTask,
      error: updateTaskError,
    },
  ] = useMutation(UPDATE_TASK);

  const dispatch = useDispatch();
  const [color, setColor] = useState<string>();

  const boards: IBoard[] | undefined = useSelector(
    (state: RootState) => state.boards.boardsList
  );

  const board = boards?.find((board) => board.isActive === true);
  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [dispatch]);

  const handleOnDrop = (e: any) => {
    const { prevColIndex, taskIndex, task } = JSON.parse(
      e.dataTransfer.getData("text")
    );

    if (colIndex !== prevColIndex) {
      dispatch(
        boardsSlice.actions.dragTask({ colIndex, prevColIndex, taskIndex })
      );
      //update db

      updateTask({
        variables: {
          updateTaskInput: {
            id: task.id,
            title: task.title,
            columnId: column.id,
            description: task.description,
          },
        },
      });
    }
  };

  const handleOnDragOver = (e: any) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleOnDrop}
      onDragOver={handleOnDragOver}
      className="scrollbar-hide   mx-5 pt-[90px] min-w-[280px] "
    >
      <div className=" font-semibold flex  items-center  gap-2 tracking-widest md:tracking-[.2em] text-[#828fa3]">
        <div className={`rounded-full w-4 h-4 ${color} `} />
        {column?.name} ({column?.tasks?.length})
      </div>

      {column?.tasks?.map((task, index) => (
        <Task
          key={index}
          taskIndex={index}
          colIndex={colIndex}
          currTask={task}
        />
      ))}
    </div>
  );
}

export default Column;
