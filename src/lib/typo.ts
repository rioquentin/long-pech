const NBSP = " ";

/** Espaces insécables de la typographie française : avant « : ; ! ? » et à l'intérieur des guillemets. */
const fix = (text: string) => text.replace(/ ([:;!?»])/g, `${NBSP}$1`).replace(/« /g, `«${NBSP}`);

/**
 * Applique `fix` à toutes les chaînes d'un contenu (objets et tableaux compris), sans toucher aux clés.
 * Évite qu'un deux-points ou un guillemet se retrouve seul en début de ligne.
 */
export function typo<T>(value: T): T {
  if (typeof value === "string") return fix(value) as T;
  if (Array.isArray(value)) return value.map(typo) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, v]) => [key, typo(v)])) as T;
  }
  return value;
}
