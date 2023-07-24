import { gql } from "@apollo/client";

export const CREATE_SUBTASK = gql`
  mutation createSubTask($createSubTaskInput: CreateSubTaskInput!) {
    createSubTask(createSubTaskInput: $createSubTaskInput) {
      id
      title
    }
  }
`;
