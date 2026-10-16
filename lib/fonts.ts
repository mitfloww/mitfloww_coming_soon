import {
  Inter,
  JetBrains_Mono,
  Manrope,
  Noto_Sans_Bengali,
  Noto_Sans_Devanagari,
  Noto_Sans_Kannada,
  Noto_Sans_Malayalam,
  Noto_Sans_Tamil,
  Noto_Sans_Telugu,
} from "next/font/google";

/* Brand fonts (self-hosted by next/font, same families as the original site). */
export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--ff-manrope",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--ff-inter",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--ff-mono",
  display: "swap",
});

/*
 * Indian scripts for the language switcher. Not preloaded: the browser only
 * downloads a script's files when text in that script is on screen.
 */
export const notoDeva = Noto_Sans_Devanagari({ subsets: ["devanagari"], weight: ["400", "500", "600", "700"], variable: "--ff-deva", display: "swap", preload: false });
export const notoBeng = Noto_Sans_Bengali({ subsets: ["bengali"], weight: ["400", "500", "600", "700"], variable: "--ff-beng", display: "swap", preload: false });
export const notoTaml = Noto_Sans_Tamil({ subsets: ["tamil"], weight: ["400", "500", "600", "700"], variable: "--ff-taml", display: "swap", preload: false });
export const notoTelu = Noto_Sans_Telugu({ subsets: ["telugu"], weight: ["400", "500", "600", "700"], variable: "--ff-telu", display: "swap", preload: false });
export const notoKnda = Noto_Sans_Kannada({ subsets: ["kannada"], weight: ["400", "500", "600", "700"], variable: "--ff-knda", display: "swap", preload: false });
export const notoMlym = Noto_Sans_Malayalam({ subsets: ["malayalam"], weight: ["400", "500", "600", "700"], variable: "--ff-mlym", display: "swap", preload: false });

export const siteFontVariables = [
  manrope.variable,
  inter.variable,
  mono.variable,
  notoDeva.variable,
  notoBeng.variable,
  notoTaml.variable,
  notoTelu.variable,
  notoKnda.variable,
  notoMlym.variable,
].join(" ");
