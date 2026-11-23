import { z } from "zod";

export const WINE_TYPES = ["rouge", "rose", "blanc", "doux", "effervescent"] as const;
export const SWEETNESS = ["brut", "sec", "demi-sec", "doux"] as const;
export const APPELLATIONS = ["AOP Gaillac", "IGP Côtes du Tarn"] as const;
export const RANGES = ["signatures", "cuvees", "bulles", "envol"] as const;

const nullable = <T extends z.ZodType>(schema: T) => schema.nullable().default(null);

export const wineSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  range: z.enum(RANGES),
  vintage: nullable(z.number().int()),
  type: z.enum(WINE_TYPES),
  appellation: nullable(z.enum(APPELLATIONS)),
  grapes: z.array(z.object({ name: z.string(), percent: nullable(z.number().min(0).max(100)) })),
  sweetness: nullable(z.enum(SWEETNESS)),
  abv: nullable(z.number()),
  /** Sucre résiduel, en g/l. */
  residualSugar: nullable(z.number()),
  /** Âge moyen des vignes, en années. */
  vineAge: nullable(z.number()),
  volumeMl: z.number().int().default(750),
  servingTemp: nullable(z.string()),
  story: nullable(z.string()),
  vinification: nullable(z.string()),
  ageing: nullable(z.string()),
  cellaring: nullable(z.string()),
  tastingNotes: nullable(
    z.object({ eye: nullable(z.string()), nose: nullable(z.string()), palate: nullable(z.string()) }),
  ),
  pairings: z.array(z.string()).default([]),
  awards: z
    .array(
      z.object({
        name: z.string(),
        year: nullable(z.number().int()),
        source: z.string(),
        /** Seules les distinctions vérifiées par le domaine sont affichées. */
        verified: z.boolean().default(false),
      }),
    )
    .default([]),
  images: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
  techSheetPdf: nullable(z.string()),
  featured: z.boolean().default(false),
  // Commerce (V2) : tout est nul tant que la boutique n'est pas branchée.
  sku: nullable(z.string()),
  price: nullable(z.number()),
  stock: nullable(z.number().int()),
  purchasable: nullable(z.boolean()),
});

export const eventSchema = z.object({
  slug: z.string(),
  title: z.string(),
  kind: z.string(),
  summary: z.string(),
  /** ISO 8601 avec fuseau, ex. 2027-06-18T19:00:00+02:00. */
  start: nullable(z.string()),
  end: nullable(z.string()),
  dateNote: nullable(z.string()),
  details: nullable(z.string()),
});

export const offerSchema = z.object({
  slug: z.string(),
  kind: z.enum(["individuel", "pass", "groupe"]),
  title: z.string(),
  summary: z.string(),
  includes: z.array(z.string()),
  groupSize: z.string(),
  duration: z.string(),
  price: z.string(),
  booking: z.string(),
});

const daySchema = z.array(z.object({ open: z.string(), close: z.string() }));

export const settingsSchema = z.object({
  name: z.string(),
  shortName: z.string(),
  owners: z.string(),
  tagline: z.string(),
  description: z.string(),
  address: z.object({
    street: z.string(),
    postalCode: z.string(),
    city: z.string(),
    region: z.string(),
    country: z.string(),
  }),
  geo: nullable(z.object({ lat: z.number(), lng: z.number() })),
  phones: z.array(z.object({ label: z.string(), display: z.string(), tel: z.string() })),
  email: nullable(z.string()),
  /** Clés 0 (dimanche) à 6 (samedi). Un tableau vide veut dire fermé. */
  hours: nullable(z.record(z.string(), daySchema)),
  hoursNote: nullable(z.string()),
  socials: z.array(z.object({ label: z.string(), url: z.string() })),
  legal: z.object({ publisher: z.string(), publicationDirector: z.string(), host: z.string() }),
});

export const grapeSchema = z.object({
  slug: z.string(),
  name: z.string(),
  color: z.enum(["rouge", "blanc", "mixte"]),
  native: z.boolean(),
  aka: z.string(),
  summary: z.string(),
  atDomain: z.array(z.string()),
});

export type Wine = z.infer<typeof wineSchema>;
export type WineType = (typeof WINE_TYPES)[number];
export type WineEvent = z.infer<typeof eventSchema>;
export type Offer = z.infer<typeof offerSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type Grape = z.infer<typeof grapeSchema>;
