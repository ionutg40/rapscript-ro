---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-06-02'
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
- Fonturi: **Fraunces** (serif hero) + **IBM Plex Mono** (UI), **self-host woff2** (D18). 2026-06-02:
  **suport de limbă RO confirmat doar la nivel de catalog Google Fonts** — randarea reală comma-below
  `ș/ț` pe woff2-ul subset NU e încă verificată cu fonttools (verificarea din groundwork §81 era pe
  Archivo Black, fontul mort). ⚠️ **Primul task de implementare** = fonttools pe Fraunces real (vezi D18/E4).
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
  **`d['levels']`** (ignoră `meta`/`rubrics`), sortează cheile (diff curat), **validează banca**
  (niveluri ne-goale, ≥2 cuvinte, fără dups intra+cross-nivel) și **refuză să scrie pe date stricate**
  (date proaste = ne-livrabile), scrie **`WORD_BANK` ca OBIECT** `{ incepator:[…], avansat:[…],
  profesionist:[…] }` (NU array plat — `state.level` îl indexează direct) + `WORD_BANK_META =
  {count, hash, generated}` (`count` = suma nivelurilor, derivat NU din `meta.counts`; **`hash` =
  sha256 pe JSON-ul canonic al `levels`**, sortat — același calcul în `--check`), header
  `// AUTO-GENERAT din wordbank.json — NU EDITA` **(E1)**. NU atinge `index.html` (un script care
  rescrie fișierul sursă principal cu regex = footgun pe fișier ne-regenerabil — scos). Mod **`--check`**:
  recalculează hash din `wordbank.json`, compară cu META din `words.js`, exit non-zero la mismatch
  (prinde „uitat regenerat" ȘI „editat de mână"). Singurul scriitor al `words.js`; `words.js`
  **commited** (nu gitignored — Pages îl servește).
