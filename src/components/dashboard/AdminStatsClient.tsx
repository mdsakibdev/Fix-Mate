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
    </div>
  );
}
