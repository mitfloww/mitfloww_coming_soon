"use client";

import { useEffect, useRef, useState } from "react";
import { fmt, useI18n } from "@/lib/i18n/I18nProvider";

const WM = "PREVIEW · MITFLOWW · PREVIEW · MITFLOWW";

export function Workflow() {
  const { m } = useI18n();
  const w = m.home.workflow;
  const [active, setActive] = useState(1);
  const scenesRef = useRef<HTMLDivElement>(null);

  // Highlight the step whose scene crosses the middle of the viewport.
  useEffect(() => {
    const scenes = scenesRef.current?.querySelectorAll<HTMLElement>(".scene[data-scene]");
    if (!scenes?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.getAttribute("data-scene")));
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    scenes.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const amount = <span className="mono">₹48,000</span>;

  return (
    <section id="how-it-works" className="section section--ruled workflow" aria-labelledby="workflow-title">
      <div className="container">
        <div className="section-head section-head--split">
          <div className="workflow__heading">
            <p className="eyebrow" data-reveal>{w.eyebrow}</p>
            <h2 id="workflow-title" className="h2" data-reveal style={{ ["--i" as string]: 1 }}>{w.title}</h2>
          </div>
          <p className="lead" data-reveal style={{ ["--i" as string]: 2 }}>{w.lead}</p>
        </div>

        <div className="workflow__grid">
          <ol className="steps" role="list">
            {w.steps.map((step, i) => (
              <li key={i} className={`step${active === i + 1 ? " is-active" : ""}`} data-step={i + 1}>
                <span className="step__num mono">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="step__title">{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="scenes" ref={scenesRef}>
            {/* 01 Prepare */}
            <figure className="scene" data-scene="1">
              <div className="scene__label"><span className="mono">01</span> {w.steps[0].title}</div>
              <div className="card setup" aria-hidden="true">
                <div className="setup__head"><span>{w.setup.newProject}</span><span className="status status--neutral">{w.setup.draft}</span></div>
                <div className="field"><span>{w.setup.projectName}</span><b>Northwind rebrand</b></div>
                <div className="field"><span>{w.setup.client}</span><b>Northwind Studio</b></div>
                <div className="field-row">
                  <div className="field"><span>{w.setup.projectValue}</span><b className="mono">₹48,000</b></div>
                  <div className="field"><span>{w.setup.revisionsIncluded}</span><b className="mono">3</b></div>
                  <div className="field"><span>{w.setup.extraRevision}</span><b className="mono">₹500</b></div>
                </div>
                <div className="toggle-row"><span>{w.setup.watermark}</span><span className="switch is-on" /></div>
                <div className="toggle-row"><span>{w.setup.release}</span><span className="switch is-on" /></div>
                <div className="setup__files"><span className="ft">AI</span><span className="ft">PDF</span><span className="ft">ZIP</span><span className="ft">SVG</span><em>{w.setup.uploaded}</em></div>
              </div>
              <figcaption className="visually-hidden">{w.setup.caption}</figcaption>
            </figure>

            {/* 02 Review */}
            <figure className="scene" data-scene="2">
              <div className="scene__label"><span className="mono">02</span> {w.steps[1].title}</div>
              <div className="card review" aria-hidden="true">
                <div className="review__canvas">
                  <div className="art art--small">
                    <div className="art__mark"><span /><span /></div>
                    <div className="art__word">Northwind</div>
                  </div>
                  <div className="pv__watermark pv__watermark--static"><span>{WM}</span><span>{WM}</span><span>{WM}</span></div>
                  <span className="pv__pin" style={{ left: "62%", top: "58%" }}>1</span>
                  <span className="pv__pin" style={{ left: "24%", top: "30%" }}>2</span>
                </div>
                <div className="review__thread">
                  <p className="rail__label">{w.review.requests}</p>
                  <div className="comment"><span className="pv__pin pv__pin--inline">1</span><p><b>Northwind Studio</b>{w.review.comment1}</p></div>
                  <div className="comment"><span className="pv__pin pv__pin--inline">2</span><p><b>Northwind Studio</b>{w.review.comment2}</p></div>
                  <div className="review__meta"><span className="status status--amber">{w.review.commented}</span><span className="mono">{w.review.revision}</span></div>
                </div>
              </div>
              <figcaption className="visually-hidden">{w.review.caption}</figcaption>
            </figure>

            {/* 03 Approve and pay */}
            <figure className="scene" data-scene="3">
              <div className="scene__label"><span className="mono">03</span> {w.steps[2].title}</div>
              <div className="card checkout" aria-hidden="true">
                <div className="checkout__approved">
                  <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                  <div><b>{w.checkout.approved}</b><span>{w.checkout.approvedSub}</span></div>
                </div>
                <div className="invoice">
                  <div className="invoice__row invoice__row--head"><span>{w.checkout.invoice}</span><span className="mono">INV-2026-0012</span></div>
                  <div className="invoice__row"><span>{w.checkout.projectValue}</span><span className="mono">₹48,000</span></div>
                  <div className="invoice__row"><span>{w.checkout.extraRevisions}</span><span className="mono">₹0</span></div>
                  <div className="invoice__row invoice__row--total"><span>{w.checkout.totalDue}</span><span className="mono">₹48,000</span></div>
                </div>
                <div className="checkout__cta"><span className="pay__btn">{fmt(w.checkout.pay, { amount })}</span><small>{w.checkout.note}</small></div>
              </div>
              <figcaption className="visually-hidden">{w.checkout.caption}</figcaption>
            </figure>

            {/* 04 Release */}
            <figure className="scene" data-scene="4">
              <div className="scene__label"><span className="mono">04</span> {w.steps[3].title}</div>
              <div className="card release" aria-hidden="true">
                <div className="release__head"><span className="status status--green">{w.release.confirmed}</span><span className="mono">{w.release.access}</span></div>
                <ul className="files files--lg">
                  {[
                    ["AI", "Logo_Suite.ai", "24.8 MB"],
                    ["PDF", "Brand_Guidelines.pdf", "12.1 MB"],
                    ["ZIP", "Social_Templates.zip", "86 MB"],
                    ["SVG", "Wordmark.svg", "312 KB"],
                  ].map(([t, n, sz]) => (
                    <li key={n}><span className="ft">{t}</span><span className="fn">{n}<small>{sz}</small></span><span className="dl">{w.release.download}</span></li>
                  ))}
                </ul>
              </div>
              <figcaption className="visually-hidden">{w.release.caption}</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
