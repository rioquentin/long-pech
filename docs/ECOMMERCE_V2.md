# Boutique en ligne (V2) : cadrage

Ce document prépare la V2. Rien de ce qu'il décrit n'est codé, hormis les points d'accroche déjà en place dans la V1 (dernière section).

Les points juridiques et fiscaux sont un cadre de travail, pas un avis. Ils sont à valider avec le domaine, son expert-comptable et le service viticulture des douanes avant toute vente en ligne. Les tarifs des plateformes sont à revérifier au moment du choix.

## 1. Choix de plateforme

**Recommandation : Shopify en mode headless** (Storefront API), le site Next.js restant la vitrine.

| Critère                               | Shopify headless                                                                        | Medusa (open source)                                                    |
| ------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Coût fixe                             | Abonnement mensuel (formule de base suffisante au départ), plus commissions de paiement | Pas de licence, mais un serveur et une base Postgres à héberger         |
| Coût de mise en place                 | Faible : catalogue, paiement, e-mails, factures fournis                                 | Élevé : tout est à assembler (paiement, e-mails, back-office, factures) |
| Maintenance                           | Assurée par Shopify                                                                     | À la charge d'un développeur : mises à jour, sécurité, sauvegardes      |
| Autonomie de Sandra                   | Forte : application mobile pour les commandes, les stocks et les prix                   | Faible sans développeur                                                 |
| Paiement                              | Shopify Payments ou prestataire tiers                                                   | Stripe ou autre, à intégrer                                             |
| Règles vin (cartons, paliers de port) | Par applications ou par logique côté Next.js                                            | Entièrement sur mesure                                                  |
| Dépendance                            | Forte à la plateforme                                                                   | Faible                                                                  |

Medusa se justifie pour une équipe qui a un développeur à demeure. Pour un domaine où une personne fait tout, la maintenance d'un serveur e-commerce est un risque sans contrepartie.

**Contraintes alcool à vérifier chez Shopify avant de s'engager :**

- acceptation de la vente d'alcool par le prestataire de paiement retenu, pour la France ;
- possibilité d'imposer une case « je certifie avoir plus de 18 ans » au paiement ;
- affichage de la mention sanitaire dans le panier, le paiement et les e-mails de commande.

Le domaine vendait déjà en ligne sur PrestaShop (ancien site). Son historique de commandes et ses règles de livraison sont le meilleur point de départ : les récupérer avant de paramétrer quoi que ce soit.

## 2. Spécificités du vin

**Conditionnement.** Vente à la bouteille, avec expédition en cartons de 6 ou de 12. Deux options : imposer des multiples de 6, ou accepter le panachage et facturer le carton entamé. À décider avec le domaine, d'après ce qu'il pratiquait.

**Frais de port.** Par paliers de bouteilles (1 à 6, 7 à 12, 13 à 24, au-delà), avec un seuil de gratuité éventuel. Les grilles viennent du transporteur. Les bouteilles de 50 cl et les effervescents (plus lourds) comptent dans les paliers.

**Retrait au domaine.** Mode de livraison gratuit « retrait à Lisle-sur-Tarn », avec choix d'un créneau pendant les horaires d'ouverture. C'est aussi un levier pour l'objectif n° 1 du site : faire venir.

**Coffrets.** Produits composés (par exemple un coffret Signatures). Le stock du coffret doit décrémenter celui des bouteilles qui le composent.

**Livraison réservée aux majeurs.** Déclaration de majorité à la commande, et remise du colis à une personne majeure. Vérifier les options « remise contre signature d'un adulte » des transporteurs.

**Zone de livraison.** France métropolitaine uniquement en V2. La vente à des particuliers d'autres pays de l'Union impose d'acquitter les accises du pays de destination, ce qui demande un représentant fiscal ou un prestataire spécialisé.

**Statut fiscal et douanier.** À valider avec les douanes :

- le domaine, en tant que récoltant, a normalement le statut d'entrepositaire agréé ;
- les expéditions à des particuliers en France se font en droits acquittés, sous capsule représentative de droits (CRD) ou sous document d'accompagnement dématérialisé selon l'organisation du domaine ;
- les ventes à des professionnels en suspension de droits circulent sous document administratif électronique (DAE) ;
- les ventes en ligne entrent dans la déclaration récapitulative mensuelle.

La plateforme doit donc exporter, par période, les volumes vendus par produit et par contenance.

## 3. Obligations de la vente à distance

