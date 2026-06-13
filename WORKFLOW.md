# WORKFLOW — how to give instructions to Claude (mobile + desktop)

| Field | Value |
|---|---|
| Owner | You (founder) |
| Status | v1.0 — 2026-06-11 |
| Purpose | Eliminate redundant instructions and re-work caused by mobile↔desktop mismatch |
| Pairs with | [PROJECT-STATE.md](./PROJECT-STATE.md) — read first; this doc says how to USE it |

---

## The one principle

> 💡 **Both Claudes — mobile and desktop — start every session by reading [PROJECT-STATE.md](./PROJECT-STATE.md).** You enforce this by **opening every instruction with the same sentence**:
>
> *"Per PROJECT-STATE.md, [your instruction]."*
>
> That's it. One sentence. Forces both Claude (and you) to anchor in current state before doing anything.

If you forget the sentence, the workflow still works — Claude will figure it out — but you'll get more clarifying questions and risk redundancy. If you say it, redundancy mostly self-eliminates.

---

## What each Claude can do (capability honest)

| | Mobile Claude (claude.ai web/app) | Desktop Claude Code (CLI) |
|---|---|---|
| **Read GitHub public raw URLs** | ✅ Yes (via WebFetch) | ✅ Yes (via WebFetch) |
| **Read your local filesystem** | ❌ No | ✅ Yes |
| **Write files / make edits** | ⚠️ Generates content for you to copy-paste | ✅ Yes — directly to local files |
| **Run code / tests / build / git push** | ❌ No | ✅ Yes |
| **Render PDF / HTML** | ❌ No (suggests it) | ✅ Yes (via `render-docs.mjs`) |
| **Hold session memory across chats** | ❌ No (each chat is fresh) | ⚠️ Has memory files in `~/.claude/...` but per-project; not synced across machines |
| **Best at** | Planning · drafting · ideation · feedback while walking around | Execution · file edits · git · render · multi-file refactors |
| **Worst at** | Anything that requires writing to disk or running commands | Brainstorming when you're away from the laptop |

---

## The mobile workflow (when laptop is at home)

### Before you start

1. Open your phone browser → go to `https://github.com/hawkeyetransact-dotcom/doc_v2/blob/main/PROJECT-STATE.md`
2. Skim it. You'll remember what's been decided in 60 seconds.

### When you give an instruction to mobile Claude

Open with: *"Per the S.M.A.R.T. Hawk PROJECT-STATE.md at `https://raw.githubusercontent.com/hawkeyetransact-dotcom/doc_v2/main/PROJECT-STATE.md` — please read that first. Then [your instruction]."*

Then ask Claude to do **planning / drafting / ideation** — NOT execution. Examples that work well on mobile:

| You want | Say |
|---|---|
| Draft a section of a pitch | "Draft slide 7 of the pitch deck (the wedge math) — 200 words max, founder voice." |
| Brainstorm a new module name | "Help me name the 16th module — something between Risk Management and Inspection Readiness." |
| Critique an idea | "I'm thinking we add a sub-tier for Tier-4 SMEs at ₹2L. Critique this against PRICING.md." |
| Plan a multi-step task for desktop later | "Plan how I'd add a new persona — list every file desktop Claude would touch." |
| Quick decision/feedback | "Should we raise $1.5M as one round or split into $750K now + $750K in 6 months?" |
| Read + summarize | "Open POC-PROPOSAL.md from the repo and summarize §3 in 5 bullets." |

### What you do with the mobile output

- **If it's a draft / plan / critique:** keep the chat open or screenshot it. Bring it back to desktop later.
- **If it's just a quick decision:** done. Move on.
- **If it's something to commit:** copy-paste the content into a follow-up desktop session — *"Per PROJECT-STATE.md, paste this content from mobile into the file at X and commit."*

### What you should NEVER ask mobile Claude to do

