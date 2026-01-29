import { ChartAreaInteractive } from "@/components/ui/areaChartDashBoard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/utils/mongoose";
import User from "@/models/Users.model";
import mongoose from "mongoose";
import { IUser } from "@/models/Users.type";
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
import { hasFeature } from "@/lib/permissions";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <p>No autorizado</p>;
  }

  // Verificar si el usuario está activo
  await connectDB();
  const user = await (User as mongoose.Model<IUser>)
    .findOne({ userEmail: session.user.userEmail })
    .lean();

  if (!user?.userActive) {
    redirect("/subscription");
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-[#cebaa1]">
      {hasFeature(user, "timeCheck") && <TimeCheckDashboard />}

      <div className="">
        {hasFeature(user, "servicesPerformed") && <ChartAreaInteractive />}
      </div>

      {hasFeature(user, "totalRevenue") && (
        <div className="flex flex-row gap-4">
          <TotalRevenue />
          <FinancialSummaryCard />
          <ClientRecurrenceCard />
        </div>
      )}

      <div className="flex flex-row justify-between gap-4 ">
        {hasFeature(user, "inactiveClients") && <InactiveClientsCard />}
        {hasFeature(user, "averageTicket") && <AverageTicketCard />}
        {hasFeature(user, "averageDuration") && <AverageDurationCard />}
        {hasFeature(user, "incomePerHour") && <IncomePerHourByHourChart />}
      </div>

      {hasFeature(user, "genderSegmentation") && (
        <div className="flex flex-row gap-4">
          <GenderSegmentationCard />
        </div>
      )}

      <div className="flex flex-row gap-4">
        {hasFeature(user, "yearlyServices") && <YearlyServicesChart />}
        {hasFeature(user, "weeklyServices") && <WeeklyDayChart />}
      </div>
    </div>
  );
}
