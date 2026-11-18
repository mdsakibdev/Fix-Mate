"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth-client";
import { SERVER_URL, getToken } from "@/lib/api";

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

async function uploadImageToImgBB(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
    { method: "POST", body: formData }
  );
  const data = await res.json();
  return (data?.data?.url as string) || "";
}

export default function AddServicePage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [serviceMode, setServiceMode] = useState(serviceModes[0]);
  const [serviceArea, setServiceArea] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Upload the image to ImgBB as soon as it is selected,
  // so the preview and URL are visible before submitting.
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setImageUrl("");
    setImageUploading(true);

    const url = await uploadImageToImgBB(file);
    setImageUploading(false);

    if (!url) {
      setError("Image upload failed. Please try again.");
      return;
    }
    setImageUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title || !description || !basePrice || !estimatedDuration || !serviceArea) {
      setError("Please fill in all fields.");
      return;
    }
    if (Number(basePrice) <= 0) {
      setError("Base price must be a positive number.");
      return;
    }
    if (imageUploading) {
      setError("Please wait for the image to finish uploading.");
      return;
    }
    if (!imageUrl) {
      setError("Please choose a service image.");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${SERVER_URL}/api/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          category,
          description,
          image: imageUrl,
          basePrice: Number(basePrice),
          estimatedDuration,
          serviceMode,
          serviceArea,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to add the service.");
        return;
      }

      setSuccess("Service added successfully! It is now waiting for admin approval.");
      setTitle("");
      setDescription("");
      setBasePrice("");
      setEstimatedDuration("");
      setServiceArea("");
      setImageUrl("");
    } catch {
      setError("Something went wrong. Please check the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Add a Service</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Your service will be visible to customers after admin approval.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600 dark:bg-green-950 dark:text-green-400">
            {success}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Technician Name</label>
            <Input value={user?.name || ""} readOnly />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Technician Email</label>
            <Input value={user?.email || ""} readOnly />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Service Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. iPhone Screen Replacement"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Service Mode</label>
            <select value={serviceMode} onChange={(e) => setServiceMode(e.target.value)} className={selectClass}>
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this service include?"
            rows={4}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Base Price (USD)</label>
            <Input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="e.g. 50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Estimated Duration</label>
            <Input
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              placeholder="e.g. 2-3 hours"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Service Area</label>
          <Input
            value={serviceArea}
            onChange={(e) => setServiceArea(e.target.value)}
            placeholder="e.g. Dhanmondi, Dhaka"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Service Image</label>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          {imageUploading && (
            <p className="mt-2 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading image...
            </p>
          )}
          {imageUrl && (
            <div className="mt-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Service preview"
                className="h-40 w-full max-w-sm rounded-xl border border-zinc-200 object-cover dark:border-zinc-800"
              />
              <p className="mt-2 break-all text-xs text-zinc-500 dark:text-zinc-400">{imageUrl}</p>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || imageUploading}
          className="bg-[rgb(255,39,130)] text-white hover:bg-[rgb(225,25,112)]"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Adding..." : "Add Service"}
        </Button>
      </form>
    </div>
  );
}
