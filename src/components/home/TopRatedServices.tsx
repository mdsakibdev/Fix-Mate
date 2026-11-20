import { ServiceCard } from "@/components/services/ServiceCard";
import type { Service } from "@/types";

const serverUrl =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export async function TopRatedServices() {
  let services: Service[] = [];
  try {
    const res = await fetch(`${serverUrl}/api/services?limit=100`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      services = data.services || [];
    }
  } catch {
    services = [];
  }

  // Only services that have real customer reviews, best rating first
  const topRated = services
    .filter((service) => (service.reviewCount ?? 0) > 0)
    .sort(
      (a, b) =>
        (b.averageRating ?? 0) - (a.averageRating ?? 0) ||
        (b.reviewCount ?? 0) - (a.reviewCount ?? 0)
    )
    .slice(0, 3);

  if (topRated.length === 0) return null;

  // Repeat the cards a few times so the marquee loop never runs out
  const marqueeServices = [
    ...topRated,
    ...topRated,
    ...topRated,
    ...topRated,
  ];

  return (
    <section className="bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[rgb(249,115,22)]">
            Top Rated
          </p>
          <h2 className="mt-3 text-3xl font-bold text-black dark:text-white">
            Loved by Our Customers
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            The highest rated repair services, based on real customer
            reviews.
          </p>
        </div>
      </div>

      {/* Marquee: one row of cards scrolling right to left */}
      <div className="overflow-hidden py-10">
        <div className="animate-marquee flex w-max hover:paused">
          {marqueeServices.map((service, index) => (
            <div
              key={`${service._id}-${index}`}
              className="w-75 shrink-0 pr-6 sm:w-87.5"
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
