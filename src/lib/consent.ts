// Cookie-consent state, shared by the banner, the pixel loader and the
// footer settings link. The choice lives in a first-party cookie; a window
// event keeps the client components in sync without a reload.

export type Consent = {
  marketing: boolean;
};

const COOKIE_NAME = "mebo-consent";
// Re-ask after six months, in line with Autoriteit Persoonsgegevens guidance
// that consent should not live forever.
const MAX_AGE_SECONDS = 180 * 24 * 60 * 60;

export const CONSENT_CHANGED_EVENT = "mebo:consent-changed";
export const CONSENT_REOPEN_EVENT = "mebo:consent-reopen";

export function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof (parsed as Consent).marketing === "boolean"
    ) {
      return { marketing: (parsed as Consent).marketing };
    }
  } catch {
    // Malformed cookie — treat as "not asked yet".
  }
  return null;
}

export function writeConsent(consent: Consent): void {
  const value = encodeURIComponent(
    JSON.stringify({ ...consent, ts: new Date().toISOString() }),
  );
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;
  window.dispatchEvent(
    new CustomEvent<Consent>(CONSENT_CHANGED_EVENT, { detail: consent }),
  );
}

// First-party cookies the ad pixels set on our domain, removed again when
// the visitor refuses or withdraws consent. Keep in sync with the tables in
// the cookieverklaring (messages/*.json, "cookiesPage").
const PIXEL_COOKIES = [
  "_fbp", // Meta
  "_fbc", // Meta (click id)
  "_ttp", // TikTok
  "_gcl_au", // Google Ads
  "_gcl_aw", // Google Ads (click id)
  "_pin_unauth", // Pinterest
];

export function clearPixelCookies(): void {
  const host = window.location.hostname;
  const apex = host.replace(/^www\./, "");
  // Pixels set their cookies on the apex domain (".mebokeukens.nl");
  // expire on every plausible domain scope to be thorough.
  const domains = ["", host, `.${apex}`];
  for (const name of PIXEL_COOKIES) {
    for (const domain of domains) {
      const scope = domain ? `; domain=${domain}` : "";
      document.cookie = `${name}=; path=/${scope}; max-age=0`;
    }
  }
}
