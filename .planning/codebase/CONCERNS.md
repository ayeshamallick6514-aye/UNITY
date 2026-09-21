# Technical Concerns, Vulnerabilities & Risk Register

**Project:** UNITY (Unified Network for Interdepartmental Transparency and Yield)
**Target City:** Bhopal, Madhya Pradesh
**Last Updated:** September 2026
**Status:** Pre-Production / Hackathon Baseline

---

## Executive Summary

The UNITY platform is an interdepartmental coordination engine built to resolve administrative standoffs and project bottlenecks across Bhopal civic agencies (PWD, BMC, MPEB, Water Supply, Revenue). While the local integration demonstrates working core workflows (as documented in `integration_report.md`), the deployed cloud infrastructure and codebase architecture harbor critical operational risks, security trade-offs, and deployment gaps that must be resolved prior to pilot field deployment.

---

## 1. Deployment & Infrastructure Risks

### 1.1 Backend Deployment Gap on Render
- **Severity:** High (Active Blocker for Deployed Frontend)
- **Component:** Backend Web Service (`https://unity-backend-0i2e.onrender.com`)
- **Root Cause:** The Render web service is executing an older release containing the legacy OTP authentication flow. Recent commits implementing direct login, CORS config, and route updates have been pushed to GitHub but Render did not auto-redeploy.
- **Observed Behavior:** Auth endpoints return HTTP `404 Not Found` or legacy OTP payload `{ requiresOtp: true, ... }`.
- **Required Remediation:** Execute manual redeploy from Render dashboard → "Manual Deploy" → "Deploy latest commit". Enable Render Auto-Deploy on commit.

### 1.2 Ephemeral In-Memory Database (`mongodb-memory-server`)
- **Severity:** High (Data Loss & Non-Persistence)
- **Component:** `backend/src/config/db.js`
- **Root Cause:** Defaults to in-memory MongoDB when `MONGODB_URI` is not set. Every Render restart wipes data and re-seeds.
- **Impact:** All issued directives, audit events, and Sentinel ingested documents are lost on restart.
- **Required Remediation:** Provision MongoDB Atlas. Set `MONGODB_URI` in Render environment settings.

### 1.3 Asymmetric Render Subdomains
- **Severity:** Medium (Resolved via Hardcoding; Configuration Debt)
- **Component:** `frontend/src/utils/constants.js`
- **Root Cause:** Dynamic hostname swap (`frontend`→`backend`) failed because Render assigns independent random suffixes (`c9z7` vs `0i2e`).
- **Current Mitigation:** API_BASE hardcoded to `https://unity-backend-0i2e.onrender.com/api/v1`.
- **Required Remediation:** Inject `VITE_API_URL` during frontend build on Render instead of source-level hardcoding.

---

## 2. Authentication & Authorization Vulnerabilities

### 2.1 OTP Flow Contract Discrepancy (Resolved Defensively)
- **Severity:** High (Resolved in code, pending backend redeployment)
- **Root Cause:** Legacy backend returned `{ requiresOtp: true, email, role }` without `user` or `token`. Frontend tried `data.user.role` → crash.
- **Current Mitigation:** Backend now returns `{ requiresOtp: false, user, token, refreshToken }`. `useAuth.js` validates defensively.

### 2.2 Client-Supplied Header Role Authorization (`x-user-role`)
- **Severity:** Critical (Security Vulnerability)
- **Component:** `backend/src/controllers/mainController.js`
- **Root Cause:** `executeDecisionAction` validates authority via `req.headers['x-user-role']` — a client-controlled value, NOT from the JWT.
- **Impact:** Any client can forge `'x-user-role': 'Collector'` to authorize directives without authentication.
- **Required Remediation:** Apply `verifyToken` middleware to `POST /decisions/action`. Enforce role from `req.user.role`.

### 2.3 Hardcoded Demo Passwords
- **Severity:** Medium (Acceptable for Hackathon)
- **Root Cause:** All 5 demo accounts share `Unity@2025` hardcoded in `authController.js`.
- **Required Remediation (post-hackathon):** Migrate to MongoDB user collection, per-user bcrypt salts, government SSO.

---

## 3. Environment Variables & Configuration

### 3.1 Fallback JWT Secrets in Source Code
- **Severity:** High (Cryptographic Risk)
- **Root Cause:** `.env` is gitignored. Render backend had no env vars. Fallback secrets hardcoded:
  ```js
  const JWT_SECRET = process.env.JWT_SECRET || 'unity_govt_bhopal_secret_key_2025_mp';
  ```
- **Impact:** Tokens can be forged using the known public secret from the GitHub repo.
- **Required Remediation:** Set proper secrets in Render dashboard. Fail fast if missing in production.

### 3.2 Overly Permissive CORS (`origin: '*'`)
- **Severity:** Medium
- **Root Cause:** Set to wildcard to resolve cross-origin issues between mismatched Render subdomains.
- **Required Remediation:** Restrict to allowlist of authorized frontend domains only.

---

## 4. Quality & Testing

### 4.1 Zero Automated Test Coverage
- **Severity:** High (Regression Risk)
- **Root Cause:** No test runner in either `package.json`. All verification is manual per `integration_report.md`.
- **Required Remediation:** Add Vitest (frontend hooks/components) + Jest/Supertest (backend API routes).

### 4.2 Prop-Drilled `refreshKey` Synchronization
- **Severity:** Low–Medium (Architectural Fragility)
- **Root Cause:** Dashboard sync uses a scalar `refreshKey` incremented in `App.jsx`, triggering 16+ simultaneous refetches.
- **Required Remediation:** Migrate to TanStack Query cache invalidation (`queryClient.invalidateQueries`).

---

## 5. Risk Prioritization Matrix

| Risk | Category | Severity | Status | Action |
|------|----------|----------|--------|--------|
| Backend out of sync on Render | Deployment | **High** | ❌ Blocked | Manual redeploy on Render |
| Missing production JWT_SECRET | Security | **High** | ⚠️ Hardcoded fallback | Set in Render dashboard |
| In-memory database | Infrastructure | **High** | ⚠️ Ephemeral | Connect MongoDB Atlas |
| Forgeable `x-user-role` header | Authorization | **Critical** | ❌ Unmitigated | Enforce JWT middleware on `/decisions/action` |
| Hardcoded API_BASE URL | Configuration | **Medium** | ✅ Workaround | Use `VITE_API_URL` build var |
| Hardcoded credentials | Authentication | **Medium** | ⚠️ Demo only | DB-backed users post-hackathon |
| Permissive CORS | Security | **Medium** | ⚠️ Wildcard | Allowlist frontend domain |
| Zero automated tests | Testing | **High** | ❌ None | Add Vitest + Supertest |
| Prop-drilled refresh sync | Architecture | **Low** | ⚠️ Fragile | TanStack Query invalidation |
