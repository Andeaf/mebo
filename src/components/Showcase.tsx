import Image from "next/image";
import { useTranslations } from "next-intl";
import { company } from "@/lib/company";
import { galleryProjects } from "@/lib/projects";
import FadeUp from "./FadeUp";

export default function Showcase() {
  const t = useTranslations("showcase");

  return (
    <section id="projecten" className="scroll-mt-16 bg-cream md:p-3">
      {/* Mobile: compact section head; the banner + card grid are replaced by a
          horizontal carousel (see ProjectsGrid) below md. */}
      <FadeUp className="md:hidden">
        <div className="flex items-end justify-between gap-4 px-5 pt-12 pb-5">
          <div>
            <h2 className="text-3xl font-medium tracking-tight-3">
              {t("heading")}
            </h2>
            <p className="mt-1.5 text-sm text-muted">{t("title")}</p>
          </div>
          <p className="text-xs whitespace-nowrap text-muted">
            {t("projectCount", { count: galleryProjects.length })}
          </p>
        </div>
      </FadeUp>

      <h2 className="sr-only max-md:hidden">{t("heading")}</h2>
      <div className="relative hidden min-h-[70svh] items-center justify-center overflow-hidden rounded-sm md:flex">
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
