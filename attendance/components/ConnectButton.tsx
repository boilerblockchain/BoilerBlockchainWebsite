"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortenAddress } from "@/lib/ui/format";
import { walletConnectEnabled } from "@/lib/wagmi";

/**
 * Universal connect button, laid out phone-first because that is where nearly
 * every check-in happens.
 *
 * Every discovered wallet is listed by name rather than collapsing them into
 * one "Browser extension" button. With several extensions installed they all
 * race for `window.ethereum`, and the generic injected connector can attach to
 * one wallet while the signing request goes to another, which looks like a
 * hang with no popup. Naming each one makes the choice explicit.
 */
export function ConnectButton() {
  const { address, isConnected, connector: active } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="min-h-11 w-full rounded-lg border border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-800 sm:w-auto"
      >
        {shortenAddress(address)}
        {active?.name ? ` · ${active.name}` : ""} · Disconnect
      </button>
    );
  }

  const wc = connectors.find((c) => c.id === "walletConnect");

  // EIP-6963 gives one connector per installed wallet. Prefer those; fall back
  // to the generic injected connector only when nothing announced itself.
  const discovered = connectors.filter(
    (c) => c.type === "injected" && c.id !== "injected",
  );
  const generic = connectors.find((c) => c.id === "injected");
  const browserWallets = discovered.length > 0 ? discovered : generic ? [generic] : [];

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
        {browserWallets.map((c) => (
          <button
            key={c.uid}
            onClick={() => connect({ connector: c })}
            disabled={isPending}
            className="min-h-11 w-full rounded-lg border border-neutral-700 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 disabled:opacity-50 sm:w-auto"
          >
            {c.id === "injected" ? "Browser extension" : c.name}
          </button>
        ))}
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

/**
 * Nudge shown while a signature is outstanding. A wallet popup that opens
 * behind the window, or an extension that never surfaces one, otherwise leaves
 * the button sitting on "Signing…" with nothing to act on.
 */
export function SigningHint({ active }: { active: boolean }) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!active) {
      setSlow(false);
      return;
    }
    const t = setTimeout(() => setSlow(true), 6000);
    return () => clearTimeout(t);
  }, [active]);

  if (!active || !slow) return null;
  return (
    <p className="text-xs text-amber-400">
      Still waiting on your wallet. Open the extension from your browser
      toolbar to approve the request. With several wallets installed, check
      that the popup didn&apos;t open in the wrong one.
    </p>
  );
}
