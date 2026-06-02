# UX Decision Log — RapScript RO

Jurnal de decizii din faza UX (bmad-ux, Sally). Canonic pe „de ce".

## 2026-06-02

1. **Direcție confirmată: Nocturn (Premium Clean dark + purple).** NU Underground Brutalist —
   superseded la pivotul user din 2026-05-31 (`groundwork.md` §2). Brutalist-ul (hârtie/portocaliu/
   Archivo Black) e istoric. PRD-ul citează încă „Brutalist" pe alocuri — stale, neactualizat după pivot.

2. **Font hero = serif editorial high-contrast** (ales de user din 3 opțiuni cu preview, peste grotesk
   și mono). Familie propusă: **Fraunces** (variabil, RO complet), alternativă: Playfair Display.
   Motiv user-facing: cuvântul ca „vers/poezie", contrast tare cu UI-ul mono.

3. **Font UI = IBM Plex Mono**, schimbat din Space Mono (draft pas-5 recuperat). Motiv: Space Mono nu
   acoperă sigur `ă/î` din „începător"; Plex Mono are Latin Extended complet + se mărită cu serif.

4. **Paletă Nocturn** definită la nivel de token (au murit cu D1-D18 în sesiunea nepersistată):
   `bg #0B0B0F`, `ink #F4F4F7` (nu alb pur), `accent #8B7BFF` (singurul accent, doar pe forme/text mare).

5. **Animația brutalistă STAMP-CUT e moartă.** Tranziția la cuvânt nou = `translateY+opacity ~140ms`
   crisp, fără shake/overshoot/flash (Layer 1 din groundwork §5, potrivit cu premium-clean).
   `prefers-reduced-motion` → instant.

6. **`aria-live=off` pe hero în playing** — [ASSUMPTION] user #1 e vizual, nu pe screen-reader; un
   cuvânt nou la câteva secunde ar inunda un SR fără să servească ținta.

7. **Output în `docs/`** (DESIGN.md, EXPERIENCE.md), nu în folderul adânc `{planning_artifacts}/ux-designs/`
   cerut de skill — consistent cu convenția proiectului (brief/prd/groundwork toate în `docs/`).

## Validare + fix-uri (2026-06-02)

Rulat Reviewer Gate (rubric walker + accessibility, 2 sub-agenți paraleli) → `docs/validation-report.md`.
Contrast Nocturn verificat empiric: trece AA. Toate critice/high/medium aplicate ca Update; spine → `final`.
Detalii în raport. PRD §0/§4/§7 corectat de la Brutalist la Nocturn.

## Deschis pentru fazele următoare

- **[NOTE FOR ARCHITECTURE]** verifică cu fonttools că Fraunces + IBM Plex Mono randează comma-below pe
  `ș ț` + au `ă î â`; pune `lang="ro"`.
- ~~**PRD stale:** referințele „Underground Brutalist" din `prd.md`~~ → REZOLVAT 2026-06-02 (corectat la Nocturn).
