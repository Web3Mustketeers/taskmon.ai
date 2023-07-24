import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import crossIcon from "@assets/icon-cross.svg";
import boardsSlice from "@redux/boardsSlice";
import { RootState } from "@redux/store";
import Image from "next/image";
import { IColumn, ISubtask, ITask } from "interfaces";
import { CREATE_TASK } from "queries/TaskQueries";
import { useMutation } from "@apollo/client";
import client from "apollo-client";
import { GET_BOARDS } from "queries/BoardQueries";
import { CREATE_SUBTASK } from "queries/SubTaskQueries";

interface IProps {
  type: string;
  device: string;
  setIsTaskModalOpen: (act: boolean) => void;
  setIsAddTaskModalOpen: (act: boolean) => void;
  taskIndex: number;
  prevColIndex: number;
}

function AddEditTaskModal({
  type,
  device,
  setIsTaskModalOpen,
  setIsAddTaskModalOpen,
  taskIndex,
  prevColIndex = 0,
}: IProps) {
  const dispatch = useDispatch();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isValid, setIsValid] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  //@ts-ignore
  const selectedBoard: IBoard | undefined = useSelector(
    (state: RootState) => state.boards.selectedBoard
  );

  const [
    createTask,
    { data: taskData, loading: loadingTask, error: taskError },
  ] = useMutation(CREATE_TASK);
  const [
    createSubTask,
    { data: subTaskData, loading: loadingSubTask, error: subTaskError },
  ] = useMutation(CREATE_SUBTASK);

  const columns = selectedBoard?.columns;
  const col = columns?.find(
    (col: IColumn, index: number) => index === prevColIndex
  );
  const task = col
    ? col.tasks.find((task: ITask, index: number) => index === taskIndex)
    : [];
  const [status, setStatus] = useState(
    columns ? columns[prevColIndex].name : ""
  );
  const [newColIndex, setNewColIndex] = useState(prevColIndex);
  const [subtasks, setSubtasks] = useState<ISubtask[]>([]);

  const onChangeSubtasks = (index: number, newValue: string) => {
    setSubtasks((prevState) => {
      const newState = [...prevState];
      const subtask = newState[index];
      if (subtask) subtask.title = newValue;
      return newState;
    });
  };

  const onChangeStatus = (e: any) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  };

  const validate = () => {
    setIsValid(false);
    if (!title.trim()) {
      return false;
    }
    for (let i = 0; i < subtasks.length; i++) {
      if (!subtasks[i].title.trim()) {
        return false;
      }
    }
    setIsValid(true);
    return true;
  };

  if (type === "edit" && isFirstLoad) {
    setSubtasks(
      // @ts-ignore
      task.subtasks.map((subtask) => {
        return { ...subtask, id: uuidv4() };
      })
    );
    //@ts-ignore
    setTitle(task.title);
    //@ts-ignore
    setDescription(task.description);
    setIsFirstLoad(false);
  }

  const onDelete = (index: number) => {
    setSubtasks((prevState) => prevState.filter((el, idx) => index == idx));
  };

  const onSubmit = (type: string) => {
    createTask({
      variables: {
        createTaskInput: {
          title,
          columnId: columns[newColIndex].id,
          description,
        },
      },
    });
  };

  const proceedToCreateSubTasks = async () => {
    const newSubTasks = subtasks ? subtasks : [];
    for (let index = 0; index < newSubTasks.length; index++) {
      const currSubTask = newSubTasks[index];

      const subTask = await createSubTask({
        variables: {
          createSubTaskInput: {
            title: currSubTask.title,
            taskId: taskData.createTask.id,
            isCompleted: currSubTask.isCompleted,
          },
        },
      });
    }

    setIsAddTaskModalOpen(false);
    await client.refetchQueries({
      include: [GET_BOARDS],
    });
  };

  useEffect(() => {
    if (!loadingTask && taskData) {
      proceedToCreateSubTasks();
    }
  }, [loadingTask, taskData, taskError]);

  return (
    <div
      className={
        device === "mobile"
          ? "  py-6 px-6 pb-40  absolute   left-0 flex  right-0 bottom-[-100vh] top-0 dropdown "
          : "  py-6 px-6 pb-40  absolute  left-0 flex  right-0 bottom-0 top-0 dropdown "
      }
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setIsAddTaskModalOpen(false);
      }}
    >
      {/* Modal Section */}

      <div
        className=" scrollbar-hide overflow-y-scroll  max-h-[95vh]  my-auto  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold
       shadow-md shadow-[#364e7e1a] max-w-md mx-auto  w-full px-8  py-8 rounded-xl"
      >
        <h3 className=" text-lg ">
          {type === "edit" ? "Edit" : "Add New"} Task
        </h3>

        {/* Task Name */}

        <div className="mt-8 flex flex-col space-y-1">
          <label className="  text-sm dark:text-white text-gray-500">
            Task Name
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="task-name-input"
            type="text"
            className=" bg-transparent  px-4 py-2 outline-none focus:border-0 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1  ring-0  "
            placeholder=" e.g Take coffee break"
          />
        </div>

        {/* Description */}
        <div className="mt-8 flex flex-col space-y-1">
          <label className="  text-sm dark:text-white text-gray-500">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="task-description-input"
            className=" bg-transparent outline-none min-h-[200px] focus:border-0 px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px] "
            placeholder="e.g. It's always good to take a break. This 
            15 minute break will  recharge the batteries 
            a little."
          />
        </div>

        {/* Subtasks */}

        <div className="mt-8 flex flex-col space-y-3">
          <label className="  text-sm dark:text-white text-gray-500">
            Subtasks
          </label>

          {subtasks.map((subtask, index) => (
            <div key={index} className=" flex items-center w-full ">
              <input
                onChange={(e) => {
                  onChangeSubtasks(index, e.target.value);
                }}
                type="text"
                value={subtask.title}
                className=" bg-transparent outline-none focus:border-0 flex-grow px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]  "
                placeholder=" e.g Take coffee break"
              />
              <Image
                src={crossIcon}
                alt="icon"
                onClick={() => {
                  onDelete(index);
                }}
                className=" m-4 cursor-pointer "
              />
            </div>
          ))}

          <button
            className=" w-full items-center dark:text-[#635fc7] dark:bg-white  text-white bg-[#635fc7] py-2 rounded-full "
            onClick={() => {
              setSubtasks((state) => [
                ...state,
                { title: "", isCompleted: false },
              ]);
            }}
          >
            + Add New Subtask
          </button>
        </div>

        {/* current Status  */}
        <div className="mt-8 flex flex-col space-y-3">
          <label className="  text-sm dark:text-white text-gray-500">
            Current Status
          </label>
          <select
            value={status}
            onChange={onChangeStatus}
            className=" select-status flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0  border-[1px] border-gray-300 focus:outline-[#635fc7] outline-none"
          >
            {columns?.map((column: IColumn, index: number) => (
              <option key={index}>{column.name}</option>
            ))}
          </select>
          <button
            onClick={() => {
              const isValid = validate();
              if (isValid) {
                onSubmit(type);

                type === "edit";
              }
            }}
            className=" w-full items-center text-white bg-[#635fc7] py-2 rounded-full "
          >
            {type === "edit" ? " save edit" : "Create task"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEditTaskModal;
