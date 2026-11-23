"use client";

import { useEffect, useRef, useState } from "react";

/** Carte OpenStreetMap, chargée seulement au clic : aucune requête tierce avant. */
export function MapEmbed({
  geo,
  labels,
}: {
  geo: { lat: number; lng: number };
  labels: { load: string; notice: string; title: string };
}) {
  const [loaded, setLoaded] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  // Le bouton disparaît au clic : le focus passe à la carte.
  useEffect(() => {
    if (loaded) frame.current?.focus();
  }, [loaded]);
  const { lat, lng } = geo;
  const bbox = [lng - 0.03, lat - 0.018, lng + 0.03, lat + 0.018].join(",");
  if (!loaded) {
    return (
      <div className="bg-craie border-pierre grid aspect-[4/3] place-items-center border p-6 text-center">
        <div>
          <button type="button" className="btn" onClick={() => setLoaded(true)}>
            {labels.load}
          </button>
          <p className="legal mx-auto mt-4 max-w-[36ch]">{labels.notice}</p>
        </div>
      </div>
    );
  }
  return (
    <iframe
      ref={frame}
      title={labels.title}
      className="border-pierre aspect-[4/3] w-full border"
      loading="lazy"
      referrerPolicy="no-referrer"
      src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`}
    />
  );
}
