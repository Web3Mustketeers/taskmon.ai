import { gql } from "@apollo/client";

export const CREATE_TASK = gql`
  mutation createTask($createTaskInput: CreateTaskInput!) {
    createTask(createTaskInput: $createTaskInput) {
      id
      title
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation updateTask($updateTaskInput: UpdateTaskInput!) {
    updateTask(updateTaskInput: $updateTaskInput) {
      id
      title
    }
  }
`;
export const DELETE_TASK = gql`
  mutation removeTask($id: Int!) {
    removeTask(id: $id) {
      id
    }
  }
`;
