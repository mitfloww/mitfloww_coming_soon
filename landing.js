/**
 * MitFloww — Ground-Up Interactive Scroll Storytelling & Product Engine
 * High-performance, zero-stuck scroll scrubbing, authentic product state transformations,
 * and 60fps motion architecture canvas.
 */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
     2. Hero Section: Subtle Mouse 3D Perspective & Scroll Scrub
     ========================================================================== */
  const heroSection = document.getElementById("hero-section");
  const heroProductStage = document.getElementById("hero-product-stage");

  if (heroSection && heroProductStage && !reduceMotion) {
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
      // Very restrained subtle tilt (max 3 degrees)
      mouseY = ((y / rect.height) - 0.5) * -6;
      mouseX = ((x / rect.width) - 0.5) * 6;
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

      // Subtle scroll scrub for hero as user leaves the top
      const scrollY = window.scrollY;
      const heroHeight = heroSection.offsetHeight;
      const heroProgress = Math.min(Math.max(scrollY / heroHeight, 0), 1);
      const heroScale = 1 - (heroProgress * 0.05);

      heroProductStage.style.transform = `perspective(1400px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) scale(${heroScale.toFixed(3)})`;

      requestAnimationFrame(updateHeroDepth);
    }

    requestAnimationFrame(updateHeroDepth);
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
    "assets/ui-stage-release.webp"
  ];

  const workflowStageMeta = [
    {
      title: "Nordic_Campaign_Master_ProRes.mov",
      tag: "Stage 01: Raw Masters Encrypted",
      status: "01 / Prepare: Raw master files encrypted with ephemeral keys at rest."
    },
    {
      title: "Brand_Film_Preview_1080p.mov",
      tag: "Stage 02: Watermarked Stream Only",
      status: "02 / Review: Pinned client feedback active. Master downloads locked."
    },
    {
      title: "Escrow_Milestone_Settlement.inv",
      tag: "Stage 03: Stripe Escrow Active",
      status: "03 / Payment: Verified escrow checkout awaiting client clearance."
    },
    {
      title: "Decrypted_Production_Master.zip",
      tag: "Stage 04: Master Vault Unsealed",
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
    if (!workflowSection || reduceMotion || window.innerWidth <= 768) return;

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
      if (window.innerWidth > 768 && workflowSection) {
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
      src: "assets/ui-stage-review.webp",
      title: "In-Canvas Review · Spatial Annotations Active",
      tag: "Live Revision Mode"
    },
    {
      src: "assets/ui-stage-prepare.webp",
      title: "File Ingestion · Stream Watermark Matrix Generated",
      tag: "Stream Only"
    },
    {
      src: "assets/ui-stage-payment.webp",
      title: "Escrow Settlement Modal · Stripe Connect Active",
      tag: "Escrow Verified"
    }
  ];

  function setShowcaseTab(index) {
    showcaseTriggers.forEach(function (trigger, i) {
      trigger.classList.toggle("is-active", i === index);
    });

    if (showcaseImage && showcaseAssets[index]) {
      showcaseImage.style.opacity = "0.5";
      setTimeout(function () {
        showcaseImage.src = showcaseAssets[index].src;
        showcaseImage.style.opacity = "1";
      }, 80);
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
  const secTogglePre = document.getElementById("sec-toggle-pre");
  const secTogglePost = document.getElementById("sec-toggle-post");
  const secStatusTitle = document.getElementById("sec-status-title");
  const secStatusDesc = document.getElementById("sec-status-desc");

  if (secTogglePre && secTogglePost && secStatusTitle && secStatusDesc) {
    secTogglePre.addEventListener("click", function () {
      secTogglePre.classList.add("is-active");
      secTogglePost.classList.remove("is-active");
      secStatusTitle.innerHTML = '<i data-lucide="lock"></i> Client View: Review & Payment Required';
      secStatusDesc.textContent = "Watermarked preview enabled. Master asset downloads and source bundles are encrypted.";
      initIcons();
    });

    secTogglePost.addEventListener("click", function () {
      secTogglePost.classList.add("is-active");
      secTogglePre.classList.remove("is-active");
      secStatusTitle.innerHTML = '<i data-lucide="unlock"></i> Client View: Payment Confirmed · Unlocked';
      secStatusDesc.textContent = "Watermark dissolves instantly. Ephemeral signed download tokens issued for raw files.";
      initIcons();
    });
  }

  /* ==========================================================================
     7. Custom MitFloww Motion Video / Interactive Workflow Engine (60fps Canvas)
     ========================================================================== */
  const motionCanvas = document.getElementById("mitfloww-motion-canvas");
  const videoToggleBtn = document.getElementById("cinematic-video-toggle");
  const motionPills = document.querySelectorAll(".motion-pill");

  if (motionCanvas && motionCanvas.getContext) {
    const ctx = motionCanvas.getContext("2d");
    let isPlaying = !reduceMotion;
    let animFrameId = null;
    let phase = 0; // 0: Ingest, 1: Encrypt, 2: Watermark, 3: Escrow, 4: Release
    let phaseTimer = 0;
    const PHASE_DURATION = 150; // frames per phase (~2.5s)

    // Particles system
    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * 1280,
        y: Math.random() * 720,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 3 + 1,
        color: Math.random() > 0.5 ? "rgba(0, 91, 221, 0.4)" : "rgba(56, 189, 248, 0.3)"
      });
    }

    function setPhase(p) {
      phase = p % 5;
      phaseTimer = 0;
      motionPills.forEach(function (pill, i) {
        pill.classList.toggle("is-active", i === phase);
      });
    }

    motionPills.forEach(function (pill, i) {
      pill.addEventListener("click", function () {
        setPhase(i);
      });
    });

    if (videoToggleBtn) {
      videoToggleBtn.addEventListener("click", function () {
        isPlaying = !isPlaying;
        videoToggleBtn.innerHTML = isPlaying
          ? '<i data-lucide="pause"></i><span>Pause Motion</span>'
          : '<i data-lucide="play"></i><span>Play Motion</span>';
        initIcons();
        if (isPlaying) loop();
      });
    }

    function drawStage(time) {
      const W = motionCanvas.width;
      const H = motionCanvas.height;

      // Deep dark background
      ctx.fillStyle = "#080c14";
      ctx.fillRect(0, 0, W, H);

      // Subtle tech background grid
      ctx.strokeStyle = "rgba(30, 41, 59, 0.4)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 80) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Floating ambient particles
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      const cx = W / 2;
      const cy = H / 2;

      // Draw Main Pipeline Hub in Center
      if (phase === 0) {
        // PHASE 0: RAW ASSET INGESTION
        ctx.fillStyle = "#005bdd";
        ctx.font = "bold 14px 'DM Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("01 / RAW ASSET INGESTION", cx, cy - 160);

        ctx.font = "bold 28px 'Manrope', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Ingesting High-Value Client Deliverables", cx, cy - 120);

        // Animated Inbound File Cards
        const fileNames = ["Brand_Film_4K_ProRes.mov (3.8 GB)", "Vector_Suite_Source.ai (184 MB)", "Typography_Commercial.zip (42 MB)"];
        fileNames.forEach(function (fn, idx) {
          const cardX = cx - 260 + (idx * 270);
          const cardY = cy + Math.sin(time * 0.003 + idx) * 10;
          ctx.fillStyle = "#1e293b";
          ctx.strokeStyle = "#005bdd";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(cardX - 120, cardY - 45, 240, 90, 10);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 13px 'Inter', sans-serif";
          ctx.fillText(fn.split(" ")[0], cardX, cardY - 10);
          ctx.fillStyle = "#94a3b8";
          ctx.font = "12px 'Inter', sans-serif";
          ctx.fillText(fn.split(" ")[1] || "Ready", cardX, cardY + 16);
        });

      } else if (phase === 1) {
        // PHASE 1: AES-256 VAULT ENCRYPTION
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 14px 'DM Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("02 / CRYPTOGRAPHIC CUSTODY LOCK", cx, cy - 170);

        ctx.font = "bold 28px 'Manrope', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Raw Master Files Sealed at Rest (AES-256)", cx, cy - 130);

        // Rotating Shield & Lock Rings
        const rot = time * 0.002;
        ctx.save();
        ctx.translate(cx, cy + 20);

        // Outer Lock Ring
        ctx.strokeStyle = "rgba(0, 91, 221, 0.4)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, 110, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "#005bdd";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(0, 0, 110, rot, rot + Math.PI * 1.2);
        ctx.stroke();

        // Inner Shield
        ctx.fillStyle = "#1e293b";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(-60, -60, 120, 120, 16);
        ctx.fill();
        ctx.stroke();

        ctx.font = "bold 44px sans-serif";
        ctx.fillStyle = "#38bdf8";
        ctx.fillText("🔒", 0, 15);

        ctx.restore();

        ctx.font = "bold 13px 'DM Mono', monospace";
        ctx.fillStyle = "#10b981";
        ctx.fillText("✓ SHA-256 Checksum Verified · Ephemeral Decryption Keys Stored in Vault", cx, cy + 180);

      } else if (phase === 2) {
        // PHASE 2: STREAM WATERMARKING & REVISION PINS
        ctx.fillStyle = "#ec8d1b";
        ctx.font = "bold 14px 'DM Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("03 / STREAM-ONLY REVIEW & ANNOTATION", cx, cy - 170);

        ctx.font = "bold 28px 'Manrope', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Clients Inspect Watermarked Stream Previews", cx, cy - 130);

        // Simulated Frame Window
        ctx.fillStyle = "#141c2e";
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(cx - 360, cy - 70, 720, 240, 12);
        ctx.fill();
        ctx.stroke();

        // Watermark sweep pattern
        ctx.font = "bold 14px 'DM Mono', monospace";
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        ctx.fillText("MITFLOWW PROTECTED STREAM · REVISION BOUNDS ACTIVE", cx, cy + 30);
        ctx.fillText("RAW MASTER DOWNLOAD DISABLED UNTIL PAYMENT", cx, cy + 60);

        // Animated Annotation Pin
        const pinPulse = Math.sin(time * 0.006) * 4;
        ctx.fillStyle = "#005bdd";
        ctx.beginPath();
        ctx.arc(cx - 180, cy + 20, 16 + pinPulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText("1", cx - 180, cy + 25);

        // Comment Box
        ctx.fillStyle = "#1e293b";
        ctx.strokeStyle = "#005bdd";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(cx - 150, cy - 10, 280, 56, 8);
        ctx.fill();
        ctx.stroke();

        ctx.font = "bold 12px 'Inter', sans-serif";
        ctx.fillStyle = "#f8fafc";
        ctx.textAlign = "left";
        ctx.fillText("client@brand.com: Approved with color fix", cx - 135, cy + 14);
        ctx.fillStyle = "#38bdf8";
        ctx.font = "11px 'DM Mono', monospace";
        ctx.fillText("Revision 1 of 3 Used · Frame 01:24:18", cx - 135, cy + 34);

      } else if (phase === 3) {
        // PHASE 3: VERIFIED ESCROW SETTLEMENT
        ctx.fillStyle = "#10b981";
        ctx.font = "bold 14px 'DM Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("04 / MILESTONE ESCROW SETTLEMENT", cx, cy - 170);

        ctx.font = "bold 28px 'Manrope', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Client Settles Invoice via Stripe Escrow", cx, cy - 130);

        // Escrow Checkout Card
        ctx.fillStyle = "#1e293b";
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(cx - 240, cy - 70, 480, 220, 14);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "12px 'DM Mono', monospace";
        ctx.fillText("INVOICE #MF-9842 · STRIPE CONNECT", cx, cy - 35);

        ctx.fillStyle = "#10b981";
        ctx.font = "bold 38px 'Manrope', sans-serif";
        ctx.fillText("$2,850.00 USD", cx, cy + 15);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 14px 'Inter', sans-serif";
        ctx.fillText("Milestone 02: Final Deliverables Clearance", cx, cy + 50);

        // Verification Pill
        ctx.fillStyle = "#064e3b";
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(cx - 160, cy + 75, 320, 36, 18);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#a7f3d0";
        ctx.font = "bold 12px 'DM Mono', monospace";
        ctx.fillText("✓ ESCROW SETTLED · WEBHOOK EMITTED", cx, cy + 98);

      } else if (phase === 4) {
        // PHASE 4: AUTOMATED MASTER DECRYPTION & RELEASE
        ctx.fillStyle = "#10b981";
        ctx.font = "bold 14px 'DM Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("05 / INSTANT DECRYPTION & RELEASE", cx, cy - 170);

        ctx.font = "bold 28px 'Manrope', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Watermark Dissolves · Raw Masters Unsealed", cx, cy - 130);

        // Download Portal Box
        ctx.fillStyle = "#0f172a";
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(cx - 300, cy - 65, 600, 210, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#10b981";
        ctx.font = "bold 16px 'Inter', sans-serif";
        ctx.fillText("✓ All Deliverables Decrypted & Released", cx, cy - 25);

        // Download Action Buttons
        const downloads = ["Download 4K ProRes Film (3.8 GB) ↓", "Download Vector Master Pack (184 MB) ↓"];
        downloads.forEach(function (dl, dIdx) {
          ctx.fillStyle = "#005bdd";
          ctx.beginPath();
          ctx.roundRect(cx - 240, cy + 10 + (dIdx * 54), 480, 42, 8);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 13px 'Inter', sans-serif";
          ctx.fillText(dl, cx, cy + 36 + (dIdx * 54));
        });

        ctx.fillStyle = "#64748b";
        ctx.font = "11px 'DM Mono', monospace";
        ctx.fillText("Signed URLs active for 72h · Creator payout automatically transferred.", cx, cy + 185);
      }
    }

    function loop(time) {
      if (!isPlaying) return;
      phaseTimer++;
      if (phaseTimer >= PHASE_DURATION) {
        setPhase(phase + 1);
      }
      drawStage(time || performance.now());
      animFrameId = requestAnimationFrame(loop);
    }

    loop();
  }

  // Support ?scroll=Y parameter for programmatic scroll testing
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const scrollPos = urlParams.get("scroll");
    if (scrollPos) {
      window.scrollTo(0, parseInt(scrollPos, 10));
      handleWorkflowScrub();
    }
  } catch (e) {}

})();