- **D4 ▲** — Validare la load: fiecare nivel **≥2 cuvinte** (susține D6) + ne-gol + fără dups
  intra-nivel; **loghează `WORD_BANK_META.count`** la load (semnal vizibil dacă e stale — „fail loud");
  lipsă/mismatch/`undefined` → stare `error` grațioasă.

### Frontend Architecture — State & Rendering

- **D5 ▲** — Un singur obiect `state` = sursa unică de adevăr runtime. Câmpuri curente:
  `{ word, level, intervalMs, intervalId, ready, playing, error, errorMessage }` (`error`/`errorMessage`
  adăugate ca starea de eroare să fie exprimabilă prin `render`, nu prin scrieri DOM ad-hoc). Fără
  clase, fără framework de state. *(Lista de câmpuri e descriptivă — vezi Tier 2; contractul e „un
  singur obiect state = sursă unică", nu cele exact-N chei.)*
  **Tipuri & inițiale:** `level` = **cheie string** (`'incepator'`/`'avansat'`/`'profesionist'`), NU
  index numeric — match cheile `WORD_BANK`. Inițiale la boot: `word=''`, `ready=false`, `playing=false`,
  `error=false`, `intervalId=null`, `level`/`intervalMs` din localStorage sau defaults.
  **`WORD_BANK` = obiect** `{ incepator:[…], avansat:[…], profesionist:[…] }` (NU array plat) — `state.level`
  îl indexează direct.
- **D6 ▲** — `pickWord(bankArray, currentWord)`: primește **array-ul nivelului** (caller-ul indexează
  `WORD_BANK[state.level]`), random fără repetare imediată (FR-3) cu **retry mărginit**
  (`for i<10 && pick===currentWord`), comparat pe **valoare string**; pe array de **exact 2** → pick
  determinist celălalt (garantat ≠); pe array de 1 → acceptă repetarea (zero buclă infinită).
  Parametrul de excludere îl face testabil prin `?test=1` (D11).
- **D7** — Regula de aur (anti-drift): logica MUTĂ doar `state`; toate scrierile DOM trec prin
  `render(state)` (un singur punct, fără `renderWord()` separat — vezi Implementation Patterns). Niciun
  handler nu scrie direct în DOM. *(Lecția centrală a proiectului.)*
- **D8** — Event model: handlere cu nume (`handlePlayClick`…), legate cu `addEventListener` la fundul
  `app.js`. Fără `onclick` inline, fără arrow anonime în handlere.
- **D9 ▲** — Un singur `setInterval`; `state.intervalId`; **start idempotent** (`clearInterval`
  necondiționat înainte de fiecare start — fără timere duble la dublu-click play); `render()`
  **sincron la play** (primul cuvânt apare la t=0, nu după un interval); schimbare speed/level la
  `playing` → clear+restart (resetează ceasul, documentat); speed în pauză NU pornește interval.

### Cross-Cutting

- **D10 ▲** — Apărarea la bancă = **guard** (`typeof WORD_BANK === 'undefined'` / META mismatch →
  stare `error`), NU try/catch (script-tag-ul nu aruncă). try/catch DOAR la `JSON.parse`/`setItem`
  localStorage → **defaults silențios** (nu error state). Două căi distincte. Mesaj RO în `messageEl`,
  detaliu în `console.error`, zero `console.log` livrat.
- **D11 ▲** — Fără framework de test ȘI **fără Node** (ar contrazice „zero npm / dublu-click `file://`"
  și user-ul n-are Node). Verificarea în 3 straturi, toate fără runtime nou: (1) **sanity bancă** în
  `gen_words.py` (Python, build-time, refuză date proaste — D3); (2) **teste funcții pure**
  (`pickWord`, `clampDelay`) **în browser via `?test=1`** în index.html (bloc inline, zero Node);
  (3) **freshness gate** `gen_words.py --check`. **Gate-ul real = GitHub Action** care rulează `--check`
  pe push (ne-sărit, pe serverul GitHub, indiferent ce face local). Pre-commit hook-ul local
  (`.githooks/pre-commit` commited + `core.hooksPath .githooks`) e **opțional/convenience** (feedback mai
  rapid), NU obligatoriu — și se adaugă DUPĂ primul ship (sequencing). Documentează ce NU acoperă
  (timer/render → `console.assert` dev-aid). *(Scos `validate.js` ca fișier Node separat.)*
- **D12 ▲** — Anti-race prin `state.ready` (inițial `false`); un singur `render()` citește `ready`
  → placeholder `–` dimmed + `btn-play-pause` disabled până ready. Fără `disabled` ad-hoc (respectă D7).
  **Primul cuvânt:** după validare → `ready=true`, boot face `state.word = pickWord(WORD_BANK[state.level],
  '')` ca scena să arate un cuvânt în starea ready/paused (NU goală — EXPERIENCE cere un cuvânt vizibil
  după load). Play pornește timer-ul de acolo (D9).
- **D13** — `clampDelay()` clampează viteza 2–12s pe slider ȘI pe valoarea citită din localStorage (FR-5).
- **D14 ▲** — Persistență: `localStorage` cheie `rapscript:settings` = `{ v: 1, level, speedSec }`
  (schema versionată din ziua 0); absență/parse-fail → defaults; **validează `level` contra băncii**
  încărcate — dacă `level` nu e cheie validă în `WORD_BANK`, **fallback `'incepator'`** (match inițial);
  **wrap și `setItem`** fail-silent (Safari private mode aruncă) **(E2)**;
  `speedSec` non-numeric → tratat ca absent. **Slider, două canale (rezolvă contradicția cu
  EXPERIENCE):** evenimentul `input` → DOAR actualizare text-valoare live (prin `render`); evenimentul
  `change` → `clampDelay` + `saveSettings` + (dacă `playing`) `restartTimer` (persistă + repornește o
  dată, anti-spam la drag).
- **D15** — Fullscreen: feature-detect Fullscreen API; ascunde `btn-fullscreen` dacă lipsește;
  degradare pseudo-fullscreen CSS pe iPhone (FR-8).
- **D16 ▲** — Motion: tranziție `translateY+opacity ~140ms` (doar transform+opacity); render nou
  **întrerupe** animația curentă (set instant, fără coadă/flicker); `prefers-reduced-motion` → instant.

### Infrastructure & Deployment

- **D17 ▲** — Host: GitHub Pages, branch `main`, path `/`, sub `/rapscript-ro/`. **Căi RELATIVE**
  peste tot (`href="style.css"`, nu `/style.css`). `.nojekyll` gol în root (oprește Jekyll).
  **Fără cache-bust `?v=`** (scos): pe un static de 3 fișiere nu merită un script care editează
  `index.html`. Pages invalidează cache-ul la fiecare deploy; pentru staleness de browser local =
  gotcha „hard-refresh/incognito" (groundwork §5). Freshness-ul codului-sursă e garantat de
  `gen_words.py --check` (D3), nu de query string.
- **D18 ▲** — **Self-host woff2** (Fraunces serif hero + IBM Plex Mono UI) în `assets/fonts/` via
  `@font-face`, `font-display: swap`; zero request extern (coerent cu D2 offline). **Un singur fișier
  per familie, subset pe AMBELE range-uri latin+latin-ext** (orice cuvânt RO poate avea diacritice →
  range-splitting nu câștigă nimic); nume `fraunces-ro.woff2` / `ibm-plex-mono-ro.woff2` (NU
  `-latin-ext`, care ar implica felia fără ASCII). `font-family` consumator are **fallback explicit**
  (serif / monospace) ca un woff2 lipsă să degradeze la text citibil, nu invizibil **(E3)**.
  `lang="ro"` pe `<html>`.
  **Criteriu de acceptare gating (E4) — PRIMUL task de implementare, înainte de orice CSS:**
  toată valoarea vizuală depinde ca Fraunces să randeze `ș/ț` **comma-below** (NU sedilă) (5 Whys).
  Capcana reală: serif-urile editoriale au comma-below des DOAR prin feature-ul OpenType `locl`, iar
  `pyftsubset` îl ARUNCĂ dacă nu-l ceri. Deci la subset: cere **code-point-urile direct**
  (`--unicodes=U+0218-021B,U+0102,U+0103,U+00C2,U+00E2,U+00CE,U+00EE,…`) **+** `--layout-features='*'`
  (păstrează `locl`). Apoi verifică cu fonttools că `U+0219`/`U+021B` (Scommaaccent/Tcommaaccent) sunt
  în `cmap`. Dacă lipsesc → **schimbă fontul ACUM**, nu după ce-i scris CSS-ul. E4 = test de glifă
  RANDATĂ, nu doar prezență code-point.
  **Semnal fail-loud (woff2 404):** un fallback care randează vizibil dar cu sedilă ar înfrânge TĂCUT
  E4 → la load, `document.fonts.check('12px Fraunces')` (size OBLIGATORIU, altfel fals-negativ); dacă
  lipsește → `console.warn` (eventual marcaj discret).

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
  **Semnătură:** `state` e global de modul; funcția se cheamă `render()` fără argument; „`render(state)`"
  în doc e shorthand conceptual, nu parametru.
- Scrie: cuvântul, clasele `is-*` (prin `classList.toggle('is-x', state.x)` — exclusivitate din state),
  etichetele, **`aria-valuetext` pe slider** (`"<N> secunde"` — a11y floor, EXPERIENCE.md), `messageEl`.
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
DE CE. ARIA: `playBtn` comută `aria-pressed`+`aria-label`; slider `aria-valuetext` (EXPERIENCE.md
a11y floor). **Focus-pe-pauză-hero rămâne în v1** (`tabindex` + anunțat ca text la pauză) — DOAR
toggle-ul `aria-live` continuu e deferat; nu tăia tot pachetul SR. Hero:
`overflow-wrap:break-word; hyphens:auto` (cu `lang=ro`) ca un cuvânt RO lung să nu depășească
viewport-ul îngust sub clamp-floor.

### Tabel de echivalențe nume (DESIGN ↔ HTML ↔ JS)

Închide deriva de denumire între straturi (Paige). Componenta DESIGN.md = clasă/`id` HTML kebab-case;
ref JS = camelCase + sufix `El`/`Btn`.

| Componentă (DESIGN/EXPERIENCE) | `id`/clasă HTML | Ref JS |
|---|---|---|
| hero-word | `id="hero-word"` | `wordEl` |
| timer-bar | `id="timer-bar"` | `timerBarEl` |
| btn-play-pause | `id="btn-play-pause"` | `playBtn` |
| btn-fullscreen | `id="btn-fullscreen"` | `fullscreenBtn` |
| speed-slider | `id="speed-slider"` | `speedSlider` |
| level-segment (×3) | `.level-segment[data-level]` în `#level-segments` | `levelSegmentsEl` |
| message | `id="message"` | `messageEl` |

_Notă serie E: `E5` nu există (retras la consolidare); seria utilă e E1–E4 + E6._

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

## Project Structure & Boundaries

### Complete Project Directory Structure

```
rapscript-ro/
├── .nojekyll              # GOL — oprește Jekyll pe Pages (D17)
├── .gitattributes         # *.woff2 -text -diff (binar safe; altfel LFS/text → 0 bytes pe Pages)
├── .gitignore             # + comentariu: words.js e generat dar TREBUIE commited
├── README.md              # există
├── index.html             # <html lang="ro">; <script src="words.js"> ÎNAINTE de app.js;
│                          #   bloc de teste inline activat prin ?test=1 (pickWord/clampDelay)
├── style.css              # :root tokens Nocturn + @font-face + componente (DESIGN.md)
├── app.js                 # state, render(), pickWord, clampDelay, handlere, boot
├── words.js               # AUTO-GENERAT — NU EDITA; COMMITED (Pages îl servește)
├── .githooks/pre-commit   # commited; rulează gen_words.py --check (git config core.hooksPath .githooks)
├── .github/workflows/     # CI: gen_words.py --check pe push (gate ne-sărit)
├── gen_words.py           # build: levels → WORD_BANK+META; validează+refuză date proaste;
│                          #   --check freshness; owner words.js ȘI hash index.html (D3/D11)
├── assets/
│   ├── wordbank.json      # SURSA de adevăr (D1): {meta, rubrics, levels{...}}
│   └── fonts/
│       ├── fraunces-ro.woff2          # serif hero, subset latin+latin-ext (D18)
│       └── ibm-plex-mono-ro.woff2     # UI mono, subset latin+latin-ext (D18)
└── docs/                  # planning artifacts (public pe Pages — repo public oricum)
```

> NU mai există `validate.js` — verificarea s-a mutat în `gen_words.py` (sanity) + `?test=1` în browser
> (funcții pure), fără Node (D11).

### Architectural Boundaries

Singura graniță reală = **DATELE (build-time):** `wordbank.json` → `gen_words.py` → `words.js`,
direcție unică (words.js auto-generat, niciodată editat invers). **N/A:** API / service / DB / auth
boundaries — nu există. **Runtime (un singur strat):** `state` (sursă) → `render(state)` (DOM) →
effect helpers (timer / persistență / fullscreen). Vezi Implementation Patterns.

### Decizii de layout (rațiune explicită)

- **Flat root (nu `tools/`):** deliberat, pentru învățare — un începător vede toate fișierele dintr-o
  privire; un folder de tooling adaugă o cale de gândit pentru ~zero câștig. Granița build/runtime
  trăiește în fluxul de date, NU în layout-ul de foldere.
- **Split 3-fișiere (html/css/js) = scaffold pedagogic, NU necesitate tehnică.** Single-file inline ar
  fi la fel de portabil (`file://` + Pages), poate mai robust (un punct de cale-relativă + cache mai
  puțin). Split-ul se justifică DOAR ca separare de concerns pentru învățare — nu-l re-justifica pe
  „performanță"/„caching" (nu se aplică unui static de 3 fișiere).

### Requirements to Structure Mapping

| FR | Trăiește în |
|---|---|
| FR-1/2/3 generator | `app.js` (`pickWord`, `handleTick`, `render`) |
| FR-4 play/pause | `app.js` `handlePlayClick` + `index.html` `btn-play-pause` |
| FR-5 viteză | `app.js` `handleSpeedChange`/`clampDelay` + `index.html` `speed-slider` |
| FR-6 nivel | `app.js` `handleLevelClick` + `index.html` `level-segment` |
| FR-7 persistență | `app.js` `saveSettings`/`loadSettings` (localStorage) |
| FR-8 fullscreen | `app.js` `handleFullscreen` + `index.html` `btn-fullscreen` |
| FR-9 responsive | `style.css` (clamp, media queries) |
| FR-10 word bank | `assets/wordbank.json` → `words.js` (`gen_words.py`) |

### Development Workflow

- **Dev:** dublu-click `index.html` (`file://`, fără server). **Teste:** `index.html?test=1` (browser,
  fără Node) rulează asserturile pe `pickWord`/`clampDelay`.
- **Update bancă:** editezi `wordbank.json` → `python gen_words.py` (validează, scrie `words.js`) →
  commit ambele.
- **Gate:** pre-commit hook (`.githooks/`) + CI Action rulează `gen_words.py --check` (freshness —
  prinde uitat-regenerat / editat-de-mână).
- **Deploy:** push `main` → GitHub Pages servește din root sub `/rapscript-ro/`.

### Sequencing (ordinea de livrare — nu front-loada pipeline-ul)

Skeleton live + `gen_words.py` **simplu** (citește JSON → scrie words.js) ÎNTÂI; adaugă `--check`,
pre-commit hook, CI Action DOAR după ce s-a livrat primul cuvânt pe ecran (lasă durerea „uitat
regenerat" să apară o dată). `gotchas.md` se umple PE PARCURS, nu retroactiv (SM-2). **Primul task
absolut:** verifică Fraunces cu fonttools (D18/E4) înainte de orice CSS.

> **⚠️ Cum citești documentul ăsta (anti-over-implementation):** e dens fiindcă a trecut prin multe
> runde de stres-test — dar **nu toate regulile sunt egale.** Ship-blockers reale: **D1-D10 + D17**
> (date, inimă, deploy). Restul (fullscreen D15, motion D16, a11y-extra, hook/CI, `?test=1`) au slack —
> le adaugi pe rând, după ce inima merge live. Implementează ca un începător care livrează, NU ca și
> cum fiecare linie e lege. Contractele (Tier 1) le respecți; Convențiile (Tier 2) le ghicești relaxat.

## Architecture Validation Results

> Validat prin review de **7 agenți** (Winston/Amelia/John/Sally/Mary/Paige + Red Team adversarial).
> Verdicte: **6× GO / GO-WITH-FIXES, 0× NO-GO.** Toate fix-urile (clarificări/simplificări, nu redesign)
> aplicate în D-decizii + patterns mai sus.

### Coherence ✅
Zero conflicte după corecții; contradicțiile prinse de elicitare (renderWord, Node, cache-bust pe
count, wordbank nested, pickWord, `?v=`/rescriere index.html, onestitate font) — toate rezolvate și
verificate pe disc. Tier 1/2 separă contractele de stil; meta-principiul „fail loud" leagă D3-META→D4→D10→D12.

### Requirements Coverage ✅
**FR-1…10** toate cu casă arhitecturală (vezi tabelul FR→structură); **NFR** Portability/Maintainability/
Privacy/Performance/Accessibility/Reliability toate ancorate. Trasabilitate dublă (Mary): **zero gold-plating**.

### Implementation Readiness ✅
Decizii complete (D1-D18, fără versiuni — vanilla; font = primul task de verificat). Patterns în două
tiere + tabel de nume (handoff curat, Paige). Structură completă. Exemple bune/anti-pattern.

### Fix-uri aplicate din review-ul de 7 (toate non-blocante, acum închise)
- **D18 — onestitate font + E4 ca test de glifă randată** (Red Team): „verificat" corectat; subset cere
  `U+0218-021B` direct + `locl`; fonttools-check = PRIMUL task.
- **Scos `?v=` cache-bust + rescrierea `index.html`** de `gen_words.py` (Red Team + John): footgun eliminat.
- **Hook portabil** `.githooks/` + `core.hooksPath` + CI Action (Winston + Red Team).
- **Slider `input`/`change`** separat (Amelia + Sally); **`render()` no-arg** clarificat; **`pickWord` len===2**
  determinist; **`aria-valuetext`** + **focus-pe-pauză v1** (Sally); **tabel nume** + **E5 retras** (Paige);
  **sequencing** (John); **PRD §100** sync self-host (Mary).

### Architecture Completeness Checklist
**Requirements Analysis:** [x] context · [x] scale · [x] constraints · [x] cross-cutting
**Architectural Decisions:** [x] critical (versions N/A) · [x] stack · [x] integration · [x] performance
**Implementation Patterns:** [x] naming · [x] structure · [x] communication · [x] process
**Project Structure:** [x] directory · [x] boundaries · [x] integration · [x] FR mapping

### Readiness Assessment
**Overall Status: READY FOR IMPLEMENTATION** (16/16 `[x]`, zero critical gaps).
**Confidence:** high — coerență verificată empiric, 2 baterii elicitare (45 findings) + 2 party + Gauntlet
+ review de 7 agenți, toate findings triate/aplicate.
**First Implementation Priority:** (1) fonttools pe Fraunces (E4) → (2) walking skeleton live (D17,
index.html gol + `.nojekyll` + Pages) → URL public înainte de logică.
