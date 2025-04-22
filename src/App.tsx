// import React, { useCallback, useEffect, useState, useMemo } from "react";
// import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
// import { Nft } from "@metaplex-foundation/js";
// import { useWallet } from "@solana/wallet-adapter-react";
// import {
//   WalletModalProvider,
//   WalletMultiButton,
// } from "@solana/wallet-adapter-react-ui";
// import {
//   ConnectionProvider,
//   WalletProvider,
// } from "@solana/wallet-adapter-react";
// import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
// import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
// import "@solana/wallet-adapter-react-ui/styles.css";
// import "./App.css";
// import { toBigNumber } from "@metaplex-foundation/js"; // Import toBigNumber
// import signAndSendTransaction from "./utils/signAndSendTransaction";
// import {
//   createMint,
//   getOrCreateAssociatedTokenAccount,
//   mintTo,
// } from "@solana/spl-token";
// import { Keypair } from "@solana/web3.js";
// import { PhantomProvider } from "./types";
// // Setup Connection
// // const NETWORK = "https://devnet.helius-rpc.com/?api-key=9c13c71d-3088-4fc4-bc03-7c7a270b0bcd";
// // const NETWORK = "https://api.devnet.solana.com";
// const NETWORK = "https://mainnet.helius-rpc.com/?api-key=9c13c71d-3088-4fc4-bc03-7c7a270b0bcd";
// const connection = new Connection(NETWORK, "finalized");

// const App = () => {
//   const wallet = useWallet();
//   const [logs, setLogs] = useState<string[]>([]);
//   const [mintedData, setMintedData] = useState<Nft | null>(null);
//   const [isMinting, setIsMinting] = useState(false);

//   const addLog = useCallback((message: string) => {
//     setLogs((prev) => [...prev, message]);
//   }, []);

//   useEffect(() => {
//     if (!wallet) return;

//     // Ensure wallet is connected before accessing publicKey
//     if (wallet.connected && wallet.publicKey) {
//       addLog(`✅ Connected to ${wallet.publicKey.toBase58()}`);
//     } else {
//       addLog("⚠️ Wallet not connected");
//     }

//     return () => {
//       if (wallet.disconnecting) {
//         addLog("⚠️ Disconnecting...");
//       }
//     };
//   }, [wallet, addLog]);

//   const handleMint = async () => {
//     try {
//       setIsMinting(true);
//       const metadataUri =
//         "https://gateway.pinata.cloud/ipfs/bafkreiaqw52kv3rbs6gkqb27wpz3ga3qmmvfjkskbjzpmiyrrgmjklqkku";

//       if (!wallet?.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
//         addLog("⚠️ Wallet not connected properly.");
//         return;
//       }

//       const userSigner = {
//         publicKey: wallet.publicKey,
//         signTransaction: wallet.signTransaction,
//         signAllTransactions: wallet.signAllTransactions,
//       };

//       const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));
//       addLog("⚙️ Minting NFT...");

//       console.log("mint authority", metaplex.identity().publicKey.toBase58());

//       const { nft } = await metaplex.nfts().create({
//         uri: metadataUri,
//         name: "Cool NFT",
//         symbol: "COOL",
//         sellerFeeBasisPoints: 0, // 0% royalties
//         maxSupply: toBigNumber(1),
//         updateAuthority: metaplex.identity(), 
//         mintAuthority: metaplex.identity(),
//       });

//       setMintedData(nft);
//       console.log("nft minted data", nft);
//       addLog(`✅ NFT minted! Mint address: ${nft.address.toBase58()}`);
//     } catch (error: any) {
//       console.error("❌ Mint failed:", error);
//       addLog(`❌ Mint failed: ${error.message}`);
//     } finally {
//       setIsMinting(false);
//     }
//   };


//   return (
//     <div className="app">
//       <WalletMultiButton />
//       <h1>Solana NFT Minter</h1>

//       <button onClick={handleMint} disabled={isMinting}>
//         {isMinting ? "Minting..." : "Mint NFT"}
//       </button>

//       {mintedData && (
//         <div>
//           <p>✅ NFT Minted!</p>
//           <p>Mint Address: {mintedData.address.toBase58()}</p>
//         </div>
//       )}

//       <div className="logs">
//         <h3>Logs</h3>
//         <ul>
//           {logs.map((log, idx) => (
//             <li key={idx}>{log}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// // Setup Providers
// const AppWithProviders = () => {
//   const network = "https://mainnet.helius-rpc.com/?api-key=9c13c71d-3088-4fc4-bc03-7c7a270b0bcd";
//   const endpoint = useMemo(() => network, []);
//   const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

//   return (
//     <ConnectionProvider endpoint={endpoint}>
//       <WalletProvider wallets={wallets} autoConnect>
//         <WalletModalProvider>
//           <App />
//         </WalletModalProvider>
//       </WalletProvider>
//     </ConnectionProvider>
//   );
// };

// export default AppWithProviders;

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Connection, Transaction } from "@solana/web3.js";
import { Nft } from "@metaplex-foundation/js";
import { ConnectionProvider, useWallet, WalletProvider } from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from "@solana/spl-token";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./App.css";
import {
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createNft } from "@metaplex-foundation/mpl-token-metadata";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import getProvider from "./utils/getProvider";
import { PhantomProvider } from "../types";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";

