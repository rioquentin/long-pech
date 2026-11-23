import Link from "next/link";
import { pages, ui, type Offer, type Settings, type WineEvent } from "@/lib/content";
import { showTodos } from "@/lib/flags";
import { asset, directionsUrl, staticExport } from "@/lib/site";
import { BOOK_HREF, fullAddress } from "./Chrome";
import { NewsletterForm } from "./Forms";
import { OpenStatus } from "./OpenStatus";
import { T } from "./T";

/** Bloc « Venir au domaine » : statut du jour, adresse, téléphones, itinéraire, offres. */
export function VisitBlock({ settings, offers }: { settings: Settings; offers: Offer[] }) {
  const { address } = settings;
  return (
    <section className="section grille on-dark bg-vigne text-calcaire" id="venir">
      <div className="ap md:col-span-6">
        <p className="sur">{pages.home.visit.kicker}</p>
        <h2 className="mt-4">{pages.home.visit.title}</h2>
      </div>
      <div className="ap md:col-span-5 md:col-start-8 md:row-span-2">
        {settings.hours ? (
          <OpenStatus hours={settings.hours} labels={ui.status} />
        ) : (
          showTodos && (
            <p className="inline-flex flex-wrap items-center gap-2.5 border border-current px-3.5 py-2 font-semibold">
              {ui.status.open} / {ui.status.closed} <T>{settings.hoursNote}</T>
            </p>
          )
        )}
        <address className="mt-6 text-[1.05rem] leading-[1.7] not-italic">
          {address.street}
          <br />
          {address.postalCode} {address.city}
        </address>
        <p className="mt-5">
          {settings.phones.map((phone) => (
            <a
              key={phone.tel}
              href={`tel:${phone.tel}`}
              className="block font-serif text-[clamp(1.6rem,3vw,2.2rem)] leading-[1.3] hover:underline"
            >
              {phone.display}
            </a>
          ))}
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <Link href={BOOK_HREF} className="btn btn-clair">
            {ui.cta.bookShort}
          </Link>
          <a
            href={directionsUrl(fullAddress(settings))}
            className="btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            {ui.cta.directions}
          </a>
        </div>
      </div>
      <ul className="ap md:col-span-6">
        {offers.map((offer) => (
          <li key={offer.slug} className="border-t border-white/35 py-[18px]">
            <b className="block font-serif text-[1.35rem] font-normal">{offer.title}</b>
            <span className="text-[0.94rem] text-[#E4E0D2]">
              <T>{offer.summary}</T>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

/** `level` : niveau du titre de chaque événement, selon le titre qui précède la liste. */
export function EventList({ events, level: Title = "h3" }: { events: WineEvent[]; level?: "h2" | "h3" }) {
  if (events.length === 0) return <p className="font-serif text-[1.5rem]">{ui.event.empty}</p>;
  return (
    <ul>
      {events.map((event) => (
        <li
          key={event.slug}
          className="ap border-encre grid gap-2 border-t py-6 last:border-b md:grid-cols-[12rem_1fr_auto] md:gap-6"
        >
          <p className="font-serif text-[1.3rem] leading-tight">
            {event.start ? (
              <time dateTime={event.start}>{dateFormat.format(new Date(event.start))}</time>
            ) : (
              <T>{event.dateNote}</T>
            )}
          </p>
          <div>
            <p className="sur">{event.kind}</p>
            <Title className="mt-1 mb-1 font-serif text-[1.5rem] leading-[1.15]">{event.title}</Title>
            <p className="text-encre-2 text-[0.95rem]">
              <T>{event.summary}</T>
            </p>
            {event.details && (
              <p className="text-encre-2 mt-1 text-[0.95rem]">
                <T>{event.details}</T>
              </p>
            )}
          </div>
          {!event.start ? (
            <p className="legal max-w-[22ch] self-start">{ui.event.icsPending}</p>
          ) : staticExport ? null : (
            <a href={asset(`/evenements/${event.slug}/calendrier.ics`)} className="lien self-start" download>
              {ui.event.ics}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

export function NewsletterSection() {
  return (
    <section className="section grille bg-craie border-pierre border-t">
      <div className="ap md:col-span-6">
        <h2>{ui.newsletter.title}</h2>
        <p className="chapo mt-4 max-w-[44ch]">{ui.newsletter.body}</p>
      </div>
      <div className="ap self-end md:col-span-5 md:col-start-8">
        <NewsletterForm labels={ui.newsletter} honeypot={ui.form.honeypot} />
      </div>
    </section>
  );
}

/** Horaires jour par jour, ou le TODO tant que le client ne les a pas donnés. */
export function HoursList({ settings }: { settings: Settings }) {
  if (!settings.hours) {
    return (
      <p>
        <T>{settings.hoursNote}</T>
      </p>
    );
  }
  const order = [1, 2, 3, 4, 5, 6, 0];
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
      {order.map((day) => {
        const slots = settings.hours?.[String(day)] ?? [];
        return (
          <div key={day} className="contents">
            <dt>{ui.days[day]}</dt>
            <dd>{slots.length ? slots.map((s) => `${s.open} – ${s.close}`).join(", ") : ui.closedDay}</dd>
          </div>
        );
      })}
    </dl>
  );
}

/** Coupe schématique de la colline. Les libellés sont dans la légende numérotée, lisible par tous. */
export function HillDiagram() {
  const { diagram, diagramTitle } = pages.domaine.terroir;
  const legend = [diagram.ridge, diagram.slopes, diagram.soil, diagram.river, diagram.exposure];
  const dots: [number, number][] = [
    [400, 92],
    [250, 170],
    [400, 250],
    [735, 262],
    [560, 170],
  ];
  return (
    <figure>
      <svg viewBox="0 0 800 320" role="img" aria-labelledby="coupe-titre" className="w-full">
        <title id="coupe-titre">{diagramTitle}</title>
        <path d="M0 290 Q200 270 300 150 Q400 60 500 150 Q600 270 800 290 V320 H0Z" fill="#D8CFBD" />
        <path
          d="M0 290 Q200 270 300 150 Q400 60 500 150 Q600 270 800 290"
          fill="none"
          stroke="#3F4F36"
          strokeWidth="10"
        />
        <g stroke="#1D2A3A" strokeWidth="1" opacity=".35">
          <path d="M150 300h500M210 280h380M270 255h260M320 225h160" />
        </g>
        <rect x="383" y="78" width="34" height="22" fill="#1D2A3A" />
        <path d="M378 80l22-16 22 16z" fill="#A3432C" />
        <path d="M690 296q22-10 44 0t44 0" fill="none" stroke="#8AA3A8" strokeWidth="5" />
        {dots.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y - 34} r="15" fill="#FBF8F1" stroke="#1D2A3A" />
            <text x={x} y={y - 28} textAnchor="middle" fontSize="16" fontWeight="600" fill="#1D2A3A">
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
      <figcaption>
        <ol className="mt-5 grid gap-2 sm:grid-cols-2">
          {legend.map((text, i) => (
            <li key={i} className="flex gap-3">
              <span className="border-encre grid size-7 flex-none place-items-center rounded-full border text-[0.85rem] font-semibold">
                {i + 1}
              </span>
              <span>
                <T>{text}</T>
              </span>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
