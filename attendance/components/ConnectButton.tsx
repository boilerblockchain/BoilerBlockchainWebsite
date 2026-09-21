"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortenAddress } from "@/lib/ui/format";
import { walletConnectEnabled } from "@/lib/wagmi";

/**
 * Universal connect button, laid out phone-first because that is where nearly
 * every check-in happens.
 *
 * - "Connect Wallet" uses WalletConnect: on a phone it deep-links straight into
 *   the member's wallet app (any wallet) to connect and sign.
 * - "Browser extension" uses an injected wallet (MetaMask/Coinbase) and is
 *   demoted to a secondary control, since it is desktop-only in practice.
 *
 * Buttons are full-width and >=44px tall on small screens so they are a
 * comfortable tap target, and stop stretching once there is room.
 */
export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="min-h-11 w-full rounded-lg border border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-800 sm:w-auto"
      >
        {shortenAddress(address)} · Disconnect
      </button>
    );
  }

  const wc = connectors.find((c) => c.id === "walletConnect");
  const injected = connectors.find((c) => c.id === "injected");

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        {wc && (
          <button
            onClick={() => connect({ connector: wc })}
            disabled={isPending}
            className="min-h-12 w-full rounded-lg bg-accent px-5 py-3 text-base font-medium text-white hover:bg-accent-deep disabled:opacity-50 sm:w-auto sm:text-sm"
          >
            {isPending ? "Connecting…" : "Connect Wallet"}
          </button>
        )}
        {injected && (
          <button
            onClick={() => connect({ connector: injected })}
            disabled={isPending}
            className="min-h-11 w-full rounded-lg border border-neutral-700 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 disabled:opacity-50 sm:w-auto"
          >
            Browser extension
          </button>
        )}
      </div>

      {wc && (
        <p className="text-xs text-neutral-500">
          On a phone, this opens your wallet app to approve. Signing is free:
          no gas, no transaction.
        </p>
      )}

      {!walletConnectEnabled && (
        <p className="text-xs text-amber-400">
          Mobile wallets are unavailable: NEXT_PUBLIC_WC_PROJECT_ID is not set,
          so only a desktop browser extension can connect.
        </p>
      )}
    </div>
  );
}
