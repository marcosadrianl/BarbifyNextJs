"use client";

import { useState } from "react";
import { FileDown, Calendar, Loader2 } from "lucide-react";
import { parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { useServicesStore } from "@/lib/store/services.store";

// Tipos copiados de tu store
type ClientService = {
  clientId: string;
  clientName: string;
  clientLastName: string;
  clientPhone: string;
  clientSex: "M" | "F" | "O";
  clientActive: boolean;
  createdAt: string;
  clientServices: {
    _id: string;
    serviceName: string;
    servicePrice: number;
    serviceDate: string;
    serviceDuration: number;
    serviceNotes: string;
    fromBarberId?: string;
  };
};

const ServicesPDFGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  let services = useServicesStore((s) => s.services);
  console.log(
    "servicios de insight",
    useServicesStore((s) => s.services)
  );

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Función para formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  // Función para obtener y ordenar servicios
  const getServicesData = (): ClientService[] => {
    try {
      if (dateRange.from || dateRange.to) {
        const from = dateRange.from
          ? startOfDay(parseISO(dateRange.from))
          : null;

        const to = dateRange.to ? endOfDay(parseISO(dateRange.to)) : null;

        services = services.filter((service) => {
          const serviceDate = parseISO(service.clientServices.serviceDate);

          if (from && to) {
            return isWithinInterval(serviceDate, { start: from, end: to });
          }

          if (from) return serviceDate >= from;
          if (to) return serviceDate <= to;

          return true;
        });
      }

      return services.sort((a, b) => {
        const aDate = parseISO(a.clientServices.serviceDate).getTime();
        const bDate = parseISO(b.clientServices.serviceDate).getTime();
        return aDate - bDate;
      });
    } catch (error) {
      console.error("Error obteniendo servicios:", error);
      return [];
    }
  };

  // Función para generar el PDF
  const generatePDF = () => {
    setLoading(true);

    try {
      const services = getServicesData();

      if (services.length === 0) {
        alert("No hay servicios para exportar");
        setLoading(false);
        return;
      }

      // Crear el contenido HTML para el PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Reporte de Servicios</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              font-size: 12px;
            }
            h1 {
              text-align: center;
              color: #333;
              font-size: 24px;
              margin-bottom: 10px;
            }
            .subtitle {
              text-align: center;
              color: #666;
              margin-bottom: 20px;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th {
              background-color: #4a5568;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: bold;
              border: 1px solid #2d3748;
            }
            td {
              padding: 10px;
              border: 1px solid #e2e8f0;
            }
            tr:nth-child(even) {
              background-color: #f7fafc;
            }
            tr:hover {
              background-color: #edf2f7;
            }
            .total-row {
              font-weight: bold;
              background-color: #e2e8f0 !important;
            }
            .total-row td {
              border-top: 2px solid #4a5568;
              padding: 15px 10px;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #718096;
              font-size: 10px;
            }
          </style>
        </head>
        <body>
          <h1>Reporte de Servicios</h1>
          <div class="subtitle">
            Generado el ${new Date().toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            ${
              dateRange.from || dateRange.to
                ? `<br>Período: ${
                    dateRange.from ? formatDate(dateRange.from) : "Inicio"
                  } - ${dateRange.to ? formatDate(dateRange.to) : "Fin"}`
                : ""
            }
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              ${services
                .map(
                  (service) => `
                <tr>
                  <td>${formatDate(service.clientServices.serviceDate)}</td>
                  <td>${service.clientName} ${service.clientLastName}</td>
                  <td>${service.clientServices.serviceName}</td>
                  <td>${formatPrice(
                    service.clientServices.servicePrice / 100
                  )}</td>
                </tr>
              `
                )
                .join("")}
              <tr class="total-row">
              <td colspan="0" style="text-align: left;">
                Total de servicios: ${services.length}
              </td>
                <td colspan="2" style="text-align: right;">TOTAL:</td>
                <td>${formatPrice(
                  services.reduce(
                    (sum, s) => sum + s.clientServices.servicePrice / 100,
                    0
                  )
                )}</td>
              </tr>
            </tbody>
          </table>
        </body>
        </html>
      `;

      // Crear un blob con el HTML
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      // Abrir en nueva ventana para imprimir
      const printWindow = window.open(url, "_blank");

      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
            URL.revokeObjectURL(url);
          }, 250);
        };
      }
    } catch (error) {
      console.error("Error generando PDF:", error);
      alert("Error al generar el PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleClearDates = () => {
    setDateRange({ from: "", to: "" });
  };

  const setToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setDateRange({ from: today, to: today });
  };

  const setThisWeek = () => {
    const today = new Date();
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
    const lastDay = new Date(
      today.setDate(today.getDate() - today.getDay() + 6)
    );

    setDateRange({
      from: firstDay.toISOString().split("T")[0],
      to: lastDay.toISOString().split("T")[0],
    });
  };

  const setThisMonth = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    setDateRange({
      from: firstDay.toISOString().split("T")[0],
      to: lastDay.toISOString().split("T")[0],
    });
  };

  return (
    <div className="w-1/2 mr-auto">
      <div className="bg-white rounded-2xl p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FileDown className="w-6 h-6" />
          Exportar Servicios a PDF
        </h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="flex flex-row items-center text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Filtrar por fecha (opcional)
            </label>

            {/* Botones rápidos */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={setToday}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
              >
                Hoy
              </button>
              <button
                onClick={setThisWeek}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
              >
                Esta semana
              </button>
              <button
                onClick={setThisMonth}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
              >
                Este mes
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Desde
                </label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, from: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Hasta
                </label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, to: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {(dateRange.from || dateRange.to) && (
              <button
                onClick={handleClearDates}
                className="mt-2 text-sm text-[#43553b] hover:text-[#273023]"
              >
                Limpiar fechas
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={generatePDF}
            disabled={loading}
            className="flex-1 bg-[#cdaa7e] hover:bg-[#ffd49d] disabled:bg-gray-400 text-[#273023] hover:text-[#43553b] font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <FileDown className="w-5 h-5" />
                Generar PDF
              </>
            )}
          </button>
        </div>

        {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Nota:</strong> El PDF incluirá todos los servicios ordenados
            por fecha (más reciente primero) con:
          </p>
          <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-4">
            <li>• Fecha del servicio</li>
            <li>• Nombre completo del cliente</li>
            <li>• Tipo de servicio</li>
            <li>• Precio individual</li>
            <li>• Total general al final</li>
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default ServicesPDFGenerator;
