import { useState, useMemo } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import Header from '@components/Header'
import Home from '@components/Home'
import EmptyBoard from '@components/EmptyBoard'
import boardsSlice from '@redux/boardsSlice'
import { RootState } from '@redux/store'

import { SessionProvider } from 'next-auth/react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import type { AppProps } from 'next/app'

import '@solana/wallet-adapter-react-ui/styles.css'
//import './styles.css'

function App() {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false)
  const dispatch = useDispatch()
  const boards = useSelector((state: RootState) => state.boards)
  const activeBoard = boards.find((board) => board.isActive)

  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

  if (!activeBoard && boards.length > 0) dispatch(boardsSlice.actions.setBoardActive({ index: 0 }))
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SessionProvider refetchInterval={0}>
            <div className=" overflow-hidden  overflow-x-scroll">
              <>
                {boards.length > 0 ? (
                  <>
                    <Header setIsBoardModalOpen={setIsBoardModalOpen} isBoardModalOpen={isBoardModalOpen} />
                    {/* @ts-ignore */}
                    <Home setIsBoardModalOpen={setIsBoardModalOpen} isBoardModalOpen={isBoardModalOpen} />
                  </>
                ) : (
                  <>
                    <EmptyBoard type="add" />
                  </>
                )}
              </>
            </div>
          </SessionProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App
