import { gql } from "@apollo/client";

export const CREATE_SUBTASK = gql`
  mutation createSubTask($createSubTaskInput: CreateSubTaskInput!) {
    createSubTask(createSubTaskInput: $createSubTaskInput) {
      id
      title
    }
  }
`;

export const UPDATE_SUBTASK = gql`
  mutation updateSubTask($updateSubTaskInput: UpdateSubTaskInput!) {
    updateSubTask(updateSubTaskInput: $updateSubTaskInput) {
      id
      title
    }
  }
`;

export const DELETE_SUBTASK = gql`
  mutation removeSubTask($id: Int!) {
    removeSubTask(id: $id) {
      id
    }
  }
`;
