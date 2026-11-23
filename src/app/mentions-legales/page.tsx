import { LegalPage, legalMeta } from "@/components/Legal";

export const metadata = legalMeta("mentions-legales");

export default function Page() {
  return <LegalPage slug="mentions-legales" />;
}
