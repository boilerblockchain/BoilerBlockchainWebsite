"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, useSignTypedData } from "wagmi";
import { ConnectButton } from "@/components/ConnectButton";
import { LiveQR } from "@/components/officer/LiveQR";
import { buildOfficerLoginTypedData } from "@/lib/officerLogin";
import { shortenAddress, formatDateTime } from "@/lib/ui/format";
import { apiPath } from "@/lib/basePath";

interface Session {
  authenticated: boolean;
  address?: string;
  role?: string;
}
interface MeetingRow {
  id: string;
  name: string;
  startsAt: string;
  endsAt: string;
  status: "draft" | "active" | "ended";
  attendees: number;
}
interface RosterRow {
  id: string;
  walletAddress: string;
  name: string | null;
  method: string;
  checkedInAt: string;
  revoked: boolean;
}

export default function OfficerPage() {
  const { address, isConnected } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const [session, setSession] = useState<Session | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSession = useCallback(async () => {
    const res = await fetch(apiPath("/api/officer/login"), { cache: "no-store" });
    setSession((await res.json()) as Session);
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  async function signIn() {
    if (!address) return;
    setBusy(true);
    setError(null);
    try {
      const issuedAt = Math.floor(Date.now() / 1000);
      const typed = buildOfficerLoginTypedData({
        address,
        issuedAt,
      });
      const signature = await signTypedDataAsync({
        domain: typed.domain,
        types: typed.types,
        primaryType: typed.primaryType,
        message: typed.message,
      });
      const res = await fetch(apiPath("/api/officer/login"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ address, issuedAt, signature }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed.");
      await loadSession();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await fetch(apiPath("/api/officer/login"), { method: "DELETE" });
    await loadSession();
  }

  if (!session) {
    return <p className="text-neutral-500">Loading…</p>;
  }

  if (!session.authenticated) {
    return (
      <div className="max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Officer sign-in</h1>
        <p className="text-sm text-neutral-400">
          Connect an allowlisted officer wallet and sign in to manage meetings.
        </p>
        <ConnectButton />
        {isConnected && (
          <button
            onClick={signIn}
            disabled={busy}
            className="rounded-lg bg-accent px-4 py-2 font-medium text-white hover:bg-accent-deep disabled:opacity-50"
          >
            {busy ? "Signing…" : "Sign in as officer"}
          </button>
        )}
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Officer dashboard</h1>
        <button
          onClick={signOut}
          className="text-sm text-neutral-400 hover:text-white"
        >
          {shortenAddress(session.address ?? "")} ({session.role}) · Sign out
        </button>
      </div>
      <Dashboard />
    </div>
  );
}

function Dashboard() {
  const [meetings, setMeetings] = useState<MeetingRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadMeetings = useCallback(async () => {
    const res = await fetch(apiPath("/api/meetings"), { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { meetings: MeetingRow[] };
      setMeetings(data.meetings);
    }
  }, []);

  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-6">
        <CreateMeeting onCreated={loadMeetings} />
        <MeetingList
          meetings={meetings}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
      <div>
        {selectedId ? (
          <MeetingDetail
            key={selectedId}
            meetingId={selectedId}
            onChanged={loadMeetings}
          />
        ) : (
          <p className="text-sm text-neutral-500">
            Select a meeting to show its QR code and roster.
          </p>
        )}
      </div>
    </div>
  );
}

// Local yyyy-mm-dd for `date` inputs (toISOString would shift by the UTC offset).
function toDateValue(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}
// Local HH:mm for `time` inputs, rounded up to the next 15 minutes.
function nextQuarterHour(d: Date): string {
  const rounded = new Date(d);
  rounded.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0);
  return `${String(rounded.getHours()).padStart(2, "0")}:${String(
    rounded.getMinutes(),
  ).padStart(2, "0")}`;
}

const DURATIONS = [
  { label: "30m", min: 30 },
  { label: "1h", min: 60 },
  { label: "1.5h", min: 90 },
  { label: "2h", min: 120 },
];

function CreateMeeting({ onCreated }: { onCreated: () => void }) {
  const now = new Date();
  const [name, setName] = useState("");
  const [date, setDate] = useState(toDateValue(now));
  const [startTime, setStartTime] = useState(nextQuarterHour(now));
  const [durationMin, setDurationMin] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Compose the local start instant and derive the end from the duration, so
  // an end time is never typed by hand.
  const start = date && startTime ? new Date(`${date}T${startTime}`) : null;
  const end =
    start && !Number.isNaN(+start)
      ? new Date(start.getTime() + durationMin * 60_000)
      : null;

  function setDateOffset(days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setDate(toDateValue(d));
  }

  function setNow() {
    const d = new Date();
    setDate(toDateValue(d));
    setStartTime(nextQuarterHour(d));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!start || Number.isNaN(+start) || !end) {
      setError("Pick a date and start time.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(apiPath("/api/meetings"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          startsAt: start.toISOString(),
          endsAt: end.toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create meeting.");
      setName("");
      setNow();
      setDurationMin(60);
      onCreated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed.");
    } finally {
      setBusy(false);
    }
  }

  const chipBase =
    "rounded-full border px-3 py-1 text-xs transition-colors border-neutral-700 text-neutral-300 hover:border-neutral-500";

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900/40 p-5"
    >
      <h2 className="font-semibold">New meeting</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Meeting name (e.g. Week 4 — Solidity)"
        required
        className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-neutral-400">Date</span>
          <div className="flex gap-2">
            <button type="button" onClick={() => setDateOffset(0)} className={chipBase}>
              Today
            </button>
            <button type="button" onClick={() => setDateOffset(1)} className={chipBase}>
              Tomorrow
            </button>
          </div>
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm [color-scheme:dark]"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-neutral-400">Start time</span>
          <button type="button" onClick={setNow} className={chipBase}>
            Now
          </button>
        </div>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm [color-scheme:dark]"
        />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-medium text-neutral-400">Duration</span>
        <div className="grid grid-cols-4 gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d.min}
              type="button"
              onClick={() => setDurationMin(d.min)}
              className={`rounded-lg border px-2 py-2 text-sm transition-colors ${
                durationMin === d.min
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-neutral-700 text-neutral-300 hover:border-neutral-500"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {end && (
        <p className="text-xs text-neutral-500">
          {formatDateTime(start!)} → {formatDateTime(end)}
        </p>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-deep disabled:opacity-50"
      >
        {busy ? "Creating…" : "Create meeting"}
      </button>
    </form>
  );
}

function MeetingList({
  meetings,
  selectedId,
  onSelect,
}: {
  meetings: MeetingRow[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (meetings.length === 0) {
    return <p className="text-sm text-neutral-500">No meetings yet.</p>;
  }
  return (
    <div className="space-y-2">
      <h2 className="font-semibold">Meetings</h2>
      {meetings.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect(m.id)}
          className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm ${
            selectedId === m.id
              ? "border-accent bg-neutral-900"
              : "border-neutral-800 hover:bg-neutral-900/60"
          }`}
        >
          <span>
            <span className="font-medium">{m.name}</span>
            <span className="block text-xs text-neutral-500">
              {formatDateTime(m.startsAt)} · {m.attendees} attendee
              {m.attendees === 1 ? "" : "s"}
            </span>
          </span>
          <StatusBadge status={m.status} />
        </button>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: MeetingRow["status"] }) {
  const styles: Record<MeetingRow["status"], string> = {
    draft: "bg-neutral-800 text-neutral-300",
    active: "bg-green-900/60 text-green-300",
    ended: "bg-neutral-800 text-neutral-500",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs ${styles[status]}`}>
      {status}
    </span>
  );
}

function MeetingDetail({
  meetingId,
  onChanged,
}: {
  meetingId: string;
  onChanged: () => void;
}) {
  const [meeting, setMeeting] = useState<MeetingRow | null>(null);
  const [roster, setRoster] = useState<RosterRow[]>([]);

  const load = useCallback(async () => {
    const res = await fetch(apiPath(`/api/meetings/${meetingId}`), { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as {
        meeting: MeetingRow;
        roster: RosterRow[];
      };
      setMeeting(data.meeting);
      setRoster(data.roster);
    }
  }, [meetingId]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [load]);

  async function setStatus(action: "start" | "end") {
    await fetch(apiPath(`/api/meetings/${meetingId}`), {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action }),
    });
    await load();
    onChanged();
  }

  async function revoke(attendanceId: string) {
    if (!confirm("Revoke this check-in? This revokes the on-chain attestation."))
      return;
    await fetch(apiPath("/api/revoke"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ attendanceId }),
    });
    await load();
  }

  if (!meeting) return <p className="text-neutral-500">Loading…</p>;

  return (
    <div className="space-y-6 rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{meeting.name}</h2>
          <p className="text-xs text-neutral-500">
            {formatDateTime(meeting.startsAt)} – {formatDateTime(meeting.endsAt)}
          </p>
        </div>
        <div className="flex gap-2">
          {meeting.status !== "active" && meeting.status !== "ended" && (
            <button
              onClick={() => setStatus("start")}
              className="rounded-lg bg-green-700 px-3 py-1.5 text-sm hover:bg-green-600"
            >
              Start
            </button>
          )}
          {meeting.status === "active" && (
            <button
              onClick={() => setStatus("end")}
              className="rounded-lg border border-neutral-600 px-3 py-1.5 text-sm hover:bg-neutral-800"
            >
              End
            </button>
          )}
        </div>
      </div>

      {meeting.status === "active" && <LiveQR meetingId={meetingId} />}
      {meeting.status === "draft" && (
        <p className="text-sm text-neutral-500">
          Start the meeting to display the check-in QR.
        </p>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-neutral-300">
          Attendees ({roster.length})
        </h3>
        {roster.length === 0 ? (
          <p className="text-sm text-neutral-500">No check-ins yet.</p>
        ) : (
          <ul className="divide-y divide-neutral-800">
            {roster.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between py-2 text-sm"
              >
                <span className={r.revoked ? "line-through text-neutral-600" : ""}>
                  <span className="font-medium">
                    {r.name ?? shortenAddress(r.walletAddress)}
                  </span>
                  <span className="ml-2 text-xs text-neutral-500">
                    {r.name ? `${shortenAddress(r.walletAddress)} · ` : ""}
                    {r.method} · {formatDateTime(r.checkedInAt)}
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  {r.revoked ? (
                    <span className="text-xs text-neutral-600">revoked</span>
                  ) : (
                    <button
                      onClick={() => revoke(r.id)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      revoke
                    </button>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
