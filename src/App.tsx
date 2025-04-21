import React, { useCallback, useEffect, useState } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { Metaplex, walletAdapterIdentity, keypairIdentity } from "@metaplex-foundation/js";
// import { createNft } from "@metaplex-foundation/js";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./App.css";
import { toBigNumber } from "@metaplex-foundation/js";
import { Nft } from "@metaplex-foundation/js";

// Constants
const NETWORK = "https://mainnet.helius-rpc.com/?api-key=9c13c71d-3088-4fc4-bc03-7c7a270b0bcd";
const connection = new Connection(NETWORK, "finalized");

// Helper to get the Phantom provider directly
const getProvider = (): any => {
  if ("phantom" in window) {
    const provider = (window as any).phantom?.solana;
    if (provider?.isPhantom) {
      return provider;
    }
  }
  window.open("https://phantom.app/", "_blank");
};

const App = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [mintedData, setMintedData] = useState<Nft | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [...prev, message]);
  }, []);

  useEffect(() => {
    const provider = getProvider();
    provider?.connect().then(({ publicKey }: any) => {
      setWalletAddress(publicKey.toString());
      addLog(`✅ Connected to ${publicKey.toString()}`);
    }).catch(() => addLog("⚠️ Wallet connection failed"));
  }, [addLog]);

  const handleMint = async () => {
    try {
      setIsMinting(true);
  
      const provider = getProvider();
      if (!provider?.publicKey) {
        addLog("⚠️ Wallet not connected properly.");
        return;
      }
  
      const metadataUri = "https://gateway.pinata.cloud/ipfs/bafkreiaqw52kv3rbs6gkqb27wpz3ga3qmmvfjkskbjzpmiyrrgmjklqkku";
      const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(provider));
  
      addLog("⚙️ Creating NFT builder...");
  
      const builder = await metaplex.nfts().builders().create({
        uri: metadataUri,
        name: "Cool NFT",
        symbol: "COOL",
        sellerFeeBasisPoints: 0,
        maxSupply: toBigNumber(1),
      });
  
      const latestBlockhash = await connection.getLatestBlockhash();
  
      const transaction = await builder.toTransaction(latestBlockhash);
  
      addLog("📤 Signing and sending transaction...");
  
      const { signature } = await provider.signAndSendTransaction(transaction);
      await connection.confirmTransaction(signature, "finalized");
  
      addLog("⏳ Fetching minted NFT...");
      const mintAddress = builder.getContext().mintAddress;
      const nft = await metaplex.nfts().findByMint({ mintAddress });
      if (nft.model === "nft") {
        setMintedData(nft);
      } else {
        addLog("⚠️ Minted item is not an NFT.");
      }
      addLog(`✅ NFT minted! Mint address: ${nft.address.toBase58()}`);
    } catch (error: any) {
      console.error("❌ Mint failed:", error);
      addLog(`❌ Mint failed: ${error.message}`);
    } finally {
      setIsMinting(false);
    }
  };
  

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

// Wrap with providers
const AppWithProviders = () => {
  const endpoint = NETWORK;
  const wallets = [new PhantomWalletAdapter()];

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
