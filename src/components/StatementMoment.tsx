import Image from "next/image";
import { useTranslations } from "next-intl";
import FadeUp from "./FadeUp";

// The oversized display-word moment ("Meet Air^" pattern from the reference).
export default function StatementMoment() {
  const t = useTranslations("moment");

  return (
    <section className="bg-cream p-2 md:p-3">
      <div className="relative flex min-h-[80svh] items-center justify-center overflow-hidden rounded-sm">
        <Image
          src="/images/projects/maatwerk-werkplaats.jpg"
          alt={t("imageAlt")}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-black/35" />
        <FadeUp className="relative z-10 px-5 py-24 text-center">
          <p className="text-[clamp(3rem,11vw,8.5rem)] leading-none font-medium tracking-tight-3 text-white">
            {t("word")}
          </p>
          <p className="mt-5 text-base text-white/75 md:text-lg">{t("sub")}</p>
        </FadeUp>
      </div>
    </section>
  );
}
