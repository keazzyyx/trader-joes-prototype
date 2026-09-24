import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  turbopack: { root: __dirname },
  env: { NEXT_PUBLIC_BUILD_TIME: new Date().toISOString() },
};

export default nextConfig;
