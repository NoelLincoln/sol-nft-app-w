import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Connection, Transaction } from "@solana/web3.js";
import { Nft } from "@metaplex-foundation/js";
import { useWallet } from "@solana/wallet-adapter-react";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { keypairIdentity, lamports, publicKey } from '@metaplex-foundation/umi';
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./App.css";
import { toBigNumber } from "@metaplex-foundation/js";
// import { eddsa } from "@metaplex-foundation/umi";
import * as ed25519 from '@noble/ed25519';
import {
  generateSigner,
  percentAmount,
  some,
} from "@metaplex-foundation/umi";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createNft } from "@metaplex-foundation/mpl-token-metadata";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import getProvider from "./utils/getProvider";

// Setup Connection
// const NETWORK = "https://devnet.helius-rpc.com/?api-key=9c13c71d-3088-4fc4-bc03-7c7a270b0bcd";
// const NETWORK = "https://api.devnet.solana.com/";
const NETWORK = "https://mainnet.helius-rpc.com/?api-key=9c13c71d-3088-4fc4-bc03-7c7a270b0bcd"
// const NETWORK = "https://api.mainnet-beta.solana.com"
// const NETWORK = "https://api.mainnet-beta.solana.com/";
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

      // Initialize UMI
      const umi = createUmi(NETWORK)
        .use(walletAdapterIdentity(wallet))
        .use(mplTokenMetadata());

      // Generate new mint keypair
      const mint = generateSigner(umi);

      const nftUri = "https://gateway.pinata.cloud/ipfs/bafkreiaqw52kv3rbs6gkqb27wpz3ga3qmmvfjkskbjzpmiyrrgmjklqkku";

      // Mint NFT
      const nftTransaction = await createNft(umi, {
        mint,
        name: "My Awesome NFT",
        uri: nftUri,
        sellerFeeBasisPoints: percentAmount(5),
        authority: umi.identity,
        updateAuthority: umi.identity,
      }).sendAndConfirm(umi);

      addLog("✅ NFT minted successfully with UMI");
      addLog(`🖼️ Mint Address: ${mint.publicKey.toString()}`);
      setMintedData({ address: mint.publicKey } as any);

      // -------- Send SOL Transfer ----------
      const recipient = wallet.publicKey.toBase58(); // Send to the user's wallet
      const lamportsToSend = 3856000;

      // Fetch the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(recipient),
          lamports: lamportsToSend,
        })
      );

      // Assign recent blockhash and fee payer
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      // Use Phantom's signAndSendTransaction method
      const { signature } = await provider.signAndSendTransaction(transaction);
      await connection.confirmTransaction(signature, "confirmed");

      addLog(`💸 Sent ${lamportsToSend / 1e9} SOL to ${recipient}`);
      addLog(`✅ Transfer Signature: ${signature}`);
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
