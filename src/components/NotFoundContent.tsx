import Link from "next/link";
import { Wrench } from "lucide-react";

export function NotFoundContent() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgb(249,115,22)]">
        <Wrench className="h-7 w-7 text-white" />
      </span>
      <h1 className="mt-6 text-4xl font-bold text-black dark:text-white">404</h1>
      <p className="mt-2 text-lg font-medium text-black dark:text-white">Page not found</p>
      <p className="mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
        The page you are looking for does not exist or may have been moved.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-[rgb(249,115,22)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[rgb(234,88,12)]"
        >
          Go to Home
        </Link>
        <Link
          href="/services"
          className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-black dark:border-zinc-700 dark:text-white"
        >
          Browse Services
        </Link>
      </div>
    </div>
  );
}
