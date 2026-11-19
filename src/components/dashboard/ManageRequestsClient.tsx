"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export function ManageRequestsClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [completeTarget, setCompleteTarget] = useState<Booking | null>(null);
  const [finalAmount, setFinalAmount] = useState("");

  const loadBookings = async () => {
    const token = await getToken();
    const res = await fetch(`${SERVER_URL}/api/bookings/technician`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      setBookings(data);
    } else {
      setError(data.message || "Failed to load requests.");
    }
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;

    const fetchBookings = async () => {
      const token = await getToken();
      const res = await fetch(`${SERVER_URL}/api/bookings/technician`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (cancelled) return;
      if (res.ok) {
        setBookings(data);
      } else {
        setError(data.message || "Failed to load requests.");
      }
      setLoading(false);
    };

    fetchBookings();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateStatus = async (booking: Booking, status: string, amount?: number) => {
    setUpdatingId(booking._id);

    const token = await getToken();
    const res = await fetch(`${SERVER_URL}/api/bookings/${booking._id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, finalAmount: amount }),
    });
    const data = await res.json();
    setUpdatingId("");

    if (!res.ok) {
      toast.error(data.message || "Failed to update the booking.");
      return;
    }
    toast.success(data.message);
    setCompleteTarget(null);
    loadBookings();
  };

  const handleComplete = () => {
    if (!completeTarget) return;
    const amount = Number(finalAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid final amount.");
      return;
    }
    updateStatus(completeTarget, "completed", amount);
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
      <h1 className="text-2xl font-bold">Manage Requests</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Accept requests and move each job through the repair pipeline.
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
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${filter === item.value
              ? "bg-[rgb(249,115,22)] text-white"
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
              ? "No repair requests yet. When a customer requests one of your services, it will appear here."
              : "No requests found in this list."}
          </p>
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
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${booking.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                        }`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Customer: {booking.customerName} · Phone: {booking.customerPhone}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Address: {booking.address} · Preferred date: {booking.preferredDate}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {booking.problemDescription}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Amount:{" "}
                      <span className="text-base font-bold text-[rgb(249,115,22)]">
                        ${booking.finalAmount}
                      </span>
                    </p>
                    <div className="flex gap-2">
                      {booking.status === "requested" && (
                        <>
                          <Button
                            type="button"
                            size="sm"
                            disabled={updatingId === booking._id}
                            onClick={() => updateStatus(booking, "accepted")}
                            className="bg-green-500 text-white hover:bg-green-600"
                          >
                            Accept
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            disabled={updatingId === booking._id}
                            onClick={() => updateStatus(booking, "rejected")}
                            className="bg-red-500 text-white hover:bg-red-600"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {booking.status === "accepted" && (
                        <Button
                          type="button"
                          size="sm"
                          disabled={updatingId === booking._id}
                          onClick={() => updateStatus(booking, "in-progress")}
                          className="bg-[rgb(249,115,22)] text-white hover:bg-[rgb(234,88,12)]"
                        >
                          Start Work
                        </Button>
                      )}
                      {booking.status === "in-progress" && (
                        <Button
                          type="button"
                          size="sm"
                          disabled={updatingId === booking._id}
                          onClick={() => {
                            setCompleteTarget(booking);
                            setFinalAmount(String(booking.finalAmount));
                          }}
                          className="bg-green-500 text-white hover:bg-green-600"
                        >
                          Mark Completed
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Complete job modal */}
      {completeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold text-black dark:text-white">Complete this job</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Enter the final amount for &quot;{completeTarget.serviceTitle}&quot;. The customer
              will pay this amount.
            </p>
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium">Final Amount (USD)</label>
              <Input
                type="number"
                min="1"
                value={finalAmount}
                onChange={(e) => setFinalAmount(e.target.value)}
              />
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setCompleteTarget(null)}>
                Cancel
              </Button>
              <Button
                type="button"
                disabled={updatingId === completeTarget._id}
                onClick={handleComplete}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                {updatingId === completeTarget._id ? "Saving..." : "Mark Completed"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
