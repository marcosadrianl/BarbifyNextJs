/**
 * Script de migración para actualizar usuarios existentes
 * Convierte usuarios con plan "free" a plan "standard" con período de prueba
 *
 * IMPORTANTE: Este script debe ejecutarse UNA SOLA VEZ después del deployment
 */

import { connectDB } from "@/utils/mongoose";
import User from "@/models/Users.model";
import mongoose from "mongoose";
import { IUser } from "@/models/Users.type";

async function migrateUsers() {
  try {
    await connectDB();
    console.log("Conectado a la base de datos");

    // Buscar todos los usuarios con plan "free"
    const usersWithFreePlan = await (User as mongoose.Model<IUser>).find({
      "subscription.plan": "free",
    });

    console.log(
      `Encontrados ${usersWithFreePlan.length} usuarios con plan free`,
    );

    // Actualizar cada usuario
    for (const user of usersWithFreePlan) {
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14); // 14 días desde ahora

      await (User as mongoose.Model<IUser>).findByIdAndUpdate(user._id, {
        $set: {
          "subscription.plan": "standard",
          "subscription.status": "trial",
          "subscription.startDate": new Date(),
          "subscription.trialEndDate": trialEndDate,
          userActive: true, // Activar usuario durante el trial
        },
      });

      console.log(
        `Usuario ${user.userEmail} actualizado a plan standard con trial de 14 días`,
      );
    }

    console.log("Migración completada exitosamente");
  } catch (error) {
    console.error("Error en la migración:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Conexión cerrada");
  }
}

// Ejecutar la migración
if (require.main === module) {
  migrateUsers();
}

export { migrateUsers };
