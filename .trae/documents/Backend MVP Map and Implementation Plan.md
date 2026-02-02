## Current Codebase Overview

* React + TypeScript app using Vite tooling: [package.json](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/package.json), [vite.config.ts](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/vite.config.ts), [tsconfig.json](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/tsconfig.json)

* Entrypoints and routing: [index.tsx](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/index.tsx) → [App.tsx](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/App.tsx); custom router [router.tsx](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/router.tsx)

* Simulated in-memory API: [api.ts](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/api/api.ts) backed by [constants.ts](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/constants.ts); shared types in [types.ts](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/types.ts)

* Auth is client-only: [AuthContext.tsx](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/contexts/AuthContext.tsx), [useAuth.ts](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/hooks/useAuth.ts), [ProtectedRoute.tsx](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/components/ProtectedRoute.tsx); illustrative server middleware at [backend-auth-middleware.ts](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/backend-auth-middleware.ts)

* Error handling seen in pages: [Home.tsx](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/pages/Home.tsx), [ProductDetails.tsx](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/pages/ProductDetails.tsx), [ProductEdit.tsx](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/pages/ProductEdit.tsx), [Login.tsx](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/pages/Login.tsx)

## Backend MVP Goals

* Replace in-memory API with a real HTTP backend while preserving frontend contracts

* Persist data in a database with minimal ops overhead

* Implement secure authentication and authorization compatible with current UI flows

* Provide consistent error responses and logging

## Proposed Stack

* Runtime: Node.js with Express and TypeScript

* ORM: Prisma for schema, migrations, and typed queries

* Database: SQLite for local/MVP; PostgreSQL for production

* Validation: Zod for request/response schemas

* Auth: JWT (HS256) stored in HttpOnly cookies; middleware verification

* CORS: Allow Vite dev origin; tighten for production

## Data Models

* User: id, email, name, passwordHash, role

* Vendor: id, name, description

* Product: id, vendorId, name, price, stock, description, imageUrl

* Shape aligns with existing types in [types.ts](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/types.ts)

## API Endpoints

* Auth

  * POST /auth/login → returns token cookie and user

  * GET /auth/me → returns current user

  * POST /auth/logout → clears token cookie

* Products

  * GET /products → list

  * GET /products/:id → details

  * GET /vendors/:vendorId/products → list by vendor

  * POST /products → create (auth required)

  * PUT /products/:id → update (auth required)

  * DELETE /products/:id → delete (auth required)

* Vendors

  * GET /vendors/:id → vendor detail

## Error Handling

* Standard JSON envelope: { error: { code, message, details } }

* Status codes: 400/401/403/404/409/500 with centralized Express error middleware

* Structured server logs; minimal client-facing messages

## Environment & Config

* .env keys: DATABASE\_URL, JWT\_SECRET, CORS\_ORIGIN

* Avoid exposing secrets via Vite define; review [vite.config.ts](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/vite.config.ts) for GEMINI\_API\_KEY exposure

* Configuration layering: dev vs production

## Integration Plan

1. Create a /server directory with Express, TypeScript, Prisma; initialize schema
2. Implement auth (login/logout/me) and product/vendor endpoints mirroring current [api.ts](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/api/api.ts) signatures
3. Add auth middleware (JWT cookie) protecting mutations; reflect pseudo in [backend-auth-middleware.ts](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/backend-auth-middleware.ts)
4. Write a seed script to load data from [constants.ts](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/constants.ts)
5. Introduce a small HTTP client layer in the frontend to replace direct in-memory calls, keeping page components unchanged
6. Add dev scripts to run frontend and backend concurrently; configure CORS

## Testing & Verification

* Unit tests for services and validators

* Integration tests for API endpoints (supertest)

* Manual flows: login → list products → view → create/update/delete → list by vendor

* Update [ProtectedRoute.tsx](file:///d:/SESCO/AGENTS/kk/Peo-Tshotelo/components/ProtectedRoute.tsx) to consult /auth/me for session validation

## Risks & Considerations

* Seed data parity with types; migration path from constants to DB

* Cookie-based auth (HttpOnly, SameSite) vs localStorage; prefer cookies for security

* CORS correctness between Vite dev server and backend

## Future Extensions

* Vendor CRUD and admin-only actions

* Role-based permissions (admin vs vendor vs user)

* Rate limiting, audit trails, and observability

