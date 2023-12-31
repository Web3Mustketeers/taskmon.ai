export interface IBoard {
  name: string;
  isActive: boolean;
  createdAt: string;
  id: number;
  updatedAt: string;
  walletId: number;
  __typename: string;
  columns: {
    name: string;
    isActive: boolean;
    createdAt: string;
    id: number;
    updatedAt: string;
    boardId: number;
    __typename: string;
    tasks: {
      id: number;
      title: string;
      description: string;
      status: string;
      subtasks: {
        id: number;
        taskId: number;
        title: string;
        isCompleted: boolean;
      }[];
    }[];
  }[];
}

export interface IColumn {
  name: string;
  isActive: boolean;
  createdAt: string;
  id: number;
  updatedAt: string;
  boardId: number;
  __typename: string;
  tasks: {
    id: number;
    title: string;
    description: string;
    status: string;
    subtasks: {
      id: number;
      taskId: number;
      title: string;
      isCompleted: boolean;
    }[];
  }[];
}

export interface ITask {
  title: string;
  description: string;
  status: string;
  subtasks: {
    title: string;
    isCompleted: boolean;
  }[];
}

export interface ISubtask {
  title: string;
  isCompleted: boolean;
  id?: number;
}
