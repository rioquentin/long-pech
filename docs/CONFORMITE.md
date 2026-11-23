# Conformité et qualité

État au 23 novembre 2026, sur le build de production local. Une case cochée a été vérifiée, la colonne « Preuve » dit comment. Une case vide n'est pas faite ou pas vérifiée.

## Loi Évin

- [x] Mention sanitaire dans le pied de page de toutes les pages. Preuve : test Playwright sur 14 pages.
- [x] Mention sanitaire sur chaque fiche vin, sur le catalogue, sur la page cépages, sur la page visites (tarifs) et sur les CGV.
- [x] Aucun prix affiché en V1. Preuve : test Playwright sur une fiche.
- [x] Textes des vins limités à l'origine, aux cépages, à l'élaboration, aux caractéristiques gustatives et aux accords. Les formulations de l'ancien site et du document éditorial qui sortaient de ce cadre ont été réécrites ou écartées (« vin de plaisir », « bulles festives », « sensuel », « virile », « occasions festives », « instants entre amis », « célébrer »).
- [x] Textes alternatifs des images sans scène de consommation.
- [ ] **Photo `verres` (page visites) à faire valider.** Elle vient de l'ancien site : quatre verres remplis posés sur un muret, une main près d'un verre. Personne ne boit, mais c'est l'image la plus proche de la limite.
- [ ] **Agenda à relire quand les événements seront saisis.** « Apéro vigneron » et « soirée » sont des noms d'événements du domaine. Leur description doit rester informative (date, lieu, programme).

Relecture page par page :

| Page                        | Contenu sur l'alcool                    | Verdict  |
| --------------------------- | --------------------------------------- | -------- |
| Accueil                     | 94                                      | 100      | 100 | 100 | 3,1 s | 135 ms | 0   | 10 ms |
| Le domaine                  | 95                                      | 100      | 100 | 100 | 2,9 s | 101 ms | 0   | 10 ms |
| Nos vins, fiches            | Fiches techniques, dégustation, accords | Conforme |
| Cépages                     | 95                                      | 100      | 100 | 100 | 2,9 s | 99 ms  | 0   | 20 ms |
| Visites                     | 96                                      | 100      | 100 | 100 | 2,8 s | 91 ms  | 0   | 10 ms |
| Événements                  | 96                                      | 100      | 100 | 100 | 2,8 s | 104 ms | 0   | 10 ms |
| Contact, pages légales, 404 | Aucun                                   | Conforme |

Cette relecture est la mienne, pas un avis juridique.

## Vérification d'âge

- [x] Affichée au premier accès, bouton « Oui » au focus, page inerte derrière. Preuve : test Playwright.
- [x] Mémorisée dans le stockage local, plus jamais reposée. Preuve : test Playwright.
- [x] Refus aussi simple que l'acceptation (deux boutons côte à côte), avec retour possible.
- [x] N'empêche pas l'indexation : le contenu est dans le HTML servi, la fenêtre n'apparaît qu'avec JavaScript. Preuve : Lighthouse SEO à 100 sur des pages auditées fenêtre ouverte.
- [x] Accessible : `role="dialog"`, `aria-modal`, titre et description reliés, utilisable au clavier.

## RGPD

- [x] Aucun cookie déposé, sur aucune page. Preuve : test Playwright (14 pages, deux largeurs).
- [x] Pas de bandeau de consentement, puisqu'il n'y a aucun traceur. La page `/cookies` l'explique.
- [x] Mesure d'audience sans cookie prévue (Plausible), désactivée tant que le domaine n'est pas renseigné.
- [x] Carte OpenStreetMap chargée au clic seulement. Non testée en conditions réelles : les coordonnées GPS manquent.
- [x] Chaque formulaire indique sa base légale. Pot de miel anti-spam, pas de reCAPTCHA.
- [x] Polices auto-hébergées : aucune requête vers un tiers au chargement.
- [ ] Mentions légales et politique de confidentialité incomplètes : éditeur, responsable du traitement, hébergeur (voir `TODO_CLIENT.md`).
- [ ] Envoi réel des e-mails par Resend non testé : pas de clé. Les tests utilisent une simulation.

## Accessibilité (RGAA / WCAG 2.2 AA)

- [x] Lighthouse accessibilité : 100 sur les 8 pages auditées. C'est un contrôle automatique, il ne couvre qu'une partie des critères.
- [x] Un seul `h1` par page, hiérarchie de titres continue. Preuve : test Playwright.
- [x] Lien d'évitement, focus visible partout (contour de 3 px).
- [x] Menu mobile : `aria-expanded`, fermeture par Échap avec retour du focus. Preuve : test Playwright.
- [x] Formulaires : étiquettes reliées, erreurs reliées par `aria-describedby`, résumé annoncé et mis au focus, valeurs conservées après erreur. Preuve : test Playwright.
- [x] Filtres du catalogue : boutons `aria-pressed`, nombre de résultats annoncé (`aria-live`).
- [x] Cibles tactiles de 24 px au moins, 44 px pour les actions principales.
- [x] `prefers-reduced-motion` respecté : plus aucune animation.
- [x] Contrastes de texte, calculés :

