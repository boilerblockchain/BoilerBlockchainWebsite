"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAccount, useSignTypedData } from "wagmi";
import { ConnectButton } from "@/components/ConnectButton";
import { buildCheckInTypedData } from "@/lib/checkin/typedData";

export default function CheckInPage() {
  return (
    <Suspense fallback={<p className="text-neutral-500">Loading…</p>}>
      <CheckInFlow />
    </Suspense>
  );
}

type Phase = "validating" | "invalid" | "ready" | "checking" | "done" | "error";

function CheckInFlow() {
  const params = useParams<{ meetingId: string }>();
  const search = useSearchParams();
  const meetingId = params.meetingId;
  const token = search.get("token") ?? "";
  // NFC taps arrive with &method=NFC; a scanned QR has no method param.
  const method = search.get("method") === "NFC" ? "NFC" : "QR";

  const { address, isConnected } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const [phase, setPhase] = useState<Phase>("validating");
  const [meetingName, setMeetingName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  // The name on file for the connected wallet:
  //   undefined = not looked up yet, null = new wallet (needs a name), string = known.
  const [knownName, setKnownName] = useState<string | null | undefined>(undefined);
  const [nameInput, setNameInput] = useState<string>("");

  const validate = useCallback(async () => {
    if (!token) {
      setPhase("invalid");
      setMessage("No check-in code found in the link.");
      return;
    }
    try {
      const res = await fetch(`/api/checkin/session/validate?meetingId=${meetingId}&token=${token}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setMeetingName(data.meetingName ?? "");
      if (data.valid) {
        setPhase("ready");
      } else {
        setPhase("invalid");
        setMessage(
          data.meetingStatus && data.meetingStatus !== "active"
            ? "This meeting isn't open for check-in right now."
            : "This QR code has expired. Please scan the current code on screen.",
        );
      }
    } catch {
      setPhase("invalid");
      setMessage("Could not reach the server. Try again.");
    }
  }, [meetingId, token]);

  useEffect(() => {
    validate();
  }, [validate]);

  // When a wallet connects, look up whether it already has a name on file.
  useEffect(() => {
    if (!isConnected || !address) {
      setKnownName(undefined);
      return;
    }
    let cancelled = false;
    setKnownName(undefined);
    fetch(`/api/members?address=${address}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { name: null }))
      .then((data) => {
        if (!cancelled) setKnownName(data.name ?? null);
      })
      .catch(() => {
        if (!cancelled) setKnownName(null);
      });
    return () => {
      cancelled = true;
    };
  }, [isConnected, address]);

  // A first-time wallet must supply a name before it can check in.
  const needsName = knownName === null;
  const trimmedName = nameInput.trim();
  const canCheckIn = knownName !== undefined && (!needsName || trimmedName.length > 0);

  async function checkIn() {
    if (!address) return;
    setPhase("checking");
    setMessage("");
    try {
      // 1. Request a single-use challenge.
      const chRes = await fetch("/api/checkin/challenge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          meetingId,
          walletAddress: address,
          sessionToken: token,
        }),
      });
      const ch = await chRes.json();
      if (!chRes.ok) throw new Error(ch.error ?? "Could not start check-in.");

      // 2. Sign the challenge.
      const typed = buildCheckInTypedData({
        meetingId,
        wallet: address,
        nonce: ch.nonce,
      });
      const signature = await signTypedDataAsync({
        domain: typed.domain,
        types: typed.types,
        primaryType: typed.primaryType,
        message: typed.message,
      });

      // 3. Submit for verification + attestation.
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          meetingId,
          walletAddress: address,
          method,
          sessionToken: token,
          nonce: ch.nonce,
          signature,
          displayName: needsName ? trimmedName : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Check-in failed.");

      setPhase("done");
      setMessage(
        data.alreadyCheckedIn
          ? "You were already checked in for this meeting."
          : "You're checked in! Your attendance has been recorded.",
      );
    } catch (e) {
      setPhase("error");
      setMessage(e instanceof Error ? e.message : "Check-in failed.");
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Check in</h1>
        {meetingName && <p className="text-neutral-400">{meetingName}</p>}
      </div>

      {phase === "validating" && (
        <p className="text-neutral-500">Checking the code…</p>
      )}

      {phase === "invalid" && (
        <div className="rounded-lg border border-amber-700/50 bg-amber-950/30 p-4 text-amber-300">
          {message}
        </div>
      )}

      {(phase === "ready" || phase === "checking" || phase === "error") && (
        <div className="space-y-4">
          <p className="text-sm text-neutral-400">
            Connect your wallet and sign to record your attendance. It&apos;s a
            free signature — no gas, no transaction, nothing sent on-chain.
          </p>
          <ConnectButton />
          {isConnected && needsName && (
            <label className="block space-y-1">
              <span className="text-sm text-neutral-300">
                First time with this wallet — what&apos;s your name?
              </span>
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Your name"
                maxLength={100}
                autoComplete="name"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
              />
            </label>
          )}
          {isConnected && knownName && (
            <p className="text-sm text-neutral-400">
              Checking in as <span className="text-neutral-200">{knownName}</span>.
            </p>
          )}
          {isConnected && (
            <button
              onClick={checkIn}
              disabled={phase === "checking" || !canCheckIn}
              className="w-full rounded-lg bg-accent px-4 py-3 font-medium text-white hover:bg-accent-deep disabled:opacity-50"
            >
              {phase === "checking" ? "Checking in…" : "Check in"}
            </button>
          )}
          {phase === "error" && (
            <p className="text-sm text-red-400">{message}</p>
          )}
        </div>
      )}

      {phase === "done" && (
        <div className="space-y-2 rounded-xl border border-green-800/50 bg-green-950/30 p-5">
          <p className="text-lg text-green-300">✓ {message}</p>
          <p className="text-xs text-green-500/80">
            Signed in as {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : ""}.
          </p>
        </div>
      )}
    </div>
  );
}
