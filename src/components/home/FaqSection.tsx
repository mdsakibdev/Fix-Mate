import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does FixMate work?",
    answer:
      "Browse the repair services, open the one you need and send a repair request with your problem details and preferred date. The technician reviews and accepts your request, completes the repair, and you pay online once the job is done.",
  },
  {
    question: "When do I pay for a repair?",
    answer:
      "Only after the work is finished. When the technician marks your job as completed, a Pay Now button appears in your bookings — you pay the confirmed final amount securely through Stripe.",
  },
  {
    question: "How is the final price decided?",
    answer:
      "Every service shows a starting price upfront. After checking your device, the technician sets the final amount based on the actual problem and any parts needed. You always see the final amount before you pay — there are no hidden charges.",
  },
  {
    question: "Can I cancel a repair request?",
    answer:
      'Yes. You can cancel a request for free from your bookings as long as its status is still "Requested". Once a technician has accepted the job, it can no longer be cancelled from the dashboard.',
  },
  {
    question: "What is the difference between Home Visit and Shop Drop-off?",
    answer:
      "With Home Visit, the technician comes to your address and repairs the device at your place. With Shop Drop-off, you bring the device to the technician instead. Every service page shows which mode it offers.",
  },
  {
    question: "How can I join FixMate as a technician?",
    answer:
      "Create an account with the Technician role and add your repair services from your dashboard. Every service is reviewed by our admin first — once it is approved, customers can find it and send you requests.",
  },
];

export function FaqSection() {
  return (
    <section className="bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[rgb(249,115,22)]">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold text-black dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Everything you need to know about booking a repair.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <Accordion className="gap-4">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className="rounded-2xl border border-zinc-200 px-5 dark:border-zinc-800"
              >
                <AccordionTrigger className="py-4 text-left text-base font-semibold">
                  <span className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(249,115,22,0.1)] text-sm font-bold text-[rgb(249,115,22)]">
                      ?
                    </span>
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pl-10 leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
