# Schedully

> SaaS de agendamento multi-tenant — React + Node + PostgreSQL + Stripe

Portfolio project demonstrating: authentication with roles, multi-tenant data architecture, relational schema with Drizzle ORM, protected routes, global state with Zustand, and form validation with React Hook Form + Zod.

---

## Stack

| Layer    | Tech                                        |
| -------- | ------------------------------------------- |
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Backend  | Node + Express + TypeScript                 |
| ORM      | Drizzle ORM                                 |
| Database | PostgreSQL (Neon)                           |
| Auth     | JWT + bcryptjs                              |
| State    | Zustand                                     |
| Forms    | React Hook Form + Zod                       |
| Payments | Stripe (Phase 3)                            |
| Deploy   | Railway (API) + Vercel (Frontend)           |

---

## Setup

### 1. Clone and install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

```bash
cd backend
cp .env.example .env
# Edit .env with your Neon DATABASE_URL and a JWT_SECRET
```

### 3. Push database schema

```bash
cd backend
npm run db:push
```

### 4. Run development servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:3001

---

## Project structure

```
schedully/
├── backend/
│   └── src/
│       ├── db/
│       │   ├── index.ts       # Neon + Drizzle connection
│       │   └── schema.ts      # All database tables + relations
│       ├── middleware/
│       │   └── auth.ts        # JWT auth + role guard
│       ├── routes/
│       │   └── auth.ts        # Register (owner/client) + login + /me
│       └── index.ts           # Express app
└── frontend/
    └── src/
        ├── components/
        │   └── ProtectedRoute.tsx
        ├── hooks/
        │   └── useAuthStore.ts  # Zustand auth store
        ├── lib/
        │   └── api.ts           # Axios instance with interceptors
        └── pages/
            ├── LoginPage.tsx
            ├── RegisterOwnerPage.tsx
            ├── RegisterClientPage.tsx
            └── DashboardPage.tsx
```

---

## API endpoints (Phase 1)

| Method | Route                       | Auth   | Description                   |
| ------ | --------------------------- | ------ | ----------------------------- |
| GET    | `/health`                   | —      | Health check                  |
| POST   | `/api/auth/register/owner`  | —      | Create business owner account |
| POST   | `/api/auth/register/client` | —      | Create client account         |
| POST   | `/api/auth/login`           | —      | Login (any role)              |
| GET    | `/api/auth/me`              | Bearer | Get current user              |

---

## Roadmap

- [x] **Phase 1** — Auth, schema, routing
- [ ] **Phase 2** — Services, availability slots, booking flow
- [ ] **Phase 3** — Stripe subscriptions + webhooks
- [ ] **Phase 4** — Public booking page, email confirmations (Resend)
- [ ] **Phase 5** — Deploy (Railway + Vercel)
