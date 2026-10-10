# Fin-Envision Learning

Fin-Envision Learning is a professional finance training portal and administration system for CFA® Program preparation and Financial Modeling.

## Tech Stack

- TanStack Start / TanStack Router (file-based routing)
- React 19 + TypeScript
- Tailwind CSS v4
- shadcn/ui + Radix UI Primitives
- Recharts, Lucide Icons, React Hook Form, Zod

## Architecture notes

- **Content store** (`src/lib/admin-store.ts`): one in-memory document backed by Supabase. Admin edits save to a
  *draft* row; `publishSite()` promotes it. Public pages read the *live* row (loaded in the root route loader).
  Never write the live row directly — RLS forbids it and `publish_site()` records a revision.
- **Database** (`supabase/migrations`): change it with a **new numbered migration**, never edit an applied one.
  `npm run test:sql` runs every migration against a real throwaway Postgres and checks the role/RLS rules.
- **Editable public text**: files that render public content start with `/** @jsxImportSource @/lib/editable */`
  so admins can override any rendered text/link/image (keyed by the original string). Don't add the pragma to
  admin files. Main page blocks are wrapped in `<Section id="page.name" label="…">` so they can be hidden.
- **Page addresses** are a router `rewrite` (`src/lib/pages.ts`): code always links to the built-in path
  (`/cfa`); the admin may expose it at another address. Pages created in the admin use the `/$` catch-all route.
- **Secrets**: `SUPABASE_SERVICE_ROLE_KEY` and `SMTP_PASS` are server-only (used inside `createServerFn`
  handlers). Never prefix them with `VITE_`.
- **Checks before committing**: `npm run check` (types, lint, unit tests) and `npm run test:sql`.
- Setup and usage guide: `SETUP.md`.
