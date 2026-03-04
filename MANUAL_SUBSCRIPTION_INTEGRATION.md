# 📘 Guía de Integración: Sistema Manual de Suscripciones

## Paso 1: Verificar Cambios en la Base de Datos

Los campos ya fueron agregados a `Users` model. Ejecuta una migración para asegurar que existan:

```bash
# Conecta a MongoDB Atlas o local
mongosh  # o tu cliente Mongo

# Verifica el esquema
db.BarbifyUsers.findOne()

# Busca que tenga estos campos en subscription:
# - subscriptionExpiresAt
# - lastManualPaymentDate
# - manualPaymentNotes
```

## Paso 2: Crear Página de Admin para Suscripciones

Crea un archivo en `src/app/(barbify)/admin/subscriptions/page.tsx`:

```typescript
import { PageGuard } from "@/components/PageGuard";
import { SubscriptionGuard } from "@/components/SubscriptionGuard";
import { ManualSubscriptionUpdateForm } from "@/components/ManualSubscriptionUpdateForm";
import { SubscriptionsListTable } from "@/components/SubscriptionsListTable";
import { useState } from "react";

export default function AdminSubscriptionsPage() {
  return (
    <SubscriptionGuard>
      <PageGuard page="admin">
        <div className="p-6 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">📊 Gestión de Suscripciones</h1>
            <p className="text-gray-600">
              Panel para actualizar manualmente fechas de vencimiento y ver estado de suscripciones
            </p>
          </div>

          {/* Tabla de suscripciones */}
          <div>
            <h2 className="text-xl font-bold mb-4">👥 Usuarios y Sus Suscripciones</h2>
            <SubscriptionsListTable onEditUser={handleEditUser} />
          </div>

          {/* Formulario de actualización */}
          <div>
            <h2 className="text-xl font-bold mb-4">✏️ Actualizar Suscripción</h2>
            <ManualSubscriptionUpdateForm onSuccess={handleSuccess} />
          </div>
        </div>
      </PageGuard>
    </SubscriptionGuard>
  );
}
```

## Paso 3: Configurar CRON Job

### Opción A: Linux/Mac con crontab

```bash
# Editar crontab
crontab -e

# Agregar esta línea (ejecuta a las 00:00 UTC)
0 0 * * * cd /ruta/completa/a/barbify && npx tsx src/scripts/validate-subscriptions-cron.ts >> /var/log/barbify-cron.log 2>&1
```

### Opción B: Azure Functions (Recomendado para producción)

Crea un archivo `src/app/api/cron/validate-subscriptions/route.ts`:

```typescript
import { NextResponse } from "next/server";
import validateSubscriptions from "@/scripts/validate-subscriptions-cron";

export async function GET(request: Request) {
  // Validar token de seguridad
  const token = request.headers.get("x-api-key");
  if (token !== process.env.CRON_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await validateSubscriptions();
    return NextResponse.json(
      {
        success: true,
        message: "Validación de suscripciones completada",
        result,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error validando suscripciones" },
      { status: 500 },
    );
  }
}
```

Luego configura en Azure Functions, AWS Lambda o similar para ejecutar:

```
GET https://tuapp.com/api/cron/validate-subscriptions
Headers: x-api-key: tu_clave_secreta
```

### Opción C: Node-cron (En la app)

Instala dependencia:

```bash
pnpm add node-cron
```

Crea `src/lib/cron-jobs.ts`:

```typescript
import cron from "node-cron";
import validateSubscriptions from "@/scripts/validate-subscriptions-cron";

export function initializeCronJobs() {
  // Ejecuta a las 00:00 UTC todos los días
  cron.schedule("0 0 * * *", async () => {
    console.log("🕐 Iniciando validación de suscripciones...");
    try {
      await validateSubscriptions();
      console.log("✅ Validación completada");
    } catch (error) {
      console.error("❌ Error en validación:", error);
    }
  });
}
```

Luego en `src/app/layout.tsx`:

```typescript
"use client";
import { useEffect } from "react";
import { initializeCronJobs } from "@/lib/cron-jobs";

export default function RootLayout({ children }) {
  useEffect(() => {
    if (typeof window === "undefined") {
      initializeCronJobs();
    }
  }, []);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

## Paso 4: Agregar Variable de Entorno

En `.env.local`:

```env
# CRON Security (si usas opción B o C)
CRON_API_KEY=tu_clave_super_secreta_aqui
```

## Paso 5: Integrar Banner de Suscripción

En el layout principal `src/app/(barbify)/layout.tsx`:

```typescript
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import User from "@/models/Users.model";
import { ManualSubscriptionBanner } from "@/components/ManualSubscriptionBanner";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);
  const user = session?.user?.id
    ? await User.findById(session.user.id)
    : null;

  return (
    <div>
      {user && <ManualSubscriptionBanner user={user} />}
      {children}
    </div>
  );
}
```

## Paso 6: Reemplazar Validaciones (Opcional)

Si deseas usar el nuevo sistema en lugar del antiguo:

### En `src/utils/subscriptionCheck.ts` (agregar alternativa):

```typescript
// Mantener funciones antiguas para compatibilidad

// NUEVA función que usa el sistema manual
export function checkSubscriptionStatusNew(user: IUser | null) {
  // Importar desde el nuevo archivo
  return checkManualSubscriptionStatus(user);
}
```

### En `SubscriptionGuard.tsx`:

```typescript
import { checkManualSubscriptionStatus } from "@/utils/subscriptionCheckManual";

// Cambiar validación
const status = checkManualSubscriptionStatus(user);
if (!status.isActive) {
  redirect("/suscripcion/expirada");
}
```

## Paso 7: Testing

### Test Manual:

1. Ir a `/admin/subscriptions`
2. Buscar un usuario
3. Ingresar fecha de vencimiento (mañana para test)
4. Guardar
5. Ejecutar CRON: `npx tsx src/scripts/validate-subscriptions-cron.ts`
6. Verificar que usuario esté marcado como "active" con 1 día

### Test de Expiración:

1. Ingresar fecha de vencimiento (ayer)
2. Ejecutar CRON
3. Verificar que usuario esté "expired"
4. Intentar acceder a la app (debería mostrar mensaje de expiración)

## Checklist de Implementación

- [ ] Campos agregados a modelo User
- [ ] Página de admin de suscripciones creada
- [ ] Componentes importados y renderizados
- [ ] CRON configurado y probado
- [ ] Banner de suscripción integrado
- [ ] Variables de entorno configuradas
- [ ] Tests manuales completados
- [ ] Deploy a producción

## Soporte y Debugging

### Ver logs del formulario:

```typescript
// En ManualSubscriptionUpdateForm.tsx
console.log("Form data:", formData);
console.log("Update response:", result);
```

### Ver logs del CRON:

```bash
# Ejecutar con logs a archivo
npx tsx src/scripts/validate-subscriptions-cron.ts > cron-output.log 2>&1

# Ver logs en tiempo real
tail -f cron-output.log
```

### Verificar suscripción de usuario en BD:

```bash
mongosh
use barbify
db.BarbifyUsers.findOne(
  { userEmail: "usuario@example.com" },
  { subscription: 1 }
)
```

---

**Tiempo estimado de implementación**: 30-60 minutos
**Complejidad**: Media
**Riesgo**: Bajo (Coexiste con sistema anterior)
