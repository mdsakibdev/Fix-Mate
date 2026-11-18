import { Suspense } from "react";
import { PaymentSuccessContent } from "@/components/payment/PaymentSuccessContent";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <p className="py-20 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Verifying your payment...
        </p>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
