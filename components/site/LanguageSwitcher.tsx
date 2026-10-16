"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { LANGUAGES } from "@/lib/i18n/languages";
import { CheckIcon, ChevronIcon, GlobeIcon } from "@/components/icons";

/** Language menu in the header: globe + short code, opening a list of languages. */
export function LanguageSwitcher() {
  const { lang, setLang, m } = useI18n();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Focus the current language when the menu opens.
  useEffect(() => {
    if (!open) return;
    const index = LANGUAGES.findIndex((l) => l.code === lang);
    itemRefs.current[Math.max(index, 0)]?.focus();
  }, [open, lang]);

  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = (i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      items[next]?.focus();
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      items[e.key === "Home" ? 0 : items.length - 1]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div className="lang" ref={wrapRef}>
      <button
        ref={buttonRef}
        type="button"
        className="lang__btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${m.nav.language}: ${current.english}`}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <GlobeIcon />
        <span className="lang__code">{current.short}</span>
        <ChevronIcon />
      </button>

      <div id={menuId} className="lang__menu" role="menu" aria-label={m.nav.chooseLanguage} hidden={!open} onKeyDown={onMenuKey}>
        {LANGUAGES.map((l, i) => (
          <button
            key={l.code}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            type="button"
            role="menuitemradio"
            aria-checked={l.code === lang}
            lang={l.code}
            className="lang__item"
            onClick={() => {
              setLang(l.code);
              setOpen(false);
              buttonRef.current?.focus();
            }}
          >
            <span className="lang__native">{l.native}</span>
            <span className="lang__en" lang="en">{l.english}</span>
            <span className="lang__check">{l.code === lang ? <CheckIcon /> : null}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
