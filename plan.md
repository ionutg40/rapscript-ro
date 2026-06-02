# Plan RapScript RO

Tracker de proiect. Urmărim pașii BMad Method.

## Unde suntem (2026-06-02)

| Fază BMad | Status |
|---|---|
| 1 - Analysis (brief) | ✅ aprobat → `docs/brief.md` |
| 2 - Planning (PRD) | ✅ final → `docs/prd.md` (10 FR, FR-7 în v1) |
| 2 - UX design | ✅ **gata** → `docs/DESIGN.md` (Nocturn) + `docs/EXPERIENCE.md` + `docs/ux-decisions.md` |
| 3 - Architecture | 🟡 **următorul pas** (vanilla + Pages; draft pas-5 recuperat în `docs/architecture.step5-draft.md`) |
| 3 - Epics & Stories | ⬜ |
| 3 - Implementation readiness | ⬜ |
| 4 - Sprint planning + build | ⬜ |

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
