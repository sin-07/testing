/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental server actions
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Image optimization settings
  images: {
    remotePatterns: [],
  },
};

module.exports = nextConfig;
