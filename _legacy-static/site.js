/* ==========================================================================
   MitFloww — shared site behaviour
   Theme toggle, header state, mobile menu, scroll reveals.
   The initial theme is applied by the inline script in <head> (no flash).
   ========================================================================== */
(function () {
  'use strict';

  window.__mfReady = true;
  var root = document.documentElement;
  var STORAGE_KEY = 'mf-theme';
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme ---------- */
  function storedTheme() {
    try {
      var t = localStorage.getItem(STORAGE_KEY);
      return t === 'light' || t === 'dark' ? t : null;
    } catch (e) {
      return null;
    }
  }

  function syncThemeUi(theme) {
    var next = theme === 'dark' ? 'light' : 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0b0d11' : '#ffffff');
  }

  function applyTheme(theme, animate) {
    if (animate && !reduceMotion) {
      root.classList.add('theme-switching');
      window.setTimeout(function () { root.classList.remove('theme-switching'); }, 320);
    }
    root.setAttribute('data-theme', theme);
    syncThemeUi(theme);
  }

  syncThemeUi(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(STORAGE_KEY, next); } catch (err) { /* storage unavailable */ }
    applyTheme(next, true);
  });

  // Follow the OS setting until the visitor picks a theme themselves.
  if (media) {
    var onSystemChange = function (ev) {
      if (!storedTheme()) applyTheme(ev.matches ? 'dark' : 'light', true);
    };
    if (media.addEventListener) media.addEventListener('change', onSystemChange);
    else if (media.addListener) media.addListener(onSystemChange);
  }

  /* ---------- Header border on scroll ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var ticking = false;
    var updateHeader = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(updateHeader); }
    }, { passive: true });
    updateHeader();
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');

  function setMenu(open) {
    if (!menuBtn || !menu) return;
    root.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) {
      menu.removeAttribute('inert');
      var first = menu.querySelector('a, button');
      if (first) first.focus({ preventScroll: true });
    } else {
      menu.setAttribute('inert', '');
    }
  }

  if (menuBtn && menu) {
    menu.setAttribute('inert', '');
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('menu-open')) {
        setMenu(false);
        menuBtn.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1040 && root.classList.contains('menu-open')) setMenu(false);
    });
  }

  /* ---------- Scroll reveals ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  }
})();
