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
import useTheme from "@/hooks/useTheme";
import Image from "next/image";
// background image handled via CSS inline styles to allow dynamic theming

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

function Feature({ icon, title, desc, theme }: any) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="rounded-3xl p-8 shadow-md"
      style={{
        backgroundColor: theme.bgCard,
        border: `1px solid ${theme.border}`,
        color: theme.appName,
      }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
        style={{
          backgroundColor: theme.accentBg,
          color: theme.primary,
        }}
      >
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm" style={{ color: theme.textSecondary }}>
        {desc}
      </p>
    </motion.div>
  );
}

function Plan({ title, price, features, highlight = false, theme }: any) {
  const cardBg = highlight ? theme.bgSidebar : theme.bgCard;
  const textColor = highlight ? theme.appName : theme.appName;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="rounded-3xl py-10 shadow-lg w-1/2 mx-auto"
      style={{
        backgroundColor: cardBg,
        color: textColor,
        border: `1px solid ${theme.border}`,
      }}
    >
      <h3 className="text-2xl font-semibold mb-2 px-24">{title}</h3>
      <p className="mb-6 opacity-80 q1" style={{ color: theme.textPrimary }}>
        {price}
      </p>
      <ul className="space-y-3 mb-8 text-sm text-left px-10">
        {features.map((f: string) => (
          <li key={f} style={{ color: theme.textSecondary }}>
            • {f}
          </li>
        ))}
      </ul>
      <Link
        href="/register"
        className="px-6 py-3 rounded-full font-semibold inline-block"
        style={{
          backgroundColor: theme.primary,
          color: theme.accentText,
        }}
      >
        Comienza hoy por $34.000/mes
      </Link>
    </motion.div>
  );
}

