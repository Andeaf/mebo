"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { galleryProjects } from "@/lib/projects";
import FadeUp from "./FadeUp";

type Lightbox = { project: number; photo: number };

export default function ProjectsGrid() {
  const t = useTranslations("gallery");
  const [lightbox, setLightbox] = useState<Lightbox | null>(null);
  const isOpen = lightbox !== null;

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback((dir: 1 | -1) => {
    setLightbox((current) => {
      if (!current) return current;
      const count = galleryProjects[current.project].images.length;
      return { ...current, photo: (current.photo + dir + count) % count };
    });
  }, []);

  // Keyboard navigation + scroll lock while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [isOpen, close, step]);

  const active = lightbox ? galleryProjects[lightbox.project] : null;

  return (
    <section className="bg-cream px-2 pb-2 md:px-3 md:pb-3">
      <ul className="grid list-none grid-cols-1 gap-2 sm:grid-cols-2 md:gap-3 lg:grid-cols-3 xl:grid-cols-4">
        {galleryProjects.map((p, i) => (
          <li key={p.id}>
            <FadeUp delay={i * 0.08}>
              <button
                type="button"
                onClick={() => setLightbox({ project: i, photo: 0 })}
                className="group relative block aspect-[3/2] w-full cursor-pointer overflow-hidden rounded-sm"
              >
                <Image
                  src={p.images[0]}
                  alt={t(`alt${p.id}`)}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-black/50 via-black/0 to-black/0"
                />
                <span className="absolute bottom-3 left-4 text-left text-white">
                  <span className="block text-sm font-medium">
                    {t("projectLabel", { number: p.id })}
                  </span>
                  <span className="block text-xs text-white/75">
                    {t("photoCount", { count: p.images.length })}
                  </span>
                </span>
              </button>
            </FadeUp>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {lightbox && active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-100 flex flex-col bg-black/95"
            role="dialog"
            aria-modal="true"
            aria-label={t("projectLabel", { number: active.id })}
            onClick={close}
          >
            <div className="flex items-center justify-between px-4 py-3 text-white md:px-6">
              <p className="text-sm font-medium">
                {t("projectLabel", { number: active.id })}
                <span className="ml-3 text-white/60">
                  {lightbox.photo + 1} / {active.images.length}
                </span>
              </p>
              <button
                type="button"
                onClick={close}
                aria-label={t("close")}
                className="cursor-pointer rounded-sm p-2 text-2xl leading-none text-white/80 transition-colors hover:text-white"
              >
                ×
              </button>
            </div>

            <div
              className="relative flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={`${lightbox.project}-${lightbox.photo}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                <Image
                  src={active.images[lightbox.photo]}
                  alt={t("photoAlt", {
                    number: active.id,
                    index: lightbox.photo + 1,
                    count: active.images.length,
                  })}
                  fill
                  sizes="100vw"
                  quality={85}
                  className="object-contain"
                />
              </motion.div>

              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={t("prev")}
                className="absolute top-1/2 left-2 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-3 text-white/85 transition-colors hover:bg-black/60 hover:text-white md:left-4"
              >
                <span aria-hidden className="block text-xl leading-none">←</span>
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={t("next")}
                className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-3 text-white/85 transition-colors hover:bg-black/60 hover:text-white md:right-4"
              >
                <span aria-hidden className="block text-xl leading-none">→</span>
              </button>
            </div>

            <div
              className="flex gap-2 overflow-x-auto px-4 py-3 md:justify-center md:px-6"
              onClick={(e) => e.stopPropagation()}
            >
              {active.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() =>
                    setLightbox((current) =>
                      current ? { ...current, photo: i } : current,
                    )
                  }
                  aria-label={t("photoAlt", {
                    number: active.id,
                    index: i + 1,
                    count: active.images.length,
                  })}
                  aria-current={i === lightbox.photo}
                  className={`relative h-12 w-16 shrink-0 cursor-pointer overflow-hidden rounded-xs transition-opacity ${
                    i === lightbox.photo
                      ? "opacity-100 ring-2 ring-white"
                      : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
