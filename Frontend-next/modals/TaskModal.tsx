import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ElipsisMenu from "@components/ElipsisMenu";
import elipsis from "@assets/icon-vertical-ellipsis.svg";
import boardsSlice from "@redux/boardsSlice";
import Subtask from "@components/Subtask";
import AddEditTaskModal from "./AddEditTaskModal";
import DeleteModal from "./DeleteModal";
import { IBoard, IColumn, ISubtask, ITask } from "../interfaces";
import { RootState } from "@redux/store";
import Image from "next/image";
import client from "apollo-client";
import { GET_BOARDS } from "queries/BoardQueries";
import { useMutation } from "@apollo/client";
import { DELETE_TASK } from "queries/TaskQueries";
import { DELETE_SUBTASK } from "queries/SubTaskQueries";

interface IProp {
  taskIndex: number;
  colIndex: number;
  setIsTaskModalOpen: (action: boolean) => void;
}

function TaskModal({ taskIndex, colIndex, setIsTaskModalOpen }: IProp) {
  const [status, setStatus] = useState<boolean>();
  const [newColIndex, setNewColIndex] = useState<number>();
  //const [task, setTask] = useState<ITask>()
  // const [subtasks, setSubtasks] = useState<ISubtask[]>()
  //const [columns, setColumns] = useState<IColumn[]>()
  //const [completed, setCompleted] = useState(0)

  const dispatch = useDispatch();
  const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const boards = useSelector((state: RootState) => state.boards);
  const selectedBoard: IBoard | undefined = useSelector(
    (state: RootState) => state.boards.selectedBoard
  );

  const [
    deleteTask,
    {
      data: deleteTaskData,
      loading: loadingDeleteTask,
      error: deleteTaskError,
    },
  ] = useMutation(DELETE_TASK);

  const [
    deleteSubTask,
    {
      data: deleteSubTaskData,
      loading: loadingDeleteSubTask,
      error: deleteSubTaskError,
    },
  ] = useMutation(DELETE_SUBTASK);

  const columns = selectedBoard?.columns;
  // @ts-ignore
  const col = columns.find((col: IColumn, i: number) => i === colIndex);

  const task = col?.tasks.find((task: ITask, i: number) => i === taskIndex);

  const subtasks = task?.subtasks;

  let completed = 0;
  subtasks?.forEach((subtask: ISubtask) => {
    if (subtask.isCompleted) {
      completed++;
    }
  });

  useEffect(() => {
    setStatus(Boolean(task?.status));
  }, [task]);

  useEffect(() => {
    if (col) {
      setNewColIndex(columns?.indexOf(col));
    }
  }, [col]);

  const onChange = (e: any) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  };

  const onClose = (e: any) => {
    if (e.target !== e.currentTarget) {
      return;
    }

    setIsTaskModalOpen(false);
  };

  const proceedToDeleteSubTasks = async () => {
    const newSubTasks: ISubtask[] = subtasks ? subtasks : [];
    for (let index = 0; index < newSubTasks.length; index++) {
      const currSubTask = newSubTasks[index];

      const subTask = await deleteSubTask({
        variables: {
          id: currSubTask.id,
        },
      });
    }
    //await client.resetStore();
    await client.refetchQueries({
      include: [GET_BOARDS],
    });
   dispatch(boardsSlice.actions.updateLoading({ act: false }));

  };

  const onDeleteBtnClick = async (e: any) => {
    if (e.target.textContent === "Delete") {
     setIsDeleteModalOpen(false);
      setIsTaskModalOpen(false);
      dispatch(boardsSlice.actions.updateLoading({ act: true }));

      deleteTask({
        variables: {
          id: task?.id,
        },
      });
      proceedToDeleteSubTasks();
    } else {
      setIsDeleteModalOpen(false);
    }
  };

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const setOpenEditModal = () => {
    setIsAddTaskModalOpen(true);
    setIsElipsisMenuOpen(false);
  };

  const setOpenDeleteModal = () => {
    setIsElipsisMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  return (
    <div
      onClick={onClose}
      className=" fixed bg-red-400 w-full h-full right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide  z-50 left-0 bottom-0 justify-center items-center flex dropdown "
    >
      {/* MODAL SECTION */}

      <div className=" scrollbar-hide overflow-y-scroll max-h-[95vh]  my-auto  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto  w-full px-8  py-8 rounded-xl">
        <div className=" relative flex   justify-between w-full items-center">
          <h1 className=" text-lg">{task?.title}</h1>

          <Image
            onClick={() => {
              setIsElipsisMenuOpen((prevState) => !prevState);
            }}
            src={elipsis}
            alt="elipsis"
            className=" cursor-pointer h-6"
          />
          {isElipsisMenuOpen && (
            <ElipsisMenu
              setOpenEditModal={setOpenEditModal}
              setOpenDeleteModal={setOpenDeleteModal}
              type="Task"
            />
          )}
        </div>
        <p className=" text-gray-500 font-[600] tracking-wide text-xs pt-6">
          {task?.description}
        </p>

        <p className=" pt-6 text-gray-500 tracking-widest text-sm">
          Subtasks ({completed} of {subtasks?.length})
        </p>

        {/* subtasks section */}

        <div className=" mt-3 space-y-2">
          {subtasks?.map((subtask: ISubtask, index: number) => {
            return (
              <Subtask
                index={index}
                taskIndex={taskIndex}
                colIndex={colIndex}
                key={index}
              />
            );
          })}
        </div>

        {/* Current Status Section */}

        <div className="mt-8 flex flex-col space-y-3">
          <label className="  text-sm dark:text-white text-gray-500">
            Current Status
          </label>
          <select
            className=" select-status flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0  border-[1px] border-gray-300 focus:outline-[#635fc7] outline-none"
            value={String(status)}
            onChange={onChange}
          >
            {/* @ts-ignore */}
            {columns?.map((col: IColumn, index: number) => (
              <option className="status-options" key={index}>
                {col.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* @ts-ignore */}
      {isDeleteModalOpen && (
        // @ts-ignore
        <DeleteModal
          onDeleteBtnClick={onDeleteBtnClick}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          type="task"
          title={task ? task.title : ""}
        />
      )}

      {isAddTaskModalOpen && (
        // @ts-ignore
        <AddEditTaskModal
          setIsAddTaskModalOpen={setIsAddTaskModalOpen}
          setIsTaskModalOpen={setIsTaskModalOpen}
          type="edit"
          taskIndex={taskIndex}
          prevColIndex={colIndex}
        />
      )}
    </div>
  );
}

export default TaskModal;
