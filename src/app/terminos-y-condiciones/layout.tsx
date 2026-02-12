import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones - Barbify",
  description:
    "Lee los términos y condiciones de uso de Barbify, tu plataforma de gestión para barberías. Conoce tus derechos y responsabilidades al utilizar nuestros servicios.",
};

export default function TerminosYCondicionesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
