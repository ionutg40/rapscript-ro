# Plan RapScript RO

Tracker de proiect. Urmărim pașii BMad Method.

## Unde suntem (2026-05-31)

| Fază BMad | Status |
|---|---|
| 1 - Analysis (brief) | ✅ aprobat → `docs/brief.md` |
| 2 - Planning (PRD) | ⏭️ **următorul pas** |
| 2 - UX design | ⬜ |
| 3 - Architecture | ⬜ |
| 3 - Epics & Stories | ⬜ |
| 3 - Implementation readiness | ⬜ |
| 4 - Sprint planning + build | ⬜ |

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
