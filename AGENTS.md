# AGENTS.md

Durable guidance for working in the FactoryOS (`factoryos`) repository.

## Project overview

React 19 + TypeScript + Vite 7 SPA: a Multi-Tenant "Industrial Operating System" for smart factories. Persian (Farsi) RTL UI, dark theme, Vazirmatn font. Data is largely mock, but several modules now talk to a real backend (Django-style REST API) with try-API → fallback-to-mock behavior.

## Commands

- `npm run dev` — dev server on port 3000 (`vite.config.ts` sets `server.port = 3000`)
- `npm run build` — production build via `vite-plugin-singlefile`: entire app inlined into `dist/index.html`
- `npm run preview` — preview the built single-file bundle
- No test runner, no lint script, no prettier config. `tsc` strictness is enforced at build (`noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`). Keep code clean of unused vars/params.

## Architecture / where things live

- `src/main.tsx` → `src/App.tsx`: root; applies theme + RTL, renders `LoginPage` when unauthenticated, else `Layout` with `CommandPalette` and `ErrorBoundary`.
- `src/components/Layout.tsx`: central module router — `switch (currentModule)` maps module ids to their component. **Adding a module requires edits in 3 places**: a `ModuleDef` in `src/data/modules.ts`, a case in `Layout.tsx`, and a role entry in `ROLE_MODULES` in `src/store/authStore.ts`.
- `src/components/` — `modules/` (self-contained: GenericModule, SettingsModule, CommandCenter, AIModule), `phase1/` (core platform, superadmin, org, workflow, dashboard-builder), `phase2/` (IDP/MES/Alert/Incident/CommandCenter), `phase3/` (WMS/CMMS/QMS/SRM/LIMS), `phase45/` (AllModules — HRM, HSE, DMS, Finance, Report/Form Builder, Marketplace, NoCode, AI Copilot), `ui/` (shared DataTable/FormModal/StatCard).
- `src/store/` — Zustand stores: `authStore.ts` (user, token, role→module access via `canViewModule`, persisted under key `auth-storage`), `appStore.ts` (currentModule/currentPage, theme, notifications, disabledModules).
- `src/data/` — `modules.ts` (module registry), `tenantData.ts`, `phase1Data.ts` … `phase45Data.ts`, `mockData.ts`.
- `src/types/` — `index.ts` (core/org/workflow/dashboard), `phase2.ts` (IDP/MES/alerts), `phase3.ts` (WMS/CMMS/QMS), `tenant.ts`, `modules.d.ts`.
- `src/services/` — `api.ts` (shared axios instance; reads token from authStore, injects `Bearer`; on 401 logs out), `authService.ts`, `userService.ts`, `factoryService.ts`, `factoryMetaService.ts`, `fieldsService.ts`, `telemetryService.ts`, `dataService.ts` (`uid`, `ts`, `rnd`, `timeAgo` helpers).
- `src/engines/` — `AlertEngine.ts`, `EventEngine.ts` (pure-ish processing engines).
- `src/utils/cn.ts` — `cn()` = `clsx` + `tailwind-merge`; use for conditional classes.

## Conventions

- **Path alias**: always import via `@/` → `src/` (also in tsconfig `paths`).
- **UI language**: all user-facing strings and comments are Persian; UI is RTL. Keep new UI text Persian.
- **Styling**: Tailwind utility classes. Theme via CSS variables (`var(--color-border)`, `var(--color-card)`, `var(--color-text)`, `var(--color-text-muted)`, `var(--color-glass)`, `var(--color-surface)`, `var(--color-primary)`). Accent cyan `#00C2FF`. Glassy dark cards (`bg-zinc-900`/`rounded-2xl` style, or `text-primary`/`text-muted` where CSS vars are used). Two coexisting styles exist — newer shared components use CSS vars (`text-primary`, `text-muted`, `bg-card`, `border-default`), older ones use raw zinc classes. Prefer the CSS-var style in new code.
- **Icons**: `lucide-react`, imported per usage (no barrel import of all).
- **Charts**: `recharts` (Area/Line/Bar/Pie) wrapped in `<ResponsiveContainer>`.
- **Shared UI**: use `src/components/ui/DataTable.tsx` (generic `DataTable<T extends { id: number }>` with `onAdd/onEdit/onDelete/onView/onExport` callbacks and `Column<T>` defs), `FormModal.tsx` (dynamic `FormField[]` schema), `StatCard.tsx` + `StatGrid`.
- **Module component naming**: full-feature modules export as `XxxFull` (e.g. `MESModuleFull`, `WMSModuleFull`), legacy simplistic ones as `XxxModule`; Layout imports them by that name.
- **Backend access**: route API calls through `src/services/api.ts` (axios instance) rather than raw `fetch`; services are plain objects with typed methods per endpoint. Backend contract is snake_case JSON (`national_code`, `phone_number`, `remember_me`, ...).
- **Fallback pattern**: API-heavy pages attempt the live call, and on failure fall back to mock data from `src/data/` (see IDPModule, telemetry pages). Mock imports are typically aliased like `devices as mockDevices`.
- **Types**: domain types live in `src/types/`; `any` is used liberally for server payloads in services/modules — stay consistent, don't introduce strict payload interfaces unless asked.
- **State**: React local state + Zustand stores; do not add Redux / new state libs.
- **Time/dates**: app uses Persian (Jalali) display (`react-multi-date-picker`, `jalali-moment`); don't switch to Gregorian for UI.
- **Build constraint**: app ships as a single HTML file — avoid heavy new runtime dependencies and dynamic imports that break inlining.

## Non-goals / cautions

- No test setup exists; don't add one without being asked.
- `.env` holds `VITE_API_URL` — do not commit real credentials; never log passwords/tokens.
- `dist/` and `node_modules/` are gitignored build artifacts.
- Some files contain stray non-Persian strings (e.g. Chinese) — clean them only when touching that code.