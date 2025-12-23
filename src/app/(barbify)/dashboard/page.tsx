import { BarberTable } from "@/components/barbertable";
import CalendarDemo from "@/components/calendarDemo";
import { ChartAreaInteractive } from "@/components/ui/areaChartDashBoard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { IBarbers } from "@/models/Barbers";
import { BarbersData } from "@/models/Barbers";
import { connectDB } from "@/utils/mongoose";
import { IUser } from "@/models/Users";
import User from "@/models/Users";
import mongoose from "mongoose";
import { TotalRevenue } from "@/components/getTotalReveniew";

interface Barber extends IBarbers {
  _id: string;
}

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <p>No autorizado</p>;
  }

  await connectDB();

  const user = await (User as mongoose.Model<IUser>)
    .findById(session.user.id)
    .populate("userHasThisBarbers");

  if (!user) {
    return <p>Usuario no encontrado</p>;
  }

  const barbers: BarbersData[] = user.userHasThisBarbers.map((barber: any) => ({
    id: barber._id.toString(),
    name: `${barber.barberName} ${barber.barberLastName}`,
    email: barber.barberEmail,
    amount: Number((Math.random() * 1000).toFixed(2)),
    status: barber.barberActive ? "activo" : "inactivo",
  }));

  return (
    <div className="flex flex-col gap-8 p-4 grow h-full bg-[#cebaa1] w-full">
      <div className="flex flex-row gap-8">
        <CalendarDemo />
        <BarberTable data={barbers} />
      </div>
      <div className="">
        <ChartAreaInteractive />
      </div>
      <div className="flex flex-row gap-8">
        <TotalRevenue />
      </div>
    </div>
  );
}
