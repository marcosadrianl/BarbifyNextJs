import type { Metadata } from "next";
import Head from "next/head";
import "./globals.css";

export const metadata: Metadata = {
  title: "Barbify",
  description: "Tu plataforma de gestión para barberías",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <Head>
        <title>Barbify</title>
        <meta
          name="description"
          content="Tu plataforma de gestión para barberías"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
