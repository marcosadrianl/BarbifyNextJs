# 🔗 INTEGRACIÓN COMPLETA: Cómo Todo Se Conecta

## El Flujo Técnico Paso a Paso

### 1️⃣ Admin Ingresa Fecha (UI)

```typescript
// src/components/ManualSubscriptionUpdateForm.tsx
<Input type="date" value={subscriptionExpiresAt} />
<Button onClick={async () => {
  POST /api/admin/subscription/update-manual
  {
    userId: "...",
    subscriptionExpiresAt: "2026-04-04"
  }
}} />
```

### 2️⃣ API Guarda en BD

```typescript
// src/app/api/admin/subscription/update-manual/route.ts
export async function POST(request) {
  const { userId, subscriptionExpiresAt } = await request.json();
  
  await User.findByIdAndUpdate(userId, {
    $set: {
      "subscription.subscriptionExpiresAt": new Date(subscriptionExpiresAt),
      "subscription.status": "active"
    }
  });
}
```

### 3️⃣ Usuario Accede a la App

```typescript
// src/app/layout.tsx
const session = await getServerSession(authOptions);
const user = await User.findById(session.user.id);

// Sistema renderiza SubscriptionGuard
export function SubscriptionGuard({ children }) {
  const response = await fetch("/api/users/subscription-status");
  const { hasAccess } = await response.json();
  
  if (!hasAccess) redirect("/subscription");
  return children;
}
```

### 4️⃣ API Valida Suscripción

```typescript
// src/app/api/users/subscription-status/route.ts
export async function GET() {
  const user = await User.findOne(...);
  
  // 🔑 CLAVE: Usa la nueva función
  const hasAccess = hasAppAccess(user);
  
  return { hasAccess, ... };
}
```

### 5️⃣ Nueva Función de Validación

```typescript
// src/lib/permissions.ts
export function hasAppAccess(user) {
  // 🆕 NUEVA LÓGICA
  if (user.subscription?.subscriptionExpiresAt) {
    const expiresAt = new Date(user.subscription.subscriptionExpiresAt);
    const now = new Date();
    return expiresAt > now; // ← Simple pero poderoso
  }
  
  // Fallback a sistema anterior
  return validateLegacySub(user);
}

// Todas las features dependen de esto:
export function canAccessPage(user, page) {
  if (!hasAppAccess(user)) return false;
  return true; // ← TODO acceso si tiene suscripción activa
}

export function hasFeature(user, feature) {
  if (!hasAppAccess(user)) return false;
  return true; // ← TODO acceso si tiene suscripción activa
}
```

### 6️⃣ Componentes Usan Permisos

```typescript
// src/components/PageGuard.tsx
export function PageGuard({ page, children }) {
  const { hasAppAccess, canAccessPage } = usePermissions();
  
  if (!hasAppAccess) {
    router.push("/subscription");
    return null;
  }
  
  if (!canAccessPage(page)) {
    router.push("/fallback");
    return null;
  }
  
  return children; // ← Panel completo disponible
}
```

### 7️⃣ Banner Muestra Estado

```typescript
// src/components/ManualSubscriptionBanner.tsx
export function ManualSubscriptionBanner({ user }) {
  const status = checkManualSubscriptionStatus(user);
  
  if (status.isExpired) {
    return <Alert>❌ Suscripción expirada</Alert>;
  }
  
  if (status.daysRemaining <= 7) {
    return <Alert>⏰ {status.daysRemaining} días</Alert>;
  }
  
  return <Alert>✅ Activa hasta {date}</Alert>;
}
```

---

## Mapa de Archivos (Lo que se toca)

