import Link from "next/link";
import { Wrench, Mail, Phone, MapPin } from "lucide-react";
import { CopyrightYear } from "@/components/layout/CopyrightYear";


const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How It Works / About", href: "/about" },
  { label: "Sign In", href: "/sign-in" },
  { label: "Sign Up", href: "/sign-up" },
];

const categories = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

// Social icons — lucide-react no longer has brand icons, so simple inline SVGs
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socials = [
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "LinkedIn", href: "#", icon: LinkedinIcon },
  { label: "X", href: "#", icon: XIcon },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white text-black dark:border-zinc-800 dark:bg-black dark:text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgb(249,115,22)]">
              <Wrench className="h-5 w-5 text-white" />
            </span>
            <span className="text-xl font-bold">
              Fix<span className="text-[rgb(249,115,22)]">Mate</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Trusted device and home appliance repair service. Verified
            technicians, trackable jobs, and payment only after your
            repair is done.
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify support justify-center rounded-full border border-zinc-300 text-zinc-600 transition hover:border-[rgb(249,115,22)] hover:text-[rgb(249,115,22)] dark:border-zinc-800 dark:text-zinc-400"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-base font-semibold">Quick Links</h3>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-zinc-600 transition hover:text-[rgb(249,115,22)] dark:text-zinc-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Popular categories */}
        <div>
          <h3 className="text-base font-semibold">Popular Categories</h3>
          <ul className="mt-4 space-y-2.5">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/services?category=${encodeURIComponent(category)}`}
                  className="text-sm text-zinc-600 transition hover:text-[rgb(249,115,22)] dark:text-zinc-400"
                >
                  {category} Repair
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-base font-semibold">Contact Us</h3>
          <ul className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[rgb(249,115,22)]" />
              support@fixmate.com
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[rgb(249,115,22)]" />
              +880 1700-000000
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[rgb(249,115,22)]" />
              Dhaka, Bangladesh
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-200 dark:border-zinc-800">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-sm text-zinc-500 sm:px-6 lg:px-8">
          © <CopyrightYear /> FixMate. All rights reserved.

        </p>
      </div>
    </footer>
  );
}
