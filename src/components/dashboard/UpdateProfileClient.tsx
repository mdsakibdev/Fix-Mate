"use client";

import { useEffect, useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";

export function UpdateProfileClient() {
  const { data: session } = useSession();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [filled, setFilled] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Prefill once when the session loads
  useEffect(() => {
    if (session?.user && !filled) {
      const user = session.user as typeof session.user & {
        phone?: string;
        area?: string;
        bio?: string;
      };
      setName(user.name || "");
      setPhone(user.phone || "");
      setArea(user.area || "");
      setBio(user.bio || "");
      setImageUrl(user.image || "");
      setFilled(true);
    }
  }, [session, filled]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    setUploading(false);
    if (data.success) {
      setImageUrl(data.data.url);
    } else {
      setError("Image upload failed. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    const { error } = await authClient.updateUser({
      name,
      image: imageUrl,
      phone,
      area,
      bio,
    });
    setSaving(false);
    if (error) {
      setError(error.message || "Failed to update profile.");
      return;
    }
    setSuccess("Profile updated successfully.");
  };

  if (!session) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>;
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-[rgb(255,39,130)] dark:border-zinc-700 dark:bg-zinc-950 dark:text-white";

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Update Profile</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Update your name, contact info and photo.
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

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="flex items-center gap-4">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={name} className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[rgb(255,39,130)] text-2xl font-semibold text-white">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
          <div>
            <label className="cursor-pointer rounded-lg bg-[rgb(255,39,130)] px-4 py-2 text-sm font-medium text-white">
              {uploading ? "Uploading..." : "Change Photo"}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Photo is uploaded with ImgBB.</p>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input value={session.user.email} disabled className={`${inputClass} opacity-60`} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Role</label>
          <input value={session.user.role} disabled className={`${inputClass} capitalize opacity-60`} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" className={inputClass} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Area</label>
          <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. Dhaka" className={inputClass} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Tell customers a little about yourself..." className={inputClass} />
        </div>

        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-lg bg-[rgb(255,39,130)] px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
