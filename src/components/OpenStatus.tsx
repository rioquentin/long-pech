"use client";

import { useSyncExternalStore } from "react";
import { openStatus } from "@/lib/hours";

type Hours = Record<string, { open: string; close: string }[]>;
type Labels = { open: string; closed: string; until: string; reopens: string };

const subscribe = (notify: () => void) => {
  const timer = setInterval(notify, 60_000);
  return () => clearInterval(timer);
};
const minuteNow = () => Math.floor(Date.now() / 60_000);

/** « Ouvert » ou « Fermé », calculé dans le navigateur à l'heure de Paris. Rien n'est rendu côté serveur. */
export function OpenStatus({ hours, labels }: { hours: Hours; labels: Labels }) {
  const minute = useSyncExternalStore(subscribe, minuteNow, () => null);
  if (minute === null) return <p className="min-h-[42px]" />;
  const status = openStatus(hours, new Date(minute * 60_000));
  return (
    <p
      className="inline-flex min-h-[42px] flex-wrap items-center gap-2.5 border border-current px-3.5 py-2 font-semibold"
      role="status"
    >
      <span
        className={`size-[9px] rounded-full ${status.open ? "bg-current" : "border border-current"}`}
        aria-hidden="true"
      />
      {status.open ? `${labels.open} ${labels.until} ${status.until}` : labels.closed}
      {!status.open && status.next && (
        <span className="font-normal">
          · {labels.reopens} {status.next}
        </span>
      )}
    </p>
  );
}