```
START HERE: Admin crea pago
     ↓
src/app/(barbify)/admin/subscriptions/page.tsx ← Tú creas esto
     ↓
RENDERIZA
     ↓
src/components/ManualSubscriptionUpdateForm.tsx ← Busca usuario + ingresa fecha
     ↓
CLICK GUARDAR
     ↓
src/app/api/admin/subscription/update-manual/route.ts ← POST: guarda en BD
     ↓
Usuario hace login → se valida acceso
     ↓
src/components/SubscriptionGuard.tsx ← Protege rutas
     ↓
FETCH: /api/users/subscription-status
     ↓
src/app/api/users/subscription-status/route.ts ← GET: llama hasAppAccess()
     ↓
src/lib/permissions.ts → hasAppAccess()
     ↓
if (subscriptionExpiresAt > now) → ✅ ACCESO
else → ❌ SIN ACCESO
     ↓
RENDERIZA dashboard o redirige a /subscription
```

---

## Dónde Está Cada Cosa

### Validación Central
```
src/lib/permissions.ts
├── hasAppAccess(user) ← LA LLAVE: valida subscriptionExpiresAt
├── canAccessPage(user, page) ← Usa hasAppAccess
├── hasFeature(user, feature) ← Usa hasAppAccess
└── getFeatureLimit(user, feat) ← Devuelve premium si activo
```

### Guards (Protección de Rutas)
```
src/components/
├── SubscriptionGuard.tsx ← Protege todo (valida general)
├── PageGuard.tsx ← Protege página específica
└── FeatureGate.tsx ← Oculta UI feature
```

### Permisos en Cliente
```
src/hooks/usePermissions.ts
├── usePermissions() ← Hook que usa checkPermissions()
├── usePageAccess(page) ← Shortcut para página
└── useFeatureAccess(feature) ← Shortcut para feature
```

### APIs
```
src/app/api/
├── users/subscription-status/route.ts ← GET: valida acceso
└── admin/subscription/
    ├── update-manual/route.ts ← POST/GET: ingresa fecha
    └── subscriptions/list/route.ts ← GET: lista usuarios
```

### Componentes UI
```
src/components/
├── ManualSubscriptionUpdateForm.tsx ← Formulario admin
├── ManualSubscriptionBanner.tsx ← Banner estado
└── SubscriptionsListTable.tsx ← Tabla usuarios
```

---

## Datos en Flujo

### 1. Admin Ingresa (Cliente)
```json
{
  "userId": "674f3e2c1d2c3f4e5g6h7i8j",
  "subscriptionExpiresAt": "2026-04-04",
  "lastManualPaymentDate": "2026-03-04",
  "manualPaymentNotes": "Transferencia BBVA"
}
```

### 2. Se Guarda en BD (Servidor)
```json
{
  "_id": "674f3e2c1d2c3f4e5g6h7i8j",
  "userEmail": "cliente@example.com",
  "subscription": {
    "subscriptionExpiresAt": "2026-04-04T00:00:00Z",
    "lastManualPaymentDate": "2026-03-04T00:00:00Z",
    "manualPaymentNotes": "Transferencia BBVA",
    "status": "active"
  }
}
```

### 3. Usuario Valida (GET /api/users/subscription-status)
```json
{
  "hasAccess": true,
  "subscriptionExpiresAt": "2026-04-04T00:00:00Z",
  "daysRemaining": 31,
  "userActive": true,
  "plan": "standard"
}
```

### 4. Permisos Devuelven (usePermissions)
```json
{
  "hasAppAccess": true,
  "canAccessPage": {"dashboard": true, "analytics": true, ...},
  "hasFeature": {"exportPDF": true, "reports": true, ...},
  "getFeatureLimit": {"maxBarbers": Infinity, ...}
}
```

---

## Validación en Tiempo Real

### En CADA request:

```typescript
const hasAppAccess = hasAppAccess(user);

if (hasAppAccess) {
  // subscriptionExpiresAt > ahora
  // Usuario SIEMPRE tiene acceso a TODO
  
  // Dashboard ✅
  // Analytics ✅
  // Reports ✅
  // Export ✅
  // Barbers ilimitados ✅
  // TODO TODO TODO ✅
} else {
  // subscriptionExpiresAt <= ahora
  // SIN ACCESO - redirige a /subscription
}
```

