"use client";

import { useEffect, useState } from "react";
import { FileDown, Calendar, Loader2 } from "lucide-react";
import { parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { useServicesStore } from "@/lib/store/services.store";
import useTheme from "@/hooks/useTheme";

// Tipos copiados de tu store
import { IServiceCombined } from "@/models/models";

const ServicesPDFGenerator = ({
  limitToToday = false,
}: {
  limitToToday?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const { theme } = useTheme();
  let services = useServicesStore((s) => s.services);

  // Fecha en formato yyyy-mm-dd respetando la zona horaria local
  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
  const getServicesData = (): IServiceCombined[] => {
    try {
      const effectiveRange = limitToToday
        ? (() => {
            const today = formatDateForInput(new Date());
            return { from: today, to: today };
          })()
        : dateRange;

      if (effectiveRange.from || effectiveRange.to) {
        const from = effectiveRange.from
          ? startOfDay(parseISO(effectiveRange.from))
          : null;

        const to = effectiveRange.to
          ? endOfDay(parseISO(effectiveRange.to))
          : null;

        services = services.filter((service) => {
          const serviceDate = parseISO(service.serviceDate.toString());

          if (from && to) {
            return isWithinInterval(serviceDate, { start: from, end: to });
          }

          if (from) return serviceDate >= from;
          if (to) return serviceDate <= to;

          return true;
        });
      }

      return services.sort((a, b) => {
        const aDate = parseISO(a.serviceDate.toString()).getTime();
        const bDate = parseISO(b.serviceDate.toString()).getTime();
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
          <h1 style="text-align: left;">Reporte de Servicios</h1>
          <div class="subtitle" style="text-align: left;">
            Generado el ${new Date().toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            ${
              dateRange.from || dateRange.to
                ? ` - Período: ${
                    dateRange.from ? formatDate(dateRange.from) : "Inicio"
                  } al ${dateRange.to ? formatDate(dateRange.to) : "Fin"}`
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
                  <td>${formatDate(service.serviceDate.toString())}</td>
                  <td>${service.clientName} ${service.clientLastName}</td>
                  <td>${service.serviceName}</td>
                  <td>${formatPrice(service.servicePrice / 100)}</td>
                </tr>
              `,
                )
                .join("")}
              <tr class="total-row">
              <td colspan="0" style="text-align: left;">
                Total de servicios: ${services.length}
              </td>
                <td colspan="2" style="text-align: right;">TOTAL:</td>
                <td>${formatPrice(
                  services.reduce((sum, s) => sum + s.servicePrice / 100, 0),
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
    const today = formatDateForInput(new Date());
    setDateRange({ from: today, to: today });
  };

  useEffect(() => {
    if (limitToToday) {
      setToday();
    }
  }, [limitToToday]);

  const setThisWeek = () => {
    const today = new Date();
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
    const lastDay = new Date(
      today.setDate(today.getDate() - today.getDay() + 6),
    );

    setDateRange({
      from: formatDateForInput(firstDay),
      to: formatDateForInput(lastDay),
    });
  };

  const setThisMonth = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    setDateRange({
      from: formatDateForInput(firstDay),
      to: formatDateForInput(lastDay),
    });
  };

  const themeStyles = {
    "--theme-bgCard": theme.bgCard,
    "--theme-bg": theme.bg,
    "--theme-text-primary": theme.textPrimary,
    "--theme-text-secondary": theme.textSecondary,
    "--theme-border": theme.border,
    "--theme-primary": theme.primary,
    "--theme-primary-hover": theme.primaryHover,
    "--theme-accent-bg": theme.accentBg,
  } as React.CSSProperties;

  return (
    <div className="w-full max-w-3xl">
      <div
        className="rounded-2xl border border-(--theme-border) bg-(--theme-bgCard) p-4 shadow-sm"
        style={themeStyles}
      >
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-(--theme-text-primary)">
          <FileDown className="w-6 h-6" />
          Exportar Servicios
        </h2>

        <div className="mb-6 space-y-4">
          <div>
            <label className="mb-2 flex flex-row items-center text-sm font-medium text-(--theme-text-secondary)">
              <Calendar className="mr-1 inline h-4 w-4" />
              Filtrar por fecha {limitToToday ? "(solo hoy)" : "(opcional)"}
            </label>

            <div className="mb-3 flex gap-2">
              <button
                onClick={setToday}
                className="rounded-md bg-(--theme-accent-bg) px-3 py-1 text-sm text-(--theme-text-primary) transition-colors hover:opacity-90 cursor-pointer"
              >
                Hoy
              </button>
              <button
                onClick={setThisWeek}
                disabled={limitToToday}
                className="rounded-md bg-(--theme-accent-bg) px-3 py-1 text-sm text-(--theme-text-primary) transition-colors hover:opacity-90 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                Esta semana
              </button>
              <button
                onClick={setThisMonth}
                disabled={limitToToday}
                className="rounded-md bg-(--theme-accent-bg) px-3 py-1 text-sm text-(--theme-text-primary) transition-colors hover:opacity-90 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                Este mes
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs text-(--theme-text-secondary)">
                  Desde
                </label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, from: e.target.value }))
                  }
                  disabled={limitToToday}
                  className="w-full rounded-md border border-(--theme-border) bg-(--theme-bg) px-3 py-2 text-(--theme-text-primary) focus:outline-none focus:ring-2 focus:ring-(--theme-primary) disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-(--theme-text-secondary)">
                  Hasta
                </label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, to: e.target.value }))
                  }
                  disabled={limitToToday}
                  className="w-full rounded-md border border-(--theme-border) bg-(--theme-bg) px-3 py-2 text-(--theme-text-primary) focus:outline-none focus:ring-2 focus:ring-(--theme-primary) disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
            {(dateRange.from || dateRange.to) && !limitToToday && (
              <button
                onClick={handleClearDates}
                className="mt-2 text-sm text-(--theme-text-secondary) hover:text-(--theme-text-primary)"
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
            className="flex-1 rounded-lg bg-(--theme-primary) px-6 py-3 font-semibold text-white transition-colors hover:bg-(--theme-primary-hover) cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 inline h-5 w-5 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <FileDown className="mr-2 inline h-5 w-5" />
                Generar Documento
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesPDFGenerator;
