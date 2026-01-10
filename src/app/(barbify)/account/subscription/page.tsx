import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="">
      <h1 className="text-xl font-bold mb-4 p-4">Suscripción</h1>
      <p className="text-muted-foreground mb-6 px-4">
        Ve las opciones de configuración para la suscripción de tu cuenta.
      </p>

      <Link
        href="https://www.mercadopago.com.ar/subscriptions"
        target="_blank"
        className="w-full"
      >
        <div className="cursor-pointer hover:bg-gray-100 p-4">
          <span className="flex flex-row w-full justify-between items-center">
            <span>
              <h2>Administrar Suscripción</h2>
              <p className="text-xs text-gray-600">
                Gestiona tu suscripción desde MercadoPago.
              </p>
            </span>
            <ArrowUpRight className="w-6 h-6" />
          </span>
        </div>
      </Link>
    </div>
  );
}
