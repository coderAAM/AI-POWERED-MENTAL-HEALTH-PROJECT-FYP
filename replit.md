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

- **`artifacts/api-server`** — Express API. Routes mounted in `src/routes/index.ts`:
  - `/api/healthz`, `/api/ai/chat` (SSE streaming), `/api/ai/assess`,
    `/api/doctors`, `/api/doctors/:id`, `/api/doctors/cities`, `/api/doctors/specialties`.
  - Uses OpenAI via `@workspace/integrations-openai-ai-server` (model `gpt-5.4`).
- **`artifacts/psychwell`** — React + Vite + Tailwind app for an AI-powered mental wellness companion targeting Pakistan.
  - Bilingual EN/UR with `LangProvider` (`src/lib/lang-context.tsx`) + translation map (`src/lib/translations.ts`). Urdu uses Noto Nastaliq Urdu and `dir="rtl"`.
  - All persistent state lives in localStorage via `src/lib/storage.ts` — keys: `psychwell_user`, `psychwell_lang`, `psychwell_chat`, `psychwell_assessments`, `psychwell_mood`, `psychwell_appointments`. No server DB.
  - Routing with `wouter`. Welcome / Login are public; everything else wrapped in `RequireAuth` + `AppShell`.
  - Pages: Welcome, Login, Dashboard, Chat (therapist persona), CallDoctor (doctor persona), Mood (with camera), Assess (GAD-7 / PHQ-9 / PSS-10 / Big Five BFI-44), Doctors list + DoctorDetail with booking dialog, Appointments, Settings.
  - AI chat is SSE — call `${import.meta.env.BASE_URL}api/ai/chat` manually (don't use the generated `useAiChat` mutation hook).
  - `useAiAssess` / `useListDoctors` / `useGetDoctor` / `useListDoctorCities` / `useListDoctorSpecialties` come from `@workspace/api-client-react`.

## Conventions

- No `console.log` in server code — use `req.log` or the singleton `logger`.
- No emojis in UI; use `lucide-react` icons.
- Whenever the OpenAPI spec changes run `pnpm --filter @workspace/api-spec run codegen`.
