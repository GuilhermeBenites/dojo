import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { INSTAGRAM_URL, SITE_URL, WHATSAPP_URL } from "@/lib/constants";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: "Dojo Luciano dos Santos Karate",
  description:
    "Escola de Karate com ensino para crianças e adultos em Dourados, MS.",
  url: SITE_URL,
  telephone: "+5567992879411",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dourados",
    addressRegion: "MS",
    addressCountry: "BR",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Wednesday", "Friday"],
      opens: "07:00",
      closes: "21:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Thursday"],
      opens: "07:00",
      closes: "21:00",
    },
  ],
  sameAs: [INSTAGRAM_URL, WHATSAPP_URL],
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={localBusinessSchema} />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
