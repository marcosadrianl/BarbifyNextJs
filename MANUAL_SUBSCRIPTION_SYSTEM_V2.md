# 🆕 NUEVO SISTEMA MANUAL DE SUSCRIPCIÓN (SIN CRON)

## Resumen

Sistema **manual y simple** de validación de suscripciones basado ÚNICAMENTE en `subscriptionExpiresAt`.

**Lo que cambió**:

- ✅ Un único plan con TODAS las features
- ✅ Restricción por fecha de vencimiento
- ✅ Admin ingresa fechas manualmente
- ✅ SIN CRON - validación en tiempo real
- ✅ Mantiene compatibilidad con sistema anterior

---

## Estructura de Datos

### Nuevos Campos en `Users` Schema

```typescript
subscription: {
  // Campos legacy se mantienen...

  // 🆕 NUEVO SISTEMA
  subscriptionExpiresAt?: Date;        // Fecha de vencimiento
  lastManualPaymentDate?: Date;        // Última fecha de pago
  manualPaymentNotes?: string;         // Notas sobre el pago
}
```

---

## Flujo: Cómo Funciona

### 1️⃣ Admin Ingresa Fecha

```bash
POST /api/admin/subscription/update-manual
{
  "userId": "...",
  "subscriptionExpiresAt": "2026-04-04",
  "lastManualPaymentDate": "2026-03-04",
  "manualPaymentNotes": "Pago por transferencia"
}
```

### 2️⃣ Se Guarda en BD

```typescript
subscription: {
  subscriptionExpiresAt: 2026-04-04,
  lastManualPaymentDate: 2026-03-04,
  manualPaymentNotes: "Pago por transferencia",
  status: "active"
}
```

### 3️⃣ Sistema Valida Automáticamente

```typescript
// En CADA REQUEST - sin necesidad de CRON
const hasAppAccess = hasAppAccess(user);

// Lógica:
if (subscriptionExpiresAt > ahora) return true; // ✅ ACCESO COMPLETO
if (subscriptionExpiresAt <= ahora) return false; // ❌ SIN ACCESO
```

### 4️⃣ Usuario Obtiene Acceso

- Todas las features disponibles
- Dashboard, analytics, reportes, etc.
- Banners muestran días restantes

---

## APIs Disponibles

### POST `/api/admin/subscription/update-manual` (Admin only)

```json
{
  "userId": "string",
  "subscriptionExpiresAt": "ISO Date",
  "lastManualPaymentDate": "ISO Date (opcional)",
  "manualPaymentNotes": "string (opcional)"
}
```

### GET `/api/admin/subscription/update-manual?userId=...` (Admin only)

Obtener info de suscripción de un usuario

### GET `/api/admin/subscriptions/list` (Admin only)

Listar suscripciones con paginación. Parámetros:

- `status` - "all", "active", "expired"
- `sortBy` - "nextExpiry", "name", "email"
- `page` - número de página
- `limit` - items por página

---

## Cómo Usar

### 1. Crear página de admin

```typescript
// src/app/(barbify)/admin/subscriptions/page.tsx
import { SubscriptionsListTable } from "@/components/SubscriptionsListTable";
import { ManualSubscriptionUpdateForm } from "@/components/ManualSubscriptionUpdateForm";

export default function AdminSubscriptionsPage() {
  return (
    <div className="p-6 space-y-8">
      <h1>📊 Gestión de Suscripciones</h1>
      <SubscriptionsListTable />
      <ManualSubscriptionUpdateForm />
    </div>
  );
}
```

### 2. Integrar banner en layout

```tsx
// src/app/(barbify)/layout.tsx
import { ManualSubscriptionBanner } from "@/components/ManualSubscriptionBanner";

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();

  return (
    <div>
      {user && <ManualSubscriptionBanner user={user} />}
      {children}
    </div>
  );
}
```

### 3. Usar en componentes

```typescript
import { usePermissions } from "@/hooks/usePermissions";

export function MyComponent() {
  const perms = usePermissions();

  if (!perms.hasAppAccess) {
    return <p>Suscripción expirada</p>;
  }

  return (
    <>
      {perms.hasFeature("analytics") && <Analytics />}
      {perms.canAccessPage("insights") && <Insights />}
    </>
  );
}
```

