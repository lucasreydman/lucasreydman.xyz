import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* MLB BvP was renamed Hitlist on 2026-11-11. Links to its old page still land. */
  async redirects() {
    return [{ source: "/work/bvp", destination: "/work/hitlist", permanent: true }];
  },
};

export default nextConfig;
