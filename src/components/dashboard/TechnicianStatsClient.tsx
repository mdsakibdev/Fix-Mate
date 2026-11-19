"use client";

import { useEffect, useState } from "react";
import { SERVER_URL, getToken } from "@/lib/api";
import { StatBox } from "./StatBox";

type TechnicianStats = {
  totalServices: number;
  pendingApproval: number;
  totalRequests: number;
  completedJobs: number;
  totalEarnings: number;
};

export function TechnicianStatsClient() {
  const [stats, setStats] = useState<TechnicianStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      const token = await getToken();
      const res = await fetch(`${SERVER_URL}/api/stats/technician`, {
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
        A quick look at your services, jobs and earnings.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatBox title="Total Services" value={stats.totalServices} />
        <StatBox title="Pending Approval" value={stats.pendingApproval} />
        <StatBox title="Total Requests" value={stats.totalRequests} />
        <StatBox title="Completed Jobs" value={stats.completedJobs} />
        <StatBox title="Total Earnings" value={`$${stats.totalEarnings}`} />
      </div>
    </div>
  );
}
