import { defineField, defineType } from "sanity";

/**
 * Schémas Sanity, alignés champ pour champ sur src/lib/content/schemas.ts (Zod).
 * Toute modification doit être faite des deux côtés.
 */
const TYPES = ["rouge", "rose", "blanc", "doux", "effervescent"];
const req = (rule: { required: () => unknown }) => rule.required();

export const wine = defineType({
  name: "wine",
  title: "Cuvée",
  type: "document",
  groups: [
    { name: "fiche", title: "Fiche", default: true },
    { name: "degustation", title: "Dégustation" },
    { name: "commerce", title: "Boutique (V2)" },
  ],
  fields: [
    defineField({ name: "name", title: "Nom", type: "string", validation: req, group: "fiche" }),
    defineField({
      name: "slug",
      title: "Adresse de la page",
      type: "slug",
      options: { source: "name" },
      validation: req,
      group: "fiche",
    }),
    defineField({
      name: "range",
      title: "Gamme",
      type: "string",
      options: { list: ["signatures", "cuvees", "bulles", "envol"] },
      validation: req,
      group: "fiche",
    }),
    defineField({
      name: "type",
      title: "Type de vin",
      type: "string",
      options: { list: TYPES, layout: "radio" },
      validation: req,
      group: "fiche",
    }),
    defineField({
      name: "appellation",
      title: "Appellation",
      type: "string",
      options: { list: ["AOP Gaillac", "IGP Côtes du Tarn"] },
      group: "fiche",
    }),
    defineField({ name: "vintage", title: "Millésime", type: "number", group: "fiche" }),
    defineField({
      name: "sweetness",
      title: "Sucrosité",
      type: "string",
      options: { list: ["brut", "sec", "demi-sec", "doux"] },
      group: "fiche",
    }),
    defineField({
      name: "grapes",
      title: "Cépages",
      type: "array",
      group: "fiche",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Cépage", type: "string" },
            { name: "percent", title: "Pourcentage", type: "number" },
          ],
        },
      ],
    }),
    defineField({ name: "abv", title: "Degré d'alcool (% vol.)", type: "number", group: "fiche" }),
    defineField({
      name: "volumeMl",
      title: "Contenance (ml)",
      type: "number",
      initialValue: 750,
      group: "fiche",
    }),
    defineField({
      name: "featured",
      title: "Mise en avant sur l'accueil",
      type: "boolean",
      initialValue: false,
      group: "fiche",
    }),
    defineField({
      name: "story",
      title: "Présentation courte",
      description: "Factuelle : origine, cépages, élaboration. Voir la loi Évin dans le README.",
      type: "text",
      rows: 3,
      group: "fiche",
    }),
    defineField({ name: "vinification", title: "Vinification", type: "text", rows: 4, group: "degustation" }),
    defineField({ name: "ageing", title: "Élevage", type: "string", group: "degustation" }),
    defineField({
      name: "servingTemp",
      title: "Température de service",
      type: "string",
      group: "degustation",
    }),
    defineField({ name: "cellaring", title: "Potentiel de garde", type: "string", group: "degustation" }),
    defineField({
      name: "tastingNotes",
      title: "Notes de dégustation",
      type: "object",
      group: "degustation",
      fields: [
        { name: "eye", title: "Œil", type: "string" },
        { name: "nose", title: "Nez", type: "string" },
        { name: "palate", title: "Bouche", type: "string" },
      ],
    }),
    defineField({
      name: "pairings",
      title: "Accords mets et vins",
      type: "array",
      of: [{ type: "string" }],
      group: "degustation",
    }),
    defineField({
      name: "awards",
      title: "Distinctions",
      type: "array",
      group: "degustation",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Distinction", type: "string" },
            { name: "year", title: "Année", type: "number" },
            { name: "source", title: "Source (concours, guide, lien)", type: "string" },
            {
              name: "verified",
              title: "Vérifiée : afficher sur le site",
              type: "boolean",
              initialValue: false,
            },
          ],
        },
      ],
    }),
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", title: "Texte alternatif", type: "string" }],
        },
      ],
      group: "fiche",
    }),
    defineField({
      name: "techSheetPdf",
      title: "Fiche technique (PDF)",
      type: "file",
      options: { accept: "application/pdf" },
      group: "fiche",
    }),
    defineField({ name: "sku", title: "Référence (SKU)", type: "string", group: "commerce" }),
    defineField({ name: "price", title: "Prix TTC (€)", type: "number", group: "commerce" }),
    defineField({ name: "stock", title: "Stock", type: "number", group: "commerce" }),
    defineField({ name: "purchasable", title: "En vente en ligne", type: "boolean", group: "commerce" }),
  ],
});

