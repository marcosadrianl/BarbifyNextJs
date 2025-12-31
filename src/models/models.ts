// lib/models.ts
/**
 * Registry central de modelos
 * Importa este archivo antes de hacer cualquier populate
 * para asegurar que todos los modelos estén registrados
 */

import User from "@/models/Users";
import Barbers from "@/models/Barbers";
import Clients from "@/models/Clients";

// Re-exportar para conveniencia
export { User, Barbers, Clients };

// Función helper para asegurar que los modelos estén registrados
export function ensureModelsRegistered() {
  // Solo importar los modelos ya los registra
  return { User, Barbers, Clients };
}
