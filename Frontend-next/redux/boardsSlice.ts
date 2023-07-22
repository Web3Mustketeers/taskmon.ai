import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import data from "../data.json";
import { IBoard, IColumn, ISubtask, ITask } from "../interfaces";

const initialState: {
  boardsList: IBoard[];
  selectedBoard: IBoard | undefined;
} = {
  boardsList: [],
  selectedBoard: undefined,
};

const boardsSlice = createSlice({
  name: "boards",
  initialState: initialState,
  reducers: {
    // addBoard: (state, action: PayloadAction<any>) => {
    //   //if other boards exist
    //   const isActive = state.length > 0 ? false : true;
    //   const payload = action.payload;
    //   const board: IBoard = {
    //     name: payload.name,
    //     isActive,
    //     columns: [],
    //   };
    //   board.columns = payload.newColumns;
    //   state.push(board);
    // },
    //reset: () => initialState,
    addBoardList: (state, action: PayloadAction<any>) => {
      const payload = action.payload;

      state.boardsList = payload;
    },
    //   editBoard: (state, action) => {
    //     const payload = action.payload;
    //     const board: IBoard | undefined = state.find((board) => board.isActive);
    //     if (board) {
    //       board.name = payload.name;
    //       board.columns = payload.newColumns;
    //     }
    //   },
    //   deleteBoard: (state) => {
    //     const board: IBoard | undefined = state.find((board) => board.isActive);
    //     if (board) state.splice(state.indexOf(board), 1);
    //   },
    setBoardActive: (state, action) => {
      state.selectedBoard = action.payload;
    },

    //   addTask: (state, action) => {
    //     const { title, status, description, subtasks, newColIndex } =
    //       action.payload;
    //     const task = { title, description, subtasks, status };
    //     const board: IBoard | undefined = state.find((board) => board.isActive);
    //     if (board) {
    //       const column: IColumn | undefined = board.columns.find(
    //         (col, index) => index === newColIndex
    //       );
    //       if (column) column.tasks.push(task);
    //     }
    //   },

    //   editTask: (state, action) => {
    //     const {
    //       title,
    //       status,
    //       description,
    //       subtasks,
    //       prevColIndex,
    //       newColIndex,
    //       taskIndex,
    //     } = action.payload;
    //     const board: IBoard | undefined = state.find((board) => board.isActive);
    //     if (board) {
    //       const column: IColumn | undefined = board.columns.find(
    //         (col, index) => index === prevColIndex
    //       );
    //       if (column) {
    //         const task: ITask | undefined = column.tasks.find(
    //           (task, index) => index === taskIndex
    //         );
    //         if (task) {
    //           task.title = title;
    //           task.status = status;
    //           task.description = description;
    //           task.subtasks = subtasks;
    //           if (prevColIndex === newColIndex) return;
    //           column.tasks = column.tasks.filter(
    //             (task, index) => index !== taskIndex
    //           );
    //           const newCol: IColumn | undefined = board.columns.find(
    //             (col, index) => index === newColIndex
    //           );
    //           if (newCol) {
    //             newCol.tasks.push(task);
    //           }
    //         }
    //       }
    //     }
    //   },

    //   dragTask: (state, action) => {
    //     const { colIndex, prevColIndex, taskIndex } = action.payload;
    //     const board: IBoard | undefined = state.find((board) => board.isActive);
    //     if (board) {
    //       const prevCol: IColumn | undefined = board.columns.find(
    //         (col, i) => i === prevColIndex
    //       );
    //       if (prevCol) {
    //         const task: ITask | undefined = prevCol.tasks.splice(taskIndex, 1)[0];
    //         //@ts-ignore
    //         board.columns.find((_col, i) => i === colIndex).tasks.push(task);
    //       }
    //     }
    //   },
    //   setSubtaskCompleted: (state, action) => {
    //     const payload = action.payload;
    //     const board: IBoard | undefined = state.find((board) => board.isActive);
    //     if (board) {
    //       const col: IColumn | undefined = board.columns.find(
    //         (col, i) => i === payload.colIndex
    //       );
    //       if (col) {
    //         const task: ITask | undefined = col.tasks.find(
    //           (task, i) => i === payload.taskIndex
    //         );
    //         if (task) {
    //           const subtask: ISubtask | undefined = task.subtasks.find(
    //             (subtask, i) => i === payload.index
    //           );
    //           if (subtask) subtask.isCompleted = !subtask.isCompleted;
    //         }
    //       }
    //     }
    //   },
    //   setTaskStatus: (state, action) => {
    //     const payload = action.payload;
    //     const board: IBoard | undefined = state.find((board) => board.isActive);
    //     if (board) {
    //       const columns = board.columns;
    //       const col: IColumn | undefined = columns.find(
    //         (col, i) => i === payload.colIndex
    //       );
    //       if (col) {
    //         if (payload.colIndex === payload.newColIndex) return;
    //         const task: ITask | undefined = col.tasks.find(
    //           (task, i) => i === payload.taskIndex
    //         );
    //         if (task) {
    //           task.status = payload.status;
    //           col.tasks = col.tasks.filter((task, i) => i !== payload.taskIndex);
    //           const newCol: IColumn | undefined = columns.find(
    //             (col, i) => i === payload.newColIndex
    //           );
    //           if (newCol) newCol.tasks.push(task);
    //         }
    //       }
    //     }
    //   },
    //   deleteTask: (state, action) => {
    //     const payload = action.payload;
    //     const board: IBoard | undefined = state.find((board) => board.isActive);
    //     if (board) {
    //       const col: IColumn | undefined = board.columns.find(
    //         (col, i) => i === payload.colIndex
    //       );
    //       if (col)
    //         col.tasks = col.tasks.filter((task, i) => i !== payload.taskIndex);
    //     }
    //   },
  },
});

export default boardsSlice;
