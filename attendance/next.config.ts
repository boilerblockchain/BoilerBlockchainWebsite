import type { NextConfig } from "next";
import { BASE_PATH } from "./lib/basePath";

const nextConfig: NextConfig = {
  // Served at boilerblockchain.org/attendance/* via a rewrite from the main
  // site's vercel.json. basePath makes Next emit pages, assets and next/link
  // hrefs under that prefix; hand-written fetch() paths use lib/basePath.ts.
  basePath: BASE_PATH,

  // Allow phones/tablets on the LAN to load dev JS when testing QR check-in
  // over the laptop's local IP. Add your laptop's LAN IP(s) here.
  // (Dev-only; has no effect on production deploys.)
  allowedDevOrigins: ["192.168.10.24"],
};

export default nextConfig;
