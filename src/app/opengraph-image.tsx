import { getSettings } from "@/lib/content";
import { ogImage, ogSize } from "@/lib/og";

export const alt = "Domaine de Long-Pech, vins de Gaillac à Lisle-sur-Tarn";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  const settings = await getSettings();
  return ogImage({ kicker: "Vignoble de Gaillac", title: settings.tagline });
}
