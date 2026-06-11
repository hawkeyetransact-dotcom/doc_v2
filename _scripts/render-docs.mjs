/**
 * render-docs.mjs — Render Doc_V2 markdown to polished HTML + PDF.
 *
 * Features:
 *   - Cover page (title, module, version, date)
 *   - Auto-generated TOC (H2/H3)
 *   - Mermaid diagram support (```mermaid blocks → SVG)
 *   - Callout boxes (info / warning / success / critical) via blockquote prefix
 *   - Status badges (✅ ⚠️ 🚫 ⏳) styled
 *   - Print-friendly A4 layout
 *
 * Usage:
 *   node Doc_V2/_scripts/render-docs.mjs                     # render all .md
 *   node Doc_V2/_scripts/render-docs.mjs <path>              # render file/folder
 *
 * Run from project root: c:\Users\debab\Code - Hawkeye\hawkeye-clean
 */
import { fileURLToPath } from "url";
import { dirname, join, basename, relative, resolve } from "path";
import { readFileSync, writeFileSync, statSync, readdirSync } from "fs";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, "..", "..");
const DOCV2_ROOT = resolve(__dirname, "..");
const BACKEND_NODE_MODULES = join(PROJECT_ROOT, "backend", "node_modules");

const requireBackend = createRequire(join(BACKEND_NODE_MODULES, "noop"));
const { chromium } = requireBackend("playwright");
const markedPath = join(BACKEND_NODE_MODULES, "marked", "lib", "marked.esm.js");
const { marked } = await import("file:///" + markedPath.replace(/\\/g, "/"));

// ────────────────────────────────────────────────────────────────────────────
// File walk
// ────────────────────────────────────────────────────────────────────────────

function walkMarkdown(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith("_") || entry === "node_modules") continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walkMarkdown(full, files);
    else if (entry.endsWith(".md")) files.push(full);
  }
  return files;
}

// ────────────────────────────────────────────────────────────────────────────
// Frontmatter parsing (very light, key: value pairs only)
// ────────────────────────────────────────────────────────────────────────────

function parseFrontmatter(md) {
  if (!md.startsWith("---")) return { meta: {}, body: md };
  const end = md.indexOf("\n---", 4);
  if (end === -1) return { meta: {}, body: md };
  const raw = md.slice(4, end).trim();
  const body = md.slice(end + 4).replace(/^\n+/, "");
  const meta = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Za-z_-]+):\s*(.+)$/);
    if (m) meta[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return { meta, body };
}

// ────────────────────────────────────────────────────────────────────────────
// HTML escaping
// ────────────────────────────────────────────────────────────────────────────

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function slugify(text) {
  return String(text).toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ────────────────────────────────────────────────────────────────────────────
// Pre/post processing — simpler + version-safe vs custom marked renderer.
//   1. Pre: replace ```mermaid blocks with HTML placeholders (escaped)
//   2. Run marked normally
//   3. Post: inject heading IDs (and collect TOC), add callout classes,
//      wrap tables in scrollable container, replace mermaid placeholders.
// ────────────────────────────────────────────────────────────────────────────

// Use HTML comment as placeholder — marked passes comments through unchanged,
// and HTML comments contain no markdown-significant characters (no underscores
// to trigger bold, no asterisks, etc.).
const MERMAID_COMMENT = (idx) => `<!--MERMAIDBLOCK:${idx}-->`;
const MERMAID_COMMENT_REGEX = /<!--MERMAIDBLOCK:(\d+)-->/g;

function preprocessMarkdown(md) {
  const mermaidBlocks = [];
  const out = md.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) => {
    const idx = mermaidBlocks.length;
    mermaidBlocks.push(code.trim());
    return `\n\n${MERMAID_COMMENT(idx)}\n\n`;
  });
  return { md: out, mermaidBlocks };
}

