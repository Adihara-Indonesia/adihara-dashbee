import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a self-contained .next/standalone build (server + only the
  // node_modules it actually needs) so the Docker runner stage can ship
  // without copying the full node_modules tree.
  output: "standalone",
};

export default nextConfig;
