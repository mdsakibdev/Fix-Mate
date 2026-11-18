import { ClipboardList, Clock, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

export default function CustomerOverviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">My Overview</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Track your repair requests and payments here.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Requests" value={0} icon={ClipboardList} />
        <StatCard title="Active Jobs" value={0} icon={Clock} />
        <StatCard title="Completed Jobs" value={0} icon={CheckCircle2} />
      </div>
    </div>
  );
}
