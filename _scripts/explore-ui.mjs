// Explore the deployed dev app after login to map the audit-module UI:
//   - dashboard layout, navigation to Audits, "create audit" flow,
//     questionnaire template selector (find Template 3), supplier selection.
// Save screenshots + dump page outlines so we know what selectors the capture script needs.

import { createRequire } from "module";
import { mkdirSync, writeFileSync } from "fs";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BACKEND_NM = resolve(__dirname, "../../backend/node_modules");
const requireBackend = createRequire(join(BACKEND_NM, "noop"));
const { chromium } = requireBackend("playwright");

const BASE = "https://hawkeye-frontend-dev-chi.vercel.app";
const EMAIL = "buyer1@test.com";
const PWD = "Testing@2022";

const SHOTS = resolve(__dirname, "../06-modules/audit-management/screenshots");
mkdirSync(SHOTS, { recursive: true });
const shot = (page, name) =>
  page.screenshot({ path: `${SHOTS}/explore_${name}.png`, fullPage: true });

const log = (...a) => console.log("[explore]", ...a);

const summarize = async (page, name) => {
  const nav = await page.evaluate(() => {
    const navItems = Array.from(
      document.querySelectorAll("nav a, aside a, [role='navigation'] a")
    )
      .map((a) => ({
        text: a.textContent?.trim().slice(0, 60),
        href: a.getAttribute("href"),
      }))
      .filter((x) => x.text && x.text.length > 0);
    const buttons = Array.from(document.querySelectorAll("button"))
      .map((b) => b.textContent?.trim().slice(0, 60))
      .filter((t) => t && t.length > 0)
      .slice(0, 50);
    const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4"))
      .map((h) => `${h.tagName}: ${h.textContent?.trim().slice(0, 100)}`)
      .filter((t) => t.length > 5);
    const inputs = Array.from(document.querySelectorAll("input, select, textarea"))
      .map((i) => ({
        tag: i.tagName,
        type: i.getAttribute("type"),
        name: i.getAttribute("name"),
        placeholder: i.getAttribute("placeholder"),
        ariaLabel: i.getAttribute("aria-label"),
      }))
      .slice(0, 30);
    return {
      url: window.location.href,
      title: document.title,
      navItems,
      buttons,
      headings,
      inputs,
    };
  });
  log(`\n--- ${name} ---`);
  log(`URL: ${nav.url}`);
  log(`Headings: ${nav.headings.slice(0, 6).join(" | ")}`);
  log(`Top buttons: ${nav.buttons.slice(0, 12).join(" | ")}`);
  writeFileSync(`${SHOTS}/explore_${name}_outline.json`, JSON.stringify(nav, null, 2));
};

const login = async (page) => {
  await page.goto(`${BASE}/audits`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(4000);
  // Try multiple selector strategies
  const emailSel = page
    .locator('input[type="email"], input[name="email"], input[placeholder*="mail" i]')
    .first();
  await emailSel.waitFor({ state: "attached", timeout: 30000 });
  await shot(page, "00_login_seen");
  await emailSel.fill(EMAIL);
  const pwdSel = page
    .locator('input[type="password"], input[name="password"]')
    .first();
  await pwdSel.fill(PWD);
  const submitBtn = page
    .locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Login")')
    .first();
  await submitBtn.click();
  await page.waitForURL(/dashboard|audits|onboard/, { timeout: 30000 }).catch(() => null);
  await page.waitForTimeout(3500);
};

const main = async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  log("login...");
  await login(page);
  await shot(page, "01_dashboard");
  await summarize(page, "01_dashboard");

  log("navigate /audits...");
  await page.goto(`${BASE}/audits`, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(2500);
  await shot(page, "02_audits_landing");
  await summarize(page, "02_audits_landing");

  const newBtn = page
    .locator(
      'button:has-text("New Audit"), button:has-text("Create Audit"), button:has-text("Create"), button:has-text("New Request"), a:has-text("New Audit"), a:has-text("Create Audit"), [data-testid*="new-audit"]'
    )
    .first();
  if (await newBtn.count()) {
    log("click new audit...");
    await newBtn.click();
    await page.waitForTimeout(3500);
    await shot(page, "03_new_audit_form");
    await summarize(page, "03_new_audit_form");
  } else {
    log("no 'New Audit' button found on /audits landing");
  }

  for (const path of [
    "/buyer-dashboard",
    "/audit-requests",
    "/audits/new",
    "/audits/create",
    "/audits/request",
    "/buyer/audits",
    "/buyer/audits/new",
  ]) {
    try {
      await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 12000 });
      await page.waitForTimeout(1500);
      const name = path.replace(/[/-]/g, "_").slice(1) || "root";
      await shot(page, `alt_${name}`);
      await summarize(page, `alt_${name}`);
    } catch (e) {
      log(`could not visit ${path}:`, e.message);
    }
  }

  await browser.close();
  log("\nexplore done. screenshots + outlines in:", SHOTS);
};

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
