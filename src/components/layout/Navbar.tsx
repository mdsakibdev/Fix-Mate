"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Moon, Sun, Wrench } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
] as const

function Brand() {
  return (
    <Link
      href="/"
      aria-label="FixMate home"
      className="flex items-center gap-2.5"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white shadow-sm">
        <Wrench className="size-5" />
      </span>
      <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
        Fix<span className="text-brand">Mate</span>
      </span>
    </Link>
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {/* Rendered with CSS so the correct icon shows before hydration (also covers system theme). */}
      <Moon className="dark:hidden" />
      <Sun className="hidden dark:block" />
    </Button>
  )
}

function DesktopNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Main navigation" className="hidden items-center md:flex">
      {navLinks.map((link) => {
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "text-brand after:absolute after:inset-x-3 after:bottom-0.5 after:h-0.5 after:rounded-full after:bg-brand"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Brand />

        <DesktopNav />

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

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
            className="hidden bg-brand text-white hover:bg-brand/90 sm:inline-flex"
          >
            Get Started
          </Button>

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
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
                    <Wrench className="size-5" />
                  </span>
                  <span className="text-lg font-semibold tracking-tight">
                    Fix<span className="text-brand">Mate</span>
                  </span>
                </SheetTitle>
              </SheetHeader>

              <nav
                aria-label="Mobile navigation"
                className="flex flex-col gap-1 p-4"
              >
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-brand/10 text-brand"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </nav>

              <div className="mt-auto flex flex-col gap-2 border-t p-4">
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
                  className="w-full bg-brand text-white hover:bg-brand/90"
                >
                  Get Started
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
