"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useTheme from "@/hooks/useTheme";
import Link from "next/link";

export default function SubscriptionPage() {
  const { theme } = useTheme();
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="w-fit mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Tu período de prueba gratuita ha finalizado
          </h1>
          <p className="text-xl">
            Actualiza tu plan para seguir disfrutando de todas las
            funcionalidades
          </p>
        </div>

        <Card
          style={{
            background: theme.bgCard,
          }}
        >
          <CardHeader>
            <CardTitle
              className="text-2xl"
              style={{
                color: theme.appName,
              }}
            >
              Plan Premium
            </CardTitle>
            <CardDescription className="mt-2 font-medium">
              Tu periodo de prueba ha finalizado, deberás suscribirte para
              continuar usando la aplicación
            </CardDescription>
            <div className="flex flex-row justify-around items-baseline mt-4">
              <span
                className="text-4xl font-bold"
                style={{
                  color: theme.accentText,
                }}
              >
                $34.000
                <span className="text-2xl">/mes</span>
              </span>
              <p
                className="text-5xl"
                style={{
                  color: theme.accentText,
                }}
              ></p>
              <span
                className="text-4xl font-bold"
                style={{
                  color: theme.accentText,
                }}
              >
                $340.000
                <span className="text-2xl">/año</span>
              </span>
            </div>
          </CardHeader>

          <CardContent>
            <ul
              className="space-y-3 list-disc list-inside text-sm"
              style={{ color: theme.textSecondary }}
            >
              <li>Acceso ilimitado a todas las funciones</li>
              <li>Soporte prioritario</li>
              <li>Actualizaciones exclusivas</li>
            </ul>
          </CardContent>

          <CardFooter className="flex flex-col mt-auto">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer p-2 rounded-full">
              <Link
                href="https://api.whatsapp.com/send/?phone=5492214958407&text=Quiero%20suscribirme%20a%20Barbify&type=phone_number&app_absent=0"
                target="_blank"
              >
                Ponerme en contacto con el equipo de ventas
              </Link>
            </button>
            <a
              href="mailto:lucas.adrmarcos@gmail.com"
              className="mt-2 text-xs text-center text-muted-foreground p-2 cursor-pointer h-full w-1/2 text-nowrap"
            >
              <p>
                ¿Tienes dudas?{" "}
                <span className="hover:underline">Contáctanos</span>
              </p>
            </a>
          </CardFooter>
        </Card>

        <div className="mt-12 text-center text-sm">
          <p>El plan incluye acceso completo a la plataforma.</p>
          <p className="py-4">
            Los pagos se procesan de forma segura a través de Mercado Pago.
          </p>
        </div>
      </div>
    </div>
  );
}
