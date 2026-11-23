import { Breadcrumb, JsonLd, PageHeader } from "@/components/Bits";
import { EventList, NewsletterSection } from "@/components/Sections";
import { getSettings, getUpcomingEvents, pages } from "@/lib/content";
import { eventLd, pageMeta } from "@/lib/seo";

const page = pages.evenements;
export const metadata = pageMeta(page.meta, "/evenements");

export default async function Evenements() {
  const [events, settings] = await Promise.all([getUpcomingEvents(), getSettings()]);
  return (
    <>
      <Breadcrumb items={[{ href: "/evenements", label: page.kicker }]} />
      <PageHeader kicker={page.kicker} title={page.title} intro={page.intro} />
      <section className="wrap pb-[clamp(64px,10vw,140px)]">
        <EventList events={events} />
      </section>
      <NewsletterSection />
      {events.map((event) => {
        const ld = eventLd(event, settings);
        return ld ? <JsonLd key={event.slug} data={ld} /> : null;
      })}
    </>
  );
}
