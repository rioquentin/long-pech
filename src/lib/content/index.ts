import { z } from "zod";
import eventsJson from "../../../content/fr/events.json";
import grapesJson from "../../../content/fr/grapes.json";
import offersJson from "../../../content/fr/offers.json";
import settingsJson from "../../../content/fr/settings.json";
import winesJson from "../../../content/fr/wines.json";
import pagesJson from "../../../content/fr/pages.json";
import photosJson from "../../../content/fr/photos.json";
import uiJson from "../../../content/fr/ui.json";
import { currentTime, sanityEnabled, sanityQuery } from "@/lib/content/cached";
import { showTodos } from "@/lib/flags";
import { stripTodos } from "@/lib/site";
import { typo } from "@/lib/typo";
import { eventSchema, grapeSchema, offerSchema, settingsSchema, wineSchema } from "./schemas";

export * from "./schemas";

// Textes des pages et libellés d'interface : JSON typé par inférence.
// Tout le contenu passe par typo() : espaces insécables de la typographie française.
export const ui = typo(uiJson);
export const pages = typo(pagesJson);
export const photos = typo(photosJson);

/** Lit Sanity si configuré, sinon le JSON local. Les deux passent par le même schéma Zod. */
async function load<T extends z.ZodType>(schema: T, local: unknown, groq: string): Promise<z.infer<T>> {
  const raw = sanityEnabled ? await sanityQuery(groq) : local;
  return typo(schema.parse(raw));
}

export const getWines = () => load(z.array(wineSchema), winesJson, `*[_type=="wine"]|order(orderRank)`);
export const getEvents = () => load(z.array(eventSchema), eventsJson, `*[_type=="event"]|order(start)`);
export const getOffers = () => load(z.array(offerSchema), offersJson, `*[_type=="offer"]|order(orderRank)`);
export const getGrapes = () => load(z.array(grapeSchema), grapesJson, `*[_type=="grape"]|order(orderRank)`);
export const getSettings = () => load(settingsSchema, settingsJson, `*[_type=="settings"][0]`);

export async function getWine(slug: string) {
  return (await getWines()).find((w) => w.slug === slug) ?? null;
}

/**
 * Événements à venir (ou sans date fixée). Recalculé toutes les heures.
 * Quand les {{TODO_CLIENT}} sont masqués, un événement sans date ni mention de date n'a rien à annoncer : il est écarté.
 */
export async function getUpcomingEvents() {
  const now = await currentTime();
  return (await getEvents())
    .filter((e) => showTodos || e.start || stripTodos(e.dateNote ?? "") !== "")
    .filter((e) => !e.start || new Date(e.end ?? e.start).getTime() >= now)
    .sort((a, b) => (a.start ?? "9999").localeCompare(b.start ?? "9999"));
}
