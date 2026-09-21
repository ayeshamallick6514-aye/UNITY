# UNITY — Onboarding Summary

**Onboarded:** September 2026
**Method:** `gsd-onboard` — brownfield codebase map → docs ingest → project initialization

---

## What Was Learned

### Product
UNITY is a **government smart city coordination platform** for Bhopal, Madhya Pradesh. It connects 5 user roles across 3 workspaces (Authority / Command / Citizen), powering real-time inter-departmental decision intelligence through 32 pages, a Sentinel AI module, and a live ripple cascade engine.

### Codebase
- **Frontend**: React 19 + Vite 8 + Tailwind v4 + Zustand + TanStack Query
- **Backend**: Node.js + Express 4 + Mongoose + mongodb-memory-server (in-memory, auto-seeded)
- **Auth**: Dual JWT (access 8h + refresh 7d), role embedded in token, stored in sessionStorage
- **32 pages** across 3 workspaces, all code-split with React.lazy

### Current State
**Feature complete. Deployment stabilization in progress.**
- ✅ Local backend: all 5 demo accounts login and return correct role-routed responses
- ✅ Frontend build: clean (2408 modules, 0 errors)
- ✅ Frontend on Render: loads correctly
- ❌ **Backend on Render**: running old code (OTP flow) — `POST /api/v1/auth/login` returns 404

### Active Blocker
**Manual redeploy required on Render.**
Go to: [render.com](https://dashboard.render.com) → `UNITY-backend` service → Manual Deploy → Deploy latest commit (`5d0e1ad`)

---

## Planning Artifacts Created

```
.planning/
├── PROJECT.md          ← Product definition, vision, tech rationale
├── REQUIREMENTS.md     ← Functional + NFR requirements, demo credentials
├── ROADMAP.md          ← Phase-by-phase milestone plan with status
├── STATE.md            ← Current state snapshot, active blocker, next actions
└── codebase/
    ├── STACK.md        ← Full tech stack with versions
    ├── INTEGRATIONS.md ← API contracts, JWT architecture, LLM hierarchy
    ├── ARCHITECTURE.md ← System design, RBAC, route tree, domain algorithms
    ├── STRUCTURE.md    ← Complete annotated directory tree
    ├── CONVENTIONS.md  ← Naming, code style, UI components, Tailwind patterns
    ├── TESTING.md      ← Test gap analysis, known working/broken flows
    └── CONCERNS.md     ← Risk register with 9 prioritized issues
```

---

## Next Commands

| Intent | Command |
|--------|---------|
| Check current state | `/gsd-progress` |
| Start a new fix phase | `/gsd-plan-phase` |
| Run a quick fix | `/gsd-quick` |
| Debug an issue | `/gsd-debug` |
| Audit what's broken | `/gsd-audit-fix` |

---

## Critical Risks (Top 3)

| Risk | Severity | Fix |
|------|----------|-----|
| Render backend not redeployed | 🔴 High — blocks production login | Manual redeploy on Render dashboard |
| Forgeable `x-user-role` header on `/decisions/action` | 🔴 Critical — security hole | Add `verifyToken` middleware to that route |
| In-memory DB resets on every Render restart | 🔴 High — data loss | Connect MongoDB Atlas via `MONGODB_URI` |
