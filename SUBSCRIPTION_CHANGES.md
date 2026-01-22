# Cambios al Sistema de Suscripciones

## Resumen de Cambios

Se ha eliminado el plan **"free"** y ahora todos los nuevos usuarios obtienen un **período de prueba gratuito de 14 días** del plan **Standard**.

## Cambios Principales

### 1. **Tipos de Suscripción Actualizados**

- ✅ Eliminado plan "free"
- ✅ Planes disponibles: "standard" y "premium"
- ✅ Agregado estado "trial" para períodos de prueba
- ✅ Agregado campo `trialEndDate` para rastrear la fecha de vencimiento

### 2. **Nuevos Usuarios**

- Todos los usuarios nuevos se registran con:
  - Plan: **standard**
  - Status: **trial**
  - `userActive`: **true**
  - `trialEndDate`: **14 días desde el registro**

### 3. **Verificación de Suscripción**

- Nueva utilidad: `src/utils/subscriptionCheck.ts`
  - `checkSubscriptionStatus()`: Verifica el estado de la suscripción
  - `hasApplicationAccess()`: Determina si el usuario tiene acceso
- Nueva API: `/api/users/subscription-status`
  - Verifica el estado de la suscripción en tiempo real
  - Desactiva automáticamente usuarios con trial expirado

### 4. **Banner de Trial**

- Nuevo componente: `TrialBanner`
- Muestra información sobre:
  - Días restantes del período de prueba
  - Advertencias cuando quedan 3 días o menos
  - Mensajes de expiración
- Integrado en el layout del dashboard

### 5. **SubscriptionGuard Mejorado**

- Ahora verifica tanto `userActive` como el estado del trial
- Redirige a `/subscription` si:
  - El usuario no está activo
  - El período de prueba ha expirado

### 6. **Interfaz de Planes**

- Actualizado `SubscriptionPlans` para mostrar solo Standard y Premium
- Grid de 2 columnas en lugar de 3
- Eliminada lógica del plan gratuito

## Archivos Modificados

### Modelos y Tipos

- ✅ `src/models/Users.model.ts`
- ✅ `src/models/Users.schema.ts`
- ✅ `src/models/Users.type.ts`
- ✅ `src/types/subscription.types.ts`

### Componentes

- ✅ `src/components/SubscriptionPlans.tsx`
- ✅ `src/components/SubscriptionGuard.tsx`
- ✅ `src/components/TrialBanner.tsx` (nuevo)

### APIs

- ✅ `src/app/api/auth/signup/route.ts`
- ✅ `src/app/api/mp/subscriptions/route.ts`
- ✅ `src/app/api/users/subscription-status/route.ts` (nuevo)
- ❌ `src/app/api/mp/activate-free/route.ts` (eliminado)

### Páginas

- ✅ `src/app/(barbify)/subscription/page.tsx`
- ✅ `src/app/(barbify)/dashboard/layout.tsx`

### Utilidades

- ✅ `src/utils/subscriptionCheck.ts` (nuevo)

### Scripts

- ✅ `src/scripts/migrate-free-users.ts` (nuevo)

## Migración de Usuarios Existentes

Para usuarios existentes con plan "free", se ha creado un script de migración:

```bash
# Ejecutar el script de migración
npx tsx src/scripts/migrate-free-users.ts
```

Este script:

1. Encuentra todos los usuarios con plan "free"
2. Los actualiza a plan "standard" con status "trial"
3. Establece `trialEndDate` a 14 días desde la ejecución
4. Activa el usuario (`userActive: true`)

⚠️ **IMPORTANTE**: Este script debe ejecutarse UNA SOLA VEZ después del deployment.

## Flujo de Usuario

### Usuario Nuevo

1. Se registra en la aplicación
2. Obtiene automáticamente:
   - Plan Standard (trial)
   - 14 días de acceso gratuito
   - Cuenta activa
3. Ve un banner informativo sobre su trial
4. Al día 11 del trial, comienza a ver advertencias
5. Si el trial expira:
   - Se desactiva la cuenta
   - Se redirige a la página de suscripción
   - Debe elegir un plan de pago

### Usuario con Suscripción Pagada

1. No ve el banner de trial
2. Tiene acceso completo sin restricciones
3. Su suscripción se maneja mediante Mercado Pago

## Consideraciones Importantes

### Seguridad

- La verificación del trial se hace en el servidor
- El `SubscriptionGuard` verifica el estado en cada carga
- La API `/subscription-status` actualiza automáticamente usuarios expirados

### Rendimiento

- El estado se verifica cada 5 minutos en el cliente
- Se usa caché de sesión cuando es posible
- Consultas a la base de datos optimizadas con `.lean()`

### UX

- Mensajes claros sobre el estado del trial
- Colores distintivos:
  - 🔵 Azul: Trial activo con más de 3 días
  - 🟡 Amarillo: Trial por expirar (≤3 días)
  - 🔴 Rojo: Trial expirado

## Testing

Después de implementar estos cambios, verifica:

1. ✅ Registro de nuevos usuarios crea trial de 14 días
2. ✅ Banner se muestra correctamente según días restantes
3. ✅ Usuario con trial expirado es redirigido a /subscription
4. ✅ Usuarios con suscripción pagada no ven el banner
5. ✅ API de Mercado Pago funciona sin plan "free"
6. ✅ SubscriptionGuard bloquea acceso cuando es necesario

## Próximos Pasos

1. Ejecutar el script de migración en producción
2. Monitorear logs para verificar que todo funciona
3. Considerar agregar:
   - Emails de recordatorio cuando faltan 3, 2, 1 día
   - Dashboard de análisis de conversiones trial → paid
   - Opción de extender trial en casos especiales
