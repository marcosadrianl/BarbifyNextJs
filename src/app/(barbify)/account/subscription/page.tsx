import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="">
      <h1 className="text-xl font-bold mb-4 p-4">Suscripción</h1>
      <p className="text-gray-400 mb-6 px-4">
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
      <div className="p-4 border-t border-[#cebaa1] mt-4">
        <p className="text-xs">
          Barbify no gestiona las suscripciones de los usuarios. Para
          administrar o cancelar tu suscripción, por favor visita MercadoPago.
          Recuerda que tienes 3 meses de uso gratuito si cancelas la
          suscripción, luego no podrás acceder a los beneficios que ofrece
          Barbify.
        </p>
      </div>
    </div>
  );
}
