import axios from 'axios';
import * as esbuild from 'esbuild';
import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient>;

const createRedisClient = async () => {
  const client = createClient({
    password: process.env.REDIS_PASS,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 11035,
    },
  });

  await client.connect();

  return client;
};

export const fetchPlugin = (input: string) => {
  return {
    name: 'fetch-plugin',

    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /^index\.js$/ }, () => {
        return {
          loader: 'jsx',
          contents: input,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (!redisClient) redisClient = await createRedisClient();

        const cachedResult = await redisClient.get(args.path);

        if (cachedResult) {
          return JSON.parse(cachedResult);
        }
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

        const result = {
          loader: 'jsx' as const,
          contents,
          resolveDir: new URL('./', request.res.responseUrl).pathname,
        };

        await redisClient.set(args.path, JSON.stringify(result), {
          EX: 60 * 60 * 24, // expires in 1 day
        });

        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const result = {
          loader: 'jsx' as const,
          contents: data,
          resolveDir: new URL('./', request.res.responseUrl).pathname,
        };

        await redisClient.set(args.path, JSON.stringify(result), {
          EX: 60 * 60 * 24, // expires in 1 day
        });

        return result;
      });
    },
  };
};
