"use client";

import { useEffect, useRef } from "react";
import {
  CONSENT_CHANGED_EVENT,
  clearPixelCookies,
  readConsent,
  type Consent,
} from "@/lib/consent";
import { pixels } from "@/lib/marketing";

function injectInline(code: string) {
  const script = document.createElement("script");
  script.textContent = code;
  document.head.appendChild(script);
}

function injectSrc(src: string) {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

// Official base snippets, injected only after the visitor accepts marketing
// cookies. Each also fires its PageView so the platforms can attribute the
// visit to the ad that brought it.
function loadPixels() {
  if (pixels.meta) {
    injectInline(
      `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');` +
        `fbq('init',${JSON.stringify(pixels.meta)});fbq('track','PageView');`,
    );
  }

  if (pixels.tiktok) {
    injectInline(
      `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};` +
        `ttq.load(${JSON.stringify(pixels.tiktok)});ttq.page();}(window,document,'ttq');`,
    );
  }

  if (pixels.googleAds) {
    injectSrc(
      `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(pixels.googleAds)}`,
    );
    // Consent Mode v2, basic implementation: the tag only runs after the
    // visitor accepted, so consent is declared granted before config.
    injectInline(
      `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;` +
        `gtag('consent','default',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'denied'});` +
        `gtag('js',new Date());gtag('config',${JSON.stringify(pixels.googleAds)});`,
    );
  }

  if (pixels.pinterest) {
    injectInline(
      `!function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinterest.com/ct/core.js");` +
        `pintrk('load',${JSON.stringify(pixels.pinterest)});pintrk('page');`,
    );
  }
}

export default function MarketingPixels() {
  const loaded = useRef(false);

  useEffect(() => {
    function sync(consent: Consent | null) {
      if (!consent) return;
      if (consent.marketing && !loaded.current) {
        loaded.current = true;
        loadPixels();
      } else if (!consent.marketing) {
        clearPixelCookies();
        if (loaded.current) {
          // Withdrawn mid-session: scripts can't be un-run, so reload for a
          // clean page without them.
          window.location.reload();
        }
      }
    }

    sync(readConsent());
    const onChange = (event: Event) =>
      sync((event as CustomEvent<Consent>).detail);
    window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
  }, []);

  return null;
}
