export type LangCode = "en" | "hi" | "bn" | "mr" | "te" | "ta" | "kn" | "ml" | "es" | "fr";

export interface Language {
  code: LangCode;
  /** Name in its own script, shown in the switcher */
  native: string;
  /** English name, for screen readers and search */
  english: string;
  /** Short label for the closed switcher */
  short: string;
  /** Indian scripts render best without negative letter-spacing */
  indic: boolean;
}

export const LANGUAGES: Language[] = [
  { code: "en", native: "English", english: "English", short: "EN", indic: false },
  { code: "hi", native: "हिन्दी", english: "Hindi", short: "HI", indic: true },
  { code: "bn", native: "বাংলা", english: "Bengali", short: "BN", indic: true },
  { code: "mr", native: "मराठी", english: "Marathi", short: "MR", indic: true },
  { code: "te", native: "తెలుగు", english: "Telugu", short: "TE", indic: true },
  { code: "ta", native: "தமிழ்", english: "Tamil", short: "TA", indic: true },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada", short: "KN", indic: true },
  { code: "ml", native: "മലയാളം", english: "Malayalam", short: "ML", indic: true },
  { code: "es", native: "Español", english: "Spanish", short: "ES", indic: false },
  { code: "fr", native: "Français", english: "French", short: "FR", indic: false },
];

export const DEFAULT_LANG: LangCode = "en";
export const LANG_STORAGE_KEY = "mf-lang";

export function isLangCode(value: unknown): value is LangCode {
  return typeof value === "string" && LANGUAGES.some((l) => l.code === value);
}
