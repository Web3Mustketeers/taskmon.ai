import { gql, useMutation } from "@apollo/client";

export const CREATE_BOARD = gql`
  mutation CreateBoard($name: String!, $walletId: Int!) {
    createBoard(name: $name, walletId: $walletId) {
      id
      name
    }
  }
`;

export const GET_BOARDS = gql`
  query getBoards {
    boards {
      walletId
      updatedAt
      name
      isActive
      id
      columns {
        name
        id
        createdAt
        boardId
        updatedAt
        tasks {
          description
          columnId
          id
          title
          subtasks {
            isCompleted
            taskId
            title
          }
        }
        createdAt
      }
    }
  }
`;
