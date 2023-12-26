'use server';

import { fetchPlugin } from '@/plugins/fetchPlugin';
import { unpkgPathPlugin } from '@/plugins/unpkgPathPlugin';
import * as esbuild from 'esbuild';

interface FormState {
  output: string;
}

export const buildScript = async (formState: FormState, formData: FormData) => {
  const input = formData.get('code') as string;

  const result = await esbuild.build({
    entryPoints: ['index.js'],
    bundle: true,
    write: false,
    plugins: [unpkgPathPlugin(), fetchPlugin(input)],
    define: {
      'process.env.NODE_ENV': '"production"',
      global: 'window'
    }
  });

  return {
    output: result.outputFiles[0].text
  };
};
