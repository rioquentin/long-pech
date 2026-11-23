import { localProvider } from "./local";
import { shopifyProvider } from "./shopify";
import type { CommerceProvider } from "./types";

export type { CommerceProvider, Product, Cart, CartLine, Money } from "./types";

export const commerce: CommerceProvider =
  process.env.COMMERCE_PROVIDER === "shopify" ? shopifyProvider : localProvider;
