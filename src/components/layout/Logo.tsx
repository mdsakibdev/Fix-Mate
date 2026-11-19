// FixMate combination logo: gradient wrench tile + custom wordmark.
// In the wordmark, the "i" of Fix has an orange nut as its dot.
export default function Logo({ className = "text-xl" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="FixMate"
      className={`inline-flex items-center gap-[0.45em] font-extrabold leading-none tracking-tight ${className}`}
    >
      <svg viewBox="0 0 64 64" className="h-[1.7em] w-[1.7em] shrink-0" aria-hidden="true">
        <defs>
          <linearGradient id="fixmateLogoGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FB923C" />
            <stop offset="0.55" stopColor="#F97316" />
            <stop offset="1" stopColor="#EA580C" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="url(#fixmateLogoGradient)" />
        <g
          transform="translate(12.8,12.8) scale(1.6)"
          fill="none"
          stroke="white"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </g>
      </svg>
      <span aria-hidden="true">
        F
        <span className="relative inline-block">
          <svg viewBox="0 0 36 85" className="block h-[0.85em] w-auto">
            <path fill="rgb(249,115,22)" d="M33 13 L25.5 26 L10.5 26 L3 13 L10.5 0 L25.5 0 Z" />
            <rect x="10.25" y="32" width="15.5" height="53" rx="2" fill="currentColor" />
          </svg>
        </span>
        x<span className="text-[rgb(249,115,22)]">Mate</span>
      </span>
    </span>
  );
}
