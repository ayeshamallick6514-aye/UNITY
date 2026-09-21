# UNITY Architecture Design Document

## 1. System Design Overview

UNITY is an enterprise-grade government coordination and administrative decision-intelligence platform for Bhopal municipal corporations, district collectorates, and state administrative secretariats.

### Core Architectural Goals
1. **Inter-Departmental Visibility** — map mutual dependencies between 8 civic departments
2. **Predictive Bottleneck & Cascade Delay** — quantify stalled projects, model downstream impacts via BFS graph traversal
3. **Role-Tailored Workspaces** — three distinct operational surfaces (Authority / Command / Citizen)
4. **Policy-Aware AI (UNITY Sentinel)** — ingest government circulars into a vector-backed RAG system for compliance audit
5. **Zero-Friction Deployment** — auto-fallback to in-memory MongoDB when remote cluster unavailable

---

## 2. System Topology

```
+------------------------------------------------------------------+
|                       CLIENT / BROWSER                           |
|                                                                  |
|  Authority Workspace   Command Workspace    Citizen Portal       |
|  (Collector/Engineers) (Nodal/State Sec)   (Public/Guest)       |
|         |                   |                   |               |
|         +-------------------+-------------------+               |
|                             |                                   |
|         React 19 SPA (Vite + React Router v7)                   |
|         Zustand (sessionStorage auth) + TanStack Query v5        |
+---------------------------|--------------------------------------+
                             |
              HTTP REST/JSON | Dev: Vite Proxy :5173→:5001
              Authorization: Bearer <JWT>
                             ▼
+------------------------------------------------------------------+
|                     BACKEND API SERVER                           |
|                   Node.js / Express 4                            |
|              CORS Enabled | JWT Auth Guard Middleware            |
|                                                                  |
|  Auth Service      Main Controller     Sentinel AI & Ripple      |
|  (/api/v1/auth)    (/api/v1/*)         (/api/v1/sentinel)        |
|         |               |                   |                   |
|         +-----------Mongoose 8 ODM----------+                   |
+---------------------------|--------------------------------------+
                             ▼
+------------------------------------------------------------------+
|                     DATA STORAGE LAYER                           |
|  Primary: MongoDB Atlas (via MONGODB_URI)                        |
|  Fallback: MongoMemoryServer (auto-spawn, auto-seed)             |
+------------------------------------------------------------------+
```

---

## 3. Frontend/Backend Separation & API Proxy

### Ports
- **Frontend dev server**: `http://localhost:5173`
- **Backend API server**: `http://localhost:5001`

### Vite Proxy (`vite.config.js`)
```javascript
proxy: { '/api': { target: 'http://localhost:5001', changeOrigin: true } }
```

### API Base URL Resolution (`constants.js`)
```javascript
1. import.meta.env.VITE_API_URL (explicit env override, highest priority)
2. hostname.includes('onrender.com') → 'https://unity-backend-0i2e.onrender.com/api/v1'
3. Default: '/api/v1' (proxied by Vite to localhost:5001)
```

### Axios Singleton (`axiosInstance.js`)
- `baseURL: API_BASE`, `timeout: 15000ms`
- **Request interceptor**: reads `sessionStorage['unity-auth']` → injects `Authorization: Bearer <token>`
- **Response interceptor**: unwraps `response.data` automatically; on 401 clears storage → redirects to `/select-role`

---

## 4. Role-Based Authentication & Authorization (RBAC)

### Auth Flow
```
/select-role → pick workspace
    ↓
/auth/login → POST { identifier, password }
    ↓
Backend: bcrypt.compare → jwt.sign → { requiresOtp: false, user, token, refreshToken }
    ↓
Frontend: useAuth → storeLogin(user, token, refreshToken)
    ↓
Navigate to getHomeRoute(user.role)
    ↓
ProtectedRoute: checks isAuthenticated + role + session expiry on every render
```

