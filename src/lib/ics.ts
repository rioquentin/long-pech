import type { Settings, WineEvent } from "./content/schemas";

const stamp = (iso: string) =>
  new Date(iso)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
const esc = (text: string) =>
  text
    .replace(/\\/g, "\\\\")
    .replace(/([,;])/g, "\\$1")
    .replace(/\n/g, "\\n");

/** Fichier iCalendar (RFC 5545) pour un événement daté. Renvoie null si la date manque. */
export function buildIcs(event: WineEvent, settings: Settings, siteUrl: string): string | null {
  if (!event.start) return null;
  const end = event.end ?? new Date(new Date(event.start).getTime() + 2 * 3600_000).toISOString();
  const { street, postalCode, city } = settings.address;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Domaine de Long-Pech//Agenda//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.slug}@long-pech`,
    `DTSTAMP:${stamp(event.start)}`,
    `DTSTART:${stamp(event.start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(`${event.title} · ${settings.name}`)}`,
    `DESCRIPTION:${esc(event.summary)}`,
    `LOCATION:${esc(`${settings.name}, ${street}, ${postalCode} ${city}`)}`,
    `URL:${siteUrl}/evenements`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
