import { DataTable } from "@/components/ui/dataTable";
import { useSession } from "next-auth/react";
import { IBarbers } from "@/models/Barbers";
import * as React from "react";
import { BarbersData } from "@/models/Barbers";

export function BarberTable() {
  const { data: session } = useSession();
  const [barbers, setBarbers] = React.useState<BarbersData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!session?.user?.id) return;

    const fetchBarbers = async () => {
      try {
        const res = await fetch(`/api/users/${session.user.id}/barbers`);
        const data: IBarbers[] = await res.json(); // 👈 TIPO CORRECTO
        console.log(data);

        const mapped: BarbersData[] = data.map((barber) => ({
          id: String(new Date().getTime() + Math.random()), // Generar un ID único temporal
          name: `${barber.barberName} ${barber.barberLastName}`,
          email: barber.barberEmail,
          amount: (Math.random() * 1000).toFixed(2) as unknown as number, // Valor aleatorio para amount
          status: barber.barberActive ? "activo" : "inactivo", // 👈 este campo EXISTE
        }));

        setBarbers(mapped);
      } catch (err) {
        console.error("Error fetching barbers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, [session]);

  if (loading)
    return (
      <DataTable
        data={[
          {
            id: "1",
            name: "Cargando...",
            email: "Cargando...",
            amount: 0,
            status: "inactivo",
          },
        ]}
      />
    );

  return <DataTable data={barbers} />;
}
