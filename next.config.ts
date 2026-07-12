import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    // Explicitly set the Turbopack root to this directory to avoid parent-folder lockfile warnings/panics
    root: __dirname,
  },
};

export default nextConfig;
