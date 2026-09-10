#!/usr/bin/env bash
# Runs the three Level 2 challenges on brach with real flags, each on its own
# port, restart-on-boot. Re-runnable: it rebuilds and replaces cleanly.
set -euo pipefail
BASE=~/active/bb-challenges
cd "$BASE"

declare -A PORT=( [multisig-mayhem]=8551 [flash-crash]=8552 [double-down-drain]=8553 )
declare -A TAR=(
  [multisig-mayhem]=cex-security-multisig_mayhem
  [flash-crash]=blockchain-flash_crash
  [double-down-drain]=blockchain-double_down_drain
)
# Flags come from flags.env (gitignored, brach-local), never hardcoded.
source "$BASE/flags.env"
declare -A FLAG=(
  [multisig-mayhem]="$MULTISIG_FLAG"
  [flash-crash]="$FLASHCRASH_FLAG"
  [double-down-drain]="$DOUBLEDOWN_FLAG"
)

for name in "${!PORT[@]}"; do
  dir="$BASE/${name}"
  rm -rf "$dir"; mkdir -p "$dir"
  tar xzf "$BASE/tars/${TAR[$name]}.tar.gz" -C "$dir" --strip-components=1
  echo ">>> $name on :${PORT[$name]}"
  FLAG="${FLAG[$name]}" RPC_PORT="${PORT[$name]}" \
    docker compose -p "$name" \
      -f "$dir/compose.yaml" -f "$BASE/override.yaml" \
      up -d --build
done
docker ps --format '{{.Names}} {{.Ports}}'
