import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import M4Page from "@/components/variants/m4/M4Page";
import VariantSwitcher from "@/components/variants/VariantSwitcher";

// Internal design preview — keep out of search engines.
export const metadata: Metadata = {
  title: "Mebo — design 4",
  robots: { index: false, follow: false },
};

export default async function M4({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <M4Page />
      <VariantSwitcher />
    </>
  );
}
