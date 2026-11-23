import Link from "next/link";
import { BOOK_HREF } from "@/components/Chrome";
import { Photo } from "@/components/Photo";
import { EventList, NewsletterSection, VisitBlock } from "@/components/Sections";
import { Swallow } from "@/components/Swallow";
import { T } from "@/components/T";
import { WineBadge, WineCard } from "@/components/Wine";
import {
  getGrapes,
  getOffers,
  getSettings,
  getUpcomingEvents,
  getWines,
  pages,
  ui,
  WINE_TYPES,
} from "@/lib/content";

const NATIVE = ["braucol", "duras", "mauzac", "loin-de-l-oeil"];

export default async function Home() {
  const [settings, wines, offers, events, grapes] = await Promise.all([
    getSettings(),
    getWines(),
    getOffers(),
    getUpcomingEvents(),
    getGrapes(),
  ]);
  const home = pages.home;
  const featured = wines.filter((w) => w.featured).slice(0, 4);
  const native = NATIVE.map((slug) => grapes.find((g) => g.slug === slug)).filter((g) => g !== undefined);

  return (
    <>
      <div className="relative grid min-h-[min(calc(100svh-91px),820px)] items-end max-md:block max-md:min-h-0">
        <Photo
          id="hero"
          priority
          className="absolute inset-0 max-md:relative max-md:inset-auto max-md:h-[46svh]"
        />
        <div className="bg-calcaire relative w-[min(calc(var(--marge)+700px),100%)] py-[clamp(28px,4vw,56px)] pr-[clamp(24px,4vw,56px)] pl-(--marge) max-md:-mt-14 max-md:w-[calc(100%-28px)]">
          <p className="sur">{home.hero.kicker}</p>
          <h1 className="mt-[18px] mb-[22px]">
            {home.hero.titleStart} <span className="it text-braucol">{home.hero.titleAccent}</span>
          </h1>
          <p className="chapo">{home.hero.body}</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3.5">
            <Link href={BOOK_HREF} className="btn btn-plein">
              {ui.cta.book}
            </Link>
            <Link href="/vins" className="lien">
              {ui.cta.seeWines}
            </Link>
          </div>
        </div>
      </div>

      <section className="section grille">
        <div className="ap md:col-span-5">
          <p className="occ">{home.pech.kicker}</p>
          <h2 className="mt-3.5">{home.pech.title}</h2>
          <p className="mt-5 max-w-[40ch]">{home.pech.body}</p>
          <p className="mt-5">
            <Link href="/domaine" className="lien">
              {ui.cta.discover}
            </Link>
          </p>
          <Photo id="vignes" className="mt-8 aspect-[552/340]" sizes="(min-width: 768px) 40vw, 100vw" />
        </div>
        <dl className="ap grid grid-cols-3 gap-3.5 self-end sm:gap-6 md:col-span-6 md:col-start-7">
          {home.figures.map((figure) => (
            <div key={figure.label} className="border-encre flex flex-col-reverse justify-end border-t pt-4">
              <dt className="text-encre-2 mt-2.5 text-[0.92rem]">
                <T>{figure.label}</T>
              </dt>
              <dd className="font-display text-[clamp(2.3rem,6.4vw,5.6rem)] leading-none">
                <T>{figure.value}</T>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="bandeau">
        <Swallow className="mx-auto h-14" />
        <p>{home.band}</p>
      </div>

      <section className="section bg-craie border-pierre border-b" id="cuvees">
        <div className="mb-[clamp(32px,5vw,64px)] flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="sur">{home.wines.kicker}</p>
            <h2 className="mt-3.5">{home.wines.title}</h2>
            <p className="chapo mt-3.5 max-w-[44ch]">{home.wines.body}</p>
          </div>
          <Link href="/vins" className="btn">
            {ui.cta.allWines}
          </Link>
        </div>
        <ul className="mb-9 flex flex-wrap gap-x-[18px] gap-y-2" aria-label={ui.typesLegend}>
          {WINE_TYPES.map((type) => (
            <li key={type}>
              <WineBadge type={type} />
            </li>
          ))}
        </ul>
        <ul className="grid grid-cols-2 gap-4 sm:gap-7 lg:grid-cols-4">
          {featured.map((wine) => (
            <WineCard key={wine.slug} wine={wine} stagger />
          ))}
        </ul>
      </section>

      <section className="section grille">
        <h2 className="ap md:col-span-7">{home.grapes.title}</h2>
        <p className="ap chapo self-end md:col-span-4 md:col-start-9">
          {home.grapes.body}{" "}
          <Link href="/vins/cepages" className="lien text-encre">
            {ui.cta.grapes}
          </Link>
        </p>
        <ul className="border-encre mt-6 border-t">
          {native.map((grape) => (
            <li key={grape.slug} className="ap border-pierre border-b">
              <Link
                href={`/vins/cepages#${grape.slug}`}
                className="group grid items-baseline gap-x-8 gap-y-1 py-4 md:grid-cols-[1fr_auto] md:py-5"
              >
                <span className="group-hover:text-braucol font-display text-[clamp(2.6rem,9vw,7rem)] leading-none transition-colors">
                  {grape.name}
                </span>
                <span className="text-encre-2 text-[0.95rem] md:max-w-[26ch] md:text-right">
                  {pages.cepages.colorLabels[grape.color]} · {grape.aka}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <VisitBlock settings={settings} offers={offers} />

      <section className="section grille">
        <div className="ap md:col-span-4">
          <p className="sur">{home.events.kicker}</p>
          <h2 className="mt-3.5">{home.events.title}</h2>
          <p className="mt-5">
            <Link href="/evenements" className="lien">
              {ui.cta.agenda}
            </Link>
          </p>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <EventList events={events.slice(0, 3)} />
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}
