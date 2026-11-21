import { ServiceCardSkeleton } from "@/components/services/ServiceCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

// Matches the Services page: title, search & filter bar,
// a grid of 9 service cards and the pagination row.
export default function ServicesLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="mt-3 h-4 w-80 max-w-full" />
      <Skeleton className="mt-8 h-12 w-full rounded-xl" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
      <div className="mt-10 flex items-center justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-9 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
