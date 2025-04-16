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
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from "@solana/spl-token";
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
import { PhantomProvider } from "../types";

// Setup Connection
// const NETWORK = "https://devnet.helius-rpc.com/?api-key=9c13c71d-3088-4fc4-bc03-7c7a270b0bcd";
// const NETWORK = "https://api.devnet.solana.com/";
const NETWORK = "https://alpha-tame-dinghy.solana-devnet.quiknode.pro/24f6b6225e2dee000e1a6e7f1afecbba8980decb/"
// const NETWORK = "https://mainnet.helius-rpc.com/?api-key=9c13c71d-3088-4fc4-bc03-7c7a270b0bcd"
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

      const transaction = new Transaction();

      // Get source ATA for the mint authority (umi.identity)
      const sourceTokenAccount = await getAssociatedTokenAddress(
        new PublicKey(mint.publicKey),
        new PublicKey(umi.identity.publicKey.toString()) // Mint authority
      );

      // Get destination ATA for the user
      const destinationTokenAccount = await getAssociatedTokenAddress(
        new PublicKey(mint.publicKey),
        wallet.publicKey
      );

      // Create destination ATA if it doesn't exist
      const destAccountInfo = await connection.getAccountInfo(destinationTokenAccount);
      if (!destAccountInfo) {
        const ataInstruction = createAssociatedTokenAccountInstruction(
          wallet.publicKey,                // Payer
          destinationTokenAccount,         // Destination
          wallet.publicKey,                // Owner of destination
          new PublicKey(mint.publicKey)    // Mint
        );
        transaction.add(ataInstruction);
      }

      // Transfer from mint authority to user
      const transferInstruction = createTransferInstruction(
        sourceTokenAccount,                                // ✅ Correct source ATA
        destinationTokenAccount,                           // ✅ Correct destination ATA
        new PublicKey(umi.identity.publicKey.toString()),  // Authority (mint authority)
        1,                                                 // Amount
        [],
        TOKEN_PROGRAM_ID
      );
      transaction.add(transferInstruction);


      // Fetch the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      // Simulate the transaction
      await connection.simulateTransaction(transaction);

      // Use Phantom's signAndSendTransaction method
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

const signAndSendTransaction = async (provider: PhantomProvider, transaction: Transaction): Promise<string> => {
  try {
    const { signature } = await provider.signAndSendTransaction(transaction);
    return signature;
  } catch (error) {
    console.warn(error);
    throw new Error(error.message);
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