---

## Sistema de Permisos

La validación ahora es **simple**:

```typescript
// src/lib/permissions.ts

export function hasAppAccess(user: IUser | null): boolean {
  if (!user) return false;
  if (!user.userActive) return false;

  // 🆕 NUEVA LÓGICA
  if (user.subscription?.subscriptionExpiresAt) {
    const expiresAt = new Date(user.subscription.subscriptionExpiresAt);
    const now = new Date();
    return expiresAt > now; // ✅ Simple: fecha > ahora = acceso
  }

  // Fallback a sistema anterior (compatibilidad)
  return validateLegacySubscription(user);
}

export function canAccessPage(user, page) {
  if (!hasAppAccess(user)) return false;
  return true; // ✅ TODAS las páginas si tiene acceso
}

export function hasFeature(user, feature) {
  if (!hasAppAccess(user)) return false;
  return true; // ✅ TODAS las features si tiene acceso
}
```

---

## Cambios en Archivos

### Modificados:

- `src/lib/permissions.ts` - Nueva lógica de validación
- `src/models/Users.model.ts` - Nuevos campos
- `src/models/Users.type.ts` - Tipos actualizados
- `src/components/SubscriptionGuard.tsx` - Comentarios actualizados
- `src/app/api/users/subscription-status/route.ts` - Integra nueva validación

### Creados:

- `src/utils/subscriptionCheckManual.ts` - Helpers de validación
- `src/lib/permissions.manual.ts` - Sistema unificado de permisos
- `src/app/api/admin/subscription/update-manual/route.ts` - API POST/GET
- `src/app/api/admin/subscriptions/list/route.ts` - API de listado
- `src/components/ManualSubscriptionUpdateForm.tsx` - Formulario para admin
- `src/components/ManualSubscriptionBanner.tsx` - Banner de estado
- `src/components/SubscriptionsListTable.tsx` - Tabla de suscripciones

---

## Ejemplo Completo

```typescript
// Admin ingresa fecha en el formulario
const updateSubscription = async (userId, newDate) => {
  const response = await fetch("/api/admin/subscription/update-manual", {
    method: "POST",
    body: JSON.stringify({
      userId,
      subscriptionExpiresAt: newDate, // "2026-04-04"
      lastManualPaymentDate: new Date(),
      manualPaymentNotes: "Pago recibido",
    }),
  });
};

// El usuario carga la app
// Sistema valida automáticamente:
// subscriptionExpiresAt (2026-04-04) > ahora (2026-03-04) → ✅ ACCESO

// El usuario ve:
// - Dashboard completo
// - Todas las páginas disponibles
// - Todas las features habilitadas
// - Banner mostrando "31 días restantes"

// Cuando llega 2026-04-04 00:00:00:
// subscriptionExpiresAt (2026-04-04) > ahora (2026-04-04) → ❌ SIN ACCESO
// Sistema redirige a /subscription con mensaje de expiración
```

---

## FAQ

### ¿Necesito ejecutar CRON?

**No**. Validación es en tiempo real. Sin necesidad de CRON.

### ¿Qué pasa si un usuario intenta acceder después de expirar?

Sistema valida `subscriptionExpiresAt < now` → Sin acceso. Se redirige automáticamente.

### ¿Se pueden ver cambios en tiempo real?

Sí. Validación en cada request. Banners se actualizan automáticamente.

### ¿Cómo recupero un usuario que expiró?

Admin ingresa una nueva fecha en el formulario. Acceso se restituye inmediatamente.

### ¿Y si no tiene `subscriptionExpiresAt`?

Sistema usa validación antigua (compatibilidad). No hay BREAKING CHANGES.

---

## Próximo Paso: Cuando Tengas 50-100 Clientes

Si en el futuro quieres automatizar:

1. Agregar CRON job
2. Enviar emails de recordatorio
3. Validación automática de pagos

Por ahora: **KISS** (Keep It Simple, Stupid) 🎯

---

**Última actualización**: Marzo 4, 2026  
**Sistema**: Manual (Sin CRON)
