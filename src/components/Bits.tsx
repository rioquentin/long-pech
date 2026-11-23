import Link from "next/link";
import { ui } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import { Swallow } from "./Swallow";
import { T } from "./T";

/** Mention sanitaire obligatoire (loi Évin) : pied de page, fiches vin, pages commerce. */
export function EvinNotice({ className = "" }: { className?: string }) {
  return <p className={`font-semibold ${className}`}>{ui.evin}</p>;
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export type Crumb = { href: string; label: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  const all = [{ href: "/", label: ui.home }, ...items];
  return (
    <nav aria-label={ui.breadcrumb} className="wrap text-encre-2 pt-6 text-[0.85rem]">
      <ol className="flex flex-wrap gap-x-2">
        {all.map((item, i) => (
          <li key={item.href} className="flex gap-x-2">
            {i < all.length - 1 ? (
              <>
                <Link href={item.href} className="inline-block py-1 underline underline-offset-4">
                  {item.label}
                </Link>
                <span aria-hidden="true" className="py-1">
                  /
                </span>
              </>
            ) : (
              <span aria-current="page" className="py-1">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.label,
            item: `${siteUrl}${item.href}`,
          })),
        }}
      />
    </nav>
  );
}

/** En-tête de page éditoriale : surtitre, titre, chapô. */
export function PageHeader({ kicker, title, intro }: { kicker: string; title: string; intro?: string }) {
  return (
    <header className="wrap grille pt-10 pb-12 sm:pt-16 sm:pb-20">
      <div className="lg:col-span-9">
        <p className="sur flex items-center gap-2.5">
          <Swallow className="text-braucol h-5" />
          {kicker}
        </p>
        <h1 className="mt-4">{title}</h1>
      </div>
      {intro && (
        <p className="chapo text-[1.15rem] lg:col-span-7">
          <T>{intro}</T>
        </p>
      )}
    </header>
  );
}
