export type GalleryCategory =
  | "Todos"
  | "Sensei Luciano"
  | "Cerimônias de Faixa"
  | "Aulas Infantis"
  | "Dojo";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: Exclude<GalleryCategory, "Todos">;
  aspectClass: string;
}
