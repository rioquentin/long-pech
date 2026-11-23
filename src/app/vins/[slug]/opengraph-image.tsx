import { getWine, ui } from "@/lib/content";
import { ogImage, ogSize } from "@/lib/og";

export const alt = "Cuvée du Domaine de Long-Pech";
export const size = ogSize;
export const contentType = "image/png";

const COLORS = {
  rouge: "#7A1F2B",
  rose: "#D4877A",
  blanc: "#B5B067",
  doux: "#B8862B",
  effervescent: "#8AA3A8",
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const wine = await getWine((await params).slug);
  if (!wine) return ogImage({ kicker: "Nos vins", title: "Domaine de Long-Pech" });
  return ogImage({
    kicker: [ui.types[wine.type], wine.appellation].filter(Boolean).join(" · "),
    title: wine.name,
    color: COLORS[wine.type],
  });
}
