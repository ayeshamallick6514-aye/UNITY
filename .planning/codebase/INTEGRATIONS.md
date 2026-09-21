# External Integrations & API Contracts: UNITY Platform

## 1. Base URL Resolution (`frontend/src/utils/constants.js`)
```javascript
const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined') {
    if (window.location.hostname.includes('onrender.com')) {
      return 'https://unity-backend-0i2e.onrender.com/api/v1'; // Hardcoded
    }
  }
  return '/api/v1'; // Proxied by Vite to localhost:5001 in dev
};
export const API_BASE = getApiBase();
```

## 2. Axios Singleton (`axiosInstance.js`)
- `baseURL`: `API_BASE`
- `timeout`: 15,000 ms
- **Request interceptor**: reads `sessionStorage['unity-auth']` → extracts `state.token` → sets `Authorization: Bearer <token>`
- **Response interceptor**: unwraps `response.data` automatically. On 401 (non-auth routes): clears storage, redirects to `/select-role`. Rejects with `{ status, message }`.

## 3. Authentication API (`authService.js` → `/api/v1/auth`)

| Method | Route | Body | Response |
|--------|-------|------|----------|
| `login` | POST `/auth/login` | `{ identifier, password }` | `{ requiresOtp: false, user, token, refreshToken }` |
| `verifyOtp` | POST `/auth/verify-otp` | `{ email, otp }` | Disabled — returns 400 |
| `refresh` | POST `/auth/refresh` | `{ refreshToken }` | `{ token }` |
| `forgotPassword` | POST `/auth/forgot-password` | `{ email }` | `{ message }` |
| `logout` | POST `/auth/logout` | None | `{ success: true, message }` |
| `me` | GET `/auth/me` | — (Bearer header) | `{ user }` |

## 4. Dashboard API (`api.js` → `/api/v1`)

| Method | Route | Description |
|--------|-------|-------------|
| `getDashboard` | GET `/dashboard` | Consolidated KPIs, alerts, decisions |
| `getBriefSummary` | GET `/brief/summary` | Morning briefing stats |
| `getAttentionPriorities` | GET `/alerts/priorities` | Priority-ranked critical tasks |
| `getActiveDecisions` | GET `/decisions/active` | Pending interdepartmental dependencies |
| `getMatrixGrid` | GET `/matrix/grid` | Department dependency cross-tabulation |
| `getBottlenecks` | GET `/bottlenecks/index` | Bottleneck Index gauges per department |
| `getCitizenImpact` | GET `/impact/citizens` | Citizens affected by category |
| `getEvents` | GET `/events?filter={type}` | Audit log (filter: all/completed/flagged/critical/info) |
| `executeDecisionAction` | POST `/decisions/action` | Authorize/escalate/defer a dependency |
| `simulateRipple` | GET `/cascade/simulate?dept=&delay=` | BFS cascade simulation |
| `getCostExposure` | GET `/cost/exposure` | Cost exposure in Crore/Lakh |
| `fetchProjectCRI` | GET `/projects/:id/cri` | Coordination Readiness Index per project |
| `fetchAllProjectsCRI` | GET `/projects/cri/all` | CRI scores for all projects |

## 5. Sentinel AI API (`/api/v1/sentinel`)

| Method | Route | Body | Description |
|--------|-------|------|-------------|
| `sentinelIngest` | POST `/sentinel/ingest` | `{ title, source, dept, docType, content }` | Embed policy doc into vector store |
| `sentinelQuery` | POST `/sentinel/query` | `{ query }` | Semantic RAG query → executive instruction |
| `sentinelReview` | POST `/sentinel/review` | `{ dependencyId, decisionKey }` | Compliance audit → Executive Brief |
| `sentinelHistory` | GET `/sentinel/history` | — | Past audits, queries, documents |

## 6. JWT Token Architecture

### Signing (`authController.js`)
- **Access Token**: payload `{ id, name, email, role, department }`, secret `JWT_SECRET`, expires `8h`
- **Refresh Token**: payload `{ id, role }`, secret `JWT_REFRESH_SECRET`, expires `7d`
- Both secrets have hardcoded fallbacks for Render (where `.env` is gitignored)

### Verification (`middleware/auth.js`)
- Extracts `Bearer <token>` from `Authorization` header
- Calls `jwt.verify(token, JWT_SECRET)` → populates `req.user`
- `requireRole(['collector'])` middleware enforces role access

### Client Storage (`authStore.js`)
- Zustand store with `persist` middleware → `sessionStorage['unity-auth']`
- Clears automatically when browser tab closes
- Session expires after 30 min inactivity (`SESSION_TIMEOUT_MS`)
- `ProtectedRoute.jsx` checks `isSessionExpired()` on every render

## 7. Role → Workspace Routing (`roleConfig.js`)

| Role | Workspace | Home Route |
|------|-----------|------------|
| `collector` | authority | `/authority/dashboard` |
| `commissioner` | authority | `/authority/dashboard` |
| `executive_engineer` | authority | `/authority/dashboard` |
| `dept_officer` | authority | `/authority/dashboard` |
| `nodal_officer` | command | `/command/overview` |
| `chief_secretary` | command | `/command/overview` |
| `citizen` | citizen | `/citizen/home` |
| `guest` | citizen | `/citizen/home` |

## 8. AI/LLM Provider Hierarchy (Sentinel Service)

```
LLM Request
    ↓
1. NVIDIA NIM API (if NVIDIA_API_KEY set)
   - Embeddings: nvidia/embeddings-nv-embed-qa-4
   - Chat: meta/llama-3-70b-instruct
    ↓ (fallback)
2. Groq API (if GROQ_API_KEY set)
   - Chat: llama-3.3-70b-versatile
    ↓ (fallback)
3. Google Gemini API (if GEMINI_API_KEY set)
   - Embeddings: text-embedding-004
   - Chat: gemini-1.5-flash
    ↓ (fallback)
4. Deterministic Offline Mock
   - 768-dim token hash embeddings
   - Rule-based template executive briefs
```

## 9. Database Integration (`backend/src/config/db.js`)

- **Production**: MongoDB Atlas via `MONGODB_URI` env var
- **Development/No-URI fallback**: `mongodb-memory-server` — starts in-memory MongoDB, auto-seeds demo data on empty DB
- **Seed data**: Departments, users, projects, tasks, dependencies, citizen impact metrics, Sentinel vector chunks
- **⚠️ Data resets on every Render restart** (in-memory, not persistent)
