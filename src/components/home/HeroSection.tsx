"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ShieldCheck,
  Wallet,
  Star,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const quickCategories = [
  { label: "Smartphone", value: "Smartphone" },
  { label: "Laptop & PC", value: "Laptop & PC" },
  { label: "AC", value: "AC" },
  { label: "Refrigerator", value: "Refrigerator" },
  { label: "TV", value: "TV" },
];

const trustPoints = [
  { icon: ShieldCheck, label: "Verified Technicians" },
  { icon: Wallet, label: "Pay After Service" },
  { icon: Clock3, label: "Fast Home Service" },
];

export function Hero() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = search.trim();
    router.push(query ? `/services?search=${encodeURIComponent(query)}` : "/services");
  };

  return (
    <section className="relative overflow-hidden bg-white dark:bg-black">
      {/* background decoration */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[rgba(249,115,22,0.1)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[rgba(249,115,22,0.1)] blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        {/* Left: text */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(249,115,22,0.3)] bg-[rgba(249,115,22,0.1)] px-4 py-1.5 text-sm font-medium text-[rgb(249,115,22)]">
            <ShieldCheck className="h-4 w-4" />
            Trusted Repair Service
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
            Broken Device? Get It Fixed by{" "}
            <span className="text-[rgb(249,115,22)]">Verified Technicians</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
            Book trusted experts for smartphone, laptop, AC, fridge, TV and
            home appliance repairs. Track your job step by step — and pay
            only after the work is done.
          </p>

          {/* Search box */}
          <form
            onSubmit={handleSearch}
            className="mt-8 flex max-w-xl items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex flex-1 items-center gap-2 pl-2">
              <Search className="h-5 w-5 shrink-0 text-zinc-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search a service — e.g. AC servicing"
                className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="shrink-0 bg-[rgb(249,115,22)] text-white hover:bg-[rgb(234,88,12)]"
            >
              Search
            </Button>
          </form>

          {/* Quick categories */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Popular:</span>
            {quickCategories.map((cat) => (
              <Link
                key={cat.value}
                href={`/services?category=${encodeURIComponent(cat.value)}`}
                className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-700 transition hover:border-[rgb(249,115,22)] hover:text-[rgb(249,115,22)] dark:border-zinc-800 dark:text-zinc-300"
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Trust points */}
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {trustPoints.map((point) => (
              <div
                key={point.label}
                className="flex items-center gap-2 text-sm font-medium text-black dark:text-white"
              >
                <point.icon className="h-5 w-5 text-[rgb(249,115,22)]" />
                {point.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right: image */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl">
            <Image
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop"
              alt="Technician repairing a home appliance"
              width={1200}
              height={900}
              priority
              className="h-full w-full object-cover"
            />
          </div>

          {/* floating card: job completed */}
          <div className="absolute -left-4 top-6 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-950 sm:-left-8">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(249,115,22,0.1)]">
              <CheckCircle2 className="h-5 w-5 text-[rgb(249,115,22)]" />
            </span>
            <div>
              <p className="text-sm font-semibold text-black dark:text-white">Job Completed</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Pay only after service</p>
            </div>
          </div>

          {/* floating card: rating */}
          <div className="absolute -bottom-5 right-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[rgb(249,115,22)] text-[rgb(249,115,22)]" />
              ))}
              <span className="ml-1 text-sm font-bold text-black dark:text-white">4.9</span>
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              From 2,000+ happy customers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
