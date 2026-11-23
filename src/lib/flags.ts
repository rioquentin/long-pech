/** Boutique en ligne (V2). Désactivé : aucun prix, panier ni paiement n'est rendu. */
export const commerceEnabled = process.env.NEXT_PUBLIC_COMMERCE_ENABLED === "true";
/** Affiche les {{TODO_CLIENT}} en clair. À passer à false à la mise en ligne. */
export const showTodos = process.env.NEXT_PUBLIC_SHOW_TODOS !== "false";