export const event = defineType({
  name: "event",
  title: "Événement",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string", validation: req }),
    defineField({
      name: "slug",
      title: "Adresse",
      type: "slug",
      options: { source: "title" },
      validation: req,
    }),
    defineField({ name: "kind", title: "Type", type: "string", initialValue: "Au domaine" }),
    defineField({
      name: "summary",
      title: "Description",
      description: "Informative : lieu, programme. Pas d'incitation à boire.",
      type: "text",
      rows: 3,
    }),
    defineField({ name: "start", title: "Début", type: "datetime" }),
    defineField({ name: "end", title: "Fin", type: "datetime" }),
    defineField({ name: "dateNote", title: "Si la date n'est pas fixée", type: "string" }),
    defineField({ name: "details", title: "Infos pratiques", type: "string" }),
  ],
});

export const offer = defineType({
  name: "offer",
  title: "Offre de visite",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string", validation: req }),
    defineField({
      name: "slug",
      title: "Adresse",
      type: "slug",
      options: { source: "title" },
      validation: req,
    }),
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      options: { list: ["individuel", "pass", "groupe"] },
    }),
    defineField({ name: "summary", title: "Résumé", type: "string" }),
    defineField({ name: "includes", title: "Ce qui est compris", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "groupSize", title: "Pour qui", type: "string" }),
    defineField({ name: "duration", title: "Durée", type: "string" }),
    defineField({ name: "price", title: "Tarif", type: "string" }),
    defineField({ name: "booking", title: "Réservation", type: "string" }),
  ],
});

const slot = {
  type: "object",
  fields: [
    { name: "open", title: "Ouverture (HH:MM)", type: "string" },
    { name: "close", title: "Fermeture (HH:MM)", type: "string" },
  ],
};

export const settings = defineType({
  name: "settings",
  title: "Réglages (horaires, contacts, réseaux)",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nom du domaine", type: "string" }),
    defineField({ name: "shortName", title: "Nom court", type: "string" }),
    defineField({ name: "owners", title: "Vigneronne", type: "string" }),
    defineField({ name: "tagline", title: "Promesse", type: "string" }),
    defineField({ name: "description", title: "Description (moteurs de recherche)", type: "text", rows: 2 }),
    defineField({
      name: "address",
      title: "Adresse",
      type: "object",
      fields: ["street", "postalCode", "city", "region", "country"].map((name) => ({ name, type: "string" })),
    }),
    defineField({
      name: "geo",
      title: "Coordonnées GPS",
      type: "object",
      fields: [
        { name: "lat", type: "number" },
        { name: "lng", type: "number" },
      ],
    }),
    defineField({
      name: "phones",
      title: "Téléphones",
      type: "array",
      of: [{ type: "object", fields: ["label", "display", "tel"].map((name) => ({ name, type: "string" })) }],
    }),
    defineField({ name: "email", title: "E-mail", type: "string" }),
    defineField({
      name: "hours",
      title: "Horaires",
      description: "Une liste de créneaux par jour. Liste vide : fermé. Clés 0 (dimanche) à 6 (samedi).",
      type: "object",
      fields: ["0", "1", "2", "3", "4", "5", "6"].map((day, i) => ({
        name: day,
        title: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"][i],
        type: "array",
        of: [slot],
      })),
    }),
    defineField({ name: "hoursNote", title: "Note sur les horaires", type: "string" }),
    defineField({
      name: "socials",
      title: "Réseaux sociaux",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string" },
            { name: "url", type: "url" },
          ],
        },
      ],
    }),
    defineField({
      name: "legal",
      title: "Mentions légales",
      type: "object",
      fields: ["publisher", "publicationDirector", "host"].map((name) => ({ name, type: "string" })),
    }),
  ],
});

/** Textes des pages. Préparé pour la V1.1 : le site lit encore content/fr/pages.json. */
export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Identifiant (home, domaine, vins…)",
      type: "string",
      validation: req,
    }),
    defineField({ name: "title", title: "Titre", type: "string" }),
    defineField({ name: "metaTitle", title: "Titre pour les moteurs", type: "string" }),
    defineField({ name: "metaDescription", title: "Description pour les moteurs", type: "text", rows: 2 }),
    defineField({ name: "intro", title: "Chapô", type: "text", rows: 3 }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string" },
            { name: "body", type: "text" },
          ],
        },
      ],
    }),
  ],
});

export const schemaTypes = [wine, event, offer, page, settings];
