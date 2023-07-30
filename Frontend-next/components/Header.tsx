import React, { useEffect, useState } from "react";
import Logo from "@assets/logo-mobile.svg";

import Cookies from "universal-cookie";

import iconDown from "@assets/icon-chevron-down.svg";
import iconUp from "@assets/icon-chevron-up.svg";
import elipsis from "@assets/icon-vertical-ellipsis.svg";
import HeaderDropDown from "./HeaderDropDown";
import ElipsisMenu from "./ElipsisMenu";
import AddEditTaskModal from "@modals/AddEditTaskModal";
import AddEditBoardModal from "@modals/AddEditBoardModal";
import { useDispatch, useSelector } from "react-redux";
import DeleteModal from "@modals/DeleteModal";
import boardsSlice from "@redux/boardsSlice";
import { RootState } from "@redux/store";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { SigninMessage } from "../utils/SigninMessage";
import bs58 from "bs58";
import Image from "next/image";
import { DELETE_BOARD, GET_BOARDS } from "queries/BoardQueries";
import { useMutation } from "@apollo/client";
import client from "apollo-client";

interface IProps {
  setIsBoardModalOpen: (act: boolean) => void;
  isBoardModalOpen: boolean;
}

function Header({ setIsBoardModalOpen, isBoardModalOpen }: IProps) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState(false);
  const [boardType, setBoardType] = useState("add");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);


  const wallet = useWallet();
  const walletModal = useWalletModal();
  const dispatch = useDispatch();
  const { connection } = useConnection();
  const { publicKey } = useWallet();


  const boards = useSelector((state: RootState) => state.boards.boardsList);
  //@ts-ignore
  const selectedBoard: IBoard | undefined = useSelector(
    (state: RootState) => state.boards.selectedBoard
  );
  //@ts-ignore
  const isAuthenticated: IBoard | undefined = useSelector(
    (state: RootState) => state.boards.authenticated
  );

  const [
    deleteBoard,
    { data: boardData, loading: loadingBoard, error: boardError },
  ] = useMutation(DELETE_BOARD);

  const handleSignIn = async () => {
    try {
      if (!wallet.connected) {
        walletModal.setVisible(true);
      }

      

    } catch (error) {
      console.log(error);
    }
  };

  const login = async () => {
    let opts = {
      method: "POST",
      headers: {
        Accept: "application.json",
        //"Content-Type": "application/x-www-form-urlencoded",
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        wallet: publicKey?.toBase58(),
      }),
    };

    let res = await fetch(`https://taskmon.up.railway.app/auth/signin`, opts);
    let data = await res.json();
    const cookies = new Cookies();
    cookies.set("access_token", data.access_token, { path: "/" });
    dispatch(boardsSlice.actions.updateAuth({}));
  };

  useEffect(() => {
    if (!connection || !publicKey || isAuthenticated) return;

    login();
  }, [connection, publicKey]);

  useEffect(() => {
    if (wallet.connected) {

      handleSignIn();
    }
  }, [wallet.connected]);

  const onDropdownClick = () => {
    setOpenDropdown((state) => !state);
    setIsElipsisMenuOpen(false);
    setBoardType("add");
  };

  const setOpenEditModal = () => {
    setIsBoardModalOpen(true);
    setIsElipsisMenuOpen(false);
  };
  const setOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setIsElipsisMenuOpen(false);
  };

  const onDeleteBtnClick = async (e: any) => {
    if (e.target.textContent === "Delete") {

      setIsDeleteModalOpen(false);
      dispatch(boardsSlice.actions.updateLoading({ act: true }));

      deleteBoard({
        variables: {
          id: selectedBoard.id,
        },
      });


      await client.resetStore();
      await client.refetchQueries({
        include: [GET_BOARDS],
      });

      dispatch(boardsSlice.actions.updateLoading({ act: false }));

    } else {
      setIsDeleteModalOpen(false);
    }
  };
  const truncate = (
    text: string,
    startChars: number,
    endChars: number,
    maxLength: number
  ) => {
    if (text.length > maxLength) {
      var start = text.substring(0, startChars);
      var end = text.substring(text.length - endChars, text.length);
      while (start.length + end.length < maxLength) {
        start = start + ".";
      }
      return start + end;
    }
    return text;
  };


  return (
    <div className=" p-4 fixed left-0 bg-white dark:bg-[#2b2c37] z-20 right-0 ">
      <header className=" flex justify-between dark:text-white items-center  ">
        {/* Left Side  */}
        <div className=" flex items-center space-x-2  md:space-x-4">
          <Image src={Logo} alt=" Logo " className=" h-6 w-6" />
          <h3 className=" md:text-4xl  hidden md:inline-block font-bold  font-sans">
            TaskmonAi
          </h3>
          <div className=" flex items-center ">

            {!publicKey && (
              <button
                className=" border border-[#635fc7] text-[#635fc7] py-2 px-4 rounded-full text-lg font-semibold hover:opacity-80 duration-200 hidden md:block "
                onClick={handleSignIn}
              >
                Connect Wallet
              </button>
            )}
            {publicKey && (
              <button
                className=" border border-[#635fc7] text-[#635fc7] py-2 px-4 rounded-full text-lg font-semibold hover:opacity-80 duration-200 hidden md:block "
                onClick={handleSignIn}
              >
                {truncate(publicKey?.toBase58(), 5, 5, 15)}
              </button>
            )}

            <Image
              src={openDropdown ? iconUp : iconDown}
              alt=" dropdown icon"
              className=" w-3 ml-2 md:hidden"
              onClick={onDropdownClick}
            />
          </div>
        </div>

        {/* Right Side */}

        <div className=" flex space-x-4 items-center md:space-x-6 ">
          <button
            className=" button hidden md:block "
            onClick={() => {
              setIsTaskModalOpen((prevState) => !prevState);
            }}
            //onClick={handleSignIn}
          >
            + Add New Task
          </button>
          <button
            onClick={() => {
              setIsTaskModalOpen((prevState) => !prevState);
            }}
            className=" button py-1 px-3 md:hidden "
          >
            +
          </button>

          <Image
            onClick={() => {
              setBoardType("edit");
              setOpenDropdown(false);
              setIsElipsisMenuOpen((prevState) => !prevState);
            }}
            src={elipsis}
            alt="elipsis"
            className=" cursor-pointer h-6"
          />
          {isElipsisMenuOpen && (
            <ElipsisMenu
              type="Boards"
              setOpenEditModal={setOpenEditModal}
              setOpenDeleteModal={setOpenDeleteModal}
            />
          )}
        </div>

        {openDropdown && (
          <HeaderDropDown
            setOpenDropdown={setOpenDropdown}
            setIsBoardModalOpen={setIsBoardModalOpen}
          />
        )}
      </header>
      {isTaskModalOpen && (
        //  @ts-ignore
        <AddEditTaskModal
          setIsAddTaskModalOpen={setIsTaskModalOpen}
          type="add"
          device="mobile"
        />
      )}

      {isBoardModalOpen && (
        <AddEditBoardModal
          type={boardType}
          setIsBoardModalOpen={setIsBoardModalOpen}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          type="board"
          title={selectedBoard ? selectedBoard.name : ""}
          onDeleteBtnClick={onDeleteBtnClick}
        />
      )}
    </div>
  );
}

export default Header;
