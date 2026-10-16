"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

/**
 * The product statement, typed out with a blinking cursor as it scrolls into
 * view: scrolling down types it, scrolling back up erases it. The full
 * sentence is always in the page (for search and screen readers); the typed
 * layer is decorative and sits on top of it.
 */
export function Statement() {
  const { m } = useI18n();
  const text = m.home.statement;
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);
  const [static_, setStatic] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setStatic(true);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Starts as the line comes up from the bottom of the screen, complete a
      // little above the middle.
      const start = vh * 0.92;
      const end = vh * 0.42;
      const p = (start - r.top) / (start - end);
      setProgress(p <= 0 ? 0 : p >= 1 ? 1 : p);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Grapheme-safe enough for the scripts we ship.
  const chars = Array.from(text);
  const count = static_ ? chars.length : Math.round(progress * chars.length);
  const started = static_ || progress > 0;
  const done = count >= chars.length;
  const typed = done ? text : chars.slice(0, count).join("");

  return (
    <section className="statement">
      <div className="container">
        <p ref={ref} className={`statement__text${started ? " is-started" : ""}${done ? " is-done" : ""}`}>
          <span className="statement__ghost">{text}</span>
          <span className="statement__typed" aria-hidden="true">
            {typed}
            <span className="statement__cursor" />
          </span>
        </p>
      </div>
    </section>
  );
}
