/**
 * 🆕 SCRIPT CRON: Validar y actualizar estado de suscripciones
 *
 * Ejecutar diariamente (o con la frecuencia deseada):
 * npx tsx src/scripts/validate-subscriptions-cron.ts
 *
 * Este script:
 * 1. Conecta a la base de datos
 * 2. Obtiene todos los usuarios con subscriptionExpiresAt
 * 3. Marca como "expired" a aquellos cuya fecha pasó
 * 4. Mantiene "active" a aquellos que aún tienen vigencia
 * 5. Genera un reporte del proceso
 */

import mongoose from "mongoose";
import User from "@/models/Users.model";
import { IUser } from "@/models/Users.type";

interface CronResult {
  totalUsers: number;
  expiredCount: number;
  activeCount: number;
  noDateCount: number;
  errors: string[];
  timestamp: Date;
}

async function validateSubscriptions(): Promise<CronResult> {
  const result: CronResult = {
    totalUsers: 0,
    expiredCount: 0,
    activeCount: 0,
    noDateCount: 0,
    errors: [],
    timestamp: new Date(),
  };

  try {
    // Conectar a MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI no configurado");
    }

    console.log("🔄 Conectando a MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Conectado a MongoDB");

    // Obtener todos los usuarios
    console.log("📊 Obteniendo usuarios...");
    const users = await (User as mongoose.Model<IUser>).find({
      "subscription.subscriptionExpiresAt": { $exists: true },
    });

    result.totalUsers = users.length;
    console.log(
      `📝 Total de usuarios con fecha de vencimiento: ${result.totalUsers}`,
    );

    const now = new Date();

    // Procesar cada usuario
    for (const user of users) {
      try {
        const expiresAt = new Date(user.subscription?.subscriptionExpiresAt);

        if (isNaN(expiresAt.getTime())) {
          result.noDateCount++;
          continue;
        }

        const isExpired = expiresAt < now;

        if (isExpired) {
          // Actualizar a "expired"
          await (User as mongoose.Model<IUser>).findByIdAndUpdate(user._id, {
            $set: {
              "subscription.status": "expired",
            },
          });
          result.expiredCount++;
          console.log(
            `❌ ${user.userEmail} - Vencimiento: ${expiresAt.toLocaleDateString("es-AR")}`,
          );
        } else {
          // Mantener "active"
          await (User as mongoose.Model<IUser>).findByIdAndUpdate(user._id, {
            $set: {
              "subscription.status": "active",
            },
          });
          result.activeCount++;
          const daysRemaining = Math.ceil(
            (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
          );
          console.log(
            `✅ ${user.userEmail} - Activo (${daysRemaining} días restantes)`,
          );
        }
      } catch (userError) {
        const errorMsg =
          userError instanceof Error ? userError.message : String(userError);
        result.errors.push(`Error procesando ${user.userEmail}: ${errorMsg}`);
        console.error(`⚠️ Error procesando ${user.userEmail}:`, userError);
      }
    }

    // Desconectar
    await mongoose.disconnect();
    console.log("✅ Desconectado de MongoDB");

    // Imprimir reporte
    console.log("\n╔════════════════════════════════════════╗");
    console.log("║     REPORTE CRON - VALIDACIÓN           ║");
    console.log("╚════════════════════════════════════════╝");
    console.log(`📊 Total procesados: ${result.totalUsers}`);
    console.log(`✅ Activos: ${result.activeCount}`);
    console.log(`❌ Expirados: ${result.expiredCount}`);
    console.log(`⏭️ Sin fecha: ${result.noDateCount}`);
    console.log(`⚠️ Errores: ${result.errors.length}`);

    if (result.errors.length > 0) {
      console.log("\n🔴 Errores encontrados:");
      result.errors.forEach((error) => console.log(`  - ${error}`));
    }

    console.log(`📅 Ejecutado: ${result.timestamp.toISOString()}`);

    return result;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("❌ Error general:", error);
    result.errors.push(`Error general: ${errorMsg}`);
    return result;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  validateSubscriptions()
    .then((result) => {
      process.exit(result.errors.length > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}

export default validateSubscriptions;
