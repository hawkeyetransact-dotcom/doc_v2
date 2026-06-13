# S.M.A.R.T. Hawk docs cleanup — task for Claude Code

## Context

I have a documentation folder at `C:\Users\debab\Code - S.M.A.R.T. Hawk\hawkeye-clean\backend\docs\` that has accumulated artifacts from many sessions. There are folder-numbering collisions, scattered fundraising/strategy materials across three folders, and likely duplicates from when files were saved in multiple places.

I also have a zip of canonical artifacts produced in a recent Claude.ai chat that needs to be merged in **without creating duplicates**. The zip is at `C:\Users\debab\Downloads\hawkeye-chat-artifacts.zip` (or wherever you place it — confirm the path with me before starting).

Your job: clean up `backend/docs/` and merge in the zip's contents, hash-aware, non-destructively.

## Critical principles

1. **Never delete anything.** Everything that moves goes to `backend/docs/_archive/<timestamp>/` preserving relative paths, so any action can be reversed.
2. **Dry-run first, execute on confirmation.** Print every planned action with reason. Wait for my "go" before touching the filesystem.
3. **Hash-aware deduplication.** Use SHA-256 to compare file contents. Same hash = true duplicate (skip the import or archive the redundant copy). Same name + different hash = treat the new one as superseding (archive old, place new).
4. **When in doubt, do nothing and log it.** A "manual review needed" log entry is always safer than a wrong move.

## The folder structure today (from `dir /s /b`)

Top-level under `backend/docs/`:
- `01-architecture/` — DB schemas, ERDs, technical architecture (keep)
- `01-pitch/` — investor 2-pager, 5-pager, Trust-OS onepager (consolidate into `00-strategy-and-pitch/`)
- `02-deployment/` — deployment guide (keep)
- `03-user-guides/` — user manual, click-by-click guides, demo scripts, pharma strategy docs, screenshots (keep — but note `02-user-manual.md` may collide with `platform-docs/02-user-manual.md`)
- `04-processes/` — workflow docs, audit flow, GMP audit, status engine, **superuser-process-flow-24steps.md** (keep, but the 24-step file is duplicated elsewhere)
- `05-compliance/` — compliance-engine.md, current-system-gaps.md (keep)
- `05-feature-guides/` — 17 module feature guides (PDF + HTML pairs) — **collision: rename to `10-feature-guides/`**
- `06-go-to-market/` — vision, vertical pitches, deployment models, ROI calc, demo scripts, Sanpras pitch (consolidate into `00-strategy-and-pitch/`)
- `06-roadmap/` — eqms-action-plan, DB evolution, risk analyses, roadmap-and-urs.html — **collision: rename to `11-roadmap/`**
- `07-marketing/` — customer playbooks, demo package, voiceover script, YC pitch, sales deck (consolidate into `00-strategy-and-pitch/`)
- `07-test-results/` — `_archive/` with three timestamped test runs containing AI outputs, screenshots, videos — **collision: rename to `12-test-results/`**
- `08-reference/` — backend structure map, master-vs-transaction data, autofill architecture, repo topology, whopir notes, contains a nested `reference/` with another copy of superuser-process-flow-24steps.md
- `09-test-reports/` — demo runbook, EQMS test results, walkthrough reports, with `_archive/` of screenshots
- `14-staleness-report.md`
- `askhawk/` — AskHawk KB, contracts, decisions, flows, runbook, role specs
- `capa/` — CAPA module blueprint
- `doc-intel/` — doc intelligence coverage
- `eqms-intelligence/` — API spec, architecture, integration framework, test plan
- `INDEX.md` — needs rebuilding
- `marketplace-v2/` — implementation plan
- `org-directory/` — current state, delta manifest, rollout plan, target schema
- `platform-docs/` — `01-architecture-technical.md` (likely duplicate), `02-user-manual.md` (likely duplicate)
- `reference/` — top-level, only contains superuser-process-flow-24steps.md (third copy)
- `VERSIONS.md`

## The cleanup plan

### Step 1 — Inventory & hash everything
- Walk `backend/docs/` and the unzipped staging folder
- Build a hash table: SHA-256 → list of file paths
- Generate a planned-actions report

### Step 2 — Fix numbering collisions
Rename three folders (preserve contents):
- `05-feature-guides/` → `10-feature-guides/`
- `06-roadmap/` → `11-roadmap/`
- `07-test-results/` → `12-test-results/`

(Note: zip's `06-roadmap/URS-v1.0-DRAFT.pdf` should ultimately land in the new `11-roadmap/` path.)

### Step 3 — Resolve the three copies of `superuser-process-flow-24steps.md`
- Compare hashes of the four locations:
 - `04-processes/superuser-process-flow-24steps.md`
 - `08-reference/superuser-process-flow-24steps.md`
 - `08-reference/reference/superuser-process-flow-24steps.md`
 - `reference/superuser-process-flow-24steps.md`
- Keep the one in `08-reference/` (or newest if hashes differ). Archive the other three. Also archive the empty `reference/` top-level folder.

### Step 4 — Resolve `platform-docs/` overlaps
- Compare `platform-docs/01-architecture-technical.md` vs `01-architecture/technical-architecture.md` by hash + LastWriteTime
- Compare `platform-docs/02-user-manual.md` vs `03-user-guides/02-user-manual.md`
- If identical: archive the `platform-docs/` copy.
- If different: log for manual review. Don't move either.
- If `platform-docs/` ends up empty, archive the folder itself.

### Step 5 — Create `00-strategy-and-pitch/` and consolidate
Move into the new bucket:
- `01-pitch/*` → `00-strategy-and-pitch/pitch-legacy/` (preserves the old pitches as historical)
- `06-go-to-market/*` → `00-strategy-and-pitch/gtm-legacy/`
- `07-marketing/*` → `00-strategy-and-pitch/marketing-legacy/`

(Use `-legacy` suffix because the **canonical** versions are coming in from the zip — see Step 6.)

After moving, the old folders `01-pitch/`, `06-go-to-market/`, `07-marketing/` should be empty. Archive them.

### Step 6 — Merge the zip's canonical artifacts
Unzip `hawkeye-chat-artifacts.zip` to a temp staging directory. Read `MANIFEST.json` inside. For each artifact:

```
for each artifact in manifest:
  source_hash = sha256(staging / artifact.source)
  target_path = backend/docs / artifact.destination
  
  if target_path exists:
    target_hash = sha256(target_path)
    if source_hash == target_hash:
      log "skip: identical" and continue
    else:
      archive(target_path) → _archive/superseded/<timestamp>/<original-path>
      copy(staging / artifact.source) → target_path
      log "superseded existing"
  else:
    ensure(parent of target_path exists)
    copy(staging / artifact.source) → target_path
    log "placed new"
  
  for each item in artifact.supersedes_likely:
    if backend/docs / item exists:
      archive(it)
      log "archived superseded-by-new"
```

### Step 7 — Rebuild `INDEX.md`
Walk the new tree and generate a fresh index. Top-level structure should be:
- `00-strategy-and-pitch/` — fundraising & GTM canon
- `01-architecture/` — technical architecture (incl. new verified PDF)
- `02-deployment/`
- `03-user-guides/`
- `04-processes/`
- `05-compliance/`
- `08-reference/`
- `09-test-reports/`
- `10-feature-guides/` (renumbered)
- `11-roadmap/` (renumbered, incl. new URS)
- `11-research/` (new, from zip)
- `12-test-results/` (renumbered)
- `_archive/` (everything moved aside)
- domain folders (`askhawk/`, `capa/`, `doc-intel/`, `eqms-intelligence/`, `marketplace-v2/`, `org-directory/`) — kept as-is

Include for each: the folder's purpose in one line, and the most important files.

### Step 8 — Generate a report
Write `_archive/<timestamp>/CLEANUP-REPORT.md` with:
- Total files processed
- Files archived (with reasons)
- Files newly placed (from zip)
- Files left untouched
- Manual-review items (hash conflicts, ambiguous cases)
- Old paths → new paths mapping

## Execution mode

Start in **dry-run mode** by default. Print the full planned action list with reasons. Wait for my confirmation. Then execute, logging every action to the cleanup report.

If at any point a step requires my judgment (a hash conflict on a strategically important file, an ambiguous supersedes), pause and ask. Don't guess.

## Safety nets

- Never use `Remove-Item` (PowerShell) or `rm` (anywhere). Only `Move-Item` / `Copy-Item`.
- Every move goes through `_archive/<timestamp>/` — nothing leaves the docs tree.
- If the script errors mid-run, the timestamped log lets us see what was done so we can resume or partially undo.

## What success looks like

When done, `backend/docs/` has:
- No folder-numbering collisions
- One canonical copy of `superuser-process-flow-24steps.md`
- A consolidated `00-strategy-and-pitch/` for fundraising materials, with the canonical versions from the chat as the primary docs and the older versions preserved under `-legacy/` subfolders
- The verified architecture PDF in `01-architecture/`
- The URS in `11-roadmap/`
- A new `11-research/` folder with the vendor-neutral research papers
- A rebuilt `INDEX.md`
- All older / superseded / duplicate files preserved in `_archive/<timestamp>/`
- A `CLEANUP-REPORT.md` documenting every action

Start with the inventory and dry-run report. I'll review before you execute anything.
