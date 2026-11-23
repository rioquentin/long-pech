"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef } from "react";
import { bookingAction, contactAction, newsletterAction, type FormState } from "@/app/actions";

const initial: FormState = { status: "idle", errors: {}, values: {} };

type FormLabels = (typeof import("../../content/fr/ui.json"))["form"];

/** Champ étiqueté, avec message d'erreur relié par aria-describedby. */
function Field({
  name,
  label,
  state,
  labels,
  as = "input",
  required = false,
  hint,
  children,
  ...rest
}: {
  name: string;
  label: string;
  state: FormState;
  labels: FormLabels;
  as?: "input" | "select" | "textarea";
  required?: boolean;
  hint?: string;
  children?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const error = state.errors[name] ? (labels.errors as Record<string, string>)[name] : undefined;
  const shared = {
    id,
    name,
    required,
    defaultValue: state.values[name] ?? "",
    "aria-invalid": error ? true : undefined,
    "aria-describedby": [error && `${id}-err`, hint && `${id}-aide`].filter(Boolean).join(" ") || undefined,
  };
  return (
    <div className="champ">
      <label htmlFor={id}>
        {label}{" "}
        <span className="text-encre-2 font-normal">({required ? labels.required : labels.optional})</span>
      </label>
      {as === "select" ? (
        <select {...shared}>{children}</select>
      ) : as === "textarea" ? (
        <textarea {...shared} rows={5} />
      ) : (
        <input {...shared} {...rest} />
      )}
      {hint && (
        <p id={`${id}-aide`} className="aide">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="err">
          {error}
        </p>
      )}
    </div>
  );
}

/** Pot de miel anti-spam : invisible, hors tabulation, ignoré des lecteurs d'écran. */
function Honeypot({ label }: { label: string }) {
  return (
    <div className="pot" aria-hidden="true">
      <label>
        {label}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

/** Message de résultat, annoncé et mis au focus dès qu'il apparaît. */
function useStatusFocus(state: FormState) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.status !== "idle") ref.current?.focus();
  }, [state]);
  return ref;
}

function Success({
  title,
  body,
  focusRef,
}: {
  title: string;
  body: string;
  focusRef: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={focusRef}
      tabIndex={-1}
      role="status"
      className="border-vigne bg-craie border-l-4 p-6"
      data-testid="form-success"
    >
      <p className="font-serif text-[1.6rem] leading-tight">{title}</p>
      <p className="mt-2">{body}</p>
    </div>
  );
}

function ErrorSummary({
  state,
  labels,
  focusRef,
}: {
  state: FormState;
  labels: FormLabels;
  focusRef: React.Ref<HTMLDivElement>;
}) {
  if (state.status !== "error") return null;
  return (
    <div
      ref={focusRef}
      tabIndex={-1}
      role="alert"
      className="border-braucol border-l-4 py-2 pl-4 font-semibold"
    >
      {state.errors.demo ? labels.demoNotice : state.errors.send ? labels.sendError : labels.errorTitle}
    </div>
  );
}

export function BookingForm({
  labels,
  offers,
}: {
  labels: FormLabels;
  offers: { slug: string; title: string }[];
}) {
  const [state, action, pending] = useActionState(bookingAction, initial);
  const focusRef = useStatusFocus(state);
  if (state.status === "success") {
    return <Success title={labels.bookingSuccessTitle} body={labels.bookingSuccess} focusRef={focusRef} />;
  }
  const field = { state, labels };
  return (
    <form action={action} noValidate className="grid gap-5" data-testid="booking-form">
      <ErrorSummary state={state} labels={labels} focusRef={focusRef} />
      <Field {...field} name="offer" label={labels.offer} as="select" required>
        <option value="">—</option>
        {offers.map((offer) => (
          <option key={offer.slug} value={offer.slug}>
            {offer.title}
          </option>
        ))}
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field {...field} name="date" label={labels.date} type="date" required />
        <Field
          {...field}
          name="people"
          label={labels.people}
          type="number"
          min={1}
          max={20}
          inputMode="numeric"
          required
        />
      </div>
      <Field {...field} name="name" label={labels.name} autoComplete="name" required />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field {...field} name="email" label={labels.email} type="email" autoComplete="email" required />
        <Field {...field} name="phone" label={labels.phone} type="tel" autoComplete="tel" />
      </div>
      <Field {...field} name="message" label={labels.message} as="textarea" hint={labels.messageHint} />
      <Honeypot label={labels.honeypot} />
      <p className="legal">{labels.bookingLegal}</p>
      <button type="submit" className="btn btn-plein justify-self-start" disabled={pending}>
        {pending ? labels.sending : labels.sendBooking}
      </button>
    </form>
  );
}

export function ContactForm({ labels }: { labels: FormLabels }) {
  const [state, action, pending] = useActionState(contactAction, initial);
  const focusRef = useStatusFocus(state);
  if (state.status === "success") {
    return <Success title={labels.contactSuccessTitle} body={labels.contactSuccess} focusRef={focusRef} />;
  }
  const field = { state, labels };
  return (
    <form action={action} noValidate className="grid gap-5" data-testid="contact-form">
      <ErrorSummary state={state} labels={labels} focusRef={focusRef} />
      <Field {...field} name="name" label={labels.name} autoComplete="name" required />
      <Field {...field} name="email" label={labels.email} type="email" autoComplete="email" required />
      <Field {...field} name="message" label={labels.message} as="textarea" required />
      <Honeypot label={labels.honeypot} />
      <p className="legal">{labels.contactLegal}</p>
      <button type="submit" className="btn btn-plein justify-self-start" disabled={pending}>
        {pending ? labels.sending : labels.sendContact}
      </button>
    </form>
  );
}

export function NewsletterForm({
  labels,
  honeypot,
}: {
  labels: {
    label: string;
    submit: string;
    legal: string;
    privacy: string;
    success: string;
    error: string;
    demo: string;
  };
  honeypot: string;
}) {
  const [state, action, pending] = useActionState(newsletterAction, initial);
  const id = useId();
  if (state.status === "success") {
    return (
      <p
        role="status"
        className="border-vigne border-l-4 py-2 pl-4 font-semibold"
        data-testid="newsletter-success"
      >
        {labels.success}
      </p>
    );
  }
  return (
    <form action={action} noValidate>
      <label htmlFor={id} className="mb-2 block text-[0.9rem] font-semibold">
        {labels.label}
      </label>
      <div className="flex">
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.values.email ?? ""}
          aria-invalid={state.status === "error" ? true : undefined}
          aria-describedby={`${id}-legal${state.status === "error" ? ` ${id}-err` : ""}`}
          className="bg-calcaire border-encre h-[52px] min-w-0 flex-1 border border-r-0 px-3.5"
        />
        <button
          type="submit"
          disabled={pending}
          className="bg-encre text-calcaire border-encre h-[52px] border px-5 text-[0.95rem] font-semibold"
        >
          {labels.submit}
        </button>
      </div>
      <Honeypot label={honeypot} />
      {state.status === "error" && (
        <p id={`${id}-err`} role="alert" className="text-braucol mt-2 text-[0.88rem] font-semibold">
          {state.errors.demo ? labels.demo : labels.error}
        </p>
      )}
      <p id={`${id}-legal`} className="legal mt-3">
        {labels.legal}{" "}
        <Link href="/confidentialite" className="inline-block py-1 underline underline-offset-4">
          {labels.privacy}
        </Link>
      </p>
    </form>
  );
}
