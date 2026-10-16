"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { DotField } from "./DotField";
import { PathsCard } from "./Deck";

/** Two destinations side by side: hire a freelancer (left), Assets Store (right). */
export function SplitPaths() {
  const { m } = useI18n();
  const s = m.home.split;
  return (
    <section className="paths" aria-label={s.title}>
      <DotField />
      <div className="container paths__grid">
        <div className="paths__col" data-reveal>
          <PathsCard kind="hire" />
          <span className="paths__chip">{s.hire.chip}</span>
          <h2 className="paths__title">
            <span>{s.hire.line1}</span>
            <span className="paths__soft">{s.hire.line2}</span>
          </h2>
          <Link href="/freelancers/" className="btn btn--ink btn--lg">{s.hire.cta}</Link>
        </div>
        <div className="paths__col" data-reveal style={{ ["--i" as string]: 1 }}>
          <PathsCard kind="assets" />
          <span className="paths__chip">{s.assets.chip}</span>
          <h2 className="paths__title">
            <span>{s.assets.line1}</span>
            <span className="paths__soft">{s.assets.line2}</span>
          </h2>
          <Link href="/store/" className="btn btn--soft btn--lg">{s.assets.cta}</Link>
        </div>
      </div>
    </section>
  );
}
