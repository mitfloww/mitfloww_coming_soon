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
     1. Mobile Menu Drawer
     ========================================================================== */
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");

  if (menuToggle && mobileDrawer) {
    function toggleDrawer(force) {
      const isOpen = force !== undefined ? force : !mobileDrawer.classList.contains("is-open");
      mobileDrawer.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      const icon = menuToggle.querySelector("i");
      if (icon) {
        icon.setAttribute("data-lucide", isOpen ? "x" : "menu");
        initIcons();
      }
    }

    menuToggle.addEventListener("click", function () {
      toggleDrawer();
    });

    mobileDrawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggleDrawer(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileDrawer.classList.contains("is-open")) {
        toggleDrawer(false);
      }
    });
  }

  /* ==========================================================================
     2. Hero Section: Mouse 3D Perspective & Scroll Scrub
     ========================================================================== */
  const heroSection = document.getElementById("hero-section");
  const heroProductStage = document.getElementById("hero-product-stage");

  if (heroSection && heroProductStage) {
    let mouseX = 0;
    let mouseY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let isHoveringHero = false;

    heroSection.addEventListener("mousemove", function (e) {
      isHoveringHero = true;
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Controlled, responsive subtle tilt
      mouseY = ((y / rect.height) - 0.5) * -7;
      mouseX = ((x / rect.width) - 0.5) * 7;
    });

    heroSection.addEventListener("mouseleave", function () {
      isHoveringHero = false;
      mouseX = 0;
      mouseY = 0;
    });

    function updateHeroDepth() {
      if (!isHoveringHero) {
        currentRotateX += (0 - currentRotateX) * 0.08;
        currentRotateY += (0 - currentRotateY) * 0.08;
      } else {
        currentRotateX += (mouseY - currentRotateX) * 0.08;
        currentRotateY += (mouseX - currentRotateY) * 0.08;
      }

      // Scroll scrub for hero as user leaves the top
      const scrollY = window.scrollY || window.pageYOffset;
      const heroHeight = heroSection.offsetHeight || 800;
      const heroProgress = Math.min(Math.max(scrollY / heroHeight, 0), 1);
      const heroScale = 1 - (heroProgress * 0.05);

      heroProductStage.style.transform = `perspective(1400px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) scale(${heroScale.toFixed(3)})`;

      if (!reduceMotion) requestAnimationFrame(updateHeroDepth);
    }

    if (!reduceMotion) {
      requestAnimationFrame(updateHeroDepth);
    } else {
      heroProductStage.style.transform = "";
    }
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
    const revealElements = document.querySelectorAll(".reveal-up, [data-reveal]");
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
