// import React, { useCallback, useState } from "react";
// import { Connection, clusterApiUrl } from "@solana/web3.js";
// import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
// import { useWallet } from "@solana/wallet-adapter-react";
// import {
//   WalletModalProvider,
//   WalletMultiButton,
// } from "@solana/wallet-adapter-react-ui";
// import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
// import {
//   ConnectionProvider,
//   WalletProvider,
// } from "@solana/wallet-adapter-react";
// import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
// import "@solana/wallet-adapter-react-ui/styles.css";
// import "./App.css";

// const App = () => {
//   const wallet = useWallet();
//   const [mintedData, setMintedData] = useState(null);
//   const [isMinting, setIsMinting] = useState(false);

//   const handleMint = useCallback(async () => {
//     if (!wallet.connected || !wallet.publicKey) {
//       return alert("Connect wallet first");
//     }

//     setIsMinting(true);
//     // const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
//     // const connection = new Connection(clusterApiUrl("mainnet-beta"), "finalized");

//     // const connection = new Connection("https://alpha-tame-dinghy.solana-devnet.quiknode.pro/24f6b6225e2dee000e1a6e7f1afecbba8980decb/", "finalized");

//     const connection = new Connection("https://devnet.helius-rpc.com/?api-key=9c13c71d-3088-4fc4-bc03-7c7a270b0bcd", "confirmed");
//     // const connection = new Connection("https://mainnet.helius-rpc.com/?api-key=9c13c71d-3088-4fc4-bc03-7c7a270b0bcd", "confirmed");
//     const metaplex = Metaplex.make(connection).use(
//       walletAdapterIdentity(wallet)
//     );

//     try {
//       const { nft } = await metaplex.nfts().create({
//         uri: "https://gateway.pinata.cloud/ipfs/bafkreiaqw52kv3rbs6gkqb27wpz3ga3qmmvfjkskbjzpmiyrrgmjklqkku",
//         name: "My Client NFT",
//         sellerFeeBasisPoints: 500,
//       });

//       console.log("Minted NFT:", nft);
//       setMintedData(nft);

//       // Save to localStorage
//       const existing = JSON.parse(localStorage.getItem("mintedNFTs") || "[]");
//       const newList = [
//         ...existing,
//         {
//           name: nft.name,
//           address: nft.address.toBase58(),
//           image: nft.json?.image,
//           timestamp: new Date().toISOString(),
//         },
//       ];
//       localStorage.setItem("mintedNFTs", JSON.stringify(newList));
//     } catch (e) {
//       console.error("Mint failed:", e);
//       alert("Error minting NFT");
//     } finally {
//       setIsMinting(false);
//     }
//   }, [wallet]);

//   return (
//     <div className="app-container">
//       <div className="content-box">
//         <WalletMultiButton />
//         <button
//           onClick={handleMint}
//           disabled={!wallet.connected || isMinting}
//           className={`mint-button ${isMinting ? "disabled" : ""}`}
//         >
//           {isMinting ? "Minting..." : "Mint NFT"}
//         </button>

//         {mintedData && (
//           <div className="mint-result">
//             <p className="success">✅ NFT minted successfully!</p>
//             <p>
//               <strong>Mint Address:</strong>{" "}
//               <a
//                 href={`https://explorer.solana.com/address/${mintedData.address.toBase58()}?cluster=devnet`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 {mintedData.address.toBase58()}
//               </a>
//             </p>
//             <img
//               src={mintedData.json?.image}
//               alt={mintedData.name}
//               className="nft-image"
//             />
//           </div>
//         )}

