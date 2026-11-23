import { LegalPage, legalMeta } from "@/components/Legal";

export const metadata = legalMeta("cgv");

export default function Page() {
  return <LegalPage slug="cgv" />;
}
