"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth-client";
import { SERVER_URL, getToken } from "@/lib/api";

export function RequestRepair({ serviceId }: { serviceId: string }) {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const user = session?.user;
    const role = (user as { role?: string } | undefined)?.role || "customer";

    const [showForm, setShowForm] = useState(false);
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [preferredDate, setPreferredDate] = useState("");
    const [problemDescription, setProblemDescription] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const MAX_PROBLEM_LENGTH = 500;


    const today = new Date().toISOString().split("T")[0];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!phone || !address || !preferredDate || !problemDescription) {
            setError("Please fill in all fields.");
            return;
        }
        if (problemDescription.trim().length < 20) {
            setError("Problem description must be at least 20 characters.");
            return;
        }

        setLoading(true);
        try {
            const token = await getToken();
            const res = await fetch(`${SERVER_URL}/api/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    serviceId,
                    phone,
                    address,
                    preferredDate,
                    problemDescription,
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to send the request.");
                return;
            }
            setSuccess(true);
        } catch {
            setError("Something went wrong. Please check the server is running.");
        } finally {
            setLoading(false);
        }
    };

    if (isPending) {
        return <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>;
    }

    if (!session) {
        return (
            <div>
                <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                    Please sign in as a customer to request this repair.
                </p>
                <Button
                    onClick={() => router.push("/sign-in")}
                    className="w-full bg-[rgb(255,39,130)] text-white hover:bg-[rgb(225,25,112)]"
                >
                    Request Repair
                </Button>
            </div>
        );
    }

    if (role !== "customer") {
        return (
            <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                Only customers can request a repair.
            </p>
        );
    }

    if (success) {
        return (
            <div className="rounded-lg bg-green-50 px-4 py-3 dark:bg-green-950">
                <p className="text-sm text-green-700 dark:text-green-400">
                    Your repair request has been sent successfully!
                </p>
                <Link
                    href="/dashboard/customer/bookings"
                    className="mt-2 inline-block text-sm font-medium text-[rgb(255,39,130)] hover:underline"
                >
                    Go to My Bookings →
                </Link>
            </div>
        );
    }

    if (!showForm) {
        return (
            <Button
                onClick={() => setShowForm(true)}
                className="w-full bg-[rgb(255,39,130)] text-white hover:bg-[rgb(225,25,112)]"
            >
                Request Repair
            </Button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
                    {error}
                </p>
            )}

            <div>
                <label className="mb-1.5 block text-sm font-medium">Name</label>
                <Input value={user?.name || ""} readOnly />
            </div>
            <div>
                <label className="mb-1.5 block text-sm font-medium">Email</label>
                <Input value={user?.email || ""} readOnly />
            </div>
            <div>
                <label className="mb-1.5 block text-sm font-medium">Phone</label>
                <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 01700000000"
                />
            </div>
            <div>
                <label className="mb-1.5 block text-sm font-medium">Address</label>
                <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Your service / pickup address"
                />
            </div>
            <div>
                <label className="mb-1.5 block text-sm font-medium">Preferred Date</label>
                <Input
                    type="date"
                    min={today}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                />
            </div>
            <div>
                <label className="mb-1.5 block text-sm font-medium">Problem Description</label>
                <textarea
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="Describe the problem in detail (device model, what is wrong, since when...)"
                    rows={4}
                    maxLength={MAX_PROBLEM_LENGTH}
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                />
                <div className="mt-1 flex items-center justify-between text-xs">
                    <span
                        className={
                            problemDescription.trim().length < 20
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-green-600 dark:text-green-400"
                        }
                    >
                        {problemDescription.trim().length < 20
                            ? "Minimum 20 characters"
                            : "Looks good"}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400">
                        {problemDescription.length} / {MAX_PROBLEM_LENGTH}
                    </span>
                </div>
            </div>


            <div className="flex gap-3">
                <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[rgb(255,39,130)] text-white hover:bg-[rgb(225,25,112)]"
                >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loading ? "Sending..." : "Send Request"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
