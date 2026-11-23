import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { AgeGate } from "@/components/AgeGate";
import { JsonLd } from "@/components/Bits";
import { Footer, Header, MobileBar } from "@/components/Chrome";
import { getSettings, ui } from "@/lib/content";
import { wineryLd } from "@/lib/seo";
import { AGE_KEY, AGE_TTL, defaultLocale, noindex, siteUrl } from "@/lib/site";
import "./globals.css";

// Polices auto-hébergées (licence OFL, voir src/fonts) : Instrument Serif pour les titres
// et les accents en italique, Manrope pour le texte, l'interface et les fiches.
const titre = localFont({
  src: "../fonts/instrument-serif-latin-400-normal.woff2",
  weight: "400",
  variable: "--font-titre",
  display: "swap",
});
const titreItalique = localFont({
  src: "../fonts/instrument-serif-latin-400-italic.woff2",
  weight: "400",
  style: "italic",
  variable: "--font-titre-i",
  display: "swap",
});
const texte = localFont({
  src: "../fonts/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-texte",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${settings.name}, vins de Gaillac à Lisle-sur-Tarn`,
      template: `%s · ${settings.name}`,
    },
    description: settings.description,
    openGraph: { type: "website", locale: "fr_FR", siteName: settings.name },
    formatDetection: { telephone: false },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export const viewport: Viewport = { themeColor: "#F3EEE3" };

// Exécuté avant l'hydratation : évite d'afficher la vérification d'âge à qui a déjà répondu.
const ageScript = `(function(){var d=document.documentElement;d.classList.add("js");try{var t=Number(localStorage.getItem("${AGE_KEY}"));if(t>0&&Date.now()-t<${AGE_TTL})d.dataset.age="ok"}catch(e){}})()`;

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  return (
    <html
      lang={defaultLocale}
      className={`${titre.variable} ${titreItalique.variable} ${texte.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: ageScript }}
        />
        {plausibleDomain && (
          <script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" />
        )}
      </head>
      <body>
        <div id="site">
          <a
            href="#contenu"
            className="bg-encre text-calcaire absolute top-3 left-[-999px] z-50 px-3.5 py-2.5 focus:left-3"
          >
            {ui.skip}
          </a>
          <Header />
          <main id="contenu" tabIndex={-1}>
            {children}
          </main>
          <Footer settings={settings} />
          <MobileBar settings={settings} />
        </div>
        <AgeGate labels={{ ...ui.ageGate, evin: ui.evin }} />
        <JsonLd data={wineryLd(settings)} />
      </body>
    </html>
  );
}
