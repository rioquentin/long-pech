import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, EvinNotice, JsonLd } from "@/components/Bits";
import { BOOK_HREF } from "@/components/Chrome";
import { T } from "@/components/T";
import { Availability, WineBadge, WineCard, WineVisual, wineSubtitle } from "@/components/Wine";
import { getWine, getWines, pages, ui } from "@/lib/content";
import { commerceEnabled } from "@/lib/flags";
import { pageMeta, productLd } from "@/lib/seo";
import { asset, stripTodos } from "@/lib/site";
import { typeColor } from "@/lib/wine-types";

export async function generateStaticParams() {
  return (await getWines()).map((wine) => ({ slug: wine.slug }));
}

export async function generateMetadata({ params }: PageProps<"/vins/[slug]">): Promise<Metadata> {
  const wine = await getWine((await params).slug);
  if (!wine) return {};
  const subtitle = stripTodos(wineSubtitle(wine));
  return pageMeta(
    {
      title: `${wine.name}, ${ui.types[wine.type].toLowerCase()}${wine.appellation ? ` ${wine.appellation}` : ""}`,
      description: `${wine.name} : ${subtitle}. ${stripTodos(wine.story ?? "")} ${ui.wine.visitBody}`.trim(),
    },
    `/vins/${wine.slug}`,
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-pierre max-xs:grid-cols-1 max-xs:gap-0 grid grid-cols-[10rem_1fr] gap-4 border-b py-3">
      <dt className="text-encre-2 text-[0.9rem]">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default async function WinePage({ params }: PageProps<"/vins/[slug]">) {
  const { slug } = await params;
  const wines = await getWines();
  const wine = wines.find((w) => w.slug === slug);
  if (!wine) notFound();

  const w = ui.wine;
  const making = [wine.vinification, wine.ageing].filter(Boolean).join(" ");
  const notes = wine.tastingNotes;
  const awards = wine.awards.filter((a) => a.verified);
  const siblings = wines.filter((x) => x.range === wine.range && x.slug !== wine.slug).slice(0, 4);

  return (
    <>
      <Breadcrumb
        items={[
          { href: "/vins", label: pages.vins.kicker },
          { href: `/vins/${wine.slug}`, label: wine.name },
        ]}
      />
      <article className="wrap grille py-10 sm:py-16">
        <div
          className="border-t-8 md:sticky md:top-6 md:col-span-5 md:self-start"
          style={{ borderColor: typeColor[wine.type], "--c": typeColor[wine.type] } as React.CSSProperties}
        >
          <div className="carte-vis">
            <WineVisual wine={wine} priority />
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <WineBadge type={wine.type} />
            <span className="sur">{ui.ranges[wine.range]}</span>
          </p>
          <h1 className="mt-4 text-[clamp(2.3rem,5vw,4rem)]">{wine.name}</h1>
          {wine.story && (
            <p className="chapo mt-5 text-[1.15rem]">
              <T>{wine.story}</T>
            </p>
          )}

          <div className="border-encre mt-8 flex flex-wrap items-center justify-between gap-4 border-y py-5">
            <Availability wine={wine} />
            {commerceEnabled && wine.purchasable && wine.price !== null ? (
              <Link href="/contact" className="btn btn-plein">
                {wine.stock === 0 ? w.outOfStock : w.buy}
              </Link>
            ) : (
              <Link href={BOOK_HREF} className="btn btn-plein">
                {ui.cta.book}
              </Link>
            )}
          </div>

          <dl className="mt-8">
            <Row label={w.appellation}>
              <T>{wine.appellation ?? w.appellationTodo}</T>
            </Row>
            <Row label={w.vintage}>
              <T>{wine.vintage ? String(wine.vintage) : w.vintageTodo}</T>
            </Row>
            <Row label={w.grapes}>
              <ul>
                {wine.grapes.map((grape) => (
                  <li key={grape.name}>
                    {grape.name}
                    {grape.percent !== null && ` ${grape.percent} %`}
                  </li>
                ))}
              </ul>
            </Row>
            {wine.sweetness && <Row label={w.sweetness}>{ui.sweetness[wine.sweetness]}</Row>}
            <Row label={w.terroir}>{w.terroirValue}</Row>
            <Row label={w.volume}>{wine.volumeMl / 10} cl</Row>
            <Row label={w.abv}>
              <T>{wine.abv !== null ? `${String(wine.abv).replace(".", ",")} % vol.` : w.abvTodo}</T>
            </Row>
            {wine.residualSugar !== null && (
              <Row label={w.residualSugar}>{String(wine.residualSugar).replace(".", ",")} g/l</Row>
            )}
            {wine.vineAge !== null && (
              <Row label={w.vineAge}>
                {wine.vineAge} {w.vineAgeUnit}
              </Row>
            )}
            <Row label={w.culture}>{w.cultureValue}</Row>
            {wine.servingTemp && <Row label={w.serving}>{wine.servingTemp}</Row>}
            <Row label={w.cellaring}>
              <T>{wine.cellaring ?? w.cellaringTodo}</T>
            </Row>
          </dl>

          <section className="mt-12" aria-labelledby="elaboration">
            <h2 id="elaboration" className="text-[2rem]">
              {w.making}
            </h2>
            <p className="mt-4">
              <T>{making || w.makingTodo}</T>
            </p>
          </section>

          <section className="mt-12" aria-labelledby="degustation">
            <h2 id="degustation" className="text-[2rem]">
              {w.tasting}
            </h2>
            {notes ? (
              <dl className="mt-4">
                {notes.eye && <Row label={w.eye}>{notes.eye}</Row>}
                {notes.nose && <Row label={w.nose}>{notes.nose}</Row>}
                {notes.palate && <Row label={w.palate}>{notes.palate}</Row>}
              </dl>
            ) : (
              <p className="mt-4">
                <T>{w.tastingTodo}</T>
              </p>
            )}
          </section>

          {wine.pairings.length > 0 && (
            <section className="mt-12" aria-labelledby="accords">
              <h2 id="accords" className="text-[2rem]">
                {w.pairings}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {wine.pairings.map((pairing) => (
                  <li key={pairing} className="border-encre border px-3 py-1.5 text-[0.95rem]">
                    {pairing}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {awards.length > 0 && (
            <section className="mt-12" aria-labelledby="distinctions">
              <h2 id="distinctions" className="text-[2rem]">
                {w.awards}
              </h2>
              <ul className="mt-4">
                {awards.map((award) => (
                  <li key={award.name + award.year}>
                    {award.name}
                    {award.year && ` ${award.year}`} <span className="text-encre-2">({award.source})</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="mt-12">
            {wine.techSheetPdf ? (
              <a href={asset(wine.techSheetPdf)} className="btn" download>
                {w.techSheet}
              </a>
            ) : (
              <T>{w.techSheetTodo}</T>
            )}
          </p>

          <EvinNotice className="border-pierre mt-10 border-t pt-6 text-[0.92rem]" />
        </div>
      </article>

      {siblings.length > 0 && (
        <section className="section bg-craie border-pierre border-t" aria-labelledby="gamme">
          <h2 id="gamme" className="mb-10 text-[2rem]">
            {w.others} : {ui.ranges[wine.range]}
          </h2>
          <ul className="grid grid-cols-2 gap-4 sm:gap-7 lg:grid-cols-4">
            {siblings.map((sibling) => (
              <WineCard key={sibling.slug} wine={sibling} />
            ))}
          </ul>
        </section>
      )}
      <JsonLd data={productLd(wine, commerceEnabled)} />
    </>
  );
}
