import { Breadcrumb, EvinNotice, PageHeader } from "@/components/Bits";
import { BookingForm } from "@/components/Forms";
import { Photo } from "@/components/Photo";
import { HoursList } from "@/components/Sections";
import { T } from "@/components/T";
import { getOffers, getSettings, pages, ui } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

const page = pages.visites;
export const metadata = pageMeta(page.meta, "/visites");

export default async function Visites() {
  const [offers, settings] = await Promise.all([getOffers(), getSettings()]);
  const l = page.labels;
  return (
    <>
      <Breadcrumb items={[{ href: "/visites", label: page.kicker }]} />
      <PageHeader kicker={page.kicker} title={page.title} intro={page.intro} />
      <Photo id="caveau" className="aspect-[4/3] md:aspect-[21/9]" priority />

      <section className="section" aria-label={page.kicker}>
        <ul className="grid gap-6 lg:grid-cols-3">
          {offers.map((offer) => (
            <li key={offer.slug} className="ap bg-craie border-brique flex flex-col border-t-4 p-6 sm:p-8">
              <h2 className="text-[2rem]">{offer.title}</h2>
              <p className="chapo mt-3">
                <T>{offer.summary}</T>
              </p>
              <h3 className="sur mt-6 font-sans">{l.includes}</h3>
              <ul className="mt-2 list-disc pl-5">
                {offer.includes.map((item) => (
                  <li key={item}>
                    <T>{item}</T>
                  </li>
                ))}
              </ul>
              <dl className="border-pierre mt-6 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 border-t pt-5 text-[0.95rem]">
                {(
                  [
                    [l.group, offer.groupSize],
                    [l.duration, offer.duration],
                    [l.price, offer.price],
                    [l.booking, offer.booking],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label} className="contents">
                    <dt className="text-encre-2">{label}</dt>
                    <dd>
                      <T>{value}</T>
                    </dd>
                  </div>
                ))}
              </dl>
              <a href="#reserver" className="btn mt-auto self-start" style={{ marginTop: "1.75rem" }}>
                {l.choose}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="section grille bg-craie border-pierre border-y"
        id="reserver"
        aria-labelledby="reserver-titre"
      >
        <div className="md:col-span-5">
          <Photo id="verres" className="mb-8 aspect-[552/340]" sizes="(min-width: 768px) 40vw, 100vw" />
          <h2 id="reserver-titre">{page.formTitle}</h2>
          <p className="chapo mt-5">{page.formIntro}</p>
          <p className="mt-6">
            {settings.phones.map((phone) => (
              <a
                key={phone.tel}
                href={`tel:${phone.tel}`}
                className="block font-serif text-[1.8rem] hover:underline"
              >
                {phone.display}
              </a>
            ))}
          </p>
          <h3 className="sur mt-8 font-sans">{pages.contact.labels.hours}</h3>
          <div className="mt-2">
            <HoursList settings={settings} />
          </div>
          <h3 className="sur mt-8 font-sans">{page.practical.title}</h3>
          <ul className="mt-2 grid gap-2">
            {page.practical.items.map((item) => (
              <li key={item}>
                <T>{item}</T>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <BookingForm labels={ui.form} offers={offers.map((o) => ({ slug: o.slug, title: o.title }))} />
        </div>
      </section>
      <div className="wrap py-8">
        <EvinNotice className="text-[0.92rem]" />
      </div>
    </>
  );
}
