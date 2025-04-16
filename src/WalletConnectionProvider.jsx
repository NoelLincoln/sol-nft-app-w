import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

export const WalletConnectionProvider = ({ children }) => {
  // const network = 'devnet'; // Or 'mainnet-beta' / 'testnet'
  // const network = "https://devnet.helius-rpc.com/?api-key=9c13c71d-3088-4fc4-bc03-7c7a270b0bcd";
  // const network = "https://mainnet.helius-rpc.com/?api-key=9c13c71d-3088-4fc4-bc03-7c7a270b0bcd"
  const network = "https://api.mainnet-beta.solana.com";
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      // Add more wallets here if needed
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
