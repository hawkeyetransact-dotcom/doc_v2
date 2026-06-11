/**
 * urs-to-excel.mjs — generate Excel URS files from markdown URS source-of-truth.
 *
 * Outputs:
 *   - Doc_V2/06-modules/audit-management/URS.xlsx (single-sheet audit URS)
 *   - Doc_V2/06-modules/EQMS-URS.xlsx (workbook: Summary + one sheet per EQMS module)
 *
 * Run from project root:
 *   node Doc_V2/_scripts/urs-to-excel.mjs
 *
 * Source: each `Doc_V2/06-modules/<module>/URS.md` markdown file (single source of truth).
 * Format: parses any `| URS-X-NNN | ... |` markdown table, captures section + subsection context.
 */
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";
import { readFileSync, statSync } from "fs";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, "..", "..");
const DOCV2_ROOT = resolve(__dirname, "..");
const MODULES_ROOT = join(DOCV2_ROOT, "06-modules");

// Resolve exceljs from /tmp install or from backend node_modules
const exceljsPath = (() => {
  const candidates = [
    "C:/Users/debab/AppData/Local/Temp/hawkeye-cleanup/exceljs-install/node_modules/exceljs",
    join(PROJECT_ROOT, "backend", "node_modules", "exceljs"),
  ];
  for (const c of candidates) {
    try { statSync(c); return c; } catch {}
  }
  throw new Error("exceljs not found; install with: npm install --prefix /tmp/hawkeye-cleanup/exceljs-install exceljs");
})();
const requireExcel = createRequire(join(exceljsPath, "noop"));
const ExcelJS = requireExcel(exceljsPath);

// ────────────────────────────────────────────────────────────────────────────
// Markdown URS table parser
// ────────────────────────────────────────────────────────────────────────────

