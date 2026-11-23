import type { CommerceProvider } from "./types";

const todo = (): never => {
  throw new Error("ShopifyProvider n'est pas implémenté en V1. Voir docs/ECOMMERCE_V2.md.");
};

/**
 * V2 : Shopify Storefront API (headless). Squelette volontairement vide.
 * Correspondances prévues : listProducts -> products, cart.* -> cartCreate / cartLinesAdd /
 * cartLinesUpdate / cartLinesRemove, checkoutUrl -> cart.checkoutUrl. Le lien avec le contenu
 * se fait par wine.sku = variant.sku.
 */
export const shopifyProvider: CommerceProvider = {
  listProducts: todo,
  getProduct: todo,
  cart: { create: todo, get: todo, add: todo, update: todo, remove: todo },
  checkoutUrl: todo,
};
