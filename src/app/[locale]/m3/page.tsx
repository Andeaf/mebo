import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import M3Page from "@/components/variants/m3/M3Page";
import VariantSwitcher from "@/components/variants/VariantSwitcher";

// Internal design preview — keep out of search engines.
export const metadata: Metadata = {
  title: "Mebo — design 3",
  robots: { index: false, follow: false },
};

export default async function M3({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <M3Page />
      <VariantSwitcher />
    </>
  );
}
