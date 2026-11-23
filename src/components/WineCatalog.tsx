"use client";

import { Children, useState } from "react";

export type CatalogItem = {
  slug: string;
  type: string;
  appellation: string | null;
  sweetness: string | null;
  grapes: string[];
};

type Labels = {
  title: string;
  type: string;
  appellation: string;
  sweetness: string;
  grape: string;
  all: string;
  allF: string;
  reset: string;
  countOne: string;
  countMany: string;
  empty: string;
};

type Option = { value: string; label: string; color?: string };

/**
 * Catalogue filtrable. Les cartes sont rendues côté serveur et passées en children,
 * dans le même ordre que `items` : ce composant ne fait que choisir lesquelles montrer.
 */
export function WineCatalog({
  items,
  labels,
  types,
  appellations,
  sweetness,
  grapes,
  children,
}: {
  items: CatalogItem[];
  labels: Labels;
  types: Option[];
  appellations: Option[];
  sweetness: Option[];
  grapes: Option[];
  children: React.ReactNode;
}) {
  const [filters, setFilters] = useState({ type: "", appellation: "", sweetness: "", grape: "" });
  const cards = Children.toArray(children);
  const visible = items
    .map((item, i) => ({ item, card: cards[i] }))
    .filter(
      ({ item }) =>
        (!filters.type || item.type === filters.type) &&
        (!filters.appellation || item.appellation === filters.appellation) &&
        (!filters.sweetness || item.sweetness === filters.sweetness) &&
        (!filters.grape || item.grapes.includes(filters.grape)),
    );
  const active = Object.values(filters).some(Boolean);
  const set = (key: keyof typeof filters, value: string) => setFilters((f) => ({ ...f, [key]: value }));

  const select = (
    key: "appellation" | "sweetness" | "grape",
    label: string,
    options: Option[],
    all: string,
  ) => (
    <div className="champ">
      <label htmlFor={`filtre-${key}`}>{label}</label>
      <select id={`filtre-${key}`} value={filters[key]} onChange={(e) => set(key, e.target.value)}>
        <option value="">{all}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      <form
        aria-label={labels.title}
        className="border-encre grid gap-6 border-y py-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <fieldset>
          <legend className="mb-2 text-[0.9rem] font-semibold">{labels.type}</legend>
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button
                key={t.value}
                type="button"
                aria-pressed={filters.type === t.value}
                onClick={() => set("type", filters.type === t.value ? "" : t.value)}
                className="badge border-encre aria-pressed:bg-encre aria-pressed:text-calcaire min-h-11 border px-3.5"
                style={{ "--c": t.color } as React.CSSProperties}
              >
                {t.label}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 sm:gap-5 max-sm:[&>*:last-child]:col-span-2">
          {select("appellation", labels.appellation, appellations, labels.allF)}
          {select("sweetness", labels.sweetness, sweetness, labels.allF)}
          {select("grape", labels.grape, grapes, labels.all)}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p aria-live="polite" data-testid="wine-count" className="font-semibold">
            {visible.length} {visible.length > 1 ? labels.countMany : labels.countOne}
          </p>
          {active && (
            <button
              type="button"
              className="lien"
              onClick={() => setFilters({ type: "", appellation: "", sweetness: "", grape: "" })}
            >
              {labels.reset}
            </button>
          )}
        </div>
      </form>
      {visible.length === 0 ? (
        <p className="py-16 font-serif text-[1.5rem]">{labels.empty}</p>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-7 md:grid-cols-3 xl:grid-cols-4">
          {visible.map(({ card }) => card)}
        </ul>
      )}
    </>
  );
}
