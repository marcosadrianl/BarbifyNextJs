import React from "react";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { Alice } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

const Titles = Alice({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-titles",
});

export default function Dashboard() {
  return (
    <>
      <nav
        className={`${montserrat.className} fixed top-0 left-0 right-0 bg-[#ffe7c7] text-[#43553b] px-2 flex justify-between items-center w-full max-w-[1920px] mx-auto`}
      >
        <p className={`${Titles.className} text-4xl select-none`}>Barbify</p>
        <span className="flex gap-4  w-2/5 justify-between ">
          <Link
            href={"/"}
            className="hover:bg-amber-100 hover:rounded-2xl px-3 py-1"
          >
            Inicio
          </Link>
          <Link
            className="hover:bg-amber-100 hover:rounded-2xl px-3 py-1"
            href={"#pricing"}
          >
            Precios
          </Link>
          <Link
            className="hover:bg-amber-100 hover:rounded-2xl px-3 py-1"
            href={"/help"}
          >
            Ayuda
          </Link>
          <Link
            className="hover:bg-amber-100 hover:rounded-2xl px-3 py-1"
            href={"/news"}
          >
            Novedades
          </Link>
        </span>
        <Link
          className="bg-amber-600/30 rounded-2xl px-4 mr-2 py-1"
          href="/clients"
        >
          Clientes
        </Link>
      </nav>

      <main className="flex flex-col items-center justify-center">
        <section className="bg-[#ffe7c7] flex flex-row flex-1 items-center justify-center  pb-20 gap-4 text-center w-full">
          <div className="flex flex-col items-center  gap-4 w-1/2 text-[#43553b]">
            <h1
              className={`${Titles.className}  font-medium text-5xl text-left  mb-4 w-5/6 leading-snug tracking-wide`}
            >
              Elegí <span className="font-semibold ">Barbify</span>, y decile
              adiós a las libretas y al desorden.
            </h1>
            <p
              className={`${montserrat.className} text-lg text-justify mb-6 w-5/6`}
            >
              Con Barbify, podes organizar tu negocio de manera inteligente,
              cargar tus clientes, agregarles servicios y acceder a estadísticas
              que te ayudarán a tomar decisiones informadas.
            </p>
          </div>
          <div className="w-2/5">
            <Image
              src={"/ClientView Demo.png"}
              alt="Barbify"
              width={1166}
              height={874}
              className="mx-auto mt-4 rounded-[120px] border-8 border-[#ffe7c78f]"
            />
          </div>
        </section>

        <section className="bg-[#ffe7c7] flex flex-row flex-1 items-center justify-center py-20 gap-4 text-center w-full">
          <div className="w-2/5">
            <Image
              src={"/DashboarView demo.png"}
              alt="Dashboard"
              width={1166}
              height={874}
              className="mx-auto mt-4 rounded-t-[120px] rounded-ee-[120px] border-8 border-[#ffe7c78f]"
            />
          </div>
          <div className="flex flex-col items-center  gap-4 w-1/2 text-[#43553b]">
            <h1
              className={`${Titles.className}  font-medium text-5xl text-left  mb-4 w-5/6 leading-snug tracking-wide`}
            >
              Accede a <span className="font-semibold">información</span> clave
              a través de gráficos y estadísticas detalladas.
            </h1>
            <p
              className={`${montserrat.className} text-lg text-justify mb-6 w-5/6`}
            >
              Con el panel de estadísticas, podes acceder a información clave a
              traves de gráficos y metricas detalladas.
            </p>
          </div>
        </section>

        <section className="bg-[#ffe7c7] flex flex-row flex-1 items-center justify-center py-20 gap-4 text-center w-full">
          <div className="flex flex-col items-center  gap-4 w-1/2 text-[#43553b]">
            <h1
              className={`${Titles.className}  font-medium text-5xl text-left  mb-4 w-5/6 leading-snug tracking-wide`}
            >
              Organiza los turnos desde la{" "}
              <span className="font-semibold">Agenda</span>.
            </h1>
            <p
              className={`${montserrat.className} text-lg text-justify mb-6 w-5/6`}
            >
              Con nuestra Agenda, podrás gestionar los turnos de manera
              eficiente, crear listas de clientes por día, asignar turnos y
              llevar el orden diario de tu negocio.
            </p>
          </div>
          <div className="w-2/5">
            <Image
              src={"/DairyView Demo.png"}
              alt="Dashboard"
              width={1166}
              height={874}
              className="mx-auto mt-4 rounded-tr-[120px] rounded-bl-[120px] border-8 border-[#ffe7c78f]"
            />
          </div>
        </section>

        <section className="bg-[#d8c4a9] flex flex-row flex-1 items-center justify-center gap-4 text-center w-full">
          <div className="bg-[#ffe7c7] flex flex-col items-center  gap-4  text-[#43553b] rounded-ee-[120px]">
            <h1
              className={`${Titles.className}  font-medium text-5xl text-left  mb-4 w-5/6 leading-snug tracking-wide`}
            >
              ¿Por qué elegir <span className="font-semibold">Barbify</span>?
            </h1>
            <p
              className={`${montserrat.className} text-lg font-bold text-justify mb-6 w-5/6`}
            >
              Barbify te brinda herramientas esenciales para administrar tu
              peluquería de forma integral.
            </p>
            <p
              className={`${montserrat.className} text-lg  text-justify mb-6 w-5/6`}
            >
              Llevar adelante una peluquería no solo implica ofrecer buenos
              servicios, sino también organizar turnos, gestionar clientes,
              controlar ingresos, monitorear al personal y tomar decisiones con
              información clara y precisa. Barbify fue diseñada especialmente
              para cubrir todas estas necesidades, integrando funciones clave en
              una sola plataforma fácil de usar.
            </p>
            <p
              className={`${montserrat.className} text-lg  text-justify mb-6 w-5/6`}
            >
              Con nuestra app podés: <br />• Registrar y seguir la evolución de
              tus clientes y sus servicios.
              <br />• Organizar tu agenda de manera visual e intuitiva.
              <br />• Controlar tus ingresos diarios, mensuales o anuales.
              <br />• Asignar y monitorear tareas del personal.
              <br /> • Obtener estadísticas y reportes útiles para tomar
              decisiones estratégicas.
            </p>
            <p
              className={`${montserrat.className} text-lg font-medium text-justify mb-6 w-5/6`}
            >
              La gestión basada en datos ya no es algo exclusivo de las grandes
              peluquerías: ahora está al alcance tuyo; Cuanto más registres en
              Barbify, más claro verás el camino hacia el crecimiento.
            </p>
            <p
              className={`${montserrat.className} text-lg font-medium text-justify mb-6 w-5/6`}
            >
              <span className="font-bold">Ahorra</span> tiempo con la gestión
              simplificada de clientes y servicios.
              <br />
              <span className="font-bold">Accede</span> a información clave a
              través de gráficos y estadísticas detalladas.
              <br />
              <span className="font-bold">Organiza</span> los turnos fácilmente
              con nuestra práctica agenda digital.
            </p>
            <p
              className={`${montserrat.className} text-lg  font-bold text-center mb-6 w-5/6`}
            >
              No más confusiones con la libreta de papel. ¡Da el salto a la
              tecnología con Barbify!{" "}
            </p>
          </div>
        </section>

        <section className="bg-[#d8c4a9] flex flex-col flex-1 items-center justify-center py-20 gap-4 text-center w-full">
          <div className="flex flex-col items-center gap-4 w-1/2 text-[#43553b]">
            <div className="mb-4">
              <h1
                className={`${Titles.className}  font-medium text-5xl text-left leading-snug tracking-wide`}
              >
                <span className="text-[#43553b]/90 font-semibold ">
                  Barbify
                </span>{" "}
                en 2 niveles
              </h1>
              <p
                className={`${montserrat.className} text-lg text-[#43553b]/50`}
              >
                Hay una solución ideal para tu negocio
              </p>
            </div>
          </div>
          <div className="w-full px-12 flex flex-row justify-center gap-6 text-[#43553b]">
            <div className="border-2 border-amber-200 rounded-3xl p-6 w-1/4  shadow-lg hover:scale-105 transition-transform">
              <h2 className={`${Titles.className} text-2xl font-bold mb-4`}>
                SILVER
              </h2>
              <p className={`${montserrat.className} text-lg mb-12`}>
                Obtené métricas y estadísticas para optimizar tu negocio.
              </p>
              <p className={`${montserrat.className} text-lg`}>
                Accedé a herramientas basicas, gráficos y herramientas de
                liquidación diaria y mensual.
              </p>
            </div>
            <div className="border-2 border-amber-200 rounded-3xl p-6 w-1/4  shadow-lg hover:scale-105 transition-transform">
              <h2 className={`${Titles.className} text-2xl font-bold mb-4`}>
                GOLD
              </h2>
              <p className={`${montserrat.className} text-lg mb-12`}>
                La solución completa para peluquerías con múltiples clientes,
                empleados y servicios.
              </p>
              <p className={`${montserrat.className} text-lg`}>
                Incluye todas las funciones de Barbify. Desbloquea la agenda
                inteligente.
              </p>
            </div>
          </div>
          <p className={`${montserrat.className} text-lg`}>
            Puedes ver los Terminos y Condiciones haciendo click{" "}
            <Link
              href="/terms"
              className="underline hover:text-[#43553b] transition-colors"
            >
              aqui.
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
