"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Moon, Sun, Wrench, LayoutDashboard, User, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
] as const;

function Brand() {
  return (
    <Link href="/" aria-label="FixMate home" className="flex items-center gap-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[rgb(255,39,130)] text-white shadow-sm">
        <Wrench className="size-5" />
      </span>
      <span className="text-xl font-semibold tracking-tight text-black dark:text-white">
        Fix<span className="text-[rgb(255,39,130)]">Mate</span>
      </span>
    </Link>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Moon className="dark:hidden" />
      <Sun className="hidden dark:block" />
    </Button>
  );
}

function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="hidden items-center md:flex">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "text-[rgb(255,39,130)] after:absolute after:inset-x-3 after:bottom-0.5 after:h-0.5 after:rounded-full after:bg-[rgb(255,39,130)]"
                : "text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = (user as { role?: string } | undefined)?.role || "customer";
  const dashboardHref =
    role === "admin"
      ? "/dashboard/admin"
      : role === "technician"
        ? "/dashboard/technician"
        : "/dashboard/customer";

  const handleSignOut = async () => {
    await authClient.signOut();
    setProfileOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Brand />

        <DesktopNav />

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          {/* Session is loading — keep space empty so buttons do not flash */}
          {isPending ? (
            <div className="hidden h-9 w-24 sm:block" />
          ) : !session ? (
            <>
              <Button
                variant="ghost"
                nativeButton={false}
                render={<Link href="/sign-in" />}
                className="hidden sm:inline-flex"
              >
                Sign In
              </Button>

              <Button
                nativeButton={false}
                render={<Link href="/sign-up" />}
                className="hidden bg-[rgb(255,39,130)] text-white hover:bg-[rgb(225,25,112)] sm:inline-flex"
              >
                Sign Up
              </Button>
            </>
          ) : (
            /* Logged in — avatar with dropdown */
            <div className="relative">
              <button
                type="button"
                aria-label="Open profile menu"
                onClick={() => setProfileOpen((open) => !open)}
                className="flex items-center"
              >
                {user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgb(255,39,130)] text-sm font-semibold text-white">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-60 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
                    <p className="text-sm font-semibold text-black dark:text-white">
                      {user?.name}
                    </p>
                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {user?.email}
                    </p>
                    <span className="mt-2 inline-block rounded-full bg-[rgba(255,39,130,0.1)] px-2.5 py-0.5 text-xs font-medium capitalize text-[rgb(255,39,130)]">
                      {role}
                    </span>
                  </div>

                  <Link
                    href={dashboardHref}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                  >
                    <User className="h-4 w-4" />
                    Update Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="md:hidden"
                />
              }
            >
              <Menu />
            </SheetTrigger>

            <SheetContent side="right" className="w-80 gap-0">
              <SheetHeader className="border-b p-4">
                <SheetTitle className="flex items-center gap-2.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[rgb(255,39,130)] text-white">
                    <Wrench className="size-5" />
                  </span>
                  <span className="text-xl font-semibold tracking-tight">
                    Fix<span className="text-[rgb(255,39,130)]">Mate</span>
                  </span>
                </SheetTitle>
              </SheetHeader>

              <nav aria-label="Mobile navigation" className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-[rgba(255,39,130,0.1)] text-[rgb(255,39,130)]"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                {session && (
                  <>
                    <Link
                      href={dashboardHref}
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                    >
                      Update Profile
                    </Link>
                  </>
                )}
              </nav>

              <div className="mt-auto flex flex-col gap-2 border-t p-4">
                {!session ? (
                  <>
                    <Button
                      variant="outline"
                      nativeButton={false}
                      render={<Link href="/sign-in" />}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full"
                    >
                      Sign In
                    </Button>
                    <Button
                      nativeButton={false}
                      render={<Link href="/sign-up" />}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full bg-[rgb(255,39,130)] text-white hover:bg-[rgb(225,25,112)]"
                    >
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full text-red-500"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
