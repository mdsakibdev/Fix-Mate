import Link from "next/link";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServicesFilter } from "@/components/services/ServicesFilter";
import type { Service } from "@/types";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

type PageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    serviceMode?: string;
    sort?: string;
  }>;
};

export default async function ServicesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const category = params.category || "";
  const serviceMode = params.serviceMode || "";
  const sort = params.sort || "newest";

  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (category) query.set("category", category);
  if (serviceMode) query.set("serviceMode", serviceMode);
  if (sort) query.set("sort", sort);

  let services: Service[] = [];
  try {
    const res = await fetch(`${serverUrl}/api/services?${query.toString()}`, {
      cache: "no-store",
    });
    if (res.ok) services = await res.json();
  } catch {
    services = [];
  }

  return (
    <section className="bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">Browse Services</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Find verified technicians for all your repair needs.
        </p>

        <div className="mt-8">
          <ServicesFilter
            initialSearch={search}
            initialCategory={category}
            initialServiceMode={serviceMode}
            initialSort={sort}
          />
        </div>

        {services.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-zinc-200 p-10 text-center dark:border-zinc-800">
            <p className="text-lg font-medium text-black dark:text-white">No services found</p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Try a different search or clear the filters.
            </p>
            <Link
              href="/services"
              className="mt-4 inline-block rounded-lg bg-[rgb(249,115,22)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[rgb(234,88,12)]"
            >
              View All Services
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