- ❌ Modify a specific file (it can't write)
- ❌ Run tests or check the build (it can't)
- ❌ Make a git commit (it can't)
- ❌ Promise that something will be "done" after the conversation (it won't be — only desktop can execute)

---

## The desktop workflow (when at the laptop)

### Before you start

1. Open Claude Code CLI in `c:/Users/debab/Code - S.M.A.R.T. Hawk/hawkeye-clean/`
2. Either:
   - **Fresh chat:** start with *"Per PROJECT-STATE.md, [your instruction]."*
   - **Resume work from a mobile session:** *"Per PROJECT-STATE.md, here's what I planned with mobile Claude this morning: [paste]. Please execute."*

### When you give an instruction to desktop Claude

Open with: *"Per PROJECT-STATE.md, [your instruction]."*

Desktop Claude can execute end-to-end. Examples:

| You want | Say |
|---|---|
| Implement what mobile drafted | "Per PROJECT-STATE.md, [paste mobile output]. Apply to file X, commit with message Y, push to origin." |
| Multi-file refactor | "Per PROJECT-STATE.md, the module count just changed from 15 to 16. Find every file that says 15 and update consistently." |
| Compare two artifacts | "Per PROJECT-STATE.md, diff CFO-DECK.md against the latest pricing in PRICING.md and report discrepancies." |
| Build something new | "Per PROJECT-STATE.md, author X and render it." |

### At the end of a desktop session

If you made material changes, ask Claude to **update PROJECT-STATE.md §7 (change log)** and **§5 (canonical docs) if a new canon was added.** Then commit + push.

A good closing instruction:

> "Update PROJECT-STATE.md §7 with what we did this session. Update any other section that's affected. Commit and push to origin."

---

## The git push routine (after each desktop session)

Run from `c:/Users/debab/Code - S.M.A.R.T. Hawk/hawkeye-clean/Doc_V2`:

```bash
git add .                                  # stage all changes (customer-account folders are gitignored)
git status                                 # confirm what's staged
git commit -m "[short description]"        # commit
git push origin main                       # push to public repo so mobile Claude sees the update
```

If you're unsure what should be committed, just ask Claude: *"Per PROJECT-STATE.md, show me `git status`, summarize what changed, suggest a commit message."*

---

## The 4 rules

> ✅ **Follow these and the redundancy problem doesn't come back.**

1. **Every instruction opens with "Per PROJECT-STATE.md, ..."** — even if it feels redundant. Especially on mobile.
2. **Mobile drafts · desktop commits.** Never expect mobile to "finish" anything that needs disk or git.
3. **Update PROJECT-STATE.md whenever a decision is made.** If you decide pricing changes, the same desktop session should update §2 and §5.
4. **Push after every desktop session.** If you don't push, mobile Claude tomorrow won't see today's work.

---

## What to do when something feels redundant

If you find yourself about to re-explain context to Claude — STOP.

1. Open PROJECT-STATE.md in your browser
2. Find the section that should have your answer
3. Either (a) the answer is there → reference it: *"Per PROJECT-STATE.md §2, our ask is $1.5M not $3M — [instruction]"* — OR (b) it's NOT there → ask Claude to **add it to PROJECT-STATE.md** as part of the work

Over time PROJECT-STATE.md becomes the canonical brain. The redundancy disappears.

---

## Anti-patterns — what creates redundancy

| Anti-pattern | What goes wrong | Fix |
|---|---|---|
| You explain the company on every chat | Mobile Claude already could read PROJECT-STATE.md if asked | Open every chat with the standard sentence |
| You change a number in one doc and forget the others | Drift | Always ask "find every file that says X and update" |
| Mobile Claude generates content; you forget to bring it to desktop | Work is lost | Screenshot mobile output OR paste into desktop session same day |
| Desktop session ends without git push | Mobile can't see the update | Push routine at session end |
| Doc proliferates without PROJECT-STATE.md §5 update | Canonical doc unknown; future sessions don't know which to use | Always ask "update §5 if we added a new canonical doc" |
| Two Claudes work in parallel without coordination | Conflicting edits | Sequence — finish one before opening the other |

---

## When you genuinely need both Claudes in parallel

It happens. You're walking somewhere; mobile Claude is good for ideation. But your laptop is also running. The discipline:

- **Lock the editing scope.** Tell desktop "I'm working on the financial model — leave pitch deck files alone for now." Tell mobile "draft an email to the angel investor — don't touch any files."
- **Don't ask both Claudes to update the same file simultaneously.**
- **At the next sync point**, run desktop to: (a) commit current work, (b) pull whatever mobile produced as draft text, (c) decide which is canonical.

---

## See also

- [PROJECT-STATE.md](./PROJECT-STATE.md) — the doc both Claudes should read first
- [INDEX.md](./INDEX.md) — folder tree
- [README.md](./README.md) — repo-level intro

---

*Doc_V2 · WORKFLOW · v1.0 · 2026-06-11*
