"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import { fmt, useI18n } from "@/lib/i18n/I18nProvider";
import { CITIES, PEOPLE, SPECIALTIES, type Person, type Specialty } from "@/lib/data/directory";
import { ArrowIcon, InfoIcon, PinIcon, SearchIcon } from "@/components/icons";
import { Sheet } from "./Sheet";

const d = (i: number) => ({ ["--i" as string]: i }) as CSSProperties;
const hue = (h: number) => ({ ["--h" as string]: h }) as CSSProperties;

/**
 * Proximity groups for a chosen city: 0 same city, 1 same state,
 * 2 works remotely, 3 elsewhere (hidden when a city is chosen).
 */
function groupFor(p: Person, city: string, state: string): number {
  if (!city) return 0;
  if (p.city === city) return 0;
  if (p.state === state) return 1;
  if (p.remote) return 2;
  return 3;
}

export function FreelancersPage() {
  const { m } = useI18n();
  const t = m.freelancers;
  const people = m.directory.people;
  const specs = m.directory.specialties;
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState<Specialty | "all">("all");
  const [location, setLocation] = useState("");
  const [includeRemote, setIncludeRemote] = useState(true);
  const [openSlug, setOpenSlug] = useState<Person["slug"] | null>(null);
  const [city, state] = location ? location.split("|") : ["", ""];

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    return PEOPLE.map((p, index) => ({ p, index, group: groupFor(p, city, state) }))
      .filter(({ p, group }) => {
        const tr = people[p.slug];
        const hay = [p.name, tr.role, p.specialty, specs[p.specialty], p.city, p.state, ...tr.skills].join(" ").toLowerCase();
        const matchesText = !q || hay.includes(q);
        const matchesSpec = specialty === "all" || p.specialty === specialty;
        // Without a chosen city there is no distance to compare, so everyone is in range.
        const inRange = !city || group < 2 || (group === 2 && includeRemote);
        return matchesText && matchesSpec && inRange;
      })
      .sort((a, b) => a.group - b.group || a.index - b.index);
  }, [query, specialty, city, state, includeRemote, people, specs]);

  const reset = () => {
    setQuery("");
    setSpecialty("all");
    setLocation("");
    setIncludeRemote(true);
  };

  const matchLabel = (group: number) =>
    !city ? "" : group === 0 ? fmt(t.matchCity, { city }) : group === 1 ? fmt(t.matchState, { state }) : t.matchRemote;

  const open = PEOPLE.find((p) => p.slug === openSlug) ?? null;

  return (
    <main id="main">
      <section className="dir-hero" aria-labelledby="talent-title">
        <div className="container dir-hero__grid">
          <div className="dir-hero__copy">
            <p className="eyebrow" data-reveal>{t.eyebrow}</p>
            <h1 id="talent-title" className="display" data-reveal style={d(1)}>{t.title}</h1>
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

      <section className="container" aria-labelledby="results-title" style={{ paddingBottom: "var(--section-y)" }}>
        <div className="talent-layout">
          <form className="filters" id="talent-filters" role="search" aria-label={t.filterLabel} onSubmit={(e) => e.preventDefault()} onReset={(e) => { e.preventDefault(); reset(); }}>
            <p className="filters__title">{t.filter}</p>
            <div className="control">
              <label htmlFor="talent-search">{t.nameOrSkill}</label>
              <div className="input-icon">
                <SearchIcon />
                <input id="talent-search" className="input" type="search" placeholder={t.searchPlaceholder} autoComplete="off" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
            </div>
            <div className="control">
              <label htmlFor="talent-specialty">{t.specialty}</label>
              <select id="talent-specialty" className="select" value={specialty} onChange={(e) => setSpecialty(e.target.value as Specialty | "all")}>
                <option value="all">{t.allSpecialties}</option>
                {SPECIALTIES.map((s) => <option key={s} value={s}>{specs[s]}</option>)}
              </select>
            </div>
            <div className="control">
              <label htmlFor="talent-location">{t.yourLocation}</label>
              <select id="talent-location" className="select" value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="">{t.anywhere}</option>
                {CITIES.map((c) => <option key={c.city} value={`${c.city}|${c.state}`}>{c.city}, {c.state}</option>)}
              </select>
              <p className="filters__hint">{t.locationHint}</p>
            </div>
            <label className="check"><input type="checkbox" id="talent-remote" checked={includeRemote} onChange={(e) => setIncludeRemote(e.target.checked)} /> {t.includeRemote}</label>
            <button type="reset" className="btn btn--ghost btn--sm">{t.clear}</button>
          </form>

          <div>
            <h2 id="results-title" className="visually-hidden">{t.resultsHeading}</h2>
            <div className="results-meta" style={{ marginTop: 0 }}>
              <p id="talent-count" aria-live="polite">{results.length === 1 ? t.countOne : fmt(t.countMany, { count: results.length })}</p>
              <p id="talent-order">{city ? fmt(includeRemote ? t.nearestRemote : t.nearest, { city }) : t.allLocations}</p>
            </div>

            {results.length > 0 ? (
              <ul className="profile-list" id="talent-list" role="list">
                {results.map(({ p, group }) => {
                  const tr = people[p.slug];
                  const match = matchLabel(group);
                  return (
                    <li className="profile" key={p.slug}>
                      <span className="avatar avatar--lg" style={hue(p.hue)} aria-hidden="true">{p.initials}</span>
                      <div className="profile__main">
                        <h3 className="profile__name">{p.name}</h3>
                        <p className="profile__role">{tr.role}</p>
                        <p className="profile__loc"><PinIcon />{p.city}, {p.state}{p.remote ? ` · ${t.worksRemotely}` : ""} {match ? <span className="match">{match}</span> : null}</p>
                        <p className="profile__about">{tr.about}</p>
                        <div className="profile__skills">{tr.skills.map((s) => <span className="tag" key={s}>{s}</span>)}</div>
                        <div className="profile__actions">
                          <button type="button" className="btn btn--secondary btn--sm" aria-haspopup="dialog" onClick={() => setOpenSlug(p.slug)}>{t.viewProfile}</button>
                        </div>
                      </div>
                      <div className="profile__work" aria-hidden="true">{p.thumbs.map((th, i) => <span className={`thumb thumb--${th}`} key={i} />)}</div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="empty" id="talent-empty">
                <h3>{t.emptyTitle}</h3>
                <p>{t.emptyText}</p>
                <button type="button" className="btn btn--secondary btn--sm" onClick={reset}>{t.clear}</button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section section--ruled" aria-labelledby="how-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow" data-reveal>{t.howEyebrow}</p>
            <h2 id="how-title" className="h2" data-reveal style={d(1)}>{t.howTitle}</h2>
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
          <div className="cta-strip" style={{ marginTop: "clamp(48px, 6vw, 80px)" }} data-reveal>
            <div>
              <h2 className="h3">{t.selfTitle}</h2>
              <p>{t.selfText}</p>
            </div>
            <div className="cta-strip__actions">
              <a href="/preregister/" className="btn btn--primary btn--lg">{t.joinWaitlist} <ArrowIcon /></a>
              <Link href="/store/" className="btn btn--secondary btn--lg">{t.exploreAssets}</Link>
            </div>
          </div>
        </div>
      </section>

      <Sheet id="person-sheet" labelId="person-sheet-title" open={open !== null} onClose={() => setOpenSlug(null)} closeLabel={m.directory.close}>
        {open ? <PersonDetail person={open} /> : null}
      </Sheet>
    </main>
  );
}

function PersonDetail({ person }: { person: Person }) {
  const { m } = useI18n();
  const t = m.freelancers;
  const tr = m.directory.people[person.slug];
  return (
    <>
      <div className="sheet__head">
        <span className="avatar avatar--xl" style={hue(person.hue)} aria-hidden="true">{person.initials}</span>
        <div>
          <p className="eyebrow eyebrow--plain">{t.sheetSample}</p>
          <h2 className="sheet__title" id="person-sheet-title">{person.name}</h2>
          <p className="sheet__row">{tr.role}</p>
        </div>
      </div>
      <div className="sheet__body">
        <p className="sheet__desc">{tr.about}</p>
        <div className="profile__skills">{tr.skills.map((s) => <span className="tag" key={s}>{s}</span>)}</div>
        <div className="sheet__gallery" aria-hidden="true">{person.thumbs.map((th, i) => <span className={`thumb thumb--${th}`} key={i} />)}</div>
        <dl className="sheet__facts">
          <div><dt>{t.basedIn}</dt><dd>{person.city}, {person.state}</dd></div>
          <div><dt>{t.serviceArea}</dt><dd>{tr.area}</dd></div>
          <div><dt>{t.factSpecialty}</dt><dd>{m.directory.specialties[person.specialty]}</dd></div>
        </dl>
        <div className="sheet__actions">
          <button type="button" className="btn btn--primary" disabled aria-describedby={`hire-note-${person.slug}`}>{t.hire}</button>
          <p id={`hire-note-${person.slug}`}>{t.hireNote} <a className="text-link" href="/preregister/">{t.joinWaitlist}</a></p>
        </div>
      </div>
    </>
  );
}
