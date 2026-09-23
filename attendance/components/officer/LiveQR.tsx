"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface SessionResponse {
  token: string;
  expiresAt: string;
  checkInUrl: string;
  error?: string;
}

/**
 * Polls the rotating session endpoint and renders the current check-in QR.
 * The QR refreshes automatically as the token rotates, so an old screenshot
 * stops working within the token TTL.
 */
export function LiveQR({ meetingId }: { meetingId: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [checkInUrl, setCheckInUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastToken = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function tick() {
      try {
        const res = await fetch(`/api/meetings/${meetingId}/session`, {
          cache: "no-store",
        });
        const data = (await res.json()) as SessionResponse;
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error ?? "Could not load check-in code.");
          return;
        }
        setError(null);
        setCheckInUrl(data.checkInUrl);
        if (data.token !== lastToken.current) {
          lastToken.current = data.token;
          const png = await QRCode.toDataURL(data.checkInUrl, {
            width: 320,
            margin: 1,
            color: { dark: "#000000", light: "#ffffff" },
          });
          if (!cancelled) setDataUrl(png);
        }
      } catch {
        if (!cancelled) setError("Network error loading check-in code.");
      }
    }

    tick();
    // Poll a bit faster than the token TTL so rotation looks seamless.
    const interval = setInterval(tick, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [meetingId]);

  if (error) {
    return (
      <div className="rounded-lg border border-amber-700/50 bg-amber-950/30 p-4 text-sm text-amber-300">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-2xl bg-white p-4">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dataUrl} alt="Check-in QR code" width={320} height={320} />
        ) : (
          <div className="h-[320px] w-[320px] animate-pulse rounded bg-neutral-200" />
        )}
      </div>
      <p className="text-center text-xs text-neutral-500">
        Rotating code — refreshes automatically. Old screenshots expire.
      </p>
      {checkInUrl && (
        <a
          href={checkInUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-neutral-500 underline hover:text-neutral-300"
        >
          Open check-in link
        </a>
      )}
    </div>
  );
}
