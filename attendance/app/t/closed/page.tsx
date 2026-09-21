/** Shown when a tag is tapped outside any running meeting. */
export default function NoMeetingPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-3 p-6">
      <h1 className="text-xl font-semibold">No meeting is running</h1>
      <p className="text-neutral-500">
        Nothing is open for check-in right now. If a meeting is starting, wait
        for an officer to start it and tap again.
      </p>
    </main>
  );
}
