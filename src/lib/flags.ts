/** Boutique en ligne (V2). Désactivé : aucun prix, panier ni paiement n'est rendu. */
export const commerceEnabled = process.env.NEXT_PUBLIC_COMMERCE_ENABLED === "true";

const todos = process.env.NEXT_PUBLIC_SHOW_TODOS;
/**
 * Affiche les {{TODO_CLIENT}} et les briefs photo en clair.
 * Sans réglage : visibles en développement, masqués en production, pour qu'un oubli ne publie rien.
 * NEXT_PUBLIC_SHOW_TODOS=true les force (version de démonstration), =false les masque partout.
 */
export const showTodos = todos ? todos === "true" : process.env.NODE_ENV !== "production";
