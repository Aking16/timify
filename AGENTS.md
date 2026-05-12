# Timify Project

## Project goal

Build a lightweight task tracker like toggl.com, prioritizing offline-first and <100ms response time.

## Stack

- Next.js 16.2.6 + React 19 (App Router)
- Tailwind CSS v4 (uses `@tailwindcss/postcss`, no `tailwind.config.ts`)
- shadcn/ui v4 with `radix-nova` style and Hugeicons
- React Compiler enabled (`reactCompiler: true` in `next.config.ts`)
- Drizzle ORM + libsql (SQLite) for database
- better-auth for authentication

## Commands

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run lint` - ESLint (flat config in `eslint.config.mjs`)
- `npx drizzle-kit push` - push schema to SQLite database
- `npx drizzle-kit studio` - open Drizzle Studio (DB viewer)
- No typecheck script (add `tsc --noEmit` if needed)

## Database

- SQLite via libsql, file path from `DB_FILE_NAME` env var (default: `file:./src/db/local.db`)
- Schema defined in `src/db/schema.ts`
- Migration output: `./drizzle/` directory
- Auth uses `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` env vars

## Paths

- All imports use `@/*` alias → `./src/*`
- UI components: `@/components/ui`
- Utilities: `@/lib/utils`
- shadcn components: `npx shadcn@latest add <component>` (uses `components.json`)

## Key conventions

- Tailwind v4: CSS variables in `src/app/globals.css`
- RTL enabled by default (from `components.json`)
- Prettier with custom import sort and Tailwind class sorting (configured in `.prettierrc`)
- React Compiler: don't disable or bypass it
- No test framework installed