function postprocessHtml(html, mermaidBlocks, headings, slugCounts) {
  // 1. Restore mermaid blocks — replace HTML comment placeholders (which marked
  //    leaves alone) with mermaid divs. Comments may be wrapped in <p> or bare.
  html = html.replace(new RegExp(`<p>\\s*${MERMAID_COMMENT_REGEX.source}\\s*</p>`, "g"), (_, idx) => {
    return `<div class="mermaid" data-idx="${idx}">${escapeHtml(mermaidBlocks[Number(idx)])}</div>`;
  });
  // Bare placeholders (not wrapped in <p>)
  html = html.replace(MERMAID_COMMENT_REGEX, (_, idx) => {
    return `<div class="mermaid" data-idx="${idx}">${escapeHtml(mermaidBlocks[Number(idx)])}</div>`;
  });

  // 2. Inject heading IDs + collect TOC
  html = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_, level, text) => {
    const rawText = text.replace(/<[^>]+>/g, "").trim();
    let id = slugify(rawText);
    if (slugCounts[id]) {
      slugCounts[id]++;
      id = `${id}-${slugCounts[id]}`;
    } else {
      slugCounts[id] = 1;
    }
    headings.push({ level: Number(level), text, id });
    return `<h${level} id="${id}">${text}</h${level}>`;
  });

  // 3. Callout blockquotes — detect emoji prefix in first <p>
  html = html.replace(/<blockquote>\s*<p>\s*(?:<strong>)?\s*(⚠️|✅|💡|🚫|⏳|ℹ️|🔔)/g, (match, emoji) => {
    const cls = ({
      "⚠️": "callout warning",
      "✅": "callout success",
      "💡": "callout info",
      "🚫": "callout critical",
      "⏳": "callout pending",
      "ℹ️": "callout info",
      "🔔": "callout info",
    })[emoji] || "callout info";
    return match.replace("<blockquote>", `<blockquote class="${cls}">`);
  });

  // 4. Wrap tables for horizontal scroll
  html = html.replace(/<table>([\s\S]*?)<\/table>/g, '<div class="table-wrap"><table>$1</table></div>');

  return html;
}

// Inline SVG images referenced via markdown ![alt](path.svg) — find <img src="*.svg"> and replace with the SVG content
function inlineSvgs(html, mdPath) {
  const mdDir = dirname(mdPath);
  return html.replace(/<img\s+([^>]*?)src="([^"]+\.svg)"([^>]*?)>/g, (full, before, src, after) => {
    // Resolve path relative to the markdown file's directory
    const svgPath = resolve(mdDir, src);
    let svg;
    try {
      svg = readFileSync(svgPath, "utf8");
    } catch {
      return full; // fall back to img tag if file not readable
    }
    // Extract alt text for caption (if present)
    const altMatch = (before + after).match(/alt="([^"]*)"/);
    const alt = altMatch ? altMatch[1] : "";
    // Wrap the SVG in a container; preserve the SVG's viewBox/aspect ratio
    const cleanSvg = svg.replace(/<\?xml[^>]*\?>\s*/i, "").replace(/<!DOCTYPE[^>]*>\s*/i, "");
    return `<figure class="hero-svg">${cleanSvg}${alt ? `<figcaption>${escapeHtml(alt)}</figcaption>` : ""}</figure>`;
  });
}

// ────────────────────────────────────────────────────────────────────────────
// TOC builder
// ────────────────────────────────────────────────────────────────────────────

function buildToc(headings) {
  if (!headings.length) return "";
  let html = `<nav class="toc"><div class="toc-title">Contents</div><ol>`;
  let lastLevel = 2;
  for (const h of headings) {
    if (h.level === 3 && lastLevel === 2) html += `<ol>`;
    if (h.level === 2 && lastLevel === 3) html += `</ol>`;
    html += `<li><a href="#${h.id}">${stripTags(h.text)}</a></li>`;
    lastLevel = h.level;
  }
  if (lastLevel === 3) html += `</ol>`;
  html += `</ol></nav>`;
  return html;
}

function stripTags(s) {
  return String(s).replace(/<[^>]+>/g, "");
}

