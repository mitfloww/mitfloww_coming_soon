/* ==========================================================================
   MitFloww — Assets Store and Find a Freelancer
   Filtering, sorting and detail sheets for the static listings on
   /store/ and /freelancers/. The listings are sample content; nothing here
   talks to a backend.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Detail sheet (native <dialog>) ---------- */
  function setupSheet(sheet, triggerAttr, itemSelector) {
    if (!sheet || typeof sheet.showModal !== 'function') return;
    var body = sheet.querySelector('[data-sheet-body]');
    var lastTrigger = null;

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[' + triggerAttr + ']');
      if (!trigger) return;
      var item = trigger.closest(itemSelector);
      var tpl = item && item.querySelector('template[data-detail]');
      if (!tpl) return;
      body.replaceChildren(tpl.content.cloneNode(true));
      var title = body.querySelector('[data-sheet-title]');
      if (title) title.id = sheet.getAttribute('aria-labelledby');
      lastTrigger = trigger;
      sheet.showModal();
    });

    sheet.addEventListener('click', function (e) {
      // Close on the close button or a click on the backdrop.
      if (e.target.closest('[data-close]') || e.target === sheet) sheet.close();
    });

    sheet.addEventListener('close', function () {
      if (lastTrigger) lastTrigger.focus();
    });
  }

  function norm(s) { return (s || '').toLowerCase().trim(); }

  /* ---------- Assets Store ---------- */
  var grid = document.getElementById('asset-grid');
  if (grid) {
    var items = Array.prototype.slice.call(grid.querySelectorAll('[data-asset]'));
    var original = items.slice();
    var search = document.getElementById('asset-search');
    var sort = document.getElementById('asset-sort');
    var count = document.getElementById('asset-count');
    var empty = document.getElementById('asset-empty');
    var catButtons = Array.prototype.slice.call(document.querySelectorAll('[data-category-btn]'));
    var category = 'all';

    var renderAssets = function () {
      var q = norm(search.value);
      var visible = 0;
      items.forEach(function (li) {
        var show = (category === 'all' || li.getAttribute('data-category') === category) &&
          (!q || li.getAttribute('data-search').indexOf(q) !== -1);
        li.hidden = !show;
        if (show) visible++;
      });

      var ordered = original.slice();
      if (sort.value === 'title' || sort.value === 'creator') {
        var key = 'data-' + sort.value;
        ordered.sort(function (a, b) { return a.getAttribute(key).localeCompare(b.getAttribute(key)); });
      }
      ordered.forEach(function (li) { grid.appendChild(li); });

      count.textContent = visible === 1 ? '1 sample asset' : visible + ' sample assets';
      empty.hidden = visible !== 0;
      grid.hidden = visible === 0;
    };

    catButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        category = btn.getAttribute('data-category-btn');
        catButtons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        renderAssets();
      });
    });
    search.addEventListener('input', renderAssets);
    sort.addEventListener('change', renderAssets);
    document.querySelectorAll('#asset-empty [data-reset]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        search.value = '';
        catButtons[0].click();
        search.focus();
      });
    });

    setupSheet(document.getElementById('asset-sheet'), 'data-open-asset', '[data-asset]');
  }

  /* ---------- Find a Freelancer ---------- */
  var list = document.getElementById('talent-list');
  if (list) {
    var people = Array.prototype.slice.call(list.querySelectorAll('[data-person]'));
    var originalPeople = people.slice();
    var form = document.getElementById('talent-filters');
    var tSearch = document.getElementById('talent-search');
    var specialty = document.getElementById('talent-specialty');
    var location = document.getElementById('talent-location');
    var remote = document.getElementById('talent-remote');
    var tCount = document.getElementById('talent-count');
    var order = document.getElementById('talent-order');
    var tEmpty = document.getElementById('talent-empty');

    // Proximity groups for a chosen city: 0 same city, 1 same state,
    // 2 works remotely, 3 elsewhere (hidden when a city is chosen).
    var groupFor = function (li, city, state) {
      if (!city) return 0;
      if (li.getAttribute('data-city') === city) return 0;
      if (li.getAttribute('data-state') === state) return 1;
      if (li.getAttribute('data-remote') === 'true') return 2;
      return 3;
    };

    var renderPeople = function () {
      var q = norm(tSearch.value);
      var spec = specialty.value;
      var parts = location.value ? location.value.split('|') : ['', ''];
      var city = parts[0];
      var state = parts[1];
      var includeRemote = remote.checked;
      var visible = 0;

      var scored = originalPeople.map(function (li, i) {
        var group = groupFor(li, city, state);
        var matchesText = !q || li.getAttribute('data-search').indexOf(q) !== -1;
        var matchesSpec = spec === 'all' || li.getAttribute('data-specialty') === spec;
        // Without a chosen city there is no distance to compare, so everyone is in range.
        var inRange = !city || group < 2 || (group === 2 && includeRemote);
        var show = matchesText && matchesSpec && inRange;

        var badge = li.querySelector('[data-match]');
        if (badge) {
          badge.textContent = !city || !show ? '' :
            group === 0 ? 'In ' + city :
            group === 1 ? 'Elsewhere in ' + state :
            'Works remotely';
        }
        li.hidden = !show;
        if (show) visible++;
        return { li: li, group: group, index: i };
      });

      scored.sort(function (a, b) { return a.group - b.group || a.index - b.index; });
      scored.forEach(function (s) { list.appendChild(s.li); });

      tCount.textContent = visible === 1 ? '1 sample profile' : visible + ' sample profiles';
      order.textContent = city
        ? 'Nearest to ' + city + ' first' + (includeRemote ? ', then remote' : '')
        : 'Showing all locations';
      tEmpty.hidden = visible !== 0;
      list.hidden = visible === 0;
    };

    form.addEventListener('input', renderPeople);
    form.addEventListener('change', renderPeople);
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    form.addEventListener('reset', function () { window.setTimeout(renderPeople, 0); });
    document.querySelectorAll('#talent-empty [data-reset]').forEach(function (btn) {
      btn.addEventListener('click', function () { form.reset(); tSearch.focus(); });
    });

    setupSheet(document.getElementById('person-sheet'), 'data-open-person', '[data-person]');
  }
})();
