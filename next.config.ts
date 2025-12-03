import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_POSTGRES_URL: process.env.NEXT_PUBLIC_POSTGRES_URL,
  },
};

export default nextConfig;
