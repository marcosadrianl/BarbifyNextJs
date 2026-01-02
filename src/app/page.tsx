"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Scissors,
  Calendar,
  BarChart3,
  Users,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Montserrat, Alice } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});
const titles = Alice({ subsets: ["latin"], weight: ["400"] });

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function BarbifyLanding() {
  return (
    <div
      className={`${montserrat.className} bg-[#fff7ec] text-[#2f3e2f] overflow-hidden`}
    >
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-[#fff7ec]/80 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className={`${titles.className} text-3xl select-none`}>
            Barbify
          </span>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <Link href="#features">Funciones</Link>
            <Link href="#why">Por qué Barbify</Link>
            <Link href="#pricing">Planes</Link>
            <Link href="/help">Ayuda</Link>
          </nav>
          <Link
            href="/login"
            className="px-5 py-2 rounded-full bg-[#2f3e2f] text-[#fff7ec] text-sm font-semibold hover:scale-105 transition"
          >
            Ingresar
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-32 pb-28 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
          >
            <h1
              className={`${titles.className} text-5xl md:text-6xl leading-tight mb-6`}
            >
              La forma moderna de <br /> gestionar tu{" "}
              <span className="font-semibold">peluquería</span>
            </h1>
            <p className="text-lg text-black/70 mb-10 max-w-xl">
              Barbify reemplaza libretas, desorden y cálculos mentales por una
              plataforma clara, visual y pensada para peluqueros y barberos
              reales.
            </p>
            <div className="flex gap-4">
              <Link
                href="/register"
                className="px-6 py-3 rounded-full bg-[#2f3e2f] text-[#fff7ec] font-semibold hover:scale-105 transition"
              >
                Probar Barbify
              </Link>
              <Link
                href="#why"
                className="px-6 py-3 rounded-full border border-black/20 font-medium hover:bg-black/5 transition"
              >
                Ver más
              </Link>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <Image
              src="/DashboarView demo.png"
              alt="Dashboard Barbify"
              width={1200}
              height={800}
              className="rounded-[48px] shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white rounded-3xl px-6 py-4 shadow-lg text-sm font-medium">
              + Control
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-28 bg-[#f3eadb]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`${titles.className} text-4xl mb-16 text-center`}
          >
            Todo lo que tu negocio necesita
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-10">
            <Feature
              icon={<Users />}
              title="Clientes"
              desc="Historial, servicios y seguimiento en un solo lugar."
            />
            <Feature
              icon={<Calendar />}
              title="Agenda"
              desc="Turnos claros, orden diario y visión semanal."
            />
            <Feature
              icon={<BarChart3 />}
              title="Estadísticas"
              desc="Decisiones basadas en datos reales, no intuición."
            />
            <Feature
              icon={<Scissors />}
              title="Servicios"
              desc="Precios, registros y control por cliente."
            />
            <Feature
              icon={<ShieldCheck />}
              title="Seguridad"
              desc="Tus datos protegidos y siempre disponibles."
            />
            <Feature
              icon={<Sparkles />}
              title="Simplicidad"
              desc="Diseñada para usarse sin experiencia técnica."
            />
          </div>
        </div>
      </section>

      {/* WHY */}
      <section id="why" className="py-28">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`${titles.className} text-4xl mb-8`}
          >
            Diseñada para peluqueros, por peluqueros.
          </motion.h2>
          <p className="text-lg text-black/70 leading-relaxed">
            Barbify nace del día a día real de una peluquería: clientes que
            vuelven, servicios que se repiten, turnos que se mezclan y números
            que hay que entender. Todo fue diseñado para ayudarte a crecer con
            orden, claridad y control.
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-28 bg-[#f3eadb]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className={`${titles.className} text-4xl mb-14`}>
            Planes simples
          </h2>
          <div className="grid md:grid-cols-2 gap-10">
            <Plan
              title="Standard"
              price="Acceso esencial"
              features={["Clientes", "Servicios", "Estadísticas básicas"]}
            />
            <Plan
              title="Premium"
              price="Gestión completa"
              highlight
              features={[
                "Todo Silver",
                "Agenda avanzada",
                "Control de empleados",
                "Reportes completos",
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className={`${titles.className} text-4xl mb-6`}>
            Dejá atrás la libreta
          </h2>
          <p className="text-lg text-black/70 mb-10">
            Empezá hoy a gestionar tu peluquería con Barbify.
          </p>
          <Link
            href="/register"
            className="px-8 py-4 rounded-full bg-[#2f3e2f] text-[#fff7ec] font-semibold hover:scale-105 transition"
          >
            Crear mi cuenta
          </Link>
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-black/50">
        © {new Date().getFullYear()} Barbify · GlowNest
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }: any) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-white rounded-3xl p-8 shadow-md"
    >
      <div className="w-12 h-12 rounded-2xl bg-[#2f3e2f]/10 flex items-center justify-center mb-4 text-[#2f3e2f]">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-black/60">{desc}</p>
    </motion.div>
  );
}

function Plan({ title, price, features, highlight = false }: any) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`rounded-3xl p-10 shadow-lg ${
        highlight ? "bg-[#2f3e2f] text-[#fff7ec]" : "bg-white"
      }`}
    >
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="mb-6 opacity-80">{price}</p>
      <ul className="space-y-3 mb-8 text-sm">
        {features.map((f: string) => (
          <li key={f}>• {f}</li>
        ))}
      </ul>
      <Link
        href="/register"
        className={`px-6 py-3 rounded-full font-semibold inline-block ${
          highlight
            ? "bg-[#fff7ec] text-[#2f3e2f]"
            : "bg-[#2f3e2f] text-[#fff7ec]"
        }`}
      >
        Empezar
      </Link>
    </motion.div>
  );
}
