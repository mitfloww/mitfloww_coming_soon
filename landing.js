(function () {
  "use strict";

  document.documentElement.classList.add("js-ready");

  // Keep CTA links usable when the static page is opened directly from disk.
  if (window.location.protocol === "file:") {
    document.querySelectorAll('a[href="/preregister"]').forEach(function (link) {
      link.setAttribute("href", "preregister/index.html");
    });
  }

  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function updateHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 10);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  function closeMenu() {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", "false");
    const label = menuToggle.querySelector(".sr-only");
    if (label) label.textContent = "Open navigation";
    mobileMenu.hidden = true;
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      const label = menuToggle.querySelector(".sr-only");
      if (label) label.textContent = isOpen ? "Open navigation" : "Close navigation";
      mobileMenu.hidden = isOpen;
      document.body.classList.toggle("menu-open", !isOpen);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") closeMenu();
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
    return;
  }

  const observer = new IntersectionObserver(function (entries, currentObserver) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px" });

  revealItems.forEach(function (item) { observer.observe(item); });
}());
