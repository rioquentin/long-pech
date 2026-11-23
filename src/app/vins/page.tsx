import Link from "next/link";
import { Breadcrumb, EvinNotice, PageHeader } from "@/components/Bits";
import { T } from "@/components/T";
import { WineCard } from "@/components/Wine";
import { WineCatalog } from "@/components/WineCatalog";
import { APPELLATIONS, getWines, pages, SWEETNESS, ui, WINE_TYPES } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { typeColor } from "@/lib/wine-types";

const page = pages.vins;
export const metadata = pageMeta(page.meta, "/vins");

export default async function Vins() {
  const wines = await getWines();
  const grapeNames = [...new Set(wines.flatMap((w) => w.grapes.map((g) => g.name)))].sort((a, b) =>
    a.localeCompare(b, "fr"),
  );
  return (
    <>
      <Breadcrumb items={[{ href: "/vins", label: page.kicker }]} />
      <PageHeader kicker={page.kicker} title={page.title} intro={page.intro} />
      <section className="wrap pb-[clamp(64px,10vw,140px)]">
        <h2 className="sur font-sans">{page.rangesTitle}</h2>
        <ul className="border-encre mt-3 mb-12 grid border-t sm:grid-cols-2 lg:grid-cols-4">
          {page.ranges.map((range) => (
            <li key={range.key} className="border-pierre border-b py-5 pr-6">
              <h3>{ui.ranges[range.key as keyof typeof ui.ranges]}</h3>
              <p className="occ mt-1 text-[1.05rem]">{range.tagline}</p>
              <p className="text-encre-2 mt-2 text-[0.95rem]">{range.text}</p>
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
