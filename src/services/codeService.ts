'use server';

import { fetchPlugin } from '@/plugins/fetchPlugin';
import { unpkgPathPlugin } from '@/plugins/unpkgPathPlugin';
import * as esbuild from 'esbuild';

export const buildCode = async (code: string) => {
  try {
    const result = await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(code)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    return {
      output: result.outputFiles[0].text,
      error: '',
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        output: '',
        error: error.message,
      };
    } else {
      return {
        output: '',
        error: 'Unknown error',
      };
    }
  }
};
