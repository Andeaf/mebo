import Image from "next/image";
import { useTranslations } from "next-intl";
import FadeUp from "./FadeUp";

const FEATURES = [
  {
    image: "/images/projects/materialen-eiken-fronten.jpg",
    href: "#projecten",
  },
  {
    image: "/images/projects/proces-tekening-montage.jpg",
    href: "#contact",
  },
] as const;

export default function FeatureBlocks() {
  const t = useTranslations("features");

  return (
    <section className="bg-cream px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto flex max-w-350 flex-col gap-20 md:gap-28">
        {FEATURES.map((feature, i) => (
          <FadeUp key={feature.image}>
            <div
              className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="relative aspect-4/3 overflow-hidden rounded-sm">
                <Image
                  src={feature.image}
                  alt={t(`${i}.imageAlt`)}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="max-w-lg md:justify-self-center">
                <p className="text-sm font-medium text-muted">
                  {t(`${i}.eyebrow`)}
                </p>
                <h2 className="mt-3 text-3xl font-medium tracking-tight-3 text-balance md:text-4xl">
                  {t(`${i}.title`)}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-pretty text-ink-soft">
                  {t(`${i}.body`)}
                </p>
                <a
                  href={feature.href}
                  className="group mt-7 inline-flex items-center gap-2 text-sm font-medium text-ink"
                >
                  <span className="relative">
                    {t(`${i}.link`)}
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
                </a>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
