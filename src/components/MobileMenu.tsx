"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "./NavLink";

type Props = {
  items: { href: string; label: string }[];
  labels: { open: string; close: string };
  cta: { href: string; label: string };
};

export function MobileMenu({ items, labels, cta }: Props) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={button}
        type="button"
        className="border-encre min-h-11 border px-3.5 text-[0.8rem] font-semibold tracking-[0.12em] uppercase"
        aria-expanded={open}
        aria-controls="menu-mobile"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? labels.close : labels.open}
      </button>
      <nav
        id="menu-mobile"
        aria-label={labels.open}
        hidden={!open}
        className="bg-calcaire border-encre wrap absolute inset-x-0 top-full z-40 border-b pt-2 pb-8"
      >
        <ul>
          {items.map((item) => (
            <li key={item.href} className="border-pierre border-b">
              <NavLink
                href={item.href}
                className="aria-[current]:text-brique block py-4 font-serif text-[1.6rem]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <Link href={cta.href} className="btn btn-plein mt-6 w-full" onClick={() => setOpen(false)}>
          {cta.label}
        </Link>
      </nav>
    </div>
  );
}
