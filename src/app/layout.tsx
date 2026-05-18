import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Barbify",
  description: "Tu plataforma de gestión para barberías",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <Providers>{children}</Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
