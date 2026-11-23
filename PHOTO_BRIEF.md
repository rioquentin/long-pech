# Brief photo

Les emplacements du site affichent une illustration de la colline et ce brief, tant que la photo manque. Pour brancher une photo : déposer le fichier dans `public/photos/` et ajouter `"src": "/photos/nom.jpg"` à l'entrée correspondante de `content/fr/photos.json`.

## Règles communes

- **Loi Évin.** Aucune personne en train de boire, aucun verre porté aux lèvres, aucune scène de fête, de sport ou de séduction. Des verres vides ou posés sont admis. Les sujets : le terroir, les mains, les bouteilles, le travail.
- **Personnes.** Au travail, jamais en pose. Autorisation d'image signée pour chaque personne reconnaissable.
- **Lumière.** Naturelle. Matin ou fin de journée. Pas de flash, pas de filtre chaud ajouté.
- **Format.** JPEG ou TIFF, 3000 px de large au moins, horizontal sauf mention contraire. Laisser de l'air autour du sujet : le site recadre.
- **Texte alternatif.** Il est déjà rédigé dans `photos.json`. Le corriger si la photo livrée montre autre chose.

## Les prises de vue

| Id          | Page       | Sujet                                                                                                           | Cadrage                                                                       | Lumière et heure                  |
| ----------- | ---------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------- |
| `hero`      | Accueil    | Panorama depuis la crête, plein ouest. Rangs de vigne au premier plan, vallée du Tarn au fond. Aucune personne. | 24 mm, horizon au tiers haut. Zone calme en bas à gauche : le titre s'y pose. | Heure dorée                       |
| `sandra`    | Le domaine | Sandra au travail dans un rang, de trois quarts. Aucun verre à la main.                                         | 50 mm, plan taille                                                            | Matin                             |
| `equipe`    | Le domaine | L'équipe devant le chai, en tenue de travail.                                                                   | 35 mm, plan large                                                             | Fin d'après-midi, lumière douce   |
| `chai`      | Le domaine | Façade de l'ancienne bergerie devenue chai. Nids d'hirondelles si la saison s'y prête.                          | 35 mm, de face                                                                | Lumière rasante de fin de journée |
| `sol`       | Réserve    | Terre argilo-calcaire, cailloux blancs, pied de vigne en amorce.                                                | 85 mm, vue plongeante                                                         | Midi voilé                        |
| `mains`     | Le domaine | Mains et sécateur sur un cep, en hiver.                                                                         | 85 mm, fond flou sur le coteau                                                | Matin froid                       |
| `barriques` | Le domaine | Alignement de fûts dans le chai.                                                                                | 35 mm, en enfilade                                                            | Lumière naturelle par la porte    |
| `vendange`  | Réserve    | Caissettes de raisin blanc doré, mains qui déposent une grappe.                                                 | 50 mm                                                                         | Octobre, après-midi               |
| `caveau`    | Visites    | Comptoir du caveau, bouteilles alignées, porte ouverte sur les vignes.                                          | 28 mm                                                                         | Fin de matinée                    |
| `chemin`    | 404        | Chemin de terre entre deux parcelles.                                                                           | 50 mm, vertical                                                               | Brume du matin                    |

« Réserve » : brief prêt, emplacement pas encore utilisé sur une page.

## Les bouteilles

Une photo par cuvée (13 références), pour remplacer la bouteille dessinée des cartes et des fiches.

- Bouteille seule, de face, étiquette lisible, sur fond uni clair (calcaire `#F3EEE3` ou blanc cassé).
- Lumière douce des deux côtés, pas de reflet sur l'étiquette.
- Cadrage vertical 4:5, bouteille centrée, marge égale en haut et en bas.
- Même hauteur de bouteille dans le cadre pour toute la série. L'Occimore (50 cl) est photographié à part, avec sa caisse bois.
- Fichier nommé comme le slug de la cuvée : `jean-gabriel-rouge.jpg`, à déclarer dans le champ `images` de `content/fr/wines.json`.

## Ce qui est déjà en place

Images reprises des documents du domaine, servies depuis `public/photos/`. Elles dépannent, elles ne remplacent pas une prise de vue.

| Image                | Source                  | Où                      | Définition                                  | À faire                                    |
| -------------------- | ----------------------- | ----------------------- | ------------------------------------------- | ------------------------------------------ |
| 11 bouteilles        | Fiches techniques (PDF) | Cartes et fiches        | 330 à 470 px de large, étiquettes actuelles | Demander les originaux en haute définition |
| Douceurs des Brumes  | Ancien site             | Carte et fiche          | 250 × 250 px                                | À refaire                                  |
| Logo aux hirondelles | Ancien site             | En-tête et pied de page | 312 × 81 px                                 | Demander le fichier vectoriel              |
| `vignes`             | Ancien site             | Accueil, page domaine   | 552 × 340 px                                | À refaire, voir le brief `hero`            |
| `verres`             | Ancien site             | Page visites            | 552 × 340 px                                | À faire valider (loi Évin), puis à refaire |

Fraîcheur Perlé garde la bouteille dessinée : sa fiche technique montre la même photo que Douceur des Brumes, sans qu'on sache à laquelle elle appartient.

**Non reprises, volontairement :**

- le portrait de deux femmes en chapeau de paille (ancien site). Il montre vraisemblablement Sandra et Karine, alors que le site présente désormais Sandra seule ;
- le bandeau de logos (Vigneron Indépendant, Bienvenue à la ferme, HVE, Saveurs du Tarn). Ce sont des marques de tiers.

L'ancien site crédite « Raynaud Photos » : les originaux sont peut-être disponibles auprès de ce photographe.
