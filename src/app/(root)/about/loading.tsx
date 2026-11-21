import { Skeleton } from "@/components/ui/skeleton";

// Matches the About page layout: centered hero, the stats card,
// the two-column "Our Story" and the technician cards.
export default function AboutLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero (centered) */}
      <Skeleton className="mx-auto h-5 w-24" />
      <Skeleton className="mx-auto mt-4 h-11 w-2/3 max-w-xl" />
      <Skeleton className="mx-auto mt-3 h-11 w-1/2 max-w-md" />
      <Skeleton className="mx-auto mt-5 h-4 w-1/2 max-w-lg" />
      <Skeleton className="mx-auto mt-2 h-4 w-2/5 max-w-md" />

      {/* Live stats card */}
      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 rounded-3xl border border-zinc-200 p-8 dark:border-zinc-800 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="mt-3 h-8 w-14" />
            <Skeleton className="mt-2 h-4 w-24" />
          </div>
        ))}
      </div>

      {/* Our story */}
      <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-4/3 w-full rounded-3xl" />
        <div>
          <Skeleton className="h-5 w-28" />
          <Skeleton className="mt-3 h-9 w-72 max-w-full" />
          <Skeleton className="mt-5 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
          <Skeleton className="mt-2 h-4 w-4/6" />
          <Skeleton className="mt-5 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/6" />
          <div className="mt-7 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 shrink-0 rounded-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
          <Skeleton className="mt-8 h-11 w-40 rounded-lg" />
        </div>
      </div>

      {/* Meet our technicians */}
      <Skeleton className="mx-auto mt-16 h-8 w-72" />
      <Skeleton className="mx-auto mt-3 h-4 w-96 max-w-full" />
      <div className="mx-auto mt-8 grid max-w-4xl gap-6 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
