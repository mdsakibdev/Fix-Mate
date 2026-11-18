import { notFound } from "next/navigation";
import { MapPin, Clock3 } from "lucide-react";
import { RequestRepair } from "@/components/services/RequestRepair";
import type { Service } from "@/types";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

type TechnicianSummary = {
  name: string;
  email: string;
  image: string;
  area: string;
  bio: string;
} | null;

type ServiceDetails = Service & { technician: TechnicianSummary };

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let service: ServiceDetails | null = null;
  try {
    const res = await fetch(`${serverUrl}/api/services/${id}`, { cache: "no-store" });
    if (res.ok) service = await res.json();
  } catch {
    service = null;
  }

  if (!service) {
    notFound();
  }

  const technician = service.technician;

  return (
    <section className="bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left: service info */}
          <div className="lg:col-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={service.image}
              alt={service.title}
              className="h-80 w-full rounded-2xl object-cover"
            />

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[rgba(255,39,130,0.1)] px-3 py-1 text-sm font-medium text-[rgb(255,39,130)]">
                {service.category}
              </span>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                {service.serviceMode}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold text-black dark:text-white">
              {service.title}
            </h1>
            <p className="mt-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
              {service.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <Clock3 className="h-4 w-4 text-[rgb(255,39,130)]" /> Estimated Duration
                </p>
                <p className="mt-1 font-medium text-black dark:text-white">{service.estimatedDuration}</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <MapPin className="h-4 w-4 text-[rgb(255,39,130)]" /> Service Area
                </p>
                <p className="mt-1 font-medium text-black dark:text-white">{service.serviceArea}</p>
              </div>
            </div>

            <p className="mt-6 text-zinc-600 dark:text-zinc-400">
              Starting price:{" "}
              <span className="text-2xl font-bold text-[rgb(255,39,130)]">${service.basePrice}</span>
            </p>
          </div>

          {/* Right: technician + request */}
          <div className="space-y-6">
            {technician && (
              <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
                <h2 className="font-semibold text-black dark:text-white">About the Technician</h2>
                <div className="mt-4 flex items-center gap-3">
                  {technician.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={technician.image}
                      alt={technician.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgb(255,39,130)] font-semibold text-white">
                      {technician.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div>
                    <p className="font-medium text-black dark:text-white">{technician.name}</p>
                    {technician.area && (
                      <p className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
                        <MapPin className="h-3.5 w-3.5" /> {technician.area}
                      </p>
                    )}
                  </div>
                </div>
                {technician.bio && (
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {technician.bio}
                  </p>
                )}
              </div>
            )}

            <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
              <h2 className="mb-4 font-semibold text-black dark:text-white">Request This Repair</h2>
              <RequestRepair serviceId={service._id} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