// ────────────────────────────────────────────────────────────────────────────
// CSS (the upgraded template)
// ────────────────────────────────────────────────────────────────────────────

const CSS = `
@page { size: A4; margin: 16mm 14mm; }
:root {
  --ink: #0f172a;
  --ink-soft: #334155;
  --dim: #64748b;
  --faint: #94a3b8;
  --border: #e2e8f0;
  --border-soft: #f1f5f9;
  --bg: #ffffff;
  --code-bg: #f1f5f9;
  --pre-bg: #0f172a;
  --pre-ink: #e2e8f0;
  --accent: #2563eb;
  --accent-deep: #1e3a8a;
  --accent-soft: #dbeafe;
  --accent-ink: #1e40af;
  --good: #059669;
  --good-soft: #d1fae5;
  --good-ink: #065f46;
  --warn: #ea580c;
  --warn-soft: #ffedd5;
  --warn-ink: #9a3412;
  --bad: #dc2626;
  --bad-soft: #fee2e2;
  --bad-ink: #991b1b;
  --info-soft: #e0f2fe;
  --info-ink: #075985;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: var(--bg); color: var(--ink); }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 11.5px;
  line-height: 1.55;
  max-width: 920px;
  margin: 0 auto;
  padding: 0 28px 48px;
  -webkit-font-smoothing: antialiased;
}

/* ── COVER PAGE ───────────────────────────────────────── */
section.cover {
  min-height: 240mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 28px 0 24px;
  page-break-after: always;
}
.cover-top {
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 3px solid var(--accent-deep);
  padding-bottom: 14px;
}
.cover-brand-mark {
  width: 28px; height: 28px; border-radius: 6px;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  display: inline-flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 700; font-size: 14px;
}
.cover-brand-text {
  font-weight: 700; color: var(--accent-deep); letter-spacing: 0.05em;
  text-transform: uppercase; font-size: 12px;
}
.cover-center { padding: 60px 0; }
.cover-kicker {
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 11px;
  color: var(--accent);
  font-weight: 700;
  margin-bottom: 16px;
}
.cover-title {
  margin: 0 0 12px 0;
  font-size: 42px;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--ink);
  font-weight: 800;
}
.cover-subtitle {
  margin: 8px 0 0 0;
  font-size: 16px;
  color: var(--dim);
  font-weight: 400;
}
.cover-meta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px 28px;
  margin-top: 64px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}
.cover-meta-item .label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 9.5px;
  color: var(--faint);
  font-weight: 600;
  margin-bottom: 3px;
}
.cover-meta-item .value {
  font-size: 12px;
  color: var(--ink);
  font-weight: 500;
}
.cover-bottom {
  font-size: 10px;
  color: var(--faint);
  text-align: center;
  border-top: 1px solid var(--border-soft);
  padding-top: 12px;
}

/* ── TABLE OF CONTENTS ────────────────────────────────── */
nav.toc {
  background: #fafbfc;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px 20px;
  margin: 18px 0 24px;
  page-break-inside: avoid;
}
.toc-title {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 10.5px;
  color: var(--dim);
  margin-bottom: 10px;
}
nav.toc ol {
  margin: 0; padding-left: 18px;
  font-size: 11px; line-height: 1.7;
}
nav.toc ol ol {
  margin: 2px 0 4px;
  padding-left: 16px;
  font-size: 10.5px;
  color: var(--dim);
}
nav.toc a {
  color: var(--ink-soft);
  text-decoration: none;
}
nav.toc a:hover { color: var(--accent); }
nav.toc li { margin: 1px 0; }

/* ── CONTENT TYPOGRAPHY ───────────────────────────────── */
.content { padding-top: 8px; }
h1, h2, h3, h4 { font-weight: 700; letter-spacing: -0.005em; color: var(--ink); }
.content h1 { font-size: 24px; margin: 32px 0 12px; padding-bottom: 8px; border-bottom: 2px solid var(--ink); }
.content h2 {
  font-size: 17px;
  margin: 28px 0 10px;
  padding-left: 10px;
  border-left: 4px solid var(--accent);
  line-height: 1.3;
}
.content h3 {
  font-size: 13.5px;
  margin: 20px 0 8px;
  color: var(--accent-deep);
}
.content h4 {
  font-size: 11.5px;
  margin: 14px 0 6px;
  color: var(--dim);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
p { margin: 8px 0; }
strong { color: var(--ink); font-weight: 600; }
em { color: var(--ink-soft); font-style: italic; }
a { color: var(--accent); text-decoration: none; border-bottom: 1px dotted var(--accent-soft); }
a:hover { color: var(--accent-deep); border-bottom-style: solid; }
ul, ol { margin: 8px 0 12px; padding-left: 22px; }
li { margin: 4px 0; }
li > p { margin: 2px 0; }
hr { border: 0; border-top: 1px solid var(--border); margin: 28px 0; }

/* ── CALLOUT BLOCKQUOTES ──────────────────────────────── */
blockquote {
  margin: 12px 0;
  padding: 10px 14px 10px 16px;
  border-left: 4px solid var(--accent);
  background: var(--accent-soft);
  color: var(--ink);
  font-size: 11px;
  border-radius: 0 4px 4px 0;
}
blockquote p { margin: 4px 0; }
blockquote.callout.warning { border-left-color: var(--warn); background: var(--warn-soft); color: var(--warn-ink); }
blockquote.callout.success { border-left-color: var(--good); background: var(--good-soft); color: var(--good-ink); }
blockquote.callout.critical { border-left-color: var(--bad); background: var(--bad-soft); color: var(--bad-ink); }
blockquote.callout.pending { border-left-color: var(--dim); background: var(--border-soft); color: var(--dim); }
blockquote.callout.info { border-left-color: var(--accent); background: var(--info-soft); color: var(--info-ink); }

/* ── CODE ─────────────────────────────────────────────── */
code {
  font-family: "SF Mono", Menlo, Consolas, monospace;
  font-size: 10.5px;
  background: var(--code-bg);
  padding: 1px 5px;
  border-radius: 3px;
  color: #1e293b;
  white-space: nowrap;
}
pre {
  background: var(--pre-bg);
  color: var(--pre-ink);
  padding: 14px 16px;
  border-radius: 6px;
  overflow-x: auto;
  font-family: "SF Mono", Menlo, Consolas, monospace;
  font-size: 10px;
  line-height: 1.5;
  page-break-inside: avoid;
}
pre code { background: transparent; padding: 0; color: inherit; font-size: inherit; white-space: pre; }

/* ── TABLES ───────────────────────────────────────────── */
.table-wrap { overflow-x: auto; margin: 12px 0; }
table {
  border-collapse: collapse;
  width: 100%;
  font-size: 10.5px;
  page-break-inside: avoid;
  background: #fff;
}
th, td {
  border: 1px solid var(--border);
  padding: 7px 10px;
  text-align: left;
  vertical-align: top;
  line-height: 1.45;
}
th {
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  font-weight: 600;
  color: var(--ink);
  text-transform: uppercase;
  font-size: 9.5px;
  letter-spacing: 0.04em;
}
tr:nth-child(even) td { background: #fafbfc; }
td code { font-size: 10px; }

/* ── MERMAID (rendered SVG baked into page) ─────────── */
.mermaid {
  margin: 20px 0;
  padding: 20px 18px;
  background: linear-gradient(180deg, #FAFBFC 0%, #F1F5F9 100%);
  border: 1px solid #CBD5E1;
  border-radius: 8px;
  text-align: center;
  page-break-inside: avoid;
  overflow-x: auto;
  box-shadow: 0 1px 3px rgba(15, 32, 66, 0.04), 0 1px 2px rgba(15, 32, 66, 0.06);
}
.mermaid svg { max-width: 100% !important; height: auto !important; display: inline-block; }
/* Stronger node strokes for AWS-poster feel */
.mermaid svg .node rect,
.mermaid svg .node circle,
.mermaid svg .node polygon { stroke-width: 1.5px !important; }
.mermaid svg .edgePath .path { stroke-width: 1.5px !important; }
.mermaid svg .cluster rect { stroke-dasharray: none !important; fill-opacity: 0.6 !important; }
/* Hide raw mermaid source if Playwright pre-render failed */
.mermaid:not(:has(svg)) {
  background: #fef3c7;
  color: #92400e;
  font-family: "SF Mono", Menlo, Consolas, monospace;
  font-size: 10px;
  text-align: left;
  white-space: pre-wrap;
}

/* ── DIAGRAM CAPTION (markdown convention: italic line after mermaid block) ── */
.mermaid + p > em:only-child {
  display: block;
  text-align: center;
  font-size: 10.5px;
  color: var(--dim);
  margin-top: -10px;
  margin-bottom: 18px;
  font-style: normal;
}

/* ── HERO SVG (hand-crafted, inlined via ![alt](*.svg)) ── */
figure.hero-svg {
  margin: 24px 0;
  padding: 0;
  text-align: center;
  page-break-inside: avoid;
  box-shadow: 0 2px 8px rgba(15, 32, 66, 0.08), 0 1px 3px rgba(15, 32, 66, 0.06);
  border-radius: 8px;
  overflow: hidden;
  background: #FFFFFF;
}
figure.hero-svg svg {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 0 auto;
}
figure.hero-svg figcaption {
  text-align: center;
  font-size: 10.5px;
  color: var(--dim);
  padding: 10px 16px;
  border-top: 1px solid var(--border);
  background: #FAFBFC;
}

/* ── STATUS BADGES (inline in text) ───────────────────── */
.content :is(p, td, li) { /* keep status emojis at natural size */ }

/* ── FOOTER ───────────────────────────────────────────── */
footer.doc-footer {
  margin-top: 40px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  font-size: 9.5px;
  color: var(--faint);
  display: flex;
  justify-content: space-between;
}

/* ── PRINT ────────────────────────────────────────────── */
@media print {
  body { padding: 0; max-width: none; }
  section.cover { min-height: 240mm; }
  .content h1, .content h2, .content h3 { page-break-after: avoid; }
  pre, table, .mermaid { page-break-inside: avoid; }
  a { color: var(--ink); border-bottom: none; }
  nav.toc { background: #fff; }
}
`;

