# UNITY — Requirements

## Functional Requirements

### FR-01: Role-Based Authentication
- Users authenticate via email OR employee ID + password
- Backend returns `{ requiresOtp: false, user, token, refreshToken }`
- OTP flow is DISABLED — all roles log in directly
- Roles: `collector`, `commissioner`, `executive_engineer`, `dept_officer`, `nodal_officer`, `chief_secretary`, `citizen`
- Session stored in `sessionStorage` (cleared on tab close)
- Session timeout: 30 minutes of inactivity

### FR-02: Authority Workspace (Collectors, Engineers, Commissioners)
- Dashboard: KPIs, project cards, map, NOC table, bottleneck status
- Projects: Mission control with Gantt charts, timelines, dependency lists
- Live Map: Layer controls, infrastructure overlay, zone labels, department status
- Departments: Department directory and performance view
- Coordination: Cross-department coordination matrix
- Approvals: NOC/approval queue
- Executive Brief: Morning intelligence briefing

### FR-03: Command Workspace (Nodal Officers, Chief Secretary)
- Mission Overview: High-level governance command center
- Escalations: Active escalation queue
- Department Matrix: Cross-department dependency grid
- Project Monitoring: Portfolio-level monitoring
- Citizen Alerts: Live citizen-facing impact alerts
- Funding Risks: Budget and cost exposure view
- Executive Reports: Generated governance reports
- Performance KPIs: System-wide KPI dashboard
- System Health: Infrastructure health monitor
- AI Recommendations: Sentinel AI recommendation panel

### FR-04: Citizen Workspace
- Home: Citizen portal landing
- Report Issue: File a complaint/grievance
- Nearby Projects: Map view of nearby government projects
- Government Schemes: Browse, filter, apply for schemes (with eligibility wizard)
- Track Complaint: Track filed complaint status
- Notifications: Citizen alerts and updates
- Profile: Citizen profile management

### FR-05: UNITY Sentinel AI
- Policy query: Natural language query against government documents
- Compliance review: Audit a decision against policies
- Document ingestion: Ingest circulars/SOPs/orders
- Audit history: Log of all Sentinel interactions
- Generates Executive Decision Briefs with: situation, root cause, impact, cascade forecast, recommended directive

### FR-06: Dependency & Ripple Engine
- Real-time dependency matrix between departments
- BFS-based cascade simulation: how one delay propagates
- Cost exposure calculation in Crore/Lakh
- Citizen impact counter

## Non-Functional Requirements

### NFR-01: Performance
- Frontend loads in < 3 seconds on Render (after cold start)
- Backend API response < 500ms for all demo endpoints

### NFR-02: Security
- JWT access tokens expire in 8 hours
- Refresh tokens expire in 7 days
- Passwords hashed with bcrypt (salt 10)
- Session cleared on tab close

### NFR-03: Deployability
- Zero external database required (in-memory MongoDB auto-seeded)
- Frontend deploys as Render Static Site
- Backend deploys as Render Web Service
- All env vars have hardcoded fallbacks for hackathon demo

### NFR-04: UX
- Government command center aesthetic — no startup animations
- Role-based navigation — each role sees only their workspace
- Loader shows Madhya Pradesh government branding
- All demo data pre-seeded, no manual setup needed

## Demo Credentials
| Role | Login | Password |
|------|-------|----------|
| District Collector | `collector@bhopal.mp.gov.in` or `IAS-MP-2201` | `Unity@2025` |
| Executive Engineer | `engineer@bhopal.mp.gov.in` or `PWD-BPL-4412` | `Unity@2025` |
| Commissioner | `commissioner@bhopal.mp.gov.in` or `IAS-MP-1887` | `Unity@2025` |
| Nodal Officer | `nodal@bhopal.mp.gov.in` or `GOV-MP-7731` | `Unity@2025` |
| Citizen | `citizen@bhopal.mp.gov.in` | `Unity@2025` |
