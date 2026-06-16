// Explore the 3 top dropdowns to map the create-audit entry point
// + capture the waited /audits/new page once skeletons resolve

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
const shot = (p, n) => p.screenshot({ path: `${SHOTS}/dd_${n}.png`, fullPage: true });
const log = (...a) => console.log("[dd]", ...a);

const login = async (page, email = "buyer1@test.com", pwd = "Testing@2022") => {
  await page.goto(`${BASE}/audits`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(4000);
  const emailSel = page.locator('input[type="email"], input[name="email"]').first();
  await emailSel.waitFor({ state: "attached", timeout: 30000 });
  await emailSel.fill(email);
  await page.locator('input[type="password"]').first().fill(pwd);
  await page.locator('button[type="submit"]').first().click();
  await page.waitForURL(/dashboard|audits/, { timeout: 30000 }).catch(() => null);
  await page.waitForTimeout(3500);
};

const dump = async (page, name) => {
  const summary = await page.evaluate(() => ({
    url: location.href,
    title: document.title,
    h: Array.from(document.querySelectorAll("h1,h2,h3,h4,h5"))
      .map((x) => `${x.tagName}: ${x.textContent?.trim().slice(0, 80)}`)
      .filter((s) => s.length > 5),
    visibleLinks: Array.from(document.querySelectorAll("a"))
      .filter((a) => a.offsetParent !== null)
      .map((a) => ({ t: a.textContent?.trim().slice(0, 60), h: a.getAttribute("href") }))
      .filter((x) => x.t && x.t.length > 0)
      .slice(0, 50),
    visibleButtons: Array.from(document.querySelectorAll("button"))
      .filter((b) => b.offsetParent !== null)
      .map((b) => b.textContent?.trim().slice(0, 60))
      .filter((t) => t && t.length > 0)
      .slice(0, 50),
    selectOpts: Array.from(document.querySelectorAll("select option, [role='option'], [role='listbox'] li"))
      .map((o) => o.textContent?.trim().slice(0, 80))
      .filter((s) => s && s.length > 0)
      .slice(0, 30),
  }));
  writeFileSync(`${SHOTS}/dd_${name}.json`, JSON.stringify(summary, null, 2));
  log(`${name}: ${summary.url}`);
  log(`  H: ${summary.h.slice(0, 4).join(" | ")}`);
  log(`  Buttons: ${summary.visibleButtons.slice(0, 8).join(" | ")}`);
  log(`  Links: ${summary.visibleLinks.slice(0, 6).map((l) => `${l.t}(${l.h})`).join(" | ")}`);
};

const main = async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  log("login...");
  await login(page);
  await page.waitForTimeout(2000);
  await shot(page, "00_logged_in");
  await dump(page, "00_logged_in");

  // hover each of the 3 nav dropdowns and capture
  for (const label of ["MARKETPLACE", "SUPPLIER COLLABORATION", "EQMS"]) {
    log(`hover ${label}...`);
    try {
      // hover on the menu item that contains this label
      const trigger = page.locator(`button:has-text("${label}")`).first();
      if (await trigger.count()) {
        await trigger.hover();
        await page.waitForTimeout(1500);
        await shot(page, `dropdown_${label.replace(/\s/g, "_").toLowerCase()}`);
        await dump(page, `dropdown_${label.replace(/\s/g, "_").toLowerCase()}`);
        // try clicking instead
        await trigger.click({ force: true });
        await page.waitForTimeout(1500);
        await shot(page, `dropdown_${label.replace(/\s/g, "_").toLowerCase()}_click`);
        await dump(page, `dropdown_${label.replace(/\s/g, "_").toLowerCase()}_click`);
      }
    } catch (e) {
      log(`failed: ${e.message}`);
    }
    // close any open menu by pressing escape
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
  }

  // Now revisit /audits/new and wait long for skeletons to resolve
  log("visit /audits/new with longer wait...");
  await page.goto(`${BASE}/audits/new`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(8000);
  await shot(page, "new_audit_after_long_wait");
  await dump(page, "new_audit_after_long_wait");

  // try /audits with the green "+" / FAB or any other create entry that may be JS-rendered
  log("revisit /audits with FAB scan...");
  await page.goto(`${BASE}/audits`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(5000);
  await shot(page, "audits_after_wait");
  await dump(page, "audits_after_wait");

  // Hover top right + click the "+" or sparkle/floating actions if any
  // Search for any element with aria-label containing "create" / "new" / "add"
  const allAddElements = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[aria-label*="create" i], [aria-label*="new" i], [aria-label*="add" i], [title*="create" i], [title*="new" i]'))
      .map((e) => ({ label: e.getAttribute("aria-label") || e.getAttribute("title"), tag: e.tagName }))
      .slice(0, 20)
  );
  log("ADD elements:", JSON.stringify(allAddElements));

  await browser.close();
  log("done");
};

main().catch((err) => { console.error("FATAL:", err); process.exit(1); });