| Paire                         | Ratio | Seuil AA |
| ----------------------------- | ----- | -------- |
| Encre sur calcaire            | 14,9  | 4,5      |
| Texte secondaire sur calcaire | 6,8   | 4,5      |
| Texte secondaire sur craie    | 7,4   | 4,5      |
| Braucol sur calcaire          | 8,8   | 4,5      |
| Blanc sur braucol (bouton)    | 10,2  | 4,5      |
| Calcaire sur vigne            | 7,6   | 4,5      |
| Texte atténué sur vigne       | 6,2   | 4,5      |

- [ ] **Pastilles de type de vin sous 3:1** sur fond clair (rosé 2,6, blanc 2,1, effervescent 2,5). Elles sont cerclées d'un filet sombre et toujours doublées d'un libellé, donc l'information ne passe jamais par la couleur seule. À foncer si un audit RGAA l'exige.
- [ ] Pas de test avec un lecteur d'écran (VoiceOver, NVDA). À faire avant la mise en ligne.
- [ ] Pas d'audit RGAA complet ni de déclaration d'accessibilité.
- [ ] Logo : image bitmap de l'ancien site (312 px). Lisible, mais à remplacer par un SVG.

## Performance

Lighthouse 13, profil mobile, réseau simulé « Slow 4G » (1,6 Mbit/s), fenêtre de vérification d'âge ouverte. Rapports HTML dans `docs/lighthouse/`.

| Page       | Perf. | Access. | Bonnes prat. | SEO | LCP simulé | LCP observé | CLS | TBT   |
| ---------- | ----- | ------- | ------------ | --- | ---------- | ----------- | --- | ----- |
| Accueil    | 94    | 100     | 100          | 100 | 3,1 s      | 135 ms      | 0   | 10 ms |
| Le domaine | 95    | 100     | 100          | 100 | 2,9 s      | 101 ms      | 0   | 10 ms |
| Nos vins   | 95    | 100     | 100          | 100 | 2,9 s      | 94 ms       | 0   | 10 ms |
| Fiche vin  | 96    | 100     | 100          | 100 | 2,8 s      | 123 ms      | 0   | 20 ms |
| Cépages    | 95    | 100     | 100          | 100 | 2,9 s      | 99 ms       | 0   | 20 ms |
| Visites    | 96    | 100     | 100          | 100 | 2,8 s      | 91 ms       | 0   | 10 ms |
| Événements | 96    | 100     | 100          | 100 | 2,8 s      | 104 ms      | 0   | 10 ms |
| Contact    | 95    | 100     | 100          | 100 | 2,9 s      | 97 ms       | 0   | 20 ms |

La performance varie d'un ou deux points d'une exécution à l'autre.

Budgets :

- [x] Accessibilité, bonnes pratiques, SEO : 100, pour un objectif de 95.
- [x] CLS : 0, pour un objectif inférieur à 0,05.
- [ ] **Performance : 94 à 96**, pour un objectif de 95. Atteint sur sept pages, manqué d'un point sur l'accueil.
- [ ] **LCP : 2,8 à 3,1 s en 4G lente simulée**, pour un objectif de 2 s. Le LCP observé en local est de 0,1 s. L'écart vient surtout des polices (87 ko préchargés depuis le passage à Libre Caslon, contre 135 ko avant) et de l'image du logo.
- [ ] **JavaScript de l'accueil : 183 ko gzip**, pour un objectif de 120 ko. Environ 160 ko viennent du socle Next.js 16 et React 19, le code du site pèse une quinzaine de ko. Le budget n'est pas atteignable avec cette pile sans renoncer à l'App Router.
- [ ] Mesures à refaire en ligne (CDN, HTTP/2 ou 3) et avec les vraies photos, qui changeront le LCP.

## Tests

`pnpm test` : 38 tests Playwright, tous verts. Vérification d'âge (3), catalogue et fiche (2), demande de visite (2), navigation mobile (1), toutes les pages à 360 et 1440 px (28), fichier .ics et statut ouvert ou fermé (2).

`pnpm check` : ESLint, TypeScript strict et Prettier sans erreur ni avertissement.

Non couvert : formulaire de contact et lettre d'information (même mécanique que la demande de visite), branchement Sanity, envoi réel par Resend, carte, commerce activé.
