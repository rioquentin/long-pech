import { Breadcrumb, EvinNotice, PageHeader } from "@/components/Bits";
import { T } from "@/components/T";
import { pages, ui } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export type LegalSlug = keyof typeof pages.legal;

export const legalMeta = (slug: LegalSlug) =>
  pageMeta({ title: pages.legal[slug].title, description: pages.legal[slug].description }, `/${slug}`);

export function LegalPage({ slug }: { slug: LegalSlug }) {
  const page = pages.legal[slug];
  return (
    <>
      <Breadcrumb items={[{ href: `/${slug}`, label: page.title }]} />
      <PageHeader kicker={ui.footer.legalNav} title={page.title} />
      <div className="wrap pb-[clamp(64px,10vw,120px)]">
        <div className="max-w-[68ch]">
          {page.sections.map((section) => (
            <section key={section.title} className="border-pierre border-t py-8">
              <h2 className="text-[1.8rem]">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-3">
                  <T>{paragraph}</T>
                </p>
              ))}
            </section>
          ))}
          {slug === "cgv" && <EvinNotice className="border-pierre border-t pt-6 text-[0.92rem]" />}
        </div>
      </div>
    </>
  );
}
