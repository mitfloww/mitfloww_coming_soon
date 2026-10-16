"use client";

import { useLayoutEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { ArrowIcon } from "@/components/icons";
import { Deck } from "./Deck";

/**
 * On wide screens each title line stays on one line and the title keeps the
 * English footprint in every language (long translations and taller scripts
 * scale down), so the card deck below sits at the same size and position.
 */
function useTitleFit(ref: React.RefObject<HTMLHeadingElement | null>, deps: unknown) {
  useLayoutEffect(() => {
    const h1 = ref.current;
    if (!h1) return;
    const wide = window.matchMedia("(min-width: 900px)");
    const fit = () => {
      h1.style.removeProperty("--hero-fit");
      if (!wide.matches) return;
      const cs = getComputedStyle(h1);
      const fontSize = parseFloat(cs.fontSize);
      const lineHeight = parseFloat(cs.lineHeight) || fontSize * 1.02;
      const avail = (h1.parentElement?.clientWidth ?? h1.clientWidth) * 0.96;
      let widest = 0;
      h1.querySelectorAll(".hero__line").forEach((line) => {
        const range = document.createRange();
        range.selectNodeContents(line);
        widest = Math.max(widest, range.getBoundingClientRect().width);
      });
      const byWidth = widest > 0 ? avail / widest : 1;
      const byHeight = (fontSize * 1.02) / lineHeight; // English line-height is 1.02
      const f = Math.min(1, byWidth, byHeight);
      if (f < 0.999) h1.style.setProperty("--hero-fit", f.toFixed(4));
    };
    fit();
    window.addEventListener("resize", fit);
    wide.addEventListener?.("change", fit);
    document.fonts?.ready.then(fit);
    return () => {
      window.removeEventListener("resize", fit);
      wide.removeEventListener?.("change", fit);
    };
  }, [ref, deps]);
}

/** Centred opening statement with the waitlist action, in the spirit of the reference. */
export function Hero() {
  const { m } = useI18n();
  const h = m.home.hero;
  const titleRef = useRef<HTMLHeadingElement>(null);
  useTitleFit(titleRef, h);
  return (
    <section className="hero hero--center hero--deck" aria-labelledby="hero-title">
      <div className="container hero__center">
        <h1 ref={titleRef} id="hero-title" className="display hero__title">
          <span className="hero__line">{h.line1}</span>
          <span className="hero__line hero__line--soft">{h.line2}</span>
        </h1>
        <div className="hero__actions" data-reveal style={{ ["--i" as string]: 2 }}>
          <a href="/preregister/" className="btn btn--ink btn--lg hero__cta">
            {h.cta}
            <ArrowIcon />
          </a>
        </div>
        <Deck />
      </div>
      <div className="hero__fade" aria-hidden="true" />
    </section>
  );
}
