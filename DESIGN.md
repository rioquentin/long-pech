# Direction visuelle « L'Envol »

Adoptée le 23 novembre 2026, d'après le dossier de direction visuelle (piste B, avec la ligne de crête de la piste A). Ce fichier est la référence : toute retouche visuelle s'y conforme, et tout écart s'y note.

## L'idée

L'hirondelle revient chaque printemps sur la même colline, comme chaque génération revient à la vigne. Elle est déjà dans le logo et dans le nom d'une gamme. Le site en fait un système : sa trajectoire relie les gammes et les générations, son plumage donne la palette. La colline (_Long Pech_, « longue colline » en occitan) donne le second motif : la ligne de crête.

Ce qu'on cherche : un domaine familial incarné, contemporain et soigné, « premium accessible ». Ce qu'on évite : les codes de château (noir et or, blason, gravure), le folklore (croix occitane, pigeonnier, « Toscane »), le cliché du « vin de femme » (rose par défaut, cursive partout, silhouette au couchant).

## Palette

Tirée de l'hirondelle rustique : dos bleu nuit, gorge brique, ventre crème. Contrastes calculés sur le fond calcaire.

| Token      | Hex       | Rôle                                                 | Contraste          |
| ---------- | --------- | ---------------------------------------------------- | ------------------ |
| `calcaire` | `#f3eee3` | Fond de page (ventre crème)                          | —                  |
| `craie`    | `#fbf8f1` | Surfaces, sections alternées                         | —                  |
| `encre`    | `#1d2a3a` | Texte, titres, pied de page, bandeau (dos bleu nuit) | 12,6:1             |
| `encre-2`  | `#4a5566` | Texte secondaire                                     | 6,5:1              |
| `brique`   | `#a3432c` | Boutons, accent des titres, erreurs (gorge brique)   | 5,3:1, blanc 6,2:1 |
| `vigne`    | `#3f4f36` | Venir au domaine, engagement HVE (vert coteau)       | 7,6:1              |
| `pierre`   | `#d8cfbd` | Filets                                               | —                  |
| `braucol`  | `#7a1f2b` | Code des vins rouges uniquement                      | 8,8:1              |
| `dore`     | `#b8862b` | Aplats des vins doux, **jamais en texte**            | 2,8:1              |

Une seule couleur d'accent par écran : la brique. Le code couleur des vins (pastilles, liserés, fonds de carte à 15 %) reste toujours doublé d'un libellé.

## Typographie

- **Instrument Serif** (titres, une seule graisse, et son italique pour les accents) : fin et aérien. Les titres sont grands pour compenser la finesse.
- **Manrope** (texte, interface, prix, fiches) : lisible, neutre, variable.
- **Manuscrit** : une seule occurrence prévue, la signature numérisée de Sandra sur la gamme Les Signatures. Aucune police cursive ailleurs.

Polices auto-hébergées dans `src/fonts/`, licence OFL.

## Motifs (`src/components/Motifs.tsx`)

- **Ligne de crête** : le profil de la longue colline (montée douce, long plateau, descente vers le Tarn). En aplat, elle fait se lever le pied de page comme un horizon (`RidgeEdge`). En trait, elle peut servir de séparateur (`Ridge`), avec parcimonie.
- **Trajectoire d'hirondelle** (`Flight`) : un vol pointillé qui finit sur l'oiseau. Avec des étapes, elle relie les quatre gammes sur la page des vins. Sans étape, elle traverse le bandeau « quatre générations » de l'accueil.
- **Frise** (`.frise` dans `globals.css`) : la trajectoire verticale descend les générations sur la page du domaine, un point brique par date.

Règle : l'hirondelle reste **graphique**, jamais illustrée ni mignonne. Un motif par section au plus.

## Gammes et cuvées

Les gammes structurent, les cuvées s'expriment. Sur chaque carte, la gamme est toujours au même endroit (au-dessus du nom), puis le type de vin, puis l'appellation et les cépages. Les étiquettes, hétérogènes, sont présentées dans un cadre commun : même fond teinté, même angle, même lumière.

## Photo

Documentaire, lumière naturelle, quatre chapitres : retour des hirondelles et débourrement, été et véraison, vendanges et brumes, taille d'hiver. Sandra au travail, à mi-corps, nommée en légende. Les groupes sont montrés par le lieu dressé, jamais par des personnes qui boivent (loi Évin). Le détail par emplacement est dans `PHOTO_BRIEF.md`.

## Ce qui reste à faire

- Logo vectoriel et ses trois versions (pictogramme, hirondelle en vol, trajectoire seule).
- Campagne photo : tant qu'elle manque, les emplacements affichent l'illustration de la colline.
- Signature de Sandra numérisée.
- Texture de calcaire scannée (facultative, à 4-6 % d'opacité si on l'ajoute).
