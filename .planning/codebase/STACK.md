# Tech Stack Architecture: UNITY Government Decision Platform

## 1. System Architecture Overview
UNITY is structured as a decoupled client-server architecture:
1. **Frontend**: React 19 SPA built with Vite 8, Tailwind CSS v4, Zustand, TanStack Query, and Leaflet.
2. **Backend**: Modular REST API on Node.js + Express 4, with MongoDB/Mongoose (in-memory fallback) and an integrated AI/RAG decision intelligence engine (UNITY Sentinel).

---

## 2. Frontend Technology Stack

### Runtime & Language
- **Language**: ESM JavaScript (`"type": "module"`)
- **Core Framework**: React 19 (`react: ^19.2.6`, `react-dom: ^19.2.6`)
- **JSX Runtime**: Automatic JSX Transform via `@vitejs/plugin-react`

### Key Libraries
| Category | Package | Version | Purpose |
|----------|---------|---------|---------|
| Server State | `@tanstack/react-query` | `^5.101.2` | Cache, invalidation, background refetch for dashboard widgets |
| Client State | `zustand` | `^5.0.14` | Global auth state with `persist` middleware (sessionStorage) |
| Routing | `react-router-dom` | `^7.18.1` | Protected routes, layout nests, workspace branching |
| HTTP Client | `axios` | `^1.18.1` | Singleton with JWT interceptors and error normalization |
| Styling | `tailwindcss` | `^4.3.2` | Utility-first Tailwind v4 |
| Vite Plugin | `@tailwindcss/vite` | `^4.3.2` | Native Vite integration for Tailwind v4 |
| GIS Maps | `leaflet` | `^1.9.4` | Interactive maps for Bhopal spatial coordination |
| React Maps | `react-leaflet` | `^5.0.0` | React bindings for Leaflet |
| Animation | `framer-motion` | `^12.42.2` | Modals, collapsible matrices, view transitions |
| Forms | `react-hook-form` | `^7.81.0` | Form state management and validation |
| Icons | `lucide-react` | `^1.23.0` | Administrative icon library |
| CSS Post-Processing | `autoprefixer` | `^10.5.2` | Vendor prefix automation |

### Build & Tooling
- **Bundler**: Vite 8 (`vite: ^8.0.12`) + `@vitejs/plugin-react: ^6.0.1`
- **Path alias**: `@` → `./src` (configured in `vite.config.js`)
- **Local dev proxy**: `/api` → `http://localhost:5001` (Vite proxy)
- **Linter**: ESLint 10 with `react-hooks` and `react-refresh` plugins

### Frontend Scripts
```bash
npm run dev      # Vite dev server at http://localhost:5173 with HMR
npm run build    # Compile production assets to frontend/dist/
npm run preview  # Preview production build locally
npm run lint     # ESLint check
```

---

## 3. Backend Technology Stack

### Runtime & Language
- **Runtime**: Node.js (v18+ recommended)
- **Module System**: CommonJS (`require` / `module.exports`)

### Key Libraries
| Category | Package | Version | Purpose |
|----------|---------|---------|---------|
| Web Framework | `express` | `^4.19.2` | HTTP routing, middleware pipeline, REST controllers |
| ODM | `mongoose` | `^8.4.1` | MongoDB schema modeling (Projects, Tasks, Dependencies) |
| Embedded DB | `mongodb-memory-server` | `^11.2.0` | In-memory MongoDB when no `MONGODB_URI` set |
| Auth Tokens | `jsonwebtoken` | `^9.0.3` | Sign/verify dual JWTs (access + refresh) |
| Password Hashing | `bcryptjs` | `^3.0.3` | Salted hash + constant-time comparison |
| CORS | `cors` | `^2.8.5` | Cross-origin handling for Render cloud hosts |
| Env Config | `dotenv` | `^16.4.5` | Load `.env` in development |

### Backend Scripts
```bash
npm start       # node server.js on port 5001 (or $PORT)
npm run seed    # node src/scripts/seed.js
```

---

## 4. Deployment Targets

### Production: Render
| Service | Type | URL |
|---------|------|-----|
| Backend | Node.js Web Service | `https://unity-backend-0i2e.onrender.com` |
| Frontend | Static Site / SPA | `https://unity-frontend-c9z7.onrender.com` |
| Backend API root | — | `https://unity-backend-0i2e.onrender.com/api/v1` |
| Health check | — | `GET /health` |

### Local Development
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5001`
- Frontend proxies `/api/*` to `http://localhost:5001/api/*`

---

## 5. Source Control
- **Platform**: GitHub
- **Repository**: `https://github.com/ayeshamallick6514-aye/UNITY`
- **Primary branch**: `main`
- **Latest commit**: `5d0e1ad` — "fix: hardcode Render backend URL, add fallback JWT secrets, fix CORS, harden login flow"
