# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

- **artifacts/association-world** (web, React + Vite, wouter, framer-motion, react-hook-form): public-facing site for "Association World" — music collective / DJ booking / streetwear brand. Dark luxury aesthetic with gold accents. Pages: home (intro animation), djs, booking, merch, contact. Brand assets in `public/brand/`.
- **artifacts/api-server** (Express): hosts `/api/contact` and `/api/booking` which send emails via Resend (`src/lib/email.ts`) using `RESEND_API_KEY`. From address defaults to `Association World <onboarding@resend.dev>`; override with `RESEND_FROM_EMAIL` once a domain is verified at resend.com/domains. Recipient is `management@theassociationworld.com`. **Resend sandbox limitation**: until the domain is verified, Resend only allows delivery to the account owner's verified email — verify the domain to send to the management inbox in production.
- **artifacts/mockup-sandbox**: design preview environment.
