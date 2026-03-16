# BROKERRA — Frontend

> **Never Lose a Property Lead Again.**
> AI Follow-Up Intelligence CRM for Real Estate Brokers.

A premium SaaS frontend built to Stripe/Linear/Notion quality standards.

---

## Quick Start

```bash
# 1. Clone & install
git clone <repo>
cd brokERRA-frontend
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit NEXT_PUBLIC_API_URL to your backend URL

# 3. Run development server
npm run dev
# → http://localhost:3000  (redirects to /landing)
```

**Demo credentials:** `demo@brokerra.in` / `demo1234`

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000` |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS + custom design tokens |
| UI Components | ShadCN UI (Radix primitives) |
| Animations | Framer Motion 11 |
| Charts | Recharts |
| Drag & Drop | @dnd-kit/core + sortable |
| Forms | react-hook-form + Zod |
| HTTP Client | Axios (JWT interceptor) |
| Toasts | Sonner |
| Icons | Lucide React |
| Fonts | Geist Sans + Geist Mono |

---

## Project Structure

```
brokERRA-frontend/
│
├── app/                          # Next.js 14 App Router
│   ├── landing/                  # Public marketing page
│   ├── login/                    # Sign in
│   ├── register/                 # Create account
│   ├── start-trial/              # Trial conversion page
│   ├── dashboard/                # Main dashboard (protected)
│   ├── leads/                    # Leads list (protected)
│   │   └── [id]/                 # Lead detail (protected)
│   ├── pipeline/                 # Kanban board (protected)
│   ├── analytics/                # Analytics + export (protected)
│   ├── settings/                 # Account settings (protected)
│   ├── globals.css               # Global styles + design tokens
│   └── layout.tsx                # Root layout (Geist fonts, Sonner)
│
├── components/
│   ├── ui/                       # Base design system
│   │   ├── button.tsx            # 8 variants incl. premium/glow
│   │   ├── input.tsx             # Glass style, icon slots, error states
│   │   ├── badge.tsx             # 14 variants (all lead statuses)
│   │   ├── card.tsx              # Glass/hover/glow props
│   │   ├── dialog.tsx            # Blur overlay, animated entrance
│   │   ├── dropdown-menu.tsx     # Destructive item support
│   │   ├── select.tsx, tabs.tsx, avatar.tsx, skeleton.tsx ...
│   │
│   ├── layout/
│   │   ├── sidebar.tsx           # Collapsible (240px ↔ 72px), Framer Motion
│   │   ├── header.tsx            # Title + action slot + notifications
│   │   ├── dashboard-layout.tsx  # AuthGuard + AuthProvider wrapper
│   │   └── mobile-sidebar.tsx    # Slide-in drawer for mobile
│   │
│   ├── shared/
│   │   ├── auth-guard.tsx        # Client-side route protection
│   │   ├── auth-layout.tsx       # Split-panel auth layout
│   │   ├── page-transition.tsx   # Framer Motion page wrapper
│   │   ├── status-badge.tsx      # StatusBadge, TempBadge, SourceBadge
│   │   ├── confirm-dialog.tsx    # Destructive confirmation modal
│   │   ├── empty-state.tsx       # Icon + title + action
│   │   └── loading-spinner.tsx   # PageLoader + LoadingSpinner
│   │
│   ├── landing/                  # 9 marketing sections
│   ├── dashboard/                # Stat cards, 4 charts, AI insights, follow-ups
│   ├── leads/                    # Table, form modal, timeline, AI summary, notes
│   ├── pipeline/                 # Kanban board, card, column (dnd-kit)
│   └── analytics/                # 7 charts, heatmap, leaderboard, export panel
│
├── hooks/
│   ├── use-auth.tsx              # AuthContext + useAuth hook
│   └── use-leads.ts              # Leads state with filters + pagination
│
├── lib/
│   ├── api.ts                    # Axios instance + all API methods
│   └── utils.ts                  # cn() (clsx + tailwind-merge)
│
├── utils/
│   └── index.ts                  # formatCurrency, formatDate, getStatusColor, etc.
│
├── types/
│   └── index.ts                  # All TypeScript types
│
├── styles/
│   └── globals.css               # Mirror of app/globals.css
│
└── public/
    ├── favicon.svg
    └── robots.txt
```

---

## Pages & Routes

| Route | Description | Auth |
|---|---|---|
| `/landing` | Marketing + pricing page | Public |
| `/login` | Sign in form | Public |
| `/register` | Create account | Public |
| `/start-trial` | Free trial conversion | Public |
| `/dashboard` | Stats, charts, follow-ups, insights | Protected |
| `/leads` | Lead table with search/filter/pagination | Protected |
| `/leads/[id]` | Lead detail: timeline, notes, AI summary | Protected |
| `/pipeline` | Drag-and-drop Kanban (7 stages) | Protected |
| `/analytics` | Full analytics dashboard + exports | Protected |
| `/settings` | Profile, notifications, security, API keys | Protected |

---

## API Integration

All API calls go through `lib/api.ts`. The Axios instance:
- Reads `NEXT_PUBLIC_API_URL` as the base URL
- Auto-attaches `Authorization: Bearer <token>` from localStorage
- Redirects to `/login` on any 401 response

```typescript
// Every protected API call is this simple:
const leads = await leadsApi.getLeads({ status: 'hot', page: 1 })
```

### Expected Backend Routes

```
POST   /api/auth/login
POST   /api/auth/register

GET    /api/leads?status=&temperature=&source=&search=&page=&limit=
POST   /api/leads
GET    /api/leads/:id
PUT    /api/leads/:id
DELETE /api/leads/:id
POST   /api/leads/:id/summarize       → { summary: string }

GET    /api/analytics

GET    /api/export/leads-csv          → Blob (text/csv)
GET    /api/export/monthly-report     → Blob (application/pdf)
```

---

## Design System

### Color Palette

```
Navy backgrounds:   #080f20  #0f1a35  #172240  #1e2a4a
Emerald accents:    #10b981  #059669  #34d399
```

### Glass Card

```tsx
<div className="bg-[rgba(15,26,53,0.6)] backdrop-blur-xl border border-white/8 rounded-2xl">
```

### Emerald Glow Button

```tsx
<Button>  // default variant includes shadow-[0_4px_20px_rgba(16,185,129,0.35)]
```

---

## Deployment

### Vercel (recommended)

```bash
vercel --prod
# Set NEXT_PUBLIC_API_URL in Vercel dashboard → Settings → Environment Variables
```

### Docker

```bash
DOCKER_BUILD=true npm run build
docker build -t brokerra-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://api.brokerra.in brokerra-frontend
```

### Self-hosted (PM2)

```bash
npm run build
pm2 start npm --name "brokerra" -- start
```

---

## Key Architectural Patterns

**Auth Guard** — Every `/dashboard`, `/leads`, `/pipeline`, `/analytics`, `/settings` route is wrapped in `DashboardLayout` → `AuthGuard` → `AuthProvider`. Unauthenticated users are redirected to `/login`.

**Graceful Fallbacks** — Every page and component ships with full mock data. If the backend isn't running, the entire UI still renders with realistic data.

**Drag & Drop** — `@dnd-kit/core` with 8px pointer activation distance (prevents accidental drags). Optimistic updates on `dragOver`, API `PUT` on `dragEnd`.

**Animations** — Framer Motion `initial/animate/exit` on all major elements. `useInView` for scroll-triggered landing sections. Staggered entrance delays via `delay` prop on stat cards and charts.

---

## License

Private — BROKERRA proprietary software.
