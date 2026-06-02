---
stepsCompleted: [1, 2, 3]
inputDocuments:
  - docs/brief.md
  - docs/addendum.md
  - docs/prd.md
  - docs/groundwork.md
  - docs/DESIGN.md
  - docs/EXPERIENCE.md
  - docs/ux-decisions.md
  - docs/architecture.step5-draft.md
  - docs/validation-report.md
workflowType: 'architecture'
project_name: 'RapScript RO'
user_name: 'fasty'
date: '2026-06-02'
---

# Architecture Decision Document — RapScript RO

_Acest document se construiește colaborativ, pas cu pas. Secțiunile se adaugă pe măsură ce
parcurgem împreună fiecare decizie de arhitectură._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:** 10 FR în 4 categorii — Generator (FR-1 afișare cuvânt random,
FR-2 schimbare la interval, FR-3 fără repetare imediată), Controale (FR-4 play/pause, FR-5 viteză,
FR-6 nivel dificultate, FR-7 persistență localStorage), Prezentare (FR-8 fullscreen cu degradare,
FR-9 responsive), Conținut (FR-10 word bank RO 417 cuvinte / 3 niveluri). Arhitectural: o singură
„entitate de stare" (cuvânt curent + nivel + interval + playing/paused), zero entități de domeniu.

**Non-Functional Requirements:**
- **Portability (driver #1):** rulează la dublu-click pe `file://` ȘI live pe GitHub Pages →
  INTERZICE `fetch()` pe word bank (CORS pe `file://`); banca se încarcă ca `words.js` (`const`).
- **Maintainability:** date (word bank) separate de logică; `words.js` derivat determinist din
  `assets/wordbank.json`, nu copie tastată.
- **Privacy:** local-only, zero network în afară de fonturi web, fără cont/cloud/tracking.
- **Performance:** schimbare instant; `setInterval` precizie de secundă (nu frame-perfect).
- **Accessibility:** contrast AA (verificat în DESIGN.md), a11y floor în EXPERIENCE.md
  (tastatură, focus-visible, lang=ro, aria-live opt-in, reduced-motion).
- **Reliability:** refuz fullscreen (iOS) și lipsă localStorage NU crapă app-ul (degradare).

**Scale & Complexity:**
- Primary domain: frontend web static (vanilla HTML/CSS/JS, zero build, zero backend).
- Complexity level: **scăzută** — inima ~40 linii; riscul e în portabilitate/deploy, nu algoritmic.
- Estimated architectural components: ~7 (hero-word, timer-bar, btn-play-pause, btn-fullscreen,
  speed-slider, level-segment, message) + 1 modul date (words.js) + 1 modul logică (app.js).

### Technical Constraints & Dependencies

- Stack fixat (groundwork): vanilla HTML/CSS/JS pur, zero dependințe/framework/build.
- Deploy: GitHub Pages sub subfolder `/rapscript-ro/` → căi RELATIVE obligatorii; `.nojekyll` în root.
- `words.js` derivat din `wordbank.json` (NU fetch); fonturi: Fraunces + IBM Plex Mono (verificare
  diacritice comma-below la build).
- Fullscreen API: no-op pe iPhone pt. elemente arbitrare → feature-detect + degradare CSS.

### Cross-Cutting Concerns Identified

Portabilitate `file://`↔Pages · randare diacritice RO (`lang="ro"`) · accesibilitate (a11y floor) ·
degradare grațioasă (fullscreen / localStorage / load bank) · responsive (clamp) · reduced-motion.

## Starter Template Evaluation

### Primary Technology Domain

Frontend web static — vanilla HTML/CSS/JS. Domeniu identificat din PRD (NFR Portability/Privacy)
+ groundwork §3.

### Starter Options Considered

Evaluate și RESPINSE deliberat (toate ascund exact lecția — DOM-ul real):
- **Vite / vanilla-ts template** — respins: introduce build step, `node_modules`, `npm install`
  care poate eșua în ziua 1. Overkill pentru ~40 linii de logică.
- **Next.js / React / SvelteKit** — respins: framework greu pentru un singur ecran fără rute,
  fără state complex, fără server. Ar ascunde fundamentele (HTML schelet → CSS aspect → JS comportament).
- **GitHub Pages Jekyll default** — respins ca generator; folosim Pages DOAR ca static host
  (`.nojekyll` oprește Jekyll).

### Selected Starter: NICIUNUL (vanilla, zero-build)

**Rationale for Selection:**
Decizie pedagogică + tehnică. fasty învață web dev — vede rezultatul fără nimic între el și browser.
Tehnic: zero-build = zero dependințe de versiune, zero `npm install` care eșuează, portabilitate
`file://` garantată (dublu-click rulează). Inima e trivială; un starter ar adăuga doar suprafață de eșec.

**Initialization Command:**

```bash
# Niciun CLI de starter. Repo-ul EXISTĂ deja (groundwork §5):
# github.com/ionutg40/rapscript-ro (2 commits, main↔origin, tree clean, README + .gitignore).
# „Init" = adăugarea fișierelor sursă peste structura existentă (vezi pasul Structură).
```

**Architectural Decisions Provided by Starter:** N/A — le luăm noi explicit în pașii următori.

**Dependențe externe (singurele):**
- Fonturi web Google Fonts: **Fraunces** (serif hero) + **IBM Plex Mono** (UI). Ambele verificate
  2026-06-02: suportă RO/Latin Extended. Build-check: randare comma-below `ș/ț` cu `lang="ro"`.
- Niciun pachet npm, niciun framework, niciun runtime.

**Note:** „Project initialization" ca primă story = adăugarea fișierelor + `.nojekyll` + activare Pages,
NU `gh repo create` (repo-ul există).
