"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Wrench,
  Home,
  LogOut,
  LayoutDashboard,
  ClipboardList,
  CreditCard,
  User,
  PlusCircle,
  ListChecks,
  Users,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const menus: Record<string, MenuItem[]> = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { label: "My Bookings", href: "/dashboard/customer/bookings", icon: ClipboardList },
    { label: "Payment History", href: "/dashboard/customer/payments", icon: CreditCard },
    { label: "Update Profile", href: "/dashboard/profile", icon: User },
  ],
  technician: [
    { label: "Overview", href: "/dashboard/technician", icon: LayoutDashboard },
    { label: "Add Service", href: "/dashboard/technician/add-service", icon: PlusCircle },
    { label: "My Services", href: "/dashboard/technician/my-services", icon: Wrench },
    { label: "Manage Requests", href: "/dashboard/technician/requests", icon: ListChecks },
    { label: "Update Profile", href: "/dashboard/profile", icon: User },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Service Approval", href: "/dashboard/admin/services", icon: CheckCircle2 },
    { label: "All Bookings", href: "/dashboard/admin/bookings", icon: ClipboardList },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },
    { label: "Update Profile", href: "/dashboard/profile", icon: User },
  ],
};

function SidebarContent({
  role,
  pathname,
  onNavigate,
  onSignOut,
}: {
  role: string;
  pathname: string;
  onNavigate?: () => void;
  onSignOut: () => void;
}) {
  const items = menus[role] || menus.customer;

  return (
    <div className="flex h-full flex-col">
      <Link href="/" onClick={onNavigate} className="flex items-center gap-2 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgb(255,39,130)]">
          <Wrench className="h-5 w-5 text-white" />
        </span>
        <span className="text-xl font-bold text-black dark:text-white">
          Fix<span className="text-[rgb(255,39,130)]">Mate</span>
        </span>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {items.map((item) => {
          const isOverview = item.href === `/dashboard/${role}`;
          const isActive = isOverview
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                isActive
                  ? "bg-[rgba(255,39,130,0.1)] text-[rgb(255,39,130)]"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = (user as { role?: string } | undefined)?.role || "customer";
  const dashboardHref = `/dashboard/${role}`;

  // Which role does this route need? /dashboard/profile is open to all roles.
  const requiredRole = pathname.startsWith("/dashboard/admin")
    ? "admin"
    : pathname.startsWith("/dashboard/technician")
      ? "technician"
      : pathname.startsWith("/dashboard/customer")
        ? "customer"
        : null;
  const isWrongRole = requiredRole !== null && requiredRole !== role;

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.push("/sign-in");
    } else if (isWrongRole) {
      router.push(dashboardHref);
    }
  }, [isPending, session, isWrongRole, dashboardHref, router]);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  if (isPending || !session || isWrongRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white text-black dark:bg-black dark:text-white">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 dark:border-zinc-800 lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent role={role} pathname={pathname} onSignOut={handleSignOut} />
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-4 text-zinc-500"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent
              role={role}
              pathname={pathname}
              onNavigate={() => setSidebarOpen(false)}
              onSignOut={handleSignOut}
            />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800 sm:px-6">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
            className="text-zinc-600 dark:text-zinc-400 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="hidden font-semibold lg:block">Dashboard</span>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-[rgb(255,39,130)] dark:text-zinc-400"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <div className="flex items-center gap-2.5">
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt={user.name || "User"} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgb(255,39,130)] text-sm font-semibold text-white">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
              <div className="hidden sm:block">
                <p className="text-sm font-medium leading-tight">{user?.name}</p>
                <p className="text-xs capitalize leading-tight text-zinc-500 dark:text-zinc-400">{role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
