import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No longer a static export: the /api routes hold the Neon connection server-side.
  images: { unoptimized: true },
  turbopack: { root: __dirname },
  env: { NEXT_PUBLIC_BUILD_TIME: new Date().toISOString() },
};

export default nextConfig;
