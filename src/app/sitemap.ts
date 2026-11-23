import type { MetadataRoute } from "next";
import { getWines, pages } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const wines = await getWines();
  const paths = [
    "/",
    "/domaine",
    "/vins",
    "/vins/cepages",
    ...wines.map((w) => `/vins/${w.slug}`),
    "/visites",
    "/evenements",
    "/contact",
    ...Object.keys(pages.legal).map((slug) => `/${slug}`),
  ];
  return paths.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path.startsWith("/vins/") ? "monthly" : "weekly",
    priority: path === "/" ? 1 : path.split("/").length > 2 ? 0.6 : 0.8,
  }));
}
