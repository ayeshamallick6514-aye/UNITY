# UNITY Testing Strategy & Verification Baseline

## 1. Test Coverage Overview

| Area | Status | Framework | Notes |
|------|--------|-----------|-------|
| Frontend Unit Tests | **None (0%)** | None | No `*.test.jsx` or `*.spec.jsx` files exist |
| Frontend E2E Tests | **None (0%)** | None | No Cypress, Playwright, or Puppeteer installed |
| Backend Unit Tests | **None (0%)** | None | No `*.test.js` or `*.spec.js` files exist |
| API Integration Tests | **Manual only** | Ad-hoc | Documented in `integration_report.md` |
| In-Memory DB | Configured | `mongodb-memory-server` | Used for zero-dependency local dev and auto-seeding |

Neither `frontend` nor `backend` has automated testing infrastructure. All verification is manual.

---

## 2. Test Scripts in `package.json`

### Frontend (`frontend/package.json`)
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```
No `test` script. No test dependencies (Vitest, Jest, Testing Library, Cypress).

### Backend (`backend/package.json`)
```json
"scripts": {
  "start": "node server.js",
  "seed": "node src/scripts/seed.js"
}
```
No `test` script. `mongodb-memory-server` is available for in-memory test isolation.

---

## 3. Local Development Flow

### Backend
```bash
cd backend && npm install && npm start
```
- Binds to `http://localhost:5001`
- Auto-starts `MongoMemoryServer` if no `MONGODB_URI` set
- Auto-seeds demo data via `autoSeedIfEmpty()`
- Optional manual re-seed: `npm run seed`

### Frontend
```bash
cd frontend && npm install && npm run dev
```
- Binds to `http://localhost:5173`
- Proxies `/api/*` to `http://localhost:5001`

### Health Probes
```
GET http://localhost:5001/health  → { status: "UP", timestamp, routes }
GET http://localhost:5001/        → { name, version, status }
```

---

## 4. Demo Credentials

All accounts use password: **`Unity@2025`**

| Persona | Role | Login | Employee ID | Home Route |
|---------|------|-------|-------------|------------|
| District Collector | `collector` | `collector@bhopal.mp.gov.in` | `IAS-MP-2201` | `/authority/dashboard` |
| Executive Engineer | `executive_engineer` | `engineer@bhopal.mp.gov.in` | `PWD-BPL-4412` | `/authority/dashboard` |
| Municipal Commissioner | `commissioner` | `commissioner@bhopal.mp.gov.in` | `IAS-MP-1887` | `/authority/dashboard` |
| Nodal Officer | `nodal_officer` | `nodal@bhopal.mp.gov.in` | `GOV-MP-7731` | `/command/overview` |
| Citizen | `citizen` | `citizen@bhopal.mp.gov.in` | — | `/citizen/home` |
| Guest | `guest` | — (direct access) | — | `/citizen/home` |

---

## 5. Known Working vs. Broken Flows

### ✅ Working Flows

1. **Role Gateway & Auth**: `/select-role` → role card → `/auth/login` → JWT issued → `sessionStorage` persisted → role redirect
2. **Collector Directive Actions**: Approvals console → `POST /api/v1/decisions/action` → TanStack Query cache invalidation → all widgets update
3. **CRI Scoring**: `GET /api/v1/projects/:id/cri` and `/projects/cri/all`
4. **Sentinel AI**: Policy search, compliance review, document ingestion, history
5. **Ripple Cascade Simulation**: `GET /api/v1/cascade/simulate?dept=&delay=` (BFS traversal)
6. **Interactive Map**: Leaflet with layer toggles (roads, utilities, conflicts, ward boundaries)
7. **Citizen Portal**: Report issue, nearby projects, GovSchemes eligibility wizard, track complaint

### ❌ Broken / Stubbed Flows

1. **OTP Verification**: Returns HTTP 400 (`"OTP verification is disabled"`) — route exists but unreachable
2. **Forgot Password**: Returns static message — no real email transport wired
3. **Placeholder routes**: `/authority/departments/:id`, `/authority/analytics`, `/authority/settings` show `<PlaceholderPage />`
4. **No individual project endpoint**: `GET /api/v1/projects/:id` missing — `useProjects.js` uses client-side hardcoded `STATIC_PROJECTS_DETAIL`
5. **Silent token refresh on 401**: On 401, immediately clears session and redirects — does NOT attempt `POST /auth/refresh` first
6. **Some Dashboard widgets**: `PRIORITIES`, `NOC_ROWS`, `CITIZEN_REPORTS` still use hardcoded component-level constants

---

## 6. Recommended Testing Plan (Post-Hackathon)

### Frontend
```bash
npm i -D vitest @testing-library/react jsdom msw
```
- Unit tests: `Button.jsx`, `Badge.jsx`, `Card.jsx`, `KPIBlock.jsx`
- Hook tests: `useAuth.js`, `useDecisions.js` via Mock Service Worker

### Backend
```bash
npm i -D jest supertest
```
- Route tests leveraging existing `mongodb-memory-server`
- Cover: auth routes, `POST /decisions/action` role check, Sentinel RAG

### E2E
```bash
npm i -D @playwright/test
```
- Critical path: Login as Collector → Approve MP Nagar Clearance → Verify cascade resolution on dashboard
