import { ServiceCardSkeleton } from "@/components/services/ServiceCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

// Matches the home page layout: two-column hero (text + slider),
// featured services, top rated, FAQ rows and the 4 "How It Works" steps.
export default function HomeLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero — text on the left, slider image on the right */}
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Skeleton className="h-8 w-52 rounded-full" />
          <Skeleton className="mt-6 h-12 w-full" />
          <Skeleton className="mt-2 h-12 w-4/5" />
          <Skeleton className="mt-5 h-4 w-3/4" />
          <Skeleton className="mt-2 h-4 w-2/3" />
          <Skeleton className="mt-7 h-12 w-full max-w-md rounded-lg" />
          <div className="mt-7 flex flex-wrap gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
        <Skeleton className="h-80 w-full rounded-3xl lg:h-96" />
      </div>

      {/* Featured services */}
      <div className="mt-16 flex items-end justify-between">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-3 h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="hidden h-5 w-32 sm:block" />
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>

      {/* Top rated services */}
      <Skeleton className="mx-auto mt-16 h-8 w-72" />
      <Skeleton className="mx-auto mt-3 h-4 w-80 max-w-full" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>

      {/* FAQ */}
      <Skeleton className="mx-auto mt-16 h-8 w-64" />
      <div className="mx-auto mt-8 max-w-3xl space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-2xl" />
        ))}
      </div>

      {/* How it works */}
      <Skeleton className="mx-auto mt-16 h-8 w-56" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
