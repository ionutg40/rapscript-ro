# Plan RapScript RO

Tracker de proiect. Urmărim pașii BMad Method.

## Unde suntem (2026-06-02)

| Fază BMad | Status |
|---|---|
| 1 - Analysis (brief) | ✅ aprobat → `docs/brief.md` |
| 2 - Planning (PRD) | ✅ final → `docs/prd.md` (10 FR, FR-7 în v1) |
| 2 - UX design | ✅ **gata** → `docs/DESIGN.md` (Nocturn) + `docs/EXPERIENCE.md` + `docs/ux-decisions.md` |
| 3 - Architecture | ✅ **COMPLETE** → `docs/architecture.md` (8 pași, D1-D18, status READY FOR IMPLEMENTATION) |
| 3 - Epics & Stories | ✅ **COMPLETE** → `docs/epics.md` (5 epics, 16 stories cu AC, FR1-10 acoperite) |
| 3 - Implementation readiness | ✅ **READY** → `docs/implementation-readiness-report-2026-06-02.md` (0 blockers, 3 findings low) |
| 4 - Build | 🟢 **ÎN CURS** — Epic 1 ✅ LIVE (`https://ionutg40.github.io/rapscript-ro/`) |

**Build progress:**
- Epic 1 ✅ — 1.1 (Fraunces verificat) · 1.2 (schelet live) · 1.3 (fonturi self-host).
- Epic 2 ✅ — 2.1 (`gen_words.py`→`words.js` 417) · 2.2 (încărcat live + guard) · 2.3 (CI freshness gate = success).
- Următor: **Epic 3** (inima: `app.js` — state, render(), pickWord, timer). `gotchas.md`: 3 lecții (țintă ≥8).

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
