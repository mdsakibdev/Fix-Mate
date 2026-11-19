import { Fragment } from "react";
import { Check, X } from "lucide-react";

type HistoryItem = {
  status: string;
  changedAt: string;
};

type BookingTimelineProps = {
  status: string;
  paymentStatus: string;
  statusHistory?: HistoryItem[];
  createdAt?: string;
};

const steps = [
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "paid", label: "Paid" },
];

const statusIndex: Record<string, number> = {
  requested: 0,
  accepted: 1,
  "in-progress": 2,
  completed: 3,
};

export function BookingTimeline({
  status,
  paymentStatus,
  statusHistory = [],
  createdAt,
}: BookingTimelineProps) {
  const formatDate = (value?: string) =>
    value
      ? new Date(value).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";

  const dateFor = (key: string) => {
    const item = statusHistory.find((history) => history.status === key);
    if (item) return formatDate(item.changedAt);
    if (key === "requested") return formatDate(createdAt);
    return "";
  };

  // Rejected and cancelled bookings do not follow the stepper
  if (status === "rejected" || status === "cancelled") {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
        <X className="h-4 w-4 shrink-0" />
        <span>
          {status === "rejected"
            ? "This request was rejected by the technician."
            : "You cancelled this request."}
          {dateFor(status) && (
            <span className="text-zinc-500 dark:text-zinc-400"> · {dateFor(status)}</span>
          )}
        </span>
      </div>
    );
  }

  const currentIndex = paymentStatus === "paid" ? 4 : statusIndex[status] ?? 0;

  return (
    <div className="mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
      <div className="flex items-start">
        {steps.map((step, index) => {
          const done = index <= currentIndex;
          return (
            <Fragment key={step.key}>
              <div className="flex w-14 shrink-0 flex-col items-center text-center sm:w-16">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    done
                      ? "bg-[rgb(249,115,22)] text-white"
                      : "border border-zinc-300 text-zinc-400 dark:border-zinc-700"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : index + 1}
                </span>
                <span
                  className={`mt-1.5 text-[11px] sm:text-xs ${
                    done
                      ? "font-medium text-black dark:text-white"
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  {step.label}
                </span>
                <span className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                  {dateFor(step.key)}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mt-4 h-0.5 flex-1 ${
                    index < currentIndex
                      ? "bg-[rgb(249,115,22)]"
                      : "bg-zinc-200 dark:bg-zinc-700"
                  }`}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
