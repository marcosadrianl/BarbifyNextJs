// ============================================
// EJEMPLOS DE USO DEL SISTEMA DE PERMISOS
// ============================================

// ------------------------------------------------
// 1. PROTEGER PÁGINAS COMPLETAS
// ------------------------------------------------

// En cualquier página, por ejemplo: app/(barbify)/analytics/page.tsx
import { PageGuard } from "@/components/PageGuard";

export default function AnalyticsPage() {
  return (
    <PageGuard page="analytics">
      <div>
        <h1>Analytics Premium</h1>
        {/* Contenido solo para premium */}
      </div>
    </PageGuard>
  );
}

// ------------------------------------------------
// 2. OCULTAR/MOSTRAR FUNCIONALIDADES ESPECÍFICAS
// ------------------------------------------------

// En el Dashboard, ocultar cards premium
import { FeatureGate } from "@/components/FeatureGate";
import { IncomePerHourByHourChart } from "@/components/ui/chart-area-step";

export function Dashboard() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Siempre visible */}
      <TotalRevenueCard />
      <ServicesPerformedCard />

      {/* Solo Premium - con prompt de upgrade */}
      <FeatureGate feature="incomePerHour">
        <IncomePerHourByHourChart />
      </FeatureGate>

      {/* Solo Premium - completamente oculto */}
      <FeatureGate feature="advancedCharts" showUpgradePrompt={false}>
        <AdvancedChartsCard />
      </FeatureGate>
    </div>
  );
}

// ------------------------------------------------
// 3. DESHABILITAR BOTONES
// ------------------------------------------------

import { useFeatureAccess } from "@/hooks/usePermissions";
import { Button } from "@/components/ui/button";

export function ExportButton() {
  const canExportPDF = useFeatureAccess("exportPDF");

  return (
    <Button disabled={!canExportPDF} onClick={handleExport}>
      {canExportPDF ? "Exportar PDF" : "Exportar PDF (Premium)"}
    </Button>
  );
}

// ------------------------------------------------
// 4. VERIFICAR MÚLTIPLES PERMISOS
// ------------------------------------------------

import { usePermissions } from "@/hooks/usePermissions";

export function ReportsPage() {
  const { hasFeature, plan, isTrialUser, getFeatureLimit } = usePermissions();

  const maxBarbers = getFeatureLimit("maxBarbers");

  return (
    <div>
      {isTrialUser && <TrialBanner />}

      <h1>Reportes</h1>
      <p>Plan actual: {plan}</p>
      <p>Barberos permitidos: {maxBarbers}</p>

      {hasFeature("exportPDF") && (
        <Button onClick={exportToPDF}>Exportar PDF</Button>
      )}

      {hasFeature("exportExcel") && (
        <Button onClick={exportToExcel}>Exportar Excel</Button>
      )}

      {!hasFeature("customDateRanges") && (
        <p className="text-sm text-gray-500">
          Mostrando últimos 30 días (rangos personalizados solo en Premium)
        </p>
      )}
    </div>
  );
}

// ------------------------------------------------
// 5. LIMITAR FUNCIONALIDADES EN LISTAS
// ------------------------------------------------

import { usePermissions } from "@/hooks/usePermissions";

export function BarbersList() {
  const { getFeatureLimit } = usePermissions();
  const maxBarbers = getFeatureLimit("maxBarbers");

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>
          Barberos ({barbers.length} / {maxBarbers})
        </h2>

        <Button
          disabled={barbers.length >= maxBarbers}
          onClick={openAddBarberModal}
        >
          {barbers.length >= maxBarbers
            ? "Límite alcanzado - Upgrade a Premium"
            : "Agregar Barbero"}
        </Button>
      </div>

      <BarberList barbers={barbers} />
    </div>
  );
}

// ------------------------------------------------
// 6. VERIFICACIONES EN EL SERVIDOR (API Routes)
// ------------------------------------------------

// En app/api/barbers/route.ts
import { getServerSession } from "next-auth";
import { hasFeature, getFeatureLimit } from "@/lib/permissions";

export async function POST(req: Request) {
  const session = await getServerSession();
  const user = session?.user;

  // Verificar si puede agregar más barberos
  const maxBarbers = getFeatureLimit(user, "maxBarbers");
  const currentBarbers = await Barber.countDocuments({
    userId: user._id,
  });

  if (currentBarbers >= maxBarbers) {
    return NextResponse.json(
      {
        error: "Límite de barberos alcanzado",
        maxBarbers,
        upgrade: true,
      },
      { status: 403 },
    );
  }

  // Continuar con la creación...
}

// ------------------------------------------------
// 7. CONDICIONALES EN COMPONENTES
// ------------------------------------------------

import { usePermissions } from "@/hooks/usePermissions";

export function ClientCard({ client }) {
  const { hasFeature } = usePermissions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{client.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Servicios realizados: {client.servicesCount}</p>

        {/* Analytics solo para premium */}
        {hasFeature("clientAnalytics") && (
          <>
            <p>Ticket promedio: ${client.averageTicket}</p>
            <p>Frecuencia: {client.frequency} días</p>
            <LineChart data={client.history} />
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ------------------------------------------------
// 8. OCULTAR OPCIONES EN MENÚS
// ------------------------------------------------

import { usePageAccess } from "@/hooks/usePermissions";

export function NavMenu() {
  const canAccessAnalytics = usePageAccess("analytics");
  const canAccessBarbers = usePageAccess("barbers");

  return (
    <nav>
      <NavLink href="/dashboard">Dashboard</NavLink>
      <NavLink href="/clients">Clientes</NavLink>
      <NavLink href="/appointments">Citas</NavLink>

      {canAccessBarbers && <NavLink href="/barbers">Barberos</NavLink>}

      {canAccessAnalytics && <NavLink href="/analytics">Analytics</NavLink>}

      {!canAccessAnalytics && (
        <NavLink href="/subscription" className="text-amber-500">
          🔒 Upgrade a Premium
        </NavLink>
      )}
    </nav>
  );
}
