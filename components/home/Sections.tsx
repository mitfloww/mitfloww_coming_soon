"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { fmt, useI18n } from "@/lib/i18n/I18nProvider";
import { ArrowIcon, LockIcon, PinIcon, SmallArrowIcon } from "@/components/icons";

const d = (i: number) => ({ ["--i" as string]: i }) as CSSProperties;
const hue = (h: number) => ({ ["--h" as string]: h }) as CSSProperties;

/* ---------------------------------------------------------------- Why */
export function Why() {
  const { m } = useI18n();
  const w = m.home.why;
  return (
    <section className="section section--ruled why" aria-labelledby="why-title">
      <div className="container">
        <div className="why__intro">
          <p className="eyebrow" data-reveal>{w.eyebrow}</p>
          <h2 id="why-title" className="h2" data-reveal style={d(1)}>{w.title}</h2>
          <p className="lead" data-reveal style={d(2)}>{w.lead}</p>
        </div>

        <div className="compare" data-reveal>
          <div className="compare__col compare__col--before">
            <p className="compare__title">{w.beforeTitle}</p>
            <ol role="list">
              {w.before.map((item, i) => (
                <li key={i}><span className="mono">{String(i + 1).padStart(2, "0")}</span>{item}</li>
              ))}
            </ol>
          </div>
          <div className="compare__col compare__col--after">
            <p className="compare__title">{w.afterTitle}</p>
            <ol role="list">
              {w.after.map((item, i) => (
                <li key={i}><span className="mono">{String(i + 1).padStart(2, "0")}</span>{item}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Features */
export function Features() {
  const { m } = useI18n();
  const f = m.home.features;
  const amount = <b className="mono">₹500</b>;
  return (
    <section id="features" className="features" aria-labelledby="features-title">
      <h2 id="features-title" className="visually-hidden">{f.heading}</h2>

      {/* Feature 1: payment-aware access */}
      <article className="feature section section--ruled">
        <div className="container feature__grid">
          <div className="feature__copy">
            <p className="eyebrow" data-reveal>{f.access.eyebrow}</p>
            <h3 className="h2" data-reveal style={d(1)}>{f.access.title}</h3>
            <p className="lead" data-reveal style={d(2)}>{f.access.lead}</p>
            <ul className="ticks" role="list" data-reveal style={d(3)}>
              {f.access.ticks.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
          <div className="feature__visual" data-reveal style={d(2)}>
            <div className="card vault" aria-hidden="true">
              <div className="vault__head">
                <span className="rail__label">{f.access.deliverables}</span>
                <span className="status status--amber">{f.access.awaiting}</span>
              </div>
              <ul className="files files--lg">
                {[
                  ["AI", "Logo_Suite.ai", f.access.source, "24.8 MB"],
                  ["MOV", "Launch_Film_4K.mov", f.access.master, "3.8 GB"],
                  ["ZIP", "Print_Ready.zip", f.access.archive, "210 MB"],
                ].map(([t, n, kind, sz]) => (
                  <li key={n}>
                    <span className="ft">{t}</span>
                    <span className="fn">{n}<small>{kind} · {sz}</small></span>
                    <span className="lock"><LockIcon />{f.access.locked}</span>
                  </li>
                ))}
              </ul>
              <div className="vault__foot">
                <div className="toggle-row"><span>{f.access.release}</span><span className="switch is-on" /></div>
                <div className="toggle-row"><span>{f.access.allowPreview}</span><span className="switch" /></div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Feature 2: revisions */}
      <article className="feature feature--reverse section section--ruled">
        <div className="container feature__grid">
          <div className="feature__copy">
            <p className="eyebrow" data-reveal>{f.revisions.eyebrow}</p>
            <h3 className="h2" data-reveal style={d(1)}>{f.revisions.title}</h3>
            <p className="lead" data-reveal style={d(2)}>{f.revisions.lead}</p>
            <div className="bigstat" data-reveal style={d(3)}>
              <span className="bigstat__n">2<span>/3</span></span>
              <span className="bigstat__l">{fmt(f.revisions.statLabel, { amount })}</span>
            </div>
          </div>
          <div className="feature__visual" data-reveal style={d(2)}>
            <div className="card revs" aria-hidden="true">
              <div className="revs__top">
                <span className="rail__label">{f.revisions.revisions}</span>
                <span className="rail__chips"><span className="chip">{f.revisions.left}</span><span className="chip">{f.revisions.extra}</span></span>
              </div>
              <span className="meter"><span style={{ width: "33%" }} /></span>
              <p className="rail__label revs__vh">{f.revisions.history}</p>
              <ol className="timeline">
                <li className="is-current"><b>{f.revisions.latest}</b><span>{f.revisions.latestNote}</span><small>{f.revisions.latestMeta}</small></li>
                <li><b>{f.revisions.initial}</b><span>{f.revisions.initialNote}</span><small>{f.revisions.initialMeta}</small></li>
              </ol>
              <div className="revs__upload"><span className="pay__btn">{f.revisions.upload}</span></div>
            </div>
          </div>
        </div>
      </article>

      {/* Feature 3: client experience */}
      <article className="feature feature--wide section section--ruled">
        <div className="container">
          <div className="feature__center">
            <p className="eyebrow" data-reveal>{f.client.eyebrow}</p>
            <h3 className="h2" data-reveal style={d(1)}>{f.client.title}</h3>
            <p className="lead" data-reveal style={d(2)}>{f.client.lead}</p>
          </div>

          <div className="client-page card" data-reveal style={d(2)} aria-hidden="true">
            <div className="client-page__id">
              <span className="avatar avatar--lg" style={hue(24)}>MN</span>
              <div><b>Meera Nair</b><span>{f.client.role}</span></div>
              <span className="tag">{f.client.sharedWith}</span>
            </div>
            <div className="client-page__body">
              <div className="client-page__files">
                <p className="rail__label">{f.client.files}</p>
                <div className="thumbs">
                  <span className="thumb thumb--brand" />
                  <span className="thumb thumb--guide" />
                  <span className="thumb thumb--social" />
                  <span className="thumb thumb--word" />
                </div>
              </div>
              <div className="client-page__summary">
                <div className="invoice">
                  <div className="invoice__row invoice__row--head"><span>{f.client.summary}</span><span className="status status--blue">{f.client.inReview}</span></div>
                  <div className="invoice__row"><span>{f.client.projectValue}</span><span className="mono">₹48,000</span></div>
                  <div className="invoice__row"><span>{f.client.revisions}</span><span className="mono">{f.client.left}</span></div>
                  <div className="invoice__row"><span>{f.client.finalFiles}</span><span>{f.client.afterPayment}</span></div>
                </div>
                <span className="pay__btn pay__btn--wide">{f.client.reviewFiles}</span>
              </div>
            </div>
          </div>

          <ul className="trio" role="list">
            {f.client.trio.map((item, i) => (
              <li key={i} data-reveal style={i ? d(i) : undefined}>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </section>
  );
}

/* ---------------------------------------------------------------- Assets Store band */
const MARKET = [
  { title: "Monoline Brand Kit", by: "Meera Nair", ini: "MN", h: 24, thumb: "brandkit", tags: ["AI", "PDF"] },
  { title: "Invoice & Quote Templates", by: "Studio Kalam", ini: "SK", h: 150, thumb: "invoice", tags: ["FIG", "PDF"] },
  { title: "Lower Thirds Pack", by: "Arjun Menon", ini: "AM", h: 265, thumb: "motion", tags: ["AEP", "MOV"] },
  { title: "Line Icon Set", by: "Farah Siddiqui", ini: "FS", h: 330, thumb: "icons", tags: ["SVG", "FIG"] },
];

export function StoreBand() {
  const { m } = useI18n();
  const s = m.home.storeBand;
  const cats = m.directory.categories;
  return (
    <section id="assets-store" className="section store-band" aria-labelledby="store-title">
      <div className="container">
        <div className="store-band__panel">
          <div className="store-band__head">
            <div>
              <p className="eyebrow" data-reveal>{s.eyebrow}</p>
              <h2 id="store-title" className="h2" data-reveal style={d(1)}>{s.title}</h2>
            </div>
            <div className="store-band__intro" data-reveal style={d(2)}>
              <p>{s.intro}</p>
              <Link href="/store/" className="btn btn--primary btn--lg">
                {s.cta}
                <ArrowIcon />
              </Link>
            </div>
          </div>

          <div className="market" data-reveal style={d(1)} aria-hidden="true">
            <div className="market__bar">
              <span className="market__search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></svg>{s.search}</span>
              <span className="market__cats">
                <span className="is-on">{s.all}</span><span>{cats.Templates}</span><span>{cats["Brand kits"]}</span><span>{cats.Illustrations}</span><span>{cats.Motion}</span><span>{cats["UI kits"]}</span>
              </span>
            </div>
            <div className="market__grid">
              {MARKET.map((a) => (
                <div className="asset" key={a.title}>
                  <div className={`thumb thumb--${a.thumb}`} />
                  <div className="asset__meta">
                    <b>{a.title}</b>
                    <span className="asset__by"><span className="avatar avatar--xs" style={hue(a.h)}>{a.ini}</span>{a.by}</span>
                    <span className="asset__tags">{a.tags.map((t) => <span key={t}>{t}</span>)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="channels">
            <div className="channel" data-reveal>
              <span className="channel__n mono">A</span>
              <div>
                <h3>{s.channelA.title}</h3>
                <p>{s.channelA.text}</p>
              </div>
            </div>
            <div className="channel" data-reveal style={d(1)}>
              <span className="channel__n mono">B</span>
              <div>
                <h3>{s.channelB.title}</h3>
                <p>{s.channelB.text}</p>
              </div>
            </div>
          </div>
          <p className="demo-note store-band__note">{s.note}</p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Freelancer preview */
const PEOPLE_PREVIEW = [
  { slug: "meera-nair", name: "Meera Nair", ini: "MN", h: 24, loc: "Kochi, Kerala", remote: false, thumbs: ["brandkit", "brand", "word"] },
  { slug: "arjun-menon", name: "Arjun Menon", ini: "AM", h: 265, loc: "Bengaluru, Karnataka", remote: true, thumbs: ["motion", "film", "social"] },
  { slug: "farah-siddiqui", name: "Farah Siddiqui", ini: "FS", h: 330, loc: "Hyderabad, Telangana", remote: true, thumbs: ["ui", "icons", "guide"] },
] as const;

export function TalentPreview() {
  const { m } = useI18n();
  const t = m.home.talent;
  return (
    <section id="find-a-freelancer" className="section section--ruled talent" aria-labelledby="talent-title">
      <div className="container talent__grid">
        <div className="talent__copy">
          <p className="eyebrow" data-reveal>{t.eyebrow}</p>
          <h2 id="talent-title" className="h2" data-reveal style={d(1)}>{t.title}</h2>
          <p className="lead" data-reveal style={d(2)}>{t.lead}</p>
          <div data-reveal style={d(3)}>
            <Link href="/freelancers/" className="btn btn--secondary btn--lg">
              {t.cta}
              <ArrowIcon />
            </Link>
          </div>
          <p className="demo-note" data-reveal style={d(4)}>{t.note}</p>
        </div>

        <div className="directory" data-reveal style={d(2)} aria-hidden="true">
          <div className="directory__filters">
            <span className="dfilter"><small>{t.skill}</small>{t.skillValue}</span>
            <span className="dfilter"><small>{t.location}</small><PinIcon />Kochi, Kerala</span>
            <span className="dfilter dfilter--ghost">{t.remoteOk}</span>
          </div>
          <ul className="people" role="list">
            {PEOPLE_PREVIEW.map((p) => {
              const person = m.directory.people[p.slug];
              return (
                <li className="person" key={p.slug}>
                  <span className="avatar avatar--md" style={hue(p.h)}>{p.ini}</span>
                  <div className="person__main">
                    <b>{p.name}</b>
                    <span className="person__role">{person.role}</span>
                    <span className="person__loc"><PinIcon />{p.loc}{p.remote ? ` · ${t.remote}` : ""}</span>
                    <span className="person__skills">{person.skills.map((s) => <span className="tag" key={s}>{s}</span>)}</span>
                  </div>
                  <span className="person__work">{p.thumbs.map((th) => <span className={`thumb thumb--${th}`} key={th} />)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Who it's for */
export function Audiences() {
  const { m } = useI18n();
  const w = m.home.who;
  return (
    <section id="who-its-for" className="section section--ruled who" aria-labelledby="who-title">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow" data-reveal>{w.eyebrow}</p>
          <h2 id="who-title" className="h2" data-reveal style={d(1)}>{w.title}</h2>
        </div>
        <ul className="who__list" role="list">
          {w.rows.map((r, i) => (
            <li className="who__row" data-reveal key={i}>
              <span className="who__name">{r.name}</span>
              <span className="who__eg">{r.eg}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Blog */
const POST_LINKS = [
  "/blog/get-paid-before-delivery.html",
  "/blog/freelance-payment-terms.html",
  "/blog/revision-abuse.html",
  "/blog/client-not-paying.html",
  "/blog/send-files-after-payment.html",
];

export function Journal() {
  const { m } = useI18n();
  const j = m.home.journal;
  const [feature, ...rest] = j.posts;
  return (
    <section id="resources" className="section section--ruled journal" aria-labelledby="journal-title">
      <div className="container">
        <div className="journal__head">
          <div>
            <p className="eyebrow" data-reveal>{j.eyebrow}</p>
            <h2 id="journal-title" className="h2" data-reveal style={d(1)}>{j.title}</h2>
          </div>
          <Link href="/blog/" className="text-link" data-reveal style={d(2)}>
            {j.all}
            <SmallArrowIcon />
          </Link>
        </div>

        <div className="journal__grid">
          <a className="post post--feature" href={POST_LINKS[0]} data-reveal>
            <span className="post__cat">{feature.cat}</span>
            <h3 className="post__title">{feature.title}</h3>
            <p>{feature.text}</p>
            <span className="post__more">
              {j.read}
              <SmallArrowIcon />
            </span>
          </a>

          <ul className="posts" role="list">
            {rest.map((p, i) => (
              <li key={i}>
                <a className="post" href={POST_LINKS[i + 1]} data-reveal style={d(i + 1)}>
                  <span className="post__cat">{p.cat}</span>
                  <h3 className="post__title">{p.title}</h3>
                  <p>{p.text}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Closing */
export function Closing() {
  const { m } = useI18n();
  const c = m.home.closing;
  return (
    <section className="section section--ruled closing" aria-labelledby="closing-title">
      <div className="container closing__inner">
        <h2 id="closing-title" className="display closing__title" data-reveal>{c.title}</h2>
        <div className="closing__side">
          <p className="lead" data-reveal style={d(1)}>{c.lead}</p>
          <div className="closing__actions" data-reveal style={d(2)}>
            <a href="/preregister/" className="btn btn--primary btn--lg">
              {c.cta}
              <ArrowIcon />
            </a>
            <span className="muted">{c.note}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
