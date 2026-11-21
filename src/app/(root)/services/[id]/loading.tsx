import { Skeleton } from "@/components/ui/skeleton";

// Matches the Service Details page: big image on the left; category,
// title, rating, description, price, info boxes, technician card and
// the request button on the right.
export default function ServiceDetailsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <Skeleton className="h-80 w-full rounded-3xl lg:h-full lg:min-h-105" />
        <div>
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="mt-4 h-10 w-3/4" />
          <Skeleton className="mt-3 h-5 w-40" />
          <Skeleton className="mt-5 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
          <Skeleton className="mt-2 h-4 w-2/3" />
          <Skeleton className="mt-6 h-9 w-28" />
          <div className="mt-6 grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="mt-6 h-28 w-full rounded-2xl" />
          <Skeleton className="mt-6 h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
