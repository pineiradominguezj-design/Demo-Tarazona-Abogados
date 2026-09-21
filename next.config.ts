import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sin esto, Turbopack sube hasta el home buscando un lockfile y avisa.
  turbopack: { root: path.resolve(".") },
};

export default nextConfig;
