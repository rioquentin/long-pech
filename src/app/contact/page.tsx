import { Breadcrumb, PageHeader } from "@/components/Bits";
import { fullAddress } from "@/components/Chrome";
import { ContactForm } from "@/components/Forms";
import { MapEmbed } from "@/components/MapEmbed";
import { HoursList } from "@/components/Sections";
import { T } from "@/components/T";
import { getSettings, pages, ui } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { directionsUrl } from "@/lib/site";

const page = pages.contact;
export const metadata = pageMeta(page.meta, "/contact");

export default async function Contact() {
  const settings = await getSettings();
  const { address } = settings;
  const l = page.labels;
  return (
    <>
      <Breadcrumb items={[{ href: "/contact", label: page.kicker }]} />
      <PageHeader kicker={page.kicker} title={page.title} intro={page.intro} />

      <section className="wrap grille pb-[clamp(64px,10vw,120px)]">
        <dl className="grid gap-7 md:col-span-5">
          <div>
            <dt className="sur">{l.address}</dt>
            <dd className="mt-2 text-[1.15rem]">
              <address className="not-italic">
                {settings.name}
                <br />
                {address.street}
                <br />
                {address.postalCode} {address.city}
              </address>
              <a
                href={directionsUrl(fullAddress(settings))}
                className="btn btn-plein mt-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                {ui.cta.directions}
              </a>
            </dd>
          </div>
          <div>
            <dt className="sur">{l.phone}</dt>
            <dd className="mt-2">
              {settings.phones.map((phone) => (
                <a
                  key={phone.tel}
                  href={`tel:${phone.tel}`}
                  className="block font-serif text-[1.8rem] hover:underline"
                >
                  {phone.display}
                </a>
              ))}
            </dd>
          </div>
          {settings.email && (
            <div>
              <dt className="sur">{l.email}</dt>
              <dd className="mt-2">
                <a href={`mailto:${settings.email}`} className="lien">
                  {settings.email}
                </a>
              </dd>
            </div>
          )}
          <div>
            <dt className="sur">{l.hours}</dt>
            <dd className="mt-2">
              <HoursList settings={settings} />
            </dd>
          </div>
        </dl>
        <div className="md:col-span-6 md:col-start-7">
          {settings.geo ? (
            <MapEmbed geo={settings.geo} labels={ui.map} />
          ) : (
            <div className="bg-craie border-pierre grid aspect-[4/3] place-items-center border p-6 text-center">
              <p>
                <T>{ui.map.todo}</T>
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section grille bg-craie border-pierre border-y" aria-labelledby="itineraires">
        <h2 id="itineraires" className="md:col-span-4">
          {page.routesTitle}
        </h2>
        <div className="md:col-span-7 md:col-start-6">
          <ul>
            {page.routes.map((route) => (
              <li
                key={route.from}
                className="border-encre flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t py-4 last:border-b"
              >
                <span>
                  <b className="font-serif text-[1.5rem] font-normal">{route.from}</b>{" "}
                  <span className="text-encre-2">· {route.distance}</span>
                </span>
                <a
                  href={directionsUrl(fullAddress(settings), route.from)}
                  className="lien"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {page.routeCta} {route.from}
                </a>
              </li>
            ))}
          </ul>
          <dl className="mt-10 grid gap-6 sm:grid-cols-2">
            {page.practical.map((item) => (
              <div key={item.title}>
                <dt className="sur">{item.title}</dt>
                <dd className="mt-2">
                  <T>{item.text}</T>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section grille" aria-labelledby="ecrire">
        <h2 id="ecrire" className="md:col-span-4">
          {page.formTitle}
        </h2>
        <div className="md:col-span-7 md:col-start-6">
          <ContactForm labels={ui.form} />
        </div>
      </section>
    </>
  );
}
