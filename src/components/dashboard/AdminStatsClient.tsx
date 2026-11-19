"use client";

import { useEffect, useState } from "react";
import { SERVER_URL, getToken } from "@/lib/api";
import { StatBox } from "./StatBox";

type AdminStats = {
  totalUsers: number;
  totalTechnicians: number;
  totalServices: number;
  pendingServices: number;
  totalBookings: number;
  totalRevenue: number;
  bookingsByStatus: Record<string, number>;
};

export function AdminStatsClient() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      const token = await getToken();
      const res = await fetch(`${SERVER_URL}/api/stats/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (cancelled) return;
      if (res.ok) {
        setStats(data);
      } else {
        setError(data.message || "Failed to load stats.");
      }
    };

    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
        {error}
      </p>
    );
  }

  if (!stats) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>;
  }

  const chartData = [
    { label: "Requested", value: stats.bookingsByStatus.requested || 0, color: "bg-amber-500" },
    { label: "Accepted", value: stats.bookingsByStatus.accepted || 0, color: "bg-sky-500" },
    { label: "In Progress", value: stats.bookingsByStatus["in-progress"] || 0, color: "bg-violet-500" },
    { label: "Completed", value: stats.bookingsByStatus.completed || 0, color: "bg-green-500" },
    { label: "Rejected", value: stats.bookingsByStatus.rejected || 0, color: "bg-red-500" },
    { label: "Cancelled", value: stats.bookingsByStatus.cancelled || 0, color: "bg-zinc-400" },
  ];
  const maxValue = Math.max(...chartData.map((item) => item.value), 1);

  return (
    <div>
      <h1 className="text-2xl font-bold">Overview</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        A quick look at the whole platform.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatBox title="Total Users" value={stats.totalUsers} />
        <StatBox title="Technicians" value={stats.totalTechnicians} />
        <StatBox title="Total Services" value={stats.totalServices} />
        <StatBox title="Pending Approvals" value={stats.pendingServices} />
        <StatBox title="Total Bookings" value={stats.totalBookings} />
        <StatBox title="Total Revenue" value={`$${stats.totalRevenue}`} />
      </div>

      {/* Bookings by status chart (plain CSS bars, no library) */}
      <div className="mt-6 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
        <h2 className="font-semibold text-black dark:text-white">Bookings by Status</h2>
        <div className="mt-4 space-y-3">
          {chartData.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-sm text-zinc-600 dark:text-zinc-400">
                {item.label}
              </span>
              <div className="h-6 flex-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className={`h-6 rounded-full ${item.color}`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-sm font-semibold text-black dark:text-white">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
