# Barbify - AI Coding Assistant Instructions

## Project Overview

**Barbify** is a Next.js 15+ barbershop management SaaS with subscription tiers (Standard/Premium), Mercado Pago payments, MongoDB data persistence, and role-based feature gating. Tech stack: Next.js 15, TypeScript, MongoDB/Mongoose, NextAuth, Zustand, Zod, TailwindCSS, shadcn/ui.

## Architecture Fundamentals

### Data Layer Pattern (Triple Schema)

Every entity uses **three separate files** for type safety and separation of concerns:

- `*.types.ts` - TypeScript interfaces (e.g., `IClient`, `IService`, `IUser`)
- `*.schema.ts` - Zod validation schemas (e.g., `ClientSchemaZod`, `ServiceSchemaZod`)
- `*.model.ts` - Mongoose models with MongoDB schemas

Example: Client entity = [`Clients.types.ts`](src/models/Clients.types.ts) + [`Clients.schema.ts`](src/models/Clients.schema.ts) + [`Clients.model.ts`](src/models/Clients.model.ts)

### Subscription & Access Control System

**Critical**: All new users get a **14-day Standard trial** (no free plan exists). Access control uses:

- **`SubscriptionGuard`** - Wraps pages requiring active subscription/trial
- **`PageGuard`** - Restricts entire pages by plan (e.g., `<PageGuard page="insights">`)
- **`FeatureGate`** - Hides UI features by plan (e.g., `<FeatureGate feature="exportPDF">`)
- **Permissions System**: [`lib/permissions.ts`](src/lib/permissions.ts) defines `PLAN_FEATURES` object mapping plans to pages/features
- **Hook**: `usePermissions()` provides `hasFeature()`, `canAccessPage()`, `hasAppAccess()`

### State Management (Zustand)

Global state lives in [`lib/store/services.store.ts`](src/lib/store/services.store.ts):

- **`useServicesStore()`** - Manages filtered services (past/present only)
- **`useAllServicesStore()`** - Returns ALL services via `allServices` property
- **`useBarbers()`** - Manages barbers state
- Services auto-cache for 30 minutes to reduce API calls

### Authentication (NextAuth)

- Config: [`utils/auth.ts`](src/utils/auth.ts) exports `authOptions`
- Session object structure:
  ```ts
  session.user = {
    id: string;           // User MongoDB _id
    userEmail: string;
    userName: string;
    subscription: { plan, status, trialEndDate, ... }
  }
  ```
- Always check `getServerSession(authOptions)` in API routes before DB operations

### API Routes Pattern

All API routes follow this structure:

```ts
export async function GET/POST(request: Request) {
  await connectDB();  // Always connect first
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Convert session.user.id to ObjectId for Mongoose queries
  const userObjectId = new Types.ObjectId(session.user.id);

  // Filter all data by user: { clientFromUserId: userObjectId }
}
```

## Critical Conventions

### Database Queries

- **Always filter by user**: `{ clientFromUserId: userObjectId }` for clients, services, etc.
- Use `new Types.ObjectId(session.user.id)` to convert string IDs for Mongoose
- Serialize Mongoose documents with custom serializers (e.g., `serializeClient()` in schemas)

### Mercado Pago Integration

- **Subscription Creation**: [`api/mp/subscriptions/route.ts`](src/app/api/mp/subscriptions/route.ts) uses `PreApproval` API
- **Webhook Handler**: [`api/mp/webhook/route.ts`](src/app/api/mp/webhook/route.ts) processes payment notifications
- **Success Flow**: User redirects to `/subscription/success?plan=standard` → updates user record
- Plans stored in [`types/subscription.types.ts`](src/types/subscription.types.ts) with prices in **centavos**

### File Organization

- **Route Groups**: `(barbify)` folder for authenticated dashboard routes
- **UI Components**: shadcn/ui in [`components/ui/`](src/components/ui/), custom in [`components/`](src/components/)
- **Path Alias**: `@/*` maps to `src/*` (configured in [`tsconfig.json`](tsconfig.json))

## Development Workflow

### Commands

```bash
pnpm dev              # Start dev server with Turbopack
pnpm build --turbopack # Production build
pnpm lint             # ESLint check
npx tsx src/scripts/*.ts  # Run migration scripts
```

### Adding New Features

1. Check plan restrictions in [`lib/permissions.ts`](src/lib/permissions.ts) - add to `PLAN_FEATURES` if premium-only
2. Wrap UI in `<FeatureGate feature="newFeature">` or full pages in `<PageGuard page="newPage">`
3. For new entities: create triple schema (types → schema → model)
4. API routes: always use `getServerSession()` + filter by `userObjectId`

### Subscription Changes

- Trial expiry checked in [`utils/subscriptionCheck.ts`](src/utils/subscriptionCheck.ts) - `checkSubscriptionStatus()`
- Trial banner displayed via [`components/TrialBanner.tsx`](src/components/TrialBanner.tsx) in dashboard layout
- Migration scripts in [`scripts/`](src/scripts/) for bulk user updates

## Common Patterns

### Combining Client + Service Data

Use `combineClientService()` from [`lib/store/services.store.ts`](src/lib/store/services.store.ts) to merge client and service objects into `IServiceCombined` type.

### Date Handling

- Use `getCurrentDateInArgentina()` helper for timezone-aware filtering
- Always convert dates to ISO strings in serializers: `doc.createdAt?.toISOString?.() ?? null`

### Form Validation

- Use Zod schemas from `*.schema.ts` files with `react-hook-form` via `@hookform/resolvers/zod`
- Schema structure: `export const ClientSchemaZod = z.object({ ... })`

## Key Files Reference

- **Subscription Plans**: [`types/subscription.types.ts`](src/types/subscription.types.ts)
- **User Model**: [`models/Users.model.ts`](src/models/Users.model.ts) with embedded subscription object
- **Permissions Logic**: [`lib/permissions.ts`](src/lib/permissions.ts)
- **Auth Config**: [`utils/auth.ts`](src/utils/auth.ts)
- **Global State**: [`lib/store/services.store.ts`](src/lib/store/services.store.ts)

## Important Notes

- **No "free" plan** - removed per [`SUBSCRIPTION_CHANGES.md`](SUBSCRIPTION_CHANGES.md). All users start with 14-day Standard trial.
- **Always use ObjectId conversions** when querying MongoDB from API routes
- **Feature gates are NOT enforced server-side** - they're UI-only. Add server validation if security-critical.
- **Mercado Pago setup** documented in [`MERCADOPAGO_SETUP.md`](MERCADOPAGO_SETUP.md) - webhook requires ngrok for local dev.
