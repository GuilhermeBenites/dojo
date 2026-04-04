import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/senseis", priority: 0.8, changeFrequency: "monthly" },
    { path: "/horarios", priority: 0.9, changeFrequency: "weekly" },
    { path: "/galeria", priority: 0.7, changeFrequency: "weekly" },
    { path: "/campeonatos", priority: 0.8, changeFrequency: "monthly" },
    { path: "/planos", priority: 0.9, changeFrequency: "monthly" },
  ] as const;

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
