import { external } from './utils/getExternals.mjs';

export const config = {
  bundle: true,
  entryPoints: ['src/index.ts'],
  external,
  format: 'esm',
  minify: true,
  outfile: 'dist/index.mjs',
  platform: 'node',
  target: 'esnext',
};
