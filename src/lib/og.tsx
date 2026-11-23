import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** Image Open Graph aux couleurs du site. Police par défaut : satori ne lit pas le woff2. */
export function ogImage({
  kicker,
  title,
  color = "#A3432C",
}: {
  kicker: string;
  title: string;
  color?: string;
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#F3EEE3",
        color: "#1D2A3A",
        padding: 72,
        borderTop: `24px solid ${color}`,
      }}
    >
      <div style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase" }}>{kicker}</div>
      <div style={{ fontSize: title.length > 40 ? 68 : 92, lineHeight: 1.05, maxWidth: 980 }}>{title}</div>
      <div style={{ fontSize: 30, color: "#4A5566" }}>Domaine de Long-Pech · Lisle-sur-Tarn · Gaillac</div>
    </div>,
    ogSize,
  );
}