### Role → Workspace → Home Route
| Role | Title | Workspace | Home |
|------|-------|-----------|------|
| `collector` | District Collector | authority | `/authority/dashboard` |
| `commissioner` | Municipal Commissioner | authority | `/authority/dashboard` |
| `executive_engineer` | Executive Engineer | authority | `/authority/dashboard` |
| `dept_officer` | Department Officer | authority | `/authority/dashboard` |
| `nodal_officer` | Nodal Officer | command | `/command/overview` |
| `chief_secretary` | Chief Secretary | command | `/command/overview` |
| `citizen` | Citizen | citizen | `/citizen/home` |
| `guest` | Guest | citizen | `/citizen/home` |

### `ProtectedRoute.jsx` Logic
```javascript
if (isSessionExpired()) → logout → /select-role?reason=session_expired
if (!isAuthenticated)   → /select-role
if (!allowedRoles.includes(user.role)) → getHomeRoute(user.role) [self-healing redirect]
```

---

## 5. State Management: Zustand + sessionStorage

### `authStore.js` State Shape
```javascript
{
  user: { id, name, email, role, department, avatar } | null,
  token: string | null,
  refreshToken: string | null,
  isAuthenticated: boolean,
  sessionExpiry: number | null  // epoch ms
}
```

### Actions
- `login(user, token, refreshToken)` — sets all fields, `sessionExpiry = now + 30min`
- `logout()` — purges all fields
- `setToken(token)` — updates access token after refresh
- `extendSession()` — resets expiry on user activity
- `isSessionExpired()` — `Date.now() > sessionExpiry`
- `loginAsGuest()` — anonymous guest, no JWT

### Security
- `sessionStorage` (not `localStorage`) → tokens cleared on tab close
- 30-min inactivity timeout enforced by `SessionTimeoutModal.jsx`

---

## 6. React Router Architecture

```
/ → redirect → /select-role (RoleSelectionPage)
    │
    ├── /auth/* (AuthLayout)
    │   ├── /login  (LoginPage)
    │   ├── /verify (OtpVerifyPage — stub)
    │   └── /forgot (ForgotPasswordPage)
    │
    ├── /authority/* (ProtectedRoute: collector/commissioner/exec_engineer/dept_officer)
    │   └── AuthorityLayout: sidebar + topbar
    │       ├── /dashboard, /projects, /projects/:id
    │       ├── /map, /departments, /coordination
    │       ├── /approvals, /brief, /analytics, /settings
    │
    ├── /command/* (ProtectedRoute: nodal_officer/chief_secretary)
    │   └── CommandLayout: dark shell + IST clock + nav tabs
    │       ├── /overview, /escalations, /matrix, /projects
    │       ├── /citizens, /funding, /reports, /kpis
    │       ├── /health, /ai
    │
    └── /citizen/* (public — no role restriction)
        └── CitizenLayout: civic branding + helpline banner
            ├── /home, /report, /projects, /schemes
            ├── /track, /notifications, /profile
```

All page views are code-split with `React.lazy()` + `<Suspense>`.

---

## 7. Domain Intelligence Subsystems

### Coordination Readiness Index (CRI) — 0-100 Score
5 dimensions × 20 points each:
1. **Land Readiness** — Revenue Dept land acquisition completion
2. **Utility Readiness** — MPEB, Water, Telecom clearance status
3. **Department Responses** — resolved inter-dept dependencies ratio
4. **Budget Readiness** — proximity to penalty activation dates
5. **Risk Assessment** — inverse of max stalled task days

Bands: ≥80 = Ready (Green), 50–79 = Moderate Risk (Amber), <50 = Critical (Red)

### Bottleneck Index
$$\text{Score} = (15 \times \text{Active Blocks}) + (20 \times \text{Delayed Projects}) + (5 \times \log_{10}(\text{Budget Exposure}))$$
Normalized to 0-100. Identifies primary systemic blocking department.

### Ripple Cascade Engine (`rippleEngine.js`)
- BFS traversal across `Dependency` network from a root department
- Projects: cost exposure, daily idle burn, penalty breach dates, citizen impact
- Endpoint: `GET /api/v1/cascade/simulate?dept=&delay=`

### UNITY Sentinel (`sentinelService.js`)
- Ingest: chunk + embed policy docs into MongoDB `VectorChunk` collection
- Query: cosine similarity RAG search → matching regulatory references
- Review: compliance audit of a proposed directive → Executive Decision Brief
- LLM hierarchy: NVIDIA NIM → Groq → Gemini → Deterministic offline fallback
