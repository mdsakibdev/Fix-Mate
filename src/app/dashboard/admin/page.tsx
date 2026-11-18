import { Users, Wrench, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

export default function AdminOverviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Overview</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Monitor the whole platform from here.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Users" value={0} icon={Users} />
        <StatCard title="Total Technicians" value={0} icon={Wrench} />
        <StatCard title="Pending Services" value={0} icon={Clock} />
      </div>
    </div>
  );
}