function BarbifyRequirements({ titles, theme }: any) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const allChecked = requirements.every((r) => checked[r.id]);

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="requisitos" className="py-28">
      <div
        className="max-w-5xl mx-auto px-6 text-left"
        style={{ color: theme.appName }}
      >
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`${titles?.className ?? "font-bold"} text-4xl mb-4 `}
          style={{ color: theme.appName }}
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
                            backgroundColor: theme.accentBg,
                            borderColor: theme.border,
                            scale: 1.02,
                          }
                        : {
                            backgroundColor: theme.bgCard,
                            borderColor: theme.border,
                            scale: 1,
                          }
                    }
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-4 px-5 py-4 cursor-pointer select-none rounded-3xl"
                    style={{
                      willChange: "transform",
                      color: theme.appName,
                    }}
                  >
                    {/* Checkbox circle */}
                    <motion.div
                      animate={
                        isChecked
                          ? {
                              backgroundColor: theme.primary,
                              borderColor: theme.border,
                            }
                          : {
                              backgroundColor: theme.bgCard,
                              borderColor: theme.border,
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
                    <div
                      className="flex flex-col"
                      style={{ color: theme.appName }}
                    >
                      <motion.span
                        animate={
                          isChecked
                            ? { color: theme.appName }
                            : { color: theme.appName }
                        }
                        className="font-semibold text-base leading-tight"
                      >
                        {req.label}
                      </motion.span>
                      <span
                        className="text-sm"
                        style={{ color: theme.textSecondary }}
                      >
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
                            className="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap"
                            style={{
                              backgroundColor: theme.primary,
                              color: theme.accentText,
                            }}
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
                  backgroundColor: theme.accentBg,
                  color: theme.appName,
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl mb-2"
                  style={{ color: theme.appName }}
                >
                  ¡Genial!
                </motion.div>
                <p
                  className="font-bold text-xl leading-snug"
                  style={{ color: theme.appName }}
                >
                  Podés usar Barbify
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: theme.textSecondary }}
                >
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
  const { theme } = useTheme();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/clients");
    }
  }, [status, session, router]);

  return (
    <div
      className={`${montserrat.className} overflow-hidden`}
      style={{
        backgroundColor: theme.bg,
        color: theme.appName,
      }}
    >
      {/* NAVBAR */}
      <header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur border-b"
        style={{
          backgroundColor: `${theme.bg}cc`,
          borderColor: theme.border,
          color: theme.appName,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-6 h-16 flex items-center justify-between">
          <span
            className={`${titles.className} text-3xl select-none`}
            style={{ color: theme.appName }}
          >
            Barbify
          </span>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <Link href="#features" style={{ color: theme.appName }}>
              Funciones
            </Link>
            <Link href="#why" style={{ color: theme.appName }}>
              Por qué Barbify
            </Link>
            <Link href="#pricing" style={{ color: theme.appName }}>
              Planes
            </Link>
            <Link href="/help" style={{ color: theme.appName }}>
              Ayuda
            </Link>
          </nav>
          <Link
            href="/login"
            className="px-5 py-2 rounded-full text-sm font-semibold hover:scale-105 transition"
            style={{
              backgroundColor: theme.primary,
              color: theme.accentText,
            }}
          >
            Ingresar
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-32 pb-28 px-6 overflow-hidden max-w-screen">
        <div className="absolute bg-cover w-full h-full top-0 left-0">
          {/* Imagen de fondo */}
          <Image
            src="/seamless-tileable-pattern-in-doodle-d.jpg"
            alt="Doodle peluquería"
            fill
            style={{ objectFit: "cover", objectPosition: "top center" }}
          />

          {/* Overlay con gradiente */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to left, ${theme.bg} 30%, rgba(255,255,255,0) 100%)`,
            }}
          />
        </div>

        {/* Contenido */}
        <div className="max-w-7xl mx-auto flex justify-end z-10 relative">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-right"
          >
            <h1
              className={`${titles.className} text-5xl md:text-6xl leading-tight mb-6 text-left`}
              style={{ color: theme.appName }}
            >
              La forma moderna de <br /> gestionar tu{" "}
              <span className="font-semibold" style={{ color: theme.appName }}>
                peluquería
              </span>
            </h1>
            <p
              className="text-lg mb-10 max-w-xl text-left"
              style={{ color: theme.textPrimary }}
            >
              Barbify reemplaza libretas, desorden y cálculos mentales por una
              plataforma clara, visual y pensada para peluqueros y barberos
              reales.
            </p>
            <div className="flex gap-4">
              <Link
                href="/register"
                className="px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
                style={{
                  backgroundColor: theme.primary,
                  color: theme.accentText,
                }}
              >
                Probar Barbify
              </Link>
              <Link
                href="#why"
                className="px-6 py-3 rounded-full border font-medium transition"
                style={{
                  borderColor: theme.border,
                  color: theme.appName,
                }}
              >
                Ver más
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="py-28"
        style={{ backgroundColor: theme.accentBg }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`${titles.className} text-4xl mb-16 text-center`}
            style={{ color: theme.appName }}
          >
            Todo lo que tu negocio necesita
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-10">
            <Feature
              icon={<Users />}
              title="Clientes"
              desc="Historial, servicios y seguimiento en un solo lugar."
              theme={theme}
            />
            <Feature
              icon={<Calendar />}
              title="Agenda"
              desc="Turnos claros, orden diario y visión semanal."
              theme={theme}
            />
            <Feature
              icon={<BarChart3 />}
              title="Estadísticas"
              desc="Decisiones basadas en datos reales, no intuición."
              theme={theme}
            />
            <Feature
              icon={<Scissors />}
              title="Servicios"
              desc="Precios, registros y control por cliente."
              theme={theme}
            />
            <Feature
              icon={<ShieldCheck />}
              title="Seguridad"
              desc="Tus datos protegidos y siempre disponibles."
              theme={theme}
            />
            <Feature
              icon={<Sparkles />}
              title="Simplicidad"
              desc="Diseñada para usarse sin experiencia técnica."
              theme={theme}
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
          <p
            className="text-lg leading-relaxed max-w-xl mx-auto text-justify [text-align-last:center]"
            style={{ color: theme.textSecondary }}
          >
            Barbify nace del día a día real de una peluquería: clientes que
            vuelven, servicios que se repiten, turnos que se mezclan y números
            que hay que entender. Todo fue diseñado para ayudarte a crecer con
            orden, claridad y control.
          </p>
        </div>
      </section>

      {/* break */}
      <section
        className="py-12"
        style={{ backgroundColor: theme.accentBg }}
      ></section>

      {/* REQUIREMENTS */}
      <BarbifyRequirements titles={titles} theme={theme} />

      {/* PRICING */}
      <section
        id="pricing"
        className="py-28"
        style={{ backgroundColor: theme.accentBg }}
      >
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
              theme={theme}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-28 flex items-center"
        style={{ backgroundColor: theme.bg }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2
            className={`${titles.className} text-4xl mb-6`}
            style={{ color: theme.appName }}
          >
            Dejá atrás la libreta
          </h2>
          <p className="text-lg mb-10" style={{ color: theme.textSecondary }}>
            Empezá hoy a gestionar tu peluquería con Barbify.
          </p>
          <Link
            href="/register"
            className="px-8 py-4 rounded-full font-semibold hover:scale-105 transition"
            style={{
              backgroundColor: theme.appName,
              color: theme.dangerText,
            }}
          >
            Crear mi cuenta
          </Link>
        </div>
      </section>

      <footer
        className="py-10 text-center text-sm"
        style={{ color: theme.textSecondary }}
      >
        © {new Date().getFullYear()} Barbify · GlowNest
      </footer>
    </div>
  );
}
