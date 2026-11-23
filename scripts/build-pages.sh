#!/bin/sh
# Export statique pour GitHub Pages (version de démonstration). Sortie dans ./out
#
# Certaines routes ont besoin d'un serveur, ou d'un réglage (`dynamic = "force-static"`) que
# Cache Components interdit. On les écarte le temps du build, puis on les remet en place :
#   - proxy (404 des cuvées inconnues), sitemap, robots, images Open Graph, fichiers .ics
set -e
OFF=.pages-off
restore() {
  [ -e "$OFF/proxy.ts" ] && mv "$OFF/proxy.ts" src/proxy.ts
  [ -e "$OFF/robots.ts" ] && mv "$OFF/robots.ts" src/app/robots.ts
  [ -e "$OFF/sitemap.ts" ] && mv "$OFF/sitemap.ts" src/app/sitemap.ts
  [ -e "$OFF/opengraph-image.tsx" ] && mv "$OFF/opengraph-image.tsx" src/app/opengraph-image.tsx
  [ -e "$OFF/vins/opengraph-image.tsx" ] && mv "$OFF/vins/opengraph-image.tsx" "src/app/vins/[slug]/opengraph-image.tsx"
  [ -e "$OFF/evenements/[slug]" ] && mv "$OFF/evenements/[slug]" "src/app/evenements/[slug]"
  rm -rf "$OFF"
}
# Un build interrompu brutalement a pu laisser des sources de côté : on les remet avant tout.
if [ -d "$OFF" ]; then restore; fi
mkdir -p "$OFF/vins" "$OFF/evenements"
trap restore EXIT
mv src/proxy.ts "$OFF/proxy.ts"
mv src/app/robots.ts "$OFF/robots.ts"
mv src/app/sitemap.ts "$OFF/sitemap.ts"
mv src/app/opengraph-image.tsx "$OFF/opengraph-image.tsx"
mv "src/app/vins/[slug]/opengraph-image.tsx" "$OFF/vins/opengraph-image.tsx"
mv "src/app/evenements/[slug]" "$OFF/evenements/[slug]"

# Les types de routes générés par un `next dev` précédent pointent vers les routes écartées.
rm -rf .next/dev/types .next/types

# La démonstration montre au domaine ce qui reste à fournir : les {{TODO_CLIENT}} restent visibles.
GITHUB_PAGES=true NEXT_PUBLIC_NOINDEX=true NEXT_PUBLIC_SHOW_TODOS="${NEXT_PUBLIC_SHOW_TODOS:-true}" npx next build

# Démonstration : on demande aux moteurs de ne rien indexer.
printf 'User-agent: *\nDisallow: /\n' > out/robots.txt
touch out/.nojekyll
