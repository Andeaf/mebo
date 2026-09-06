import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import RalPicker from "@/components/RalPicker";
import { Link } from "@/i18n/navigation";
import { productionPartner } from "@/lib/company";
import { RAL_COLORS } from "@/lib/ral";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "colours" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription", { count: RAL_COLORS.length }),
    alternates: {
      canonical: locale === "nl" ? "/kleuren" : `/${locale}/kleuren`,
      languages: {
        nl: "/kleuren",
        en: "/en/kleuren",
        "x-default": "/kleuren",
      },
    },
  };
}

export default async function ColoursPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "colours" });

  return (
    <>
      <Nav />
      <main className="bg-cream px-5 pt-32 pb-24 md:px-8 md:pt-44 md:pb-32">
        <div className="mx-auto max-w-350">
          <FadeUp>
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-muted">{t("eyebrow")}</p>
              <h1 className="mt-4 text-4xl font-medium tracking-tight-3 text-balance md:text-6xl">
                {t("title")}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-pretty text-ink-soft md:text-lg">
                {t("intro", { count: RAL_COLORS.length })}
              </p>
              <p className="mt-4 text-sm text-muted">
                {t("partner")}{" "}
                <a
                  href={productionPartner.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-ink underline decoration-ink/30 underline-offset-4 transition-opacity hover:opacity-70"
                >
                  {productionPartner.name}, {productionPartner.city}
                </a>
                {" · "}
                {t("ncsNote")}
              </p>
            </div>
          </FadeUp>

          <div className="mt-12 md:mt-16">
            <RalPicker />
          </div>

          <div className="mt-16 max-w-3xl border-t border-line pt-8 md:mt-20">
            <p className="text-sm leading-relaxed text-muted">{t("note")}</p>
            <Link
              href="/#werkwijze"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink transition-opacity hover:opacity-70"
            >
              <span aria-hidden>←</span>
              {t("backLink")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
