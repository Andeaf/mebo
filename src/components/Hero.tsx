import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section id="top" className="relative flex h-svh min-h-140 items-center justify-center overflow-hidden">
      <div className="hero-zoom absolute inset-0">
        <Image
          src="/images/projects/hero-keuken-eiken.jpg"
          alt={t("imageAlt")}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_70%]"
        />
      </div>
      {/* Contrast scrim for the headline */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-black/35 via-black/20 to-black/45"
      />

      <div className="relative z-10 flex max-w-3xl flex-col items-center px-5 text-center">
        <h1 className="text-4xl font-medium tracking-tight-3 text-balance text-white md:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-5 max-w-xl text-base text-pretty text-white/85 md:text-lg">
          {t("subtitle")}
        </p>
        <a
          href="#contact"
          className="mt-8 rounded-sm bg-white px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-cream"
        >
          {t("cta")}
        </a>
      </div>
    </section>
  );
}
