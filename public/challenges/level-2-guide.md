# Level 2 — Break a Vault (guide)

## What this is

Each Level 2 challenge is a **custom vulnerable smart contract** — not a
textbook example off GitHub. Your job: find the bug, then write an exploit that
**actually drains the vault** on a running chain. Reading the bug is not enough;
you have to make the balance go to zero.

Every challenge ships as a Docker handout with the exact same shape:

- `contracts/` — the target contract(s) and a `Setup.sol`. `Setup` deploys the
  vault with funds and exposes `isSolved()`, which returns `true` once you've
  drained it.
- `compose.yaml` + `deploy/` — boots a local Anvil chain with the challenge
  already deployed, and a filtered RPC gateway.
- `README.md` + `challenge.js` — the story, the hint, and a helper to inspect a
  deployed vault.

## How to run one

From an extracted challenge folder:

```bash
docker compose up --build
```

When it reports ready, in another terminal:

```bash
curl http://127.0.0.1:8545/
```

That response gives you the **funded player private key** and the **contract
addresses**. Point your tooling at `http://127.0.0.1:8545/` as the RPC URL. The
local instance returns a placeholder `fake{flag}` once solved — a real flag is
not required to submit.

## Developing your exploit

Use [Foundry](https://book.getfoundry.sh/). The fastest loop is a forge test
against a local fork or a fresh deploy:

1. Copy the target contract into a Foundry project.
2. Write an exploit contract / test that reproduces the deployed setup.
3. Make `Setup.isSolved()` return `true` (the vault balance hits zero).
4. Run it against the live instance with `forge script` + `--broadcast`, or
   `cast send`, using the player key from the gateway.

Confirm the vault balance is `0` on the running instance — that is the win.

## The challenges

| Challenge | Difficulty | Theme |
|---|---|---|
| Multisig Mayhem | Warm-up | signature / authorization |
| Flash Crash | Medium | EIP-1153 transient storage |
| Double Down Drain | Hard | delegatecall + storage layout |

Start with Multisig Mayhem.

## Submit

On the Challenges page, use the **Level 2** form. You do **not** need to deploy
to a public testnet (that is Level 1's job) — your exploit just has to drain the
vault, locally is fine.

1. Which challenge.
2. Proof it drains: the `forge test` output showing the balance hit zero, or the
   local tx hash.
3. Your exploit: paste the exploit contract / forge test directly, or link a
   repo/gist.
4. A short explanation, in your own words: what the vulnerability is, and how you
   would fix it.

## A note on AI

AI use is encouraged. But you must understand what you are doing and what is
happening: be able to explain the vulnerability, your exploit, and the fix in
your own words. The tool is a collaborator, not a substitute for understanding.
