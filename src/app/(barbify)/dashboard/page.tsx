import CalendarDemo from "@/components/calendarDemo";
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

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <p>No autorizado</p>;
  }

  return (
    <div className="flex flex-col gap-8 p-4 grow h-full bg-[#cebaa1] w-full">
      <TimeCheckDashboard />
      {/* <div className="flex flex-row gap-8">
        <CalendarDemo />
      </div> */}
      <div className="">
        <ChartAreaInteractive />
      </div>
      <div className="flex flex-row gap-8">
        <TotalRevenue />
        <FinancialSummaryCard />
        <ClientRecurrenceCard />
      </div>
      <div className="flex flex-row gap-8">
        <InactiveClientsCard />
        <AverageTicketCard />
        <AverageDurationCard />
        <IncomePerHourByHourChart />
      </div>
      <div className="flex flex-row gap-8">
        <GenderSegmentationCard />
      </div>
    </div>
  );
}
