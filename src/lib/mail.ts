/**
 * Envoi par Resend, via son API HTTP (pas de SDK).
 * Sans RESEND_API_KEY : le message est écrit dans la console en développement,
 * et l'envoi échoue en production pour ne jamais perdre une demande en silence.
 */
const key = process.env.RESEND_API_KEY;
const from = process.env.MAIL_FROM ?? "Site Long-Pech <onboarding@resend.dev>";
const to = process.env.MAIL_TO;

export async function sendMail(mail: { subject: string; text: string; replyTo?: string }): Promise<boolean> {
  if (!key || !to) {
    // MAIL_DRY_RUN=true : simulation forcée, pour les tests de bout en bout sur un build de production.
    if (process.env.NODE_ENV === "production" && process.env.MAIL_DRY_RUN !== "true") {
      console.error("[mail] RESEND_API_KEY ou MAIL_TO manquant : message non envoyé.");
      return false;
    }
    console.info(`[mail simulé] ${mail.subject}\n${mail.text}`);
    return true;
  }
  return post("https://api.resend.com/emails", {
    from,
    to,
    subject: mail.subject,
    text: mail.text,
    reply_to: mail.replyTo,
  });
}

/** Appel à Resend. Une panne réseau ou un délai dépassé renvoie false : le formulaire affiche l'erreur d'envoi. */
async function post(url: string, body: unknown): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error(`[mail] Resend ${res.status}`);
    return res.ok;
  } catch (error) {
    console.error("[mail] Resend injoignable", error);
    return false;
  }
}

/** Inscription à la lettre : audience Resend si configurée, sinon simple e-mail au domaine. */
export async function subscribe(email: string): Promise<boolean> {
  const audience = process.env.RESEND_AUDIENCE_ID;
  if (key && audience) {
    return post(`https://api.resend.com/audiences/${audience}/contacts`, { email, unsubscribed: false });
  }
  return sendMail({ subject: "Nouvelle inscription à la lettre", text: email, replyTo: email });
}
