"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { getOffers } from "@/lib/content";
import { sendMail, subscribe } from "@/lib/mail";

export type FormState = {
  status: "idle" | "success" | "error";
  /** champ -> clé d'erreur (ui.form.errors), ou "send" si l'envoi a échoué */
  errors: Record<string, string>;
  values: Record<string, string>;
};

const read = (data: FormData) =>
  Object.fromEntries([...data.entries()].map(([k, v]) => [k, typeof v === "string" ? v.trim() : ""]));

/** Pot de miel : un robot remplit le champ caché. On répond « succès » sans rien envoyer. */
const isBot = (values: Record<string, string>) => Boolean(values.lp_ref);

/**
 * Limite de débit par adresse IP : 5 envois par quart d'heure, tous formulaires confondus.
 * Tenue en mémoire, donc par instance du serveur : un frein contre l'inondation, pas une garantie.
 */
const WINDOW = 15 * 60_000;
const MAX_SENDS = 5;
const sends = new Map<string, number[]>();

async function tooMany(): Promise<boolean> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip");
  // Sans adresse (hébergeur qui ne la transmet pas), on ne bloque personne plutôt que tout le monde.
  if (!ip) return false;
  const now = Date.now();
  const recent = (sends.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (recent.length >= MAX_SENDS) {
    sends.set(ip, recent);
    return true;
  }
  sends.set(ip, [...recent, now]);
  if (sends.size > 5000) {
    for (const [key, times] of sends) if (times.every((t) => now - t >= WINDOW)) sends.delete(key);
  }
  return false;
}

const limited = (values: Record<string, string>): FormState => ({
  status: "error",
  errors: { rate: "rate" },
  values,
});

/** Une ligne, sans saut : pour l'objet d'un e-mail. */
const oneLine = (text: string) => text.replace(/\s+/g, " ");

const fail = (error: z.ZodError, values: Record<string, string>): FormState => ({
  status: "error",
  errors: Object.fromEntries(error.issues.map((issue) => [String(issue.path[0]), String(issue.path[0])])),
  values,
});

/** Date du jour à Paris, au format AAAA-MM-JJ. */
const today = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Paris" }).format(new Date());

const contact = z.object({
  name: z.string().min(2).max(120),
  email: z.email().max(200),
  message: z.string().min(5).max(4000),
});

export async function bookingAction(_prev: FormState, data: FormData): Promise<FormState> {
  const values = read(data);
  if (isBot(values)) return { status: "success", errors: {}, values: {} };
  const slugs = (await getOffers()).map((o) => o.slug);
  const schema = z.object({
    name: z.string().min(2).max(120),
    email: z.email().max(200),
    phone: z.string().max(30),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .refine((d) => !Number.isNaN(Date.parse(d)) && d >= today()),
    people: z.coerce.number().int().min(1).max(20),
    offer: z.string().refine((o) => slugs.includes(o)),
    message: z.string().max(4000),
  });
  const parsed = schema.safeParse({ phone: "", message: "", ...values });
  if (!parsed.success) return fail(parsed.error, values);
  if (await tooMany()) return limited(values);
  const b = parsed.data;
  const sent = await sendMail({
    subject: `Demande de visite : ${b.offer}, ${b.date}, ${b.people} pers.`,
    replyTo: b.email,
    text: [
      `Nom : ${b.name}`,
      `E-mail : ${b.email}`,
      `Téléphone : ${b.phone || "non indiqué"}`,
      `Formule : ${b.offer}`,
      `Date souhaitée : ${b.date}`,
      `Personnes : ${b.people}`,
      "",
      b.message,
    ].join("\n"),
  });
  return sent
    ? { status: "success", errors: {}, values: {} }
    : { status: "error", errors: { send: "send" }, values };
}

export async function contactAction(_prev: FormState, data: FormData): Promise<FormState> {
  const values = read(data);
  if (isBot(values)) return { status: "success", errors: {}, values: {} };
  const parsed = contact.safeParse(values);
  if (!parsed.success) return fail(parsed.error, values);
  if (await tooMany()) return limited(values);
  const c = parsed.data;
  const sent = await sendMail({
    subject: `Message du site : ${oneLine(c.name)}`,
    replyTo: c.email,
    text: `Nom : ${c.name}\nE-mail : ${c.email}\n\n${c.message}`,
  });
  return sent
    ? { status: "success", errors: {}, values: {} }
    : { status: "error", errors: { send: "send" }, values };
}

export async function newsletterAction(_prev: FormState, data: FormData): Promise<FormState> {
  const values = read(data);
  if (isBot(values)) return { status: "success", errors: {}, values: {} };
  const parsed = z.object({ email: z.email().max(200) }).safeParse(values);
  if (!parsed.success) return fail(parsed.error, values);
  if (await tooMany()) return limited(values);
  const ok = await subscribe(parsed.data.email);
  return ok
    ? { status: "success", errors: {}, values: {} }
    : { status: "error", errors: { send: "send" }, values };
}
