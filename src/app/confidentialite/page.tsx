import { LegalPage, legalMeta } from "@/components/Legal";

export const metadata = legalMeta("confidentialite");

export default function Page() {
  return <LegalPage slug="confidentialite" />;
}
