// Display fonts for the m1–m4 design-variant previews. Loaded once in the
// locale layout so their CSS variables exist on <html> — the @theme font
// utilities in globals.css resolve against :root, so wrapper-scoped variables
// would not work. Font files themselves are only downloaded on pages whose
// CSS actually uses the family.
import { Cormorant, Courier_Prime, Instrument_Serif, Inter } from "next/font/google";

export const m1Serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-m1-serif",
});

export const m2Courier = Courier_Prime({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-m2-courier",
});

export const m3Inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-m3-inter",
});

export const m4Cormorant = Cormorant({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-m4-cormorant",
});

export const variantFontClasses = [
  m1Serif.variable,
  m2Courier.variable,
  m3Inter.variable,
  m4Cormorant.variable,
].join(" ");
