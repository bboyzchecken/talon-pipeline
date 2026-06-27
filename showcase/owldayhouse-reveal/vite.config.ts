import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Showcase build for owldayhouse.com — base './' so the built dist/ can be
// hosted from any sub-path (e.g. owldayhouse.com/showcase/reveal/).
export default defineConfig({
  plugins: [react()],
  base: './',
});
