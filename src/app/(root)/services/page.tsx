import Link from "next/link";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServicesFilter } from "@/components/services/ServicesFilter";
import type { Service } from "@/types";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
const PAGE_SIZE = 9;

type PageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    serviceMode?: string;
    sort?: string;
    page?: string;
  }>;
};

export default async function ServicesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const category = params.category || "";
  const serviceMode = params.serviceMode || "";
  const sort = params.sort || "newest";
  const currentPage = Math.max(Number(params.page) || 1, 1);

  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (category) query.set("category", category);
  if (serviceMode) query.set("serviceMode", serviceMode);
  if (sort) query.set("sort", sort);
  query.set("page", String(currentPage));
  query.set("limit", String(PAGE_SIZE));

  let services: Service[] = [];
  let total = 0;
  let totalPages = 0;
  try {
    const res = await fetch(`${serverUrl}/api/services?${query.toString()}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      services = data.services;
      total = data.total;
      totalPages = data.totalPages;
    }
  } catch {
    services = [];
  }

  // Build a /services link that keeps the current filters and changes only the page
  const pageLink = (pageNumber: number) => {
    const linkParams = new URLSearchParams();
    if (search) linkParams.set("search", search);
    if (category) linkParams.set("category", category);
    if (serviceMode) linkParams.set("serviceMode", serviceMode);
    if (sort) linkParams.set("sort", sort);
    if (pageNumber > 1) linkParams.set("page", String(pageNumber));
    const queryString = linkParams.toString();
    return queryString ? `/services?${queryString}` : "/services";
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

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

        {total === 0 ? (
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
          <>
            <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
              Showing {services.length} of {total} services · Page {currentPage} of {totalPages}
            </p>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                {currentPage > 1 ? (
                  <Link
                    href={pageLink(currentPage - 1)}
                    className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 hover:border-[rgb(249,115,22)] hover:text-[rgb(249,115,22)] dark:border-zinc-700 dark:text-zinc-300"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-300 dark:border-zinc-800 dark:text-zinc-600">
                    Previous
                  </span>
                )}

                {pageNumbers.map((pageNumber) => (
                  <Link
                    key={pageNumber}
                    href={pageLink(pageNumber)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${
                      pageNumber === currentPage
                        ? "bg-[rgb(249,115,22)] text-white"
                        : "border border-zinc-300 text-zinc-600 hover:border-[rgb(249,115,22)] hover:text-[rgb(249,115,22)] dark:border-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {pageNumber}
                  </Link>
                ))}

                {currentPage < totalPages ? (
                  <Link
                    href={pageLink(currentPage + 1)}
                    className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 hover:border-[rgb(249,115,22)] hover:text-[rgb(249,115,22)] dark:border-zinc-700 dark:text-zinc-300"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-300 dark:border-zinc-800 dark:text-zinc-600">
                    Next
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
