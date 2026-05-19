export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F6FAF7] px-5 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 animate-pulse rounded-2xl bg-[#DDEBE4]" />
            <div>
              <div className="h-5 w-40 animate-pulse rounded-full bg-[#DDEBE4]" />
              <div className="mt-3 h-3 w-24 animate-pulse rounded-full bg-[#E7F0EA]" />
            </div>
          </div>

          <div className="hidden gap-3 md:flex">
            <div className="h-11 w-28 animate-pulse rounded-2xl bg-[#DDEBE4]" />
            <div className="h-11 w-28 animate-pulse rounded-2xl bg-[#E7F0EA]" />
            <div className="h-11 w-28 animate-pulse rounded-2xl bg-[#E7F0EA]" />
          </div>
        </div>

        <section className="overflow-hidden rounded-[34px] border border-[#E2E8F0] bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-6 md:p-10">
              <div className="h-4 w-32 animate-pulse rounded-full bg-[#DDEBE4]" />
              <div className="mt-6 h-12 w-3/4 animate-pulse rounded-2xl bg-[#DDEBE4]" />
              <div className="mt-4 h-12 w-1/2 animate-pulse rounded-2xl bg-[#E7F0EA]" />
              <div className="mt-6 h-4 w-full max-w-xl animate-pulse rounded-full bg-[#E7F0EA]" />
              <div className="mt-3 h-4 w-5/6 max-w-lg animate-pulse rounded-full bg-[#E7F0EA]" />

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="h-12 w-36 animate-pulse rounded-2xl bg-[#CFE6DA]" />
                <div className="h-12 w-32 animate-pulse rounded-2xl bg-[#E7F0EA]" />
              </div>
            </div>

            <div className="min-h-[260px] bg-[#F0F7F3] p-6 md:p-10">
              <div className="h-full min-h-[220px] animate-pulse rounded-[28px] bg-[#DDEBE4]" />
            </div>
          </div>
        </section>

        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[28px] border border-[#E2E8F0] bg-white p-4 shadow-sm"
            >
              <div className="aspect-[4/3] animate-pulse rounded-[22px] bg-[#E7F0EA]" />
              <div className="mt-4 h-4 w-3/4 animate-pulse rounded-full bg-[#DDEBE4]" />
              <div className="mt-3 h-4 w-1/2 animate-pulse rounded-full bg-[#E7F0EA]" />
              <div className="mt-5 h-10 w-full animate-pulse rounded-2xl bg-[#DDEBE4]" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}