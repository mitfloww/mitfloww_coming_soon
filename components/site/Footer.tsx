"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function Footer() {
  const { m } = useI18n();
  const f = m.footer;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Link href="/" className="brand" aria-label={m.nav.home}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="logo--on-light" src="/assets/logo/SVG/horizontal/mitfloww-logo-horizontal-color-black-wordmark.svg" alt="MitFloww" width={138} height={26} loading="lazy" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="logo--on-dark" src="/assets/logo/SVG/horizontal/mitfloww-logo-horizontal-color-white-wordmark.svg" alt="MitFloww" width={138} height={26} loading="lazy" />
            </Link>
            <p>{f.tagline}</p>
          </div>

          <div>
            <h2>{f.product}</h2>
            <ul role="list">
              <li><Link href="/#how-it-works">{f.howItWorks}</Link></li>
              <li><Link href="/#features">{f.features}</Link></li>
              <li><Link href="/#who-its-for">{f.whoFor}</Link></li>
              <li><a href="/preregister/">{f.joinWaitlist}</a></li>
            </ul>
          </div>

          <div>
            <h2>{f.discover}</h2>
            <ul role="list">
              <li><Link href="/store/">{f.store}</Link></li>
              <li><Link href="/freelancers/">{f.freelancers}</Link></li>
            </ul>
          </div>

          <div>
            <h2>{f.resources}</h2>
            <ul role="list">
              <li><Link href="/blog/">{f.blog}</Link></li>
              <li><a href="/what-is-mitfloww.html">{f.whatIs}</a></li>
              <li><a href="/mitfloww-review.html">{f.review}</a></li>
            </ul>
          </div>
        </div>

        <div className="site-footer__base">
          <p>{f.copyright}</p>
          <p>{f.motto}</p>
        </div>
      </div>
    </footer>
  );
}
