import { build as esbuild } from 'esbuild';
import { execa } from 'execa';
import { config } from 'process';
import { cleanDir } from './utils/cleanDir.mjs';

export async function build() {
  try {
    await cleanDir('dist');
    const { failed: isTypecheckFailed, stdout: typecheckStdout } = await execa('yarn', [
      'typecheck',
    ]);
    if (isTypecheckFailed) {
      throw new Error(typecheckStdout);
    }
    await esbuild(config);
  } catch (error) {
    console.error(error);
  }
}

build();
