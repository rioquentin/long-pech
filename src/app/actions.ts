"use server";

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
const isBot = (values: Record<string, string>) => Boolean(values.website);

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
      .refine((d) => d >= today()),
    people: z.coerce.number().int().min(1).max(20),
    offer: z.string().refine((o) => slugs.includes(o)),
    message: z.string().max(4000),
  });
  const parsed = schema.safeParse({ phone: "", message: "", ...values });
  if (!parsed.success) return fail(parsed.error, values);
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
  const c = parsed.data;
  const sent = await sendMail({
    subject: `Message du site : ${c.name}`,
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
  const ok = await subscribe(parsed.data.email);
  return ok
    ? { status: "success", errors: {}, values: {} }
    : { status: "error", errors: { send: "send" }, values };
}