// Setup Connection
const NETWORK = "https://mainnet.helius-rpc.com/?api-key=9c13c71d-3088-4fc4-bc03-7c7a270b0bcd";
// const NETWORK = "https://devnet.helius-rpc.com/?api-key=9c13c71d-3088-4fc4-bc03-7c7a270b0bcd";
// const NETWORK = "https://api.devnet.solana.com/";
const connection = new Connection(NETWORK, "confirmed");

const App = () => {
  const wallet = useWallet();
  const [logs, setLogs] = useState<string[]>([]);
  const [mintedData, setMintedData] = useState<Nft | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  // Add logs for debugging
  const addLog = useCallback((message: string) => {
    setLogs((prev) => [...prev, message]);
  }, []);

  // Monitor wallet connection
  useEffect(() => {
    if (!wallet) return;

    if (wallet.connected && wallet.publicKey) {
      addLog(`✅ Connected to ${wallet.publicKey.toBase58()}`);
    } else {
      addLog("⚠️ Wallet not connected");
    }

    return () => {
      if (wallet.disconnecting) {
        addLog("⚠️ Disconnecting...");
      }
    };
  }, [wallet, addLog]);

  // Consolidated signAndSendTransaction function
  const signAndSendTransaction = async (provider: PhantomProvider, transaction: Transaction): Promise<string> => {
    try {
      const { signature } = await provider.signAndSendTransaction(transaction);
      return signature;
    } catch (error) {
      console.warn("Error in signAndSendTransaction:", error);
      throw new Error(error.message);
    }
  };

  // Helper function to prepare the NFT transfer transaction
  const prepareNftTransferTransaction = async (
    mintPublicKey: PublicKey,
    authorityPublicKey: PublicKey,
    userWallet: PublicKey
  ): Promise<Transaction> => {
    const transaction = new Transaction();

    const sourceTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      authorityPublicKey
    );

    const destinationTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      userWallet
    );

    const destAccountInfo = await connection.getAccountInfo(destinationTokenAccount);
    if (!destAccountInfo) {
      const ataInstruction = createAssociatedTokenAccountInstruction(
        userWallet, // payer
        destinationTokenAccount,
        userWallet,
        mintPublicKey
      );
      transaction.add(ataInstruction);
    }

    const transferInstruction = createTransferInstruction(
      sourceTokenAccount,
      destinationTokenAccount,
      authorityPublicKey,
      1,
      [],
      TOKEN_PROGRAM_ID
    );
    transaction.add(transferInstruction);

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = userWallet;

    return transaction;
  };

  // Refactored handleMint function
  const handleMint = useCallback(async () => {
    if (!wallet || !wallet.connected || !wallet.publicKey) {
      alert("Connect wallet first");
      return;
    }

    const provider = getProvider();
    if (!provider || !provider.signAndSendTransaction) {
      console.log("Phantom provider not found");
      return;
    }

    try {
      setIsMinting(true);
      addLog("🧪 Starting UMI-based minting...");

      const umi = createUmi(NETWORK)
        .use(walletAdapterIdentity(wallet))
        .use(mplTokenMetadata());

      const mint = generateSigner(umi);

      const nftUri = "https://gateway.pinata.cloud/ipfs/bafkreiaqw52kv3rbs6gkqb27wpz3ga3qmmvfjkskbjzpmiyrrgmjklqkku";

      await createNft(umi, {
        mint,
        name: "My Awesome NFT",
        uri: nftUri,
        sellerFeeBasisPoints: percentAmount(5),
        authority: umi.identity,
        updateAuthority: umi.identity,
      }).sendAndConfirm(umi);

      addLog("✅ NFT minted successfully with UMI");
      addLog(`🖼️ Mint Address: ${mint.publicKey.toString()}`);

      const userWallet = wallet.publicKey;
      const transaction = await prepareNftTransferTransaction(
        new PublicKey(mint.publicKey),
        new PublicKey(umi.identity.publicKey.toString()),
        userWallet
      );

      const signature = await signAndSendTransaction(provider, transaction);
      await connection.confirmTransaction(signature, "confirmed");

      addLog(`🎉 NFT transferred to ${userWallet.toBase58()}`);
      setMintedData({ address: mint.publicKey } as any);
    } catch (err: any) {
      console.error(err);
      addLog(`❌ Mint or transfer failed: ${err.message}`);
    } finally {
      setIsMinting(false);
    }
  }, [wallet, addLog]);

  return (
    <div className="app">
      <WalletMultiButton />
      <h1>Solana NFT Minter</h1>

      <button onClick={handleMint} disabled={isMinting}>
        {isMinting ? "Minting..." : "Mint NFT"}
      </button>

      {mintedData && (
        <div>
          <p>✅ NFT Minted!</p>
          <p>Mint Address: {mintedData.address.toString()}</p>
        </div>
      )}

      <div className="logs">
        <h3>Logs</h3>
        <ul>
          {logs.map((log, idx) => (
            <li key={idx}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// // Setup Providers
const AppWithProviders = () => {
  const network = "mainnet-beta"; // or "mainnet-beta" based on your environment
  const endpoint = useMemo(() => NETWORK, []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default AppWithProviders;