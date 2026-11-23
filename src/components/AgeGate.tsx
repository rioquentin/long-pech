"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AGE_KEY, ageValid } from "@/lib/site";
import { Swallow } from "./Swallow";

type Labels = {
  title: string;
  body: string;
  yes: string;
  no: string;
  note: string;
  deniedTitle: string;
  denied: string;
  back: string;
  evin: string;
};

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Vérification d'âge (18+). Le contenu reste dans le HTML : les moteurs l'indexent.
 * L'affichage est décidé avant hydratation par le script en ligne de layout.tsx,
 * ce composant gère le focus, l'inertie de la page et la mémorisation.
 */
export function AgeGate({ labels }: { labels: Labels }) {
  const [denied, setDenied] = useState(false);
  const yes = useRef<HTMLButtonElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const toggled = useRef(false);

  // Après « Non » ou « Je me suis trompé », le bouton cliqué disparaît : le focus va au nouveau titre.
  useEffect(() => {
    if (toggled.current) title.current?.focus();
  }, [denied]);
  const toggle = (value: boolean) => {
    toggled.current = true;
    setDenied(value);
  };

  useIsoLayoutEffect(() => {
    const root = document.documentElement;
    let ok = false;
    try {
      ok = ageValid(localStorage.getItem(AGE_KEY));
    } catch {}
    root.classList.add("js");
    if (ok) {
      root.dataset.age = "ok";
      return;
    }
    const site = document.getElementById("site");
    site?.setAttribute("inert", "");
    yes.current?.focus();
    return () => site?.removeAttribute("inert");
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(AGE_KEY, String(Date.now()));
    } catch {}
    document.documentElement.dataset.age = "ok";
    const site = document.getElementById("site");
    site?.removeAttribute("inert");
    document.getElementById("contenu")?.focus();
  };

  return (
    <div
      className="age-gate bg-encre/95 fixed inset-0 z-50 place-items-center overflow-y-auto p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-title"
      aria-describedby="age-body"
      data-testid="age-gate"
    >
      <div className="bg-calcaire text-encre w-full max-w-[30rem] p-7 sm:p-10">
        <Swallow className="text-brique mb-4 h-10" />
        {denied ? (
          <>
            <h2 id="age-title" ref={title} tabIndex={-1} className="text-[2rem]">
              {labels.deniedTitle}
            </h2>
            <p id="age-body" className="mt-4">
              {labels.denied}
            </p>
            <button type="button" className="lien mt-6" onClick={() => toggle(false)}>
              {labels.back}
            </button>
          </>
        ) : (
          <>
            <h2 id="age-title" ref={title} tabIndex={-1} className="text-[2rem]">
              {labels.title}
            </h2>
            <p id="age-body" className="mt-4">
              {labels.body}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button ref={yes} type="button" className="btn btn-plein" onClick={accept}>
                {labels.yes}
              </button>
              <button type="button" className="btn" onClick={() => toggle(true)}>
                {labels.no}
              </button>
            </div>
            <p className="legal mt-6">{labels.note}</p>
            <p className="mt-4 text-[0.88rem] font-semibold">{labels.evin}</p>
          </>
        )}
      </div>
    </div>
  );
}
