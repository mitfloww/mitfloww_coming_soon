/* ==========================================================================
   MitFloww — homepage interactions
   1. Hero delivery stages (Preview → Approve → Pay → Download)
   2. "How it works" step highlighting
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Hero stages ---------- */
  var consoleEl = document.getElementById('console');
  var flow = document.getElementById('flow');
  var caption = document.getElementById('stage-caption');

  if (consoleEl && flow) {
    var STAGES = ['preview', 'approve', 'pay', 'download'];
    var CAPTIONS = [
      'Step 1 of 4, Preview: the client reviews a watermarked preview and leaves comments. Final files stay locked.',
      'Step 2 of 4, Approve: the client approves the revision and the invoice is ready.',
      'Step 3 of 4, Pay: payment is required before the final files unlock.',
      'Step 4 of 4, Download: payment is confirmed, the watermark is removed and the final files can be downloaded.'
    ];
    var STEP_MS = 4200;
    var buttons = Array.prototype.slice.call(flow.querySelectorAll('[data-stage-btn]'));
    var stage = 0;
    var timer = null;
    var inView = false;
    var hovered = false;
    var userTookOver = false;

    flow.style.setProperty('--flow-dur', STEP_MS + 'ms');

    var setStage = function (index, announce) {
      stage = index;
      consoleEl.setAttribute('data-stage', STAGES[index]);
      buttons.forEach(function (btn, i) {
        btn.setAttribute('aria-pressed', i === index ? 'true' : 'false');
        btn.classList.toggle('is-done', i < index);
      });
      if (announce && caption) caption.textContent = CAPTIONS[index];
    };

    var canPlay = function () {
      return !reduceMotion && !userTookOver && inView && !hovered && !document.hidden;
    };

    var stop = function () {
      window.clearTimeout(timer);
      timer = null;
      flow.classList.remove('is-playing');
    };

    var play = function () {
      stop();
      if (!canPlay()) return;
      // Restart the progress bar animation for the current step.
      void flow.offsetWidth;
      flow.classList.add('is-playing');
      timer = window.setTimeout(function () {
        setStage((stage + 1) % STAGES.length, false);
        play();
      }, STEP_MS);
    };

    buttons.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        userTookOver = true;
        stop();
        setStage(i, true);
      });
    });

    // Arrow keys move between the four stage buttons.
    flow.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var current = buttons.indexOf(document.activeElement);
      if (current === -1) return;
      e.preventDefault();
      var next = (current + (e.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].focus();
      buttons[next].click();
    });

    var stageWrap = consoleEl.parentElement;
    stageWrap.addEventListener('mouseenter', function () { hovered = true; stop(); });
    stageWrap.addEventListener('mouseleave', function () { hovered = false; play(); });
    stageWrap.addEventListener('focusin', function () { hovered = true; stop(); });
    stageWrap.addEventListener('focusout', function (e) {
      if (!stageWrap.contains(e.relatedTarget)) { hovered = false; play(); }
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else play();
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) play(); else stop();
      }, { threshold: 0.35 }).observe(consoleEl);
    }

    setStage(0, false);
  }

  /* ---------- 2. How it works ---------- */
  var steps = document.querySelectorAll('.step[data-step]');
  var scenes = document.querySelectorAll('.scene[data-scene]');

  if (steps.length && scenes.length && 'IntersectionObserver' in window) {
    var activate = function (n) {
      steps.forEach(function (s) {
        s.classList.toggle('is-active', s.getAttribute('data-step') === n);
      });
    };
    var sceneObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) activate(entry.target.getAttribute('data-scene'));
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    scenes.forEach(function (scene) { sceneObserver.observe(scene); });
  }
})();
