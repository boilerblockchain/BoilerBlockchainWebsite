"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@/components/ConnectButton";
import { formatDateTime } from "@/lib/ui/format";

interface AttendanceRow {
  id: string;
  meetingId: string;
  meetingName: string;
  method: string;
  checkedInAt: string;
  revoked: boolean;
}

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const [items, setItems] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/attendance?address=${address}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = (await res.json()) as { attendance: AttendanceRow[] };
        setItems(data.attendance);
      }
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My attendance</h1>
      <p className="text-sm text-neutral-400">
        Meetings you&apos;ve checked in to with this wallet.
      </p>
      <ConnectButton />

      {!isConnected && (
        <p className="text-sm text-neutral-500">
          Connect your wallet to see your attendance history.
        </p>
      )}

      {isConnected && loading && (
        <p className="text-sm text-neutral-500">Loading…</p>
      )}

      {isConnected && !loading && items.length === 0 && (
        <p className="text-sm text-neutral-500">
          No check-ins yet for this wallet.
        </p>
      )}

      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/40 px-4 py-3"
            >
              <div>
                <p
                  className={`font-medium ${
                    a.revoked ? "text-neutral-600 line-through" : ""
                  }`}
                >
                  {a.meetingName}
                </p>
                <p className="text-xs text-neutral-500">
                  {a.method} · {formatDateTime(a.checkedInAt)}
                  {a.revoked && " · revoked"}
                </p>
              </div>
              {!a.revoked && (
                <span className="text-xs text-green-400">present</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
