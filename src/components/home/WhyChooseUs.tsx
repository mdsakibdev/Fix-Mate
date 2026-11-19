import { Banknote, Clock3, CreditCard, ShieldCheck } from "lucide-react";

const points = [
  {
    icon: ShieldCheck,
    title: "Verified Technicians",
    text: "Every service is reviewed and approved by our admin before it goes live.",
  },
  {
    icon: Banknote,
    title: "Honest Pricing",
    text: "You see the starting price upfront, and the final amount is confirmed before you pay.",
  },
  {
    icon: Clock3,
    title: "Easy Tracking",
    text: "Follow your repair from request to completion right from your dashboard.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    text: "All payments are handled safely through Stripe — no cash, no hassle.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black dark:text-white">
            Why Choose FixMate
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Repairs you can book with confidence.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(255,39,130,0.1)]">
                <point.icon className="h-6 w-6 text-[rgb(255,39,130)]" />
              </span>
              <h3 className="mt-4 font-semibold text-black dark:text-white">
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {point.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
