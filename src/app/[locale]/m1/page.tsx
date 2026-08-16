import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import M1Page from "@/components/variants/m1/M1Page";
import VariantSwitcher from "@/components/variants/VariantSwitcher";

// Internal design preview — keep out of search engines.
export const metadata: Metadata = {
  title: "Mebo — design 1",
  robots: { index: false, follow: false },
};

export default async function M1({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <M1Page />
      <VariantSwitcher />
    </>
  );
}
