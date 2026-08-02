import { useTranslations } from "next-intl";
import FadeUp from "./FadeUp";

export default function BrandStatement() {
  const t = useTranslations("statement");

  return (
    <section className="bg-cream px-5 py-24 md:py-40">
      <FadeUp className="mx-auto max-w-4xl">
        <p className="text-center text-3xl font-medium tracking-tight-3 text-balance md:text-[2.75rem] md:leading-[1.16]">
          {t("text")}
        </p>
      </FadeUp>
    </section>
  );
}
