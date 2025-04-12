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


import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Connection } from "@solana/web3.js";
import { Nft } from '@metaplex-foundation/js';
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./App.css";

// const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
// const connection = new Connection(clusterApiUrl("mainnet-beta"), "finalized");
// const connection = new Connection("https://alpha-tame-dinghy.solana-devnet.quiknode.pro/...", "finalized");
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

    if (wallet.connected) {
      addLog(`✅ Connected to ${wallet.publicKey?.toBase58()}`);
    }

    return () => {
      if (wallet.disconnecting) {
        addLog("⚠️ Disconnecting...");
      }
    };
  }, [wallet.connected, wallet.disconnecting, wallet.publicKey]);

  const handleMint = useCallback(async () => {
    if (!wallet.connected || !wallet.publicKey) {
      alert("Connect wallet first");
      return;
    }

    try {
      setIsMinting(true);
      addLog("🧪 Starting minting process...");

      const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));

      const { nft } = await metaplex.nfts().create({
        uri: "https://gateway.pinata.cloud/ipfs/bafkreiaqw52kv3rbs6gkqb27wpz3ga3qmmvfjkskbjzpmiyrrgmjklqkku", // replace with actual URI
        name: "My Awesome NFT",
        sellerFeeBasisPoints: 1,
      });

      setMintedData(nft);
      addLog(`🎉 Minted NFT: ${nft.address.toBase58()}`);
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

// Setup Providers
const AppWithProviders = () => {
  const network = WalletAdapterNetwork.Devnet;

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
