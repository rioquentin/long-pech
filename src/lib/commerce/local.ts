import { getWines, type Wine } from "../content";
import type { Cart, CommerceProvider, Product } from "./types";

const toProduct = (wine: Wine): Product => ({
  slug: wine.slug,
  sku: wine.sku,
  name: wine.name,
  price: wine.price === null ? null : { amount: wine.price, currency: "EUR" },
  stock: wine.stock,
  purchasable: Boolean(wine.purchasable && wine.price !== null && wine.sku),
});

const unsupported = (): never => {
  throw new Error("Panier indisponible avec LocalProvider. Brancher ShopifyProvider (docs/ECOMMERCE_V2.md).");
};

/** V1 : catalogue en lecture seule, pas de panier ni de paiement. */
export const localProvider: CommerceProvider = {
  listProducts: async () => (await getWines()).map(toProduct),
  getProduct: async (slug) => {
    const wine = (await getWines()).find((w) => w.slug === slug);
    return wine ? toProduct(wine) : null;
  },
  cart: {
    create: async (): Promise<Cart> => unsupported(),
    get: async () => null,
    add: async () => unsupported(),
    update: async () => unsupported(),
    remove: async () => unsupported(),
  },
  checkoutUrl: async () => null,
};
