import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import { Link } from "@/i18n/navigation";

type Section = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  after?: string[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: locale === "nl" ? "/privacy" : `/${locale}/privacy`,
      languages: {
        nl: "/privacy",
        en: "/en/privacy",
        "x-default": "/privacy",
      },
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacy" });
  const intro = t.raw("intro") as string[];
  const sections = t.raw("sections") as Section[];

  return (
    <>
      <Nav />
      <main className="bg-cream px-5 pt-32 pb-24 md:px-8 md:pt-44 md:pb-32">
        <div className="mx-auto max-w-350">
          <FadeUp>
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-muted">{t("updated")}</p>
              <h1 className="mt-4 text-4xl font-medium tracking-tight-3 text-balance md:text-6xl">
                {t("title")}
              </h1>
              {intro.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-6 text-base leading-relaxed text-pretty text-ink-soft"
                >
                  {paragraph}
                </p>
              ))}

              {sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="mt-12 text-2xl font-medium tracking-tight-3 md:text-3xl">
                    {section.heading}
                  </h2>
                  {section.paragraphs?.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="mt-4 text-base leading-relaxed text-pretty text-ink-soft"
                    >
                      {paragraph}
                    </p>
                  ))}
                  {section.list && (
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-ink-soft">
                      {section.list.map((item) => (
                        <li key={item} className="text-pretty">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.after?.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="mt-4 text-base leading-relaxed text-pretty text-ink-soft"
                    >
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}

              <p className="mt-14">
                <Link
                  href="/cookies"
                  className="font-medium text-ink underline underline-offset-4 hover:no-underline"
                >
                  {t("seeAlso")} →
                </Link>
              </p>
            </div>
          </FadeUp>
        </div>
      </main>
      <Footer />
    </>
  );
}
