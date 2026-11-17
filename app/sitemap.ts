import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";

const site = "https://lucasreydman.xyz";

/* The wall, the résumé, and one page per project. The print sheet is left out: it is the PDF's source. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site, changeFrequency: "monthly", priority: 1 },
    { url: `${site}/resume`, changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((p) => ({ url: `${site}/work/${p.brand}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
