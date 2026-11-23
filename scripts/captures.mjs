// Captures pleine page, mobile et desktop, de chaque page. Usage : node scripts/captures.mjs [baseURL]
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3100";
const routes = [
  ["accueil", "/"],
  ["domaine", "/domaine"],
  ["vins", "/vins"],
  ["fiche-vin", "/vins/jean-gabriel-rouge"],
  ["cepages", "/vins/cepages"],
  ["visites", "/visites"],
  ["evenements", "/evenements"],
  ["contact", "/contact"],
  ["mentions-legales", "/mentions-legales"],
  ["404", "/cette-page-n-existe-pas"],
];
const viewports = { mobile: { width: 390, height: 844 }, desktop: { width: 1440, height: 900 } };

await mkdir("docs/captures", { recursive: true });
const browser = await chromium.launch();
for (const [device, viewport] of Object.entries(viewports)) {
  const context = await browser.newContext({ viewport, reducedMotion: "reduce", locale: "fr-FR" });
  await context.addInitScript(() => localStorage.setItem("lp-age", String(Date.now())));
  const page = await context.newPage();
  for (const [name, path] of routes) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    // Fait défiler la page pour déclencher le chargement différé des images.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `docs/captures/${name}-${device}.png`, fullPage: true });
  }
  await context.close();
}
// La vérification d'âge, telle que la voit un premier visiteur.
const context = await browser.newContext({ viewport: viewports.mobile, locale: "fr-FR" });
const page = await context.newPage();
await page.goto(base, { waitUntil: "networkidle" });
await page.screenshot({ path: "docs/captures/verification-age-mobile.png" });
await browser.close();
console.log("Captures écrites dans docs/captures");
