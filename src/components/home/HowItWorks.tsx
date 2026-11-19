import { CalendarCheck, CreditCard, Search, Wrench } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search & Choose",
    text: "Browse verified repair services and pick the one that fits your problem.",
  },
  {
    icon: CalendarCheck,
    title: "Send a Request",
    text: "Describe your problem, share your address and choose a preferred date.",
  },
  {
    icon: Wrench,
    title: "Get It Repaired",
    text: "The technician accepts your request, does the repair and marks it completed.",
  },
  {
    icon: CreditCard,
    title: "Pay Securely",
    text: "Pay the final amount online with Stripe once the job is done.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black dark:text-white">
            How FixMate Works
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Four simple steps from broken to fixed.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-zinc-200 p-6 text-center dark:border-zinc-800"
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(249,115,22,0.1)]">
                <step.icon className="h-7 w-7 text-[rgb(249,115,22)]" />
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[rgb(249,115,22)]">
                Step {index + 1}
              </p>
              <h3 className="mt-1 font-semibold text-black dark:text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
