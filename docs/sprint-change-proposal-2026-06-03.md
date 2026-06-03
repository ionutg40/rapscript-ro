# Sprint Change Proposal — RapScript v2

> Data: 2026-06-03 · Scope: 🟢 **Minor** · Mod: Batch

## 1. Issue Summary

Retrospective-ul v2 a scos că `docs/architecture-voice-rhyme.md` se autocontrazicea: D31 (calea vocii)
era marcat simultan **DECIS = A** (linii 199/343, Epic 8 livrat) și **DESCHIS/BLOCANT** (linii 26, 103,
175, 305). Decizia fusese luată și livrată — markerii „deschis" erau stale. Secundar: D28 conținea un
overclaim („0% accent") reconciliat deja parțial la „paritate 417/417".

## 2. Impact Analysis

- **Epic impact:** niciunul — Epic 7+8 rămân cum sunt, doar status-ul în doc se aliniază la realitate.
- **Artifact:** doar `architecture-voice-rhyme.md` (4 markeri de status).
- **Cod:** spec-ul cere `continuous=false` (corect); codul a livrat `continuous=true` → **codul deviază**,
  nu spec-ul. Aliniat în QQ prin P7. Spec-ul NU se schimbă acolo.
- **Direcție:** zero schimbare.

## 3. Recommended Approach

**Direct Adjustment** — fix targetat de doc, fără replan PRD/epics. Aprobat de user 2026-06-03.

## 4. Detailed Change Proposals (APLICATE)

| Linie | OLD | NEW |
|---|---|---|
| 26 | Status **DRAFT** — D31 deschisă pentru owner | Status **D31 DECIS** (2026-06-03) = A; Epic 8 v1 livrat |
| 103 | D31 (DESCHISĂ) | D31 (DECIS=A) |
| 175 | D31 ▲ — [DECIZIE DESCHISĂ — OWNER] | D31 ▲ — [DECIS 2026-06-03 = A] |
| 305 | OQ-V1 (BLOCANT pt voce): D31 — care cale? | OQ-V1 (REZOLVAT 2026-06-03): D31 = A |

Verificat: `grep` nu mai găsește contradicție D31.

## 5. Implementation Handoff → QQ (build phase)

Scope confirmat pentru faza Quick-Dev:
- **P1** — freshness hash filtrat + include `stress.json` (gen_rhymes.py)
- **P5** — CI push race: `pull --rebase`/retry sau `concurrency` (check.yml)
- **P7** — `continuous=false` + D34 interim estompat → confirmat pe `isFinal` (app.js)
- **P8** — buton 🎤 hold-only (app.js)
- **P9** — fail-loud pe `true_orphans` rămase (gen_rhymes.py)
- **OQ-V6** — plafon total bancă
- **OQ-V7** — rime pe cuvinte adăugate (backfill RoLEX la add/voce)

Plus item non-cod: **D5** — test live voce 20+ cuvinte pe Chrome (owner: user) înainte de „Epic 8 done".
