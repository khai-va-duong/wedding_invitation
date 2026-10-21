/**
 * Wedding invitation — main application script.
 * Vanilla JS, no build step required. Reads window.SITE_CONFIG /
 * window.GUEST_LIST (see data/config.js and data/guests.js).
 */
(function () {
  "use strict";

  var CONFIG = window.SITE_CONFIG;
  var GUESTS = window.GUEST_LIST || [];
  var LABELS = CONFIG.labels || {};
  var REDUCED_MOTION = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Site root, derived from this script's own URL. Personalized pages live at
  // for/<slug>/index.html, so relative paths from data/config.js (e.g.
  // "assets/img/qr_code.jpg") must be resolved against the root, not the page.
  var SITE_ROOT = (function () {
    var script = document.currentScript;
    return script ? script.src.replace(/assets\/js\/app\.js(\?.*)?$/, "") : "";
  })();

  // Small inline-SVG icon set (stroke uses currentColor, so each icon
  // inherits whatever text color it's placed in). Used instead of emoji,
  // which render inconsistently — missing glyphs, mismatched art styles —
  // across devices and fonts.
  var ICONS = {
    calendar:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    pin:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    music:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    sparkle:
      '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="8" y="8" width="8" height="8" rx="2" transform="rotate(45 12 12)"/></svg>',
    download:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    // Two interlocking wedding rings, drawn stroke-by-stroke when revealed.
    rings:
      '<svg viewBox="0 0 120 64" fill="none" stroke="currentColor" stroke-width="2.2"><circle class="ring ring-a" cx="46" cy="36" r="22"/><circle class="ring ring-b" cx="74" cy="36" r="22"/><path class="ring-gem" d="M46 8l5 6-5 5-5-5z" fill="currentColor" stroke="none"/></svg>',
    petal:
      '<svg viewBox="0 0 30 30"><path d="M15 1C25 7 28 19 15 29C2 19 5 7 15 1Z"/></svg>',
    heart:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.6-9.3C.8 8 3 4 6.9 4c2.2 0 3.7 1.2 5.1 3 1.4-1.8 2.9-3 5.1-3C21 4 23.2 8 21.6 11.7 19.5 16.4 12 21 12 21z"/></svg>',
  };
  var DEFAULT_GUEST = window.DEFAULT_GUEST || { title: "", name: "Quý khách", companion: "" };

  /* ------------------------------------------------------------------ *
   * Asset paths
   * ------------------------------------------------------------------ */
  function assetUrl(path) {
    if (!path || /^(https?:|data:|\/)/.test(path)) return path;
    return SITE_ROOT + path;
  }

  // A bare photo name like "DSC_6854" maps to the optimized copies made by
  // scripts/optimize-images.ps1; anything else is treated as a path/URL.
  function photoUrl(photo, size) {
    if (/^[\w-]+$/.test(photo)) return assetUrl("assets/img/" + size + "/" + photo + ".jpg");
    return assetUrl(photo);
  }

  /* ------------------------------------------------------------------ *
   * Guest resolution from URL (supports /for/<slug> clean paths, restored
   * by 404.html's redirect trick — see that file for the GitHub Pages
   * SPA-routing workaround) and ?to=<slug> as a plain fallback.
   * ------------------------------------------------------------------ */
  function resolveGuest() {
    var slug = null;
    var pathMatch = window.location.pathname.match(/\/for\/([^\/?#]+)\/?$/);
    if (pathMatch) slug = decodeURIComponent(pathMatch[1]);

    if (!slug) {
      var params = new URLSearchParams(window.location.search);
      if (params.get("to")) slug = params.get("to");
    }

    if (!slug) return DEFAULT_GUEST;
    var found = GUESTS.find(function (g) { return g.slug === slug; });
    return found || DEFAULT_GUEST;
  }

  function greetingFor(guest) {
    if (guest.greeting) return guest.greeting;
    var parts = ["Kính mời"];
    if (guest.title) parts.push(guest.title);
    parts.push(guest.name);
    if (guest.companion) parts.push(guest.companion);
    return parts.join(" ");
  }

  // "{title} {name} {companion}" with no "Kính mời" prefix — used in the
  // "Thư Mời Cưới" invitation-letter block, which supplies its own lead-in
  // line ("TRÂN TRỌNG KÍNH MỜI ...").
  function guestPhraseFor(guest) {
    var parts = [];
    if (guest.title) parts.push(guest.title);
    parts.push(guest.name);
    if (guest.companion) parts.push(guest.companion);
    return parts.join(" ");
  }

  // Short "{title} {name}" label used in the shareable link's title/preview,
  // e.g. "chị Liên" — distinct from the fuller on-page greeting above.
  function shortLabelFor(guest) {
    var parts = [];
    if (guest.title) parts.push(guest.title);
    parts.push(guest.name);
    var label = parts.join(" ").trim();
    return label || (CONFIG.seo && CONFIG.seo.defaultGuestLabel) || "bạn";
  }

  function updateSeo(guest) {
    var seo = CONFIG.seo || {};
    var title = [seo.titlePrefix, shortLabelFor(guest), seo.titleSuffix].filter(Boolean).join(" ");
    var description = seo.subtitle || "";
    document.querySelectorAll('[data-seo="title"]').forEach(function (n) { n.textContent = title; });
    document.querySelectorAll('[data-seo="og:title"]').forEach(function (n) { n.setAttribute("content", title); });
    document.querySelectorAll('[data-seo="description"], [data-seo="og:description"]').forEach(function (n) {
      n.setAttribute("content", description);
    });
  }

  /* ------------------------------------------------------------------ *
   * Rendering
   * ------------------------------------------------------------------ */
  function el(tag, className, html) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function formatDate(dateStr) {
    var d = new Date(dateStr);
    var days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    return days[d.getDay()] + ", ngày " + d.getDate() + " tháng " + (d.getMonth() + 1) + " năm " + d.getFullYear();
  }

  // Vietnamese week runs Mon(T2)..Sat(T7), Sun(CN) last.
  var WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  var MONTH_LABELS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function renderCalendar() {
    var container = document.getElementById("calendar-widget");
    var mainDate = new Date(CONFIG.wedding.date);
    var highlightDates = (CONFIG.wedding.events || []).map(function (ev) { return new Date(ev.date); });

    var year = mainDate.getFullYear();
    var month = mainDate.getMonth(); // 0-based
    var firstOfMonth = new Date(year, month, 1);
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var startOffset = (firstOfMonth.getDay() + 6) % 7; // Monday = 0

    var html = '<div class="calendar-month-label">Tháng ' + MONTH_LABELS[month] + " &middot; " + year + "</div>";
    html += '<div class="calendar-grid">';
    WEEKDAY_LABELS.forEach(function (label) {
      html += '<div class="weekday">' + label + "</div>";
    });
    for (var i = 0; i < startOffset; i++) html += '<div class="day"></div>';
    for (var day = 1; day <= daysInMonth; day++) {
      var cellDate = new Date(year, month, day);
      var cls = "day";
      if (sameDay(mainDate, cellDate)) {
        cls += " highlight main";
      } else if (highlightDates.some(function (d) { return sameDay(d, cellDate); })) {
        cls += " highlight";
      }
      html += '<div class="' + cls + '"><span>' + day + "</span>" +
        (cls.indexOf("main") !== -1 ? '<i class="day-heart">' + ICONS.heart + "</i>" : "") + "</div>";
    }
    html += "</div>";
    container.innerHTML = html;
  }

  function pad2(n) { return String(n).padStart(2, "0"); }

  // "08.08 - 10.08.2026" style range spanning every ceremony date.
  function renderDateRange() {
    var el = document.getElementById("date-range-text");
    var dates = (CONFIG.wedding.events || []).map(function (ev) { return new Date(ev.date); });
    if (!dates.length) dates = [new Date(CONFIG.wedding.date)];
    dates.sort(function (a, b) { return a - b; });
    var first = dates[0];
    var last = dates[dates.length - 1];
    var firstStr = pad2(first.getDate()) + "." + pad2(first.getMonth() + 1);
    var lastStr = pad2(last.getDate()) + "." + pad2(last.getMonth() + 1);
    el.textContent = sameDay(first, last)
      ? firstStr + "." + last.getFullYear()
      : firstStr + " - " + lastStr + "." + last.getFullYear();
  }

  function renderFamilyPanel(groom, bride) {
    var grid = document.getElementById("family-grid");
    function col(p) {
      return (
        '<div class="family-col">' +
        (p.father ? '<div class="family-line"><strong>Ông:</strong> ' + p.father + "</div>" : "") +
        (p.mother ? '<div class="family-line"><strong>Bà:</strong> ' + p.mother + "</div>" : "") +
        (p.address ? '<div class="family-address">' + p.address + "</div>" : "") +
        "</div>"
      );
    }
    grid.innerHTML = col(groom) + col(bride);
  }

  // Wraps each character in a span so the names can "write themselves" in,
  // one letter after another, when the hero is revealed.
  function letterSpans(text, startIndex) {
    return Array.from(text).map(function (ch, i) {
      return '<span class="ch" style="--i:' + (startIndex + i) + '">' + (ch === " " ? "&nbsp;" : escapeHtml(ch)) + "</span>";
    }).join("");
  }

  function renderHero(groom, bride) {
    var photos = CONFIG.photos || {};
    var heroPhoto = document.getElementById("hero-photo");
    if (photos.hero) heroPhoto.src = photoUrl(photos.hero, "web");
    heroPhoto.alt = groom.name + " " + CONFIG.couple.separator + " " + bride.name;

    document.getElementById("hero-names").innerHTML =
      '<span class="hero-name">' + letterSpans(groom.name, 0) + "</span>" +
      '<span class="hero-ampersand">' + escapeHtml(CONFIG.couple.separator) + "</span>" +
      '<span class="hero-name">' + letterSpans(bride.name, groom.name.length + 2) + "</span>";
    document.getElementById("hero-tagline").textContent = CONFIG.couple.tagline || "";
    document.getElementById("hero-date").textContent = formatDate(CONFIG.wedding.date);
    document.getElementById("hero-lunar").textContent = CONFIG.wedding.lunarDate || "";

    if (photos.cover) {
      var coverUrl = 'url("' + photoUrl(photos.cover, "web") + '")';
      document.documentElement.style.setProperty("--cover-image", coverUrl);
    }
    if (photos.footer) {
      document.getElementById("footer-photo").src = photoUrl(photos.footer, "web");
    }
  }

  function renderInterludes() {
    var list = CONFIG.interludes || [];
    document.querySelectorAll("[data-interlude]").forEach(function (slot) {
      var item = list[Number(slot.getAttribute("data-interlude"))];
      if (!item) { slot.remove(); return; }
      slot.innerHTML =
        '<div class="interlude-media"><img data-parallax loading="lazy" alt="" src="' + photoUrl(item.photo, "web") + '"></div>' +
        '<div class="interlude-text reveal">' +
          (item.chapter ? '<div class="interlude-chapter">' + escapeHtml(item.chapter) + "</div>" : "") +
          '<blockquote class="interlude-quote">' + escapeHtml(item.quote || "") + "</blockquote>" +
        "</div>";
    });
  }

  function renderCouple(groom, bride) {
    var people = [groom, bride].sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    var coupleGrid = document.getElementById("couple-grid");
    coupleGrid.innerHTML = "";
    people.forEach(function (p, idx) {
      var card = el("div", "person-card reveal " + (idx === 0 ? "reveal-left" : "reveal-right"));
      card.innerHTML =
        '<div class="person-frame"><img class="person-photo" loading="lazy" src="' + photoUrl(p.photo, "web") + '" alt="' + p.fullName + '"></div>' +
        '<div class="person-role">' + (p === groom ? "Chú Rể" : "Cô Dâu") + "</div>" +
        '<div class="person-name">' + p.fullName + "</div>" +
        (p.quote ? '<div class="person-quote">&ldquo;' + p.quote + '&rdquo;</div>' : "") +
        '<div class="person-parents">Con của ' + p.parents + "</div>";
      coupleGrid.appendChild(card);
      if (idx === 0) coupleGrid.appendChild(el("div", "couple-heart reveal reveal-zoom", ICONS.heart));
    });
  }

  function renderAll() {
    var guest = resolveGuest();
    var groom = CONFIG.couple.groom;
    var bride = CONFIG.couple.bride;
    var coupleNames = groom.name + " " + CONFIG.couple.separator + " " + bride.name;
    var mainDate = new Date(CONFIG.wedding.date);

    updateSeo(guest);

    // Envelope
    document.getElementById("envelope-greeting").textContent = greetingFor(guest);
    document.getElementById("envelope-names").textContent = coupleNames;
    document.getElementById("envelope-date").textContent =
      pad2(mainDate.getDate()) + " · " + pad2(mainDate.getMonth() + 1) + " · " + mainDate.getFullYear();

    renderHero(groom, bride);

    // Calendar
    document.getElementById("hero-badge").textContent = CONFIG.couple.badge || "";
    renderCalendar();

    renderInterludes();
    renderCouple(groom, bride);
    document.getElementById("marriage-quote").textContent = CONFIG.couple.quote || "";

    // Foreword
    var forewordEl = document.getElementById("foreword-text");
    forewordEl.innerHTML = (CONFIG.foreword || []).map(function (p) { return "<p>" + p + "</p>"; }).join("");
    document.getElementById("foreword-sign").textContent = coupleNames;

    // Family info + personalized invitation letter
    renderDateRange();
    renderFamilyPanel(groom, bride);
    var invite = CONFIG.invite || {};
    document.querySelector("#letter-section .invite-heading").textContent = invite.heading || "Thư Mời Cưới";
    document.getElementById("invite-rings").innerHTML = ICONS.rings;
    document.getElementById("invite-names").innerHTML =
      groom.name + '<span class="invite-heart">&hearts;</span>' + bride.name;
    document.getElementById("invite-body").innerHTML =
      (invite.line1 || "TRÂN TRỌNG KÍNH MỜI") +
      '<span class="invite-guest">' + escapeHtml(guestPhraseFor(guest)) + "</span>" +
      (invite.line2 || "") +
      "<br>" + (invite.line3 || "");
    document.getElementById("invite-closing").textContent = invite.closing || "";

    // Events
    var eventsWrap = document.getElementById("events-wrap");
    eventsWrap.innerHTML = "";
    CONFIG.wedding.events.forEach(function (ev) {
      var card = el("div", "event-card reveal");
      card.innerHTML =
        '<div class="event-time">' + ev.time + "</div>" +
        '<div class="event-title">' + ev.title + "</div>" +
        '<div class="event-desc">' + (ev.description || "") + "</div>" +
        '<div class="event-row"><span class="icon">' + ICONS.calendar + '</span><span class="value"><strong>' +
          formatDate(ev.date) + '</strong>Lúc ' + ev.time + "</span></div>" +
        '<div class="event-row"><span class="icon">' + ICONS.pin + '</span><span class="value"><strong>' +
          ev.venue + '</strong>' + ev.address + "</span></div>" +
        (ev.mapUrl ? '<div style="text-align:center"><a class="map-link" target="_blank" rel="noopener" href="' + ev.mapUrl + '">Xem bản đồ &rarr;</a></div>' : "");
      eventsWrap.appendChild(card);
    });

    renderGalleryTabs();

    // Gift
    document.getElementById("gift-intro").textContent = CONFIG.gift.intro;
    renderGiftCard("gift-groom", groom.name, CONFIG.gift.groom);
    renderGiftCard("gift-bride", bride.name, CONFIG.gift.bride);

    // Footer
    document.getElementById("footer-names").textContent = coupleNames;
    document.getElementById("footer-hashtag").textContent = CONFIG.wedding.hashtag || "";
  }

  // Generates a real, scannable QR (via the free api.qrserver.com service)
  // encoding the bank/account info below, tinted to match the site's
  // maroon accent — used only when the gift entry has no `qr` image of its own.
  function qrUrlFor(gift) {
    if (gift.qr) return assetUrl(gift.qr);
    var payload = [gift.bankName, gift.accountNumber, gift.accountName].filter(Boolean).join(" - ");
    var params = new URLSearchParams({
      size: "300x300",
      margin: "8",
      color: "125-43-52",
      bgcolor: "255-255-255",
      data: payload,
    });
    return "https://api.qrserver.com/v1/create-qr-code/?" + params.toString();
  }

  function renderGiftCard(containerId, ownerName, gift) {
    var container = document.getElementById(containerId);
    if (!gift) {
      container.remove();
      return;
    }
    var qrUrl = qrUrlFor(gift);
    container.innerHTML =
      '<div class="qr-frame"><img class="qr" src="' + qrUrl + '" alt="QR chuyển khoản ' + ownerName + '" loading="lazy"></div>' +
      '<div class="gift-owner">' + ownerName + "</div>" +
      '<div class="gift-bank">' + gift.bankName + "</div>" +
      '<div class="gift-account">' + gift.accountNumber + "</div>" +
      '<div class="gift-holder">' + gift.accountName + "</div>" +
      '<div class="gift-actions">' +
        '<button class="btn-copy" data-copy="' + gift.accountNumber + '">Sao chép STK</button>' +
        (gift.qr && LABELS.saveQr
          ? '<a class="btn-copy btn-save" href="' + qrUrl + '" download>' + ICONS.download + LABELS.saveQr + "</a>"
          : "") +
      "</div>";
  }

  /* ------------------------------------------------------------------ *
   * Gallery — one tab per chapter (photo set)
   * ------------------------------------------------------------------ */
  var currentChapter = 0;

  function renderGalleryTabs() {
    var chapters = CONFIG.gallery || [];
    var tabs = document.getElementById("gallery-tabs");
    tabs.innerHTML = "";
    if (chapters.length < 2) tabs.hidden = true;
    chapters.forEach(function (chapter, idx) {
      var tab = el("button", "gallery-tab");
      tab.type = "button";
      tab.setAttribute("role", "tab");
      tab.innerHTML = '<span class="tab-num">' + pad2(idx + 1) + "</span>" + escapeHtml(chapter.title || "");
      tab.addEventListener("click", function () { showChapter(idx); });
      tabs.appendChild(tab);
    });
    showChapter(0);
  }

  function showChapter(idx) {
    var chapter = (CONFIG.gallery || [])[idx];
    if (!chapter) return;
    currentChapter = idx;
    document.querySelectorAll(".gallery-tab").forEach(function (tab, i) {
      tab.classList.toggle("active", i === idx);
      tab.setAttribute("aria-selected", String(i === idx));
    });
    document.getElementById("gallery-caption").textContent = chapter.caption || "";

    var grid = document.getElementById("gallery-grid");
    grid.innerHTML = "";
    chapter.photos.forEach(function (photo, i) {
      var item = el("button", "gallery-item" + (i === 0 ? " feature" : ""));
      item.type = "button";
      item.style.setProperty("--d", (i * 60) + "ms");
      var img = el("img");
      img.src = photoUrl(photo, i === 0 ? "web" : "thumb");
      img.loading = "lazy";
      img.alt = "Ảnh cưới " + (i + 1);
      img.addEventListener("load", function () { item.classList.add("loaded"); });
      item.appendChild(img);
      item.addEventListener("click", function () { openLightbox(i); });
      grid.appendChild(item);
    });
    // Restart the cascade-in animation for the newly shown chapter.
    grid.classList.remove("shown");
    void grid.offsetWidth;
    grid.classList.add("shown");
  }

  /* ------------------------------------------------------------------ *
   * Envelope open + music autoplay (must run inside a user gesture)
   * ------------------------------------------------------------------ */
  function setupEnvelope() {
    var envelope = document.getElementById("envelope");
    var openBtn = document.getElementById("btn-open");
    var opened = false;

    openBtn.addEventListener("click", function () {
      if (opened) return;
      opened = true;
      playMusicFromStart();
      if (navigator.vibrate && !REDUCED_MOTION) navigator.vibrate([18, 90, 18]); // a soft "heartbeat"

      envelope.classList.add("opening");
      setTimeout(function () {
        envelope.classList.add("hidden");
        document.body.classList.remove("is-sealed");
        document.body.classList.add("is-open");
        startPetals();
      }, REDUCED_MOTION ? 200 : 2300);
    });
  }

  /* ------------------------------------------------------------------ *
   * Music toggle — starts at CONFIG.music.startAt the first time it plays
   * (e.g. "50" to skip straight to the chorus), then behaves like a normal
   * play/pause toggle for the rest of the visit.
   * ------------------------------------------------------------------ */
  var musicHasStarted = false;

  function updateMusicButton(playing) {
    var btn = document.getElementById("music-toggle");
    btn.classList.toggle("playing", playing);
    btn.setAttribute("aria-pressed", String(playing));
  }

  function playMusicFromStart() {
    var audio = document.getElementById("bg-audio");
    var startAt = (CONFIG.music && CONFIG.music.startAt) || 0;

    if (!musicHasStarted && startAt > 0) {
      musicHasStarted = true;
      var seekThenPlay = function () {
        try { audio.currentTime = startAt; } catch (e) {}
        audio.play().catch(function () { updateMusicButton(false); });
      };
      if (audio.readyState >= 1) {
        seekThenPlay();
      } else {
        audio.addEventListener("loadedmetadata", seekThenPlay, { once: true });
        audio.load();
      }
    } else {
      musicHasStarted = true;
      audio.play().catch(function () { updateMusicButton(false); });
    }
    updateMusicButton(true);
  }

  function setupMusic() {
    var audio = document.getElementById("bg-audio");
    var btn = document.getElementById("music-toggle");
    btn.addEventListener("click", function () {
      if (audio.paused) {
        if (!musicHasStarted) {
          playMusicFromStart();
        } else {
          audio.play().catch(function () { updateMusicButton(false); });
          updateMusicButton(true);
        }
      } else {
        audio.pause();
        updateMusicButton(false);
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * Countdown timer
   * ------------------------------------------------------------------ */
  function setupCountdown() {
    var target = new Date(CONFIG.wedding.date).getTime();
    var els = {
      days: document.getElementById("cd-days"),
      hours: document.getElementById("cd-hours"),
      minutes: document.getElementById("cd-minutes"),
      seconds: document.getElementById("cd-seconds"),
    };

    function set(node, value) {
      value = String(value);
      if (node.textContent === value) return;
      node.textContent = value;
      // Replay the small "page turn" animation on every change.
      node.classList.remove("tick");
      void node.offsetWidth;
      node.classList.add("tick");
    }

    function tick() {
      var diff = Math.max(0, target - Date.now());
      var s = Math.floor(diff / 1000);
      set(els.days, Math.floor(s / 86400));
      set(els.hours, pad2(Math.floor((s % 86400) / 3600)));
      set(els.minutes, pad2(Math.floor((s % 3600) / 60)));
      set(els.seconds, pad2(s % 60));
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------------ *
   * Scroll reveal
   * ------------------------------------------------------------------ */
  function setupReveal() {
    var targets = document.querySelectorAll(".reveal, .interlude, .timeline, .invite-letter");
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (node) { node.classList.add("in-view"); });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach(function (node) { observer.observe(node); });
  }

  /* ------------------------------------------------------------------ *
   * Parallax: hero photo + interlude photos drift slower than the page
   * ------------------------------------------------------------------ */
  function setupParallax() {
    if (REDUCED_MOTION) return;
    var hero = document.getElementById("hero-photo");
    var scheduled = false;

    function update() {
      scheduled = false;
      var vh = window.innerHeight;
      if (window.scrollY < vh * 1.2) {
        hero.style.setProperty("--parallax", (window.scrollY * 0.35).toFixed(1) + "px");
      }
      document.querySelectorAll("[data-parallax]").forEach(function (img) {
        var rect = img.parentNode.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        var offset = (rect.top + rect.height / 2 - vh / 2) * -0.18;
        img.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0) scale(1.18)";
      });
    }
    window.addEventListener("scroll", function () {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------ *
   * Gallery lightbox (current chapter only; swipe + keyboard)
   * ------------------------------------------------------------------ */
  var lightboxIndex = 0;

  function chapterPhotos() {
    return ((CONFIG.gallery || [])[currentChapter] || { photos: [] }).photos;
  }
  function showLightboxPhoto() {
    var photos = chapterPhotos();
    var img = document.getElementById("lightbox-img");
    img.classList.remove("shown");
    img.onload = function () { img.classList.add("shown"); };
    img.src = photoUrl(photos[lightboxIndex], "web");
    document.getElementById("lightbox-count").textContent = (lightboxIndex + 1) + " / " + photos.length;
  }
  function openLightbox(idx) {
    lightboxIndex = idx;
    showLightboxPhoto();
    document.getElementById("lightbox").classList.add("open");
  }
  function closeLightbox() {
    document.getElementById("lightbox").classList.remove("open");
  }
  function stepLightbox(delta) {
    var len = chapterPhotos().length;
    lightboxIndex = (lightboxIndex + delta + len) % len;
    showLightboxPhoto();
  }
  function setupLightbox() {
    var lb = document.getElementById("lightbox");
    document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
    lb.addEventListener("click", function (e) {
      if (e.target.id === "lightbox") closeLightbox();
    });
    document.getElementById("lightbox-prev").addEventListener("click", function () { stepLightbox(-1); });
    document.getElementById("lightbox-next").addEventListener("click", function () { stepLightbox(1); });

    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") stepLightbox(-1);
      if (e.key === "ArrowRight") stepLightbox(1);
    });

    var touchX = null;
    lb.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 40) stepLightbox(dx < 0 ? 1 : -1);
    });
  }

  /* ------------------------------------------------------------------ *
   * Copy to clipboard (bank account numbers)
   * ------------------------------------------------------------------ */
  function setupCopyButtons() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".btn-copy[data-copy]");
      if (!btn) return;
      var text = btn.getAttribute("data-copy");
      var done = function () {
        var original = btn.textContent;
        btn.textContent = "Đã sao chép!";
        btn.classList.add("copied");
        setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove("copied");
        }, 1600);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(done).catch(done);
      } else {
        done();
      }
    });
  }

  /* ------------------------------------------------------------------ *
   * Wishes wall (localStorage by default, optional remote endpoint)
   * ------------------------------------------------------------------ */
  var WISHES_KEY = "wedding_wishes";

  function loadWishes() {
    try { return JSON.parse(localStorage.getItem(WISHES_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveWish(wish) {
    var wishes = loadWishes();
    wishes.unshift(wish);
    try { localStorage.setItem(WISHES_KEY, JSON.stringify(wishes)); } catch (e) {}
  }
  function renderWishes() {
    var wall = document.getElementById("wish-wall");
    var wishes = loadWishes();
    wall.innerHTML = "";
    wishes.forEach(function (w) {
      var item = el("div", "wish-item");
      item.innerHTML =
        '<span class="name">' + escapeHtml(w.name) + "</span>" +
        '<span class="attend">' + (w.attend === "yes" ? "Sẽ tham dự" : w.attend === "no" ? "Không thể tham dự" : "") + "</span>" +
        '<div class="msg">' + escapeHtml(w.message) + "</div>";
      wall.appendChild(item);
    });
  }
  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  // A handful of hearts float up from the button after a wish is sent.
  function floatHearts(anchor) {
    if (REDUCED_MOTION) return;
    for (var i = 0; i < 8; i++) {
      var heart = el("span", "float-heart", ICONS.heart);
      heart.style.left = (20 + Math.random() * 60) + "%";
      heart.style.animationDelay = (i * 90) + "ms";
      heart.style.setProperty("--drift", (Math.random() * 60 - 30) + "px");
      anchor.appendChild(heart);
      setTimeout(heart.remove.bind(heart), 2200 + i * 90);
    }
  }

  function setupWishForm() {
    var form = document.getElementById("wish-form");
    var submitBtn = form.querySelector('button[type="submit"]');
    var submitLabel = submitBtn.textContent;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {
        name: form.name.value.trim(),
        attend: form.attend.value,
        message: form.message.value.trim(),
        ts: Date.now(),
      };
      if (!data.name || !data.message) return;

      saveWish(data);
      renderWishes();
      form.reset();
      floatHearts(form);
      if (LABELS.wishSent) {
        submitBtn.textContent = LABELS.wishSent;
        setTimeout(function () { submitBtn.textContent = submitLabel; }, 2400);
      }

      var endpoint = CONFIG.rsvp && CONFIG.rsvp.endpoint;
      if (endpoint) {
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).catch(function () { /* wish is already saved locally */ });
      }
    });
    renderWishes();
  }

  /* ------------------------------------------------------------------ *
   * Falling rose petals (CSS-animated SVG petals, a burst on opening,
   * then a gentle continuous drift; paused while the tab is hidden)
   * ------------------------------------------------------------------ */
  var PETAL_COLORS = ["#8e1f2c", "#b3263a", "#c94c5c", "#e8a0a8", "#f3c7c9"];
  var petalsStarted = false;

  function spawnPetal(container, burst) {
    var petal = el("span", "petal", ICONS.petal);
    var size = 10 + Math.random() * 14;
    var duration = (burst ? 5 : 9) + Math.random() * 6;
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.width = size + "px";
    petal.style.height = size + "px";
    petal.style.color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
    petal.style.setProperty("--drift", (Math.random() * 160 - 80) + "px");
    petal.style.setProperty("--spin", (Math.random() * 720 - 360) + "deg");
    petal.style.setProperty("--flutter", (1.4 + Math.random() * 1.6) + "s");
    petal.style.animationDuration = duration + "s";
    if (burst) petal.style.animationDelay = (Math.random() * 1.2) + "s";
    container.appendChild(petal);
    setTimeout(function () { petal.remove(); }, (duration + 1.5) * 1000);
  }

  function startPetals() {
    if (petalsStarted || REDUCED_MOTION) return;
    petalsStarted = true;
    var container = document.getElementById("petals");
    for (var i = 0; i < 26; i++) spawnPetal(container, true);
    setInterval(function () {
      if (!document.hidden && container.childElementCount < 18) spawnPetal(container, false);
    }, 1300);
  }

  // Twinkling gold dust over the hero photo.
  function renderSparkles() {
    if (REDUCED_MOTION) return;
    var box = document.getElementById("hero-sparkles");
    for (var i = 0; i < 22; i++) {
      var s = el("span", "sparkle");
      s.style.left = Math.random() * 100 + "%";
      s.style.top = 15 + Math.random() * 80 + "%";
      s.style.animationDelay = (Math.random() * 5).toFixed(2) + "s";
      s.style.animationDuration = (3 + Math.random() * 4).toFixed(2) + "s";
      var size = (2 + Math.random() * 3).toFixed(1) + "px";
      s.style.width = size;
      s.style.height = size;
      box.appendChild(s);
    }
  }

  /* ------------------------------------------------------------------ *
   * Init
   * ------------------------------------------------------------------ */
  function renderStaticIcons() {
    document.getElementById("cheers-icon").innerHTML = ICONS.sparkle;
    document.getElementById("music-icon").innerHTML = ICONS.music;
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderStaticIcons();
    renderAll();
    renderSparkles();
    setupEnvelope();
    setupMusic();
    setupCountdown();
    setupReveal();
    setupParallax();
    setupLightbox();
    setupCopyButtons();
    setupWishForm();
  });
})();
