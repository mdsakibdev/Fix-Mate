import Link from "next/link";
import {
  AirVent,
  Laptop,
  Refrigerator,
  Smartphone,
  Tv,
  WashingMachine,
  Zap,
} from "lucide-react";

const categories = [
  { name: "Smartphone", icon: Smartphone, text: "Screen, battery and board repairs" },
  { name: "Laptop & PC", icon: Laptop, text: "Hardware upgrades and software fixes" },
  { name: "AC", icon: AirVent, text: "Servicing, gas refill and repair" },
  { name: "Refrigerator", icon: Refrigerator, text: "Cooling and compressor problems" },
  { name: "TV", icon: Tv, text: "Display, sound and panel issues" },
  { name: "Washing Machine", icon: WashingMachine, text: "Motor, drum and drainage fixes" },
  { name: "Electrical", icon: Zap, text: "Wiring, switches and fittings" },
];

export function PopularCategories() {
  return (
    <section className="bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black dark:text-white">
            Popular Categories
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            What do you need fixed today?
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/services?category=${encodeURIComponent(category.name)}`}
              className="rounded-2xl border border-zinc-200 p-6 transition hover:border-[rgb(249,115,22)] dark:border-zinc-800"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(249,115,22,0.1)]">
                <category.icon className="h-6 w-6 text-[rgb(249,115,22)]" />
              </span>
              <h3 className="mt-4 font-semibold text-black dark:text-white">
                {category.name}
              </h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {category.text}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
