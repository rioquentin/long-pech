import { NextResponse, type NextRequest } from "next/server";
import wines from "../content/fr/wines.json";

/**
 * Vrai code 404 pour une cuvée inconnue.
 * Avec Cache Components, la page enverrait d'abord sa coquille en 200 (« soft 404 ») :
 * la doc Next.js recommande de vérifier le slug ici, avant le rendu.
 * Avec Sanity, les slugs ne sont pas connus ici : on laisse passer, la page répond
 * « introuvable » avec une balise noindex.
 */
const known = new Set(wines.map((wine) => wine.slug));

export const config = { matcher: "/vins/:slug" };

export function proxy(request: NextRequest) {
  if (process.env.SANITY_PROJECT_ID) return;
  const slug = request.nextUrl.pathname.split("/")[2];
  if (slug === "cepages" || known.has(slug)) return;
  return NextResponse.rewrite(new URL("/introuvable", request.url));
}
