"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import { fmt, useI18n } from "@/lib/i18n/I18nProvider";
import { ASSETS, ASSET_CATEGORIES, type Asset, type AssetCategory } from "@/lib/data/directory";
import { ArrowIcon, InfoIcon, SearchIcon } from "@/components/icons";
import { Sheet } from "./Sheet";

const d = (i: number) => ({ ["--i" as string]: i }) as CSSProperties;
const hue = (h: number) => ({ ["--h" as string]: h }) as CSSProperties;

type Sort = "featured" | "title" | "creator";

export function StorePage() {
  const { m } = useI18n();
  const t = m.store;
  const cats = m.directory.categories;
  const [category, setCategory] = useState<AssetCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.toLowerCase().trim();
    const list = ASSETS.filter((a) => {
      if (category !== "all" && a.category !== category) return false;
      if (!q) return true;
      const hay = [a.title, a.creator.name, a.category, cats[a.category], ...a.formats].join(" ").toLowerCase();
      return hay.includes(q);
    });
    if (sort === "title") return [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "creator") return [...list].sort((a, b) => a.creator.name.localeCompare(b.creator.name));
    return list;
  }, [category, query, sort, cats]);

  const open = ASSETS.find((a) => a.slug === openSlug) ?? null;
  const reset = () => {
    setQuery("");
    setCategory("all");
  };

  return (
    <main id="main">
      <section className="dir-hero" aria-labelledby="store-title">
        <div className="container dir-hero__grid">
          <div className="dir-hero__copy">
            <p className="eyebrow" data-reveal>{t.eyebrow}</p>
            <h1 id="store-title" className="display" data-reveal style={d(1)}>{t.title}</h1>
          </div>
          <div className="dir-hero__copy">
            <p className="lead" data-reveal style={d(2)}>{t.lead}</p>
            <div className="notice" data-reveal style={d(3)}>
              <InfoIcon />
              <p><b>{t.noticeStrong}</b> {t.noticeText} <a href="/preregister/">{t.noticeLink}</a> {t.noticeEnd}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container" aria-labelledby="browse-title">
        <h2 id="browse-title" className="visually-hidden">{t.browseHeading}</h2>
        <div className="store-toolbar">
          <div className="segments" role="group" aria-label={t.categoryGroup}>
            <button type="button" className="segment" aria-pressed={category === "all"} onClick={() => setCategory("all")}>{t.all}</button>
            {ASSET_CATEGORIES.map((c) => (
              <button key={c} type="button" className="segment" aria-pressed={category === c} onClick={() => setCategory(c)}>{cats[c]}</button>
            ))}
          </div>
          <div className="control">
            <label htmlFor="asset-search" className="visually-hidden">{t.search}</label>
            <div className="input-icon">
              <SearchIcon />
              <input id="asset-search" className="input" type="search" placeholder={t.searchPlaceholder} autoComplete="off" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
          <div className="control">
            <label htmlFor="asset-sort" className="visually-hidden">{t.sort}</label>
            <select id="asset-sort" className="select" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="featured">{t.sortFeatured}</option>
              <option value="title">{t.sortName}</option>
              <option value="creator">{t.sortCreator}</option>
            </select>
          </div>
        </div>

        <div className="results-meta">
          <p id="asset-count" aria-live="polite">{visible.length === 1 ? t.countOne : fmt(t.countMany, { count: visible.length })}</p>
          <p className="demo-note">{t.sampleNote}</p>
        </div>

        {visible.length > 0 ? (
          <ul className="asset-grid" id="asset-grid" role="list">
            {visible.map((a) => (
              <li key={a.slug}>
                <button type="button" className="asset-card" aria-haspopup="dialog" onClick={() => setOpenSlug(a.slug)}>
                  <span className={`thumb thumb--${a.thumb}`} aria-hidden="true" />
                  <span className="asset-card__meta">
                    <span className="asset-card__title">{a.title}</span>
                    <span className="asset-card__by"><span className="avatar avatar--sm" style={hue(a.creator.hue)} aria-hidden="true">{a.creator.initials}</span>{a.creator.name}</span>
                    <span className="asset-card__row"><span>{cats[a.category]}</span>{a.formats.map((f) => <span className="tag" key={f}>{f}</span>)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty" id="asset-empty">
            <h3>{t.emptyTitle}</h3>
            <p>{t.emptyText}</p>
            <button type="button" className="btn btn--secondary btn--sm" onClick={reset}>{t.clear}</button>
          </div>
        )}
      </section>

      <section className="section" aria-labelledby="channels-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow" data-reveal>{t.creatorsEyebrow}</p>
            <h2 id="channels-title" className="h2" data-reveal style={d(1)}>{t.creatorsTitle}</h2>
            <p className="lead" data-reveal style={d(2)}>{t.creatorsLead}</p>
          </div>
          <ol className="explain" role="list">
            {t.explain.map((e, i) => (
              <li key={i} data-reveal style={i ? d(i) : undefined}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                <h3>{e.title}</h3>
                <p>{e.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container" aria-labelledby="sell-title" style={{ paddingBottom: "var(--section-y)" }}>
        <div className="cta-strip" data-reveal>
          <div>
            <h2 id="sell-title" className="h3">{t.sellTitle}</h2>
            <p>{t.sellText}</p>
          </div>
          <div className="cta-strip__actions">
            <a href="/preregister/" className="btn btn--primary btn--lg">{t.joinWaitlist} <ArrowIcon /></a>
            <Link href="/freelancers/" className="btn btn--secondary btn--lg">{t.findFreelancer}</Link>
          </div>
        </div>
      </section>

      <Sheet id="asset-sheet" labelId="asset-sheet-title" open={open !== null} onClose={() => setOpenSlug(null)} closeLabel={m.directory.close}>
        {open ? <AssetDetail asset={open} /> : null}
      </Sheet>
    </main>
  );
}

function AssetDetail({ asset }: { asset: Asset }) {
  const { m } = useI18n();
  const t = m.store;
  const cat = m.directory.categories[asset.category];
  return (
    <>
      <span className={`thumb thumb--${asset.thumb} sheet__media`} aria-hidden="true" />
      <div className="sheet__body">
        <p className="eyebrow eyebrow--plain">{cat} · {t.sheetSample}</p>
        <h2 className="sheet__title" id="asset-sheet-title">{asset.title}</h2>
        <p className="sheet__row"><span className="avatar avatar--sm" style={hue(asset.creator.hue)} aria-hidden="true">{asset.creator.initials}</span>{fmt(t.by, { name: asset.creator.name })}</p>
        <p className="sheet__desc">{m.directory.assets[asset.slug as keyof typeof m.directory.assets]}</p>
        <dl className="sheet__facts">
          <div><dt>{t.factCategory}</dt><dd>{cat}</dd></div>
          <div><dt>{t.factFormats}</dt><dd>{asset.formats.join(", ")}</dd></div>
          <div><dt>{t.factAlso}</dt><dd>{fmt(t.factAlsoValue, { name: asset.creator.name })}</dd></div>
        </dl>
        <div className="sheet__actions">
          <button type="button" className="btn btn--primary" disabled aria-describedby={`buy-note-${asset.slug}`}>{t.purchase}</button>
          <p id={`buy-note-${asset.slug}`}>{t.purchaseNote} <a className="text-link" href="/preregister/">{t.joinWaitlist}</a></p>
        </div>
      </div>
    </>
  );
}
