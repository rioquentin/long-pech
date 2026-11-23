import { LegalPage, legalMeta } from "@/components/Legal";

export const metadata = legalMeta("cookies");

export default function Page() {
  return <LegalPage slug="cookies" />;
}
