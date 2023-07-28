import { SessionProvider } from "next-auth/react";
import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import type { AppProps } from "next/app";

require("@solana/wallet-adapter-react-ui/styles.css");
import "./styles.css";
import { Provider } from "react-redux";
import store from "@redux/store";
import CustomHead from "@components/CustomHead";
import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";
// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({ Component, pageProps }: AppProps) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ApolloProvider client={client}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Provider store={store}>
              <CustomHead />
              <Component {...pageProps} />
            </Provider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ApolloProvider>
  );
}
