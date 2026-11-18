"use client";

import { useEffect, useState } from "react";
import { SERVER_URL, getToken } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

type UserRow = {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  createdAt: string;
};

const selectClass =
  "rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm capitalize text-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-white";

export function AdminUsersClient() {
  const { data: session } = useSession();
  const myEmail = session?.user?.email;

  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const loadUsers = async () => {
    const token = await getToken();
    const res = await fetch(`${SERVER_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      setUsers(data);
    } else {
      setError(data.message || "Failed to load users.");
    }
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;

    const fetchUsers = async () => {
      const token = await getToken();
      const res = await fetch(`${SERVER_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (cancelled) return;
      if (res.ok) {
        setUsers(data);
      } else {
        setError(data.message || "Failed to load users.");
      }
      setLoading(false);
    };

    fetchUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRoleChange = async (user: UserRow, role: string) => {
    setUpdatingId(user._id);
    setError("");
    setSuccess("");

    const token = await getToken();
    const res = await fetch(`${SERVER_URL}/api/admin/users/${user._id}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    setUpdatingId("");

    if (!res.ok) {
      setError(data.message || "Failed to update the role.");
      return;
    }
    setSuccess(`${user.name} is now a ${role}.`);
    loadUsers();
  };

  if (loading) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Users</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        View all users and change their roles.
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

      <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-160 text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isMe = user.email === myEmail;
              return (
                <tr key={user._id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-900">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.image}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(255,39,130)] text-sm font-semibold text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <div>
                        <p className="font-medium text-black dark:text-white">
                          {user.name} {isMe && <span className="text-xs text-zinc-400">(You)</span>}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      disabled={isMe || updatingId === user._id}
                      onChange={(e) => handleRoleChange(user, e.target.value)}
                      className={`${selectClass} disabled:opacity-50`}
                    >
                      <option value="customer">Customer</option>
                      <option value="technician">Technician</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
