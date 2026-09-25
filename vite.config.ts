import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Library build. Only `vue` is external: the upstream `thinking-orbs/engine`
// (pure geometry, MIT) is inlined, so consumers install zero runtime deps —
// and in particular never get the `react` peer that `thinking-orbs` declares.
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'index.js'
    },
    rollupOptions: {
      external: ['vue']
    },
    minify: false,
    sourcemap: true,
    target: 'es2020'
  }
});