function parseURS(md) {
  const requirements = [];
  let currentSection = "";
  let currentSubsection = "";
  let inTable = false;
  let tableHeaders = [];

  const lines = md.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Section (## 3. Part A — ...)
    if (/^## /.test(line)) {
      currentSection = line.replace(/^##\s+/, "").trim();
      inTable = false;
      continue;
    }

    // Subsection (### A1. ...)
    if (/^### /.test(line)) {
      currentSubsection = line.replace(/^###\s+/, "").trim();
      inTable = false;
      continue;
    }

    // Detect a markdown table header row (followed by separator row)
    if (line.startsWith("|") && i + 1 < lines.length && /^\|[\s\|:\-]+\|$/.test(lines[i + 1])) {
      tableHeaders = line.split("|").slice(1, -1).map((s) => s.trim());
      inTable = true;
      i++; // skip separator
      continue;
    }

    // Table row
    if (inTable && line.startsWith("|") && !/^\|[\s\|:\-]+\|$/.test(line)) {
      const cells = line.split("|").slice(1, -1).map((s) => s.trim());
      const firstCell = cells[0] || "";
      const idMatch = firstCell.match(/URS-[AB]-\d+/);
      if (idMatch) {
        const req = {
          id: idMatch[0],
          tier: idMatch[0].includes("-A-") ? "Foundational (Part A)" : "Differentiator (Part B)",
          section: currentSection,
          subsection: currentSubsection,
        };
        tableHeaders.forEach((h, idx) => {
          // Normalize cell text — strip backticks for cleaner Excel display
          let v = cells[idx] || "";
          // Don't strip markdown bold ** because it has semantic meaning
          req[h] = v;
        });
        requirements.push(req);
      }
      continue;
    }

    // Exit table on non-table line
    if (inTable && !line.startsWith("|")) {
      inTable = false;
    }
  }

  return requirements;
}

// ────────────────────────────────────────────────────────────────────────────
// Module metadata
// ────────────────────────────────────────────────────────────────────────────

const ALL_MODULES = [
  { slug: "audit-management",          name: "Audit Management",          owner: "buyer + auditor + supplier" },
  { slug: "capa",                       name: "CAPA",                       owner: "QA Head" },
  { slug: "deviation",                  name: "Deviation",                  owner: "Production + QA" },
  { slug: "change-control",             name: "Change Control",             owner: "Initiator + QA" },
  { slug: "document-control",           name: "Document Control",           owner: "Doc Control Officer" },
  { slug: "batch-records",              name: "Batch Records",              owner: "Production + QP" },
  { slug: "complaint-management",       name: "Complaint Management",       owner: "Customer Service + QA" },
  { slug: "risk-management",            name: "Risk Management",            owner: "Risk Manager" },
  { slug: "training",                   name: "Training",                   owner: "HR + QA" },
  { slug: "equipment-management",       name: "Equipment Management",       owner: "Maintenance + QA" },
  { slug: "management-review",          name: "Management Review (MRM)",    owner: "VP Quality" },
  { slug: "design-control",             name: "Design Control",             owner: "R&D + QA (med-device)" },
  { slug: "supplier-prequalification",  name: "Supplier Prequalification",  owner: "Procurement + QA" },
];

// EQMS = the QMS modules (everything except audit-management which gets its own file)
const EQMS_MODULES = ALL_MODULES.filter((m) => m.slug !== "audit-management");

// ────────────────────────────────────────────────────────────────────────────
// Excel writer
// ────────────────────────────────────────────────────────────────────────────

const COLOR = {
  navy: "FF1E3A6E",
  navyDark: "FF0F2042",
  paleGray: "FFF1F5F9",
  lightGray: "FFF8FAFC",
  amber: "FFF59E0B",
  green: "FF15803D",
  red: "FFB91C1C",
  blue: "FF1E40AF",
  white: "FFFFFFFF",
  ink: "FF0F2042",
  dim: "FF475569",
};

const TIER_FILL = {
  "Foundational (Part A)": "FFE0F2FE",
  "Differentiator (Part B)": "FFFEF3C7",
};

const MOSCOW_FILL = {
  MUST: "FFFEE2E2",
  SHOULD: "FFFEF3C7",
  COULD: "FFE0F2FE",
  WONT: "FFF1F5F9",
};

function statusColor(status) {
  if (!status) return null;
  const s = status.toLowerCase();
  if (s.startsWith("✅") || s.includes("live")) return "FFDCFCE7";
  if (s.startsWith("⚠️") || s.includes("partial")) return "FFFEF3C7";
  if (s.startsWith("🚫") || s.includes("not yet") || s.includes("deferred")) return "FFFEE2E2";
  if (s.startsWith("⏳")) return "FFE0F2FE";
  return null;
}

function buildSheet(workbook, sheetName, module, requirements) {
  const ws = workbook.addWorksheet(sheetName, {
    views: [{ state: "frozen", xSplit: 1, ySplit: 5 }],
  });

  // ── Header band (rows 1-3) ────────────────────────────────────────────────
  ws.mergeCells("A1:I1");
  const c1 = ws.getCell("A1");
  c1.value = `Hawkeye URS · ${module.name}`;
  c1.font = { name: "Calibri", size: 18, bold: true, color: { argb: COLOR.white } };
  c1.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.navy } };
  c1.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  ws.getRow(1).height = 32;

  ws.mergeCells("A2:I2");
  const c2 = ws.getCell("A2");
  c2.value = `Module: ${module.name}  ·  Primary owner: ${module.owner}  ·  Version: 1.0 (auto-generated from URS.md)`;
  c2.font = { name: "Calibri", size: 10, color: { argb: COLOR.dim } };
  c2.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  ws.getRow(2).height = 18;

  ws.mergeCells("A3:I3");
  const c3 = ws.getCell("A3");
  c3.value = `Generated: ${new Date().toISOString().slice(0, 10)}  ·  Total requirements: ${requirements.length}  (Part A: ${requirements.filter((r) => r.tier.includes("A")).length}  ·  Part B: ${requirements.filter((r) => r.tier.includes("B")).length})  ·  Source: Doc_V2/06-modules/${module.slug}/URS.md`;
  c3.font = { name: "Calibri", size: 9, italic: true, color: { argb: COLOR.dim } };
  c3.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  ws.getRow(3).height = 16;

  ws.getRow(4).height = 6; // spacer

  // ── Column headers (row 5) ────────────────────────────────────────────────
  const headers = [
    { name: "URS ID",        width: 14 },
    { name: "Tier",          width: 22 },
    { name: "Sub-area",      width: 32 },
    { name: "Requirement",   width: 70 },
    { name: "Persona / Rationale", width: 22 },
    { name: "Reg. Anchor",   width: 28 },
    { name: "MoSCoW",        width: 10 },
    { name: "Status",        width: 38 },
    { name: "QA Sign-off",   width: 14 },
  ];

  headers.forEach((h, idx) => {
    const cell = ws.getCell(5, idx + 1);
    cell.value = h.name;
    cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: COLOR.white } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.navyDark } };
    cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true, indent: 1 };
    cell.border = { top: { style: "thin", color: { argb: COLOR.navy } }, bottom: { style: "thin", color: { argb: COLOR.navy } } };
    ws.getColumn(idx + 1).width = h.width;
  });
  ws.getRow(5).height = 24;

  // ── Auto-filter on headers ─────────────────────────────────────────────────
  ws.autoFilter = { from: { row: 5, column: 1 }, to: { row: 5, column: headers.length } };

  // ── Data rows ─────────────────────────────────────────────────────────────
  requirements.forEach((req, i) => {
    const row = i + 6;
    // Column mapping (URS structure varies between Part A and Part B):
    //   Part A: ID | Requirement | Persona | Reg | MoSCoW | Current state
    //   Part B: ID | Requirement | Strategic rationale | MoSCoW | Current state
    const keys = Object.keys(req);
    const reqText = req["Requirement"] || "";
    const persona = req["Persona"] || req["Strategic rationale"] || "";
    const regAnchor = req["Reg anchor"] || "—";
    const moscow = req["MoSCoW"] || "";
    const status = req["Current state"] || "";

    const cells = [
      req.id,                  // A
      req.tier,                // B
      req.subsection,          // C
      reqText,                 // D
      persona,                 // E
      regAnchor,               // F
      moscow,                  // G
      status,                  // H
      "",                      // I — QA sign-off (manual)
    ];

    cells.forEach((v, idx) => {
      const cell = ws.getCell(row, idx + 1);
      cell.value = v;
      cell.font = { name: "Calibri", size: 9.5, color: { argb: COLOR.ink } };
      cell.alignment = { vertical: "top", horizontal: "left", wrapText: true, indent: 1 };
      cell.border = { bottom: { style: "hair", color: { argb: "FFE2E8F0" } } };
    });

    // Tier fill
    const tierCell = ws.getCell(row, 2);
    tierCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: TIER_FILL[req.tier] || COLOR.paleGray } };
    tierCell.font = { name: "Calibri", size: 9, bold: true, color: { argb: COLOR.ink } };

    // URS ID — bold + monospace feel
    const idCell = ws.getCell(row, 1);
    idCell.font = { name: "Consolas", size: 9.5, bold: true, color: { argb: COLOR.navyDark } };

    // MoSCoW fill
    const moscowCell = ws.getCell(row, 7);
    if (MOSCOW_FILL[moscow]) {
      moscowCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: MOSCOW_FILL[moscow] } };
      moscowCell.font = { name: "Calibri", size: 9.5, bold: true };
      moscowCell.alignment = { vertical: "middle", horizontal: "center" };
    }

    // Status conditional fill
    const sCol = statusColor(status);
    if (sCol) {
      ws.getCell(row, 8).fill = { type: "pattern", pattern: "solid", fgColor: { argb: sCol } };
    }

    // Alternating row stripe on other cells (lightly)
    if (i % 2 === 0) {
      [3, 4, 5, 6, 9].forEach((col) => {
        const cell = ws.getCell(row, col);
        if (!cell.fill || cell.fill.type !== "pattern") {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFDFEFF" } };
        }
      });
    }

    // Row height auto via wrap
    ws.getRow(row).height = Math.max(20, Math.min(150, Math.ceil(reqText.length / 75) * 14));
  });

  return ws;
}

