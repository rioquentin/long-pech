import type { Settings } from "./content/schemas";

type Hours = NonNullable<Settings["hours"]>;

/** Jour (0 = dimanche) et minutes depuis minuit, à l'heure de Paris. */
export function parisNow(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: (Number(get("hour")) % 24) * 60 + Number(get("minute")) };
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
};

export function openStatus(
  hours: Hours,
  date: Date,
): { open: boolean; until: string | null; next: string | null } {
  const { day, minutes } = parisNow(date);
  const slots = hours[String(day)] ?? [];
  const current = slots.find((s) => minutes >= toMinutes(s.open) && minutes < toMinutes(s.close));
  if (current) return { open: true, until: current.close, next: null };
  const later = slots.find((s) => minutes < toMinutes(s.open));
  return { open: false, until: null, next: later?.open ?? null };
}
