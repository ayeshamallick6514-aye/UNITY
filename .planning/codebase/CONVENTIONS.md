# UNITY Codebase Conventions & Architecture Standards

## 1. Naming Conventions

### File & Directory Naming
| Category | Convention | Examples |
|----------|------------|---------|
| React Components & Views | `PascalCase.jsx` | `Button.jsx`, `Dashboard.jsx`, `RoleSelectionPage.jsx` |
| Custom Hooks | `camelCase.js` with `use` prefix | `useAuth.js`, `useCRI.js`, `useDashboard.js` |
| Global State Stores | `camelCase.js` with `Store` suffix | `authStore.js` (exports `useAuthStore`) |
| Service Modules | `camelCase.js` | `api.js`, `authService.js`, `axiosInstance.js` |
| Utility/Config Files | `camelCase.js` | `constants.js`, `roleConfig.js` |
| Backend Controllers | `camelCase.js` with `Controller` suffix | `authController.js`, `mainController.js` |
| Backend Routes | `camelCase.js` | `api.js`, `auth.js`, `sentinel.js` |
| Mongoose Models | `PascalCase.js` | `User.js`, `Project.js`, `Dependency.js` |

### Component Naming
- Functional components exported as `PascalCase` named functions or `React.forwardRef` primitives
- Compound subcomponents attached to parent: `Card.Header`, `Card.Title`, `Card.Body`, `Card.Footer`
- Hooks return structured named objects: `{ decisions, matrix, loading, executeAction, isExecuting }`
- Zustand store actions use camelCase verbs: `login()`, `logout()`, `setToken()`, `extendSession()`

---

## 2. Code Style Patterns

### Structural Comments (Visual Sectioning)
Files use explicit decorative banner comments to separate domains:
```javascript
// ─── Static Data ──────────────────────────────────────────────────────────────
// ─── CRI Gauge ────────────────────────────────────────────────────────────────
// ─── Request Interceptor — inject JWT ────────────────────────────────────────
```

### Dictionary/Lookup Maps Over Conditional Cascades
Status styles, role mappings, and variant classes use static lookup objects:
```javascript
const STATUS_BORDER = {
  critical: 'border-l-[3px] border-l-red-500',
  high:     'border-l-[3px] border-l-amber-500',
  medium:   'border-l-[3px] border-l-blue-500',
  low:      'border-l-[3px] border-l-emerald-500',
};
```

### Dynamic Class Assembly
```javascript
const classes = [buttonVariants.base, buttonVariants.variant[variant], className]
  .filter(Boolean).join(' ');
```

---

## 3. UI Component Architecture (`components/ui/`)

### `Card.jsx`
- `status` prop applies semantic 3px left border (`border-l-[3px]`)
- `hoverable` prop adds subtle border and shadow for clickable cards
- Compound: `Card.Header`, `Card.Title`, `Card.Body`, `Card.Footer`

### `Button.jsx`
- Variants: `primary` (Gov blue `#1E3A8A`), `secondary`, `ghost`, `danger`, `link`
- Sizes: `sm` (h-7), `md` (h-9), `lg` (h-10)
- Built-in SVG loading spinner when `loading={true}`
- `forwardRef` integrated

### `Badge.jsx`
- Variants: `critical`, `high`, `medium`, `low`, `approved`, `pending`, `blocked`, `on_track`, `info`
- `dot={true}` renders inline colored indicator dot

### `KPIBlock.jsx`
- Large 3xl bold metric, optional monospace (`IBM Plex Mono`), uppercase caption
- Color tokens: `blue`, `emerald`, `amber`, `red`, `gray`
- Optional trend indicator (`↑` / `↓`)

---

## 4. Tailwind CSS Patterns

### Design Tokens (`index.css` — `@theme` directive)
- `--color-gov-900`: `#102A43` (Deep Navy)
- `--color-gov-800`: `#243E56` (Command Dark Slate)
- **Body font**: `'IBM Plex Sans', 'Inter', system-ui, sans-serif`
- **Mono font**: `'IBM Plex Mono', 'Courier New', monospace` (metrics, IDs, timestamps)
- **Base font**: 14px (down from 16px for higher admin density)

### Color Coding Convention
- **Critical/Blocked**: Red (`red-500/600`, `bg-red-50`, `border-red-200`)
- **High Risk**: Amber (`amber-500/600`, `bg-amber-50`)
- **Medium**: Blue (`blue-500/600`, `bg-blue-50`)
- **Normal/Approved**: Emerald (`emerald-500/600`, `bg-emerald-50`)
- **Neutral**: Slate (`slate-50` backgrounds, `slate-800` text, `slate-100` borders)

### Info Density
- Micro-typography: `text-[9px]`, `text-[10px]`, `font-black`, `uppercase`, `tracking-widest`
- Custom ultra-thin scrollbars (`6px`, slate thumbs `#CBD5E1`)

---

## 5. API Call Architecture

```
[React Component / Page]
        │
        ▼
[Custom Hook Layer (TanStack Query)]  ← Caching, lifecycle, invalidation
        │
        ▼
[Service Layer (axiosInstance)]       ← Base URL, headers, JWT, error interceptor
        │
        ▼
[Backend REST API (Express)]
```

### Query Key Convention
- `['dashboard']`, `['brief-summary']`, `['decisions']`, `['cri', projectId]`

### Cache Invalidation on Mutation
```javascript
const actionMutation = useMutation({
  mutationFn: (payload) => api.executeDecisionAction(payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['decisions'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['matrix'] });
    queryClient.invalidateQueries({ queryKey: ['events'] });
    queryClient.invalidateQueries({ queryKey: ['cost-exposure'] });
  }
});
```

---

## 6. Error Handling Patterns

### `axiosInstance.js`
- **Success**: Unwraps `response.data` automatically (no `.data` drilling in services)
- **Error**: Rejects `{ status, message }` normalized object
- **401**: Clears `sessionStorage` → redirects to `/select-role` (except on login routes)

### `useAuth.js`
- Validates `typeof user?.role === 'string'` before trusting response
- Detects legacy OTP payloads (`data?.requiresOtp === true`) and surfaces clear error
- `clearError()` resets errors on input change
- `try/catch/finally` guarantees `loading` resets to `false`

### Backend Global Handler
```javascript
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});
```

### `ErrorBoundary.jsx`
- Class component wrapping `<BrowserRouter>` in `App.jsx`
- Catches uncaught render crashes, shows "Reload Interface" fallback card
