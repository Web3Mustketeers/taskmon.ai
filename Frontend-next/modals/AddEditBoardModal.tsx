import React, { useEffect, useState } from "react";
import crossIcon from "@assets/icon-cross.svg";
import boardsSlice from "@redux/boardsSlice";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { IBoard, IColumn, ITask } from "../interfaces";
import Image from "next/image";
import { gql, useMutation } from "@apollo/client";
import { CREATE_BOARD, GET_BOARDS, UPDATE_BOARD } from "queries/BoardQueries";
import { CREATE_COLUMN, UPDATE_COLUMN } from "queries/ColumnQueries";
import client from "apollo-client";
import { typeFromAST } from "graphql";

interface INewCol {
  name: string;
  tasks: ITask[] | [];
  id: string;
}

function AddEditBoardModal({
  setIsBoardModalOpen,
  type,
}: {
  setIsBoardModalOpen: (act: boolean) => void;
  type: string;
}) {
  const dispatch = useDispatch();
  const [
    createBoard,
    { data: boardData, loading: loadingBoard, error: boardError },
  ] = useMutation(CREATE_BOARD);
  const [
    updateBoard,
    {
      data: updateBoardData,
      loading: loadingUpdateBoard,
      error: updateBoardError,
    },
  ] = useMutation(UPDATE_BOARD);

  const [
    createColumn,
    { data: columnData, loading: loadingColumn, error: columnError },
  ] = useMutation(CREATE_COLUMN);
  const [
    updateColumn,
    {
      data: updateColumnData,
      loading: loadingUpdateColumn,
      error: updateColumnError,
    },
  ] = useMutation(UPDATE_COLUMN);

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [name, setName] = useState<string | undefined>("");
  const [newColumns, setNewColumns] = useState<INewCol[] | undefined>([]);
  const [isValid, setIsValid] = useState(true);
  //@ts-ignore
  const selectedBoard: IBoard | undefined = useSelector(
    (state: RootState) => state.boards.selectedBoard
  );

  if (type === "edit" && isFirstLoad) {
    //console.log(selectedBoard?.columns);
    setNewColumns(
      //@ts-ignore
      selectedBoard?.columns
    );
    setName(selectedBoard?.name);
    setIsFirstLoad(false);
  }

  const validate = () => {
    setIsValid(false);
    if (!name?.trim()) {
      return false;
    }
    if (newColumns) {
      for (let i = 0; i < newColumns?.length; i++) {
        if (!newColumns[i]?.name.trim()) {
          return false;
        }
      }
    }
    setIsValid(true);
    return true;
  };

  const onChange = (id: number, newValue: string) => {
    setNewColumns((prevState) => {
      let newState = prevState ? [...prevState] : [];
      const column = { ...newState[id] };
      if (column) column.name = newValue;
      newState[id] = column;
      return newState;
    });
  };
  // const onChange = (id: string, newValue: string) => {
  //   setNewColumns((prevState) => {
  //     const newState = prevState ? [...prevState] : [];
  //     const column = newState.find((col: INewCol) => col.id === id);
  //     if (column) column.name = newValue;
  //     return newState;
  //   });
  // };

  const onDelete = (id: string) => {
    setNewColumns((prevState) =>
      prevState?.filter((el: INewCol) => el.id !== id)
    );
  };

  const onSubmit = (type: string) => {
    if (type === "add") {
      createBoard({
        variables: {
          data: {
            name,
            walletId: 1,
            isActive: false,
          },
        },
      });
    } else {
      updateBoard({
        variables: {
          id: selectedBoard?.id,
          data: {
            name,
            isActive: false,
          },
        },
      });
    }
  };

  const proceedToCreateColumn = async () => {
    const newColumnArr = newColumns ? newColumns : [];
    for (let index = 0; index < newColumnArr.length; index++) {
      const column = newColumnArr[index];

      const columnAction = await createColumn({
        variables: {
          createColumnInput: {
            name: column.name,
            boardId: boardData.createBoard.id,
          },
        },
      });
    }
    setNewColumns(undefined);
    setIsBoardModalOpen(false);
    await client.refetchQueries({
      include: [GET_BOARDS],
    });
  };

  const proceedToUpdateColumn = async () => {
    const newColumnArr = newColumns ? newColumns : [];
    for (let index = 0; index < newColumnArr.length; index++) {
      const column = newColumnArr[index];

      const columnAction = await updateColumn({
        variables: {
          updateColumnInput: {
            id: Number(column.id),
            name: column.name,
          },
        },
      });
    }
    setNewColumns(undefined);
    setIsBoardModalOpen(false);
    await client.refetchQueries({
      include: [GET_BOARDS],
    });
  };

  useEffect(() => {
    if (!loadingBoard && boardData && newColumns && type === "add") {
      proceedToCreateColumn();
    }
  }, [loadingBoard]);

  useEffect(() => {
    if (!loadingUpdateBoard && updateBoardData && type != "add") {
      proceedToUpdateColumn();
    }
  }, [loadingUpdateBoard]);

  return (
    <div
      className="  fixed right-0 top-0  scrollbar-hide  z-50 left-0 bottom-0 justify-center items-center flex dropdown  "
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setIsBoardModalOpen(false);
      }}
    >
      <div
        className=" scrollbar-hide overflow-y-scroll max-h-[95vh]   bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold
       shadow-md shadow-[#364e7e1a] max-w-md mx-auto my-auto w-full px-8  py-8 rounded-xl"
      >
        <h3 className=" text-lg ">
          {type === "edit" ? "Edit" : "Add New"} Board
        </h3>

        {/* Task Name */}

        <div className="mt-8 flex flex-col space-y-1">
          <label className="  text-sm dark:text-white text-gray-500">
            Board Name
          </label>
          <input
            className=" bg-transparent  px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1  ring-0  "
            placeholder=" e.g Web Design"
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="board-name-input"
          />
        </div>

        {/* Board Columns */}

        <div className="mt-8 flex flex-col space-y-3">
          <label className=" text-sm dark:text-white text-gray-500">
            Board Columns
          </label>

          {newColumns?.map((column, index) => (
            <div key={index} className=" flex items-center w-full ">
              <input
                className=" bg-transparent flex-grow px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]  "
                onChange={(e) => {
                  onChange(index, e.target.value);
                }}
                type="text"
                value={column.name}
              />
              <Image
                src={crossIcon}
                alt="icon"
                onClick={() => {
                  onDelete(column.id);
                }}
                className=" m-4 cursor-pointer "
              />
            </div>
          ))}
          <div>
            {type == "add" && (
              <button
                className=" w-full items-center hover:opacity-70 dark:text-[#635fc7] dark:bg-white  text-white bg-[#635fc7] py-2 rounded-full "
                onClick={() => {
                  setNewColumns((state) => [
                    // @ts-ignore
                    ...state,
                    { name: "", tasks: [] },
                  ]);
                }}
              >
                + Add New Column
              </button>
            )}
            <button
              onClick={() => {
                const isValid = validate();
                if (isValid === true) onSubmit(type);
              }}
              className=" w-full items-center hover:opacity-70 dark:text-white dark:bg-[#635fc7] mt-8 relative  text-white bg-[#635fc7] py-2 rounded-full"
            >
              {type === "add" ? "Create New Board" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEditBoardModal;
