/** Version sans cache de cached.ts, pour l'export statique : tout est figé au moment du build. */
const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? "production";

export const sanityEnabled = Boolean(projectId);

export async function sanityQuery(groq: string): Promise<unknown> {
  const url = `https://${projectId}.apicdn.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(groq)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity ${res.status}`);
  return ((await res.json()) as { result: unknown }).result;
}

export async function currentTime(): Promise<number> {
  return Date.now();
}
