import Link from "next/link";
import { Breadcrumb, EvinNotice, PageHeader } from "@/components/Bits";
import { T } from "@/components/T";
import { getGrapes, getWines, pages } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

const page = pages.cepages;
export const metadata = pageMeta(page.meta, "/vins/cepages");

export default async function Cepages() {
  const [grapes, wines] = await Promise.all([getGrapes(), getWines()]);
  return (
    <>
      <Breadcrumb
        items={[
          { href: "/vins", label: pages.vins.kicker },
          { href: "/vins/cepages", label: page.title },
        ]}
      />
      <PageHeader kicker={page.kicker} title={page.title} intro={page.intro} />
      <section className="wrap pb-[clamp(64px,10vw,140px)]">
        <ul className="border-encre border-t">
          {grapes.map((grape) => (
            <li key={grape.slug} id={grape.slug} className="ap grille border-pierre border-b py-10">
              <div className="md:col-span-4">
                <h2 className="text-[clamp(2rem,4vw,3rem)]">{grape.name}</h2>
                <p className="sur mt-3">
                  {page.colorLabels[grape.color]}
                  {grape.native && ` · ${page.nativeLabel}`}
                </p>
              </div>
              <div className="md:col-span-7 md:col-start-6">
                <p className="occ">{grape.aka}</p>
                <p className="mt-3 text-[1.1rem]">{grape.summary}</p>
                <h3 className="sur mt-6 font-sans">{page.atDomain}</h3>
                <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                  {grape.atDomain.map((slug) => {
                    const wine = wines.find((w) => w.slug === slug);
                    return wine ? (
                      <li key={slug}>
                        <Link href={`/vins/${slug}`} className="lien">
                          {wine.name}
                        </Link>
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <T>{page.note}</T>
        </p>
        <EvinNotice className="mt-8 text-[0.92rem]" />
      </section>
    </>
  );
}
