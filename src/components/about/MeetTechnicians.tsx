import { MapPin, Wrench } from "lucide-react";

// One card per technician, grouped from their live services
export type TechnicianSummary = {
  name: string;
  email: string;
  services: number;
  areas: string[];
  categories: string[];
};

export function MeetTechnicians({
  technicians,
}: {
  technicians: TechnicianSummary[];
}) {
  return (
    <section className="bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[rgb(249,115,22)]">
            Our Team
          </p>
          <h2 className="mt-3 text-3xl font-bold text-black dark:text-white">
            Meet Our Technicians
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Real experts whose services are reviewed and approved by our
            admin.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
          {technicians.map((tech) => (
            <div
              key={tech.email}
              className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[rgb(249,115,22)] text-xl font-bold text-white">
                  {tech.name.charAt(0)}
                </span>
                <div>
                  <h3 className="font-semibold text-black dark:text-white">
                    {tech.name}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                    <Wrench className="h-4 w-4 text-[rgb(249,115,22)]" />
                    {tech.services}{" "}
                    {tech.services === 1 ? "service" : "services"}
                  </p>
                </div>
              </div>

              <p className="mt-4 flex items-start gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[rgb(249,115,22)]" />
                {tech.areas.join(" · ")}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {tech.categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full bg-[rgba(249,115,22,0.1)] px-3 py-1 text-xs font-medium text-[rgb(234,88,12)] dark:text-[rgb(249,115,22)]"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
