import { gql, useMutation } from "@apollo/client";

export const CREATE_COLUMN = gql`
  mutation ($name: String!, $boardId: Int!) {
    createColumn(name: $name, boardId: $boardId) {
      id
      name
    }
  }
`;
