import Image from "next/image";
import { useTranslations } from "next-intl";
import { company } from "@/lib/company";
import FadeUp from "./FadeUp";

export default function Showcase() {
  const t = useTranslations("showcase");

  return (
    <section id="projecten" className="scroll-mt-16 bg-cream p-2 md:p-3">
      <h2 className="sr-only">{t("heading")}</h2>
      <div className="relative flex min-h-[70svh] items-center justify-center overflow-hidden rounded-sm">
        <Image
          src="/images/projects/project-keuken-zwart-01.jpg"
          alt={t("imageAlt")}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-black/30" />
        <FadeUp className="relative z-10 px-5 py-24 text-center">
          <p className="text-3xl font-medium tracking-tight-3 text-balance text-white md:text-[2.75rem] md:leading-[1.16]">
            {t("title")}
          </p>
          <a
            href={company.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white underline decoration-white/50 underline-offset-4 transition-opacity hover:opacity-75"
          >
            {t("instagram")}
            <span aria-hidden>→</span>
          </a>
        </FadeUp>
      </div>
    </section>
  );
}
