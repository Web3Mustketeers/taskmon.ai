import { gql } from "@apollo/client";

export const CREATE_COLUMN = gql`
  mutation createColumn($createColumnInput: CreateColumnInput!) {
    createColumn(createColumnInput: $createColumnInput) {
      id
      name
    }
  }
`;

export const UPDATE_COLUMN = gql`
  mutation updateColumn($updateColumnInput: UpdateColumnInput!) {
    updateColumn(updateColumnInput: $updateColumnInput) {
      id
      name
    }
  }
`;
