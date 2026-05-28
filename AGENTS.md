# ComSciSeat Frontend Agent Guide

## Project

ComSciSeat is a web application for checking and booking computer-lab seats in the Computer Science department. Students can view lab rooms, table availability, class schedules, and their own bookings. Admin users can manage labs, tables, class schedules, users, bookings, and dashboard statistics.

This file applies to the `/frontend` workspace. Backend work belongs in `/backend`.

## Purpose

The frontend provides the browser-facing experience for:

- Google-based sign in and authenticated sessions.
- Browsing available computer labs and lab tables.
- Selecting date/time slots and making or cancelling bookings.
- Viewing personal profile and booking history.
- Admin-only management of labs, tables, class schedules, users, bookings, and dashboard data.

The application should help students plan lab usage during free periods and prevent invalid or overlapping bookings by relying on backend validation.

## In Brief

- Framework: SvelteKit with TypeScript.
- Styling: Tailwind CSS and DaisyUI.
- Icons: `lucide-svelte`.
- Runtime/build tool: Vite.
- Backend communication: REST API calls using `fetch`.
- Auth/session: HTTP-only auth token cookie (`auth_token`) decoded in `src/auth.ts`, then enriched from the backend via `GET /api/user/:identifier` using the JWT's UUID (`sub` claim).
- A `session_user` cookie caches name, email, student_id, role, and image from the OAuth callback as a fallback when the API call fails.
- Backend base URL: `BACKEND_API_URL` from private environment variables.

## Architectural Overview

ComSciSeat follows a web-app plus API architecture:

- Students and admins use the SvelteKit frontend in the browser.
- SvelteKit server routes and page loads call the backend REST API over JSON/HTTP(S).
- The backend is expected to enforce core booking rules such as authentication, authorization, schedule conflicts, past-time rejection, and table availability.
- The backend stores data in PostgreSQL through Prisma ORM.
- Google OAuth is used for identity.
- Resend is used by the backend for booking/cancellation email evidence.

Frontend structure:

- `src/routes/(main)` contains student-facing pages such as home, lab tables, booking, profile, sign in, and sign out.
- `src/routes/admin` contains admin-only pages and actions.
- `src/routes/auth` contains auth callback/login routes.
- `src/lib/components` contains reusable UI components grouped by feature.
- `src/lib/shared/types` contains shared frontend TypeScript types.
- `src/lib/data` contains static frontend data such as time slots.
- `src/auth.ts` owns local session cookie handling and backend user lookup. Fetches the user record by UUID (from JWT) via `GET /api/user/:identifier`. Falls back to a `session_user` cookie if the API call fails.
- `src/hooks.server.ts` installs the auth handle.

## Tech Stack

- Node.js and npm
- SvelteKit 2
- Svelte 5
- TypeScript
- Vite
- Tailwind CSS 4
- DaisyUI 5
- lucide-svelte
- Docker / Docker Compose for containerized runs when needed

## Setup Instructions

From `/frontend`:

```sh
npm install
npm run dev
```

For local development, make sure the backend is running and the required environment variables are configured locally. Do not inspect, print, copy, or edit `.env`; ask the project owner if an environment value is missing.

Useful commands:

```sh
npm run dev
npm run dev -- --open
npm run preview -- --host
```

## Build and Test Commands

Run these from `/frontend`:

```sh
npm run check
npm run build
```

There is no dedicated unit-test script in `package.json` at the time of writing. Treat `npm run check` as the primary static validation command and `npm run build` as the production validation command.

## Coding Standard

- Prefer existing SvelteKit patterns already used in `src/routes` and `src/lib/components`.
- Use TypeScript for server loads, actions, shared types, and utility code.
- Keep server-only values in server files and `$env/dynamic/private`; never expose secrets to client code.
- Use SvelteKit `load` functions for route data and form actions for mutations when matching existing pages.
- Keep backend API calls centralized in page server files or small helpers when reuse is clear.
- Preserve role checks for admin routes. Admin pages must redirect unauthenticated users to `/auth` and non-admin users to `/admin/unauthorized`.
- Let the backend remain the source of truth for booking validity, ownership, schedule conflicts, and permissions.
- Keep UI components focused and reusable. Put shared components under `src/lib/components/<feature>`.
- Use Tailwind and DaisyUI classes consistently with the existing UI.
- Use `lucide-svelte` for icons when adding icon buttons or visual actions.
- Avoid large unrelated refactors while implementing feature or bug fixes.
- If modifying user-facing Thai text, preserve correct UTF-8 encoding and verify rendered output.

## File Ownership

- `/frontend`: SvelteKit frontend, UI, routing, client/server page logic, frontend auth integration, frontend types, and static assets.
- `/backend`: API service, database schema/migrations, Prisma models, booking validation, email sending, Google token verification, and backend authorization rules.

Do not edit `/backend` from a frontend task unless the user explicitly asks for cross-stack changes. If a frontend change requires a backend contract change, document the expected API change and ask before editing backend files. Previously authorized cross-stack changes include: `GET /api/user/:identifier` now accepts UUID or student_id (route `:student_id` → `:identifier`).

## Safety Constraints

- Do not read, print, copy, summarize, or edit `.env` or any other secret-bearing file.
- Do not commit secrets, tokens, cookies, API keys, or environment values.
- Do not log bearer tokens, auth cookies, or raw private environment values.
- Do not weaken authentication, authorization, admin checks, or cookie security settings.
- Do not move booking-rule enforcement from the backend into the frontend as the only validation layer.
- Do not bypass backend errors with fake success states. Show safe fallback data only when the existing UX pattern supports it.
- Do not make destructive git or filesystem changes unless the user explicitly asks.
- Preserve user changes in the working tree. Read before editing files that may have active changes.
- Keep generated build output, dependency folders, and local machine artifacts out of source edits unless specifically requested.

## API Expectations

The frontend expects the backend to expose REST endpoints similar to:

- `/api/user`
- `/api/user/:identifier` (accepts UUID or 8-digit student_id)
- `/api/labs`
- `/api/tables`
- `/api/bookings`
- `/api/bookings/stats`
- `/api/class_schedule`

Authenticated calls should include:

```ts
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <backendToken>"
}
```

Do not hard-code backend URLs. Use `env.BACKEND_API_URL` from server-side code.

## Verification Checklist

Before handing off frontend changes:

- Run `npm run check`.
- Run `npm run build` for behavior or route changes.
- Manually review affected pages for loading, empty, error, and unauthorized states when relevant.
- Confirm no `.env` or secret files were read or changed.
- Confirm changes are scoped to `/frontend` unless the user requested otherwise.
