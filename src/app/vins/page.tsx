import Link from "next/link";
import { Breadcrumb, EvinNotice, PageHeader } from "@/components/Bits";
import { Flight } from "@/components/Motifs";
import { T } from "@/components/T";
import { WineCard } from "@/components/Wine";
import { WineCatalog } from "@/components/WineCatalog";
import { APPELLATIONS, getWines, pages, SWEETNESS, ui, WINE_TYPES } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { typeColor } from "@/lib/wine-types";

const page = pages.vins;
export const metadata = pageMeta(page.meta, "/vins");

export default async function Vins() {
  // Rangées par couleur, dans l'ordre de la légende et des filtres (le tri est stable à l'intérieur d'un type).
  const wines = [...(await getWines())].sort(
    (a, b) => WINE_TYPES.indexOf(a.type) - WINE_TYPES.indexOf(b.type),
  );
  const grapeNames = [...new Set(wines.flatMap((w) => w.grapes.map((g) => g.name)))].sort((a, b) =>
    a.localeCompare(b, "fr"),
  );
  return (
    <>
      <Breadcrumb items={[{ href: "/vins", label: page.kicker }]} />
      <PageHeader kicker={page.kicker} title={page.title} intro={page.intro} />
      <section className="wrap pb-[clamp(64px,10vw,140px)]">
        <h2 className="sur font-sans">{page.rangesTitle}</h2>
        {/* Sur mobile : deux colonnes sans le texte long, pour que les bouteilles arrivent vite. */}
        <Flight dots={[0.012, 0.262, 0.512, 0.762]} className="text-encre mt-6 max-lg:hidden" />
        <ul className="border-encre mt-3 mb-8 grid grid-cols-2 border-t sm:mb-12 lg:-mt-9 lg:grid-cols-4 lg:border-t-0">
          {page.ranges.map((range) => (
            <li key={range.key} className="border-pierre border-b py-4 pr-4 sm:py-5 sm:pr-6">
              <h3 className="max-sm:text-[1.2rem]">{ui.ranges[range.key as keyof typeof ui.ranges]}</h3>
              <p className="occ mt-1 text-[1.05rem] max-sm:text-[0.95rem]">{range.tagline}</p>
              <p className="text-encre-2 mt-2 text-[0.95rem] max-sm:hidden">{range.text}</p>
            </li>
          ))}
        </ul>
        <p className="mb-6">
          <T>{page.note}</T>
        </p>
        <WineCatalog
          items={wines.map((w) => ({
            slug: w.slug,
            type: w.type,
            appellation: w.appellation,
            sweetness: w.sweetness,
            grapes: w.grapes.map((g) => g.name),
          }))}
          labels={ui.filters}
          types={WINE_TYPES.map((t) => ({ value: t, label: ui.types[t], color: typeColor[t] }))}
          appellations={APPELLATIONS.map((a) => ({ value: a, label: a }))}
          sweetness={SWEETNESS.map((s) => ({ value: s, label: ui.sweetness[s] }))}
          grapes={grapeNames.map((g) => ({ value: g, label: g }))}
        >
          {wines.map((wine) => (
            <WineCard key={wine.slug} wine={wine} />
          ))}
        </WineCatalog>
        <div className="border-encre mt-16 flex flex-wrap items-center justify-between gap-6 border-t pt-8">
          <p className="max-w-[46ch] font-serif text-[1.5rem] leading-tight">{pages.home.grapes.title}</p>
          <Link href="/vins/cepages" className="btn">
            {ui.cta.grapes}
          </Link>
        </div>
        <EvinNotice className="mt-10 text-[0.92rem]" />
      </section>
    </>
  );
}
