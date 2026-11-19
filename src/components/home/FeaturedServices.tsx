import Link from "next/link";
import { ServiceCard } from "@/components/services/ServiceCard";
import type { Service } from "@/types";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export async function FeaturedServices() {
  let services: Service[] = [];
  try {
    const res = await fetch(`${serverUrl}/api/services/featured`, {
      cache: "no-store",
    });
    if (res.ok) services = await res.json();
  } catch {
    services = [];
  }

  if (services.length === 0) return null;

  return (
    <section className="bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-black dark:text-white">Featured Services</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Latest repair services from our verified technicians.
            </p>
          </div>
          <Link
            href="/services"
            className="text-sm font-medium text-[rgb(249,115,22)] hover:underline"
          >
            View All Services →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
