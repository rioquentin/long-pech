/**
 * Remplace actions.ts dans l'export statique (GitHub Pages) : aucun serveur ne peut envoyer d'e-mail.
 * Les formulaires s'affichent, et répondent qu'ils sont désactivés sur la version de démonstration.
 */
export type FormState = {
  status: "idle" | "success" | "error";
  errors: Record<string, string>;
  values: Record<string, string>;
};

const demo = async (_prev: FormState, data: FormData): Promise<FormState> => ({
  status: "error",
  errors: { demo: "demo" },
  values: Object.fromEntries([...data.entries()].map(([k, v]) => [k, typeof v === "string" ? v : ""])),
});

export const bookingAction = demo;
export const contactAction = demo;
export const newsletterAction = demo;
