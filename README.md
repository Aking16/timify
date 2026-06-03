# Timify ⏱️

Lightweight time tracker (Toggl-style). Persian-first, offline-capable, SQLite-backed.

Built with Next.js 16 + React 19, shadcn/ui, Drizzle ORM, and better-auth.

## Features

- **Time tracking** — Start/stop timers per project with automatic duration calculation
- **Projects** — Create, edit, archive projects with custom colors and hourly rates
- **Tags** — Categorize time entries with color-coded tags (many-to-many)
- **Reports** — Daily/hourly breakdowns with date range filtering
- **Persian-first** — RTL layout, Persian locale (`fa-IR`), Persian number/date formatting
- **Authentication** — Email/password auth with better-auth, Persian translations
- **Dark mode** — Light/dark/system theme with persistent preference
- **Responsive** — Desktop sidebar + mobile bottom navigation
- **Offline-capable** — SQLite local database with zero external services

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server at `http://localhost:3000` |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests (Vitest, 213 tests) |
| `npm run test:e2e` | Run E2E tests (Playwright, 42 tests — requires dev server) |
| `npx drizzle-kit push` | Push Drizzle schema to SQLite |
| `npx drizzle-kit studio` | Open Drizzle Studio (GUI database viewer) |

## Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.2.6 + React 19 (App Router) |
| **UI** | shadcn/ui v4 `radix-nova`, Tailwind CSS v4, Hugeicons |
| **Database** | SQLite via `@libsql/client` + Drizzle ORM |
| **Auth** | better-auth (email/password, Persian locale) |
| **Font** | IRANSansX (11 weights, `woff2`) via `next/font/local` |
| **Testing** | Vitest (unit) + Playwright (E2E) |
| **Code quality** | ESLint (flat config), Prettier, React Compiler |

## Project Structure

```
src/
├── actions/              # Server actions
│   ├── projects/         #   create, edit, delete, retrieve, list
│   ├── tags/             #   create, edit, delete, list
│   ├── time-entries/     #   create, edit, delete, stop, list
│   ├── time-entry-tags/  #   add/remove tag ↔ entry
│   └── reports/          #   daily hours aggregation
├── app/                  # Next.js App Router pages
│   ├── (root)/           #   Public landing page
│   ├── api/auth/         #   better-auth API routes
│   ├── app/              #   Authenticated pages (dashboard, projects, tags, reports)
│   └── auth/             #   Login/Register page
├── components/           # React components
│   ├── cards/            #   Data display cards
│   ├── charts/           #   Chart components (Recharts)
│   ├── custom-ui/        #   Custom UI primitives
│   ├── layout/           #   Theme switcher, layout wrappers
│   ├── navigation/       #   Mobile bottom navigation
│   ├── routes/           #   Route-level components
│   ├── shared/           #   Shared/page-loading components
│   ├── sidebar/          #   Desktop sidebar (nav, profile, project selector, timer)
│   └── ui/               #   shadcn/ui primitives
├── constants/            # App constants (routes, fonts, images)
├── context/              # React context providers
├── data/                 # Data layer (navigation items, active project)
├── db/                   # Database
│   ├── schema.ts         #   Drizzle schema (7 tables)
│   ├── index.ts          #   DB client singleton
│   └── local.db          #   SQLite database (committed)
├── hooks/                # Custom React hooks
│   ├── use-mobile.ts     #   Responsive breakpoint detection
│   ├── use-click-outside.ts
│   └── use-realtime-duration.ts  # Live timer display
├── lib/                  # Utilities
│   ├── auth*.ts         #   better-auth server/client/guard/logout
│   ├── utils.ts          #   cn() helper
│   ├── calculate-duration.ts
│   ├── converter.ts      #   string-to-boolean
│   ├── localize-price.ts #   Persian price formatting
│   └── persian-number-to-words.ts
└── proxy.ts              # Auth middleware (guards /app:path*)
```

## Architecture

### Route Layout

```
/                    → Public landing
/auth                → Login/Register (?tab=register)
/app                 → Dashboard (redirects to active project)
/app/projects        → Project list
/app/project/[id]    → Single project with time entries
/app/tags            → Tag management
/app/reports         → Reports with charts
```

- All `/app/*` routes are guarded by middleware (`src/proxy.ts`) — unauthenticated users are redirected to `/auth`.
- The root layout (`src/app/layout.tsx`) sets `dir="rtl"` and `lang="fa-IR"`.
- Providers wrap the app: `DirectionProvider`, `ThemeProvider`, `TooltipProvider`, `Toaster`, `NextTopLoader`.

### Auth Flow

1. User visits `/auth` — Login form (default) or Register form (`?tab=register`)
2. better-auth handles registration/login via email/password with Persian translations
3. Session stored in SQLite, middleware checks on every `/app/*` request
4. Protected pages use `requireSession()` server-side guard

### Database Schema

7 tables in SQLite (Drizzle ORM):

- **user** — User accounts
- **session** — Auth sessions (one user can have multiple sessions)
- **account** — Provider-linked accounts
- **verification** — Email verification tokens
- **projects** — Time tracking projects (name, color, hourly rate)
- **time_entries** — Individual time entries (start/end time, duration, billable)
- **tags** — Categorization tags (name, color)
- **time_entry_tags** — Many-to-many join table

Primary keys use `crypto.randomUUID()`.

## Environment

Copy `.env` from a teammate or create your own:

```
DB_FILE_NAME=file:./src/db/local.db
BETTER_AUTH_SECRET=<your-secret>
BETTER_AUTH_URL=http://localhost:3000
```

Note: `DATABASE_URL` for PostgreSQL is configured but unused — SQLite is the source of truth.

## Contributing

```bash
# Install dependencies
npm install

# Push schema to local database
npx drizzle-kit push

# Start development
npm run dev

# Run tests
npm test          # 213 unit tests
npm run test:e2e  # 42 E2E tests (requires dev server running)
```
