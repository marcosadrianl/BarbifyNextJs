import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // Desactivado para evitar dobles llamadas en desarrollo
  allowedDevOrigins: ["http://localhost:3000", "http://192.168.1.47:3000"],
  typescript: {
    ignoreBuildErrors: true,
  },
  /* images: {
    remotePatterns: [new URL("")],
  }, */
};

export default nextConfig;
