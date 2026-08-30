import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { company } from "@/lib/company";
import { hasAnyPixel } from "@/lib/marketing";
import CookieSettingsLink from "./CookieSettingsLink";
import MeboLogo from "./MeboLogo";

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-cream px-5 py-14 md:px-8">
      <div className="mx-auto max-w-350">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <MeboLogo label="Mebo" className="h-4.5 w-auto" />
            <p className="mt-2 max-w-60 text-sm text-pretty text-muted">
              {t("tagline")}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">{t("contactHeading")}</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
              <li>
                <a href={`tel:${company.phone}`} className="hover:text-ink">
                  {company.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${company.email}`} className="hover:text-ink">
                  {company.email}
                </a>
              </li>
              <li>{t("address")}</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">{t("followHeading")}</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
              <li>
                <a
                  href={company.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={company.pinterestUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink"
                >
                  Pinterest
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {company.legalName} · {t("kvk")}
          </p>
          <nav className="flex flex-wrap gap-x-4 gap-y-1">
            <Link href="/privacy" className="hover:text-ink">
              {t("privacy")}
            </Link>
            <Link href="/cookies" className="hover:text-ink">
              {t("cookies")}
            </Link>
            {hasAnyPixel && (
              <CookieSettingsLink
                label={t("cookieSettings")}
                className="cursor-pointer hover:text-ink"
              />
            )}
          </nav>
          <p>{t("rights")}</p>
        </div>
      </div>
    </footer>
  );
}
