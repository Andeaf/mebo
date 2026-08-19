import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import { Link } from "@/i18n/navigation";

const GALLERY = [
  { image: "/images/projects/ontwerp-showroom.jpg", altKey: "imageAlt1" },
  { image: "/images/projects/productie-cnc.jpg", altKey: "imageAlt2" },
  { image: "/images/projects/montage-team.jpg", altKey: "imageAlt3" },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: locale === "nl" ? "/about" : `/${locale}/about`,
      languages: {
        nl: "/about",
        en: "/en/about",
        "x-default": "/about",
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <>
      <Nav />
      <main className="bg-cream">
        {/* Intro */}
        <section className="px-5 pt-32 pb-14 md:px-8 md:pt-44 md:pb-20">
          <div className="mx-auto max-w-350">
            <FadeUp>
              <p className="text-sm font-medium text-muted">{t("eyebrow")}</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-medium tracking-tight-3 text-balance md:text-6xl">
                {t("title")}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-ink-soft">
                {t("intro")}
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Workshop image */}
        <section className="px-5 md:px-8">
          <div className="mx-auto max-w-350">
            <FadeUp>
              <div className="relative aspect-16/9 overflow-hidden rounded-sm md:aspect-21/9">
                <Image
                  src="/images/projects/maatwerk-werkplaats.jpg"
                  alt={t("heroImageAlt")}
                  fill
                  priority
                  sizes="(min-width: 1400px) 1400px, 100vw"
                  className="object-cover"
                />
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Story */}
        <section className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-350 gap-8 md:grid-cols-[1fr_2fr] md:gap-16">
            <FadeUp>
              <h2 className="text-3xl font-medium tracking-tight-3 md:text-4xl">
                {t("storyHeading")}
              </h2>
            </FadeUp>
            <FadeUp>
              <div className="max-w-2xl space-y-6 text-base leading-relaxed text-pretty text-ink-soft">
                <p>{t("p1")}</p>
                <p>{t("p2")}</p>
                <p>{t("p3")}</p>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Gallery */}
        <section className="px-5 md:px-8">
          <div className="mx-auto grid max-w-350 gap-4 md:grid-cols-3 md:gap-6">
            {GALLERY.map((item) => (
              <FadeUp key={item.image}>
                <div className="relative aspect-4/3 overflow-hidden rounded-sm">
                  <Image
                    src={item.image}
                    alt={t(item.altKey)}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-350 gap-10 md:grid-cols-3 md:gap-8">
            {[0, 1, 2].map((i) => (
              <FadeUp key={i}>
                <h3 className="text-xl font-medium tracking-tight-3">
                  {t(`values.${i}.title`)}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-pretty text-ink-soft">
                  {t(`values.${i}.body`)}
                </p>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 pb-24 md:px-8 md:pb-32">
          <div className="mx-auto max-w-350">
            <FadeUp>
              <Link
                href="/#contact"
                className="group inline-flex items-center gap-2 text-lg font-medium text-ink"
              >
                <span className="relative">
                  {t("cta")}
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-ink transition-transform duration-300 group-hover:scale-x-0"
                  />
                </span>
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </FadeUp>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
