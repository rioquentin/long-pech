import Image from "next/image";
import Link from "next/link";
import { ui, type Settings } from "@/lib/content";
import { asset, directionsUrl } from "@/lib/site";
import { EvinNotice } from "./Bits";
import { MobileMenu } from "./MobileMenu";
import { RidgeEdge } from "./Motifs";
import { NavLink } from "./NavLink";

export const BOOK_HREF = "/visites#reserver";

export const fullAddress = (s: Settings) =>
  `${s.name}, ${s.address.street}, ${s.address.postalCode} ${s.address.city}`;

/** Logo repris de l'ancien site (bitmap sur fond blanc) : fondu dans le fond par mélange de couleurs. */
function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="block">
      <Image
        src={asset("/photos/logo-long-pech.jpg")}
        alt={ui.logoAlt}
        width={312}
        height={81}
        priority={!dark}
        className={`h-11 w-auto ${dark ? "mix-blend-screen invert" : "mix-blend-multiply"}`}
      />
    </Link>
  );
}

export function Header() {
  return (
    <header className="wrap bg-calcaire border-pierre relative z-20 flex items-center justify-between gap-6 border-b py-5">
      <Logo />
      <nav aria-label={ui.navLabel} className="max-lg:hidden">
        <ul className="flex gap-4 text-[0.95rem] whitespace-nowrap xl:gap-7">
          {ui.nav.map((item) => (
            <li key={item.href}>
              <NavLink
                href={item.href}
                className="inline-block py-2 hover:underline hover:underline-offset-8 aria-[current]:underline aria-[current]:underline-offset-8"
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {/* Libellé court entre 1024 et 1279 px, où la navigation prend presque toute la largeur. */}
      <Link href={BOOK_HREF} className="btn btn-plein whitespace-nowrap max-lg:hidden">
        <span className="xl:hidden">{ui.cta.bookShort}</span>
        <span className="max-xl:hidden">{ui.cta.book}</span>
      </Link>
      <MobileMenu items={ui.nav} labels={ui.menu} cta={{ href: BOOK_HREF, label: ui.cta.book }} />
    </header>
  );
}

export function Footer({ settings }: { settings: Settings }) {
  const { address } = settings;
  return (
    <>
      {/* La colline se dessine par-dessus le bas de la dernière section, quelle que soit sa couleur. */}
      <RidgeEdge className="text-encre relative -mt-[clamp(28px,5vw,72px)] -mb-px h-[clamp(28px,5vw,72px)]" />
      <footer className="on-dark bg-encre text-calcaire wrap pt-10 pb-10 text-[0.92rem]">
        <div className="grille">
          <div className="md:col-span-4">
            <Logo dark />
            <p className="mt-4">
              {settings.owners}
              <br />
              {ui.footer.independent}
            </p>
          </div>
          <address className="not-italic md:col-span-4">
            {address.street}
            <br />
            {address.postalCode} {address.city}
            <br />
            {settings.phones.map((phone, i) => (
              <span key={phone.tel}>
                {i > 0 && " · "}
                <a href={`tel:${phone.tel}`} className="inline-block py-1.5 underline underline-offset-4">
                  {phone.display}
                </a>
              </span>
            ))}
          </address>
          <nav aria-label={ui.footer.legalNav} className="md:col-span-4">
            <ul>
              {ui.footer.legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-block py-1.5 underline underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <EvinNotice className="mt-10 border-t border-white/30 pt-6" />
      </footer>
    </>
  );
}

/** Barre d'action fixe, mobile uniquement : appeler, itinéraire, réserver. */
export function MobileBar({ settings }: { settings: Settings }) {
  const mobile = settings.phones.at(-1);
  return (
    <nav className="barre" aria-label={ui.mobileBar}>
      {mobile && <a href={`tel:${mobile.tel}`}>{ui.cta.call}</a>}
      <a href={directionsUrl(fullAddress(settings))} target="_blank" rel="noopener noreferrer">
        {ui.cta.directions}
      </a>
      <Link href={BOOK_HREF}>{ui.cta.bookShort}</Link>
    </nav>
  );
}
