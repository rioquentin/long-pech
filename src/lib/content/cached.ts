import { cacheLife } from "next/cache";

/**
 * Les deux seuls accès « à l'exécution » du site, mis en cache une heure par Cache Components.
 * L'export statique (GitHub Pages) remplace ce module par cached.static.ts : voir next.config.ts.
 *
 * Source Sanity, sans dépendance : on interroge l'API HTTP en GROQ. Active seulement si
 * SANITY_PROJECT_ID est défini, sinon le site lit content/fr/*.json.
 * Non testée contre un vrai projet : voir README, « Brancher Sanity ».
 */
const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? "production";

export const sanityEnabled = Boolean(projectId);

export async function sanityQuery(groq: string): Promise<unknown> {
  "use cache";
  cacheLife("hours");
  const url = `https://${projectId}.apicdn.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(groq)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity ${res.status}`);
  const json = (await res.json()) as { result: unknown };
  return json.result;
}

/** Heure courante, rafraîchie toutes les heures : sert à masquer les événements passés. */
export async function currentTime(): Promise<number> {
  "use cache";
  cacheLife("hours");
  return Date.now();
}
