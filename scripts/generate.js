#!/usr/bin/env node
/**
 * Generates a real static page per guest at for/<slug>/index.html, with the
 * correct <title> / og:title / og:description baked directly into the HTML.
 *
 * Why this is needed: link-preview crawlers (Zalo, Facebook, Messenger,
 * Telegram...) do not execute JavaScript, so a purely client-side-rendered
 * greeting (like the on-page one) never shows up in a shared link's preview
 * card. Baking it into real per-guest HTML files fixes that, while staying
 * 100% static and GitHub-Pages-friendly.
 *
 * Run this again any time you edit data/guests.js, then commit the result:
 *   node scripts/generate.js
 *
 * Guests that are NOT in data/guests.js still work via the 404.html
 * redirect trick (see README.md) — they just won't have a personalized
 * link-preview title, only the generic default.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

function loadBrowserGlobalsModule(relativePath) {
  const sandbox = { window: {} };
  const code = fs.readFileSync(path.join(ROOT, relativePath), "utf8");
  // data/config.js and data/guests.js only ever do `window.X = ...`, so a
  // bare `window` binding is all they need to run under Node too.
  const fn = new Function("window", code);
  fn(sandbox.window);
  return sandbox.window;
}

const configWindow = loadBrowserGlobalsModule("data/config.js");
const guestsWindow = loadBrowserGlobalsModule("data/guests.js");
const CONFIG = configWindow.SITE_CONFIG;
const GUESTS = guestsWindow.GUEST_LIST || [];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shortLabelFor(guest) {
  const parts = [];
  if (guest.title) parts.push(guest.title);
  parts.push(guest.name);
  return parts.join(" ").trim();
}

const DEFAULT_TITLE = "Thân mời bạn | Ngày chung đôi";
const DEFAULT_DESC = "đến dự buổi tiệc chung vui cùng gia đình";

const template = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

// Guest pages live two levels deep (for/<slug>/index.html), so relative
// asset/data references need a "../../" prefix. The root template only ever
// references these two prefixes, so plain string replacement is safe.
function rewriteForSubdir(html) {
  return html
    .split('href="assets/').join('href="../../assets/')
    .split('src="assets/').join('src="../../assets/')
    .split('src="data/').join('src="../../data/');
}

let written = 0;
GUESTS.forEach((guest) => {
  const seo = CONFIG.seo || {};
  const title = [seo.titlePrefix, shortLabelFor(guest), seo.titleSuffix].filter(Boolean).join(" ");
  const description = seo.subtitle || DEFAULT_DESC;

  let html = rewriteForSubdir(template);
  html = html.split(DEFAULT_TITLE).join(escapeHtml(title));
  html = html.split(DEFAULT_DESC).join(escapeHtml(description));

  const outDir = path.join(ROOT, "for", guest.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html);
  written++;
  console.log(`  for/${guest.slug}/index.html  ->  "${title}"`);
});

console.log(`\nGenerated ${written} personalized page(s).`);
