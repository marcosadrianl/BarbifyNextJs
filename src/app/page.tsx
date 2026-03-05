"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Scissors,
  Calendar,
  BarChart3,
  Users,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Montserrat, Alice } from "next/font/google";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});
const titles = Alice({ subsets: ["latin"], weight: ["400"] });

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const confettiColors = [
  "#FF6B9D",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#FF6B6B",
  "#C77DFF",
];

const requirements = [
  {
    id: "device",
    icon: "💻",
    label: "Tablet o computadora",
    sublabel: "Windows, Linux o Mac",
  },
  {
    id: "internet",
    icon: "🌐",
    label: "Acceso a internet",
    sublabel: "WiFi, red o 4G/5G",
  },
  {
    id: "browser",
    icon: "🧭",
    label: "Navegador compatible",
    sublabel: "Chrome, Firefox o Safari",
  },
];

function MiniConfetti({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      {Array.from({ length: 22 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const color = confettiColors[i % confettiColors.length];
        const size = 6 + Math.random() * 8;
        const rotate = Math.random() * 360;
        return (
          <motion.div
            key={i}
            initial={{ y: "110%", x: 0, opacity: 1, rotate }}
            animate={{
              y: "-20%",
              x: (Math.random() - 0.5) * 60,
              opacity: 0,
              rotate: rotate + 180,
            }}
            transition={{
              duration: 1.1 + Math.random() * 0.6,
              delay,
              ease: "easeOut",
            }}
            style={{
              position: "absolute",
              left: `${left}%`,
              bottom: 0,
              width: size,
              height: size,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
              background: color,
            }}
          />
        );
      })}
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
      className={`rounded-3xl p-10 shadow-lg w-1/2 mx-auto ${
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
        Comienza hoy por $34.000/mes
      </Link>
    </motion.div>
  );
}

function BarbifyRequirements({ titles }: any) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const allChecked = requirements.every((r) => checked[r.id]);

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="requisitos" className="py-28">
      <div className="max-w-5xl mx-auto px-6 text-left text-[#2f3e2f]">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`${titles?.className ?? "font-bold"} text-4xl mb-4 `}
        >
          Requisitos:
        </motion.h2>

        <div className="flex flex-col gap-4 max-w-lg">
          {requirements.map((req, i) => {
            const isChecked = !!checked[req.id];
            return (
              <motion.div
                key={req.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                style={{ marginLeft: `${i * 100}px` }} // 👈 aquí
                className="w-full"
              >
                <motion.button
                  onClick={() => toggle(req.id)}
                  whileTap={{ scale: 0.97 }}
                  className="w-full text-left"
                  aria-pressed={isChecked}
                >
                  <motion.div
                    animate={
                      isChecked
                        ? {
                            backgroundColor: "#f3eadb",
                            borderColor: "#fff7ec",
                            scale: 1.02,
                          }
                        : {
                            backgroundColor: "#ffffff",
                            borderColor: "#e5e7eb",
                            scale: 1,
                          }
                    }
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-4 px-5 py-4 cursor-pointer select-none"
                    style={{ willChange: "transform" }}
                  >
                    {/* Checkbox circle */}
                    <motion.div
                      animate={
                        isChecked
                          ? {
                              backgroundColor: "#2f3e2f",
                              borderColor: "#fff7ec",
                            }
                          : {
                              backgroundColor: "#f9fafb",
                              borderColor: "#d1d5db",
                            }
                      }
                      transition={{ duration: 0.2 }}
                      className="shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center"
                    >
                      <AnimatePresence>
                        {isChecked && (
                          <motion.span
                            key="check"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 20,
                            }}
                            className="text-white text-xs font-bold"
                          >
                            ✓
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Icon */}
                    <motion.span
                      animate={isChecked ? { scale: 1.2 } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="text-2xl"
                    >
                      {req.icon}
                    </motion.span>

                    {/* Text */}
                    <div className="flex flex-col text-[#2f3e2f]">
                      <motion.span
                        animate={
                          isChecked
                            ? { color: "#2f3e2f" }
                            : { color: "#2f3e2f" }
                        }
                        className="font-semibold text-base leading-tight"
                      >
                        {req.label}
                      </motion.span>
                      <span className="text-sm text-[#2f3e2f]/40">
                        {req.sublabel}
                      </span>
                    </div>

                    {/* "Lo tengo" badge */}
                    <div className="ml-auto">
                      <AnimatePresence>
                        {isChecked && (
                          <motion.span
                            key="badge"
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 8 }}
                            className="text-xs font-semibold text-pink-500 bg-pink-50 px-2 py-1 rounded-full whitespace-nowrap"
                          >
                            ¡Lo tengo! ✓
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Success banner */}
        <AnimatePresence>
          {allChecked && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="relative mt-8 max-w-lg overflow-hidden w-full mx-auto"
            >
              <MiniConfetti active={allChecked} />
              <div
                className="px-6 py-5 text-center"
                style={{
                  background:
                    "linear-gradient(120deg, #fff7ec 0%, #f3eadb 50%, #fff7ec 100%)",
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl mb-2"
                >
                  ¡Genial!
                </motion.div>
                <p className="font-bold text-[#2f3e2f] text-xl leading-snug">
                  Podés usar Barbify
                </p>
                <p className="text-[#2f3e2f] text-sm mt-1">
                  Tenés todo lo que necesitás para empezar 🚀
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default function BarbifyLanding() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/clients");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff7ec]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f3e2f] mx-auto mb-4"></div>
          <p className="text-[#2f3e2f]">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${montserrat.className} bg-[#fff7ec] text-[#2f3e2f] overflow-hidden`}
    >
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-[#fff7ec]/80 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 md:px-6 h-16 flex items-center justify-between">
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
        <div className="max-w-7xl mx-auto grid md:grid-cols-1 gap-16 items-center">
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
            Pensada por peluqueros, para peluqueros.
          </motion.h2>
          <p className="text-lg text-black/70 leading-relaxed max-w-xl mx-auto text-justify [text-align-last:center]">
            Barbify nace del día a día real de una peluquería: clientes que
            vuelven, servicios que se repiten, turnos que se mezclan y números
            que hay que entender. Todo fue diseñado para ayudarte a crecer con
            orden, claridad y control.
          </p>
        </div>
      </section>

      {/* break */}
      <section className="py-4 bg-[#f3eadb]"></section>

      {/* REQUIREMENTS */}
      <BarbifyRequirements titles={titles} />

      {/* PRICING */}
      <section id="pricing" className="py-28 bg-[#f3eadb]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className={`${titles.className} text-4xl mb-14`}>
            Un solo plan, acceso total
          </h2>
          <div className="grid md:grid-cols-1 gap-10">
            <Plan
              title="All Access"
              price="Gestión completa"
              highlight
              features={[
                "Clientes",
                "Servicios",
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
