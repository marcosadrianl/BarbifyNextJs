# 🆕 NUEVO SISTEMA MANUAL DE SUSCRIPCIÓN

## Resumen de Cambios

Se implementó un sistema **manual y automático** de validación de suscripciones, sustituyendo el sistema automático de Mercado Pago con validación por plan (Standard/Premium).

### Cambios Principales:

1. **Modelo de Datos Extendido**: Agregados campos a `Users` model
2. **Nuevo Sistema de Validación**: Basado solo en `subscriptionExpiresAt`
3. **Un Único Plan**: Todas las features disponibles, restricción solo por fecha
4. **Script CRON**: Valida diariamente el estado de suscripciones
5. **API Manual**: Endpoint para ingreso manual de fechas
6. **UI Components**: Formularios y banners para admin

---

## Estructura de Datos

### Nuevos Campos en `Users` Schema

```typescript
subscription: {
  // ... campos anteriores mantienen compatibilidad ...

  // 🆕 NUEVO SISTEMA MANUAL
  subscriptionExpiresAt?: Date;        // Fecha de vencimiento
  lastManualPaymentDate?: Date;        // Última fecha de pago ingresada
  manualPaymentNotes?: string;         // Notas sobre el pago
}
```

---

## Flujo de Funcionamiento

### 1️⃣ Admin Ingresa Fecha Manualmente

El admin accede al formulario `ManualSubscriptionUpdateForm` e ingresa:

- **Usuario**: Busca por ID
- **Fecha de Vencimiento**: Nueva fecha de acceso
- **Fecha de Pago** (opcional): Registro del pago
- **Notas** (opcional): Detalles del pago

```bash
POST /api/admin/subscription/update-manual
{
  "userId": "674f3e2c1d2c3f4e5g6h7i8j",
  "subscriptionExpiresAt": "2026-04-04T00:00:00Z",
  "lastManualPaymentDate": "2026-03-04T00:00:00Z",
  "manualPaymentNotes": "Pago por transferencia"
}
```

### 2️⃣ Script CRON Valida Diariamente

Se ejecuta (idealmente a las 00:00 UTC):

```bash
npx tsx src/scripts/validate-subscriptions-cron.ts
```

**Acciones**:

- Obtiene todos los usuarios con `subscriptionExpiresAt`
- Compara con la fecha actual
- Marca como "active" si aún tiene vigencia
- Marca como "expired" si pasó la fecha
- Genera reporte detallado

### 3️⃣ Sistema Valida Acceso en Tiempo Real

Cuando un usuario carga la app:

```typescript
import { checkManualSubscriptionStatus } from "@/utils/subscriptionCheckManual";

const status = checkManualSubscriptionStatus(user);
// {
//   isActive: boolean,
//   isExpired: boolean,
//   daysRemaining: number,
//   expiresAt: Date | null,
//   message: string
// }
```

---

## Archivos Creados/Modificados

### ✏️ Modificados:

| Archivo                     | Cambio                                                    |
| --------------------------- | --------------------------------------------------------- |
| `src/models/Users.model.ts` | Agregados 3 campos al schema `subscription`               |
| `src/models/Users.type.ts`  | Agregados 3 propiedades opcionales a `IUser.subscription` |

### 🆕 Creados:

| Archivo                                                 | Propósito                                      |
| ------------------------------------------------------- | ---------------------------------------------- |
| `src/utils/subscriptionCheckManual.ts`                  | Lógica de validación manual                    |
| `src/lib/permissions.manual.ts`                         | Sistema de permisos unificado (todas features) |
| `src/app/api/admin/subscription/update-manual/route.ts` | API para ingreso manual                        |
| `src/scripts/validate-subscriptions-cron.ts`            | Script CRON diario                             |
| `src/components/ManualSubscriptionUpdateForm.tsx`       | Formulario UI para admin                       |
| `src/components/ManualSubscriptionBanner.tsx`           | Banner de estado de suscripción                |

---

## Cómo Usar

### Para Admin (Actualizar Suscripción)

1. Importar componente en página de admin:

   ```typescript
   import { ManualSubscriptionUpdateForm } from "@/components/ManualSubscriptionUpdateForm";
   ```

2. Renderizar en el layout:

   ```tsx
   <ManualSubscriptionUpdateForm userId={userId} onSuccess={handleRefresh} />
   ```

3. El formulario permite:
   - Buscar usuario por ID
   - Ver fecha actual de vencimiento
   - Ingresa nueva fecha
   - Guardar cambios

### Para Validar Suscripciones (Ejecutar CRON)

**Opción 1: Ejecución Manual**

```bash
npx tsx src/scripts/validate-subscriptions-cron.ts
```

**Opción 2: CRON Job (Linux/Mac)**

```bash
# Editar crontab
crontab -e

# Agregar línea para ejecutar a las 00:00 UTC
0 0 * * * cd /ruta/a/proyecto && npx tsx src/scripts/validate-subscriptions-cron.ts
```

**Opción 3: Windows Task Scheduler**

1. Crear nueva tarea
2. Trigger: Diario a 00:00
3. Action: Ejecutar `npm run cron:subscriptions`
4. Agregar script en `package.json`:

