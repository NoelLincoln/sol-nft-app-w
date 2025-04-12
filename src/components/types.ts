// types.ts
export interface TLog {
    status: 'info' | 'success' | 'warning' | 'error';
    method: string;
    message: string;
  }
  