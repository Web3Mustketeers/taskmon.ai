import { gql } from "@apollo/client";

export const CREATE_BOARD = gql`
  mutation createBoard($data: CreateBoardInput!) {
    createBoard(data: $data) {
      id
      name
    }
  }
`;

export const UPDATE_BOARD = gql`
  mutation updateBoard($id: Int!, $data: UpdateBoardInput!) {
    updateBoard(id: $id, data: $data) {
      id
      name
    }
  }
`;
export const DELETE_BOARD = gql`
  mutation deleteBoard($id: Int!) {
    deleteBoard(id: $id) {
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
