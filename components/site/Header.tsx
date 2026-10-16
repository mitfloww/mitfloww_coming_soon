"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useTheme } from "@/lib/theme";
import { MenuArrowIcon, MoonIcon, SunIcon } from "@/components/icons";
import { LanguageSwitcher } from "./LanguageSwitcher";

const LOGO_LIGHT = "/assets/logo/SVG/horizontal/mitfloww-logo-horizontal-color-black-wordmark.svg";
const LOGO_DARK = "/assets/logo/SVG/horizontal/mitfloww-logo-horizontal-color-white-wordmark.svg";

function sectionOf(pathname: string): "store" | "freelancers" | "blog" | null {
  if (pathname.startsWith("/store")) return "store";
  if (pathname.startsWith("/freelancers")) return "freelancers";
  if (pathname.startsWith("/blog")) return "blog";
  return null;
}

export function Header() {
  const { m } = useI18n();
  const { theme, toggle } = useTheme();
  const pathname = usePathname() ?? "/";
  const section = sectionOf(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  /*
   * How much of the header fits on one line in the current language:
   * 0 = everything, 1 = nav links fold into the menu, 2 = the header's
   * Join Waitlist button also moves into the menu.
   */
  const [fit, setFit] = useState<0 | 1 | 2>(0);

  useLayoutEffect(() => {
    const header = headerRef.current;
    const inner = innerRef.current;
    if (!header || !inner) return;
    const measure = () => {
      for (const level of [0, 1, 2] as const) {
        header.dataset.fit = String(level);
        if (inner.scrollWidth <= inner.clientWidth + 1) {
          setFit(level);
          return;
        }
      }
      setFit(2);
    };
    measure();
    // Re-measure when the header's width changes (viewport resize, rotation) or fonts finish loading.
    let lastWidth = header.clientWidth;
    const ro = new ResizeObserver(() => {
      if (header.clientWidth !== lastWidth) {
        lastWidth = header.clientWidth;
        measure();
      }
    });
    ro.observe(header);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    document.fonts?.addEventListener?.("loadingdone", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      document.fonts?.removeEventListener?.("loadingdone", measure);
    };
  }, [m]);

  // Hairline under the header once the page scrolls.
  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 8);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: lock scroll, focus the first link, close on Escape/resize/navigation.
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", menuOpen);
    if (menuOpen) menuRef.current?.querySelector<HTMLElement>("a, button")?.focus({ preventScroll: true });
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1040 && headerRef.current?.dataset.fit === "0") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => () => document.documentElement.classList.remove("menu-open"), []);

  const navItems = [
    { href: "/#features", label: m.nav.product, key: "product" },
    { href: "/#how-it-works", label: m.nav.how, key: "how" },
    { href: "/store/", label: m.nav.store, key: "store" },
    { href: "/freelancers/", label: m.nav.freelancers, key: "freelancers" },
    { href: "/blog/", label: m.nav.blog, key: "blog" },
  ] as const;

  const themeLabel = theme === "dark" ? m.nav.toLight : theme === "light" ? m.nav.toDark : "Switch theme";

  return (
    <>
      <a className="skip-link" href="#main">{m.nav.skip}</a>
      <header ref={headerRef} className={`site-header${scrolled ? " is-scrolled" : ""}`} data-fit={fit}>
        <div ref={innerRef} className="container site-header__inner">
          <Link href="/" className="brand" aria-label={m.nav.home}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo--on-light" src={LOGO_LIGHT} alt="MitFloww" width={128} height={24} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo--on-dark" src={LOGO_DARK} alt="MitFloww" width={128} height={24} />
          </Link>

          <nav className="site-nav" aria-label={m.nav.main}>
            {navItems.map((item) => (
              <Link key={item.key} href={item.href} aria-current={section === item.key ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="site-header__actions">
            <button
              type="button"
              className="icon-btn theme-toggle"
              aria-label={themeLabel}
              aria-pressed={theme === "dark"}
              onClick={toggle}
            >
              <MoonIcon />
              <SunIcon />
            </button>
            <a href="/preregister/" className="btn btn--ink btn--sm site-header__cta">{m.nav.joinWaitlist}</a>
            <LanguageSwitcher />
            <button
              ref={menuBtnRef}
              type="button"
              className="icon-btn menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? m.nav.closeMenu : m.nav.openMenu}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <svg className="icon-menu" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M4 8h16M4 16h16" /></svg>
              <svg className="icon-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </div>
        </div>
      </header>

      <div className="mobile-menu" id="mobile-menu" ref={menuRef} inert={!menuOpen}>
        <nav aria-label={m.nav.mobile}>
          {navItems.map((item) => (
            <Link key={item.key} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label} <MenuArrowIcon />
            </Link>
          ))}
        </nav>
        <div className="mobile-menu__actions">
          <a href="/preregister/" className="btn btn--ink btn--lg btn--block">{m.nav.joinWaitlist}</a>
        </div>
      </div>
    </>
  );
}
