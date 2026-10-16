"use client";

import { useEffect, useRef } from "react";

/**
 * Quiet starry dot field. Dots drift very slightly and ease away from the
 * pointer; static under reduced motion, paused when off screen.
 *  - Default: fills its section, thinning out around the two text columns.
 *  - `page`: one fixed field behind the whole page (every section shows it).
 */
export function DotField({ page = false }: { page?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    type Dot = { x: number; y: number; r: number; a: number; p: number };
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let color = "17,19,24";
    let raf = 0;
    let visible = false;
    const pointer = { x: -9999, y: -9999 };

    // Small deterministic PRNG so the pattern is the same on every load.
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const readColor = () => {
      const dark = document.documentElement.getAttribute("data-theme") === "dark";
      color = dark ? "237,239,243" : "17,19,24";
    };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      seed = 7;
      dots = [];
      const step = width < 640 ? 18 : 22;
      // Clear zones around the column centres (one column on narrow screens).
      const twoCols = width >= 900;
      const zones = page
        ? []
        : twoCols
        ? [{ x: width * 0.27, y: height * 0.5 }, { x: width * 0.73, y: height * 0.5 }]
        : [{ x: width * 0.5, y: height * 0.27 }, { x: width * 0.5, y: height * 0.73 }];
      const rx = twoCols ? width * 0.17 : width * 0.42;
      const ry = twoCols ? height * 0.24 : height * 0.13;

      for (let y = step / 2; y < height; y += step) {
        for (let x = step / 2; x < width; x += step) {
          const jx = x + (rand() - 0.5) * step * 0.9;
          const jy = y + (rand() - 0.5) * step * 0.9;
          let keep = 0.62;
          for (const z of zones) {
            const d = Math.hypot((jx - z.x) / rx, (jy - z.y) / ry);
            if (d < 1.35) keep *= Math.max(0, (d - 0.55) / 0.8);
          }
          if (rand() < keep) dots.push({ x: jx, y: jy, r: rand() < 0.15 ? 1.15 : 0.8, a: 0.22 + rand() * 0.38, p: rand() * Math.PI * 2 });
        }
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const d of dots) {
        let x = d.x;
        let y = d.y;
        if (!reduce) {
          x += Math.sin(t / 2600 + d.p) * 1.2;
          y += Math.cos(t / 3100 + d.p) * 1.2;
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120 && dist > 0.01) {
            const push = (1 - dist / 120) * 14;
            x += (dx / dist) * push;
            y += (dy / dist) * push;
          }
        }
        ctx.fillStyle = `rgba(${color},${d.a})`;
        ctx.beginPath();
        ctx.arc(x, y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      draw(t);
      if (visible && !reduce) raf = window.requestAnimationFrame(loop);
    };

    const start = () => {
      window.cancelAnimationFrame(raf);
      if (reduce) draw(0);
      else raf = window.requestAnimationFrame(loop);
    };

    readColor();
    build();
    draw(0);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else window.cancelAnimationFrame(raf);
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      build();
      draw(performance.now());
    });
    ro.observe(canvas);

    const themeObserver = new MutationObserver(() => {
      readColor();
      draw(performance.now());
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // The page field follows the pointer anywhere; a section field only inside its section.
    const section: HTMLElement | Window | null = page ? window : canvas.parentElement;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    section?.addEventListener("pointermove", onMove as EventListener, { passive: true });
    if (page) document.documentElement.addEventListener("pointerleave", onLeave);
    else section?.addEventListener("pointerleave", onLeave);

    return () => {
      window.cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      section?.removeEventListener("pointermove", onMove as EventListener);
      if (page) document.documentElement.removeEventListener("pointerleave", onLeave);
      else section?.removeEventListener("pointerleave", onLeave);
    };
  }, [page]);

  return <canvas ref={canvasRef} className={page ? "dotfield dotfield--page" : "dotfield"} aria-hidden="true" />;
}
