#!/usr/bin/env bash
# Build the pickleball API and run it on brach as user unit bb-pickleball
# (127.0.0.1:8620, public via the bb tunnel at pickleball.boilerblockchain.org).
# State lives in ~/active/pickleball/pickleball.json on brach; the admin token
# in ~/active/pickleball/env is generated on first deploy.
set -euo pipefail
cd "$(dirname "$0")"

go test ./...
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o /tmp/pickleball-linux .

ssh brach 'mkdir -p ~/active/pickleball'
scp -q /tmp/pickleball-linux brach:active/pickleball/pickleball.new
ssh brach 'bash -s' <<'EOF'
set -euo pipefail
cd ~/active/pickleball
mv pickleball.new pickleball
[ -f env ] || { echo "ADMIN_TOKEN=$(openssl rand -hex 16)" > env; chmod 600 env; }
cat > ~/.config/systemd/user/bb-pickleball.service <<UNIT
[Unit]
Description=Boiler Blockchain pickleball cup API
After=network-online.target

[Service]
WorkingDirectory=%h/active/pickleball
EnvironmentFile=%h/active/pickleball/env
Environment=DATA=%h/active/pickleball/pickleball.json
Environment=ADDR=127.0.0.1:8620
ExecStart=%h/active/pickleball/pickleball
Restart=always
RestartSec=2

[Install]
WantedBy=default.target
UNIT
systemctl --user daemon-reload
systemctl --user enable --now bb-pickleball
systemctl --user restart bb-pickleball
sleep 1
curl -fsS -o /dev/null -w 'local api: %{http_code}\n' http://127.0.0.1:8620/api/state
EOF
