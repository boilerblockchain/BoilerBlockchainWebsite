"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortenAddress } from "@/lib/ui/format";
import { walletConnectEnabled } from "@/lib/wagmi";

/**
 * Universal connect button.
 * - "Connect Wallet" uses WalletConnect: on a phone it deep-links straight into
 *   the member's wallet app (any wallet) to connect and sign.
 * - "Browser extension" uses an injected wallet (MetaMask/Coinbase) on desktop.
 */
export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="rounded-lg border border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-800"
      >
        {shortenAddress(address)} · Disconnect
      </button>
    );
  }

  const wc = connectors.find((c) => c.id === "walletConnect");
  const injected = connectors.find((c) => c.id === "injected");

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {wc && (
          <button
            onClick={() => connect({ connector: wc })}
            disabled={isPending}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-deep disabled:opacity-50"
          >
            {isPending ? "Connecting…" : "Connect Wallet"}
          </button>
        )}
        {injected && (
          <button
            onClick={() => connect({ connector: injected })}
            disabled={isPending}
            className="rounded-lg border border-neutral-700 px-4 py-2.5 text-sm hover:bg-neutral-800"
          >
            Browser extension
          </button>
        )}
      </div>
      {!walletConnectEnabled && (
        <p className="text-xs text-amber-400">
          Mobile wallets need a WalletConnect id — set NEXT_PUBLIC_WC_PROJECT_ID.
        </p>
      )}
    </div>
  );
}
