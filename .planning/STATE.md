# UNITY — Project State

## Current Milestone
**Milestone 1: MVP Hackathon Demo**

## Active Phase
**Phase 7: Deployment Stabilization** — 🔧 In Progress

## Current Status
Feature development is **COMPLETE**. The application is deployed. One blocker remains:

### 🚨 Active Blocker
**Render backend not running latest code.**

- Backend URL: `https://unity-backend-0i2e.onrender.com`
- Frontend URL: `https://unity-frontend-c9z7.onrender.com`
- GitHub: `https://github.com/ayeshamallick6514-aye/UNITY`
- Latest commit: `5d0e1ad` — "fix: hardcode Render backend URL, add fallback JWT secrets, fix CORS, harden login flow"
- Problem: Render backend is running old OTP-based code. `/api/v1/auth/login` returns 404.
- Fix required: **Manual redeploy on Render dashboard** (Auto-deploy is not triggering)

### What Was Fixed (committed, not yet live on Render)
1. `backend/src/controllers/authController.js` — direct login, fallback JWT secrets
2. `backend/server.js` — CORS explicit, auth routes mounted before api routes, JSON root response
3. `frontend/src/utils/constants.js` — API_BASE hardcoded to `https://unity-backend-0i2e.onrender.com/api/v1`
4. `frontend/src/hooks/useAuth.js` — defensive response parsing, handles both OTP and direct shapes

## Last Verified Working
- Local backend: ✅ All 5 demo accounts login successfully
- Local frontend build: ✅ Clean (2408 modules, 0 errors)
- Render frontend: ✅ Loads and displays login form
- Render backend: ❌ Auth routes not responding (old code)

## Next Actions
1. **USER ACTION**: Manually redeploy backend on Render dashboard
2. Test login on `https://unity-frontend-c9z7.onrender.com` with `collector@bhopal.mp.gov.in / Unity@2025`
3. Verify role-based routing: collector → `/authority/dashboard`, nodal → `/command/overview`, citizen → `/citizen/home`
4. Hackathon demo ready ✅

## Planning Directory
```
.planning/
├── PROJECT.md          ← Product definition
├── REQUIREMENTS.md     ← Functional + non-functional requirements
├── ROADMAP.md          ← Milestone/phase plan with status
├── STATE.md            ← This file — current state snapshot
└── codebase/
    ├── STACK.md        ← Tech stack
    ├── INTEGRATIONS.md ← Service integrations + API contracts
    ├── ARCHITECTURE.md ← System design
    ├── STRUCTURE.md    ← Directory structure
    ├── CONVENTIONS.md  ← Code conventions
    ├── TESTING.md      ← Testing approach
    └── CONCERNS.md     ← Known issues + risks
```
