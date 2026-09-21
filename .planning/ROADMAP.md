# UNITY — Roadmap

> Status Legend: ✅ Done | 🔧 In Progress | 📋 Planned | ❌ Blocked

---

## Milestone 1: MVP Hackathon Demo
**Goal**: Fully functional deployed application for hackathon presentation.

### Phase 1: Core Authentication ✅
- [x] Role selection page (Authority / Command / Citizen)
- [x] Login page with demo credentials display
- [x] JWT-based auth (access + refresh tokens)
- [x] Zustand auth store with sessionStorage persistence
- [x] ProtectedRoute with role-based access control
- [x] Session timeout (30 min inactivity)
- [x] Remove OTP flow — direct single-step login for all roles

### Phase 2: Authority Workspace ✅
- [x] Dashboard with KPIs, project cards, Bhopal hero banner
- [x] Projects / Mission Control (dynamic Gantt, timelines, new mission modal)
- [x] Live Map with layer controls and department overlays
- [x] Departments directory
- [x] Coordination matrix
- [x] Approvals queue
- [x] Executive Brief (morning intelligence briefing)

### Phase 3: Command Workspace ✅
- [x] Mission Overview
- [x] Escalations
- [x] Department Matrix
- [x] Project Monitoring
- [x] Citizen Alerts
- [x] Funding Risks
- [x] Executive Reports
- [x] Performance KPIs
- [x] System Health
- [x] AI Recommendations (Sentinel)

### Phase 4: Citizen Workspace ✅
- [x] Citizen Home portal
- [x] Report Issue form
- [x] Nearby Projects map view
- [x] Government Schemes (filters, details modal, application form, eligibility wizard)
- [x] Track Complaint
- [x] Notifications
- [x] Profile

### Phase 5: Backend & Integration ✅
- [x] Express API with in-memory MongoDB
- [x] Auth endpoints (login, refresh, logout, me)
- [x] Dashboard/decisions/bottleneck/ripple endpoints
- [x] Sentinel AI module (policy query, compliance, ingest, history)
- [x] CORS configured
- [x] Fallback JWT secrets (no .env required on Render)

### Phase 6: Branding & UI Polish ✅
- [x] UNITY logo (handshake U-shape SVG)
- [x] Bhopal cityscape hero image
- [x] Government command center aesthetic
- [x] Smart city loader (MP government branding)
- [x] Dark navy/slate/blue color system

### Phase 7: Deployment Stabilization 🔧
- [x] Frontend deployed to Render: `https://unity-frontend-c9z7.onrender.com`
- [x] Backend deployed to Render: `https://unity-backend-0i2e.onrender.com`
- [x] API_BASE hardcoded to correct backend URL
- [x] Auth flow fixed (removed OTP, defensive response parsing)
- [ ] **BLOCKED**: Render backend needs manual redeploy to pick up latest code
- [ ] Verify login works end-to-end on production

---

## Milestone 2: Post-Hackathon Hardening (Future)
**Goal**: Production-ready with real data.

### Phase 8: Real Database
- [ ] Connect to MongoDB Atlas (replace in-memory)
- [ ] Persistent user management
- [ ] Real project data ingestion

### Phase 9: Real AI Layer
- [ ] Replace mock Sentinel with actual RAG pipeline
- [ ] PDF/document ingestion for real policy circulars
- [ ] Multi-document cross-reference analysis

### Phase 10: Testing
- [ ] Unit tests for auth flow
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical user journeys

### Phase 11: Security Hardening
- [ ] Move JWT secrets to proper secrets management
- [ ] Rate limiting on auth endpoints
- [ ] Input validation/sanitization
- [ ] Remove hardcoded demo credentials

---

## Current Blocker
**Render backend not auto-deploying.**
Action: Go to Render dashboard → UNITY-backend → Manual Deploy → Deploy latest commit.
Once done: all login flows will work on production.
