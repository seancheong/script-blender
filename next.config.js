/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // ignore esbuild on the server-side build
      config.externals.push('esbuild');
    }

    config.module = {
      ...config.module,
      // suppress warning caused within package 'prettier'
      exprContextCritical: false
    };

    return config;
  }
};

module.exports = nextConfig;
