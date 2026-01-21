# Configuración de Mercado Pago en Barbify

## 📋 Archivos Creados

### APIs

- `/src/app/api/mp/subscriptions/route.ts` - Crear preferencias de suscripción
- `/src/app/api/mp/webhook/route.ts` - Recibir notificaciones de pagos
- `/src/app/api/mp/v1/route.ts` - Endpoint para pagos únicos

### Componentes

- `/src/components/SubscriptionPlans.tsx` - Tarjetas de planes de suscripción
- `/src/app/(barbify)/subscription/page.tsx` - Página principal de suscripciones
- `/src/app/(barbify)/subscription/success/page.tsx` - Página de pago exitoso
- `/src/app/(barbify)/subscription/failure/page.tsx` - Página de pago fallido
- `/src/app/(barbify)/subscription/pending/page.tsx` - Página de pago pendiente

### Tipos y Modelos

- `/src/types/subscription.types.ts` - Tipos TypeScript para suscripciones
- `/src/models/Users.schema.ts` - Schema actualizado con datos de suscripción

## 🔧 Configuración

### 1. Variables de Entorno

Copia `.env.example` a `.env.local` y completa las variables:

\`\`\`bash

# Mercado Pago

MP_ACCESS_TOKEN=tu_access_token_aqui
MP_PUBLIC_KEY=tu_public_key_aqui
MP_WEBHOOK_SECRET=tu_secret_aqui (opcional)

# URLs de la app

NEXT_PUBLIC_APP_URL=http://localhost:3000 # En producción: https://tu-dominio.com
\`\`\`

### 2. Configurar Webhook en Mercado Pago

1. Ve a tu cuenta de Mercado Pago
2. Accede a **Tus integraciones** → **Configuración** → **Notificaciones**
3. Agrega la URL de tu webhook:
   - Desarrollo: `https://tu-ngrok-url.ngrok.io/api/mp/webhook`
   - Producción: `https://tu-dominio.com/api/mp/webhook`
4. Selecciona los eventos a recibir:
   - ✅ Pagos
   - ✅ Merchant Orders
   - ✅ Suscripciones (Preapprovals)

### 3. Probar en Local con ngrok

Para probar webhooks en desarrollo:

\`\`\`bash

# Instalar ngrok

npm install -g ngrok

# Iniciar tu app

npm run dev

# En otra terminal, exponer tu app

ngrok http 3000

# Usar la URL de ngrok en la configuración del webhook

\`\`\`

## 💳 Planes de Suscripción

### Free (Gratuito)

- 1 barbero
- Hasta 50 clientes
- Gestión básica de citas
- Historial de 30 días

### Standard ($99.99/mes)

- Hasta 5 barberos
- Clientes ilimitados
- Gestión completa de citas
- Historial completo
- Reportes básicos
- Recordatorios por email

### Premium ($199.99/mes)

- Barberos ilimitados
- Clientes ilimitados
- Analytics avanzados
- Reportes personalizados
- Recordatorios por email y SMS
- Soporte prioritario 24/7
- Integración con redes sociales
- Personalización de marca

## 🚀 Uso

### Para el Usuario

1. Navega a `/subscription`
2. Selecciona un plan
3. Haz clic en "Suscribirse"
4. Serás redirigido a Mercado Pago
5. Completa el pago
6. Regresarás a la app con la suscripción activada

### Flujo de Pago

\`\`\`
Usuario → Selecciona Plan → API crea preferencia → Mercado Pago → Usuario paga
↓
Mercado Pago → Webhook → API actualiza BD → Usuario activo
\`\`\`

## 🔄 Webhooks

El sistema maneja tres tipos de notificaciones:

1. **payment** - Notificaciones de pagos individuales
2. **merchant_order** - Órdenes completas
3. **preapproval** - Suscripciones recurrentes

Cuando un pago es aprobado:

- Se actualiza el usuario en la BD
- Se activa la suscripción
- Se establece la fecha de próximo pago

## 📊 Base de Datos

El modelo de Usuario ahora incluye:

\`\`\`typescript
subscription: {
plan: "free" | "standard" | "premium",
status: "active" | "pending" | "cancelled" | "expired" | "paused",
startDate: Date,
endDate?: Date,
mercadoPagoSubscriptionId?: string,
lastPaymentDate?: Date,
nextPaymentDate?: Date,
cancelledAt?: Date
}
\`\`\`

## 🛡️ Seguridad

- ✅ Autenticación requerida para crear suscripciones
- ✅ Validación de planes
- ✅ Verificación de webhooks (implementar secret si es necesario)
- ✅ Manejo de errores

## 📝 Próximos Pasos

1. **Configurar tokens de Mercado Pago** en `.env.local`
2. **Configurar webhook** en el dashboard de MP
3. **Actualizar precios** en `/src/types/subscription.types.ts` si es necesario
4. **Probar flujo completo** en desarrollo
5. **Implementar cancelación de suscripciones** (opcional)
6. **Agregar panel de administración** para ver suscripciones activas

## 🐛 Testing

\`\`\`bash

# Probar creación de preferencia

curl -X POST http://localhost:3000/api/mp/subscriptions \\
-H "Content-Type: application/json" \\
-d '{"plan": "standard"}'

# Verificar webhook

curl http://localhost:3000/api/mp/webhook
\`\`\`

## 📚 Referencias

- [Documentación Mercado Pago](https://www.mercadopago.com.ar/developers/es/docs)
- [Suscripciones en MP](https://www.mercadopago.com.ar/developers/es/docs/subscriptions/introduction)
- [Webhooks MP](https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks)

---

¿Necesitas ayuda? Revisa los logs en la consola o contacta al equipo de desarrollo.
