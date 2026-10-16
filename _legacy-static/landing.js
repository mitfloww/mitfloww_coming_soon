/**
 * MitFloww — Ground-Up Interactive Scroll Storytelling & Product Engine
 * High-performance, zero-stuck scroll scrubbing, authentic product state transformations,
 * Real product visuals, lightweight scroll storytelling, and progressive disclosure.
 */

(function () {
  "use strict";

  // Never abort animations based on arbitrary OS or browser flags
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Initialize Lucide Icons
  function initIcons() {
    if (typeof window.lucide !== "undefined" && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initIcons);
  } else {
    initIcons();
  }

  // Adjust relative links if opened directly via file://
  if (window.location.protocol === "file:") {
    document.querySelectorAll('a[href="/preregister/"]').forEach(function (link) {
      link.setAttribute("href", "preregister/index.html");
    });
    document.querySelectorAll('a[href="/login"]').forEach(function (link) {
      link.setAttribute("href", "preregister/index.html");
    });
  }

  /* ==========================================================================
     1. Navigation: scroll state + mobile menu
     ========================================================================== */
  const nav = document.getElementById("mf-nav");
  const navToggle = document.getElementById("mf-nav-toggle");
  const navPanel = document.getElementById("mf-nav-panel");

  if (nav) {
    // Clean at the top; blur + hairline once the page moves
    let navTicking = false;
    function updateNavScrollState() {
      nav.classList.toggle("is-scrolled", (window.scrollY || window.pageYOffset) > 8);
      navTicking = false;
    }
    window.addEventListener("scroll", function () {
      if (!navTicking) {
        navTicking = true;
        requestAnimationFrame(updateNavScrollState);
      }
    }, { passive: true });
    updateNavScrollState();
  }

  if (nav && navToggle && navPanel) {
    const desktopQuery = window.matchMedia("(min-width: 961px)");

    function isMenuOpen() {
      return navToggle.getAttribute("aria-expanded") === "true";
    }

    function setMenu(open, options) {
      const restoreFocus = !options || options.restoreFocus !== false;
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      navPanel.hidden = !open;
      nav.classList.toggle("is-open", open);
      document.documentElement.style.overflow = open ? "hidden" : "";

      if (open) {
        const firstLink = navPanel.querySelector("a");
        if (firstLink) firstLink.focus();
      } else if (restoreFocus) {
        navToggle.focus();
      }
    }

    navToggle.addEventListener("click", function () {
      setMenu(!isMenuOpen());
    });

    // Following a link closes the menu; focus moves with the page, not back to the toggle
    navPanel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false, { restoreFocus: false });
      });
    });

    document.addEventListener("keydown", function (e) {
      if (!isMenuOpen()) return;

      if (e.key === "Escape") {
        setMenu(false);
        return;
      }

      // Keep Tab cycling between the toggle and the panel while open
      if (e.key === "Tab") {
        const focusables = [navToggle].concat(Array.prototype.slice.call(navPanel.querySelectorAll("a")));
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Tapping outside the header closes the menu
    document.addEventListener("click", function (e) {
      if (isMenuOpen() && !nav.contains(e.target)) setMenu(false, { restoreFocus: false });
    });

    // Growing past the breakpoint hides the panel via CSS; reset state to match
    desktopQuery.addEventListener("change", function (e) {
      if (e.matches && isMenuOpen()) setMenu(false, { restoreFocus: false });
    });
  }

  /* ==========================================================================
     2. Hero: scroll story — scattered delivery collapses into a MitFloww workspace
     Progress p (0 → 1) across the pinned scroll track drives:
       0.00–0.26  copy lifts away
       0.00–0.40  cards drift by depth, then crowd inward; versions overlap
       0.22       revision / payment / link states appear ("exposed")
       0.36–0.75  cards straighten and fly into their workspace slots (staggered)
       0.54–0.74  workspace frame materialises; its labels follow at 0.66–0.82
       0.70–0.91  each card cross-fades into its real UI counterpart
     Large screens only; smaller screens and reduced motion get the static layout.
     ========================================================================== */
  const hero = document.getElementById("hero-section");

  if (hero && hero.classList.contains("mf-hero")) {
    const stage = hero.querySelector(".mf-hero__stage");
    const copy = hero.querySelector(".mf-hero__copy");
    const workspace = hero.querySelector(".mf-ws");
    const caption = hero.querySelector(".mf-hero__caption");
    const cinematicQuery = window.matchMedia("(min-width: 1024px) and (min-height: 620px)");

    const cards = Array.prototype.map.call(hero.querySelectorAll(".mf-artifact"), function (el, i) {
      const read = function (prop) { return parseFloat(el.style.getPropertyValue(prop)) || 0; };
      return {
        el: el,
        i: i,
        slot: hero.querySelector('[data-slot="' + el.getAttribute("data-target") + '"]'),
        overlap: el.hasAttribute("data-overlap") ? Number(el.getAttribute("data-overlap")) : null,
        stack: el.classList.contains("mf-artifact--stack"),
        sx: read("--sx"),
        sy: read("--sy"),
        r: read("--r"),
        d: read("--d")
      };
    }).filter(function (card) { return card.slot; });

    const clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
    const span = function (p, a, b) { return clamp01((p - a) / (b - a)); };
    const lerp = function (a, b, t) { return a + (b - a) * t; };
    // Symmetric cubic: slow start, slow landing, no overshoot
    const easeInOut = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
    const easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };

    const DRIFT_Y = 70;      // px of upward parallax at full depth
    const CROWD = 0.16;      // share of the distance to centre cards close as disorder grows

    let cinematic = false;
    let target = 0;
    let current = 0;
    let running = false;
    let phase = "";

    function setPhase(next) {
      if (next !== phase) {
        phase = next;
        hero.setAttribute("data-phase", next);
      }
    }

    // Scattered "home" positions come from --sx/--sy (fractions of the stage half-size);
    // landing positions are the live rects of each card's workspace slot.
    function measure() {
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      const stageRect = stage.getBoundingClientRect();
      const prevTransform = workspace.style.transform;
      workspace.style.transform = "none";

      cards.forEach(function (card) {
        card.w = card.el.offsetWidth;
        card.h = card.el.offsetHeight;
        card.hx = W / 2 + card.sx * W / 2;
        card.hy = H / 2 + card.sy * H / 2;
        const rect = card.slot.getBoundingClientRect();
        card.tx = rect.left - stageRect.left + rect.width / 2;
        card.ty = rect.top - stageRect.top + rect.height / 2;
        // Uniform scale toward the slot size, clamped so text never balloons or shrinks to noise;
        // the cross-fade covers the remaining size difference
        card.ts = Math.min(Math.max(Math.min(rect.width / card.w, rect.height / card.h), 0.75), 1.15);
      });

      workspace.style.transform = prevTransform;
    }

    function readProgress() {
      const stickyTop = parseFloat(window.getComputedStyle(stage).top) || 0;
      const distance = hero.offsetHeight - stage.offsetHeight;
      if (distance <= 0) return 0;
      return clamp01((stickyTop - hero.getBoundingClientRect().top) / distance);
    }

    function render(p) {
      const copyOut = easeOut(span(p, 0.04, 0.26));
      copy.style.opacity = (1 - copyOut).toFixed(3);
      copy.style.transform = "translate3d(0," + (-56 * copyOut).toFixed(1) + "px,0)";
      copy.style.visibility = copyOut > 0.99 ? "hidden" : "";
      copy.style.pointerEvents = copyOut > 0.4 ? "none" : "";

      const drift = span(p, 0, 0.4);
      const chaos = easeInOut(span(p, 0.1, 0.4));
      const frame = easeInOut(span(p, 0.54, 0.74));
      const W = stage.clientWidth;
      const H = stage.clientHeight;

      // Scattered position: depth parallax, then crowding toward the centre
      function looseX(card) { return lerp(card.hx, W / 2, CROWD * card.d * chaos); }
      function looseY(card) { return lerp(card.hy - card.d * DRIFT_Y * drift, H / 2, CROWD * card.d * chaos); }

      cards.forEach(function (card) {
        const align = easeInOut(span(p, 0.36 + card.i * 0.012, 0.63 + card.i * 0.012));
        const settle = span(p, 0.7 + card.i * 0.008, 0.82 + card.i * 0.008);

        let x = looseX(card);
        let y = looseY(card);

        // A newer version slides on top of the one it replaces
        if (card.overlap !== null && cards[card.overlap]) {
          const base = cards[card.overlap];
          x = lerp(x, looseX(base) + 28, chaos);
          y = lerp(y, looseY(base) + 24, chaos);
        }

        const rotation = card.r * (1 + 0.7 * chaos) * (1 - align);
        const scale = lerp(1, card.ts, align);
        const cx = lerp(x, card.tx, align);
        const cy = lerp(y, card.ty, align);

        card.el.style.transform =
          "translate3d(" + (cx - card.w / 2).toFixed(1) + "px," + (cy - card.h / 2).toFixed(1) + "px,0)" +
          " rotate(" + rotation.toFixed(2) + "deg) scale(" + scale.toFixed(4) + ")";
        card.el.style.opacity = (1 - settle).toFixed(3);
        card.slot.style.opacity = settle.toFixed(3);

        if (card.stack) card.el.style.setProperty("--spread", (chaos * (1 - align)).toFixed(3));
      });

      workspace.style.opacity = frame.toFixed(3);
      workspace.style.setProperty("--mf-ws-content", easeInOut(span(p, 0.66, 0.82)).toFixed(3));
      workspace.style.transform =
        "translate3d(0," + ((1 - frame) * 28).toFixed(1) + "px,0) scale(" + (0.975 + 0.025 * frame).toFixed(4) + ")";

      if (caption) caption.style.opacity = span(p, 0.12, 0.24).toFixed(3);

      setPhase(p < 0.22 ? "scattered" : p < 0.6 ? "exposed" : "organized");
    }

    // Progress eases toward the scroll position for a weighted, physical feel
    function tick() {
      current += (target - current) * 0.1;
      if (Math.abs(target - current) < 0.0004) current = target;
      render(current);
      if (current !== target) {
        requestAnimationFrame(tick);
      } else {
        running = false;
      }
    }

    function onScroll() {
      if (!cinematic) return;
      target = readProgress();
      if (!running) {
        running = true;
        requestAnimationFrame(tick);
      }
    }

    function clearInline() {
      [copy, workspace, caption].forEach(function (el) { if (el) el.removeAttribute("style"); });
      cards.forEach(function (card) {
        card.el.style.transform = "";
        card.el.style.opacity = "";
        card.el.style.removeProperty("--spread");
        card.slot.style.opacity = "";
      });
    }

    function setMode() {
      cinematic = cinematicQuery.matches && !reduceMotion;
      hero.classList.toggle("is-cinematic", cinematic);
      clearInline();

      if (cinematic) {
        measure();
        target = current = readProgress();
        render(current);
      } else {
        setPhase("organized");
      }
    }

    let resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setMode, 120);
    }, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    cinematicQuery.addEventListener("change", setMode);

    setMode();
    // Card sizes depend on web fonts and icons; re-measure once both are in
    window.addEventListener("load", setMode, { once: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(setMode);
  }

  /* ==========================================================================
     3. The MitFloww Workflow: STICKY SCROLL-SCRUBBED STORYTELLING (0 - 100%)
     Continuous interpolation across:
     01 / PREPARE  ->  02 / REVIEW  ->  03 / PAYMENT  ->  04 / RELEASE
     ========================================================================== */
  const workflowSection = document.getElementById("workflow-story");
  const workflowProgressBar = document.getElementById("workflow-progress-bar");
  const workflowSteps = document.querySelectorAll("[data-narrative-step]");
  const workflowCanvasImg = document.getElementById("workflow-canvas-img");
  const workflowWindowTitle = document.getElementById("workflow-window-title");
  const workflowWindowTag = document.getElementById("workflow-window-tag");
  const workflowStageStatusText = document.getElementById("workflow-stage-status-text");

  const overlayPrepare = document.getElementById("overlay-state-prepare");
  const overlayReview = document.getElementById("overlay-state-review");
  const overlayPayment = document.getElementById("overlay-state-payment");
  const overlayRelease = document.getElementById("overlay-state-release");

  const workflowStageImages = [
    "assets/ui-stage-prepare.webp",
    "assets/ui-stage-review.webp",
    "assets/ui-stage-payment.webp",
    "assets/real_client_paid.png"
  ];

  const workflowStageMeta = [
    {
      title: "Project_Share_Access.cfg",
      tag: "Stage 01: Client Access Prepared",
      status: "01 / Prepare: Raw master files encrypted with ephemeral keys at rest."
    },
    {
      title: "Brand_Identity_Client_Review.pdf",
      tag: "Stage 02: Client Stream Protected",
      status: "02 / Review: Pinned client feedback active. Master downloads locked."
    },
    {
      title: "Escrow_Milestone_Settlement.inv",
      tag: "Stage 03: Escrow Payment Active",
      status: "03 / Payment: Verified escrow checkout awaiting client clearance."
    },
    {
      title: "Decrypted_Production_Master.zip",
      tag: "Stage 04: Master Deliverables Unlocked",
      status: "04 / Release: Settlement verified. All decrypted masters released."
    }
  ];

  let currentActiveStage = 0;

  function updateWorkflowStage(stageIndex) {
    if (stageIndex < 0 || stageIndex > 3) return;
    currentActiveStage = stageIndex;

    workflowSteps.forEach(function (step, index) {
      step.classList.toggle("is-active", index === stageIndex);
    });

    if (workflowCanvasImg && workflowCanvasImg.getAttribute("data-stage") !== String(stageIndex)) {
      workflowCanvasImg.setAttribute("data-stage", String(stageIndex));
      workflowCanvasImg.style.opacity = "0.7";
      setTimeout(function () {
        workflowCanvasImg.src = workflowStageImages[stageIndex];
        workflowCanvasImg.style.opacity = "1";
      }, 50);
    }

    // Toggle corresponding overlay
    if (overlayPrepare) overlayPrepare.classList.toggle("is-visible", stageIndex === 0);
    if (overlayReview) overlayReview.classList.toggle("is-visible", stageIndex === 1);
    if (overlayPayment) overlayPayment.classList.toggle("is-visible", stageIndex === 2);
    if (overlayRelease) overlayRelease.classList.toggle("is-visible", stageIndex === 3);

    if (workflowWindowTag) {
      workflowWindowTag.innerHTML = `<i data-lucide="shield-check"></i><span>${workflowStageMeta[stageIndex].tag}</span>`;
      initIcons();
    }
    if (workflowWindowTitle) {
      workflowWindowTitle.innerHTML = `<i data-lucide="file-video"></i><span>${workflowStageMeta[stageIndex].title}</span>`;
      initIcons();
    }
    if (workflowStageStatusText) {
      workflowStageStatusText.textContent = workflowStageMeta[stageIndex].status;
    }
  }

  function handleWorkflowScrub() {
    if (!workflowSection) return;

    const rect = workflowSection.getBoundingClientRect();
    const scrollDistance = workflowSection.offsetHeight - window.innerHeight;
    if (scrollDistance <= 0) return;

    // Calculate progress based on container scroll through viewport
    const currentScroll = -rect.top;
    const progress = Math.min(Math.max(currentScroll / scrollDistance, 0), 1);

    if (workflowProgressBar) {
      workflowProgressBar.style.height = `${(progress * 100).toFixed(1)}%`;
    }

    let stage = 0;
    if (progress >= 0.75) {
      stage = 3;
    } else if (progress >= 0.50) {
      stage = 2;
    } else if (progress >= 0.25) {
      stage = 1;
    } else {
      stage = 0;
    }

    updateWorkflowStage(stage);
  }

  // Allow clicking directly on any narrative step to jump smoothly
  workflowSteps.forEach(function (step, index) {
    step.addEventListener("click", function () {
      if (workflowSection) {
        const scrollDistance = workflowSection.offsetHeight - window.innerHeight;
        const targetScroll = workflowSection.offsetTop + (scrollDistance * (index / 3));
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
      updateWorkflowStage(index);
    });
  });

  window.addEventListener("scroll", handleWorkflowScrub, { passive: true });
  window.addEventListener("resize", handleWorkflowScrub, { passive: true });
  handleWorkflowScrub();

  /* ==========================================================================
     4. Real Product Showcase: Interactive Tabbed Explorer (Zero Stuck Scroll)
     ========================================================================== */
  const showcaseTriggers = document.querySelectorAll("[data-showcase-tab]");
  const showcaseImage = document.getElementById("showcase-current-img");
  const showcaseWindowTitle = document.getElementById("showcase-window-title");
  const showcaseWindowTag = document.getElementById("showcase-window-tag");

  const showcaseAssets = [
    {
      src: "assets/ui-projects-light.webp",
      title: "Project Hub · Quality Marketing",
      tag: "5 deliverable projects · Controlled escrow ready"
    },
    {
      src: "assets/ui-stage-review.webp",
      title: "Revision Control · File review",
      tag: "Comments & version history"
    },
    {
      src: "assets/real_light_user_share_modal.png",
      title: "Share Project · Client access",
      tag: "Protected sharing"
    }
  ];

  let showcaseSwapTimer;
  function setShowcaseTab(index) {
    showcaseTriggers.forEach(function (trigger, i) {
      trigger.classList.toggle("is-active", i === index);
    });

    if (showcaseImage && showcaseAssets[index]) {
      const frame = showcaseImage.closest(".showcase-visual-frame");
      if (frame) {
        frame.classList.add("is-changing");
        frame.dataset.showcaseView = String(index);
      }
      clearTimeout(showcaseSwapTimer);
      const nextImage = new Image();
      nextImage.onload = function () {
        showcaseSwapTimer = setTimeout(function () {
          showcaseImage.src = nextImage.src;
          if (frame) frame.classList.remove("is-changing");
        }, 140);
      };
      nextImage.src = showcaseAssets[index].src;
    }

    if (showcaseWindowTitle && showcaseAssets[index]) {
      showcaseWindowTitle.innerHTML = `<i data-lucide="monitor"></i><span>${showcaseAssets[index].title}</span>`;
      initIcons();
    }
    if (showcaseWindowTag && showcaseAssets[index]) {
      showcaseWindowTag.innerHTML = `<i data-lucide="shield-check"></i><span>${showcaseAssets[index].tag}</span>`;
      initIcons();
    }
  }

  showcaseTriggers.forEach(function (trigger, index) {
    trigger.addEventListener("click", function () {
      setShowcaseTab(index);
    });
    trigger.addEventListener("mouseenter", function () {
      setShowcaseTab(index);
    });
  });

  const showcaseFrame = document.querySelector(".showcase-visual-frame");
  if (showcaseFrame && showcaseImage && !reduceMotion) {
    showcaseFrame.addEventListener("pointermove", function (event) {
      if (showcaseFrame.dataset.showcaseView !== "0") return;
      const rect = showcaseFrame.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5);
      const y = ((event.clientY - rect.top) / rect.height - 0.5);
      const rotateY = x * 7;
      const rotateX = y * -6;
      const shiftX = x * 18;
      const shiftY = y * 12;
      showcaseImage.style.transform = "perspective(1100px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) + "deg) translate3d(" + shiftX.toFixed(2) + "px, " + shiftY.toFixed(2) + "px, 0) scale(1.026)";
    });
    showcaseFrame.addEventListener("pointerleave", function () {
      showcaseImage.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0) scale(1)";
    });
  }

  /* ==========================================================================
     5. Creator Types Interactive Workspace Selector
     ========================================================================== */
  const creatorPills = document.querySelectorAll("[data-creator-target]");
  const creatorPanels = document.querySelectorAll("[data-creator-panel]");

  creatorPills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      const target = pill.getAttribute("data-creator-target");

      creatorPills.forEach(function (p) {
        p.classList.toggle("is-active", p === pill);
        p.setAttribute("aria-selected", String(p === pill));
      });

      creatorPanels.forEach(function (panel) {
        const match = panel.getAttribute("data-creator-panel") === target;
        panel.classList.toggle("is-active", match);
      });

      initIcons();
    });
  });

  /* ==========================================================================
     6. Security & Controlled-Access State Simulator
     ========================================================================== */
  const securityState = document.querySelector(".security-state-demo");
  const securityStateButtons = document.querySelectorAll("[data-security-state-btn]");
  const securityStateImages = document.querySelectorAll("[data-security-image]");
  const securityTitle = document.getElementById("security-state-title");
  const securityDesc = document.getElementById("security-state-desc");
  const securityCaption = document.getElementById("security-state-caption-text");
  const securityCaptionIcon = document.getElementById("security-state-caption-icon");

  function setSecurityState(state) {
    if (!securityState) return;
    securityState.dataset.securityState = state;
    securityStateButtons.forEach(function (button) {
      const active = button.getAttribute("data-security-state-btn") === state;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    securityStateImages.forEach(function (image) {
      image.classList.toggle("is-active", image.getAttribute("data-security-image") === state);
    });
    if (securityTitle) securityTitle.textContent = state === "post" ? "Payment confirmed. Final files unlocked." : "Review & payment required";
    if (securityDesc) securityDesc.textContent = state === "post" ? "The client can now download the released project files from the same project view." : "Protected preview available. Master files remain locked until payment is confirmed.";
    if (securityCaption) securityCaption.textContent = state === "post" ? "Final files unlocked" : "Protected preview";
    if (securityCaptionIcon) securityCaptionIcon.setAttribute("data-lucide", state === "post" ? "unlock" : "lock");
    initIcons();
  }

  securityStateButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setSecurityState(button.getAttribute("data-security-state-btn"));
    });
  });

  const motionVideo = document.getElementById("mitfloww-motion-video");
  const motionVideoToggle = document.getElementById("cinematic-video-toggle");
  if (motionVideo && motionVideoToggle) {
    motionVideoToggle.addEventListener("click", function () {
      if (motionVideo.paused) {
        motionVideo.play();
        motionVideoToggle.innerHTML = '<i data-lucide="pause"></i><span>Pause film</span>';
      } else {
        motionVideo.pause();
        motionVideoToggle.innerHTML = '<i data-lucide="play"></i><span>Play film</span>';
      }
      initIcons();
    });
  }

  /* ==========================================================================
     10. Scroll Reveal Animations (High-Performance IntersectionObserver)
     ========================================================================== */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal-up, [data-reveal], .mf-reveal");
    if (!revealElements.length) return;

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              if (entry.target.classList.contains("vulnerable-header-center")) {
                entry.target.closest(".vulnerable-moment-section").classList.add("is-revealed");
              }
            } else {
              entry.target.classList.remove("is-revealed");
              if (entry.target.classList.contains("vulnerable-header-center")) {
                entry.target.closest(".vulnerable-moment-section").classList.remove("is-revealed");
              }
            }
          });
        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -40px 0px"
        }
      );

      revealElements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      revealElements.forEach(function (el) {
        el.classList.add("is-revealed");
      });
    }
  }

  initScrollReveal();

  const pageLoader = document.getElementById("page-loader");
  function dismissLoader() {
    if (pageLoader) pageLoader.classList.add("is-dismissed");
  }
  if (document.readyState === "complete") {
    requestAnimationFrame(dismissLoader);
  } else {
    window.addEventListener("load", dismissLoader, { once: true });
    setTimeout(dismissLoader, 900);
  }

})();
