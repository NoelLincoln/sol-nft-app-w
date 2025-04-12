// Sidebar.tsx
import React from 'react';
import { PublicKey } from '@solana/web3.js';

interface SidebarProps {
  publicKey: PublicKey | null;
  connectedMethods: { name: string; onClick: () => Promise<any> }[];
  connect: () => Promise<void>;
}

const Sidebar: React.FC<SidebarProps> = ({ publicKey, connectedMethods, connect }) => {
  return (
    <div style={{ width: '250px', backgroundColor: '#f4f4f4', padding: '20px' }}>
      <h3>Wallet Info</h3>
      {publicKey ? (
        <div>
          <p>Public Key: {publicKey.toBase58()}</p>
          <ul>
            {connectedMethods.map((method, index) => (
              <li key={index}>
                <button onClick={method.onClick}>{method.name}</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  );
};

export default Sidebar;
