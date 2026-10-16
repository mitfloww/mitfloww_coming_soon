"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { fmt, useI18n } from "@/lib/i18n/I18nProvider";
import { DownloadIcon, LockIcon, TickIcon } from "@/components/icons";

const STAGES = ["preview", "approve", "pay", "download"] as const;
/** Time each stage is shown while auto-playing. */
const STEP_MS = 2400;
/** The screen fades out for this long before the next stage fades in. */
const FADE_OUT_MS = 220;
const FADE_OUT_CLICK_MS = 120;

const FILES = [
  { type: "AI", name: "Logo_Suite.ai", size: "24.8 MB" },
  { type: "PDF", name: "Brand_Guidelines.pdf", size: "12.1 MB" },
  { type: "ZIP", name: "Social_Templates.zip", size: "86 MB" },
  { type: "SVG", name: "Wordmark.svg", size: "312 KB" },
];

const WATERMARK = "PREVIEW · MITFLOWW · PREVIEW · MITFLOWW · PREVIEW · MITFLOWW";

/**
 * The four-step delivery shown on a real project layout. Auto-plays while on
 * screen (mouse hover doesn't stop it); clicking a step jumps there at once
 * and the loop carries on from it. Each change fades the screen out and back
 * in so it's clear the stage moved on. Keyboard focus pauses the loop, and it
 * never auto-plays under reduced motion.
 */