// ────────────────────────────────────────────────────────────────────────────
// Cover page builder
// ────────────────────────────────────────────────────────────────────────────

function buildCover({ title, subtitle, kicker, meta, relPath, now }) {
  const version = meta.Version || meta.version || "0.1 DRAFT";
  const owner = meta.Owner || meta.owner || "Hawkeye Platform";
  const status = meta.Status || meta.status || "DRAFT";
  return `<section class="cover">
  <div>
    <div class="cover-top">
      <div class="cover-brand-mark">H</div>
      <div class="cover-brand-text">Hawkeye Doc_V2</div>
    </div>
    <div class="cover-center">
      <div class="cover-kicker">${escapeHtml(kicker)}</div>
      <h1 class="cover-title">${escapeHtml(title)}</h1>
      ${subtitle ? `<div class="cover-subtitle">${escapeHtml(subtitle)}</div>` : ""}
    </div>
    <div class="cover-meta-grid">
      <div class="cover-meta-item"><div class="label">Version</div><div class="value">${escapeHtml(version)}</div></div>
      <div class="cover-meta-item"><div class="label">Status</div><div class="value">${escapeHtml(status)}</div></div>
      <div class="cover-meta-item"><div class="label">Owner</div><div class="value">${escapeHtml(owner)}</div></div>
      <div class="cover-meta-item"><div class="label">Rendered</div><div class="value">${escapeHtml(now)}</div></div>
    </div>
  </div>
  <div class="cover-bottom">${escapeHtml(relPath)}</div>
</section>`;
}

