import type { NextConfig } from "next";

/**
 * GITHUB_PAGES=true : export statique pour GitHub Pages (version de démonstration).
 * Sans serveur, pas d'actions serveur (formulaires désactivés), pas de proxy, pas d'optimisation d'images.
 * Voir README, « Déploiement ».
 */
const pages = process.env.GITHUB_PAGES === "true";
const basePath = pages ? (process.env.PAGES_BASE_PATH ?? "") : "";

const nextConfig: NextConfig = {
  // Cache Components repose sur le prérendu partiel, incompatible avec l'export statique.
  cacheComponents: !pages,
  partialPrefetching: !pages,
  env: { NEXT_PUBLIC_BASE_PATH: basePath, NEXT_PUBLIC_STATIC_EXPORT: pages ? "true" : "false" },
  ...(pages ? { output: "export", basePath, trailingSlash: true, images: { unoptimized: true } } : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
    // En export statique, les actions serveur sont remplacées par un module inerte.
    // et les deux fonctions mises en cache par une version figée au build.
    ...(pages
      ? {
          resolveAlias: {
            "@/app/actions": "./src/app/actions.static.ts",
            "@/lib/content/cached": "./src/lib/content/cached.static.ts",
          },
        }
      : {}),
  },
};

export default nextConfig;
