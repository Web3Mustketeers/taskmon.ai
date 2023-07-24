import React from "react";
import { useDispatch, useSelector } from "react-redux";
import boardsSlice from "@redux/boardsSlice";
import { RootState } from "@redux/store";
import { IBoard } from "interfaces";

interface IProps {
  index: number;
  taskIndex: number;
  colIndex: number;
}

function Subtask({ index, taskIndex, colIndex }: IProps) {
  const dispatch = useDispatch();
  const boards = useSelector((state: RootState) => state.boards);
  const selectedBoard: IBoard | undefined = useSelector(
    (state: RootState) => state.boards.selectedBoard
  );
  const col = selectedBoard?.columns.find((col, i) => i === colIndex);
  const task = col?.tasks.find((task, i) => i === taskIndex);
  const subtask = task?.subtasks.find((subtask, i) => i === index);
  const checked = subtask?.isCompleted;

  const onChange = (e: any) => {
    //dispatch(boardsSlice.actions.setSubtaskCompleted({ index, taskIndex, colIndex }))
  };

  return (
    <div className=" w-full flex hover:bg-[#635fc740] dark:hover:bg-[#635fc740] rounded-md relative items-center justify-start dark:bg-[#20212c]  p-3 gap-4  bg-[#f4f7fd]">
      <input
        className=" w-4 h-4  accent-[#635fc7] cursor-pointer "
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <p className={`${checked ? " line-through opacity-30" : ""} `}>
        {subtask?.title}
      </p>
    </div>
  );
}

export default Subtask;