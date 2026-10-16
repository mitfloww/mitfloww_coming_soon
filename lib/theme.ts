"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "mf-theme";

/**
 * Runs in <head> before first paint so the saved (or system) theme applies
 * without a flash. It also marks the document as JS-enabled for reveal
 * animations, and falls back to showing everything if the app never starts.
 */
export const THEME_INIT_SCRIPT = `(function(){var d=document.documentElement,t;try{t=localStorage.getItem('${THEME_STORAGE_KEY}')}catch(e){}if(t!=='light'&&t!=='dark'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.setAttribute('data-theme',t);d.classList.add('js');setTimeout(function(){if(!window.__mfReady)d.classList.remove('js')},3000)})();`;

function storedTheme(): Theme | null {
  try {
    const t = localStorage.getItem(THEME_STORAGE_KEY);
    return t === "light" || t === "dark" ? t : null;
  } catch {
    return null;
  }
}

function currentTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme, animate: boolean) {
  const root = document.documentElement;
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const swap = () => {
    root.setAttribute("data-theme", theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0b0d11" : "#ffffff");
  };
  // One cross-fade of the whole page on the compositor: smooth, and nothing
  // (backgrounds, overlays, canvases) can change colour out of step.
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (animate && !reduce && typeof doc.startViewTransition === "function") {
    doc.startViewTransition(swap);
  } else {
    swap();
  }
}

/** Theme state shared by every toggle on the page. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(currentTheme());
    const sync = () => setTheme(currentTheme());
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // Follow the OS setting until the visitor picks a theme themselves.
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    const onSystem = (e: MediaQueryListEvent) => {
      if (!storedTheme()) applyTheme(e.matches ? "dark" : "light", true);
    };
    media?.addEventListener?.("change", onSystem);
    return () => {
      observer.disconnect();
      media?.removeEventListener?.("change", onSystem);
    };
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
    applyTheme(next, true);
  }, []);

  return { theme, toggle };
}
