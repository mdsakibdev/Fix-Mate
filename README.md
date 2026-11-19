# FixMate — Smart Device & Home Appliance Repair Service Platform

FixMate connects customers with verified technicians for smart device and home appliance repairs. Customers browse approved services, send repair requests, track the job step by step, pay securely online and leave a review. Technicians manage their services and repair pipeline, and admins keep the platform under control.

## Live Site

- **Live URL:** _add after deployment_
- **Server API:** _add after deployment_

## Demo Accounts

| Role       | Email              | Password   |
| ---------- | ------------------ | ---------- |
| Admin      | _admin email_      | 1234567Ad |
| Technician | evrahim@gmail.com  | 1234567Ev |
| Technician | rahim@gmail.com    | Rahim123   |
| Customer   | khaled@gmail.com   | 1234567Kh |

## Key Features

- **Role-based dashboards** for Customer, Technician and Admin
- **Authentication** with Better Auth (email/password + JWT); sign-up only as Customer or Technician
- **Service marketplace** — only admin-approved and available services are public
- **Server-side search, category/mode filters, sorting and pagination** (state kept in the URL)
- **Repair request flow** with a server-enforced status pipeline: Requested → Accepted → In Progress → Completed (or Rejected), cancel only while Requested
- **Job Timeline Tracker** — a visual stepper with dates on every booking
- **Stripe Checkout payments** — pay only after completion; each payment is saved once with its Stripe payment intent id
- **Rating & Review** — customers review paid jobs; average rating shows on service cards and details
- **Admin controls** — approve/reject services, manage user roles, monitor all bookings and transactions, platform stats with a bookings-by-status chart
- **Profile management** with photo upload (ImgBB)
- **Extras** — dark/light mode, toast notifications, loading skeletons, custom 404 and error pages, confirmation modals for destructive actions

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Better Auth (client-side auth with MongoDB adapter, JWT for the API)
- Sonner (toasts), lucide-react (icons)

## Main NPM Packages

- `next`, `react`, `react-dom`
- `better-auth`
- `mongodb`
- `tailwindcss`
- `sonner`
- `lucide-react`

## Getting Started (Local)

```bash
npm install
npm run dev
```

Create a `.env.local` file with:

```env
MONGODB_URI=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=
```

The Express server (separate repository) must be running for the site to work fully.
