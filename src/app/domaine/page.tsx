import Link from "next/link";
import { Breadcrumb, PageHeader } from "@/components/Bits";
import { BOOK_HREF } from "@/components/Chrome";
import { Photo } from "@/components/Photo";
import { HillDiagram } from "@/components/Sections";
import { T } from "@/components/T";
import { pages, ui } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

const page = pages.domaine;
export const metadata = pageMeta(page.meta, "/domaine");

export default function Domaine() {
  return (
    <>
      <Breadcrumb items={[{ href: "/domaine", label: page.kicker }]} />
      <PageHeader kicker={page.kicker} title={page.title} intro={page.intro} />
      <Photo id="sandra" className="aspect-[4/3] md:aspect-[21/9]" priority />

      <section className="section grille" aria-labelledby="histoire">
        <h2 id="histoire" className="ap md:col-span-4">
          {page.history.title}
        </h2>
        {/* Frise : la trajectoire de l'hirondelle descend les générations, une étape par date. */}
        <ol className="frise md:col-span-7 md:col-start-6">
          {page.history.timeline.map((step) => (
            <li
              key={step.text}
              className="ap border-pierre grid gap-1 border-t py-5 first:border-t-0 sm:grid-cols-[11rem_1fr] sm:gap-8"
            >
              <span
                className={`text-brique font-display leading-none ${/^\d/.test(step.year) ? "text-[clamp(2.2rem,5vw,4rem)]" : "text-[2rem]"}`}
              >
                <T>{step.year}</T>
              </span>
              <span className="self-center">{step.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="section grille bg-craie border-pierre border-y" aria-labelledby="equipe">
        <div className="ap md:col-span-5">
          <h2 id="equipe">{page.sisters.title}</h2>
          <p className="chapo mt-5">{page.sisters.body}</p>
          <Photo id="equipe" className="mt-8 aspect-[4/3]" sizes="(min-width: 768px) 40vw, 100vw" />
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 md:col-span-6 md:col-start-7">
          {page.sisters.people.map((person) => (
            <li key={person.name} className="ap border-brique border-t-4 pt-4">
              <h3>{person.name}</h3>
              <p className="mt-2">
                <T>{person.text}</T>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section grille" aria-labelledby="hirondelles">
        <Photo id="chai" className="ap aspect-[4/3] md:col-span-7" sizes="(min-width: 768px) 58vw, 100vw" />
        <div className="ap self-center md:col-span-4 md:col-start-9">
          <h2 id="hirondelles">{page.swallows.title}</h2>
          <p className="mt-5">{page.swallows.body}</p>
        </div>
      </section>

      <section className="section grille bg-craie border-pierre border-y" aria-labelledby="terroir">
        <div className="ap md:col-span-5">
          <h2 id="terroir">{page.terroir.title}</h2>
          <p className="mt-5">{page.terroir.body}</p>
          <Photo id="vignes" className="mt-8 aspect-[552/340]" sizes="(min-width: 768px) 40vw, 100vw" />
        </div>
        <div className="ap bg-calcaire border-pierre border p-5 sm:p-8 md:col-span-6 md:col-start-7">
          <HillDiagram />
        </div>
      </section>

      <section className="section grille" aria-labelledby="travail">
        <h2 id="travail" className="ap md:col-span-12">
          {page.work.title}
        </h2>
        {page.work.blocks.map((block, i) => (
          <div
            key={block.title}
            className={`ap ${i === 0 ? "md:col-span-5" : "md:col-span-5 md:col-start-7"}`}
          >
            <Photo
              id={i === 0 ? "mains" : "barriques"}
              className="aspect-[4/3]"
              sizes="(min-width: 768px) 40vw, 100vw"
            />
            <h3 className="mt-5">{block.title}</h3>
            <p className="mt-2">
              <T>{block.text}</T>
            </p>
          </div>
        ))}
      </section>

      <section className="section grille on-dark bg-vigne text-calcaire" aria-labelledby="engagement">
        <h2 id="engagement" className="ap md:col-span-6">
          {page.commitment.title}
        </h2>
        <div className="ap md:col-span-5 md:col-start-8">
          <p>{page.commitment.body}</p>
          <p className="mt-4">
            <T>{page.commitment.note}</T>
          </p>
        </div>
      </section>

      <section className="section bg-craie border-pierre border-y" aria-labelledby="saisons">
        <h2 id="saisons" className="ap">
          {page.seasons.title}
        </h2>
        <ol className="border-encre mt-10 grid border-t sm:grid-cols-2 lg:grid-cols-4">
          {page.seasons.items.map((season) => (
            <li key={season.name} className="ap border-pierre border-b py-6 pr-6">
              <h3 className="text-vigne">{season.name}</h3>
              <p className="mt-2">{season.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section grille">
        <div className="ap md:col-span-7">
          <h2>{page.cta.title}</h2>
          <p className="chapo mt-4">{page.cta.body}</p>
        </div>
        <div className="ap flex flex-wrap items-center gap-x-6 gap-y-3 self-end md:col-span-5">
          <Link href={BOOK_HREF} className="btn btn-plein">
            {ui.cta.book}
          </Link>
          <Link href="/vins" className="lien">
            {ui.cta.seeWines}
          </Link>
        </div>
      </section>
    </>
  );
}
