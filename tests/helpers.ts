import type { Page } from "@playwright/test";

/** Simule un visiteur qui a déjà confirmé sa majorité. */
export const adult = (page: Page) =>
  page.addInitScript(() => {
    try {
      localStorage.setItem("lp-age", String(Date.now()));
    } catch {}
  });

export const ROUTES = [
  ["accueil", "/"],
  ["domaine", "/domaine"],
  ["vins", "/vins"],
  ["fiche-vin", "/vins/jean-gabriel-rouge"],
  ["cepages", "/vins/cepages"],
  ["visites", "/visites"],
  ["evenements", "/evenements"],
  ["contact", "/contact"],
  ["mentions-legales", "/mentions-legales"],
  ["confidentialite", "/confidentialite"],
  ["cookies", "/cookies"],
  ["cgv", "/cgv"],
  ["404", "/cette-page-n-existe-pas"],
  ["404-vin", "/vins/cuvee-inconnue"],
] as const;

export const EVIN = "L'abus d'alcool est dangereux pour la santé, à consommer avec modération.";
