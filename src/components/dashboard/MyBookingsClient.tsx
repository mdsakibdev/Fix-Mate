"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SERVER_URL, getToken } from "@/lib/api";
import type { Booking } from "@/types";

const filters = [
  { label: "All", value: "all" },
  { label: "Requested", value: "requested" },
  { label: "Accepted", value: "accepted" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Rejected", value: "rejected" },
  { label: "Cancelled", value: "cancelled" },
];

function statusBadge(status: string) {
  if (status === "accepted") return "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400";
  if (status === "in-progress") return "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400";
  if (status === "completed") return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
  if (status === "rejected") return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
  if (status === "cancelled") return "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
  return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
}

export function MyBookingsClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [payingId, setPayingId] = useState("");

  const loadBookings = async () => {
    const token = await getToken();
    const res = await fetch(`${SERVER_URL}/api/bookings/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      setBookings(data);
    } else {
      setError(data.message || "Failed to load bookings.");
    }
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;

    const fetchBookings = async () => {
      const token = await getToken();
      const res = await fetch(`${SERVER_URL}/api/bookings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (cancelled) return;
      if (res.ok) {
        setBookings(data);
      } else {
        setError(data.message || "Failed to load bookings.");
      }
      setLoading(false);
    };

    fetchBookings();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);

    const token = await getToken();
    const res = await fetch(`${SERVER_URL}/api/bookings/${cancelTarget._id}/cancel`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCancelling(false);
    setCancelTarget(null);

    if (!res.ok) {
      toast.error(data.message || "Failed to cancel the booking.");
      return;
    }
    toast.success("Booking cancelled.");
    loadBookings();
  };

  const handlePay = async (booking: Booking) => {
    setPayingId(booking._id);

    const token = await getToken();
    const res = await fetch(`${SERVER_URL}/api/payments/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bookingId: booking._id }),
    });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed to start the payment.");
      setPayingId("");
      return;
    }
    window.location.assign(data.url);
  };

  const visibleBookings =
    filter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === filter);

  if (loading) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">My Bookings</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Track your repair requests and their status.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Filter buttons */}
      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              filter === item.value
                ? "bg-[rgb(255,39,130)] text-white"
                : "border border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {visibleBookings.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-zinc-200 p-8 text-center dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400">
            {bookings.length === 0
              ? "You have not requested any service yet."
              : "No bookings found in this list."}
          </p>
          {bookings.length === 0 && (
            <Link
              href="/services"
              className="mt-4 inline-block rounded-lg bg-[rgb(255,39,130)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[rgb(225,25,112)]"
            >
              Browse Services
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {visibleBookings.map((booking) => (
            <div
              key={booking._id}
              className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={booking.serviceImage}
                  alt={booking.serviceTitle}
                  className="h-24 w-full rounded-xl object-cover sm:w-32"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-black dark:text-white">
                      {booking.serviceTitle}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusBadge(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                        booking.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                      }`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Technician: {booking.technicianName} · Preferred date: {booking.preferredDate}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {booking.problemDescription}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Amount:{" "}
                      <span className="text-base font-bold text-[rgb(255,39,130)]">
                        ${booking.finalAmount}
                      </span>
                    </p>
                    {booking.status === "requested" && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setCancelTarget(booking)}
                        className="bg-red-500 text-white hover:bg-red-600"
                      >
                        Cancel Booking
                      </Button>
                    )}
                    {booking.status === "completed" && booking.paymentStatus === "unpaid" && (
                      <Button
                        type="button"
                        size="sm"
                        disabled={payingId === booking._id}
                        onClick={() => handlePay(booking)}
                        className="bg-[rgb(255,39,130)] text-white hover:bg-[rgb(225,25,112)]"
                      >
                        {payingId === booking._id ? "Redirecting..." : "Pay Now"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel confirmation modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold text-black dark:text-white">Cancel this booking?</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Your request for &quot;{cancelTarget.serviceTitle}&quot; will be cancelled. You can
              send a new request later.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setCancelTarget(null)}>
                Keep Booking
              </Button>
              <Button
                type="button"
                disabled={cancelling}
                onClick={handleCancel}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
