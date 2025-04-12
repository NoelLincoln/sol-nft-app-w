// Logs.tsx
import React from 'react';
import { TLog } from './types'; // assuming TLog is defined elsewhere
import { PublicKey } from '@solana/web3.js';

interface LogsProps {
  publicKey: PublicKey | null;
  logs: TLog[];
  clearLogs: () => void;
}

const Logs: React.FC<LogsProps> = ({ publicKey, logs, clearLogs }) => {
  return (
    <div style={{ flex: 1, padding: '20px' }}>
      <h3>Logs</h3>
      {publicKey && logs.length === 0 && <p>No logs yet</p>}
      <ul>
        {logs.map((log, index) => (
          <li key={index}>
            <strong>{log.method}: </strong>
            {log.message}
          </li>
        ))}
      </ul>
      <button onClick={clearLogs}>Clear Logs</button>
    </div>
  );
};

export default Logs;
