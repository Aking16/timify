# Timify Project

## Stack
- Next.js 16.2.6 + React 19 (App Router)
- Tailwind CSS v4 (uses `@tailwindcss/postcss`, NOT standard tailwindcss config)
- shadcn/ui with `radix-nova` style and Hugeicons
- React Compiler enabled (`reactCompiler: true` in `next.config.ts`)

## Commands
- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run lint` - ESLint (flat config in `eslint.config.mjs`)
- No typecheck script (add `tsc --noEmit` if needed)

## Paths
- All imports use `@/*` alias → `./src/*`
- UI components: `@/components/ui`
- Utilities: `@/lib/utils`

## Key conventions
- Tailwind v4: CSS variables in `src/app/globals.css`, no `tailwind.config.ts`
- shadcn add: `npx shadcn@latest add <component>` (uses `components.json`)
- RTL enabled by default

## Dev notes
- React Compiler (babel-plugin-react-compiler) is active - don't disable it
- No test framework installed
- `.next/` and `node_modules/` are gitignored