import { Wrench, CheckCircle2, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

export default function TechnicianOverviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Technician Overview</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Manage your services and repair requests here.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Services" value={0} icon={Wrench} />
        <StatCard title="Approved Services" value={0} icon={CheckCircle2} />
        <StatCard title="Pending Requests" value={0} icon={Clock} />
      </div>
    </div>
  );
}
