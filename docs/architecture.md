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

- **D1 ▲** — Sursa de adevăr a băncii = `assets/wordbank.json`. **Structură reală (verificată):**
  `{ meta, rubrics, levels: { incepator, avansat, profesionist } }` — cele 3 niveluri sunt sub cheia
  `levels` (NU la top-level), valori = array de stringuri lowercase fără diacritice; 417 cuvinte
  (136/154/127). `meta`/`rubrics` sunt metadate, NU niveluri. Editabil de om. *(First-principles:
  JSON-ca-sursă e o preferință acceptată conștient, nu un adevăr — costul e mărginit prin META-guard.)*
- **D2** — Încărcare FĂRĂ `fetch`: `words.js` expune `const WORD_BANK = {...}`, inclus prin
  `<script src="words.js">`. Motiv: `fetch` pe `file://` pică pe CORS → ar strica portabilitatea
  dublu-click (NFR Portability). Adevăr fundamental, nu preferință.
- **D3 ▲** — `words.js` derivat determinist din JSON printr-un `gen_words.py` care: citește
  **`d['levels']`** (ignoră `meta`/`rubrics`), sortează cheile (diff curat), **asertă disjuncție
  cross-nivel** (fail loud dacă un cuvânt apare în 2 niveluri), scrie `WORD_BANK` (cele 3 array-uri) +
  `WORD_BANK_META = {count, hash, generated}` unde **`count` = suma lungimilor nivelurilor**
  (derivat, NU copiat din `meta.counts` care poate driftà), și pune header `// AUTO-GENERAT din
  wordbank.json — NU EDITA` **(E1)**. Generatorul e **singurul scriitor** al lui `words.js`.
  `words.js` e **commited în git** (nu gitignored — Pages îl servește). Rulat manual la fiecare update.
