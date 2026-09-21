# UNITY Project Structure & Directory Map

## 1. Root Directory

```
govt 2/
├── .git/
├── .gitignore
├── .planning/                        ← GSD planning artifacts (new)
│   ├── PROJECT.md
│   ├── REQUIREMENTS.md
│   ├── ROADMAP.md
│   ├── STATE.md
│   └── codebase/
│       ├── ARCHITECTURE.md
│       ├── CONCERNS.md
│       ├── CONVENTIONS.md
│       ├── INTEGRATIONS.md
│       ├── STACK.md
│       ├── STRUCTURE.md              ← This file
│       └── TESTING.md
├── backend/                          ← Node.js / Express API
├── frontend/                         ← React 19 SPA
├── integration_report.md             ← E2E integration verification
├── README.md                         ← Project documentation
├── UNITY_Government_PRD_Bhopal_PWD_Pilot.docx
└── build_unity_prd.py
```

---

## 2. Backend Structure

```
backend/
├── server.js                         ← Express entry point, CORS, route mounting
├── package.json
├── .env                              ← Gitignored — PORT, MONGODB_URI, JWT secrets
└── src/
    ├── config/
    │   └── db.js                     ← Mongoose + MongoMemoryServer auto-fallback
    ├── controllers/
    │   ├── authController.js         ← login, logout, refresh, me, verifyOtp stub
    │   ├── mainController.js         ← dashboard, CRI, bottleneck, decisions, cost
    │   └── rippleController.js       ← Cascade simulation endpoint handler
    ├── middleware/
    │   └── auth.js                   ← verifyToken, requireRole factories
    ├── models/                       ← 12 Mongoose schemas
    │   ├── AuditEvent.js
    │   ├── CitizenImpact.js
    │   ├── DecisionReview.js
    │   ├── Department.js
    │   ├── Dependency.js
    │   ├── Directive.js
    │   ├── Document.js
    │   ├── PolicyQuery.js
    │   ├── Project.js
    │   ├── Task.js
    │   ├── User.js
    │   └── VectorChunk.js
    ├── routes/
    │   ├── auth.js                   ← /api/v1/auth/*
    │   ├── api.js                    ← /api/v1/* (dashboard, matrix, CRI, events)
    │   └── sentinel.js               ← /api/v1/sentinel/*
    ├── scripts/
    │   └── seed.js                   ← Bhopal civic demo data seeder
    └── services/
        ├── rippleEngine.js           ← BFS cascade delay simulation
        └── sentinelService.js        ← RAG policy retrieval & compliance review
```

### Backend Route → Controller Mapping

**Auth Routes** (`/api/v1/auth/*`):
| Method | Route | Handler |
|--------|-------|---------|
| POST | `/auth/login` | `authController.login` |
| POST | `/auth/verify-otp` | `authController.verifyOtp` (stub — returns 400) |
| POST | `/auth/refresh` | `authController.refresh` |
| POST | `/auth/forgot-password` | `authController.forgotPassword` |
| POST | `/auth/logout` | `authController.logout` |
| GET | `/auth/me` | `authController.me` (requires `verifyToken`) |

**API Routes** (`/api/v1/*`):
| Method | Route | Handler |
|--------|-------|---------|
| GET | `/dashboard` | `mainController.getDashboardData` |
| GET | `/brief/summary` | `mainController.getBriefSummary` |
| GET | `/alerts/priorities` | `mainController.getAttentionPriorities` |
| GET | `/decisions/active` | `mainController.getActiveDecisions` |
| POST | `/decisions/action` | `mainController.executeDecisionAction` |
| GET | `/matrix/grid` | `mainController.getDependencyMatrix` |
| GET | `/bottlenecks/index` | `mainController.getBottlenecks` |
| GET | `/impact/citizens` | `mainController.getCitizenImpactData` |
| GET | `/events` | `mainController.getEventLog` |
| GET | `/cost/exposure` | `mainController.getCostExposureData` |
| GET/POST | `/cascade/simulate` | `rippleController.simulateRippleDelay` |
| GET | `/projects/:id/cri` | `mainController.getProjectCRI` |
| GET | `/projects/cri/all` | `mainController.getAllProjectsCRI` |

