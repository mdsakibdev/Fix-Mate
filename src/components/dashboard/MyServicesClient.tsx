"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SERVER_URL, getToken, uploadImageToImgBB } from "@/lib/api";
import type { Service } from "@/types";

const categories = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const serviceModes = ["Home Visit", "Shop Drop-off"];

const selectClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-white";

function badgeClass(status: string) {
  if (status === "approved") return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
  if (status === "rejected") return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
  return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
}

export function MyServicesClient() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    category: categories[0],
    description: "",
    basePrice: "",
    estimatedDuration: "",
    serviceMode: serviceModes[0],
    serviceArea: "",
    image: "",
  });
  const [editImageUploading, setEditImageUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadServices = async () => {
    const token = await getToken();
    const res = await fetch(`${SERVER_URL}/api/services/my`, {
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
    const res = await fetch(`${SERVER_URL}/api/services/my`, {
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


  const handleToggle = async (service: Service) => {
    const token = await getToken();
    const res = await fetch(`${SERVER_URL}/api/services/${service._id}/availability`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isAvailable: !service.isAvailable }),
    });
    if (res.ok) {
      loadServices();
    } else {
      setError("Failed to update availability.");
    }
  };

  const openEdit = (service: Service) => {
    setEditingId(service._id);
    setEditForm({
      title: service.title,
      category: service.category,
      description: service.description,
      basePrice: String(service.basePrice),
      estimatedDuration: service.estimatedDuration,
      serviceMode: service.serviceMode,
      serviceArea: service.serviceArea,
      image: service.image,
    });
    setError("");
    setSuccess("");
  };

  const handleEditImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImageUploading(true);
    const url = await uploadImageToImgBB(file);
    setEditImageUploading(false);
    if (url) {
      setEditForm((prev) => ({ ...prev, image: url }));
    } else {
      setError("Image upload failed. Please try again.");
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setSaving(true);
    setError("");
    setSuccess("");

    const token = await getToken();
    const res = await fetch(`${SERVER_URL}/api/services/${editingId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...editForm, basePrice: Number(editForm.basePrice) }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.message || "Failed to update the service.");
      return;
    }
    setSuccess("Service updated! It is waiting for admin approval again.");
    setEditingId(null);
    loadServices();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    const token = await getToken();
    const res = await fetch(`${SERVER_URL}/api/services/${deleteTarget._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setDeleting(false);
    setDeleteTarget(null);

    if (res.ok) {
      setSuccess("Service deleted.");
      loadServices();
    } else {
      setError("Failed to delete the service.");
    }
  };

  if (loading) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">My Services</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Manage the services you offer.
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

      {editingId && (
        <form
          onSubmit={handleSaveEdit}
          className="mt-6 space-y-4 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"
        >
          <h2 className="text-lg font-semibold">Edit Service</h2>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Service Title</label>
            <Input
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Category</label>
              <select
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className={selectClass}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Service Mode</label>
              <select
                value={editForm.serviceMode}
                onChange={(e) => setEditForm({ ...editForm, serviceMode: e.target.value })}
                className={selectClass}
              >
                {serviceModes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Description</label>
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              rows={3}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Base Price (USD)</label>
              <Input
                type="number"
                value={editForm.basePrice}
                onChange={(e) => setEditForm({ ...editForm, basePrice: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Estimated Duration</label>
              <Input
                value={editForm.estimatedDuration}
                onChange={(e) => setEditForm({ ...editForm, estimatedDuration: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Service Area</label>
            <Input
              value={editForm.serviceArea}
              onChange={(e) => setEditForm({ ...editForm, serviceArea: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Service Image</label>
            {editForm.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={editForm.image}
                alt="Service preview"
                className="mb-2 h-32 w-full max-w-xs rounded-xl border border-zinc-200 object-cover dark:border-zinc-800"
              />
            )}
            <Input type="file" accept="image/*" onChange={handleEditImage} />
            {editImageUploading && (
              <p className="mt-2 flex items-center gap-2 text-sm text-zinc-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading image...
              </p>
            )}
            <p className="mt-1 text-xs text-zinc-500">Choose a new file only if you want to change the image.</p>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={saving || editImageUploading}
              className="bg-[rgb(255,39,130)] text-white hover:bg-[rgb(225,25,112)]"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {services.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-zinc-200 p-8 text-center dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400">You have not added any service yet.</p>
          <Link
            href="/dashboard/technician/add-service"
            className="mt-3 inline-block font-medium text-[rgb(255,39,130)] hover:underline"
          >
            Add your first service
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-180 text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Approval</th>
                <th className="px-4 py-3 font-medium">Available</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
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
                  <td className="px-4 py-3">{service.category}</td>
                  <td className="px-4 py-3">${service.basePrice}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${badgeClass(service.approvalStatus)}`}>
                      {service.approvalStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      aria-label="Toggle availability"
                      onClick={() => handleToggle(service)}
                      className={`relative h-6 w-11 rounded-full ${service.isAvailable ? "bg-[rgb(255,39,130)]" : "bg-zinc-300 dark:bg-zinc-700"}`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${service.isAvailable ? "left-5.5" : "left-0.5"}`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        aria-label="Edit service"
                        onClick={() => openEdit(service)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:text-[rgb(255,39,130)] dark:border-zinc-800 dark:text-zinc-400"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete service"
                        onClick={() => setDeleteTarget(service)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:text-red-500 dark:border-zinc-800 dark:text-zinc-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold text-black dark:text-white">Delete this service?</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              “{deleteTarget.title}” will be permanently deleted. This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
