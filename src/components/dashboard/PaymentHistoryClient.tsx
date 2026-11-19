"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SERVER_URL, getToken } from "@/lib/api";

type PaymentRow = {
  _id: string;
  serviceTitle: string;
  amount: number;
  transactionId: string;
  status: string;
  createdAt: string;
};

export function PaymentHistoryClient() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchPayments = async () => {
      const token = await getToken();
      const res = await fetch(`${SERVER_URL}/api/payments/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (cancelled) return;
      if (res.ok) {
        setPayments(data);
      } else {
        setError(data.message || "Failed to load payments.");
      }
      setLoading(false);
    };

    fetchPayments();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Payment History</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        All the payments you have made on FixMate.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {error}
        </p>
      )}

      {payments.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-zinc-200 p-8 text-center dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400">No payments yet.</p>
          <Link
            href="/dashboard/customer/bookings"
            className="mt-4 inline-block rounded-lg bg-[rgb(249,115,22)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[rgb(234,88,12)]"
          >
            Go to My Bookings
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-160 text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Transaction ID</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-900">
                  <td className="px-4 py-3">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-medium">{payment.serviceTitle}</td>
                  <td className="px-4 py-3 font-semibold text-[rgb(249,115,22)]">
                    ${payment.amount}
                  </td>
                  <td className="max-w-55 truncate px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">
                    {payment.transactionId}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium capitalize text-green-700 dark:bg-green-950 dark:text-green-400">
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