//         {typeof window !== "undefined" && (
//           <div className="mint-history">
//             <h3>Mint History</h3>
//             {JSON.parse(localStorage.getItem("mintedNFTs") || "[]").map(
//               (nft, idx) => (
//                 <div key={idx}>
//                   <p>
//                     <strong>#{idx + 1}</strong> -{" "}
//                     <a
//                       href={`https://explorer.solana.com/address/${nft.address}?cluster=devnet`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       {nft.address}
//                     </a>
//                   </p>
//                   {nft.image && (
//                     <img src={nft.image} alt="Minted NFT" width="120" />
//                   )}
//                 </div>
//               )
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const ContextProvider = ({ children }) => {
//   const network = WalletAdapterNetwork.Devnet;
//   const wallets = [new PhantomWalletAdapter()];

//   return (
//     <ConnectionProvider endpoint={clusterApiUrl(network)}>
//       <WalletProvider wallets={wallets} autoConnect>
//         <WalletModalProvider>{children}</WalletModalProvider>
//       </WalletProvider>
//     </ConnectionProvider>
//   );
// };

// const RootApp = () => (
//   <ContextProvider>
//     <App />
//   </ContextProvider>
// );

// export default RootApp;


// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { Connection } from "@solana/web3.js";
// import { Nft } from '@metaplex-foundation/js';
// import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
// import { useWallet } from "@solana/wallet-adapter-react";
// import {
//   WalletModalProvider,
//   WalletMultiButton,
// } from "@solana/wallet-adapter-react-ui";
// import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
// import {
//   ConnectionProvider,
//   WalletProvider,
// } from "@solana/wallet-adapter-react";
// import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
// import "@solana/wallet-adapter-react-ui/styles.css";
// import "./App.css";

// // const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
// // const connection = new Connection(clusterApiUrl("mainnet-beta"), "finalized");
// // const connection = new Connection("https://alpha-tame-dinghy.solana-devnet.quiknode.pro/...", "finalized");
// const NETWORK = "https://devnet.helius-rpc.com/?api-key=9c13c71d-3088-4fc4-bc03-7c7a270b0bcd";
// // const NETWORK = "https://mainnet.helius-rpc.com/?api-key=9c13c71d-3088-4fc4-bc03-7c7a270b0bcd"
// const connection = new Connection(NETWORK, "confirmed");

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

//     if (wallet.connected) {
//       addLog(`✅ Connected to ${wallet.publicKey?.toBase58()}`);
//     }

//     return () => {
//       if (wallet.disconnecting) {
//         addLog("⚠️ Disconnecting...");
//       }
//     };
//   }, [wallet.connected, wallet.disconnecting, wallet.publicKey]);

//   const handleMint = useCallback(async () => {
//     if (!wallet.connected || !wallet.publicKey) {
//       alert("Connect wallet first");
//       return;
//     }

//     try {
//       setIsMinting(true);
//       addLog("🧪 Starting minting process...");

//       const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));

//       const { nft } = await metaplex.nfts().create({
//         uri: "https://gateway.pinata.cloud/ipfs/bafkreiaqw52kv3rbs6gkqb27wpz3ga3qmmvfjkskbjzpmiyrrgmjklqkku", // replace with actual URI
//         name: "My Awesome NFT",
//         sellerFeeBasisPoints: 1,
//       });

//       setMintedData(nft);
//       addLog(`🎉 Minted NFT: ${nft.address.toBase58()}`);
//     } catch (err: any) {
//       addLog(`❌ Mint failed: ${err.message}`);
//     } finally {
//       setIsMinting(false);
//     }
//   }, [wallet, addLog]);

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
//   const network = WalletAdapterNetwork.Devnet;

//   const endpoint = useMemo(() => NETWORK, []);
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

// import React, { useCallback, useEffect, useState, useMemo } from "react";
// import { Connection, Transaction } from "@solana/web3.js";
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

// // Setup Connection
// const NETWORK = "https://devnet.helius-rpc.com/?api-key=9c13c71d-3088-4fc4-bc03-7c7a270b0bcd";
// const connection = new Connection(NETWORK, "confirmed");

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

//   const handleMint = useCallback(async () => {
//     if (!wallet || !wallet.connected || !wallet.publicKey) {
//       alert("Connect wallet first");
//       return;
//     }

//     try {
//       setIsMinting(true);
//       addLog("🧪 Starting minting process...");

//       const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));

//       // Create mint transaction
//       const { nft, transaction } = await metaplex.nfts().create({
//         uri: "https://gateway.pinata.cloud/ipfs/bafkreiaqw52kv3rbs6gkqb27wpz3ga3qmmvfjkskbjzpmiyrrgmjklqkku", // replace with actual URI
//         name: "My Awesome NFT",
//         sellerFeeBasisPoints: 1,
//       });

//       addLog(`🎉 Minted NFT: ${nft.address.toBase58()}`);

//       // Sign and send the transaction
//       addLog(`🔏 Signing and sending transaction...`);
//       const signature = await signAndSendTransaction(wallet, transaction);
//       addLog(`🎉 Transaction sent: ${signature}`);

//       // Poll for transaction status
//       pollSignatureStatus(signature, connection, addLog);

//       setMintedData(nft);
//     } catch (err: any) {
//       addLog(`❌ Mint failed: ${err.message}`);
//     } finally {
//       setIsMinting(false);
//     }
//   }, [wallet, addLog]);

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

// // Sign and send the transaction function (adapted from your reference)
// const signAndSendTransaction = async (wallet: any, transaction: Transaction) => {
//   try {
//     const { signature } = await wallet.signAndSendTransaction(transaction);
//     return signature;
//   } catch (error) {
//     throw new Error(`Transaction failed: ${error.message}`);
//   }
// };

// // Poll signature status
// const pollSignatureStatus = async (signature: string, connection: Connection, addLog: (message: string) => void) => {
//   const status = await connection.getSignatureStatus(signature);
//   if (status?.confirmations) {
//     addLog(`✅ Transaction confirmed with ${status.confirmations} confirmations.`);
//   } else {
//     addLog(`⚠️ Transaction pending...`);
//   }
// };

// // Setup Providers
// const AppWithProviders = () => {
//   const network = "devnet"; // or "mainnet-beta" based on your environment
//   const endpoint = useMemo(() => NETWORK, []);
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
import { useWallet } from "@solana/wallet-adapter-react";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./App.css";
import { toBigNumber } from "@metaplex-foundation/js";

// Setup Connection
// const NETWORK = "https://devnet.helius-rpc.com/?api-key=9c13c71d-3088-4fc4-bc03-7c7a270b0bcd";
const NETWORK = "https://mainnet.helius-rpc.com/?api-key=9c13c71d-3088-4fc4-bc03-7c7a270b0bcd"

const connection = new Connection(NETWORK, "confirmed");

const App = () => {
  const wallet = useWallet();
  const [logs, setLogs] = useState<string[]>([]);
  const [mintedData, setMintedData] = useState<Nft | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [...prev, message]);
  }, []);

  useEffect(() => {
    if (!wallet) return;

    // Ensure wallet is connected before accessing publicKey
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

  // const handleMint = useCallback(async () => {
  //   if (!wallet || !wallet.connected || !wallet.publicKey) {
  //     alert("Connect wallet first");
  //     return;
  //   }
  
  //   try {
  //     setIsMinting(true);
  //     addLog("🧪 Starting minting process...");
  
  //     const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));
  
  //     // Get transaction builder for NFT creation (DO NOT auto-send)
  //     const builder = await metaplex.nfts().builders().create({
  //       uri: "https://gateway.pinata.cloud/ipfs/bafkreiaqw52kv3rbs6gkqb27wpz3ga3qmmvfjkskbjzpmiyrrgmjklqkku",
  //       name: "My Awesome NFT",
  //       sellerFeeBasisPoints: 1,
  //     });      

  //     const blockhash = await connection.getLatestBlockhash();

  
  //     // Build unsigned transaction
  //     // const transaction = await builder.toTransaction(blockhash);
  
  //     const transaction = new Transaction();

  //     // ⚠️ Ensure blockhash and fee payer are set
  //     transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  //     transaction.feePayer = wallet.publicKey;
  
  //     addLog("🔏 Signing and sending transaction with Phantom...");
  
  //     // ✅ Use Phantom's signAndSendTransaction API
  //     const provider = window.solana; // Phantom injects `window.solana`
  //     const { signature } = await provider.signAndSendTransaction(transaction);
  
  //     addLog(`📨 Sent: ${signature}`);
  
  //     // Optionally confirm
  //     const confirmation = await connection.confirmTransaction(signature, "confirmed");
  //     addLog("✅ Transaction confirmed!");
  
  //   } catch (err: any) {
  //     addLog(`❌ Mint failed: ${err.message}`);
  //   } finally {
  //     setIsMinting(false);
  //   }
  // }, [wallet, addLog]);
  

  const handleMint = useCallback(async () => {
    if (!wallet || !wallet.connected || !wallet.publicKey) {
      alert("Connect wallet first");
      return;
    }
  
    try {
      setIsMinting(true);
      addLog("🧪 Starting direct minting process...");
  
      const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));
  
      // Mint the NFT and specify the wallet as the destination
      const { nft, response } = await metaplex.nfts().create({
        // uri: "https://gateway.pinata.cloud/ipfs/bafkreiaqw52kv3rbs6gkqb27wpz3ga3qmmvfjkskbjzpmiyrrgmjklqkku",
        uri: "https://gateway.pinata.cloud/ipfs/bafkreifucojuzovkrkyidyhxkhyw2sweysgfcl27qi72yv5b2wdbb442s4",
        name: "cuckg",
        sellerFeeBasisPoints: 500,
        maxSupply: toBigNumber(1),
        updateAuthority: metaplex.identity(),
        mintAuthority: metaplex.identity(),
        tokenStandard: TokenStandard.NonFungible,
      });

      console.log("Mint Authority:", metaplex.identity().publicKey.toBase58());
      console.log("Update Authority:", metaplex.identity().publicKey.toBase58());
      console.log("Destination Wallet:", wallet.publicKey.toBase58());
  
      addLog("📨 Transaction sent...");
      addLog(`🖼️ NFT Minted: ${nft.address.toBase58()}`);
      setMintedData(nft);
  
      // Optionally confirm the transaction
      const confirmation = await connection.confirmTransaction(response.signature, "confirmed");
      if (confirmation.value.err) {
        throw new Error("Transaction failed");
      }
  
      addLog("✅ NFT mint confirmed!");
  
    } catch (err: any) {
      addLog(`❌ Mint failed: ${err.message}`);
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
          <p>Mint Address: {mintedData.address.toBase58()}</p>
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

// Sign and send the transaction function (using Phantom's signTransaction and sendTransaction methods)
const signAndSendTransaction = async (wallet: any, transaction: Transaction) => {
  try {
    // Phantom wallet has its own signTransaction and sendTransaction methods
    const signedTransaction = await wallet.signTransaction(transaction);

    // Send the signed transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());

    // Return the signature of the sent transaction
    return signature;
  } catch (error) {
    throw new Error(`Transaction failed: ${error.message}`);
  }
};

// Poll signature status
const pollSignatureStatus = async (signature: string, connection: Connection, addLog: (message: string) => void) => {
  const status = await connection.getSignatureStatus(signature);
  if (status.value?.confirmations) {
    addLog(`✅ Transaction confirmed with ${status.value?.confirmations || 0} confirmations.`);
  } else {
    addLog(`⚠️ Transaction pending...`);
  }
};

// Setup Providers
const AppWithProviders = () => {
  const network = "devnet"; // or "mainnet-beta" based on your environment
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
