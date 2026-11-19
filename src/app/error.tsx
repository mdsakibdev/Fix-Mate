"use client";

import Link from "next/link";
import { CircleAlert } from "lucide-react";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950">
        <CircleAlert className="h-7 w-7 text-red-500" />
      </span>
      <h1 className="mt-6 text-2xl font-bold text-black dark:text-white">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
        An unexpected error happened. Please try again, or go back to the home page.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-[rgb(255,39,130)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[rgb(225,25,112)]"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-black dark:border-zinc-700 dark:text-white"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
