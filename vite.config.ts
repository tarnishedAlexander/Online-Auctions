import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mui/styled-engine': '@mui/styled-engine-sc', // <-- esto forza el engine si usas styled-components
      // o usa esta si trabajas con Emotion:
      '@mui/styled-engine': path.resolve(__dirname, 'node_modules/@mui/styled-engine'),
    },
  },
});

