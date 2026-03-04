# 📘 Guía Rápida de Integración (SIN CRON)

## ⚡ 3 Pasos para Hacerlo Funcionar

### Paso 1: Crear Página de Admin (5 min)

```typescript
// src/app/(barbify)/admin/subscriptions/page.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { ManualSubscriptionUpdateForm } from "@/components/ManualSubscriptionUpdateForm";
import { SubscriptionsListTable } from "@/components/SubscriptionsListTable";

export default async function AdminSubscriptionsPage() {
  const session = await getServerSession(authOptions);

  // Validar que es admin
  if (session?.user?.userLevel !== 2) {
    return <div>Acceso denegado</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">📊 Gestión de Suscripciones</h1>
        <p className="text-gray-600">
          Ingresa fechas de vencimiento manualmente. El sistema valida automáticamente.
        </p>
      </div>

      {/* Tabla de suscripciones */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">👥 Usuarios Activos</h2>
        <SubscriptionsListTable />
      </div>

      {/* Formulario */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">✏️ Actualizar Suscripción</h2>
        <ManualSubscriptionUpdateForm />
      </div>
    </div>
  );
}
```

### Paso 2: Integrar Banner en Layout (3 min)

```typescript
// src/app/(barbify)/layout.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/Users.model";
import { ManualSubscriptionBanner } from "@/components/ManualSubscriptionBanner";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

  let user = null;
  if (session?.user?.id) {
    await connectDB();
    user = await User.findById(session.user.id);
  }

  return (
    <div>
      {user && <ManualSubscriptionBanner user={user.toObject()} />}
      {children}
    </div>
  );
}
```

### Paso 3: Verificar que Permisos se Validan (2 min)

Ya está integrado. Los guards usan `hasAppAccess()` que valida `subscriptionExpiresAt`.

```typescript
// Ya funciona:
// - SubscriptionGuard → valida acceso general
// - PageGuard → valida acceso a página
// - usePermissions() → valida features
// - API routes → validan en servidor
```

---

## 🎯 Flujo de Uso

### Admin Ingresa Pago

1. Ir a `/admin/subscriptions`
2. Buscar usuario por ID o email
3. Ingresar fecha de vencimiento (ej: +30 días)
4. Click "Guardar"
5. ✅ Listo - usuario tiene acceso inmediato

### Usuario Accede

1. Usuario hace login
2. Sistema valida `subscriptionExpiresAt > ahora`
3. Si ✅ → Acceso a TODO
4. Si ❌ → Redirige a `/subscription`

### Cuando Vence

1. Fecha llega a `subscriptionExpiresAt`
2. Sistema valida en próximo request
3. `subscriptionExpiresAt <= ahora` → Sin acceso
4. Usuario redirigido automáticamente
5. Admin ingresa nueva fecha para renovar

---

## 📋 Checklist Rápido

- [ ] Crear página `/admin/subscriptions`
- [ ] Agregar banner al layout
- [ ] Probar ingreso de fecha
- [ ] Probar que usuario tiene acceso
- [ ] Probar que usuario pierde acceso (fecha pasada)
- [ ] Deploy ✅

---

## 🧪 Testing Rápido

### Test 1: Acceso Activo

```bash
# Ingresa fecha de vencimiento: mañana
# Usuario debe tener acceso a todo
# Banner debe mostrar "1 día restante"
```

### Test 2: Expirado

```bash
# Ingresa fecha de vencimiento: ayer
# User debe verse redirigido a /subscription
# Banner debe mostrar "Suscripción expirada"
```

### Test 3: Próximo a Vencer

```bash
# Ingresa fecha de vencimiento: 5 días adelante
# Banner debe mostrar alerta amarilla "⏰ Próximo a vencer"
```

---

## 🔧 Troubleshooting

### Usuario no ve cambios después de guardar

- Limpiar cache del navegador (Ctrl+F5)
- Refrescar página manualmente
- Verificar que `userActive: true` en BD

### "Solo administradores pueden..."

- Verificar que `userLevel: 2` en BD
- User object debe tener permiso admin

### Fecha no se guarda

- Verificar formato: debe ser ISO string o parseable string
- Ver logs de servidor en la consola

---

## 🚀 Ready!

Ya está todo integrado. Solo falta crear la página de admin y listo.

**Tiempo total**: ~10 minutos
**Complejidad**: Muy baja
**Riesgo**: Ninguno (compatibilidad total)
