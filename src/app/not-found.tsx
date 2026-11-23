import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/Photo";
import { Swallow } from "@/components/Swallow";
import { pages, ui } from "@/lib/content";

export const metadata: Metadata = { title: pages.notFound.title, robots: { index: false } };

export default function NotFound() {
  const page = pages.notFound;
  return (
    <div className="grille wrap items-center py-12 sm:py-20">
      <div className="md:col-span-6">
        <p className="sur flex items-center gap-2.5">
          <Swallow className="text-brique h-5" />
          404
        </p>
        <h1 className="mt-4">{page.title}</h1>
        <p className="chapo mt-5 text-[1.15rem]">{page.body}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/" className="btn btn-plein">
            {ui.home}
          </Link>
          <Link href="/vins" className="lien">
            {ui.cta.seeWines}
          </Link>
          <Link href="/visites" className="lien">
            {ui.cta.visits}
          </Link>
        </div>
      </div>
      <Photo
        id="chemin"
        className="aspect-[4/5] md:col-span-5 md:col-start-8"
        sizes="(min-width: 768px) 40vw, 100vw"
      />
    </div>
  );
}
