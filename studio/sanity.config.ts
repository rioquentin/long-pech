import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";

// Renseigner l'identifiant du projet après `pnpm create sanity@latest` (voir README, « Brancher Sanity »).
export default defineConfig({
  name: "long-pech",
  title: "Domaine de Long-Pech",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "",
  dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