- **Conditions générales de vente** accessibles avant la commande et acceptées par une case à cocher. La page `/cgv` existe déjà, en placeholder.
- **Prix** affichés toutes taxes comprises. Frais de livraison annoncés avant la validation.
- **Bouton de commande** portant une mention du type « Commande avec obligation de paiement ».
- **Droit de rétractation** de 14 jours à compter de la réception. Exceptions à faire valider par un juriste : produits personnalisés (étiquette sur mesure), et certains vins dont le prix dépend du marché et qui sont livrés plus de 30 jours après la commande (primeurs). Une bouteille standard reste rétractable. Prévoir qui paie le retour.
- **Informations précontractuelles** : identité du vendeur, caractéristiques du produit, délai de livraison, garanties légales.
- **Médiateur de la consommation** : adhésion obligatoire, coordonnées dans les CGV.
- **Interdiction de vente aux mineurs**, rappelée sur le site et dans les CGV. Le vendeur peut exiger une preuve de majorité.
- **Loi Évin** : elle s'applique aux fiches produit, aux e-mails, aux lettres d'information et aux promotions. La mention sanitaire figure sur chaque page commerce.
- **RGPD** : nouvelle finalité (exécution du contrat), durées de conservation des factures, et consentement distinct pour la lettre d'information.

## 4. Migration

**Abonnés de la lettre.** Ils sont dans une audience Resend. À l'ouverture de la boutique, les importer dans Shopify comme contacts abonnés à l'e-mail, sans créer de compte client à leur place. Leur consentement couvre la lettre d'information, pas autre chose. Le premier envoi annonce la boutique et rappelle le lien de désinscription.

**Contenu et produits.** Sanity reste la source du contenu éditorial (histoire de la cuvée, dégustation, accords, photos). Shopify devient la source du prix, du stock et de la disponibilité. Le lien se fait par la référence : `wine.sku` = SKU de la variante Shopify.

Étapes :

1. Renseigner `sku` sur chaque cuvée dans Sanity.
2. Créer les produits Shopify avec les mêmes SKU (import CSV depuis Sanity).
3. Implémenter `ShopifyProvider` : `listProducts` et `getProduct` lisent prix et stock par SKU.
4. Webhook Shopify (produit ou stock modifié) vers une route Next.js qui invalide le cache des fiches.
5. Passer `COMMERCE_PROVIDER=shopify` puis `NEXT_PUBLIC_COMMERCE_ENABLED=true`.

**Ancien site.** Rediriger les anciennes adresses PrestaShop (`/nos-cuvees/23-…`) vers les nouvelles fiches (`/vins/mathieu`), pour ne pas perdre le référencement acquis.

## 5. Ce qui est déjà prêt dans la V1

| Élément                          | Où                                                                    | État                                                                   |
| -------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Champs commerce du modèle `Wine` | `src/lib/content/schemas.ts` : `sku`, `price`, `stock`, `purchasable` | Présents, tous `null`                                                  |
| Interface `CommerceProvider`     | `src/lib/commerce/types.ts`                                           | Définie : `listProducts`, `getProduct`, `cart.*`, `checkoutUrl`        |
| `LocalProvider`                  | `src/lib/commerce/local.ts`                                           | Catalogue en lecture seule, pas de panier                              |
| `ShopifyProvider`                | `src/lib/commerce/shopify.ts`                                         | Squelette vide, avec les correspondances Storefront API en commentaire |
| Feature flag                     | `NEXT_PUBLIC_COMMERCE_ENABLED`                                        | Désactivé : aucun prix rendu, bouton « Disponible au domaine »         |
| Données structurées              | `productLd` dans `src/lib/seo.ts`                                     | L'offre (prix, disponibilité) n'apparaît que flag activé               |
| Mention sanitaire                | Pied de page, fiches, catalogue, visites, CGV                         | En place                                                               |
| Vérification d'âge               | `src/components/AgeGate.tsx`                                          | En place                                                               |

**Reste à construire en V2 :** le panier (interface et état), la page de paiement ou la redirection vers celui de Shopify, les e-mails de commande, la logique de cartons et de port, l'espace client si le domaine en veut un.

Avec le flag activé aujourd'hui, une cuvée qui a un prix et `purchasable: true` affiche son prix TTC et un bouton « Commander » qui mène à la page contact. C'est un état intermédiaire assumé : il permet de publier des tarifs avant d'ouvrir le paiement.
