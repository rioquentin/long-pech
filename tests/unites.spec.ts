import { expect, test } from "@playwright/test";
import { eventSchema, settingsSchema } from "../src/lib/content/schemas";
import { openStatus } from "../src/lib/hours";
import { buildIcs } from "../src/lib/ics";
import settingsJson from "../content/fr/settings.json";

const settings = settingsSchema.parse(settingsJson);

test("le fichier .ics est valide pour un événement daté, absent sinon", () => {
  const event = eventSchema.parse({
    slug: "test",
    title: "Apéro vigneron",
    kind: "Au domaine",
    summary: "Une soirée, sur la colline",
    start: "2099-06-18T19:00:00+02:00",
  });
  const ics = buildIcs(event, settings, "https://example.com");
  expect(ics).toContain("BEGIN:VEVENT");
  expect(ics).toContain("DTSTART:20990618T170000Z");
  expect(ics).toContain("DTEND:20990618T190000Z");
  expect(ics).toContain("SUMMARY:Apéro vigneron · Domaine de Long-Pech");
  expect(ics).toContain("DESCRIPTION:Une soirée\\, sur la colline");
  expect(buildIcs({ ...event, start: null }, settings, "https://example.com")).toBeNull();
});

test("ouvert ou fermé, à l'heure de Paris", () => {
  const hours = {
    "1": [
      { open: "09:00", close: "12:00" },
      { open: "14:00", close: "18:00" },
    ],
    "0": [],
  };
  // Lundi 15 juin 2026, 10 h 30 à Paris (08:30 UTC)
  expect(openStatus(hours, new Date("2026-06-15T08:30:00Z"))).toEqual({
    open: true,
    until: "12:00",
    next: null,
  });
  // Lundi 13 h à Paris : fermé, réouverture à 14 h
  expect(openStatus(hours, new Date("2026-06-15T11:00:00Z"))).toEqual({
    open: false,
    until: null,
    next: "14:00",
  });
  // Dimanche : fermé
  expect(openStatus(hours, new Date("2026-06-14T10:00:00Z")).open).toBe(false);
});
