"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { en, type Messages } from "./messages/en";
import { DEFAULT_LANG, LANGUAGES, LANG_STORAGE_KEY, isLangCode, type LangCode } from "./languages";

type DeepPartial<T> = { [K in keyof T]?: T[K] extends readonly unknown[] ? T[K] : T[K] extends object ? DeepPartial<T[K]> : T[K] };
export type PartialMessages = DeepPartial<Messages>;

/* Non-English dictionaries are split into their own chunks and loaded on demand. */
const loaders: Record<Exclude<LangCode, "en">, () => Promise<{ default: PartialMessages }>> = {
  hi: () => import("./messages/hi"),
  bn: () => import("./messages/bn"),
  mr: () => import("./messages/mr"),
  te: () => import("./messages/te"),
  ta: () => import("./messages/ta"),
  kn: () => import("./messages/kn"),
  ml: () => import("./messages/ml"),
  es: () => import("./messages/es"),
  fr: () => import("./messages/fr"),
};

/** Overlay a partial translation on English so a missing key never shows blank. */
function merge<T>(base: T, over: unknown): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(over)) return base;
    return base.map((item, i) => merge(item, over[i])) as T;
  }
  if (typeof base === "object" && base !== null) {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(base as object)) {
      out[key] = merge((base as Record<string, unknown>)[key], (over as Record<string, unknown>)[key]);
    }
    return out as T;
  }
  return (typeof over === typeof base ? over : base) as T;
}

interface I18nValue {
  lang: LangCode;
  m: Messages;
  setLang: (lang: LangCode) => void;
}

const I18nContext = createContext<I18nValue>({ lang: DEFAULT_LANG, m: en, setLang: () => {} });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(DEFAULT_LANG);
  const [messages, setMessages] = useState<Messages>(en);

  const apply = useCallback(async (next: LangCode) => {
    const root = document.documentElement;
    const meta = LANGUAGES.find((l) => l.code === next);
    if (next === "en") {
      setMessages(en);
    } else {
      try {
        const mod = await loaders[next]();
        setMessages(merge(en, mod.default));
      } catch {
        setMessages(en);
        next = "en";
      }
    }
    setLangState(next);
    root.setAttribute("lang", next);
    root.toggleAttribute("data-indic", Boolean(meta?.indic));
  }, []);

  // Restore the visitor's saved language after hydration (the server renders English).
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(LANG_STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
    if (isLangCode(saved) && saved !== DEFAULT_LANG) void apply(saved);
  }, [apply]);

  const setLang = useCallback(
    (next: LangCode) => {
      try {
        localStorage.setItem(LANG_STORAGE_KEY, next);
      } catch {
        /* storage unavailable */
      }
      void apply(next);
    },
    [apply],
  );

  const value = useMemo(() => ({ lang, m: messages, setLang }), [lang, messages, setLang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

/**
 * Fill {placeholders} in a translated string with React nodes, e.g.
 * fmt("Pay {amount} to unlock", { amount: <span className="mono">₹48,000</span> }).
 */
export function fmt(template: string, values: Record<string, ReactNode>): ReactNode[] {
  return template.split(/(\{[a-zA-Z]+\})/g).map((part, i) => {
    const match = /^\{([a-zA-Z]+)\}$/.exec(part);
    if (match && match[1] in values) return <span key={i}>{values[match[1]]}</span>;
    return part;
  });
}
