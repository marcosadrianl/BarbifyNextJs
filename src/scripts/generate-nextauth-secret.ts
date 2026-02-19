/**
 * Script para generar un NEXTAUTH_SECRET seguro
 *
 * Uso:
 *   node src/scripts/generate-nextauth-secret.js
 *
 * O con tsx:
 *   npx tsx src/scripts/generate-nextauth-secret.ts
 */

import crypto from "crypto";

console.log("\n🔐 GENERADOR DE NEXTAUTH_SECRET\n");
console.log("=".repeat(70));

// Generar 3 opciones diferentes
for (let i = 1; i <= 3; i++) {
  const secret = crypto.randomBytes(64).toString("base64");
  console.log(`\nOpción ${i}:`);
  console.log(secret);
}

console.log("\n" + "=".repeat(70));
console.log("\n📋 INSTRUCCIONES:\n");
console.log("1. Copia UNA de las opciones de arriba");
console.log("2. Pégala en .env.local y .env.production:");
console.log("   NEXTAUTH_SECRET=<el_secret_que_copiaste>");
console.log("\n⚠️  IMPORTANTE:");
console.log("   - Todos los usuarios serán deslogueados");
console.log("   - Guarda el secret viejo por si necesitas rollback");
console.log("   - NO compartas este secret en Git o logs");
console.log("\n✅ Después de actualizar el secret:");
console.log("   1. Reinicia el servidor (pnpm dev)");
console.log("   2. Haz login nuevamente");
console.log("   3. Verifica que todo funcione correctamente\n");
