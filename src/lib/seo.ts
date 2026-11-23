import type { Metadata } from "next";
import type { Settings, Wine, WineEvent } from "./content/schemas";
import { siteUrl, stripTodos } from "./site";

export function pageMeta(meta: { title: string; description: string }, path: string): Metadata {
  return {
    title: meta.title,
    description: stripTodos(meta.description),
    alternates: { canonical: path },
    openGraph: { title: meta.title, description: stripTodos(meta.description), url: path },
  };
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function wineryLd(s: Settings) {
  return {
    "@context": "https://schema.org",
    "@type": "Winery",
    "@id": `${siteUrl}/#domaine`,
    name: s.name,
    description: s.description,
    url: siteUrl,
    telephone: s.phones.map((p) => p.tel),
    ...(s.email ? { email: s.email } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: s.address.street,
      postalCode: s.address.postalCode,
      addressLocality: s.address.city,
      addressRegion: s.address.region,
      addressCountry: s.address.country,
    },
    ...(s.geo ? { geo: { "@type": "GeoCoordinates", latitude: s.geo.lat, longitude: s.geo.lng } } : {}),
    ...(s.hours
      ? {
          openingHoursSpecification: Object.entries(s.hours).flatMap(([day, slots]) =>
            slots.map((slot) => ({
              "@type": "OpeningHoursSpecification",
              dayOfWeek: DAYS[Number(day)],
              opens: slot.open,
              closes: slot.close,
            })),
          ),
        }
      : {}),
  };
}

/** Produit sans prix en V1. L'offre n'apparaît que si le commerce est actif et le prix connu. */
export function productLd(wine: Wine, commerce: boolean) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: wine.vintage ? `${wine.name} ${wine.vintage}` : wine.name,
    category: "Vin",
    url: `${siteUrl}/vins/${wine.slug}`,
    brand: { "@type": "Brand", name: "Domaine de Long-Pech" },
    ...(wine.story ? { description: stripTodos(wine.story) } : {}),
    ...(wine.sku ? { sku: wine.sku } : {}),
    additionalProperty: [
      ...(wine.appellation
        ? [{ "@type": "PropertyValue", name: "Appellation", value: wine.appellation }]
        : []),
      { "@type": "PropertyValue", name: "Cépages", value: wine.grapes.map((g) => g.name).join(", ") },
    ],
    ...(commerce && wine.purchasable && wine.price !== null
      ? {
          offers: {
            "@type": "Offer",
            price: wine.price,
            priceCurrency: "EUR",
            availability: wine.stock === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

export function eventLd(event: WineEvent, s: Settings) {
  if (!event.start) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: stripTodos(event.summary),
    startDate: event.start,
    ...(event.end ? { endDate: event.end } : {}),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: s.name,
      address: `${s.address.street}, ${s.address.postalCode} ${s.address.city}`,
    },
    organizer: { "@id": `${siteUrl}/#domaine` },
  };
}
