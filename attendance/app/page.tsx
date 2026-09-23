import Link from "next/link";

const STEPS = [
  {
    step: "01",
    title: "Scan",
    body: "An officer displays a rotating QR at the meeting. Screenshots of old codes expire within seconds.",
  },
  {
    step: "02",
    title: "Sign",
    body: "The member connects a wallet and signs a one-time challenge, proving they hold the address.",
  },
  {
    step: "03",
    title: "Recorded",
    body: "The backend verifies the signature and marks them present. Instant, free, no wallet funds required.",
  },
];

export default function Home() {
  return (
    <div className="space-y-20">
      <section className="space-y-6">
        <p className="eyebrow text-xs text-accent">Boiler Blockchain</p>
        <h1 className="max-w-3xl text-4xl font-semibold sm:text-6xl">
          Wallet-verified attendance
        </h1>
        <p className="max-w-[68ch] text-neutral-400">
          Members check in by scanning a rotating QR code and{" "}
          <span className="text-white">signing with their wallet</span>. The
          signature proves they control the address: no passwords, no gas, no
          transaction. Attendance is verified and recorded instantly.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/officer"
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-deep"
          >
            Officer dashboard
          </Link>
          <Link
            href="/profile"
            className="rounded-lg border border-neutral-700 px-5 py-2.5 text-sm hover:border-accent hover:bg-neutral-900"
          >
            View my attendance
          </Link>
        </div>
      </section>

      <section className="grid gap-px border border-neutral-700/60 bg-neutral-700/60 sm:grid-cols-3">
        {STEPS.map((card) => (
          <div key={card.step} className="bg-neutral-950 p-6">
            <div className="eyebrow mb-3 text-xs text-accent">{card.step}</div>
            <h2 className="mb-2 text-lg font-semibold">{card.title}</h2>
            <p className="text-sm text-neutral-400">{card.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
