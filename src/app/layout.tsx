import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Dojo Luciano dos Santos Karate",
  description:
    "Disciplina, foco e autodefesa para todas as idades. Transforme sua mente e corpo com a tradição do verdadeiro Karate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${lexend.variable} flex min-h-screen flex-col bg-background-light font-display antialiased text-slate-900 dark:bg-background-dark dark:text-slate-100`}
      >
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
