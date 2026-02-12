/**
 * Vite config for building the FormShell library (npm package).
 *
 * This config is used ONLY by `pnpm run build` to produce the
 * distributable library in dist/.
 *
 * For the dev server and the examples site build, see vite.site.config.ts.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    dts({ 
      include: ['src/formshell/**/*.ts'],
      outDir: 'dist',
      rollupTypes: true,
      afterBuild() {
        // @microsoft/api-extractor (used by rollupTypes) strips `declare global` blocks.
        // Read the source global.d.ts and append its declare global block to the rolled-up output.
        const indexDtsPath = resolve(__dirname, 'dist/index.d.ts');
        const globalDtsPath = resolve(__dirname, 'src/formshell/global.d.ts');
        const globalDts = readFileSync(globalDtsPath, 'utf-8');
        const match = globalDts.match(/declare global \{[\s\S]*?\n\}/);
        if (match) {
          const content = readFileSync(indexDtsPath, 'utf-8');
          writeFileSync(indexDtsPath, content + '\n' + match[0] + '\n');
        }
      }
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/formshell/index.ts'),
      name: 'FormShell',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
