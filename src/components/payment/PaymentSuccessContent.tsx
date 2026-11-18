"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { SERVER_URL, getToken } from "@/lib/api";

export function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("bookingId");
  const [state, setState] = useState<"verifying" | "success" | "failed">("verifying");

  useEffect(() => {
    let cancelled = false;

    const verifyPayment = async () => {
      if (!sessionId || !bookingId) {
        setState("failed");
        return;
      }
      const token = await getToken();
      const res = await fetch(
        `${SERVER_URL}/api/payments/verify?session_id=${sessionId}&bookingId=${bookingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (cancelled) return;
      setState(res.ok && data.paid ? "success" : "failed");
    };

    verifyPayment();
    return () => {
      cancelled = true;
    };
  }, [sessionId, bookingId]);

  return (
    <section className="bg-white dark:bg-black">
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        {state === "verifying" && (
          <>
            <Loader2 className="mx-auto h-14 w-14 animate-spin text-[rgb(255,39,130)]" />
            <h1 className="mt-5 text-2xl font-bold text-black dark:text-white">
              Verifying your payment...
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Please wait a moment while we confirm your payment with Stripe.
            </p>
          </>
        )}

        {state === "success" && (
          <>
            <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />
            <h1 className="mt-5 text-2xl font-bold text-black dark:text-white">
              Payment Successful!
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Thank you. Your payment has been confirmed and saved.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/dashboard/customer/payments"
                className="rounded-lg bg-[rgb(255,39,130)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[rgb(225,25,112)]"
              >
                View Payment History
              </Link>
              <Link
                href="/dashboard/customer/bookings"
                className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium dark:border-zinc-700"
              >
                Back to My Bookings
              </Link>
            </div>
          </>
        )}

        {state === "failed" && (
          <>
            <XCircle className="mx-auto h-14 w-14 text-red-500" />
            <h1 className="mt-5 text-2xl font-bold text-black dark:text-white">
              Payment could not be verified
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Something went wrong while confirming your payment. Please check your bookings —
              if the payment went through, it will show as Paid there.
            </p>
            <Link
              href="/dashboard/customer/bookings"
              className="mt-6 inline-block rounded-lg bg-[rgb(255,39,130)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[rgb(225,25,112)]"
            >
              Back to My Bookings
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
