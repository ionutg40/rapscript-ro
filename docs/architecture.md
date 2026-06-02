---
stepsCompleted: [1, 2, 3, 4]
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

## Core Architectural Decisions

> **Meta-principiu (deasupra tuturor): „Fail loud, never silent."**
> Pe un app fără rețea/backend, riscul #1 nu e crash-ul zgomotos — e **bug-ul tăcut** (merge dar
> greșit, cu date vechi sau font lipsă, fără niciun semnal). Orice degradare TREBUIE să lase un semnal
> vizibil: count META la load, `console.error`, header de fișier auto-generat. Firul care leagă
> D3-META / D4 / D10 / D12. (Reframe: problema reală e „fasty livrează fără să se blocheze și învață".)
>
> _Decizii rafinate prin party mode (Winston/Amelia/John) + advanced elicitation (Failure Mode,
> First Principles, 5 Whys, Constraint Injection, Reframe). ▲ = schimbat față de prima propunere._

### Decision Priority Analysis

- **Critical (block implementation):** D1-D10, D17.
- **Important (shape architecture):** D11-D16, D18.
- **Deferred (post-v1):** textură xerox (moartă la pivot), toggle aria-live continuu, re-leveling fin.
- **N/A (no surface):** Database/persistence server, Authentication, Authorization, API design,
  inter-service comms — aplicația e 100% client static, local-only.

### Data Architecture

- **D1** — Sursa de adevăr a băncii = `assets/wordbank.json` (3 chei nivel: `incepator` / `avansat` /
  `profesionist`, lowercase fără diacritice; 417 cuvinte). Editabil de om. *(First-principles:
  JSON-ca-sursă e o preferință acceptată conștient, nu un adevăr — costul e mărginit prin META-guard.)*
- **D2** — Încărcare FĂRĂ `fetch`: `words.js` expune `const WORD_BANK = {...}`, inclus prin
  `<script src="words.js">`. Motiv: `fetch` pe `file://` pică pe CORS → ar strica portabilitatea
  dublu-click (NFR Portability). Adevăr fundamental, nu preferință.
- **D3 ▲** — `words.js` derivat determinist din JSON printr-un `gen_words.py` care: sortează cheile
  (diff curat), scrie `WORD_BANK` + `WORD_BANK_META = {count, generated}`, și pune header
  `// AUTO-GENERAT din wordbank.json — NU EDITA` **(E1)**. Generatorul e **singurul scriitor** al
  lui `words.js`. `words.js` e **commited în git** (nu gitignored — Pages îl servește). Rulat manual
  la fiecare update de bancă.
- **D4 ▲** — Validare la load: fiecare nivel **≥2 cuvinte** (susține D6) + ne-gol + fără dups
  intra-nivel; **loghează `WORD_BANK_META.count`** la load (semnal vizibil dacă e stale — „fail loud");
  lipsă/mismatch/`undefined` → stare `error` grațioasă.

### Frontend Architecture — State & Rendering

- **D5 ▲** — Un singur obiect `state` = sursa unică de adevăr runtime: `{ word, level, intervalMs,
  intervalId, ready, playing }`. Fără clase, fără framework de state.
- **D6 ▲** — `pickWord(level, prev)`: random fără repetare imediată (FR-3) cu **retry mărginit**
  (`for i<10 && pick===prev`), comparat pe **valoare string**; dacă nivelul are 1 cuvânt → acceptă
  repetarea (zero buclă infinită). Garant D4 (≥2/nivel) + cap de siguranță.
- **D7** — Regula de aur (anti-drift): logica MUTĂ doar `state`; toate scrierile DOM trec prin
  `render()` / `renderWord()`. Niciun handler nu scrie direct în DOM. *(Lecția centrală a proiectului.)*
- **D8** — Event model: handlere cu nume (`handlePlayClick`…), legate cu `addEventListener` la fundul
  `app.js`. Fără `onclick` inline, fără arrow anonime în handlere.
- **D9 ▲** — Un singur `setInterval`; `state.intervalId`; **start idempotent** (`clearInterval`
  necondiționat înainte de fiecare start — fără timere duble la dublu-click play); `renderWord()`
  **sincron la play** (primul cuvânt apare la t=0, nu după un interval); schimbare speed/level la
  `playing` → clear+restart (resetează ceasul, documentat); speed în pauză NU pornește interval.

### Cross-Cutting

- **D10 ▲** — Apărarea la bancă = **guard** (`typeof WORD_BANK === 'undefined'` / META mismatch →
  stare `error`), NU try/catch (script-tag-ul nu aruncă). try/catch DOAR la `JSON.parse`/`setItem`
  localStorage → **defaults silențios** (nu error state). Două căi distincte. Mesaj RO în `messageEl`,
  detaliu în `console.error`, zero `console.log` livrat.
- **D11 ▲** — Fără framework de test în v1; `validate.js` rulat manual acoperă **funcțiile pure**
  (`pickWord`, `clampDelay`, sanity bancă). Documentează explicit **ce NU acoperă** (timer/render →
  `console.assert` guards). Opțional: pre-commit hook ca verificarea să fie neuitabilă.
- **D12 ▲** — Anti-race prin `state.ready` (inițial `false`); un singur `render()` citește `ready`
  → placeholder `–` dimmed + `btn-play-pause` disabled până ready. Fără `disabled` ad-hoc (respectă D7).
- **D13** — `clampDelay()` clampează viteza 2–12s pe slider ȘI pe valoarea citită din localStorage (FR-5).
- **D14 ▲** — Persistență: `localStorage` cheie `rapscript:settings` = `{ v: 1, level, speedSec }`
  (schema versionată din ziua 0); absență/parse-fail → defaults; **validează `level` contra băncii**
  încărcate (fallback default); **wrap și `setItem`** fail-silent (Safari private mode aruncă) **(E2)**;
  scrie pe `change`, nu `input` (anti-spam la drag).
- **D15** — Fullscreen: feature-detect Fullscreen API; ascunde `btn-fullscreen` dacă lipsește;
  degradare pseudo-fullscreen CSS pe iPhone (FR-8).
- **D16 ▲** — Motion: tranziție `translateY+opacity ~140ms` (doar transform+opacity); render nou
  **întrerupe** animația curentă (set instant, fără coadă/flicker); `prefers-reduced-motion` → instant.

### Infrastructure & Deployment

- **D17 ▲** — Host: GitHub Pages, branch `main`, path `/`, sub `/rapscript-ro/`. **Căi RELATIVE**
  peste tot (`href="style.css"`, nu `/style.css`). `.nojekyll` gol în root (oprește Jekyll).
  **Cache-bust** `words.js?v=<count>` (Pages + browser cache servesc stale — semnal tăcut altfel).
- **D18 ▲** — **Self-host woff2** (Fraunces serif hero + IBM Plex Mono UI) în `assets/fonts/` via
  `@font-face`, subset latin+latin-ext, `font-display: swap`; zero request extern (coerent cu D2
  offline). `font-family` consumator are **fallback explicit** (serif / monospace) ca un woff2 lipsă
  să degradeze la text citibil, nu invizibil **(E3)**. `lang="ro"` pe `<html>`.
  **Criteriu de acceptare gating (E4):** pe site-ul live, cu `lang=ro`, `ș/ț` se randează comma-below
  (NU sedilă) — verificat, nu presupus. Toată valoarea vizuală depinde de asta (5 Whys).

### Decision Impact Analysis

**Implementation sequence:** D17 (skeleton live gol) → D1-D4 (date + generator + guard) →
D5-D9 (inima: state, pick, render, timer) → D12-D16 (controale + degradări) → D10-D11 (robustețe).

**Cross-component dependencies:** D2 forțează D3 (generator) → D3-META alimentează D4 (semnal stale);
D7 e contractul pe care se sprijină tot pasul 5 (Implementation Patterns); D5 e referit de
D6/D9/D12/D14; meta-principiul „fail loud" leagă D3-META/D4/D10/D12.

**Gotchas de dus în `gotchas.md` (Epic 7):** setInterval throttling în tab de fundal → cuvinte în
rafală la refocus (acceptabil v1) **(E6)**; plus cele din groundwork §5 (căi relative, `.nojekyll`,
lowercase ASCII, cache Fastly).
