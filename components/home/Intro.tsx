"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { Hero } from "./Hero";
import { SplitPaths } from "./SplitPaths";
import { FAN } from "./Deck";

/*
 * Hero + paths, with the card deck travelling between them on wide screens:
 * scrolling down sends three cards out sideways while the designers and
 * photographers cards drift down (slower than the page, a parallax), flip
 * over to "Freelancers" / "Assets" and settle beside the two calls to action.
 * Narrow or short viewports and reduced motion keep the deck static and show
 * fixed cards above each path instead (data-travel="off").
 */

const PERSPECTIVE = 1400;
const SLOT_GAP = 24; // breathing room inside the card slot beside each column

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeIn = (t: number) => t * t;

type Target = { x: number; y: number; s: number };

export function Intro() {
  const { m } = useI18n();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const deck = root.querySelector<HTMLElement>(".deck");
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-deck-card]"));
    const cols = Array.from(root.querySelectorAll<HTMLElement>(".paths__col"));
    const fade = root.querySelector<HTMLElement>(".hero__fade");
    if (!deck || cards.length !== 5 || cols.length !== 2) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let on = false;
    let raf = 0;
    let cw = 0;
    let ch = 0;
    let base = { x: 0, y: 0 }; // document position of the deck's centre line (card centre before the fan offset)
    let endScroll = 1;
    let targets: Record<1 | 3, Target> = { 1: { x: 0, y: 0, s: 1 }, 3: { x: 0, y: 0, s: 1 } };
    let vw = 0;

    const off = () => {
      on = false;
      root.dataset.travel = "off";
      root.dataset.rest = "";
      cards.forEach((c) => {
        c.style.transform = "";
        c.style.opacity = "";
        c.style.pointerEvents = "";
        delete c.dataset.face;
      });
      if (fade) fade.style.opacity = "";
    };

    const measure = () => {
      vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      if (reduce.matches || vw < 1200 || vh < 620) return off();
      // Switch the layout first (it reserves the card slots), then measure it.
      root.dataset.travel = "on";

      cw = cards[0].offsetWidth;
      ch = cards[0].offsetHeight;
      const sy = window.scrollY;
      const d = deck.getBoundingClientRect();
      base = { x: d.left + d.width / 2, y: d.top + sy + cards[0].offsetTop + ch / 2 };

      // deck.css reserves a slot (padding) on the outer side of each column while travelling.
      const grid = cols[0].offsetParent as HTMLElement;
      const g = grid.getBoundingClientRect();
      const slot = parseFloat(getComputedStyle(cols[0]).paddingLeft) || 0;
      const s = Math.min((slot - SLOT_GAP) / cw, 1, (vh * 0.62) / ch);
      if (!(s > 0)) return off();
      const xOf = (col: HTMLElement, side: -1 | 1) =>
        g.left + col.offsetLeft + (side < 0 ? slot / 2 : col.offsetWidth - slot / 2);
      const yOf = (col: HTMLElement) => g.top + sy + col.offsetTop + col.offsetHeight / 2;
      targets = {
        1: { x: xOf(cols[0], -1), y: yOf(cols[0]), s },
        3: { x: xOf(cols[1], 1), y: yOf(cols[1]), s },
      };
      endScroll = Math.max(1, (targets[1].y + targets[3].y) / 2 - vh / 2);

      on = true;
      render();
    };

    const render = () => {
      raf = 0;
      if (!on) return;
      const p = clamp01(window.scrollY / endScroll);
      // Hover lift (deck.css) only while the deck is resting in the hero.
      const rest = p < 0.01;
      if (("rest" in root.dataset) !== rest) {
        if (rest) root.dataset.rest = "";
        else delete root.dataset.rest;
      }
      const t = easeInOut(clamp01((p - 0.04) / 0.92));
      const flip = easeInOut(clamp01((p - 0.28) / 0.62));
      const exit = easeIn(clamp01(p / 0.5));
      // The edge fade frames the resting deck; it clears as soon as the cards move.
      if (fade) fade.style.opacity = (1 - clamp01(p / 0.14)).toFixed(3);

      cards.forEach((card, n) => {
        const f = FAN[n];
        const fx = f.x * cw;
        const fy = f.y * cw;
        let x = fx, y = fy, rz = f.rz, ry = f.ry, s = f.s, o = 1;

        if (n === 1 || n === 3) {
          const tg = targets[n];
          const side = n === 1 ? -1 : 1;
          x = lerp(fx, tg.x - base.x, t);
          y = lerp(fy, tg.y - base.y, t);
          rz = lerp(f.rz, side * 4, t);
          ry = lerp(f.ry, 180 - side * 14, flip);
          s = lerp(f.s, tg.s, t);
        } else {
          // Out to the sides; the centre card leans left, the outer two follow their own side.
          const side = n < 2 ? -1 : n > 2 ? 1 : -0.55;
          x = fx + side * exit * vw * 0.62;
          y = fy - exit * cw * 0.35;
          rz = f.rz + side * exit * 18;
          o = 1 - clamp01(exit * 1.6);
        }
        card.style.transform =
          `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) perspective(${PERSPECTIVE}px) ` +
          `rotateZ(${rz.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${s.toFixed(4)})`;
        card.style.opacity = o < 1 ? o.toFixed(3) : "";
        card.style.pointerEvents = o < 0.05 ? "none" : "";
        // Which side faces the viewer (backface-visibility alone can paint stale in Chrome).
        const a = ((ry % 360) + 360) % 360;
        card.dataset.face = a > 90 && a < 270 ? "back" : "front";
      });
    };

    const onScroll = () => {
      if (on && !raf) raf = requestAnimationFrame(render);
    };

    // Re-measure when the layout changes size (resize, fonts, title fit), not on every scroll.
    let lastW = 0;
    let lastH = 0;
    const ro = new ResizeObserver(() => {
      const w = document.documentElement.clientWidth;
      const h = root.offsetHeight;
      if (w !== lastW || h !== lastH) {
        lastW = w;
        lastH = h;
        measure();
      }
    });
    ro.observe(root);
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    reduce.addEventListener?.("change", measure);
    document.fonts?.ready.then(measure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      reduce.removeEventListener?.("change", measure);
    };
  }, [m]);

  return (
    <div className="intro" ref={rootRef}>
      <Hero />
      <SplitPaths />
    </div>
  );
}
