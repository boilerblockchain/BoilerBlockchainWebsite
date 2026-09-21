import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // officers.txt is read at runtime, so it has to be traced into the bundle.
  outputFileTracingIncludes: { "/api/officer/login": ["./officers.txt"] },
  // Served at its own origin, attendance.boilerblockchain.org, so every route
  // sits at the root. No basePath: paths written by hand ("/api/checkin",
  // "/checkin/{id}") resolve correctly as-is.

  // Allow phones/tablets on the LAN to load dev JS when testing QR check-in
  // over the laptop's local IP. Add your laptop's LAN IP(s) here.
  // (Dev-only; has no effect on production deploys.)
  allowedDevOrigins: ["192.168.10.24"],
};

export default nextConfig;
