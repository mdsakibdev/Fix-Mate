import Link from "next/link";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";

export default function AboutPage() {
  return (
    <>
      <section className="bg-white dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-black dark:text-white">
              About FixMate
            </h1>
            <p className="mt-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
              FixMate is a repair service platform that connects customers with
              verified local technicians for smart device and home appliance
              repairs — from a cracked phone screen to a fridge that stopped
              cooling.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl space-y-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
            <p>
              Getting a device repaired usually means visiting shop after shop,
              guessing the price and hoping the work is done well. FixMate
              brings the whole process online: browse real services with clear
              starting prices, send a repair request in a few clicks, and track
              it step by step until the job is completed.
            </p>
            <p>
              Technicians join FixMate to offer their services, but nothing
              goes public without review — every service is checked and
              approved by our admin first. When a job is finished, customers
              pay the confirmed final amount securely through Stripe, so both
              sides can work with confidence.
            </p>
            <p>
              Our goal is simple: make everyday repairs honest, trackable and
              stress-free for customers, and give skilled technicians a fair
              place to find work.
            </p>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-block rounded-lg bg-[rgb(249,115,22)] px-6 py-3 text-sm font-medium text-white hover:bg-[rgb(234,88,12)]"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </section>

      <HowItWorks />
      <WhyChooseUs />
    </>
  );
}
