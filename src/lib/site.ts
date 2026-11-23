export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const defaultLocale = "fr";
/** i18n prête : ajouter "en" ici et un dossier content/en. Aucune traduction en V1. */
export const locales = ["fr"] as const;

export const TODO_RE = /\{\{TODO_CLIENT:\s*([^}]+)\}\}/g;
/** Retire les marqueurs TODO d'un texte destiné aux métadonnées ou au JSON-LD. */
export const stripTodos = (text: string) => text.replace(TODO_RE, "").replace(/\s+/g, " ").trim();
export const hasTodo = (text: string) => text.includes("{{TODO_CLIENT");

export function directionsUrl(address: string, from?: string) {
  const params = new URLSearchParams({ api: "1", destination: address });
  if (from) params.set("origin", from);
  return `https://www.google.com/maps/dir/?${params}`;
}

/** Clé de stockage local de la vérification d'âge. La valeur est la date de la réponse (ms). */
export const AGE_KEY = "lp-age";
/** La réponse est redemandée au bout de 30 jours. */
export const AGE_TTL = 30 * 24 * 3600_000;
/** Vrai si la valeur stockée est une réponse de moins de 30 jours. Repris tel quel dans le script en ligne du layout. */
export const ageValid = (stored: string | null, now = Date.now()) => {
  const at = Number(stored);
  return Number.isFinite(at) && at > 0 && now - at < AGE_TTL;
};

/** Préfixe de chemin quand le site est servi dans un sous-dossier (GitHub Pages). Vide sinon. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
/** Adresse d'un fichier de /public. next/link gère le préfixe seul, pas les images ni les liens bruts. */
export const asset = (path: string) => `${basePath}${path}`;
/** Export statique (GitHub Pages) : pas de route serveur, donc pas de fichier .ics. */
export const staticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
/** Version de démonstration : demande aux moteurs de ne pas indexer. */
export const noindex = process.env.NEXT_PUBLIC_NOINDEX === "true";
