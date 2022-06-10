import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import run from '@rollup/plugin-run';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/app.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [
    alias({
      entries: [{ find: '@', replacement: 'src' }],
    }),
    json({ compact: true }),
    process.env.ROLLUP_WATCH === 'true' && run(),
    typescript(),
  ],
};
