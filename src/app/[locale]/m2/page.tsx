import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import M2Page from "@/components/variants/m2/M2Page";
import VariantSwitcher from "@/components/variants/VariantSwitcher";

// Internal design preview — keep out of search engines.
export const metadata: Metadata = {
  title: "Mebo — design 2",
  robots: { index: false, follow: false },
};

export default async function M2({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <M2Page />
      <VariantSwitcher />
    </>
  );
}
