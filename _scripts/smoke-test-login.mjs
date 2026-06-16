// Smoke test: confirm we can login to the deployed app + take screenshots.
// Run from: cd backend && node ../Doc_V2/_scripts/smoke-test-login.mjs

import { createRequire } from "module";
import { mkdirSync } from "fs";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BACKEND_NM = resolve(__dirname, "../../backend/node_modules");
const requireBackend = createRequire(join(BACKEND_NM, "noop"));
const { chromium } = requireBackend("playwright");

const URL = "https://hawkeye-frontend-dev-chi.vercel.app/audits";
const EMAIL = process.env.TEST_EMAIL || "buyer1@test.com";
const PASSWORD = process.env.TEST_PASSWORD || "Testing@2022";

const SHOT_DIR = resolve(
  process.cwd(),
  "../Doc_V2/06-modules/audit-management/screenshots"
);
mkdirSync(SHOT_DIR, { recursive: true });

const shot = (page, name) =>
  page.screenshot({ path: `${SHOT_DIR}/smoke_${name}.png`, fullPage: true });

const log = (...args) => console.log("[smoke]", ...args);

const main = async () => {
  log("launching chromium...");
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  });
  const page = await ctx.newPage();

  // collect console + network errors so we know if anything blows up silently
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("requestfailed", (r) =>
    errors.push(`reqfailed: ${r.url()} → ${r.failure()?.errorText}`)
  );

  log(`navigating to ${URL} ...`);
  await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });

  log(`landed at: ${page.url()}`);
  log(`title: ${await page.title()}`);
  await shot(page, "01_landing");

  // detect login form
  const emailInput = await page
    .locator('input[type="email"], input[name="email"]')
    .first();
  const passwordInput = await page
    .locator('input[type="password"], input[name="password"]')
    .first();
  const submitButton = await page
    .locator(
      'button:has-text("Sign in"), button:has-text("Login"), button[type="submit"]'
    )
    .first();

  if ((await emailInput.count()) === 0) {
    log("⚠️  no email input found on landing page");
    log(`errors collected: ${JSON.stringify(errors, null, 2)}`);
    await browser.close();
    process.exit(2);
  }

  // capture every login API response to see what server says
  const loginResponses = [];
  page.on("response", async (r) => {
    const u = r.url();
    if (/login|signin|auth/i.test(u) && r.request().method() === "POST") {
      let body = "";
      try { body = (await r.text()).slice(0, 400); } catch {}
      loginResponses.push({ url: u, status: r.status(), body });
    }
  });

  log(`filling credentials: ${EMAIL} / ${PASSWORD} ...`);
  await emailInput.fill(EMAIL);
  await passwordInput.fill(PASSWORD);
  await shot(page, "02_credentials_filled");

  log("clicking submit...");
  await submitButton.click();
  await page.waitForTimeout(4000);

  log(`post-submit URL: ${page.url()}`);
  log(`post-submit title: ${await page.title()}`);
  await shot(page, "03_post_login");

  // look for telltale signs we landed in the app
  const indicators = {
    audits_link: await page
      .locator('a[href*="/audits"], a:has-text("Audit")')
      .count(),
    sidebar: await page.locator("aside, nav").count(),
    error_visible: await page
      .locator(
        '[role="alert"], .error, .toast:has-text("Invalid"), :has-text("Invalid credentials"), :has-text("error")'
      )
      .first()
      .isVisible()
      .catch(() => false),
    body_text_sample: (await page.textContent("body"))?.slice(0, 400) ?? "",
  };

  log("indicators:", JSON.stringify(indicators, null, 2));
  log("login API responses:", JSON.stringify(loginResponses, null, 2));

  // grab any visible error message text
  const errorText = await page
    .locator('[role="alert"], .Toastify__toast--error, .MuiAlert-message')
    .first()
    .textContent()
    .catch(() => null);
  log("visible error text:", errorText);

  if (errors.length) log("page errors:", errors);

  await browser.close();
  log("done.");
};

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
