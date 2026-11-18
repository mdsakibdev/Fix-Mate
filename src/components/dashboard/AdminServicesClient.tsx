"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SERVER_URL, getToken } from "@/lib/api";
import type { Service } from "@/types";

const filters = [
  { label: "Pending", value: "pending" },
  { label: "All", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

function badgeClass(status: string) {
  if (status === "approved") return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
  if (status === "rejected") return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
  return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
}

export function AdminServicesClient() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadServices = async () => {
    const token = await getToken();
    const res = await fetch(`${SERVER_URL}/api/admin/services`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      setServices(data);
    } else {
      setError(data.message || "Failed to load services.");
    }
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;

    const fetchServices = async () => {
      const token = await getToken();
      const res = await fetch(`${SERVER_URL}/api/admin/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (cancelled) return;
      if (res.ok) {
        setServices(data);
      } else {
        setError(data.message || "Failed to load services.");
      }
      setLoading(false);
    };

    fetchServices();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleApproval = async (id: string, approvalStatus: "approved" | "rejected") => {
    setError("");
    setSuccess("");
    const token = await getToken();
    const res = await fetch(`${SERVER_URL}/api/admin/services/${id}/approval`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ approvalStatus }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Failed to update the service.");
      return;
    }
    setSuccess(`Service ${approvalStatus}.`);
    loadServices();
  };

  const visibleServices =
    filter === "all"
      ? services
      : services.filter((service) => service.approvalStatus === filter);

  if (loading) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Service Approval</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Approve or reject services added by technicians.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600 dark:bg-green-950 dark:text-green-400">
          {success}
        </p>
      )}

      {/* Filter buttons */}
      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              filter === item.value
                ? "bg-[rgb(255,39,130)] text-white"
                : "border border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {visibleServices.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-zinc-200 p-8 text-center dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400">No services found in this list.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Technician</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleServices.map((service) => (
                <tr key={service._id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-900">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={service.image}
                        alt={service.title}
                        className="h-11 w-11 rounded-lg object-cover"
                      />
                      <span className="font-medium">{service.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p>{service.technicianName}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{service.technicianEmail}</p>
                  </td>
                  <td className="px-4 py-3">{service.category}</td>
                  <td className="px-4 py-3">${service.basePrice}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${badgeClass(service.approvalStatus)}`}>
                      {service.approvalStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {service.approvalStatus === "pending" ? (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleApproval(service._id, "approved")}
                          className="bg-green-500 text-white hover:bg-green-600"
                        >
                          Approve
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleApproval(service._id, "rejected")}
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
