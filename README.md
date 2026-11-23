# Domaine de Long-Pech

Site vitrine du Domaine de Long-Pech (Lisle-sur-Tarn, vignoble de Gaillac). Next.js 16 (App Router), TypeScript strict, Tailwind CSS 4.

```bash
pnpm i
pnpm dev
```

Le site tourne sur http://localhost:3000. Aucune variable d'environnement n'est nécessaire en développement : le contenu vient des fichiers JSON et les e-mails sont simulés dans la console.

## Commandes

| Commande                       | Effet                                                                         |
| ------------------------------ | ----------------------------------------------------------------------------- |
| `pnpm dev`                     | Serveur de développement                                                      |
| `pnpm build` puis `pnpm start` | Version de production                                                         |
| `pnpm check`                   | ESLint, TypeScript et Prettier                                                |
| `pnpm test`                    | Tests Playwright (construit et lance le site sur le port 3100)                |
| `node scripts/captures.mjs`    | Captures mobile et desktop dans `docs/captures` (site lancé sur le port 3100) |

Première utilisation des tests : `pnpm exec playwright install chromium`.

## Où est le contenu

Aucun texte n'est écrit dans les composants. Tout est dans `content/fr/`.

| Fichier         | Contenu                                                             |
| --------------- | ------------------------------------------------------------------- |
| `wines.json`    | Les cuvées                                                          |
| `events.json`   | L'agenda                                                            |
| `offers.json`   | Les formules de visite                                              |
| `settings.json` | Adresse, téléphones, horaires, mentions légales                     |
| `grapes.json`   | La page « Les cépages de Gaillac »                                  |
| `pages.json`    | Les textes de chaque page et leurs métadonnées                      |
| `ui.json`       | Les libellés d'interface (boutons, formulaires, vérification d'âge) |
| `photos.json`   | Les emplacements photo, leur texte alternatif et leur brief         |

Un `{{TODO_CLIENT: …}}` dans un texte s'affiche comme une étiquette jaune. La liste complète des questions est dans `TODO_CLIENT.md`. Avant la mise en ligne, passer `NEXT_PUBLIC_SHOW_TODOS=false` : les étiquettes restantes sont alors masquées ou remplacées par « Information à venir ».

### Modifier une cuvée

Ouvrir `content/fr/wines.json` et modifier l'entrée. Les champs absents valent « non renseigné ». Exemple pour compléter Jean-Gabriel :

```json
"vintage": 2022,
"abv": 13.5,
"cellaring": "5 à 8 ans",
"grapes": [{ "name": "Braucol", "percent": 50 }, { "name": "Duras", "percent": 30 }]
```

- `type` (`rouge`, `rose`, `blanc`, `doux`, `effervescent`) fixe la couleur de la carte, de la fiche et du filtre.
- `featured: true` place la cuvée sur l'accueil (quatre au plus).
- Une distinction ne s'affiche que si `verified` vaut `true`.
- Pour ajouter une cuvée : copier une entrée et changer le `slug`. Il devient l'adresse de la fiche (`/vins/le-slug`).

Le fichier est validé au démarrage par le schéma Zod de `src/lib/content/schemas.ts`. Une faute de frappe sur un champ arrête le build avec un message clair.

### Modifier un événement

Dans `content/fr/events.json`. Dès que `start` contient une date, elle s'affiche et le lien « Ajouter au calendrier (.ics) » apparaît :

```json
"start": "2027-06-18T19:00:00+02:00",
"end": "2027-06-18T23:00:00+02:00",
"dateNote": null
```

Les événements passés disparaissent seuls de l'agenda, dans l'heure qui suit leur fin.

### Modifier les horaires

Dans `content/fr/settings.json`, remplacer `"hours": null` par un objet dont les clés vont de `"0"` (dimanche) à `"6"` (samedi). Une liste vide veut dire fermé.

```json
"hours": {
  "0": [],
  "1": [{ "open": "09:00", "close": "12:00" }, { "open": "14:00", "close": "18:00" }],
  "6": [{ "open": "10:00", "close": "18:00" }]
},
"hoursNote": null
```

Le site affiche alors « Ouvert jusqu'à 18:00 » ou « Fermé », à l'heure de Paris, et publie les horaires dans les données structurées. Renseigner aussi `geo` (`{ "lat": …, "lng": … }`) pour activer la carte.

### Écrire sans enfreindre la loi Évin

Le contenu sur le vin doit rester informatif : origine, terroir, cépages, élaboration, caractéristiques gustatives, accords. Sont à proscrire, dans les textes comme dans les textes alternatifs des images : la fête, le sport, la séduction, la réussite, toute personne en train de boire. Les mots « festif », « convivial », « plaisir », « célébrer » sont à éviter dans la description d'un vin.

## Activer le commerce

```bash
NEXT_PUBLIC_COMMERCE_ENABLED=true
```

Désactivé (par défaut), aucun prix ni bouton d'achat n'est rendu : chaque cuvée affiche « Disponible au domaine ». Activé, une cuvée dont `price` est renseigné et `purchasable` vaut `true` affiche son prix TTC. Le panier et le paiement relèvent de la V2 : voir `docs/ECOMMERCE_V2.md`. Les composants ne connaissent que l'interface `CommerceProvider` de `src/lib/commerce/`.

## Variables d'environnement

Copier `.env.example` vers `.env.local`. Les variables `NEXT_PUBLIC_*` sont lues au moment du build.

