# Timify

Lightweight time tracker (Toggl-style). Persian-first, offline-capable, SQLite-backed.

## Stack

- Next.js 16.2.6 + React 19 (App Router), **React Compiler enabled** (`next.config.ts`)
- Tailwind CSS v4 (`@tailwindcss/postcss`, no `tailwind.config.ts`; `@theme inline` in `globals.css`)
- shadcn/ui v4 `radix-nova` (56 primitives in `src/components/ui/`), Hugeicons icon library
- Drizzle ORM + `@libsql/client` (SQLite)
- `better-auth` for auth (email/password, Persian locale; `useSecureCookies: false` for local dev)
- **Testing**: Vitest (unit, `__tests__/tests/`) + Playwright (E2E, `__tests__/e2e/`)

## Key commands

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Build + typecheck (next build) |
| `npm run lint` | ESLint (flat config: `eslint.config.mjs`) |
| `npm test` | Unit tests (Vitest, no dev server needed) |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:e2e` | E2E (Playwright, requires dev server running) |
| `npx drizzle-kit push` | Push Drizzle schema to SQLite |
| `npx drizzle-kit studio` | Drizzle Studio GUI |

## Setup

`.env*` is gitignored. Create `.env` manually:

```
DB_FILE_NAME=file:./src/db/local.db
BETTER_AUTH_SECRET=<any-random-string>
BETTER_AUTH_URL=http://localhost:3000
```

The `DATABASE_URL` env var is defined but unused — SQLite (`DB_FILE_NAME`) is the source of truth.

## Project structure

```
src/
├── actions/               # Server actions by domain (projects, tags, time-entries, time-entry-tags, reports, countdowns, auth)
├── app/
│   ├── (root)/            # Public landing page
│   ├── app/               # Authenticated pages (dashboard, projects, project/[id], tags, reports, timer, countdown, calendar)
│   ├── api/auth/          # better-auth API routes
│   └── auth/              # Login/Register (?tab=register)
├── components/
│   ├── animate-ui/        # Animated UI primitives & icons
│   ├── cards/             # StatusMessage (legacy — prefer toast() from sonner instead)
│   ├── charts/            # Recharts wrappers
│   ├── custom-ui/         # Custom primitives (pulsating-loader, time-picker)
│   ├── sidebar/           # Desktop sidebar (project selector, profile, StartTimer, theme)
│   ├── navigation/        # Mobile bottom navigation
│   └── ui/                # shadcn/ui primitives (56 installed)
├── db/                    # Drizzle schema (schema.ts), client singleton (index.ts), local.db (committed)
├── lib/                   # auth setup, cn(), calculate-duration, time-display, localize-price, persian-number-to-words
├── hooks/                 # use-mobile, use-click-outside, use-realtime-duration, use-mounted, use-is-in-view
├── context/providers.tsx  # DirectionProvider(RTL), ThemeProvider, TooltipProvider, Toaster, NextTopLoader
├── data/                  # navigation-data.ts, get-active-project
├── constants/             # routes.ts, fonts.ts, placeholder-image.ts
└── proxy.ts               # Auth middleware (matcher: ["/app:path*"])
```

Vitest tests live under `__tests__/tests/` (setup at `__tests__/tests/setup.ts`), Playwright E2E under `__tests__/e2e/`.

## Architecture

### Auth flow
1. Middleware (`src/proxy.ts`) checks session on every `/app/*` request — redirects to `/auth` if missing
2. Server actions call `auth.api.getSession({ headers: await headers() })` for auth + userId
3. `src/lib/auth-guard.ts` provides `requireSession()` for server components

### Route layout
```
/                     → Landing
/auth                 → Login (?tab=register for registration)
/app                  → Dashboard (redirects to active project)
/app/projects         → Project list (DataTable)
/app/project/[id]     → Single project time entries (card grid)
/app/project/[id]/reports → Charts + date range
/app/tags             → Tag CRUD
/app/reports          → Redirects to active project's reports
/app/timer            → Manual stopwatch
/app/countdown        → Countdown timers with radial chart
/app/calendar         → Weekly calendar grid with time entries
```

### Data layer
- **RSC pages** — Fetch data directly in server components via server actions (e.g., `src/app/app/project/[id]/(root)/page.tsx`)
- **Client components** — Use `useSWR` (SWR library) with a server action as fetcher (see `src/components/sidebar/start-timer.tsx`)
- **Mutations** — `useActionState(serverAction, initialState)` returning `{ success: boolean, message: string }`. Forms use `<form action={formAction}>` or `startTransition(() => formAction(formData))`
- **Revalidation** — `revalidateTag("get-time-entries")` and `revalidatePath()` in server actions

### Time entries
- `startTime` / `endTime`: `Date` mode timestamps
- `duration`: pre-calculated seconds (set when entry is stopped)
- `isRunning`: boolean — live duration computed via `useRealtimeDuration` hook which recalculates every second
- `createTimeEntry` auto-stops any other running entries for the same user before starting a new one

### Forms & dialogs pattern
- `<Dialog>` with `<form id="...">` and `action={formAction}`
- Input names match server action's `formData.get("fieldName")`
- `useActionState` returns `{ message?, success? } | null`
- Close dialog on `state.success` via `useEffect`
- Show errors inline: `<StatusMessage>` (legacy, being phased out) or `toast.error()` from `sonner`
- Form validation via `zod` (v4, `z.safeParse()`) on the server action

### Calendar module
Broken into focused components at `src/app/app/calendar/components/`:
- `calendar-page-content.tsx` — Orchestrator: state, data fetching, wires filters + nav + grid
- `week-navigation.tsx` — Prev/next/this week + Persian date picker popover
- `filter-bar.tsx` — Project select + billable toggle
- `week-grid.tsx` — Grid with time column + day columns
- `day-column.tsx` — Single day: hour lines + entry blocks
- `entry-block.tsx` — Positioned entry with project color
- `week-summary.tsx` — Daily totals + weekly total
- `utils.ts` — Pure functions: layout, collision detection, duration formatting

## Conventions

- **RTL by default** — `<html dir="rtl" lang="fa-IR">`. All UI in Persian. Numbers in LTR (`dir="ltr"` + `tabular-nums`).
- **Tailwind v4** — No `tailwind.config.ts`. Use `@theme inline` in `globals.css`. Semantic colors (`bg-card`, `text-muted-foreground`), never raw values.
- **Imports** — Prettier enforces: react → third-party → `@/components/*` → `@/lib/*` → `@/hooks/*` → relative
- **Icons** — `@hugeicons/core-free-icons` with `@hugeicons/react` wrapper; `data-icon="inline-start"` in buttons; no sizing on icons inside components
- **shadcn** — `npx shadcn@latest add <component>`; MCP server in `opencode.json`
- **Unused vars** — Prefix with `_` (ESLint enforces via `argsIgnorePattern: "^_"`)
- **Primary keys** — `crypto.randomUUID()` in Drizzle schema `$defaultFn` (app tables only; better-auth tables use their own)
- **success/error messages** — Prefer `toast()` from `sonner` over inline `<StatusMessage>`
- **local.db** — Committed to git (schema sync across environments)
- **zod** — All server actions validate form data with `z.safeParse()` in Zod v4
- **`<form action>` layout** — `useActionState` takes `(serverAction, initialState)` and returns `{ success: boolean, message: string } | null`. Check `success` in `useEffect` to close dialogs.
