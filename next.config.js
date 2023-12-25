/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // ignore esbuild on the server-side build
      config.externals.push('esbuild');
    }
    return config;
  }
};

module.exports = nextConfig;
