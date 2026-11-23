/**
 * Contrat de la boutique. Les composants ne connaissent que cette interface.
 * V1 : LocalProvider (lecture seule, depuis le contenu). V2 : ShopifyProvider (Storefront API).
 */
export type Money = { amount: number; currency: "EUR" };

export type Product = {
  slug: string;
  sku: string | null;
  name: string;
  price: Money | null;
  stock: number | null;
  purchasable: boolean;
};

export type CartLine = { sku: string; quantity: number };
export type Cart = { id: string; lines: CartLine[]; total: Money | null };

export interface CommerceProvider {
  listProducts(): Promise<Product[]>;
  getProduct(slug: string): Promise<Product | null>;
  cart: {
    create(): Promise<Cart>;
    get(id: string): Promise<Cart | null>;
    add(id: string, line: CartLine): Promise<Cart>;
    update(id: string, line: CartLine): Promise<Cart>;
    remove(id: string, sku: string): Promise<Cart>;
  };
  /** URL de paiement hébergée par la plateforme, ou null si le paiement n'existe pas. */
  checkoutUrl(cartId: string): Promise<string | null>;
}
