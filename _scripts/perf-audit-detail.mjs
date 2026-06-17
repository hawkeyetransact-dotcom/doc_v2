// Performance profile: login as buyer1, time /audits and the audit-details page,
// capture every API call duration, payload size, status. Report timing waterfall.

import { createRequire } from "module";
import { mkdirSync, writeFileSync } from "fs";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BACKEND_NM = resolve(__dirname, "../../backend/node_modules");
const requireBackend = createRequire(join(BACKEND_NM, "noop"));
const { chromium } = requireBackend("playwright");

const BASE = "https://hawkeye-frontend-dev-chi.vercel.app";
const SHOTS = resolve(__dirname, "../06-modules/audit-management/screenshots");
mkdirSync(SHOTS, { recursive: true });
const out = (n) => `${SHOTS}/perf_${n}.png`;
const log = (...a) => console.log("[perf]", ...a);

const login = async (page) => {
  await page.goto(`${BASE}/audits`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(3000);
  const email = page.locator('input[type="email"], input[name="email"]').first();
  await email.waitFor({ state: "attached", timeout: 30000 });
  await email.fill("buyer1@test.com");
  await page.locator('input[type="password"]').first().fill("Testing@2022");
  await page.locator('button[type="submit"]').first().click();
  await page.waitForURL(/dashboard|audits/, { timeout: 30000 }).catch(() => null);
  await page.waitForTimeout(3500);
};

const profile = async (page, label, action) => {
  const apiCalls = [];
  const responseHandler = async (r) => {
    try {
      const u = r.url();
      const req = r.request();
      const timing = r.request().timing?.() || {};
      apiCalls.push({
        url: u,
        method: req.method(),
        status: r.status(),
        contentType: r.headers()["content-type"] || "",
        contentLengthBytes: parseInt(r.headers()["content-length"] || "0", 10),
        timing,
        when: Date.now(),
      });
    } catch {}
  };
  page.on("response", responseHandler);

  const start = Date.now();
  await action();
  const elapsed = Date.now() - start;
  page.off("response", responseHandler);

  // Browser perf timing
  const navTiming = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    if (!nav) return null;
    return {
      dnsMs: nav.domainLookupEnd - nav.domainLookupStart,
      tcpMs: nav.connectEnd - nav.connectStart,
      requestMs: nav.responseStart - nav.requestStart,
      responseMs: nav.responseEnd - nav.responseStart,
      domContentLoadedMs: nav.domContentLoadedEventEnd - nav.startTime,
      loadEventMs: nav.loadEventEnd - nav.startTime,
      ttfbMs: nav.responseStart - nav.startTime,
    };
  });

  const apiOnly = apiCalls.filter(
    (c) =>
      /\/api\/|backend-dev/i.test(c.url) ||
      c.contentType.includes("application/json")
  );
  const totalBytes = apiCalls.reduce((s, c) => s + (c.contentLengthBytes || 0), 0);

  log(`\n=== ${label} (${elapsed}ms wall-clock) ===`);
  log(`navTiming:`, JSON.stringify(navTiming));
  log(`total responses: ${apiCalls.length}, API/JSON responses: ${apiOnly.length}`);
  log(`total content-length: ${(totalBytes / 1024).toFixed(1)} KB`);
  log(`\nAPI calls (sorted by URL pattern):`);

  // Group by URL pattern (strip ids)
  const grouped = {};
  for (const c of apiOnly) {
    const u = new URL(c.url).pathname.replace(/\/[a-f0-9]{24}/gi, "/:id");
    if (!grouped[u]) grouped[u] = [];
    grouped[u].push(c);
  }
  for (const [u, calls] of Object.entries(grouped).sort()) {
    const dur = calls.map((c) => Math.round(c.timing.responseEnd || 0));
    log(`  [${calls.length}x] ${calls[0].method} ${u} → ${calls[0].status} · sample resp times: ${dur.slice(0, 5).join(",")}ms · ${calls.reduce((s, c) => s + (c.contentLengthBytes || 0), 0)} bytes total`);
  }

  writeFileSync(
    `${SHOTS}/perf_${label}_calls.json`,
    JSON.stringify({ label, elapsed, navTiming, apiOnly }, null, 2)
  );
};

const main = async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    // Throttle to a moderate network so we see real-world numbers
  });
  const page = await ctx.newPage();

  log("[STEP 0] cold login...");
  const loginStart = Date.now();
  await login(page);
  log(`[STEP 0] login done in ${Date.now() - loginStart}ms`);

  log("\n[STEP 1] navigate /audits (audit list)...");
  await profile(page, "audits_list_warm", async () => {
    await page.goto(`${BASE}/audits`, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(2000);
  });
  await page.screenshot({ path: out("01_audits_list"), fullPage: true });

  log("\n[STEP 2] navigate /audits/new (audit details — primary slow page)...");
  await profile(page, "audit_details_new", async () => {
    await page.goto(`${BASE}/audits/new`, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(3000);
  });
  await page.screenshot({ path: out("02_audit_details_new"), fullPage: true });

  log("\n[STEP 3] re-navigate /audits/new (warm cache)...");
  await profile(page, "audit_details_warm", async () => {
    await page.goto(`${BASE}/audits/new`, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(3000);
  });

  await browser.close();
  log("\nperf-profile done. JSON dumps in:", SHOTS);
};

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
