"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

const CARD_IMAGES = [
  "/images/projects/ontwerp-showroom.jpg",
  "/images/projects/productie-cnc.jpg",
  "/images/projects/montage-team.jpg",
] as const;

export default function ProcessCards() {
  const t = useTranslations("process");
  const reduceMotion = useReducedMotion();

  return (
    <section id="werkwijze" className="scroll-mt-16 bg-cream px-2 pb-2 md:px-3 md:pb-3">
      <h2 className="sr-only">{t("heading")}</h2>
      <div className="grid gap-2 md:grid-cols-3 md:gap-3">
        {CARD_IMAGES.map((src, i) => (
          <motion.article
            key={src}
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.12 }}
            className="group relative aspect-4/5 overflow-hidden rounded-sm md:aspect-3/4"
          >
            <Image
              src={src}
              alt={t(`cards.${i}.imageAlt`)}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
              <p className="text-sm font-medium text-white/60">
                {t(`cards.${i}.label`)}
              </p>
              <h3 className="mt-1 max-w-60 text-xl leading-snug font-medium tracking-tight-3 text-white md:text-[1.375rem]">
                {t(`cards.${i}.title`)}
              </h3>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
