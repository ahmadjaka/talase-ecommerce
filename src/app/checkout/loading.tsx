export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F7FAFC] px-5 py-10">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="h-16 rounded-3xl bg-[#E2E8F0]" />
        <div className="h-64 rounded-[32px] bg-[#E2E8F0]" />
        <div className="grid gap-4 md:grid-cols-4">
          <div className="h-40 rounded-3xl bg-[#E2E8F0]" />
          <div className="h-40 rounded-3xl bg-[#E2E8F0]" />
          <div className="h-40 rounded-3xl bg-[#E2E8F0]" />
          <div className="h-40 rounded-3xl bg-[#E2E8F0]" />
        </div>
      </div>
    </main>
  );
}