import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...nextCoreWebVitals,
  {
    plugins: { prettier },

    rules: { 'prettier/prettier': 'error' },
  },
]);
