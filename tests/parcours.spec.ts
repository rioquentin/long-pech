import { expect, test } from "@playwright/test";
import { adult, EVIN, ROUTES } from "./helpers";

test.describe("Vérification d'âge", () => {
  test("s'affiche au premier accès, sans retirer le contenu du HTML", async ({ page }) => {
    await page.goto("/");
    const gate = page.getByRole("dialog");
    await expect(gate).toBeVisible();
    await expect(gate.getByRole("button", { name: /18 ans ou plus/ })).toBeFocused();
    // Le contenu reste dans le document (indexation), mais inerte tant qu'on n'a pas répondu.
    await expect(page.locator("#site")).toHaveAttribute("inert", "");
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("est mémorisée après acceptation", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /18 ans ou plus/ }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page.locator("#site")).not.toHaveAttribute("inert", "");
    await page.reload();
    await expect(page.getByRole("dialog")).toBeHidden();
    await page.goto("/vins");
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("est redemandée après 30 jours, avec le message sanitaire", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("lp-age", String(Date.now() - 31 * 24 * 3600_000)));
    await page.goto("/");
    const gate = page.getByRole("dialog");
    await expect(gate).toBeVisible();
    await expect(gate).toContainText("L'abus d'alcool est dangereux pour la santé");
  });

  test("refuse l'accès aux mineurs, avec retour possible", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Non" }).click();
    await expect(page.getByRole("dialog")).toContainText("réservé aux personnes majeures");
    await page.getByRole("button", { name: "Je me suis trompé" }).click();
    await expect(page.getByRole("button", { name: /18 ans ou plus/ })).toBeVisible();
  });
});

test.describe("Catalogue des vins", () => {
  test.beforeEach(async ({ page }) => {
    await adult(page);
    await page.goto("/vins");
  });

  test("filtre par type, appellation et cépage", async ({ page }) => {
    const cards = page.getByTestId("wine-card");
    const count = page.getByTestId("wine-count");
    await expect(cards).toHaveCount(13);

    await page.getByRole("button", { name: "Effervescent" }).click();
    await expect(cards).toHaveCount(2);
    await expect(count).toHaveText("2 cuvées");

    await page.getByLabel("Appellation").selectOption("AOP Gaillac");
    await expect(cards).toHaveCount(1);

    await page.getByLabel("Appellation").selectOption("IGP Côtes du Tarn");
    await expect(page.getByText("Aucune cuvée ne correspond")).toBeVisible();

    await page.getByRole("button", { name: "Effacer les filtres" }).click();
    await expect(cards).toHaveCount(13);

    await page.getByLabel("Cépage").selectOption("Prunelard");
    await expect(cards).toHaveCount(2);
    await page.getByLabel("Sucrosité").selectOption("doux");
    await expect(cards).toHaveCount(0);
  });

  test("mène à une fiche sans prix, avec la mention sanitaire", async ({ page }) => {
    await page.getByRole("link", { name: "Jean-Gabriel" }).click();
    await expect(page).toHaveURL(/\/vins\/jean-gabriel-rouge$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Jean-Gabriel");
    const main = page.locator("main");
    await expect(main.getByText("Disponible au domaine").first()).toBeVisible();
    await expect(main).not.toContainText("€");
    await expect(page.locator("article").getByText(EVIN)).toBeVisible();
  });
});

test.describe("Demande de visite", () => {
  test.beforeEach(async ({ page }) => {
    await adult(page);
    await page.goto("/visites");
  });

  test("signale les erreurs puis confirme clairement l'envoi", async ({ page }) => {
    const form = page.getByTestId("booking-form");
    await form.getByRole("button", { name: "Envoyer la demande" }).click();
    await expect(form.getByRole("alert")).toContainText("Le formulaire contient des erreurs");
    await expect(form.getByText("Indiquez votre nom.")).toBeVisible();
    await expect(form.getByLabel(/Nom et prénom/)).toHaveAttribute("aria-invalid", "true");

    await form.getByLabel(/Type de visite/).selectOption("pass-vigneron");
    await form.getByLabel(/Date souhaitée/).fill("2099-06-12");
    await form.getByLabel(/Nombre de personnes/).fill("4");
    await form.getByLabel(/Nom et prénom/).fill("Camille Test");
    await form.getByLabel(/E-mail/).fill("camille@example.com");
    await form.getByRole("button", { name: "Envoyer la demande" }).click();

    const success = page.getByTestId("form-success");
    await expect(success).toContainText("Demande envoyée.");
    await expect(success).toContainText("Ce n'est pas encore une réservation");
    await expect(success).toBeFocused();
  });

  test("refuse une date passée et un groupe trop grand", async ({ page }) => {
    const form = page.getByTestId("booking-form");
    await form.getByLabel(/Type de visite/).selectOption("groupes");
    await form.getByLabel(/Date souhaitée/).fill("2020-01-01");
    await form.getByLabel(/Nombre de personnes/).fill("45");
    await form.getByLabel(/Nom et prénom/).fill("Camille Test");
    await form.getByLabel(/E-mail/).fill("camille@example.com");
    await form.getByRole("button", { name: "Envoyer la demande" }).click();
    await expect(form.getByText("Choisissez une date à venir.")).toBeVisible();
    await expect(form.getByText("Indiquez un nombre de personnes entre 1 et 20.")).toBeVisible();
    // Les valeurs saisies sont conservées.
    await expect(form.getByLabel(/Nom et prénom/)).toHaveValue("Camille Test");
  });
});

test.describe("Navigation mobile", () => {
  test.use({ viewport: { width: 390, height: 780 }, hasTouch: true });

  test("menu, barre d'action et liens en un tap", async ({ page }) => {
    await adult(page);
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Menu" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    const menu = page.locator("#menu-mobile");
    await expect(menu).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();

    await toggle.click();
    await menu.getByRole("link", { name: "Nos vins" }).click();
    await expect(page).toHaveURL(/\/vins$/);
    await expect(menu).toBeHidden();

    const bar = page.getByRole("navigation", { name: "Actions rapides" });
    await expect(bar).toBeVisible();
    await expect(bar.getByRole("link", { name: "Appeler" })).toHaveAttribute("href", "tel:+33631856693");
    await expect(bar.getByRole("link", { name: "Itinéraire" })).toHaveAttribute("href", /maps\/dir/);
    await bar.getByRole("link", { name: "Réserver" }).click();
    await expect(page).toHaveURL(/\/visites#reserver$/);
  });
});

test.describe("Toutes les pages", () => {
  for (const [name, path] of ROUTES) {
    for (const width of [360, 1440]) {
      test(`${name} à ${width} px : un seul h1, mention sanitaire, pas de débordement`, async ({ page }) => {
        await adult(page);
        await page.setViewportSize({ width, height: 900 });
        const response = await page.goto(path);
        expect(response?.status()).toBe(name.startsWith("404") ? 404 : 200);
        await expect(page.locator("h1")).toHaveCount(1);
        await expect(page.locator("footer")).toContainText(EVIN);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
        // Aucun cookie déposé, sur aucune page.
        expect(await page.context().cookies()).toHaveLength(0);
      });
    }
  }
});
