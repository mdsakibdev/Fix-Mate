"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wrench, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const { data, error: signInError } = await signIn.email({
      email,
      password,
    });
    setLoading(false);

    if (signInError) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    const role = (data?.user as { role?: string } | undefined)?.role || "customer";
    router.push(
      role === "admin"
        ? "/dashboard/admin"
        : role === "technician"
          ? "/dashboard/technician"
          : "/dashboard/customer"
    );
    router.refresh();
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
      <Link href="/" className="flex items-center justify-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgb(255,39,130)]">
          <Wrench className="h-5 w-5 text-white" />
        </span>
        <span className="text-xl font-bold text-black dark:text-white">
          Fix<span className="text-[rgb(255,39,130)]">Mate</span>
        </span>
      </Link>

      <h1 className="mt-6 text-center text-2xl font-bold text-black dark:text-white">
        Welcome back
      </h1>
      <p className="mt-1 text-center text-sm text-zinc-600 dark:text-zinc-400">
        Sign in to your FixMate account
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
            {error}
          </p>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
            Email
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
            Password
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[rgb(255,39,130)] text-white hover:bg-[rgb(225,25,112)]"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
        Do not have an account?{" "}
        <Link href="/sign-up" className="font-medium text-[rgb(255,39,130)] hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
