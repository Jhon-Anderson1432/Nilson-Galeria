import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "Nilson Galería",
  description: "Galería de arte y colección privada",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {/* Envolvemos la app para que el idioma esté disponible en todas las rutas */}
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}