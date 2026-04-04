import type { Metadata } from "next";
import { GalleryMasonryGrid } from "@/components/galeria/gallery-masonry-grid";
import { GaleriaCta } from "@/components/galeria/gallery-cta";
import { SITE_URL } from "@/lib/constants";
import { getGalleryImages } from "@/services/gallery";

export const revalidate = 3600;

const description =
  "Veja fotos das aulas, cerimônias de faixa, eventos e o ambiente do Dojo Luciano dos Santos. Arte marcial, disciplina e comunidade em Campo Grande - MS.";

const ogDescription =
  "Fotos das aulas, cerimônias de faixa e eventos do Dojo Luciano dos Santos.";

const canonical = `${SITE_URL}/galeria`;

export const metadata: Metadata = {
  title: "Galeria de Fotos",
  description,
  keywords: ["galeria karate", "fotos dojo"],
  openGraph: {
    title: "Galeria de Fotos",
    description: ogDescription,
    url: canonical,
  },
  alternates: { canonical },
};

export default async function GaleriaPage() {
  const images = await getGalleryImages();
  return (
    <div className="flex w-full flex-col items-center px-4 py-10 md:px-8">
      <div className="w-full max-w-[1280px] space-y-0">
        {/* Page header */}
        <section className="relative px-6 pb-12 pt-16 text-center md:pb-16 md:pt-24">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-4 text-4xl font-black leading-tight tracking-tight text-neutral-dark dark:text-white sm:text-5xl md:text-6xl">
              Nossa Jornada: Dojo Luciano dos Santos
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-neutral-dark/70 dark:text-white/70">
              Explore a disciplina, o companheirismo e o espírito que definem
              nosso dojo. Das aulas com Sensei Luciano às cerimônias de faixa.
            </p>
          </div>
        </section>

        {/* Filter + Masonry grid (Client Component) */}
        <GalleryMasonryGrid images={images} />

        {/* CTA */}
        <GaleriaCta />
      </div>
    </div>
  );
}
