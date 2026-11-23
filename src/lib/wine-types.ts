import type { WineType } from "./content/schemas";

/** Code couleur par type de vin, réutilisé partout : filtres, cartes, fiches, badges. */
export const typeColor: Record<WineType, string> = {
  rouge: "var(--color-t-rouge)",
  rose: "var(--color-t-rose)",
  blanc: "var(--color-t-blanc)",
  doux: "var(--color-t-doux)",
  effervescent: "var(--color-t-effervescent)",
};
