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

/** Clé de stockage local de la vérification d'âge. */
export const AGE_KEY = "lp-age";

/** Préfixe de chemin quand le site est servi dans un sous-dossier (GitHub Pages). Vide sinon. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
/** Adresse d'un fichier de /public. next/link gère le préfixe seul, pas les images ni les liens bruts. */
export const asset = (path: string) => `${basePath}${path}`;
/** Version de démonstration : demande aux moteurs de ne pas indexer. */
export const noindex = process.env.NEXT_PUBLIC_NOINDEX === "true";
