import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["http://localhost:3000", "http://192.168.1.47:3000"],
  /* images: {
    remotePatterns: [new URL("")],
  }, */
};

export default nextConfig;
