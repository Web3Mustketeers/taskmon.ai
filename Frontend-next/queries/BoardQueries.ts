import { gql } from "@apollo/client";

export const CREATE_BOARD = gql`
  mutation createBoard($data: CreateBoardInput!) {
    createBoard(data: $data) {
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
