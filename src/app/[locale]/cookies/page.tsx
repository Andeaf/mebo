import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import CookieSettingsLink from "@/components/CookieSettingsLink";
import { Link } from "@/i18n/navigation";
import { hasAnyPixel } from "@/lib/marketing";

type CookieRow = {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
};

// Brand names need no translation; the privacy-policy URLs live here so the
// message files stay plain text.
const POLICY_LINKS = [
  { name: "Meta (Facebook & Instagram)", url: "https://www.facebook.com/privacy/policy" },
  { name: "TikTok", url: "https://www.tiktok.com/legal/privacy-policy" },
  { name: "Google", url: "https://policies.google.com/privacy" },
  { name: "Pinterest", url: "https://policy.pinterest.com/privacy-policy" },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cookiesPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: locale === "nl" ? "/cookies" : `/${locale}/cookies`,
      languages: {
        nl: "/cookies",
        en: "/en/cookies",
        "x-default": "/cookies",
      },
    },
  };
}

function CookieTable({
  rows,
  headers,
}: {
  rows: CookieRow[];
  headers: { name: string; provider: string; purpose: string; duration: string };
}) {
  return (
    <div className="mt-5 overflow-x-auto rounded-lg border border-line bg-white">
      <table className="w-full min-w-140 text-left text-sm">
        <thead>
          <tr className="border-b border-line">
            <th className="px-4 py-3 text-[11px] font-medium tracking-wide text-muted uppercase">
              {headers.name}
            </th>
            <th className="px-4 py-3 text-[11px] font-medium tracking-wide text-muted uppercase">
              {headers.provider}
            </th>
            <th className="px-4 py-3 text-[11px] font-medium tracking-wide text-muted uppercase">
              {headers.purpose}
            </th>
            <th className="px-4 py-3 text-[11px] font-medium tracking-wide text-muted uppercase">
              {headers.duration}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.name}
              className={index > 0 ? "border-t border-line" : undefined}
            >
              <td className="px-4 py-3 align-top font-medium whitespace-nowrap">
                {row.name}
              </td>
              <td className="px-4 py-3 align-top text-ink-soft">{row.provider}</td>
              <td className="px-4 py-3 align-top text-pretty text-ink-soft">
                {row.purpose}
              </td>
              <td className="px-4 py-3 align-top whitespace-nowrap text-ink-soft">
                {row.duration}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "cookiesPage" });
  const intro = t.raw("intro") as string[];
  const headers = t.raw("tableHeaders") as {
    name: string;
    provider: string;
    purpose: string;
    duration: string;
  };
  const functionalRows = t.raw("functional.rows") as CookieRow[];
  const marketingRows = t.raw("marketing.rows") as CookieRow[];
  const manageBody = t.raw("manage.body") as string[];

  const paragraphClass = "mt-4 text-base leading-relaxed text-pretty text-ink-soft";
  const headingClass = "mt-12 text-2xl font-medium tracking-tight-3 md:text-3xl";

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
                <p key={paragraph} className="mt-6 text-base leading-relaxed text-pretty text-ink-soft">
                  {paragraph}
                </p>
              ))}

              <h2 className={headingClass}>{t("functional.heading")}</h2>
              <p className={paragraphClass}>{t("functional.intro")}</p>
              <CookieTable rows={functionalRows} headers={headers} />

              <h2 className={headingClass}>{t("marketing.heading")}</h2>
              <p className={paragraphClass}>{t("marketing.intro")}</p>
              <CookieTable rows={marketingRows} headers={headers} />
              <p className={paragraphClass}>{t("marketing.thirdParty")}</p>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {POLICY_LINKS.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted underline underline-offset-2 hover:text-ink"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>

              <h2 className={headingClass}>{t("manage.heading")}</h2>
              {manageBody.map((paragraph) => (
                <p key={paragraph} className={paragraphClass}>
                  {paragraph}
                </p>
              ))}
              {hasAnyPixel && (
                <p className="mt-5">
                  <CookieSettingsLink
                    label={t("manage.settings")}
                    className="cursor-pointer rounded-lg border border-ink px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-cream-dark"
                  />
                </p>
              )}

              <p className="mt-14">
                <Link
                  href="/privacy"
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
