"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    __mfReady?: boolean;
  }
}

/**
 * Scroll reveals for [data-reveal] elements (reversible: they hide again when
 * scrolled back above), re-run for every page the visitor navigates to. Reduced motion (or no IntersectionObserver) shows
 * everything immediately.
 */
export function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    window.__mfReady = true;
    document.documentElement.classList.add("js");
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    // Scrolling down reveals; scrolling back up past an element hides it again
    // (in reverse), so the page plays forwards and backwards with the scroll.
    // Elements that leave through the top stay revealed.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-in");
          else if (entry.boundingClientRect.top > 0) entry.target.classList.remove("is-in");
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
