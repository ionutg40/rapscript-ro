# Validation Report — RapScript RO

- **DESIGN.md:** `docs/DESIGN.md`
- **EXPERIENCE.md:** `docs/EXPERIENCE.md`
- **Run at:** 2026-06-02 (Europe/Bucharest)
- **Lentile rulate:** rubric walker + accessibility (2 sub-agenți paraleli)

## Overall verdict

Spina e **adecvată, aproape de strong**: contract single-screen strâns, tokeni care se rezolvă
complet, flux cu protagonist viu, separare curată DESIGN/EXPERIENCE. Contrastul Nocturn e verificat
empiric și trece AA pe perechile portante (claim-urile spinei sunt oneste-spre-conservatoare). Două
lucruri blochează „strong" și trebuie rezolvate înainte de arhitectură/build: **FR-3 n-are acoperire
comportamentală** și **numele de componente diferă între cele două fișiere** (un consumator nu poate
îmbina mecanic rândul vizual cu cel comportamental). Restul: 0 critice a11y, câteva ajustări de token
și de tastatură.

## Category verdicts (rubric walker)

- Flow coverage — adequate
- Token completeness — strong
- Component coverage — **thin**
- State coverage — strong
- Visual reference coverage — adequate (spine-only, justificat)
- Bloat & overspecification — strong
- Inheritance discipline — adequate
- Shape fit — strong

## Findings by severity

### Critical (1)

**[Flow] FR-3 „fără repetare imediată" — zero acoperire comportamentală** (EXPERIENCE.md › Component
Patterns / State Patterns). EXPERIENCE pretinde că acoperă FR-1…FR-10, dar regula „același cuvânt nu
apare de două ori la rând" nu e scrisă nicăieri ca pattern.
*Fix:* adaugă pe `hero-word` (sau un pattern „generator") regula: la fiecare tick, alege un cuvânt ≠
cel precedent (când nivelul are ≥2 cuvinte).

### High (5)

**[Component naming] Numele diferă între DESIGN.md și EXPERIENCE.md** — `button-primary` vs „button
play/pause"; `level-segment-active`/`-idle` (DESIGN) vs `level-segment` (EXPERIENCE); `message` apare
în DESIGN dar e orfan în Component Patterns; `fullscreen-button` apare doar în EXPERIENCE.
*Fix:* nume verbatim-identice în ambele fișiere, fiecare componentă cu rând în AMBELE (vizual +
comportamental).

**[A11y] `aria-live="off"` exclude complet utilizatorii de screen-reader** (EXPERIENCE.md › Accessibility).
`off` în timpul playing e apărabil, dar așa cum e scris livrează o excludere totală a singurului output
al app-ului.
*Fix:* fă cuvântul la pauză focusabil/anunțat (focus pe el la pauză) + un toggle opt-in care comută
hero pe `aria-live="polite"`.

**[A11y] Slider-ul n-are nume accesibil / anunț de valoare** (EXPERIENCE.md › speed-slider). Un `range`
gol se anunță „slider, 4" — fără etichetă, fără unitate.
*Fix:* `aria-label="viteză"` + `aria-valuetext="4 secunde"`.

**[A11y] `ink-faint #5A5A66` pică AA ca text — 2.89:1 pe bg** (DESIGN.md › Colors). E spec-uit pentru
sub-textul de loading `se încarcă cuvintele…` și label-uri disabled, care sunt text real.
*Fix:* deschide tokenul la ≥4.5:1 pentru uz pe text, SAU split: glifa-placeholder mare poate rămâne
dim, linia citibilă nu.

**[Inheritance] Mismatch de nume = îmbinare imposibilă mecanic** (consecința tehnică a celor de sus).
Acoperit de fix-ul de component naming.

### Medium (3)

**[A11y] Handlerele globale `Space`/săgeți pot dubla comportamentul nativ** al butonului/slider-ului
(EXPERIENCE.md › Interaction Primitives). *Fix:* scope handlerele (preventDefault doar când focus nu e
deja pe controlul nativ, sau atașează pe controale, nu pe document global).

**[Token] `danger #F0717A` n-are ratio de contrast declarat** (calculat 6.87:1, trece AA).
*Fix:* adaugă ratio-ul în DESIGN.md › Colors lângă celelalte.

**[Source] `prd.md` §4 încă citează paleta portocalie Brutalist moartă** — stale.
*Fix:* actualizează la Nocturn (sau marchează explicit ca istoric).

### Low / minor (9 rubric + 6 a11y)

Detalii în `review-rubric.md` și `review-accessibility.md` (formulări, ratio-uri exacte, touch targets
confirmate ≥44px, reduced-motion ok, lang=ro ok).

## Reviewer files

- `docs/review-rubric.md`
- `docs/review-accessibility.md`
