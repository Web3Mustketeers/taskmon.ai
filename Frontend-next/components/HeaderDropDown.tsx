import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "@headlessui/react";
import boardIcon from "@assets/icon-board.svg";
import useDarkMode from "@hooks/useDarkMode";
import darkIcon from "@assets/icon-dark-theme.svg";
import lightIcon from "@assets/icon-light-theme.svg";
import boardsSlice from "@redux/boardsSlice";
import { RootState } from "@redux/store";
import Image from "next/image";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { SigninMessage } from "../utils/SigninMessage";
import bs58 from "bs58";
import Cookies from "universal-cookie";

interface IProps {
  setOpenDropdown: (act: boolean) => void;
  setIsBoardModalOpen: (act: boolean) => void;
}

function HeaderDropDown({ setOpenDropdown, setIsBoardModalOpen }: IProps) {
  const dispatch = useDispatch();
  const [colorTheme, setTheme] = useDarkMode();
  const [darkSide, setDarkSide] = useState(
    colorTheme === "light" ? true : false
  );
  const { data: session, status } = useSession();
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  //@ts-ignore
  const isAuthenticated: IBoard | undefined = useSelector(
    (state: RootState) => state.boards.authenticated
  );

  const boards = useSelector((state: RootState) => state.boards.boardsList);
  //@ts-ignore
  const selectedBoard: IBoard | undefined = useSelector(
    (state: RootState) => state.boards.selectedBoard
  );

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

  const toggleDarkMode = (checked: boolean) => {
    //@ts-ignore
    setTheme(colorTheme);
    setDarkSide(checked);
  };

  return (
    <div
      className=" py-10 px-6 absolute  left-0 right-0 bottom-[-100vh] top-16 dropdown "
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setOpenDropdown(false);
      }}
    >
      {/* DropDown Modal */}

      <div className=" bg-white dark:bg-[#2b2c37] shadow-md shadow-[#364e7e1a]  w-full   py-4 rounded-xl">
        <h3 className=" dark:text-gray-300 text-gray-600 font-semibold mx-4 mb-8 ">
          ALL BOARDS ({boards?.length})
        </h3>

        <button
          className=" border border-[#635fc7] text-[#635fc7] py-2 px-4 rounded-full text-lg font-semibold hover:opacity-80 duration-200 hidden md:block "
          onClick={handleSignIn}
        >
          Connect Wallet
        </button>

        <div className=" dropdown-borad  ">
          {boards?.map((board, index) => (
            <div
              className={` flex items-baseline space-x-2 px-5 py-4  ${
                board.isActive &&
                " bg-[#635fc7] rounded-r-full text-white mr-8 "
              } `}
              key={index}
              onClick={() => {
                dispatch(boardsSlice.actions.setBoardActive({ index }));
              }}
            >
              <Image
                alt="icon"
                src={boardIcon}
                className="  filter-white  h-4 "
              />{" "}
              <p className=" text-lg font-bold  ">{board.name}</p>
            </div>
          ))}

          <div
            onClick={() => {
              setIsBoardModalOpen(true);
              setOpenDropdown(false);
            }}
            className=" flex items-baseline space-x-2  text-[#635fc7] px-5 py-4  "
          >
            <Image
              alt="icon"
              src={boardIcon}
              className="   filter-white  h-4 "
            />
            <p className=" text-lg font-bold  ">Create New Board </p>
          </div>

          <div className=" mx-2  p-4  space-x-2 bg-slate-100 dark:bg-[#20212c] flex justify-center items-center rounded-lg">
            <Image src={lightIcon} alt="sun indicating light mode" />

            <Switch
              checked={darkSide}
              onChange={toggleDarkMode}
              className={`${
                darkSide ? "bg-[#635fc7]" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Enable notifications</span>
              <span
                className={`${
                  darkSide ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>

            <Image src={darkIcon} alt="moon indicating dark mode" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderDropDown;