- **D4 ▲** — Validare la load: fiecare nivel **≥2 cuvinte** (susține D6) + ne-gol + fără dups
  intra-nivel; **loghează `WORD_BANK_META.count`** la load (semnal vizibil dacă e stale — „fail loud");
  lipsă/mismatch/`undefined` → stare `error` grațioasă.

### Frontend Architecture — State & Rendering

- **D5 ▲** — Un singur obiect `state` = sursa unică de adevăr runtime. Câmpuri curente:
  `{ word, level, intervalMs, intervalId, ready, playing, error, errorMessage }` (`error`/`errorMessage`
  adăugate ca starea de eroare să fie exprimabilă prin `render`, nu prin scrieri DOM ad-hoc). Fără
  clase, fără framework de state. *(Lista de câmpuri e descriptivă — vezi Tier 2; contractul e „un
  singur obiect state = sursă unică", nu cele exact-N chei.)*
- **D6 ▲** — `pickWord(bankArray, currentWord)`: primește **array-ul nivelului** (caller-ul indexează
  `WORD_BANK[state.level]`), random fără repetare imediată (FR-3) cu **retry mărginit**
  (`for i<10 && pick===currentWord`), comparat pe **valoare string**; dacă array-ul are 1 cuvânt →
  acceptă repetarea (zero buclă infinită). Parametrul de excludere îl face testabil în `validate.js`.
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
  **Cache-bust** `words.js?v=<hash>` unde `<hash>` = `WORD_BANK_META.hash`/`generated` (NU `count` —
  edit cu count constant, ex. typo-fix, ar servi stale tăcut; dovedit de fixes-log-ul băncii).
- **D18 ▲** — **Self-host woff2** (Fraunces serif hero + IBM Plex Mono UI) în `assets/fonts/` via
  `@font-face`, subset latin+latin-ext, `font-display: swap`; zero request extern (coerent cu D2
  offline). `font-family` consumator are **fallback explicit** (serif / monospace) ca un woff2 lipsă
  să degradeze la text citibil, nu invizibil **(E3)**. `lang="ro"` pe `<html>`.
  **Criteriu de acceptare gating (E4):** pe site-ul live, cu `lang=ro`, `ș/ț` se randează comma-below
  (NU sedilă) — verificat, nu presupus. Toată valoarea vizuală depinde de asta (5 Whys).
  **Semnal fail-loud (woff2 404):** un fallback care randează vizibil dar cu sedilă ar înfrânge TĂCUT
  E4 → la load, `document.fonts.ready`/`.check()` pentru Fraunces; dacă lipsește → `console.warn`
  (eventual marcaj discret). Mută E4 din „verificat manual" în check rulabil.

### Decision Impact Analysis

**Implementation sequence:** D17 (skeleton live gol) → D1-D4 (date + generator + guard) →
D5-D9 (inima: state, pick, render, timer) → D12-D16 (controale + degradări) → D10-D11 (robustețe).

**Cross-component dependencies:** D2 forțează D3 (generator) → D3-META alimentează D4 (semnal stale);
D7 e contractul pe care se sprijină tot pasul 5 (Implementation Patterns); D5 e referit de
D6/D9/D12/D14; meta-principiul „fail loud" leagă D3-META/D4/D10/D12.

**Gotchas de dus în `gotchas.md` (Epic 7):** setInterval throttling în tab de fundal → cuvinte în
rafală la refocus (acceptabil v1) **(E6)**; plus cele din groundwork §5 (căi relative, `.nojekyll`,
lowercase ASCII, cache Fastly).

## Implementation Patterns & Consistency Rules

> Rafinate prin Code Review Gauntlet (Amelia vs Winston) + baterie de 8 metode (workflow). **Două tiere.**
> **Contractele** se respectă sub sancțiune (le încalci → cod incompatibil / bug). **Convențiile** sunt
> preferințe de stil — un agent le ghicește corect din context. Nu le pune pe același raft.

Conflict points: 6 (naming JS · clase CSS · refs DOM · format erori · loading · comentarii).
N/A (nu există): DB naming, API endpoints, event systems custom, state libs, response wrappers.

### TIER 1 — Contracte (încalci → rupi codul)

**Golden rule & forma handlerului**
- Logica MUTĂ doar `state`; DOM se scrie DOAR prin `render(state)`.
- **Trei lumi de efecte, nu două:** (1) mutație `state`; (2) `render(state)` pentru DOM; (3) **effect
  helpers** pentru efecte care nu-s nici state nici DOM — timer (`restartTimer`/`stopTimer`),
  persistență (`saveSettings`), Fullscreen API. `render` NU atinge niciodată `setInterval`/
  `clearInterval`/`localStorage`/Fullscreen API.
- **Forma canonică a oricărui handler:** `mutate state → effect helpers → render()`. Un singur
  `render()`, la final.

**render(state)**
- Idempotent, citește tot `state`, chemat la finalul handlerului. Un singur punct de scriere DOM —
  NU există `renderWord()` separat (asta-i tot; fără teoreme „unique/no-mid-handler", vezi Tier 2).
- Scrie: cuvântul, clasele `is-*` (prin `classList.toggle('is-x', state.x)` — exclusivitate din state),
  etichetele, `messageEl`.
- **Animă hero DOAR când `state.word` s-a schimbat** (compară cu un `prevWord` render-local) — altfel
  orice render de control (pauză/viteză/nivel) ar re-declanșa tranziția de 140ms = flicker tăcut.
  Restul scrierilor rămân necondiționate/idempotente.
- **NU scrie `value` pe un control care e `activeElement`/în drag** (altfel smucește slider-ul la tick).
- **`messageEl` în non-error:** golit (sau hint `color-info`); `is-error` se stinge la recovery prin
  `classList.toggle('is-error', state.error)`.
- **timer-bar** = CSS `animation` (`animation-duration: var(--interval)`); render o resetează la
  schimbare prin toggle/reflow de clasă; pauză = `animation-play-state:paused` din `state.playing`.

**Timp & unități**
- ms intern, secunde în UI. Conversie sec→ms **într-un singur loc** (`handleSpeedChange:
  clampDelay(slider.value*1000)`). `clampDelay(ms)` STRICT pe ms; **non-finit → `DEFAULT_DELAY`**
  (`if(!Number.isFinite(ms)) return DEFAULT_DELAY` — apără de `speedSec` garbage din localStorage).
  `MIN_DELAY=2000`, `MAX_DELAY=12000`, `DEFAULT_DELAY=4000`. localStorage stochează `speedSec`.

**Timer (D9)**
- `state.playing` = **unica** sursă pentru running/paused. `restartTimer()` =
  `clearInterval(state.intervalId); if(state.playing){ state.intervalId = setInterval(handleTick,
  state.intervalMs) }` — NU cheamă `render` și NU trage un tick sincron (altfel dublu-render). Pe
  pauză: `clearInterval` + `state.intervalId = null`. Primul cuvânt la t=0 vine din `render()`-ul
  handlerului de play, nu din timer.

**Selecție** — `pickWord(bankArray, currentWord)` (vezi D6): caller-ul indexează `WORD_BANK[state.level]`.

**Evenimente**
- Elemente **statice** în `index.html`. Handlere cu nume, `addEventListener` la fundul `app.js` (D8).
- Boot: cache refs → **guard refs** (`Object.values(refs).every(Boolean)`; vreunul `null` →
  `console.error` + `is-error` dacă `messageEl` există) → validează bancă → `state.ready` → `render()`
  → attach listeners. `render()` presupune toate refs non-null.
- `handleLevelClick`: `const seg = e.target.closest('.level-segment'); if(!seg) return;` apoi
  `seg.dataset.level` (guard pe click în gap/padding).

**Erori & persistență (fail loud)**
- Guard bancă (D10): `typeof WORD_BANK==='undefined'`/META mismatch → `state.error=true` +
  `state.errorMessage` → `render()` (care setează `is-error` + scrie `messageEl`). Pe eroare de bancă
  `state.ready` rămâne `false` (play disabled). Fără scrieri DOM ad-hoc în guard.
- try/catch DOAR la `JSON.parse` + `setItem` localStorage → defaults silențios (D14).
- localStorage `{v:1, level, speedSec}`; `v!==1` → defaults; validează `level` contra băncii;
  `speedSec` non-numeric → tratat ca absent (default).

**Fullscreen — excepție explicită**
- `handleFullscreen` apelează direct Fullscreen API (stare de browser) → excepție de la golden rule.
  DACĂ oglindești `state.fullscreen` pentru etichetă, EȘTI OBLIGAT să adaugi un listener
  `fullscreenchange` care actualizează state + `render()` (Esc/exit nativ nu cheamă handler-ul).
  Oglindirea fără listener = jumătate de măsură interzisă.

**Format date** — `wordbank.json` `{meta, rubrics, levels}` (D1); `words.js` AUTO-GENERAT de
`gen_words.py` (singurul scriitor, citește `levels`, header, META `{count,hash,generated}` — D3).

**CSS tokens** — în `:root`: `--color-*`, `--space-*`, `--font-*`, `--radius-*`, `--duration-*`;
stările ca sufix (`--color-accent-hover`). Culori + spacing recurent = vars; one-off-uri inline OK.

### TIER 2 — Convenții (preferință; ghici din context la dubii)

- JS `camelCase`; config `UPPER_SNAKE` sus. Refs DOM sufix `El`/`Btn` (`wordEl`, `playBtn`…);
  handlere prefix `handle`. Fără clase la scara asta. Clase CSS `kebab-case` = nume DESIGN.md;
  fișiere lowercase ASCII.
- **`console.log` liber în dev** (instrument de învățare); curățare opțională via git hook.
- **`console.assert`** pentru invarianți = dev-aid opțional, NU contract (ex:
  `console.assert(!state.ready || state.word !== '', ...)`).
- **Lista exactă de câmpuri `state`** = documentație; contractul e „un singur obiect state = sursă
  unică", nu cele exact-N chei (adăugarea `state.fullscreen` nu rupe nimic).
- **Event delegation vs listener-per-segment** = alegerea ta (3 butoane statice, oricare merge);
  dacă delegezi, ține guard-ul `closest()`.

### Enforcement

Agenții respectă **Contractele** (Tier 1); Convențiile (Tier 2) sunt default. Comentarii RO scurte,
DE CE. ARIA: `playBtn` comută `aria-pressed`+`aria-label` (EXPERIENCE.md a11y floor). Hero:
`overflow-wrap:break-word; hyphens:auto` (cu `lang=ro`) ca un cuvânt RO lung să nu depășească
viewport-ul îngust sub clamp-floor.

### Examples

**`handleTick`** (singura buclă care schimbă cuvântul):
```js
state.word = pickWord(WORD_BANK[state.level], state.word);
render(); // animă hero — word changed
```
**`handleSpeedChange`** (NU schimbă cuvântul):
```js
state.intervalMs = clampDelay(slider.value * 1000);
saveSettings();
if (state.playing) restartTimer();
render();
```
**Anti-pattern:** `wordEl.textContent = ...` direct în handler (sare peste state/pickWord/render →
pierzi FR-3); SAU `render()` de două ori în același handler; SAU `restartTimer()` care trage un tick
sincron PLUS render-ul de la finalul handlerului = dublu-render.
