import { getEvents, getSettings } from "@/lib/content";
import { buildIcs } from "@/lib/ics";
import { siteUrl } from "@/lib/site";

export async function generateStaticParams() {
  return (await getEvents()).map((event) => ({ slug: event.slug }));
}

/** Fichier .ics d'un événement. 404 si l'événement n'existe pas ou n'a pas encore de date. */
export async function GET(_request: Request, { params }: RouteContext<"/evenements/[slug]/calendrier.ics">) {
  const { slug } = await params;
  const [events, settings] = await Promise.all([getEvents(), getSettings()]);
  const event = events.find((e) => e.slug === slug);
  const ics = event ? buildIcs(event, settings, siteUrl) : null;
  if (!ics) return new Response("Not found", { status: 404 });
  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.ics"`,
    },
  });
}
