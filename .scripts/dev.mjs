import { build as esbuild } from 'esbuild';
import { run } from 'esbuild-plugin-run';
import { execa } from 'execa';
import { config } from './config.mjs';

export async function dev() {
  try {
    const { failed: isTypecheckFailed, stdout: typecheckStdout } = await execa('yarn', [
      'typecheck',
    ]);
    if (isTypecheckFailed) {
      throw new Error(typecheckStdout);
    }
    await esbuild({
      ...config,
      plugins: [run()],
      watch: true,
    });
  } catch (error) {
    console.error(error);
  }
}

dev();