| Variable                                 | Rôle                                                    |
| ---------------------------------------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                   | URL publique : sitemap, canoniques, données structurées |
| `NEXT_PUBLIC_COMMERCE_ENABLED`           | Affichage des prix                                      |
| `NEXT_PUBLIC_SHOW_TODOS`                 | Affichage des `{{TODO_CLIENT}}`                         |
| `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO` | Envoi des formulaires par Resend                        |
| `RESEND_AUDIENCE_ID`                     | Audience Resend de la lettre d'information              |
| `SANITY_PROJECT_ID`, `SANITY_DATASET`    | Contenu depuis Sanity au lieu des JSON                  |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`           | Mesure d'audience sans cookie                           |

En production, sans `RESEND_API_KEY` ni `MAIL_TO`, les formulaires répondent par une erreur plutôt que de perdre un message.

## Brancher Sanity

Les schémas sont dans `studio/` (`wine`, `event`, `offer`, `page`, `settings`), alignés sur les schémas Zod du site.

1. Créer un projet sur sanity.io, puis dans `studio/` : `pnpm i` et `pnpm dev`.
2. Saisir le contenu (ou importer les JSON).
3. Renseigner `SANITY_PROJECT_ID` côté site.

Le site lit alors les cuvées, les événements, les offres et les réglages dans Sanity (`src/lib/content/cached.ts`, mis en cache une heure). **Ce branchement n'a pas été testé contre un vrai projet** : il n'en existait pas. Les textes des pages (`pages.json`, `ui.json`) restent en JSON en V1, le type `page` est prêt pour la suite.

## Architecture

```
content/fr/          contenu (JSON)
src/app/             pages, actions serveur, sitemap, robots, images Open Graph
src/components/      composants (aucun texte en dur)
src/lib/content/     schémas Zod, lecture JSON ou Sanity
src/lib/commerce/    interface CommerceProvider, LocalProvider, squelette ShopifyProvider
src/lib/             SEO et données structurées, horaires, .ics, e-mails
src/proxy.ts         vrai code 404 pour une cuvée inconnue
studio/              schémas Sanity
tests/               Playwright
docs/                e-commerce V2, conformité, captures, rapports Lighthouse
maquette/            maquette statique validée à l'étape 2 (historique)
archive/             ancien site long-pech.fr (source des fiches et des photos reprises)
public/photos/       logo et photos repris de l'archive, bouteilles extraites des fiches techniques
public/fiches/       fiche technique PDF de chaque cuvée
```

Points à connaître :

- **Next.js 16 avec Cache Components.** Pas de `new Date()` dans un composant serveur, pas de `export const dynamic`. La doc embarquée est dans `node_modules/next/dist/docs/`.
- **Tokens de design** dans `src/app/globals.css` (`@theme`) : calcaire, craie, encre, pierre, braucol, vigne, doré, et une couleur par type de vin. Une seule couleur d'accent par écran.
- **Polices** auto-hébergées dans `src/fonts/` (licence OFL) : Libre Caslon pour les titres (coupe Display en grand, coupe Text en petit, classe `font-display` ou `font-serif`) et Hanken Grotesk pour le texte.
- **Hirondelle** : le motif `src/components/Swallow.tsx` est un dessin d'après l'emblème du domaine, pas le logo. À remplacer par le tracé officiel quand il sera fourni.
- **Cartes cuvée** : le fond prend 15 % de la couleur du type de vin (`color-mix`), pour les photos comme pour les bouteilles dessinées.
- **Vérification d'âge** : le contenu reste dans le HTML pour les moteurs de recherche. La réponse est gardée dans le stockage local du navigateur.
- **Aucun cookie.** Pas de bandeau de consentement, parce qu'il n'y a rien à consentir : mesure d'audience sans cookie, carte OpenStreetMap chargée au clic.
- **i18n.** Le contenu est rangé par langue (`content/fr`). Pour l'anglais : ajouter `content/en`, déclarer la langue dans `src/lib/site.ts` et préfixer les routes.

## Déploiement

### Vercel ou Netlify (cible de production)

Sans configuration particulière. Renseigner les variables d'environnement, puis vérifier après la première mise en ligne : l'envoi réel d'un formulaire, `/sitemap.xml`, et la fiche du domaine dans l'outil de test des résultats enrichis de Google.

### GitHub Pages (démonstration)

GitHub Pages ne sert que des fichiers statiques. Le workflow `.github/workflows/pages.yml` publie un export à chaque push sur `main`, construit par `scripts/build-pages.sh`. Cette version sert à montrer le site, pas à l'exploiter :

- les formulaires s'affichent mais répondent qu'ils sont désactivés (pas de serveur pour envoyer un e-mail) ;
- pas de sitemap, pas d'images Open Graph, pas de fichiers `.ics` ;
- les images ne sont pas optimisées et l'agenda est figé à la date du build ;
- les moteurs de recherche sont écartés (`noindex` et `robots.txt`).

Pour tester l'export en local :

```bash
PAGES_BASE_PATH=/long-pech ./scripts/build-pages.sh
```

Le résultat est dans `out/`. Dans le dépôt GitHub, activer Pages avec la source « GitHub Actions » (Settings, Pages).

## Documents

- `TODO_CLIENT.md` : les questions pour le domaine.
- `PHOTO_BRIEF.md` : le brief de chaque photo.
- `docs/ECOMMERCE_V2.md` : la boutique en ligne.
- `docs/CONFORMITE.md` : loi Évin, âge, RGPD, accessibilité, performance.
