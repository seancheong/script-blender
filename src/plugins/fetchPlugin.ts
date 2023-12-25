import axios from 'axios';
import * as esbuild from 'esbuild';

export const fetchPlugin = (input: string) => {
  return {
    name: 'fetch-plugin',

    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /^index\.js$/ }, () => {
        return {
          loader: 'jsx',
          contents: input
        };
      });

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        // escaped new lines and quotes from data
        const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        const contents = `
          const style = document.createElement('style');
          style.innerText = '${escaped}';
          document.head.appendChild(style);
        `;

        return {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.res.responseUrl).pathname
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        return {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.res.responseUrl).pathname
        };
      });
    }
  };
};
