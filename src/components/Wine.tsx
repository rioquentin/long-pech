import Image from "next/image";
import Link from "next/link";
import { ui, type Wine, type WineType } from "@/lib/content";
import { commerceEnabled } from "@/lib/flags";
import { asset } from "@/lib/site";
import { typeColor } from "@/lib/wine-types";
import { T } from "./T";

/** Pastille de couleur + libellé du type de vin. */
export function WineBadge({ type }: { type: WineType }) {
  return (
    <span className="badge" style={{ "--c": typeColor[type] } as React.CSSProperties}>
      {ui.types[type]}
    </span>
  );
}

/** Bouteille dessinée, à la couleur du type. Remplacée par wine.images[0] quand la photo existe. */
export function Bottle({ type, className }: { type: WineType; className?: string }) {
  const c = typeColor[type];
  return (
    <svg viewBox="0 0 60 220" className={className} aria-hidden="true">
      <path
        d="M24 4h12v44c0 12 12 18 12 40v120a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V88c0-22 12-28 12-40z"
        fill="#1F1A17"
      />
      <rect x="23" y="4" width="14" height="30" fill={c} />
      <rect x="15" y="118" width="30" height="52" fill="#FBF8F1" />
      <rect x="15" y="118" width="30" height="5" fill={c} />
    </svg>
  );
}

/**
 * Photo de la bouteille si elle existe, sinon bouteille dessinée.
 * Les photos de l'ancien site sont sur fond blanc : le mode « multiply » le fond dans la carte.
 */
export function WineVisual({ wine, priority = false }: { wine: Wine; priority?: boolean }) {
  const image = wine.images[0];
  if (!image) return <Bottle type={wine.type} />;
  return (
    <Image
      src={asset(image.src)}
      alt={image.alt}
      width={400}
      height={600}
      priority={priority}
      className="mix-blend-multiply"
    />
  );
}

export const formatPrice = (amount: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);

/** Disponibilité : « Disponible au domaine » en V1, prix TTC quand le commerce est activé. */
export function Availability({ wine }: { wine: Wine }) {
  if (commerceEnabled && wine.purchasable && wine.price !== null) {
    return (
      <p className="dispo">
        {formatPrice(wine.price)} {ui.wine.priceTtc}
      </p>
    );
  }
  return <p className="dispo">{ui.wine.atDomain}</p>;
}

export function wineSubtitle(wine: Wine) {
  return [
    wine.appellation,
    wine.sweetness && wine.type !== "doux" ? ui.sweetness[wine.sweetness] : null,
    wine.grapes.map((g) => g.name).join(", "),
  ]
    .filter(Boolean)
    .join(" · ");
}

export function WineCard({ wine, stagger = false }: { wine: Wine; stagger?: boolean }) {
  return (
    <li
      className={`carte ap ${stagger ? "sm:even:mt-12" : ""}`}
      style={{ "--c": typeColor[wine.type] } as React.CSSProperties}
      data-testid="wine-card"
    >
      <div className="carte-vis">
        <WineVisual wine={wine} />
      </div>
      <div className="grid gap-2 px-3 pt-4 pb-5 sm:px-[18px]">
        <WineBadge type={wine.type} />
        <h3 className="text-[1.25rem] sm:text-[1.5rem]">
          <Link href={`/vins/${wine.slug}`}>{wine.name}</Link>
        </h3>
        <p className="text-encre-2 text-[0.92rem]">
          <T>{wineSubtitle(wine)}</T>
        </p>
        <Availability wine={wine} />
      </div>
    </li>
  );
}
