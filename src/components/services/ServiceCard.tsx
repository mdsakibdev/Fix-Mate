import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Service } from "@/types";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={service.image}
        alt={service.title}
        className="h-48 w-full object-cover"
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-[rgba(249,115,22,0.1)] px-2.5 py-1 text-xs font-medium text-[rgb(249,115,22)]">
            {service.category}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{service.serviceMode}</span>
        </div>

        <h3 className="mt-3 line-clamp-1 text-lg font-semibold text-black dark:text-white">
          {service.title}
        </h3>
        <p className="mt-1.5 flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          <MapPin className="h-4 w-4 shrink-0" />
          {service.serviceArea}
        </p>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          by {service.technicianName}
        </p>

        <div className="mt-auto flex items-center justify-between pt-5">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            From{" "}
            <span className="text-lg font-bold text-[rgb(249,115,22)]">
              ${service.basePrice}
            </span>
          </p>
          <Link
            href={`/services/${service._id}`}
            className="rounded-lg bg-[rgb(249,115,22)] px-4 py-2 text-sm font-medium text-white hover:bg-[rgb(234,88,12)]"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
