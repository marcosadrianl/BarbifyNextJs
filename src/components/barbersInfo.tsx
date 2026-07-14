"use client";

import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import DeleteBarber from "@/components/deleteBarber";
import { useBarbers } from "@/lib/store/services.store";
import { IBarbers } from "@/models/Barbers";
import NewBarber from "@/components/newBarber";
import useTheme from "@/hooks/useTheme";

export default function BarbersInfo() {
  const [isOpen, setIsOpen] = useState(false); // Controla si la sección de barbers está abierta
  const [selectedBarber, setSelectedBarber] = useState<IBarbers | null>(null);
  const { theme } = useTheme();

  const { barbers, loading, refreshFromAPI } = useBarbers();

  useEffect(() => {
    refreshFromAPI();
  }, [refreshFromAPI]);

  const formatLocation = (barber: IBarbers) => {
    if (barber.city === "" && barber.state === "" && barber.address === "") {
      return "Ubicación no disponible";
    }
    return `${barber.city}, ${barber.state}, ${barber.address}`;
  };

  return (
    <div className="flex flex-col h-auto overflow-hidden">
      {/* 1. CABECERA PRINCIPAL / BOTÓN DE APERTURA */}
      {!isOpen ? (
        <div
          className="cursor-pointer p-4 transition-colors"
          onClick={() => setIsOpen(true)}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = theme.accentBg)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = theme.bg)
          }
        >
          <span className="flex flex-row w-full justify-between items-center">
            <span>
              <h2 className="" style={{ color: theme.textPrimary }}>
                Información de los Barbers
              </h2>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                Ve la información de los barbers registrados.
              </p>
            </span>
            <ChevronRight
              className="w-6 h-6"
              style={{ color: theme.textPrimary }}
            />
          </span>
        </div>
      ) : (
        <div className="flex flex-col">
          {/* TÍTULO CON BOTÓN VOLVER */}
          <div
            className="flex flex-row gap-4 cursor-pointer py-4 px-2 transition-colors"
            onClick={() => {
              setIsOpen(false);
              setSelectedBarber(null);
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = theme.accentBg)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = theme.bg)
            }
          >
            <ChevronLeft style={{ color: theme.textPrimary }} />
            <h2 className="" style={{ color: theme.textPrimary }}>
              Información de los Barbers
            </h2>
          </div>

          {/* LISTA DE BARBERS */}
          {!selectedBarber && (
            <div
              className="flex flex-col p-2"
              style={{ backgroundColor: theme.bg }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = theme.accentBg)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = theme.bg)
              }
            >
              {loading ? (
                <p
                  className="p-4 text-center"
                  style={{ color: theme.textPrimary }}
                >
                  Cargando...
                </p>
              ) : barbers.length === 0 ? (
                <p
                  className="p-4 text-left"
                  style={{ color: theme.textPrimary }}
                >
                  No hay Barbers registrados.
                </p>
              ) : (
                barbers.map((barber) => (
                  <div
                    key={barber._id.toString()}
                    className="p-4 flex justify-between items-center cursor-pointer transition-colors"
                    onClick={() => setSelectedBarber(barber)}
                  >
                    <h3 className="" style={{ color: theme.textPrimary }}>
                      {barber.barberName} {barber.barberLastName}
                    </h3>
                    <ChevronRight
                      className="w-4 h-4"
                      style={{ color: theme.textSecondary }}
                    />
                  </div>
                ))
              )}
            </div>
          )}

          {/* DETALLE DEL BARBER */}
          {selectedBarber && (
            <div style={{ borderTop: `1px solid ${theme.border}` }}>
              <div
                className="flex items-center gap-2 p-4  w-full transition-colors"
                onClick={() => setSelectedBarber(null)}
                style={{
                  borderBottom: `1px solid ${theme.border}`,
                  backgroundColor: theme.bg,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = theme.accentBg)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = theme.bg)
                }
              >
                <div className="flex items-center justify-center gap-2">
                  <X className="w-4 h-4" style={{ color: theme.textPrimary }} />
                  <h3 style={{ color: theme.textPrimary }}>
                    {selectedBarber.barberName} {selectedBarber.barberLastName}
                  </h3>
                </div>
                <div className="ml-auto" onClick={(e) => e.stopPropagation()}>
                  <DeleteBarber id={selectedBarber._id.toString()} />
                </div>
              </div>

              <div
                className="flex flex-col gap-4 p-4"
                style={{ backgroundColor: theme.bg }}
              >
                <div>
                  <p
                    className="text-xs mb-1"
                    style={{ color: theme.textMuted }}
                  >
                    EMAIL
                  </p>
                  <p style={{ color: theme.textPrimary }}>
                    {selectedBarber.barberEmail}
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs mb-1"
                    style={{ color: theme.textMuted }}
                  >
                    TELÉFONO
                  </p>
                  <p style={{ color: theme.textPrimary }}>
                    {selectedBarber.barberPhone}
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs mb-1"
                    style={{ color: theme.textMuted }}
                  >
                    ROL
                  </p>
                  <p style={{ color: theme.textPrimary }}>
                    {selectedBarber.barberRole}
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs mb-1"
                    style={{ color: theme.textMuted }}
                  >
                    UBICACION
                  </p>
                  <p style={{ color: theme.textPrimary }}>
                    {formatLocation(selectedBarber)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Componente para crear nuevo */}
      {!isOpen && <NewBarber />}
    </div>
  );
}
