// Ad-platform pixel configuration. The IDs come from env vars so nothing
// loads until the ad accounts actually exist — see README
// ("Advertentiepixels & cookiebanner") for where to find each ID. On top of
// that, every pixel requires marketing-cookie consent: MarketingPixels.tsx
// only injects the scripts after the visitor accepts the banner.

export const pixels = {
  // Meta Pixel — one pixel covers both Facebook and Instagram.
  meta: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  // TikTok Pixel.
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
  // Google tag ("AW-…") — covers Google Ads incl. YouTube campaigns.
  googleAds: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
  // Conversion "send_to" for a submitted appointment request ("AW-…/…").
  googleAdsLeadLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL,
  // Pinterest Tag.
  pinterest: process.env.NEXT_PUBLIC_PINTEREST_TAG_ID,
} as const;

// With no pixels configured the site sets no consent-requiring cookies at
// all, so the banner and the footer settings link stay hidden.
export const hasAnyPixel = Boolean(
  pixels.meta || pixels.tiktok || pixels.googleAds || pixels.pinterest,
);

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (event: string, data?: object) => void };
    gtag?: (...args: unknown[]) => void;
    pintrk?: (...args: unknown[]) => void;
  }
}

// Report a submitted appointment request to every loaded pixel, so the
// platforms can optimise ad delivery toward people who actually convert.
// Each guard doubles as the consent check: the globals only exist after
// MarketingPixels injected the scripts.
export function trackLead(): void {
  window.fbq?.("track", "Lead");
  window.ttq?.track("SubmitForm");
  if (window.gtag) {
    if (pixels.googleAdsLeadLabel) {
      window.gtag("event", "conversion", { send_to: pixels.googleAdsLeadLabel });
    } else {
      window.gtag("event", "generate_lead");
    }
  }
  window.pintrk?.("track", "lead");
}
