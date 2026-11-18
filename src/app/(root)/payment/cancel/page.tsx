import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <section className="bg-white dark:bg-black">
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <XCircle className="mx-auto h-14 w-14 text-amber-500" />
        <h1 className="mt-5 text-2xl font-bold text-black dark:text-white">Payment Cancelled</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          You cancelled the payment. Your booking is still completed — you can pay anytime from
          My Bookings.
        </p>
        <Link
          href="/dashboard/customer/bookings"
          className="mt-6 inline-block rounded-lg bg-[rgb(255,39,130)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[rgb(225,25,112)]"
        >
          Back to My Bookings
        </Link>
      </div>
    </section>
  );
}
