function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
      <div className="h-[200px] animate-pulse bg-[#E5E5EA]" />
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="h-5 w-3/5 animate-pulse rounded bg-[#E5E5EA]" />
            <div className="h-4 w-2/5 animate-pulse rounded bg-[#E5E5EA]" />
          </div>
          <div className="h-4 w-16 animate-pulse rounded bg-[#E5E5EA]" />
        </div>
        <div className="h-6 w-1/2 animate-pulse rounded bg-[#E5E5EA]" />
        <div className="flex gap-3">
          <div className="h-4 w-14 animate-pulse rounded bg-[#E5E5EA]" />
          <div className="h-4 w-14 animate-pulse rounded bg-[#E5E5EA]" />
          <div className="h-4 w-14 animate-pulse rounded bg-[#E5E5EA]" />
        </div>
        <div className="h-12 w-full animate-pulse rounded-lg bg-[#E5E5EA]" />
      </div>
    </div>
  );
}

export default function RoomsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-5">
        <div className="h-6 w-32 animate-pulse rounded bg-[#E5E5EA]" />
        <div className="h-6 w-6 animate-pulse rounded bg-[#E5E5EA]" />
      </header>

      <div className="sticky top-14 z-30 border-b border-border bg-card py-3 shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
        <div className="flex gap-2 overflow-hidden px-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 shrink-0 animate-pulse rounded-full bg-[#E5E5EA]"
            />
          ))}
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="h-4 w-36 animate-pulse rounded bg-[#E5E5EA]" />
      </div>

      <div className="flex flex-col gap-4 px-4 pb-8">
        <ListingCardSkeleton />
        <ListingCardSkeleton />
        <ListingCardSkeleton />
      </div>
    </div>
  );
}
