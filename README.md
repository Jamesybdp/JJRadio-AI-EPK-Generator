# JJRadio AI EPK Generator

This repository contains the JJRadio AI EPK Generator React frontend together with a secure Node.js + Express backend used to proxy Gemini API requests, persist generated press kits, and manage authentication.

## Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 14+

## Project Structure

```
.
├── App.tsx                # React application entry
├── services/              # Frontend API helpers
├── server/                # Express backend, Prisma schema, and API routes
└── tests & tooling        # Jest unit/integration tests + Cypress E2E tests
```

## Environment Variables

### Frontend (`.env`)

Copy `.env.example` to `.env` (or `.env.local`) and update values as needed.

```
VITE_API_BASE_URL=http://localhost:4000
```

### Backend (`server/.env`)

Copy `server/.env.example` to `server/.env` and supply real values:

```
PORT=4000
GOOGLE_API_KEY=your-google-api-key
GEMINI_MODEL=gemini-2.5-pro
DATABASE_URL=postgresql://user:password@localhost:5432/jjradio
JWT_SECRET=super-secret-key
CLIENT_ORIGIN=http://localhost:5173
```

## Install Dependencies

```bash
npm install                # Frontend dependencies
(cd server && npm install)  # Backend dependencies
```

## Database Setup

Use Prisma to generate the client and apply migrations.

```bash
cd server
npx prisma generate
npx prisma migrate deploy   # or `prisma migrate dev` during development
```

Ensure the database defined in `DATABASE_URL` exists before running migrations.

## Running the Apps Locally

1. **Start the backend:**
   ```bash
   cd server
   npm run dev
   ```
   The API will be available at `http://localhost:4000`.

2. **Start the frontend:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5173` in your browser.

### Authentication Workflow

- Sign up: `POST /api/signup` with `{ email, password }`
- Login: `POST /api/login` with `{ email, password }` (returns JWT)
- Logout: `POST /api/logout`
- Protected endpoints require an `Authorization: Bearer <token>` header.

The frontend helper in `services/apiService.ts` stores the JWT under the `jjradio_auth_token` key for subsequent requests and exposes helpers to download generated PDFs securely.

## Testing

### Unit & Integration Tests (Jest)

```bash
npm test
```

### End-to-End Tests (Cypress)

The Cypress suite stubs backend responses and expects the Vite dev server to be running.

```bash
npm run dev  # in one terminal
npm run test:e2e  # in another terminal
```

## Production Builds

- Frontend: `npm run build`
- Backend: Deploy the `server/` folder with the configured environment variables and database.

## Security Highlights

- Gemini API access is restricted to the backend proxy.
- Artist input payloads are validated with Zod before reaching Gemini.
- Rate limiting is enforced on all `/api/*` routes (10 requests per minute per IP).
- Generated EPKs and their source inputs are persisted via Prisma/PostgreSQL for auditability and analytics.
- JWT-based authentication protects the generation and retrieval endpoints.
