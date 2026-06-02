# Plan RapScript RO

Tracker de proiect. Urmărim pașii BMad Method.

## 📌 STARE LA PAUZĂ (2026-06-02) — proiect LIVRAT, în pauză

**Live & funcțional:** `https://ionutg40.github.io/rapscript-ro/` — FR1-10, viewer + add partajat din UI.
**Add prin Cloudflare Worker** (`rapscript-gh.ionutg40.workers.dev`), token `GH_TOKEN` ca secret pe Worker
(zero token în browser). Lanț verificat end-to-end (POST→Worker→commit→CI regen→deploy). Repo sincron, `words.js` fresh.

**NIMIC OBLIGATORIU rămas.** Opțional, când reiei:
- [ ] **Turnstile** anti-bot pe Worker (`docs/worker-setup.md`) + rate-limit — endpoint public, recomandat la liniște.
- [ ] **SM-3:** folosește app-ul la un freestyle real + dă URL-ul colegului (el nu config nimic — doar adaugă).
- [ ] **Conținut:** re-leveling ~10 cuvinte (PRD OQ#1) · crește banca peste 417 (acum direct din UI).
- [ ] **Polish:** README „cum rulezi/adaugi" · scoate CSS mort `.token-row` · consolidează docs D20-D24↔D25.
- [ ] **Mentenanță (1×/an):** la „nu am putut salva" → token GitHub expirat → regenerează + updatează `GH_TOKEN` pe Worker.

Detaliile complete ale build-ului mai jos.

## Unde suntem (2026-06-02)

| Fază BMad | Status |
|---|---|
| 1 - Analysis (brief) | ✅ aprobat → `docs/brief.md` |
| 2 - Planning (PRD) | ✅ final → `docs/prd.md` (10 FR, FR-7 în v1) |
| 2 - UX design | ✅ **gata** → `docs/DESIGN.md` (Nocturn) + `docs/EXPERIENCE.md` + `docs/ux-decisions.md` |
| 3 - Architecture | ✅ **COMPLETE** → `docs/architecture.md` (8 pași, D1-D18, status READY FOR IMPLEMENTATION) |
| 3 - Epics & Stories | ✅ **COMPLETE** → `docs/epics.md` (5 epics, 16 stories cu AC, FR1-10 acoperite) |
| 3 - Implementation readiness | ✅ **READY** → `docs/implementation-readiness-report-2026-06-02.md` (0 blockers, 3 findings low) |
| 4 - Build | ✅ **LIVRAT** — toate 5 epics live (`https://ionutg40.github.io/rapscript-ro/`) |

**Build progress:**
- Epic 1 ✅ — 1.1 (Fraunces verificat) · 1.2 (schelet live) · 1.3 (fonturi self-host).
- Epic 2 ✅ — 2.1 (`gen_words.py`→`words.js` 417) · 2.2 (încărcat live + guard) · 2.3 (CI freshness gate = success).
- Epic 3 ✅ LIVE — `app.js`: state, render() unic, pickWord no-repeat (testat 2000×), timer idempotent.
- Epic 4 ✅ LIVE — controale: play/pauză (+Space), slider viteză 2-12s, selector nivel (delegation), persistență localStorage. Default paused.
- Epic 5 ✅ LIVE — Nocturn complet, timer-bar, motion la schimbare cuvânt, fullscreen (FR8), responsive, a11y (focus-pe-pauză, aria, reduced-motion).

## 🏁 v1 LIVRAT (2026-06-02)

**Toate FR1-FR10 live · NFR-uri acoperite · SM-1 (live + inimă) PASS · SM-2 (`gotchas.md` 10 lecții) PASS.**
Live: `https://ionutg40.github.io/rapscript-ro/`.

## v1.1 — Word Bank Viewer + Shared Add (Epic 6, 2026-06-02)

Cerere client post-v1, prin advanced-elicitation + party (6 agenți) → **S2: GitHub-as-backend** (fără
server). Arhitectură v1.1 (D19-D24), PRD OQ#2 închis. LIVE: drawer viewer per-nivel + add din UI →
commit `wordbank.json` via GitHub API (token personal) → CI regen `words.js` → toți văd în ~1-2 min.
- 6.1 viewer · 6.2 validare JS · 6.3 commit · 6.4 CI auto-regen · 6.5 docs.
- **v1.2:** add prin **Cloudflare Worker** (token pe server, NU în browser) — câmpul de token SCOS. `worker/rapscript-worker.js` + `docs/worker-setup.md`. Owner pune `WORKER_URL` după deploy.
- **Test user (SM-3-like):** creează fine-grained PAT (`docs/add-words-setup.md`) → lipește în app →
  adaugă un cuvânt → vezi-l propagat. (Commit-ul live cere token de om, nu curl.)

> **Arhitectura (2026-06-02):** 8 pași BMad cap-coadă. Întărită prin 2 baterii elicitare (45 findings)
> + 2 party + Code Review Gauntlet + review 7 agenți + sweep Occam (35 items) + Delphi final (6/6 SHIP).
> Verdict unanim: gata de construit. **Primul task la build:** verifică Fraunces cu fonttools (D18/E4)
> înainte de orice CSS; apoi walking skeleton live (D17). Ship-blockers = D1-D10 + D17; restul are slack.

> **Notă reluare (2026-06-02):** sesiunea precedentă a lucrat UX + arhitectură D1-D18 + draft pas-5
> DOAR în context — nimic salvat pe disc. Singurul recuperat e textul pasului 5 (lipit de user →
> `docs/architecture.step5-draft.md`, marcat DRAFT). UX a fost refăcut corect de la zero pe direcția
> reală (Nocturn, post-pivot), NU pe brutalist. D1-D18 trebuie regenerați în faza Architecture.

## Groundwork (research front-loaded) — ✅ gata (2026-05-31)

Rulat ca workflow `rapscript-ro-groundwork` (12 agenți) înainte de PRD. Rezultate în `docs/groundwork.md`:

- [x] Word bank RO seed — **417 cuvinte (136/154/127)** după verificare → `assets/wordbank.json`
- [x] Direcție de design aleasă — Underground Brutalist „Subsol" (juriu 8.5/10)
- [x] Decizie stack recomandată — vanilla HTML/CSS/JS + GitHub Pages
- [x] Schiță epics cap-coadă (7 epics)
- [x] **Verificare adversarială groundwork** — 20 agenți; verdict: solid pt PRD. Corecții în `docs/groundwork.md` §5

> Aceste rezultate sunt INPUT pentru fazele BMad, nu sar peste pași: word bank = asset, design → faza UX, stack → faza Arhitectură, epics → faza Epics.

## Principiu de atac

Walking skeleton deployat live **întâi**, apoi îmbogățire. Impact maxim, efort minim:
codul inimii e trivial; valoarea stă în word bank-ul RO + design + URL live shareable.
