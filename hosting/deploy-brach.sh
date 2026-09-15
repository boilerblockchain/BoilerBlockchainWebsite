#!/usr/bin/env bash
# Builds the three Level 2 challenge images on brach and leaves one warm copy of
# each running on its own port. Re-runnable: it rebuilds and replaces cleanly.
#
# These standing containers are only for building the images and smoke-testing;
# students never touch them. Every student instance is launched separately by
# instancer.py, which mints and injects its own flag. So the FLAG below is a
# throwaway placeholder, not a real flag, and nothing here reads flags.env.
set -euo pipefail
BASE=~/active/bb-challenges
cd "$BASE"

declare -A PORT=( [multisig-mayhem]=8551 [flash-crash]=8552 [double-down-drain]=8553 )
declare -A TAR=(
  [multisig-mayhem]=cex-security-multisig_mayhem
  [flash-crash]=blockchain-flash_crash
  [double-down-drain]=blockchain-double_down_drain
)
# The gateway refuses to start on an empty FLAG, so give the warm copies an
# obviously-fake one. Real flags are minted per instance by instancer.py.
PLACEHOLDER_FLAG='boiler{not-a-real-flag_build-smoke-test}'

for name in "${!PORT[@]}"; do
  dir="$BASE/${name}"
  rm -rf "$dir"; mkdir -p "$dir"
  tar xzf "$BASE/tars/${TAR[$name]}.tar.gz" -C "$dir" --strip-components=1
  echo ">>> $name on :${PORT[$name]}"
  FLAG="$PLACEHOLDER_FLAG" RPC_PORT="${PORT[$name]}" \
    docker compose -p "$name" \
      -f "$dir/compose.yaml" -f "$BASE/override.yaml" \
      up -d --build
done
docker ps --format '{{.Names}} {{.Ports}}'