function buildSummarySheet(workbook, modulesWithReqs) {
  const ws = workbook.addWorksheet("Summary", {
    views: [{ state: "frozen", ySplit: 5 }],
  });

  // Header
  ws.mergeCells("A1:G1");
  const c1 = ws.getCell("A1");
  c1.value = "Hawkeye EQMS · URS Summary";
  c1.font = { name: "Calibri", size: 20, bold: true, color: { argb: COLOR.white } };
  c1.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.navy } };
  c1.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  ws.getRow(1).height = 36;

  ws.mergeCells("A2:G2");
  const c2 = ws.getCell("A2");
  c2.value = `Generated: ${new Date().toISOString().slice(0, 10)}  ·  ${modulesWithReqs.length} modules  ·  ${modulesWithReqs.reduce((a, m) => a + m.requirements.length, 0)} total requirements`;
  c2.font = { name: "Calibri", size: 10, color: { argb: COLOR.dim } };
  c2.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  ws.getRow(2).height = 18;

  ws.mergeCells("A3:G3");
  ws.getCell("A3").value = "Source-of-truth: each tab is generated from Doc_V2/06-modules/<module>/URS.md. Edit the markdown, re-run urs-to-excel.mjs to regenerate this workbook.";
  ws.getCell("A3").font = { name: "Calibri", size: 9, italic: true, color: { argb: COLOR.dim } };
  ws.getCell("A3").alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  ws.getRow(3).height = 16;

  ws.getRow(4).height = 6;

  // Column headers
  const headers = [
    { name: "Module",              width: 32 },
    { name: "Owner",               width: 30 },
    { name: "Total Reqs",          width: 12 },
    { name: "Part A (Foundational)", width: 18 },
    { name: "Part B (Differentiator)", width: 22 },
    { name: "MUST",                width: 10 },
    { name: "Live / Partial / Pending", width: 28 },
  ];

  headers.forEach((h, idx) => {
    const cell = ws.getCell(5, idx + 1);
    cell.value = h.name;
    cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: COLOR.white } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.navyDark } };
    cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    ws.getColumn(idx + 1).width = h.width;
  });
  ws.getRow(5).height = 24;

  modulesWithReqs.forEach((m, i) => {
    const row = i + 6;
    const reqs = m.requirements;
    const partA = reqs.filter((r) => r.tier.includes("A")).length;
    const partB = reqs.filter((r) => r.tier.includes("B")).length;
    const must = reqs.filter((r) => (r["MoSCoW"] || "").toUpperCase() === "MUST").length;
    const live = reqs.filter((r) => (r["Current state"] || "").includes("✅")).length;
    const partial = reqs.filter((r) => (r["Current state"] || "").includes("⚠️")).length;
    const pending = reqs.length - live - partial;
    const statusStr = `✅${live}  ⚠️${partial}  ⏳${pending}`;

    const cells = [m.module.name, m.module.owner, reqs.length, partA, partB, must, statusStr];
    cells.forEach((v, idx) => {
      const cell = ws.getCell(row, idx + 1);
      cell.value = v;
      cell.font = { name: "Calibri", size: 10, color: { argb: COLOR.ink } };
      cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
      cell.border = { bottom: { style: "hair", color: { argb: "FFE2E8F0" } } };
    });

    // Module name as link to its sheet
    const nameCell = ws.getCell(row, 1);
    nameCell.value = { text: m.module.name, hyperlink: `#'${m.module.name.replace(/[^\w ]/g, "")}'!A1` };
    nameCell.font = { name: "Calibri", size: 10, bold: true, color: { argb: COLOR.blue }, underline: true };

    ws.getRow(row).height = 22;

    // Totals row
    if (i === modulesWithReqs.length - 1) {
      const tRow = row + 2;
      ws.mergeCells(`A${tRow}:B${tRow}`);
      ws.getCell(`A${tRow}`).value = "TOTAL";
      ws.getCell(`A${tRow}`).font = { name: "Calibri", size: 11, bold: true, color: { argb: COLOR.white } };
      ws.getCell(`A${tRow}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.navy } };
      ws.getCell(`A${tRow}`).alignment = { vertical: "middle", horizontal: "left", indent: 1 };

      const totals = [
        modulesWithReqs.reduce((a, m) => a + m.requirements.length, 0),
        modulesWithReqs.reduce((a, m) => a + m.requirements.filter((r) => r.tier.includes("A")).length, 0),
        modulesWithReqs.reduce((a, m) => a + m.requirements.filter((r) => r.tier.includes("B")).length, 0),
        modulesWithReqs.reduce((a, m) => a + m.requirements.filter((r) => (r["MoSCoW"] || "").toUpperCase() === "MUST").length, 0),
        `✅${modulesWithReqs.reduce((a, m) => a + m.requirements.filter((r) => (r["Current state"] || "").includes("✅")).length, 0)}  ⚠️${modulesWithReqs.reduce((a, m) => a + m.requirements.filter((r) => (r["Current state"] || "").includes("⚠️")).length, 0)}`,
      ];
      totals.forEach((v, idx) => {
        const cell = ws.getCell(tRow, idx + 3);
        cell.value = v;
        cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: COLOR.white } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR.navy } };
        cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
      });
      ws.getRow(tRow).height = 28;
    }
  });

  // Add helpful legend below table
  const legendRow = modulesWithReqs.length + 10;
  ws.mergeCells(`A${legendRow}:G${legendRow}`);
  ws.getCell(`A${legendRow}`).value = "Legend";
  ws.getCell(`A${legendRow}`).font = { bold: true, size: 11, color: { argb: COLOR.ink } };

  const legend = [
    ["Tier", "Foundational (Part A) = baseline regulatory + table-stakes  ·  Differentiator (Part B) = white-space competitive moat"],
    ["MoSCoW", "MUST · SHOULD · COULD · WON'T (prioritization)"],
    ["Current state", "✅ Live  ·  ⚠️ Partial / scaffolded  ·  🚫 Deferred / not yet  ·  ⏳ Planned"],
    ["QA Sign-off", "Manual column for QA team to mark Approved / Rejected / Needs review per release"],
  ];
  legend.forEach((row, i) => {
    const r = legendRow + 1 + i;
    ws.mergeCells(`B${r}:G${r}`);
    ws.getCell(`A${r}`).value = row[0];
    ws.getCell(`A${r}`).font = { bold: true, size: 9.5, color: { argb: COLOR.dim } };
    ws.getCell(`B${r}`).value = row[1];
    ws.getCell(`B${r}`).font = { size: 9.5, color: { argb: COLOR.ink } };
  });
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────

async function loadModuleURS(module) {
  const path = join(MODULES_ROOT, module.slug, "URS.md");
  const md = readFileSync(path, "utf8");
  return parseURS(md);
}

async function buildAuditWorkbook() {
  const auditModule = ALL_MODULES.find((m) => m.slug === "audit-management");
  const reqs = await loadModuleURS(auditModule);
  console.log(`  audit-management: ${reqs.length} requirements parsed`);

  const wb = new ExcelJS.Workbook();
  wb.creator = "Hawkeye Doc_V2 · urs-to-excel.mjs";
  wb.created = new Date();

  buildSheet(wb, "Audit Management", auditModule, reqs);

  const outPath = join(MODULES_ROOT, "audit-management", "URS.xlsx");
  await wb.xlsx.writeFile(outPath);
  return { path: outPath, count: reqs.length };
}

async function buildEqmsWorkbook() {
  const modulesWithReqs = [];
  for (const m of EQMS_MODULES) {
    try {
      const reqs = await loadModuleURS(m);
      console.log(`  ${m.slug}: ${reqs.length} requirements parsed`);
      modulesWithReqs.push({ module: m, requirements: reqs });
    } catch (err) {
      console.warn(`  ${m.slug}: FAILED — ${err.message}`);
    }
  }

  const wb = new ExcelJS.Workbook();
  wb.creator = "Hawkeye Doc_V2 · urs-to-excel.mjs";
  wb.created = new Date();

  buildSummarySheet(wb, modulesWithReqs);
  for (const m of modulesWithReqs) {
    // Sheet name max 31 chars; strip parens
    const sheetName = m.module.name.replace(/[^\w ]/g, "").slice(0, 31);
    buildSheet(wb, sheetName, m.module, m.requirements);
  }

  const outPath = join(MODULES_ROOT, "EQMS-URS.xlsx");
  await wb.xlsx.writeFile(outPath);
  return { path: outPath, modules: modulesWithReqs.length, total: modulesWithReqs.reduce((a, m) => a + m.requirements.length, 0) };
}

async function main() {
  console.log("Building AUDIT-MANAGEMENT URS workbook…");
  const audit = await buildAuditWorkbook();
  console.log(`  ✓ ${audit.path} (${audit.count} reqs)`);

  console.log("\nBuilding EQMS URS workbook…");
  const eqms = await buildEqmsWorkbook();
  console.log(`  ✓ ${eqms.path} (${eqms.modules} modules, ${eqms.total} reqs)`);

  console.log("\nDone.");
}

main().catch((err) => { console.error("Fatal:", err); process.exit(1); });
