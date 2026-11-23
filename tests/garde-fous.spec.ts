import { expect, test } from "@playwright/test";
import { eventSchema, settingsSchema } from "../src/lib/content/schemas";
import { typo } from "../src/lib/typo";
import settingsJson from "../content/fr/settings.json";
import { adult } from "./helpers";

test.describe("Formulaire de contact", () => {
  // Une adresse IP propre à ce test : la limite de débit ne gêne pas les autres.
  test.use({ extraHTTPHeaders: { "x-forwarded-for": "203.0.113.77" } });

  test("confirme l'envoi, puis freine au sixième message", async ({ page }) => {
    await adult(page);
    const send = async () => {
      await page.goto("/contact");
      const form = page.getByTestId("contact-form");
      await form.getByLabel(/Nom et prénom/).fill("Camille Test");
      await form.getByLabel(/E-mail/).fill("camille@example.com");
      await form.getByLabel(/Message/).fill("Bonjour, une question sur une cuvée.");
      await form.getByRole("button", { name: "Envoyer le message" }).click();
      return form;
    };
    for (let i = 0; i < 5; i++) {
      await send();
      await expect(page.getByTestId("form-success")).toBeVisible();
    }
    const form = await send();
    await expect(form.getByRole("alert")).toContainText("plusieurs demandes");
    // Le message saisi n'est pas perdu.
    await expect(form.getByLabel(/Message/)).toHaveValue("Bonjour, une question sur une cuvée.");
  });

  test("renvoie vers la politique de confidentialité", async ({ page }) => {
    await adult(page);
    await page.goto("/contact");
    const link = page.getByTestId("contact-form").getByRole("link", { name: "Confidentialité" });
    await expect(link).toHaveAttribute("href", "/confidentialite");
  });
});

test.describe("Build de production", () => {
  test.beforeEach(({ page }) => adult(page));

  test("ne publie ni étiquette TODO ni brief photo", async ({ page }) => {
    for (const path of ["/", "/domaine", "/visites", "/contact", "/evenements", "/mentions-legales"]) {
      await page.goto(path);
      await expect(page.locator(".todo, .photo-brief")).toHaveCount(0);
      await expect(page.locator("body")).not.toContainText("TODO_CLIENT");
    }
  });

  test("n'annonce pas un événement sans date", async ({ page }) => {
    await page.goto("/evenements");
    await expect(page.locator("main")).not.toContainText("Information à venir");
  });

  test("donne une adresse canonique et un titre complet à l'accueil", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /localhost:3100\/?$/);
    await expect(page).toHaveTitle("Domaine de Long-Pech, vins de Gaillac à Lisle-sur-Tarn");
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
      "content",
      "Domaine de Long-Pech",
    );
  });

  test("signale la page courante dans le menu, sous-pages comprises", async ({ page }) => {
    await page.goto("/vins/jean-gabriel-rouge");
    const nav = page.getByRole("navigation", { name: "Navigation principale" });
    await expect(nav.getByRole("link", { name: "Nos vins" })).toHaveAttribute("aria-current", "page");
    await expect(nav.getByRole("link", { name: "Le domaine" })).not.toHaveAttribute("aria-current", "page");
  });

  test("garde le bouton Réserver dans l'en-tête à 1024 px, sans débordement", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");
    await expect(page.locator("header").getByRole("link", { name: "Réserver", exact: true })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });

  test("range le catalogue par couleur", async ({ page }) => {
    await page.goto("/vins");
    const types = await page.locator("main ul li .badge").allTextContents();
    const order = ["Rouge", "Rosé", "Blanc", "Doux", "Effervescent"];
    const ranks = types.map((t) => order.indexOf(t.trim())).filter((r) => r >= 0);
    expect(ranks.length).toBeGreaterThanOrEqual(13);
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
  });
});

test("typo : espaces insécables avant la ponctuation haute, clés intactes", () => {
  const out = typo({ "a : b": "Pech, en occitan : la colline. « Len de l'el » ?", n: 3, list: ["Oui !"] });
  expect(out["a : b"]).toBe("Pech, en occitan : la colline. « Len de l'el » ?");
  expect(out.n).toBe(3);
  expect(out.list[0]).toBe("Oui !");
  expect(typo("https://exemple.fr et 09:00")).toBe("https://exemple.fr et 09:00");
});

test("le contenu refuse une date d'événement sans fuseau et un horaire mal écrit", () => {
  const event = { slug: "x", title: "X", kind: "Au domaine", summary: "X" };
  expect(eventSchema.safeParse({ ...event, start: "2027-06-18T19:00:00+02:00" }).success).toBe(true);
  expect(eventSchema.safeParse({ ...event, start: "2027-06-18 19h" }).success).toBe(false);
  expect(eventSchema.safeParse({ ...event, start: "2027-06-18T19:00:00" }).success).toBe(false);
  const hours = (value: unknown) => settingsSchema.safeParse({ ...settingsJson, hours: value }).success;
  expect(hours({ "1": [{ open: "09:00", close: "12:00" }] })).toBe(true);
  expect(hours({ "1": [{ open: "9h", close: "12:00" }] })).toBe(false);
  expect(hours({ "7": [] })).toBe(false);
});
