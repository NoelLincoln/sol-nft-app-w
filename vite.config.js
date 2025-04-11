import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import rollupNodePolyfills from 'rollup-plugin-node-polyfills';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      stream: 'stream-browserify',
      assert: 'assert',
      crypto: 'crypto-browserify',
      url: 'url',
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    include: ['@solana/web3.js', '@solana/spl-token'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
  define: {
    global: 'globalThis',
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyfills()],
    },
  },
});