---

## 3. Frontend Structure

```
frontend/
├── index.html                        ← Root HTML template
├── vite.config.js                    ← Vite config, @tailwindcss/vite, dev proxy
├── eslint.config.js
├── package.json
├── dist/                             ← Production build output
└── src/
    ├── main.jsx                      ← React DOM mount, QueryClientProvider, BrowserRouter
    ├── App.jsx                       ← All routes, ErrorBoundary, Suspense, lazy imports
    ├── index.css                     ← Tailwind v4 @theme tokens, global styles
    │
    ├── assets/
    │   └── bhopal_hero.png           ← Hero background on RoleSelectionPage + LoginPage
    │
    ├── utils/
    │   ├── constants.js              ← API_BASE, APP_NAME, ROLES, DEPARTMENTS, MAP_LAYERS
    │   └── roleConfig.js             ← getHomeRoute(), getWorkspace(), role permissions map
    │
    ├── store/
    │   └── authStore.js              ← Zustand auth store (persist → sessionStorage)
    │
    ├── services/
    │   ├── axiosInstance.js          ← Axios singleton, JWT interceptors, 401 handler
    │   ├── authService.js            ← login, verifyOtp, refresh, forgotPassword, logout, me
    │   └── api.js                    ← All domain API methods (dashboard, CRI, Sentinel, etc.)
    │
    ├── hooks/
    │   ├── useAuth.js                ← login, logout, forgotPassword, OTP stub
    │   ├── useCRI.js                 ← CRI score query for a project
    │   ├── useDashboard.js           ← Dashboard data query
    │   ├── useDecisions.js           ← Decisions query + action mutation + cache invalidation
    │   ├── useProjects.js            ← Project catalog query + static detail fallback
    │   └── useSentinel.js            ← Sentinel query, review, ingest, history hooks
    │
    ├── layouts/
    │   ├── AuthLayout.jsx            ← Centered card for login/OTP/forgot pages
    │   ├── AuthorityLayout.jsx       ← Fixed sidebar + topbar shell for Authority workspace
    │   ├── CommandLayout.jsx         ← Dark shell + IST clock + horizontal nav for Command
    │   └── CitizenLayout.jsx         ← Civic branding + helpline + search for Citizen portal
    │
    ├── components/
    │   ├── shared/                   ← Cross-workspace chrome & guards
    │   │   ├── ProtectedRoute.jsx    ← RBAC route guard + session expiry check
    │   │   ├── AuthoritySidebar.jsx  ← Left nav for Authority workspace
    │   │   ├── AuthorityTopBar.jsx   ← Top bar with title + profile for Authority
    │   │   ├── UnityLogo.jsx         ← Stylized UNITY logo SVG component
    │   │   ├── Loader.jsx            ← Boot screen loader (MP govt branding)
    │   │   ├── SessionTimeoutModal.jsx ← 30-min inactivity warning dialog
    │   │   └── ErrorBoundary.jsx     ← React class-based crash boundary
    │   │
    │   ├── ui/                       ← Design system atoms (27 components)
    │   │   ├── Accordion.jsx
    │   │   ├── Alert.jsx
    │   │   ├── Avatar.jsx
    │   │   ├── Badge.jsx             ← Semantic status pills
    │   │   ├── Button.jsx            ← Multi-variant action button
    │   │   ├── Card.jsx              ← Compound container card
    │   │   ├── Checkbox.jsx
    │   │   ├── Drawer.jsx
    │   │   ├── Dropdown.jsx
    │   │   ├── EmptyState.jsx
    │   │   ├── FilterChips.jsx
    │   │   ├── Input.jsx
    │   │   ├── KPIBlock.jsx          ← Executive metric summary card
    │   │   ├── Modal.jsx
    │   │   ├── Pagination.jsx
    │   │   ├── Progress.jsx
    │   │   ├── Radio.jsx
    │   │   ├── SearchBar.jsx
    │   │   ├── Select.jsx
    │   │   ├── Skeleton.jsx
    │   │   ├── Spinner.jsx
    │   │   ├── Switch.jsx
    │   │   ├── Table.jsx
    │   │   ├── Tabs.jsx
    │   │   ├── Textarea.jsx
    │   │   ├── Toast.jsx
    │   │   └── Tooltip.jsx
    │   │
    │   ├── map/
    │   │   └── UnityMap.jsx          ← Leaflet GIS map with layer toggles
    │   │
    │   └── [Domain Widgets]          ← Dashboard-embedded widgets
    │       ├── AttentionPanel.jsx
    │       ├── BottleneckIndex.jsx
    │       ├── CitizenImpact.jsx
    │       ├── CoordinationIssues.jsx
    │       ├── CostIntelligence.jsx
    │       ├── CRIWidget.jsx
    │       ├── DecisionModal.jsx
    │       ├── DecisionsBoard.jsx
    │       ├── DependenciesMatrix.jsx
    │       ├── EventLog.jsx
    │       ├── ExecDecisions.jsx
    │       ├── InsightsForecast.jsx
    │       ├── IntelligenceMap.jsx
    │       ├── InterventionTimeline.jsx
    │       ├── MorningBrief.jsx
    │       ├── NetworkGraph.jsx
    │       ├── PublicServiceImpact.jsx
    │       ├── RippleEffect.jsx
    │       └── UnitySentinel.jsx
    │
    └── pages/                        ← 32 routed page components
        ├── RoleSelectionPage.jsx     ← /select-role
        ├── auth/
        │   ├── LoginPage.jsx         ← /auth/login
        │   ├── OtpVerifyPage.jsx     ← /auth/verify (stub)
        │   └── ForgotPasswordPage.jsx ← /auth/forgot
        ├── authority/
        │   ├── Dashboard.jsx         ← /authority/dashboard
        │   ├── Projects.jsx          ← /authority/projects
        │   ├── ProjectDetail.jsx     ← /authority/projects/:id
        │   ├── LiveMap.jsx           ← /authority/map
        │   ├── Departments.jsx       ← /authority/departments
        │   ├── Coordination.jsx      ← /authority/coordination
        │   ├── Approvals.jsx         ← /authority/approvals
        │   ├── ExecutiveBrief.jsx    ← /authority/brief
        │   └── components/           ← ProjectDetail tab panels
        │       ├── OverviewTab.jsx
        │       ├── DependenciesTab.jsx
        │       ├── CRITab.jsx
        │       ├── MilestonesTab.jsx
        │       ├── DocumentsTab.jsx
        │       ├── ApprovalsTab.jsx
        │       ├── FinancialTab.jsx
        │       ├── CoordinationTab.jsx
        │       ├── SentinelSearchPanel.jsx
        │       ├── SentinelIngestPanel.jsx
        │       └── SentinelHistoryPanel.jsx
        ├── command/
        │   ├── MissionOverview.jsx   ← /command/overview
        │   ├── Escalations.jsx       ← /command/escalations
        │   ├── DeptMatrix.jsx        ← /command/matrix
        │   ├── ProjectMonitoring.jsx ← /command/projects
        │   ├── CitizenAlerts.jsx     ← /command/citizens
        │   ├── FundingRisks.jsx      ← /command/funding
        │   ├── ExecutiveReports.jsx  ← /command/reports
        │   ├── PerformanceKPIs.jsx   ← /command/kpis
        │   ├── SystemHealth.jsx      ← /command/health
        │   └── AIRecommendations.jsx ← /command/ai
        ├── citizen/
        │   ├── CitizenHome.jsx       ← /citizen/home
        │   ├── ReportIssue.jsx       ← /citizen/report
        │   ├── NearbyProjects.jsx    ← /citizen/projects
        │   ├── GovSchemes.jsx        ← /citizen/schemes
        │   ├── TrackComplaint.jsx    ← /citizen/track
        │   ├── CitizenNotifications.jsx ← /citizen/notifications
        │   └── CitizenProfile.jsx    ← /citizen/profile
        └── error/
            ├── ForbiddenPage.jsx     ← /forbidden (403)
            ├── UnauthorizedPage.jsx  ← /unauthorized (401)
            └── NotFoundPage.jsx      ← * (404)
```
