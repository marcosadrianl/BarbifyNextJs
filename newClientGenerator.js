const fs = require("fs");
const path = require("path");

function generateClient(index) {
  return {
    clientName: `Cliente${index}`,
    clientLastName: `Apellido${index}`,
    clientSex: index % 2 === 0 ? "M" : "F",
    clientBirthdate: new Date(`199${index % 10}-0${(index % 9) + 1}-15`),
    clientEmail: `cliente${index}@email.com`,
    clientPhone: `+54011${10000000 + index}`,
    clientImage: ``,
    clientActive: true,
    clientBaseColor: "Castaño oscuro",
    clientHairType: "Ondulado",
    clientAllergies: "Ninguna conocida",
    clientDiseases: "Ninguna",
    clientMedications: "Ninguna",
    clientNotes: `Cliente generado para pruebas (${index})`,
    clientServices: [
      {
        serviceDate: new Date(),
        serviceName: "Corte de pelo y barba",
        serviceNotes: "Degradado medio, barba perfilada",
        servicePrice: 25.0,
        serviceDuration: 45,
        fromBarberId: "barber123",
      },
    ],
    clientWhiteHairs: Math.floor(Math.random() * 50),
    clientFromUserId: undefined,
    ClientPassword: "hashedPassword123",
  };
}

function generateClients(count) {
  return Array.from({ length: count }, (_, i) => generateClient(i + 1));
}

function exportToJsonFile(data, filename) {
  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✅ Archivo generado: ${filePath}`);
}

// Ejecutar
const clients = generateClients(200); // Genera 20 clientes
exportToJsonFile(clients, "clientes-prueba.json");
