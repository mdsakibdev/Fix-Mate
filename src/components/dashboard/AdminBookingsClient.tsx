"use client";

import { useEffect, useState } from "react";
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

export function AdminBookingsClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchBookings = async () => {
      const token = await getToken();
      const res = await fetch(`${SERVER_URL}/api/admin/bookings`, {
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

  const visibleBookings =
    filter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === filter);

  if (loading) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">All Bookings</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Monitor every repair booking on the platform.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {error}
        </p>
      )}

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
          <p className="text-zinc-600 dark:text-zinc-400">No bookings found.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-215 text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Technician</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Payment</th>
              </tr>
            </thead>
            <tbody>
              {visibleBookings.map((booking) => (
                <tr key={booking._id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-900">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={booking.serviceImage}
                        alt={booking.serviceTitle}
                        className="h-11 w-11 rounded-lg object-cover"
                      />
                      <span className="font-medium">{booking.serviceTitle}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p>{booking.customerName}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{booking.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3">{booking.technicianName}</td>
                  <td className="px-4 py-3 font-semibold text-[rgb(249,115,22)]">
                    ${booking.finalAmount}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${booking.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                        }`}
                    >
                      {booking.paymentStatus}
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