---

## Sin CRON ¿Cómo Actualiza?

**Cada vez que el usuario hace algo**:
- Carga página → valida
- Hace request → valida
- Actualiza componente → valida

**Resultado**: Cambios en tiempo real, sin necesidad de CRON.

Si la fecha pasó en la noche:
- Usuario hace login → WHOOPS! Ya no tiene acceso
- Sistema lo redirige automáticamente

---

## ¿Qué Pasa Cuando Vence?

### Ejemplo Real

```
Hoy: 2026-03-04
subscriptionExpiresAt: 2026-04-04
Status: ✅ ACTIVO

---31 días adelante---

Mañana: 2026-04-05
subscriptionExpiresAt: 2026-04-04
Comparación: 2026-04-04 > 2026-04-05? NO
Status: ❌ EXPIRADO

Usuario intenta acceder:
→ /api/users/subscription-status retorna hasAccess: false
→ SubscriptionGuard redirige a /subscription
→ Banner muestra "❌ Suscripción expirada"
→ Admin puede renovar ingresando nueva fecha
```

---

## Caso de Uso: Admin Renueva

```
1. Usuario contacta: "Mi suscripción venció"
2. Admin va a /admin/subscriptions
3. Busca usuario: "cliente@example.com"
4. Actual: subscriptionExpiresAt: 2026-04-04 ❌
5. Ingresa: subscriptionExpiresAt: 2026-05-04 ✅
6. Click "Guardar"
7. Usuario hace F5 en su navegador...
8. LISTO: Acceso restaurado automáticamente
```

---

## Stack Completo

```
┌─────────────────────────────────────────┐
│         Frontend (React/Hooks)          │
├─────────────────────────────────────────┤
│  usePermissions()                       │
│  SubscriptionGuard                      │
│  PageGuard                              │
│  ManualSubscriptionUpdateForm           │
│  ManualSubscriptionBanner               │
└─────────────────┬───────────────────────┘
                  │ API calls
┌─────────────────▼───────────────────────┐
│        API Routes (Next.js)             │
├─────────────────────────────────────────┤
│  POST /api/admin/subscription/update    │
│  GET /api/users/subscription-status     │
│  GET /api/admin/subscriptions/list      │
└─────────────────┬───────────────────────┘
                  │ MongoDB queries
┌─────────────────▼───────────────────────┐
│       Core Logic (permissions.ts)       │
├─────────────────────────────────────────┤
│  hasAppAccess(user)                     │
│  → Valida subscriptionExpiresAt         │
│  → Devuelve true/false                  │
└─────────────────┬───────────────────────┘
                  │ Caché/Controllers
┌─────────────────▼───────────────────────┐
│      MongoDB (Users Collection)         │
├─────────────────────────────────────────┤
│ subscription: {                         │
│   subscriptionExpiresAt: Date           │
│   lastManualPaymentDate: Date           │
│   manualPaymentNotes: string            │
│ }                                       │
└─────────────────────────────────────────┘
```

---

## Quick Reference: ¿Dónde Buscar Qué?

- **"Quiero change lógica de acceso"** → `src/lib/permissions.ts`
- **"Quiero agregar nuevo permiso"** → `src/lib/permissions.ts` + `FeatureGate` componente
- **"Quiero change fecha"** → `ManualSubscriptionUpdateForm`
- **"Quiero ver estado suscripción"** → `ManualSubscriptionBanner`
- **"Quiero listar usuarios"** → `SubscriptionsListTable` o `/api/admin/subscriptions/list`
- **"Quiero validar permisos en código"** → `usePermissions()` (cliente) o `hasAppAccess()` (servidor)

---

**Todo está conectado y funcionando. SIN CRON NECESARIO.** ✅
