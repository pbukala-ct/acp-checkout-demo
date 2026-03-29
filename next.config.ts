import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    CTP_PROJECT_KEY: process.env.CTP_PROJECT_KEY,
  },
};

export default nextConfig;
