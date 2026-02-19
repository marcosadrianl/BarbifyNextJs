# Mejoras de Seguridad NextAuth - Barbify

## ❓ ¿Puedes implementar estas mejoras sin infraestructura adicional?

**SÍ**, puedes implementar todas estas mejoras **HOY MISMO** sin necesidad de:

- Nuevos servicios externos
- Componentes adicionales de servidor
- Cambios en la base de datos
- Hardware adicional

## 🔒 Estado Actual de Seguridad

### ✅ Lo que YA funciona bien:

1. **Encriptación JWE (JWT Encryption)** - Tus tokens están encriptados por defecto
2. **Cookie Chunking** - Si tu token supera 4kb, NextAuth lo divide automáticamente
3. **NEXTAUTH_SECRET configurado** - Ya tienes un secret (aunque mejorable)
4. **Estrategia JWT** - Tokens sin base de datos (más rápido)

### ⚠️ Lo que puedes mejorar:

1. **Secret más fuerte** - Tu actual: `KPeTu4JEYsWeVrR7sfgA1bSIuOLmcYR5` (32 chars)
   - Recomendado: 64+ caracteres con alta entropía
2. **Algoritmo explícito** - Actualmente usa el default `dir` + `A256GCM`
   - Puedes especificar algoritmos más fuertes de RFC 7518

3. **Configuración JWT explícita** - No tienes configurada la sección `jwt:`

4. **Cookies seguras** - Faltan flags de seguridad adicionales

## 🚀 Mejoras Implementables HOY

### 1. Generar un NEXTAUTH_SECRET más fuerte

```bash
# Opción 1: Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Opción 2: OpenSSL
openssl rand -base64 64

# Opción 3: Online
# https://generate-secret.vercel.app/32
```

**Resultado ejemplo:**

```env
NEXTAUTH_SECRET=xvK9+Lm3pQ7wR2tY8uI1oP4aS6dF5gH9jK0lZ3xC7vB2nM1qW4eR6tY8uI0oP3aS5dF7gH9jK2lZ4xC6vB8nM0qW
```

### 2. Configurar JWT con algoritmo explícito

Agregar en `authOptions`:

```typescript
jwt: {
  maxAge: 30 * 24 * 60 * 60, // 30 días
  // Usa el algoritmo HS512 (HMAC SHA-512) para firmar
  // Más seguro que el default y no requiere claves públicas/privadas
  encode: async ({ secret, token, maxAge }) => {
    const jwtClaims = {
      ...token,
      exp: Math.floor(Date.now() / 1000) + maxAge,
      iat: Math.floor(Date.now() / 1000),
    };

    // NextAuth maneja el encoding con el secret
    // Esto fuerza el uso de algoritmos más robustos internamente
    return jose.SignJWT(jwtClaims)
      .setProtectedHeader({ alg: 'HS512' })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + maxAge)
      .sign(new TextEncoder().encode(secret as string));
  },
}
```

**NOTA:** Para la mayoría de apps, la configuración default es suficiente. Solo personaliza si necesitas requisitos específicos.

### 3. Cookies más seguras

Agregar en `authOptions`:

```typescript
cookies: {
  sessionToken: {
    name: `__Secure-next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    },
  },
}
```

### 4. Usar par de claves público/privada (OPCIONAL - Máxima seguridad)

**Solo si tienes requisitos de compliance estrictos (HIPAA, PCI-DSS, etc.)**

Generar claves:

```bash
# RSA 2048
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -outform PEM -pubout -out public.pem

# Convertir a base64 para .env
cat private.pem | base64 -w 0
cat public.pem | base64 -w 0
```

En `.env`:

```env
NEXTAUTH_JWT_SIGNING_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
NEXTAUTH_JWT_ENCRYPTION_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n..."
```

En `authOptions`:

```typescript
jwt: {
  signingKey: process.env.NEXTAUTH_JWT_SIGNING_PRIVATE_KEY,
  encryptionKey: process.env.NEXTAUTH_JWT_ENCRYPTION_PUBLIC_KEY,
}
```

## 📋 Plan de Implementación Sugerido

### Mínimo indispensable (15 minutos):

1. ✅ Generar nuevo `NEXTAUTH_SECRET` más fuerte
2. ✅ Actualizar `.env.local` y `.env.production`
3. ✅ Reiniciar servidor
4. ✅ Todos los usuarios deberán re-loguearse (tokens antiguos inválidos)

### Recomendado (30 minutos):

1. Todo lo anterior +
2. ✅ Configurar cookies seguras explícitas
3. ✅ Agregar `jwt.maxAge` explícito
4. ✅ Testing en dev y producción

### Máxima seguridad (2 horas):

1. Todo lo anterior +
2. ✅ Implementar par de claves RSA
3. ✅ Configurar rotación de secretos
4. ✅ Implementar logging de sesiones
5. ✅ Agregar rate limiting en login

## ⚡ Implementación Rápida (RECOMENDADA)

**Archivo:** `src/utils/auth.ts`

```typescript
export const authOptions: NextAuthOptions = {
  providers: [
    /* ... */
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  // ✨ NUEVA CONFIGURACIÓN
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 días (debe coincidir con session.maxAge)
  },

  // ✨ NUEVA CONFIGURACIÓN
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  pages: {
    /* ... */
  },
  secret: process.env.NEXTAUTH_SECRET, // ⚠️ Cambiarlo por uno nuevo!
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    /* ... */
  },
};
```

## 🎯 Respuesta a tu pregunta específica

> ¿Requiero infraestructura mejorada?

**NO.** Todo lo que menciona la documentación de NextAuth:

- ✅ JWE (encriptación) - **Ya lo tienes activo**
- ✅ Cookie chunking - **Ya funciona automáticamente**
- ✅ Algoritmos RFC 7518 - **Puedes configurarlo ahora mismo**
- ✅ Claves público/privadas - **Opcional, solo si necesitas máxima seguridad**

**Lo único que DEBES hacer:**

1. Cambiar `NEXTAUTH_SECRET` por uno más fuerte
2. Agregar configuración explícita de cookies (copiar/pegar)
3. Reiniciar servidor

**Tiempo total: 10-15 minutos**

## 🔗 Referencias

- [NextAuth JWT Options](https://next-auth.js.org/configuration/options#jwt)
- [RFC 7518 - JSON Web Algorithms](https://tools.ietf.org/html/rfc7518)
- [Secret Generation Tool](https://generate-secret.vercel.app/64)

## ⚠️ IMPORTANTE

Cuando cambies `NEXTAUTH_SECRET`:

- **Todos los usuarios existentes serán deslogueados** (tokens antiguos no se podrán descifrar)
- **Avisa a tus usuarios** si tienes gente en producción
- **Guarda el secret viejo** por si necesitas rollback temporal
