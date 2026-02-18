import { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes - Barbify",
  description:
    "Lee las preguntas frecuentes sobre el uso de Barbify, tu plataforma de gestión para barberías. Encuentra respuestas a las dudas más comunes sobre nuestros servicios.",
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
