"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Wrench, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/auth-client";
import GoogleButton from "@/components/auth/GoogleButton";

function getPasswordErrors(password: string) {
  const errors: string[] = [];
  if (password.length < 6) errors.push("Password must be at least 6 characters long");
  if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter");
  return errors;
}

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "technician">("customer");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const errors = getPasswordErrors(password);
    setPasswordErrors(errors);
    if (errors.length > 0) return;

    setLoading(true);
    const { error: signUpError } = await signUp.email({
      name,
      email,
      password,
      role,
    });

    if (signUpError) {
      setLoading(false);
      toast.error(signUpError.message || "Sign up failed. Please try again.");
      return;
    }

    toast.success("Account created successfully!");
    // Full page load on purpose (same as sign-in): the brand-new session
    // cookie is always sent with it, so one click is enough.
    window.location.assign(role === "technician" ? "/dashboard/technician" : "/dashboard/customer");
  };

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
        Create an account
      </h1>
      <p className="mt-1 text-center text-sm text-zinc-600 dark:text-zinc-400">
        Join FixMate as a customer or a technician
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
            Full Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
          />
        </div>

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
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordErrors.length > 0) setPasswordErrors(getPasswordErrors(e.target.value));
            }}
            placeholder="Enter a password"
          />
          {passwordErrors.map((message) => (
            <p key={message} className="mt-1.5 text-sm text-red-500">
              {message}
            </p>
          ))}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-black dark:text-white">
            I am a
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${
                role === "customer"
                  ? "border-[rgb(249,115,22)] bg-[rgba(249,115,22,0.1)] text-[rgb(249,115,22)]"
                  : "border-zinc-200 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
              }`}
            >
              <User className="h-4 w-4" />
              Customer
            </button>
            <button
              type="button"
              onClick={() => setRole("technician")}
              className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${
                role === "technician"
                  ? "border-[rgb(249,115,22)] bg-[rgba(249,115,22,0.1)] text-[rgb(249,115,22)]"
                  : "border-zinc-200 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
              }`}
            >
              <Wrench className="h-4 w-4" />
              Technician
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[rgb(249,115,22)] text-white hover:bg-[rgb(234,88,12)]"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-xs text-zinc-500 dark:text-zinc-400">or continue with</span>
        <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <GoogleButton callbackURL="/dashboard/customer" label="Sign up with Google" />
      <p className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
        Google sign-up creates a Customer account. To join as a Technician, please
        use the form above.
      </p>

      <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-[rgb(249,115,22)] hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
