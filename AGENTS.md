<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# fix-mate-client

Client for **Fix Mate** — a Next.js 16 App Router application with better-auth (MongoDB adapter), Tailwind CSS v4, and shadcn/ui components.

## Commands

- `npm run dev` — start the dev server (Turbopack) at http://localhost:3000
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + TypeScript)

There are no tests configured.

## Stack & Key Versions

- **Next.js 16.4.6** with `cacheComponents`, `partialPrefetching`, and the **React Compiler** (`reactCompiler: true`) enabled in `next.config.ts`. Do not add manual memoization (`useMemo`, `useCallback`, `memo`) — the compiler handles it.
- **React 19.3**
- **Tailwind CSS v4** via `@tailwindcss/turbopack` (no `tailwind.config` file; theme is CSS-first in `src/app/globals.css`)
- **better-auth 1.7** + `@better-auth/mongo-adapter` + `mongodb` (database: `fix-mate`)
- **shadcn/ui** with style `base-nova`, icons from `lucide-react`, base color `neutral` (see `components.json`)

## Environment Variables

Configured in `.env` (never commit values):

- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
- `MONGODB_URI`
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (referenced in `src/lib/auth.ts` social providers)

## Project Structure

```
src/
  app/                  # App Router pages/layouts
    api/auth/[...all]/  # better-auth catch-all route handler
  components/
    ui/                 # shadcn/ui primitives (generated — avoid hand edits)
  hooks/                # shared hooks (use-mobile, use-highlighted-code)
  lib/
    auth.ts             # server-side better-auth instance (MongoDB adapter)
    auth-client.ts      # client-side better-auth client (exports signIn, signUp, useSession)
    utils.ts            # cn() helper
```

## Conventions

- **Path alias:** `@/*` maps to `src/*` (e.g. `@/components/ui/button`, `@/lib/utils`).
- **TypeScript strict mode** is on.
- **Auth:** server code uses `auth` from `@/lib/auth`; client components use `authClient` / `signIn` / `signUp` / `useSession` from `@/lib/auth-client`.
- **Class merging:** always use `cn()` from `@/lib/utils` for conditional class names.
- **UI components:** add new primitives with the shadcn CLI (`npx shadcn add <component>`) rather than writing them by hand; do not refactor existing files in `src/components/ui/` gratuitously.
- Server Components are the default; add `"use client"` only when needed (state, effects, browser APIs).
