import { ChartAreaInteractive } from "@/components/ui/areaChartDashBoard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { FinancialSummaryCard } from "@/components/financialCard";
import { TimeCheckDashboard } from "@/components/timeCheckDashboard";
import { ClientRecurrenceCard } from "@/components/ClientRecurrenceCard";
import InactiveClientsCard from "@/components/inactiveclients";
import { AverageTicketCard } from "@/components/AverageTicket";
import { AverageDurationCard } from "@/components/AverageTimeService";
import { TotalRevenue } from "@/components/getTotalReveniew";
import { IncomePerHourByHourChart } from "@/components/ui/chart-area-step";
import { GenderSegmentationCard } from "@/components/ui/GenderSegmentationCard";
import { YearlyServicesChart } from "@/components/ui/YearlyServicesChart";
import { WeeklyDayChart } from "@/components/ui/WeeklyDayChart";

export default async function Page() {
  const session = await getServerSession(authOptions);
  /* console.log("🛡️ Session en dashboard:", session); */

  if (!session?.user?.id) {
    return <p>No autorizado</p>;
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-[#cebaa1]">
      <TimeCheckDashboard />

      <div className="">
        <ChartAreaInteractive />
      </div>
      <div className="flex flex-row gap-4">
        <TotalRevenue />
        <FinancialSummaryCard />
        <ClientRecurrenceCard />
      </div>
      <div className="flex flex-row gap-4">
        <InactiveClientsCard />
        <AverageTicketCard />
        <AverageDurationCard />
        <IncomePerHourByHourChart />
      </div>
      <div className="flex flex-row gap-4">
        <GenderSegmentationCard />
      </div>
      <div className="flex flex-row gap-4">
        <YearlyServicesChart />
        <WeeklyDayChart />
      </div>
    </div>
  );
}
