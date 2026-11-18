import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number;
  icon: LucideIcon;
};

export function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(255,39,130,0.1)]">
        <Icon className="h-6 w-6 text-[rgb(255,39,130)]" />
      </span>
      <div>
        <p className="text-2xl font-bold text-black dark:text-white">{value}</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{title}</p>
      </div>
    </div>
  );
}