// ────────────────────────────────────────────────────────────────────────────
// Full HTML builder
// ────────────────────────────────────────────────────────────────────────────

function buildHtml({ title, kicker, subtitle, meta, relPath, bodyHtml, tocHtml, now }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <meta name="generator" content="Doc_V2 render-docs.mjs v3 (baked SVG)">
  <style>${CSS}</style>
</head>
<body>
  ${buildCover({ title, subtitle, kicker, meta, relPath, now })}
  ${tocHtml}
  <main class="content">
    ${bodyHtml}
  </main>
  <footer class="doc-footer">
    <span>Hawkeye Documentation · Doc_V2</span>
    <span>${escapeHtml(relPath)} · ${escapeHtml(now)}</span>
  </footer>
</body>
</html>`;
}

function inferMeta(mdPath, mdContent) {
  const rel = relative(DOCV2_ROOT, mdPath).replace(/\\/g, "/");
  const parts = rel.split("/");
  const titleMatch = mdContent.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim().replace(/^[—–-]\s*/, "").replace(/^.*?—\s*/, "") : basename(mdPath, ".md");
  const fullTitle = titleMatch ? titleMatch[1].trim() : basename(mdPath, ".md");
  // Kicker = folder breadcrumb
  const kicker = parts.slice(0, -1).join(" · ") || "Doc_V2";
  // Subtitle from first non-empty paragraph (skip frontmatter table)
  let subtitle = "";
  return { title, fullTitle, kicker, rel, subtitle };
}

function stripFirstH1(html) {
  return html.replace(/<h1[^>]*>[^<]*<\/h1>/, "");
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────

async function main() {
  const arg = process.argv[2];
  let files;
  if (arg) {
    const target = resolve(DOCV2_ROOT, arg);
    const st = statSync(target);
    if (st.isDirectory()) files = walkMarkdown(target);
    else if (target.endsWith(".md")) files = [target];
    else { console.error("Path must be a directory or .md file:", target); process.exit(1); }
  } else {
    files = walkMarkdown(DOCV2_ROOT);
  }

  if (!files.length) { console.log("No markdown files found."); return; }
  console.log(`Found ${files.length} markdown file(s) to render.`);

  marked.setOptions({ gfm: true, breaks: false, mangle: false });

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1100, height: 1400 } });
  const page = await context.newPage();

  // Read local mermaid bundle (loaded via Playwright addScriptTag, NOT inlined to keep HTML small)
  const mermaidJsPath = join(__dirname, "mermaid.min.js");
  const hasMermaidLocal = (() => { try { statSync(mermaidJsPath); return true; } catch { return false; } })();
  if (!hasMermaidLocal) {
    console.warn(`[warn] mermaid.min.js not found at ${mermaidJsPath} — diagrams will render as text`);
  }

  const now = new Date().toISOString().slice(0, 10);
  let okCount = 0;

  for (const mdPath of files) {
    try {
      const raw = readFileSync(mdPath, "utf8");
      const { meta: fm, body: bodyMd } = parseFrontmatter(raw);
      const meta = inferMeta(mdPath, bodyMd);

      const headings = [];
      const slugCounts = {};
      const { md: prepped, mermaidBlocks } = preprocessMarkdown(bodyMd);
      const rawHtml = marked.parse(prepped);
      const postprocessed = postprocessHtml(rawHtml, mermaidBlocks, headings, slugCounts);
      const processed = inlineSvgs(postprocessed, mdPath);
      const bodyHtml = stripFirstH1(processed);
      const tocHtml = buildToc(headings);

      const html = buildHtml({ ...meta, bodyHtml, tocHtml, now, meta: fm });

      const htmlPath = mdPath.replace(/\.md$/, ".html");
      const pdfPath = mdPath.replace(/\.md$/, ".pdf");

      // Load into Playwright and bake mermaid SVGs into the DOM
      await page.setContent(html, { waitUntil: "load" });

      if (mermaidBlocks.length > 0 && hasMermaidLocal) {
        // Inject mermaid script
        await page.addScriptTag({ path: mermaidJsPath });
        // Initialize + render all diagrams — AWS-adjacent professional theme
        await page.evaluate(async () => {
          // eslint-disable-next-line no-undef
          window.mermaid.initialize({
            startOnLoad: false,
            theme: "base",
            securityLevel: "loose",
            flowchart: {
              useMaxWidth: true,
              htmlLabels: true,
              curve: "linear",
              padding: 18,
              nodeSpacing: 50,
              rankSpacing: 60,
              diagramPadding: 12,
            },
            er: { useMaxWidth: true, layoutDirection: "TB", entityPadding: 12 },
            sequence: { useMaxWidth: true, wrap: true, mirrorActors: false, boxMargin: 10 },
            stateDiagram: { useMaxWidth: true, padding: 18 },
            journey: { useMaxWidth: true, leftMargin: 100 },
            gantt: { useMaxWidth: true, leftPadding: 100, gridLineStartPadding: 50 },
            themeVariables: {
              // AWS-adjacent palette: deep navy + service blue + amber accent
              fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Inter,sans-serif",
              fontSize: "13px",

              // Primary (used for default node fill / border)
              primaryColor: "#EFF6FF",          // very light blue background
              primaryTextColor: "#0F2042",       // deep navy text
              primaryBorderColor: "#1E3A6E",     // deep navy border
              lineColor: "#475569",              // slate gray edges
              secondaryColor: "#F1F5F9",         // light slate (alt nodes)
              tertiaryColor: "#FAFBFC",          // near-white (sub-clusters)
              tertiaryBorderColor: "#CBD5E1",
              tertiaryTextColor: "#334155",

              // Cluster (subgraph) styling — AWS "service group" feel
              clusterBkg: "#FCFDFE",
              clusterBorder: "#CBD5E1",
              titleColor: "#1E3A6E",

              // Edge labels
              edgeLabelBackground: "#FFFFFF",

              // Notes
              noteBkgColor: "#FFF7E6",
              noteBorderColor: "#F59E0B",
              noteTextColor: "#7C2D12",

              // ER diagram
              attributeBackgroundColorOdd: "#F8FAFC",
              attributeBackgroundColorEven: "#FFFFFF",

              // State diagram
              labelBoxBkgColor: "#EFF6FF",
              labelBoxBorderColor: "#1E3A6E",
              labelTextColor: "#0F2042",

              // Sequence
              actorBkg: "#1E3A6E",
              actorBorder: "#0F2042",
              actorTextColor: "#FFFFFF",
              actorLineColor: "#475569",
              signalColor: "#1E3A6E",
              signalTextColor: "#0F2042",
              labelBoxBkgColor: "#EFF6FF",
              activationBkgColor: "#FF9900",   // AWS amber for activation bars
              activationBorderColor: "#B45309",
            },
          });
          // eslint-disable-next-line no-undef
          await window.mermaid.run({ querySelector: ".mermaid" });
        });
        // Allow SVG layout to settle
        await page.waitForTimeout(200);
      }

      // Get the post-rendered HTML (with SVGs baked in) and write it
      const renderedHtml = await page.content();
      writeFileSync(htmlPath, renderedHtml, "utf8");

      // PDF from the same rendered page
      await page.emulateMedia({ media: "print" });
      await page.pdf({
        path: pdfPath,
        format: "A4",
        margin: { top: "14mm", right: "12mm", bottom: "14mm", left: "12mm" },
        printBackground: true,
      });

      console.log(`  ✓ ${relative(DOCV2_ROOT, mdPath).replace(/\\/g, "/")} → .html + .pdf (${mermaidBlocks.length} diagram${mermaidBlocks.length === 1 ? "" : "s"})`);
      okCount++;
    } catch (err) {
      console.error(`  ✗ ${mdPath}:`, err.message);
    }
  }

  await browser.close();
  console.log(`\nDone. ${okCount}/${files.length} rendered.`);
}

main().catch((err) => { console.error("Fatal:", err); process.exit(1); });
