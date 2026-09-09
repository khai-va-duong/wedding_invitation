/**
 * Wedding invitation — main application script.
 * Vanilla JS, no build step required. Reads window.SITE_CONFIG /
 * window.GUEST_LIST (see data/config.js and data/guests.js).
 */
(function () {
  "use strict";

  var CONFIG = window.SITE_CONFIG;
  var GUESTS = window.GUEST_LIST || [];

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
  };
  var DEFAULT_GUEST = window.DEFAULT_GUEST || { title: "", name: "Quý khách", companion: "" };

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
    var highlightDates = [mainDate].concat(
      (CONFIG.wedding.events || []).map(function (ev) { return new Date(ev.date); })
    );

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
      var isHighlight = highlightDates.some(function (d) { return sameDay(d, cellDate); });
      html += '<div class="day' + (isHighlight ? " highlight" : "") + '">' + day + "</div>";
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

  function renderAll() {
    var guest = resolveGuest();
    var groom = CONFIG.couple.groom;
    var bride = CONFIG.couple.bride;
    var coupleNames = groom.name + " " + CONFIG.couple.separator + " " + bride.name;

    updateSeo(guest);

    // Envelope
    document.getElementById("envelope-greeting").textContent = greetingFor(guest);
    document.getElementById("envelope-names").textContent = coupleNames;

    // Hero
    document.getElementById("hero-tagline").textContent = CONFIG.couple.tagline || "";
    document.getElementById("hero-names").innerHTML =
      groom.name + '<span class="hero-ampersand">' + CONFIG.couple.separator + "</span>" + bride.name;
    document.getElementById("hero-date").textContent = formatDate(CONFIG.wedding.date);
    document.getElementById("hero-lunar").textContent = CONFIG.wedding.lunarDate || "";

    // Calendar
    document.getElementById("hero-badge").textContent = CONFIG.couple.badge || "";
    renderCalendar();

    // Couple cards
    var people = [groom, bride].sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    var coupleGrid = document.getElementById("couple-grid");
    coupleGrid.innerHTML = "";
    people.forEach(function (p) {
      var card = el("div", "person-card reveal");
      card.innerHTML =
        '<img class="person-photo" src="' + p.photo + '" alt="' + p.fullName + '">' +
        '<div class="person-name">' + p.fullName + "</div>" +
        '<div class="person-role">' + (p === groom ? "Chú Rể" : "Cô Dâu") + "</div>" +
        (p.quote ? '<div class="person-quote">&ldquo;' + p.quote + '&rdquo;</div>' : "") +
        '<div class="person-parents">Con của ' + p.parents + "</div>";
      coupleGrid.appendChild(card);
    });

    document.getElementById("marriage-quote").textContent = CONFIG.couple.quote || "";

    // Foreword
    var forewordEl = document.getElementById("foreword-text");
    forewordEl.innerHTML = (CONFIG.foreword || []).map(function (p) { return "<p>" + p + "</p>"; }).join("");

    // Family info + personalized invitation letter
    renderDateRange();
    renderFamilyPanel(groom, bride);
    var invite = CONFIG.invite || {};
    document.querySelector("#letter-section .invite-heading").textContent = invite.heading || "Thư Mời Cưới";
    document.getElementById("invite-names").innerHTML =
      groom.name + '<span class="invite-heart">&hearts;</span>' + bride.name;
    document.getElementById("invite-body").innerHTML =
      (invite.line1 || "TRÂN TRỌNG KÍNH MỜI") + " " + escapeHtml(guestPhraseFor(guest)).toUpperCase() +
      "<br>" + (invite.line2 || "") +
      "<br>" + (invite.line3 || "");

    // Events
    var eventsWrap = document.getElementById("events-wrap");
    eventsWrap.innerHTML = "";
    CONFIG.wedding.events.forEach(function (ev) {
      var card = el("div", "event-card reveal");
      card.innerHTML =
        '<div class="event-title">' + ev.title + "</div>" +
        '<div class="event-desc">' + (ev.description || "") + "</div>" +
        '<div class="event-row"><span class="icon">' + ICONS.calendar + '</span><span class="value"><strong>' +
          formatDate(ev.date) + '</strong>Lúc ' + ev.time + "</span></div>" +
        '<div class="event-row"><span class="icon">' + ICONS.pin + '</span><span class="value"><strong>' +
          ev.venue + '</strong>' + ev.address + "</span></div>" +
        (ev.mapUrl ? '<div style="text-align:center"><a class="map-link" target="_blank" rel="noopener" href="' + ev.mapUrl + '">Xem bản đồ &rarr;</a></div>' : "");
      eventsWrap.appendChild(card);
    });

    // Gallery
    var galleryGrid = document.getElementById("gallery-grid");
    galleryGrid.innerHTML = "";
    (CONFIG.gallery || []).forEach(function (src, idx) {
      var img = el("img");
      img.src = src;
      img.loading = "lazy";
      img.alt = "Ảnh cưới " + (idx + 1);
      img.addEventListener("click", function () { openLightbox(idx); });
      galleryGrid.appendChild(img);
    });

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
  // maroon accent — no QR image file to keep in sync with the account
  // details, it just regenerates from whatever gift.groom/gift.bride say.
  function qrUrlFor(gift) {
    if (gift.qr) return gift.qr;
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
    container.innerHTML =
      '<img class="qr" src="' + qrUrlFor(gift) + '" alt="QR chuyển khoản ' + ownerName + '" loading="lazy">' +
      '<div class="gift-owner">' + ownerName + "</div>" +
      '<div class="gift-bank">' + gift.bankName + "</div>" +
      '<div class="gift-account">' + gift.accountNumber + " &middot; " + gift.accountName + "</div>" +
      '<button class="btn-copy" data-copy="' + gift.accountNumber + '">Sao chép STK</button>';
  }

  /* ------------------------------------------------------------------ *
   * Envelope open + music autoplay (must run inside a user gesture)
   * ------------------------------------------------------------------ */
  function setupEnvelope() {
    var envelope = document.getElementById("envelope");
    var openBtn = document.getElementById("btn-open");

    openBtn.addEventListener("click", function () {
      envelope.classList.add("hidden");
      document.body.style.overflow = "auto";
      playMusicFromStart();
      startPetals();
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
        audio.play().catch(function () {});
      };
      if (audio.readyState >= 1) {
        seekThenPlay();
      } else {
        audio.addEventListener("loadedmetadata", seekThenPlay, { once: true });
        audio.load();
      }
    } else {
      musicHasStarted = true;
      audio.play().catch(function () {});
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
          audio.play().catch(function () {});
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

    function tick() {
      var diff = Math.max(0, target - Date.now());
      var s = Math.floor(diff / 1000);
      els.days.textContent = Math.floor(s / 86400);
      els.hours.textContent = String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
      els.minutes.textContent = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
      els.seconds.textContent = String(s % 60).padStart(2, "0");
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------------ *
   * Scroll reveal
   * ------------------------------------------------------------------ */
  function setupReveal() {
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
    document.querySelectorAll(".reveal").forEach(function (node) { observer.observe(node); });
  }

  /* ------------------------------------------------------------------ *
   * Gallery lightbox
   * ------------------------------------------------------------------ */
  var lightboxIndex = 0;
  function openLightbox(idx) {
    lightboxIndex = idx;
    var lb = document.getElementById("lightbox");
    document.getElementById("lightbox-img").src = CONFIG.gallery[idx];
    lb.classList.add("open");
  }
  function closeLightbox() {
    document.getElementById("lightbox").classList.remove("open");
  }
  function stepLightbox(delta) {
    var len = CONFIG.gallery.length;
    lightboxIndex = (lightboxIndex + delta + len) % len;
    document.getElementById("lightbox-img").src = CONFIG.gallery[lightboxIndex];
  }
  function setupLightbox() {
    document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
    document.getElementById("lightbox").addEventListener("click", function (e) {
      if (e.target.id === "lightbox") closeLightbox();
    });
    document.getElementById("lightbox-prev").addEventListener("click", function () { stepLightbox(-1); });
    document.getElementById("lightbox-next").addEventListener("click", function () { stepLightbox(1); });
  }

  /* ------------------------------------------------------------------ *
   * Copy to clipboard (bank account numbers)
   * ------------------------------------------------------------------ */
  function setupCopyButtons() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".btn-copy");
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

  function setupWishForm() {
    var form = document.getElementById("wish-form");
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
   * Falling petals (lightweight, CSS-driven)
   * ------------------------------------------------------------------ */
  var petalsStarted = false;
  function startPetals() {
    if (petalsStarted) return;
    petalsStarted = true;
    var container = document.getElementById("petals");
    var symbols = ["❀", "❁", "✿", "❃"];

    function spawn() {
      var petal = el("span", "petal", symbols[Math.floor(Math.random() * symbols.length)]);
      var left = Math.random() * 100;
      var fallDuration = 6 + Math.random() * 6;
      var swayDuration = 2 + Math.random() * 2;
      petal.style.left = left + "vw";
      petal.style.fontSize = 12 + Math.random() * 10 + "px";
      petal.style.animationDuration = fallDuration + "s, " + swayDuration + "s";
      container.appendChild(petal);
      setTimeout(function () { petal.remove(); }, fallDuration * 1000);
    }

    for (var i = 0; i < 6; i++) setTimeout(spawn, i * 500);
    setInterval(spawn, 1400);
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
    setupEnvelope();
    setupMusic();
    setupCountdown();
    setupReveal();
    setupLightbox();
    setupCopyButtons();
    setupWishForm();
  });
})();
