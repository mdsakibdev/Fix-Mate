import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  LayoutGrid,
  Star,
  Users,
  Wrench,
} from "lucide-react";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import {
  MeetTechnicians,
  type TechnicianSummary,
} from "@/components/about/MeetTechnicians";
import type { Service } from "@/types";
import { Reveal } from "@/components/ui/Reveal";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

// Load all approved services (used for the live numbers + technician cards)
async function getServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${SERVER_URL}/api/services?limit=100`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.services || [];
  } catch {
    return [];
  }
}

const storyPoints = [
  "Admin-approved services only — nothing goes public without review",
  "Pay the confirmed final amount only after the job is done",
  "Track every step of your repair from your dashboard",
];

export default async function AboutPage() {
  const services = await getServices();

  // Live platform numbers, calculated from the real services
  const totalCategories = new Set(services.map((s) => s.category)).size;
  const totalReviews = services.reduce(
    (sum, s) => sum + (s.reviewCount || 0),
    0
  );
  const averageRating =
    totalReviews > 0
      ? services.reduce(
          (sum, s) => sum + (s.averageRating || 0) * (s.reviewCount || 0),
          0
        ) / totalReviews
      : 0;

  // Group the services by technician for the "Meet Our Technicians" cards
  const technicianMap = new Map<string, TechnicianSummary>();
  for (const service of services) {
    const existing = technicianMap.get(service.technicianEmail);
    if (existing) {
      existing.services += 1;
      if (!existing.areas.includes(service.serviceArea)) {
        existing.areas.push(service.serviceArea);
      }
      if (!existing.categories.includes(service.category)) {
        existing.categories.push(service.category);
      }
    } else {
      technicianMap.set(service.technicianEmail, {
        name: service.technicianName,
        email: service.technicianEmail,
        services: 1,
        areas: [service.serviceArea],
        categories: [service.category],
      });
    }
  }
  const technicians = [...technicianMap.values()];

  const stats = [
    { icon: Wrench, value: `${services.length}`, label: "Repair Services" },
    { icon: LayoutGrid, value: `${totalCategories}`, label: "Categories" },
    { icon: Users, value: `${technicians.length}`, label: "Verified Technicians" },
    {
      icon: Star,
      value: averageRating > 0 ? averageRating.toFixed(1) : "-",
      label: "Average Rating",
    },
  ];

  return (
    <>
      {/* Hero + live stats */}
      <Reveal>
      <section className="bg-white dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[rgb(249,115,22)]">
              About Us
            </p>
            <h1 className="mt-3 text-4xl font-bold text-black dark:text-white sm:text-5xl">
              Repairs without the{" "}
              <span className="text-[rgb(249,115,22)]">runaround</span>
            </h1>
            <p className="mt-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
              FixMate connects customers with verified local technicians for
              smart device and home appliance repairs — from a cracked phone
              screen to a fridge that stopped cooling.
            </p>
          </div>

          {services.length > 0 && (
            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 rounded-3xl border border-zinc-200 p-8 dark:border-zinc-800 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(249,115,22,0.1)]">
                    <stat.icon className="h-6 w-6 text-[rgb(249,115,22)]" />
                  </span>
                  <p className="mt-3 text-3xl font-bold text-black dark:text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      </Reveal>

      {/* Our story */}
      <Reveal>
      <section className="bg-white dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Image
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80"
              alt="Engineer testing electronics in a modern lab"
              width={1000}
              height={750}
              className="w-full rounded-3xl object-cover"
            />
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[rgb(249,115,22)]">
                Our Story
              </p>
              <h2 className="mt-3 text-3xl font-bold text-black dark:text-white">
                Why we built FixMate
              </h2>
              <p className="mt-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
                Getting a device repaired usually means visiting shop after
                shop, guessing the price and hoping the work is done well.
                FixMate brings the whole process online: browse real services
                with clear starting prices, send a repair request in a few
                clicks, and track it step by step until the job is completed.
              </p>
              <p className="mt-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
                Our goal is simple: make everyday repairs honest, trackable
                and stress-free for customers, and give skilled technicians a
                fair place to find work.
              </p>
              <ul className="mt-6 space-y-3">
                {storyPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[rgb(249,115,22)]" />
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/services"
                className="mt-8 inline-block rounded-lg bg-[rgb(249,115,22)] px-6 py-3 text-sm font-medium text-white hover:bg-[rgb(234,88,12)]"
              >
                Browse Services
              </Link>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      {/* Real technicians, grouped from the live services */}
      {technicians.length > 0 && (
        <Reveal>
          <MeetTechnicians technicians={technicians} />
        </Reveal>
      )}

      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <WhyChooseUs />
      </Reveal>

      {/* Call to action */}
      <Reveal>
      <section className="bg-white dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[rgb(249,115,22)] px-6 py-12 text-center">
            <h2 className="text-3xl font-bold text-white">
              Device broken? Get it fixed today.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/90">
              Browse verified repair services near you, send a request in
              minutes, and pay only after the work is done.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/services"
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[rgb(234,88,12)] hover:bg-orange-50"
              >
                Browse Services
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg border border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Join as a Technician
              </Link>
            </div>
          </div>
        </div>
      </section>
      </Reveal>
    </>
  );
}
