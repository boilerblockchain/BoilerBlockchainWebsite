# Pickleball Cup API

Go stdlib, no deps. In-memory state + JSON snapshot. Frontend: `/pickleball` (players + live board), `/pickleball/admin`.

- Deploy: `./deploy-brach.sh` (unit `bb-pickleball`, 127.0.0.1:8620, public at pickleball.boilerblockchain.org via the bb tunnel)
- Admin token: `ssh brach cat ~/active/pickleball/env`
- Reset event: `ssh brach 'systemctl --user stop bb-pickleball && rm ~/active/pickleball/pickleball.json && systemctl --user start bb-pickleball'`
- Matchmaking starts paused. Add courts, then hit Start in admin.
- Claimed results auto-confirm after 2 min; conflicting reports become disputed for an admin.