export function DeliveryStage() {
  const { m } = useI18n();
  const s = m.home.stage;
  const [stage, setStage] = useState(0);
  const [captionIdx, setCaptionIdx] = useState(0);
  const [inView, setInView] = useState(false);
  const [keyboardPaused, setKeyboardPaused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [reduce, setReduce] = useState(true);
  const [fading, setFading] = useState(false);
  const consoleRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const fadeTimer = useRef(0);

  const playing = !reduce && inView && !keyboardPaused && !pageHidden;

  /** Fade the screen out, switch stage, fade it back in. */
  const goTo = (i: number, outMs: number) => {
    window.clearTimeout(fadeTimer.current);
    if (reduce) {
      setStage(i);
      return;
    }
    setFading(true);
    fadeTimer.current = window.setTimeout(() => {
      setStage(i);
      setFading(false);
    }, outMs);
  };
  useEffect(() => () => window.clearTimeout(fadeTimer.current), []);

  useEffect(() => {
    setReduce(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
    const onVisibility = () => setPageHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    if (consoleRef.current) io.observe(consoleRef.current);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playing || fading) return;
    const timer = window.setTimeout(() => goTo((stage + 1) % STAGES.length, FADE_OUT_MS), STEP_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, stage, fading]);

  const choose = (i: number) => {
    setCaptionIdx(i);
    if (i === stage && !fading) return;
    goTo(i, FADE_OUT_CLICK_MS);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const current = buttonsRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (current === -1) return;
    e.preventDefault();
    const next = (current + (e.key === "ArrowRight" ? 1 : -1) + STAGES.length) % STAGES.length;
    buttonsRef.current[next]?.focus();
    choose(next);
  };

  const amount = <span className="mono">₹48,000</span>;

  return (
    <section className="stage-section" aria-label={s.groupLabel}>
      <div
        className="container hero__stage"
        data-reveal
        onFocus={(e) => {
          // Pause for keyboard users only; a mouse click focuses the button too.
          if ((e.target as HTMLElement).matches?.(":focus-visible")) setKeyboardPaused(true);
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setKeyboardPaused(false);
        }}
      >
        <div
          className={`flow${playing ? " is-playing" : ""}`}
          id="flow"
          role="group"
          aria-label={s.groupLabel}
          style={{ ["--flow-dur" as string]: `${STEP_MS}ms` } as CSSProperties}
          onKeyDown={onKeyDown}
        >
          {STAGES.map((key, i) => (
            <button
              key={key}
              ref={(el) => {
                buttonsRef.current[i] = el;
              }}
              type="button"
              className={`flow__step${i < stage ? " is-done" : ""}`}
              data-stage-btn={key}
              aria-pressed={i === stage}
              onClick={() => choose(i)}
            >
              <span className="flow__num mono">{String(i + 1).padStart(2, "0")}</span>
              <span className="flow__label">{s.steps[i]}</span>
              <span className="flow__bar" aria-hidden="true" />
            </button>
          ))}
        </div>
        <p className="visually-hidden" id="stage-caption" aria-live="polite">{s.captions[captionIdx]}</p>

        <div className={`console${fading ? " is-fading" : ""}`} id="console" ref={consoleRef} data-stage={STAGES[stage]} aria-describedby="stage-caption">
          <div className="console__chrome" aria-hidden="true">
            <span className="console__dots"><i /><i /><i /></span>
            <span className="console__crumbs">{s.projects} <span>/</span> <b>Northwind rebrand</b></span>
            <span className="console__share">{s.share}</span>
          </div>

          <div className="console__app" aria-hidden="true">
            <aside className="console__side">
              <span className="cs-item"><svg viewBox="0 0 24 24"><path d="M4 19V5M4 19h16M8 15l3-4 3 2 5-6" /></svg>{s.side.dashboard}</span>
              <span className="cs-item is-active"><svg viewBox="0 0 24 24"><rect x="4" y="6" width="12" height="12" rx="2" /><path d="M8 4h10a2 2 0 0 1 2 2v10" /></svg>{s.side.projects}</span>
              <span className="cs-item"><svg viewBox="0 0 24 24"><path d="M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5" /></svg>{s.side.assets}</span>
              <span className="cs-item"><svg viewBox="0 0 24 24"><path d="M4 7h13l-3-3M20 17H7l3 3" /></svg>{s.side.transactions}</span>
              <span className="cs-item"><svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" /></svg>{s.side.invoices}</span>
            </aside>

            <div className="console__main">
              <div className="console__head">
                <div>
                  <p className="console__title">Northwind rebrand</p>
                  <p className="console__sub">{s.sub}</p>
                </div>
                <div className="console__value">
                  <strong className="mono">₹48,000</strong>
                  <span className="swap swap--end">
                    <span className="status status--blue" data-when="preview">{s.status.review}</span>
                    <span className="status status--green" data-when="approve">{s.status.approved}</span>
                    <span className="status status--amber" data-when="pay">{s.status.due}</span>
                    <span className="status status--green" data-when="download">{s.status.paid}</span>
                  </span>
                </div>
              </div>

              <div className="console__body">
                <div className="pv">
                  <div className="pv__art">
                    <div className="art">
                      <div className="art__mark"><span /><span /></div>
                      <div className="art__word">Northwind</div>
                      <div className="art__row">
                        <i style={{ ["--c" as string]: "#0f2a44" }} />
                        <i style={{ ["--c" as string]: "#2f6f8f" }} />
                        <i style={{ ["--c" as string]: "#e9e3d6" }} />
                        <i style={{ ["--c" as string]: "#d9774b" }} />
                      </div>
                      <div className="art__type"><b>Aa</b><span>Display / 72<br />Text / 16</span></div>
                    </div>
                    <div className="pv__watermark">
                      <span>{WATERMARK}</span><span>{WATERMARK}</span><span>{WATERMARK}</span><span>{WATERMARK}</span>
                    </div>
                    <span className="pv__pin">1</span>
                  </div>
                  <div className="pv__foot swap">
                    <div className="note" data-when="preview">
                      <span className="avatar avatar--sm" style={{ ["--h" as string]: 208 }}>NS</span>
                      <p><b>Northwind Studio</b> {s.notes.comment}</p>
                    </div>
                    <div className="note note--ok" data-when="approve">
                      <TickIcon />
                      <p><b>{s.notes.approvedTitle}</b> {s.notes.approvedRest}</p>
                    </div>
                    <div className="note" data-when="pay">
                      <LockIcon />
                      <p><b>{s.notes.lockedTitle}</b> {s.notes.lockedRest}</p>
                    </div>
                    <div className="note note--ok" data-when="download">
                      <TickIcon />
                      <p><b>{s.notes.fullTitle}</b> {s.notes.fullRest}</p>
                    </div>
                  </div>
                </div>

                <div className="rail">
                  <section className="rail__panel">
                    <div className="rail__row">
                      <span className="rail__label">{s.revisions}</span>
                      <span className="rail__chips"><span className="chip">{s.revisionsLeft}</span><span className="chip">{s.extra}</span></span>
                    </div>
                    <span className="meter"><span style={{ width: "33%" }} /></span>
                  </section>

                  <section className="rail__panel">
                    <span className="rail__label">{s.projectFiles}</span>
                    <ul className="files">
                      {FILES.map((f) => (
                        <li key={f.name}>
                          <span className="ft">{f.type}</span>
                          <span className="fn">{f.name}<small>{f.size}</small></span>
                          <span className="fs"><LockIcon className="i-lock" /><DownloadIcon className="i-dl" /></span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="rail__panel rail__pay">
                    <span className="rail__label">{s.payment}</span>
                    <div className="swap">
                      <div className="pay" data-when="preview">
                        <p className="pay__title">{s.pay.requested}</p>
                        <p className="pay__sub">{s.pay.requestedSub}</p>
                      </div>
                      <div className="pay" data-when="approve">
                        <p className="pay__title">{fmt(s.pay.invoiceReady, { amount })}</p>
                        <p className="pay__sub">{s.pay.sentWith}</p>
                      </div>
                      <div className="pay" data-when="pay">
                        <p className="pay__title">{s.pay.required}</p>
                        <span className="pay__btn">{fmt(s.pay.payToUnlock, { amount })}</span>
                      </div>
                      <div className="pay pay--done" data-when="download">
                        <p className="pay__title">{s.pay.confirmed}</p>
                        <span className="pay__btn pay__btn--ok">{s.pay.download}</span>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="hero__note demo-note">{s.note}</p>
      </div>
    </section>
  );
}
