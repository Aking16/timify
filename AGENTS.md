# Timify

Lightweight time tracker (Toggl-style). Persian-first, offline-capable, SQLite-backed.

## Stack

- Next.js 16.2.6 + React 19 (App Router)
- Tailwind CSS v4 (`@tailwindcss/postcss`, no `tailwind.config.ts`)
- shadcn/ui v4 `radix-nova` style, Hugeicons icon library
- React Compiler enabled — don't disable or bypass
- Drizzle ORM + `@libsql/client` (SQLite)
- `better-auth` for auth (email/password, Persian locale)
- **Testing**: Vitest (unit, 213 tests) + Playwright (E2E, 42 tests)

## Key commands

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint (flat config) |
| `npx drizzle-kit push` | Push schema to SQLite |
| `npx drizzle-kit studio` | Drizzle Studio GUI |
| `npm run start` | Production server |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run E2E tests (Playwright, requires running dev server) |

## Environment (`.env` — gitignored)

```
DB_FILE_NAME=file:./src/db/local.db
BETTER_AUTH_SECRET=<secret>
BETTER_AUTH_URL=http://192.168.100.5:3000
```

`DATABASE_URL` for PostgreSQL also present but unused — SQLite is the source of truth.

## Architecture

- **`src/app/auth`** — Login/Register page (toggled via `?tab=register`)
- **`src/app/app/*`** — Authenticated app area, guarded by `src/proxy.ts` middleware (matcher: `/app:path*`)
- **`src/app/(root)`** — Public landing page
- **`src/db/schema.ts`** — Full Drizzle schema (user, session, account, verification, projects, time_entries, tags, time_entry_tags)
- **`src/db/index.ts`** — DB client singleton
- **`src/lib/auth.ts`** — better-auth server instance (Drizzle adapter, SQLite)
- **`src/lib/auth-client.ts`** — better-auth browser client
- **`src/lib/auth-guard.ts`** — Server-side session guard (redirects to `/auth`)
- **`src/lib/auth-libs.ts`** — Client-side logout helper
- **`src/proxy.ts`** — Middleware: checks session, redirects unauthenticated to `/auth`
- **`src/constants/routes.ts`** — Auth route constants
- **`src/constants/placeholder-image.ts`** — Image path constants
- **`src/context/providers.tsx`** — Root providers (DirectionProvider RTL, ThemeProvider, TooltipProvider, Toaster, NextTopLoader)
- **`src/data/navigation-data.ts`** — Sidebar + bottom nav item definitions (Persian labels)
- **`src/actions/`** — Server actions by domain (projects, reports, tags, time-entries)

## Conventions

- **RTL by default** — `dir="rtl"` on `<html>`, `lang="fa-IR"`. All UI is in Persian.
- **App sidebar** — Desktop sidebar (`src/components/sidebar/`) with project selector, profile, theme switcher. Mobile uses bottom navigation (`src/components/navigation/mobile-bottom-navigation`).
- **Local font** — IRANSansX (11 weights, `woff2`) via `next/font/local`, CSS variable `--font-iransanx-fanum`, applied via `font-iransanx` class
- **Imports** — `@/*` → `./src/*`. Prettier enforces import order: react → third-party → `@/components/*` → `@/lib/*` → `@/hooks/*` → relative
- **shadcn** — `npx shadcn@latest add <component>`; MCP server configured in `opencode.json`
- **Unused vars** — Prefix with `_` to silence ESLint
- **`local.db`** is committed (not gitignored) to keep the schema in sync across environments

## Drizzle

```bash
npx drizzle-kit push    # push schema to local.db
npx drizzle-kit studio  # open DB viewer
```

Migrations live in `./drizzle/`. Schema is `src/db/schema.ts`. Primary keys use `crypto.randomUUID()`.
