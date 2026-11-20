"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Wrench, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";
import GoogleButton from "@/components/auth/GoogleButton";

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const { data, error: signInError } = await signIn.email({
      email,
      password,
    });

    if (signInError) {
      setLoading(false);
      toast.error("Invalid email or password. Please try again.");
      return;
    }

    toast.success("Welcome back!");

    // If the user was sent here from a page (e.g. a service details page),
    // send them back there; otherwise go to their role's dashboard.
    // A full page load (location.assign) is used on purpose: the brand-new
    // session cookie is always sent with it, so one click is enough.
    if (callbackUrl && callbackUrl.startsWith("/")) {
      window.location.assign(callbackUrl);
    } else {
      const role = (data?.user as { role?: string } | undefined)?.role || "customer";
      window.location.assign(
        role === "admin"
          ? "/dashboard/admin"
          : role === "technician"
            ? "/dashboard/technician"
            : "/dashboard/customer"
      );
    }
  };

  // Google users land back on the page they came from, or on the customer
  // dashboard (a Google account always gets the "customer" role).
  const googleCallbackUrl =
    callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard/customer";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
      <Link href="/" className="flex items-center justify-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgb(249,115,22)]">
          <Wrench className="h-5 w-5 text-white" />
        </span>
        <span className="text-xl font-bold text-black dark:text-white">
          Fix<span className="text-[rgb(249,115,22)]">Mate</span>
        </span>
      </Link>

      <h1 className="mt-6 text-center text-2xl font-bold text-black dark:text-white">
        Welcome back
      </h1>
      <p className="mt-1 text-center text-sm text-zinc-600 dark:text-zinc-400">
        Sign in to your FixMate account
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
          className="w-full bg-[rgb(249,115,22)] text-white hover:bg-[rgb(234,88,12)]"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-xs text-zinc-500 dark:text-zinc-400">or continue with</span>
        <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <GoogleButton callbackURL={googleCallbackUrl} label="Sign in with Google" />

      <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
        Do not have an account?{" "}
        <Link href="/sign-up" className="font-medium text-[rgb(249,115,22)] hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
