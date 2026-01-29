/**
 * Script de migración para eliminar el campo clientEmail de todos los clientes
 *
 * IMPORTANTE: Este script debe ejecutarse UNA SOLA VEZ
 *
 * Ejecutar con: npx tsx src/scripts/remove-clientEmail-field.ts
 */

import { connectDB } from "@/utils/mongoose";
import Clients from "@/models/Clients.model";
import mongoose from "mongoose";

async function removeClientEmailField() {
  try {
    await connectDB();
    console.log("Conectado a la base de datos");

    // Usar la colección directamente en lugar del modelo
    const collection = mongoose.connection.collection("BarbifyClients");

    // Contar cuántos clientes tienen el campo clientEmail
    const clientsWithEmail = await collection.countDocuments({
      clientEmail: { $exists: true },
    });

    console.log(
      `Encontrados ${clientsWithEmail} clientes con campo clientEmail`,
    );

    if (clientsWithEmail === 0) {
      console.log(
        "No hay clientes con el campo clientEmail. Migración no necesaria.",
      );
      return;
    }

    // Eliminar el campo clientEmail de todos los documentos
    const result = await collection.updateMany(
      { clientEmail: { $exists: true } },
      { $unset: { clientEmail: "" } },
    );

    console.log(
      `Campo clientEmail eliminado de ${result.modifiedCount} clientes`,
    );

    // Eliminar el índice único de clientEmail si existe
    try {
      const collection = mongoose.connection.collection("BarbifyClients");
      const indexes = await collection.indexes();
      const emailIndexExists = indexes.some(
        (idx) => idx.key && idx.key.clientEmail,
      );

      if (emailIndexExists) {
        await collection.dropIndex("clientEmail_1");
        console.log("✅ Índice único de clientEmail eliminado");
      } else {
        console.log("ℹ️ No existe índice de clientEmail (ya fue eliminado)");
      }
    } catch (indexError: any) {
      if (indexError.code === 27) {
        console.log("ℹ️ Índice de clientEmail no encontrado");
      } else {
        console.warn("⚠️ Error al eliminar índice:", indexError.message);
      }
    }

    // Verificar que se eliminó correctamente
    const remainingClientsWithEmail = await collection.countDocuments({
      clientEmail: { $exists: true },
    });

    if (remainingClientsWithEmail === 0) {
      console.log("✅ Migración completada exitosamente");
      console.log(
        "El campo clientEmail ha sido eliminado de todos los clientes",
      );
    } else {
      console.log(
        `⚠️ Advertencia: Aún quedan ${remainingClientsWithEmail} clientes con el campo clientEmail`,
      );
    }
  } catch (error) {
    console.error("❌ Error en la migración:", error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log("Conexión a la base de datos cerrada");
  }
}

// Ejecutar la migración
removeClientEmailField()
  .then(() => {
    console.log("Script finalizado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script finalizado con errores:", error);
    process.exit(1);
  });