```json
{
  "scripts": {
    "cron:subscriptions": "tsx src/scripts/validate-subscriptions-cron.ts"
  }
}
```

### Para Validar Acceso (En la App)

```typescript
import { checkManualSubscriptionStatus } from "@/utils/subscriptionCheckManual";
import { ManualSubscriptionBanner } from "@/components/ManualSubscriptionBanner";

export function MyPage({ user }) {
  const status = checkManualSubscriptionStatus(user);

  if (!status.isActive) {
    return <div>Suscripción expirada</div>;
  }

  return (
    <>
      <ManualSubscriptionBanner user={user} />
      {/* contenido */}
    </>
  );
}
```

---

## Cambio en Sistema de Permisos

### Sistema Antiguo (Standard/Premium)

```typescript
import { PLAN_FEATURES } from "@/lib/permissions";

const features = PLAN_FEATURES[user.subscription.plan]; // "standard" o "premium"
```

### Sistema Nuevo (Único Plan)

```typescript
import { MANUAL_PLAN_FEATURES } from "@/lib/permissions.manual";

// TODOS tienen acceso a TODO
const features = MANUAL_PLAN_FEATURES; // Todas las features
```

**Acceso restringido SOLO por**: `subscriptionExpiresAt`

---

## API Endpoints

### POST `/api/admin/subscription/update-manual`

Requiere: Admin user

**Request**:

```json
{
  "userId": "string",
  "subscriptionExpiresAt": "ISO Date string",
  "lastManualPaymentDate": "ISO Date string (opcional)",
  "manualPaymentNotes": "string (opcional)"
}
```

**Response (éxito)**:

```json
{
  "message": "Suscripción actualizada correctamente",
  "user": {
    "id": "...",
    "email": "...",
    "subscription": { ... }
  }
}
```

### GET `/api/admin/subscription/update-manual?userId=...`

Requiere: Admin user

**Response**:

```json
{
  "id": "...",
  "email": "...",
  "name": "...",
  "subscription": { ... }
}
```

---

## Coexistencia con Sistema Antiguo

✅ **El código anterior se mantiene intacto**. Puedes usar ambos sistemas:

- **Sistema Automático (Mercado Pago)**: Campos en `subscription` se mantienen
- **Sistema Manual**: Nuevos campos en `subscription` se usan en paralelo

Para migrar completamente:

1. Mantener nuevo sistema en paralelo durante pruebas
2. Cuando esté verificado, reemplazar validaciones
3. El CRON se ejecuta diariamente de forma independiente

---

## Ejemplo Completo: Ingreso Manual de Pago

```typescript
// 1. Admin ingresa datos en el formulario
{
  "userId": "674f3e2c1d2c3f4e5g6h7i8j",
  "subscriptionExpiresAt": "2026-04-04", // +1 mes
  "lastManualPaymentDate": "2026-03-04", // Hoy
  "manualPaymentNotes": "Transfer BBVA ref: 12345"
}

// 2. Se guarda en BD
User.subscription = {
  ...
  subscriptionExpiresAt: 2026-04-04,
  lastManualPaymentDate: 2026-03-04,
  manualPaymentNotes: "Transfer BBVA ref: 12345",
  status: "active"
}

// 3. CRON valida diariamente
// Usuario activo hasta 2026-04-04 00:00:00

// 4. Cuando llega la fecha
// CRON cambia status a "expired"
// checkManualSubscriptionStatus() retorna isActive: false

// 5. Usuario pierde acceso automáticamente
```

---

## Configuración para Producción

### Variables de Entorno Necesarias

```env
# Existentes
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=...

# El nuevo sistema NO necesita variables adicionales
# Usa la misma conexión a MongoDB
```

### Recomendaciones

1. **Ejecutar CRON a una hora específica** (no en horas pico)
2. **Tener un dashboard admin** para ver:
   - Usuarios próximos a vencer
   - Historial de pagos
   - Cuándo se ejecutó último CRON
3. **Backup diario** de la BD antes de ejecutar CRON
4. **Logging detallado** del script CRON

---

## Preguntas Frecuentes

### ¿Qué pasa si un usuario intenta acceder después de expirar?

El CRON marca como "expired", pero el sistema valida en tiempo real con `checkManualSubscriptionStatus()`. Si la fecha pasó, no hay acceso.

### ¿Se puede crear una suscripción de prueba?

Sí, ingresa una fecha de prueba (ej: 1 mes adelante) en el formulario.

### ¿Se pueden ver cambios en tiempo real?

Sí, el `checkManualSubscriptionStatus()` valida en cada request. Los banners se actualizan automáticamente.

### ¿Cómo recupero un usuario que expiró?

El admin vuelve a ingresar una fecha en el formulario. Se actualiza el BD y el acceso se restituye inmediatamente.

---

## Logging y Debugging

### Ver logs del CRON en tiempo real:

```bash
npx tsx src/scripts/validate-subscriptions-cron.ts 2>&1 | tee cron-logs.txt
```

### Verificar estado de un usuario específico:

```bash
# En la shell de Node.js con MongoDB conectada
const user = await User.findOne({ userEmail: "usuario@example.com" });
console.log(user.subscription);
```

---

**Última actualización**: Marzo 4, 2026
**Sistema versión**: 1.0 (Manual + CRON)
