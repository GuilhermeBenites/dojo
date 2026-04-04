import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { OG_IMAGE_URL, SITE_NAME, SITE_URL } from "@/lib/constants";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} | Tradição & Disciplina`,
  },
  description:
    "Disciplina, foco e autodefesa para todas as idades. Transforme sua mente e corpo com a tradição do verdadeiro Karate.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@dojoludanosantos",
    images: [OG_IMAGE_URL],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${lexend.variable} flex min-h-screen flex-col bg-background-light font-display antialiased text-slate-900 dark:bg-background-dark dark:text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
