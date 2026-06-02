---
stepsCompleted: [1, 2, 3, 4]
status: 'complete'
completedAt: '2026-06-02'
inputDocuments:
  - docs/prd.md
  - docs/architecture.md
  - docs/DESIGN.md
  - docs/EXPERIENCE.md
---

# RapScript RO - Epic Breakdown

## Overview

Descompune PRD (FR1-10 + NFR) + UX (DESIGN/EXPERIENCE) + Architecture (D1-D18) în stories
implementabile. Ordine pe **valoare de user**, respectând principiul arhitecturii: **walking skeleton
live întâi**, apoi îmbogățire. Ship-blockers = Epics 1-4 (D1-D10 + D17); Epic 5 = slack (D15/D16/a11y-extra).

## Requirements Inventory

### Functional Requirements

FR1: Afișează un cuvânt random din nivelul curent, dominant pe ecran; diacritice RO corecte (comma-below).
FR2: Cuvântul se schimbă automat la intervalul reglabil; schimbarea intervalului se aplică imediat.
FR3: Fără repetare imediată — același cuvânt nu apare de două ori la rând (când nivelul are ≥2 cuvinte).
FR4: Play / Pause — pornește/oprește generarea; la pauză cuvântul curent rămâne.
FR5: Reglaj viteză — slider ~2–12s; valoarea vizibilă; modificarea repornește numărătoarea.
FR6: Selector dificultate — 3 niveluri; nivelul activ vizibil; următoarele cuvinte din nivelul ales.
FR7: Persistență preferințe — ultima viteză + nivel în localStorage; absența → defaults.
FR8: Fullscreen (enhancement) — buton; pe iPhone ascuns/degradare (NU buton mort).
FR9: Responsive — telefon/desktop/ecran mare; cuvinte lungi nu sparg layout-ul; touch ușor.
FR10: Word bank RO — 3 liste verificate (136/154/127 = 417); niciun nivel gol; date separate de cod.

### NonFunctional Requirements

NFR1 (Performance): cuvânt nou instant; interval precizie de secundă.
NFR2 (Accessibility): contrast AA; accent doar pe mare-bold/forme; tastatură; focus-visible; lang=ro; reduced-motion.
NFR3 (Reliability): refuz fullscreen / lipsă localStorage / bancă neîncărcată NU crapă (degradare, fail-loud).
NFR4 (Maintainability): date separate de cod; words.js derivat determinist din wordbank.json.
NFR5 (Privacy): local-only; zero network (fonturi self-host); fără cont/cloud/tracking.
NFR6 (Portability): dublu-click file:// ȘI Pages (căi relative, no fetch, no Node).

### Additional Requirements (Architecture)

- Niciun starter (vanilla zero-build); **repo-ul există** → Epic 1 = adaugă fișiere, NU `gh repo create`.
- **Primul task (înainte de CSS):** fonttools pe Fraunces — `ș/ț` comma-below, cere `U+0218-021B` direct + `locl` (D18/E4).
- Self-host woff2 în `assets/fonts/`; `.gitattributes *.woff2 -text -diff`.
- `gen_words.py`: citește `levels`, validează (≥2, fără dups intra+cross), refuză date proaste, scrie `WORD_BANK` obiect + `WORD_BANK_META{count,hash=sha256,generated}` + header; `--check`.
- `words.js` commited, încărcat prin `<script>` (nu fetch). Căi relative; `.nojekyll`.
- Teste browser `?test=1` (no Node). CI Action `--check` = gate; pre-commit hook opțional după ship.
- Deploy GitHub Pages (`main`, root, `/rapscript-ro/`).

### UX Design Requirements

UX-DR1: Nocturn tokens `:root` (`--color-*`/`--space-*`/`--font-*`/`--radius-*`/`--duration-*`); dark + un accent purple; zero gradient/glass/neon/emoji.
UX-DR2: Tipografie — Fraunces serif hero (`clamp(4rem,18vw,13rem)`, 600, lh .95) self-host; IBM Plex Mono UI.
UX-DR3: 7 componente (`hero-word`, `timer-bar`, `btn-play-pause`, `btn-fullscreen`, `speed-slider`, `level-segment`, `message`) + tabel nume DESIGN↔HTML↔JS.
UX-DR4: 5 stări (loading/ready-paused/playing/error/fullscreen) + per-control disabled/hover/active/focus-visible.
UX-DR5: Motion — hero `translateY+opacity ~140ms` DOAR la schimbare cuvânt; timer-bar CSS animation; reduced-motion → instant.
UX-DR6: A11y floor — `aria-pressed`+`aria-label` play; `aria-valuetext` slider; focus-pe-pauză hero v1; `Space` scoping; touch ≥44px; hero `overflow-wrap`.
UX-DR7: Microcopy RO canonic (`NIVEL · <x>`, `▶ pornește`, `❚❚ pauză`, `<N>s`, `se încarcă cuvintele…`, mesaj eroare).
UX-DR8: Responsive — clamp hero; control deck reflow telefon; fullscreen ascunde mobilier; iPhone buton ascuns.

### FR Coverage Map

- FR1 → Epic 3 (generator afișează cuvânt)
- FR2 → Epic 3 (schimbare la interval)
- FR3 → Epic 3 (fără repetare imediată)
- FR4 → Epic 4 (play/pause)
- FR5 → Epic 4 (slider viteză)
- FR6 → Epic 4 (selector nivel)
- FR7 → Epic 4 (persistență localStorage)
- FR8 → Epic 5 (fullscreen + degradare)
- FR9 → Epic 5 (responsive)
- FR10 → Epic 2 (word bank ca date)
- NFR2/UX-DR4-6 (a11y/motion/stări) → Epic 5 (cu baze în Epic 3)
- Infra (deploy/fonturi/CI) → Epic 1 + Epic 2

## Epic List

### Epic 1: URL live (walking skeleton)
fasty are o pagină goală, on-brand, live pe un URL public — țeava fișier→Pages validată înainte de orice logică.
**FRs covered:** (infra; gate vizual = fonturi) — niciun FR direct, dar deblochează tot.

### Epic 2: Word bank în aplicație
Cele 417 cuvinte RO trăiesc în app, validate și încărcate, gata de afișat.
**FRs covered:** FR10.

### Epic 3: Generatorul (inima)
fasty vede un cuvânt RO mare care se schimbă singur la interval, fără repetare imediată — poate face freestyle.
**FRs covered:** FR1, FR2, FR3.

### Epic 4: Controale
fasty controlează ritmul (play/pauză, viteză) și dificultatea (nivel), iar app-ul îi ține minte preferințele.
**FRs covered:** FR4, FR5, FR6, FR7.

### Epic 5: Prezentare & polish
App-ul arată premium (Nocturn complet), merge pe telefon/proiector, e accesibil și are mișcare crispă.
**FRs covered:** FR8, FR9 (+ NFR2 Accessibility, UX-DR4/5/6/8).

---

## Epic 1: URL live (walking skeleton)

Validează țeava completă fișier→URL public cu o pagină aproape-goală, on-brand. Omoară frica „nu pot
face un web app" și prinde capcanele de deploy (căi relative, `.nojekyll`, fonturi) înainte de logică.

### Story 1.1: Verifică Fraunces pentru diacritice RO

As a builder,
I want to verify Fraunces renders `ș/ț` comma-below before writing any CSS,
So that toată identitatea vizuală nu se construiește pe un font care randează sedilă.

**Acceptance Criteria:**

**Given** fontul Fraunces descărcat
**When** rulez `pyftsubset` cu `--unicodes=U+0218-021B,U+0102,U+0103,U+00C2,U+00E2,U+00CE,U+00EE,…` + `--layout-features='*'` și verific cu fonttools
**Then** `U+0219` (ș) și `U+021B` (ț) sunt în `cmap` și se randează comma-below
**And** dacă lipsesc, fontul e schimbat ACUM (nu după CSS).

### Story 1.2: Schelet live pe GitHub Pages

As fasty,
I want o pagină minimă live pe un URL public,
So that am dovada că țeava fișier→Pages funcționează.

**Acceptance Criteria:**

**Given** repo-ul existent `ionutg40/rapscript-ro`
**When** adaug `index.html` minim + `.nojekyll` gol în root, cu căi RELATIVE, și activez Pages (`main`/root)
**Then** `https://ionutg40.github.io/rapscript-ro/` încarcă pagina (nu 404, nu pagină albă)
**And** fișierele au nume lowercase ASCII.

### Story 1.3: Fonturi self-host pe Pages

As fasty,
I want fonturile Fraunces + IBM Plex Mono self-host,
So that identitatea vizuală merge offline și pe Pages, zero request extern.

**Acceptance Criteria:**

**Given** woff2 subset (`fraunces-ro.woff2`, `ibm-plex-mono-ro.woff2`) în `assets/fonts/`
**When** adaug `.gitattributes` (`*.woff2 -text -diff`), `@font-face` cu fallback explicit (serif/monospace) și `lang="ro"`
**Then** pe site-ul live `document.fonts.check('12px Fraunces')` e `true` și un cuvânt RO se randează cu serif-ul corect
**And** dacă woff2 lipsește, textul degradează la fallback citibil (nu invizibil) + `console.warn`.

---

## Epic 2: Word bank în aplicație

Aduce cele 417 cuvinte din `wordbank.json` în runtime, ca date validate, separate de cod.

### Story 2.1: Generator `gen_words.py`

As fasty,
I want un script care derivă `words.js` din `wordbank.json` determinist,
So that datele rămân o singură sursă de adevăr, fără copie tastată.

**Acceptance Criteria:**

**Given** `wordbank.json` cu structura `{meta, rubrics, levels{...}}`
**When** rulez `python gen_words.py`
**Then** se scrie `words.js` cu `WORD_BANK` OBIECT `{incepator,avansat,profesionist}` + `WORD_BANK_META{count, hash=sha256, generated}` + header `// AUTO-GENERAT — NU EDITA`
**And** scriptul citește `levels` (ignoră `meta`/`rubrics`), validează ≥2/nivel + fără dups intra+cross, și **refuză să scrie** pe date stricate.

### Story 2.2: Încărcare + guard bancă

As fasty,
I want banca încărcată în pagină cu semnal la eroare,
So that o bancă lipsă/stricată dă o stare de eroare clară, nu un app mort.

**Acceptance Criteria:**

**Given** `words.js` commited, inclus prin `<script src="words.js">` înainte de `app.js`
**When** pagina se încarcă
**Then** `WORD_BANK_META.count` e logat (semnal stale) și banca e disponibilă
**And** dacă `typeof WORD_BANK === 'undefined'` sau META mismatch → stare `error` (mesaj RO în `message`), nu crash.

### Story 2.3: Gate de freshness (CI)

As fasty,
I want un gate care prinde `words.js` stale,
So that nu livrez tăcut date vechi după ce editez banca.

**Acceptance Criteria:**

**Given** un GitHub Action configurat
**When** fac push
**Then** Action-ul rulează `gen_words.py --check` (recalculează hash, compară cu META) și **eșuează** dacă `words.js` nu corespunde lui `wordbank.json`
**And** pre-commit hook-ul local e opțional (adăugat după primul ship).

---

## Epic 3: Generatorul (inima)

Inima aplicației: un obiect `state`, un `render()`, un cuvânt care se schimbă la interval, fără
repetare imediată. Stil Nocturn minimal (serif pe dark) cât să fie folosibil.

### Story 3.1: State + render + primul cuvânt

As fasty,
I want un cuvânt RO mare pe ecran după ce banca s-a încărcat,
So that scena nu e goală și văd produsul prinzând viață.

**Acceptance Criteria:**

**Given** banca validată și `state = {word:'', level, intervalMs, intervalId:null, ready:false, playing:false, error:false}`
**When** boot termină validarea → `ready=true`, `state.word = pickWord(WORD_BANK[state.level], '')`, `render()`
**Then** un cuvânt din nivelul curent apare în `hero-word` (serif Nocturn, dark), stare paused
**And** toate scrierile DOM trec prin `render()` (logica doar mută `state`).

### Story 3.2: pickWord fără repetare imediată (FR3)

As fasty,
I want cuvinte care nu se repetă la rând,
So that fluxul de freestyle nu se blochează pe același cuvânt.

**Acceptance Criteria:**

**Given** `pickWord(bankArray, currentWord)`
**When** aleg un cuvânt nou
**Then** rezultatul ≠ `currentWord` cât timp array-ul are ≥2 cuvinte (retry mărginit `i<10`; pe array de exact 2 → celălalt determinist)
**And** funcția e testată în `?test=1` (browser, no Node).

### Story 3.3: Timer — schimbare la interval (FR1, FR2)

As fasty,
I want cuvântul să se schimbe singur la intervalul ales,
So that pot ține ritmul fără să dau click.

**Acceptance Criteria:**

**Given** `state.playing = true`
**When** pornește generarea
**Then** un cuvânt nou apare la fiecare `state.intervalMs` (un singur `setInterval`, `intervalId` în state, start idempotent cu `clearInterval` necondiționat)
**And** la play, primul cuvânt apare sincron la t=0 (din `render()`, nu după un interval).

---

## Epic 4: Controale

Play/pauză, viteză, nivel, persistență — fasty conduce ritmul și dificultatea, iar app-ul îl ține minte.

### Story 4.1: Play / Pause (FR4)

As fasty,
I want să pornesc și să opresc generarea,
So that pot lua o pauză fără să pierd cuvântul curent.

**Acceptance Criteria:**

**Given** un singur `btn-play-pause`
**When** apăs (sau `Space`, scopat să nu dubleze nativul)
**Then** comută `state.playing`; play pornește timer-ul (idempotent), pauză îl oprește și `intervalId=null`
**And** eticheta/glifa reflectă acțiunea următoare (`▶ pornește` / `❚❚ pauză`); cuvântul rămâne la pauză.

### Story 4.2: Reglaj viteză (FR5)

As fasty,
I want un slider pentru intervalul dintre cuvinte,
So that potrivesc ritmul cu cât de repede leg rime.

**Acceptance Criteria:**

**Given** `speed-slider` (range ~2–12s)
**When** trag slider-ul
**Then** pe `input` se actualizează live valoarea-text (prin `render`); pe `change` → `clampDelay(sec*1000)` + `saveSettings` + (dacă playing) `restartTimer`
**And** `clampDelay` clampează 2–12s și întoarce `DEFAULT_DELAY` la input non-finit; valoarea în secunde e vizibilă.

### Story 4.3: Selector dificultate (FR6)

As fasty,
I want 3 niveluri de dificultate,
So that aleg cât de greu de rimat sunt cuvintele.

**Acceptance Criteria:**

**Given** `level-segment` ×3 (`data-level`) în `#level-segments`
**When** apăs un segment (delegation pe container, guard `closest()`)
**Then** `state.level` devine cheia string aleasă, segmentul activ e marcat, iar **următorul** cuvânt vine din noul nivel
**And** cuvântul curent rămâne până la următorul tick (fără salt brusc).

### Story 4.4: Persistență preferințe (FR7)

As fasty,
I want app-ul să-mi țină minte viteza și nivelul,
So that revin direct la setarea mea, fără reconfigurare.

**Acceptance Criteria:**

**Given** `localStorage` cheie `rapscript:settings`
**When** schimb viteza/nivelul și revin după refresh
**Then** se salvează `{v:1, level, speedSec}` și se reîncarcă (validând `level` contra băncii → fallback `'incepator'`)
**And** absența/parse-fail/`setItem` aruncat → defaults silențios (app-ul merge oricum).

---

## Epic 5: Prezentare & polish

Nocturn complet, responsive, fullscreen, motion crisp, a11y floor. Slack-ul de după inimă.

### Story 5.1: Identitate Nocturn completă (UX-DR1/2/3)

As fasty,
I want app-ul stilizat complet pe Nocturn,
So that arată premium, nu ca un schelet.

**Acceptance Criteria:**

**Given** tokenii Nocturn în `:root` (`--color-*`/`--space-*`/`--font-*`/`--radius-*`/`--duration-*`)
**When** stilizez cele 7 componente per DESIGN.md (tabelul de nume DESIGN↔HTML↔JS)
**Then** fundalul e `#0B0B0F`, cuvântul `#F4F4F7` serif, accentul purple `#8B7BFF` doar pe forme/text mare
**And** zero gradient/glass/neon/emoji; toate culorile/spacing-ul recurent prin vars.

### Story 5.2: Responsive (FR9)

As fasty,
I want app-ul folosibil pe telefon, desktop și ecran mare,
So that fac freestyle de oriunde.

**Acceptance Criteria:**

**Given** `hero-word` cu `clamp(4rem,18vw,13rem)`
**When** schimb lățimea ecranului
**Then** cuvântul scalează; control deck-ul se reașează compact pe telefon (touch ≥44px)
**And** cuvinte lungi (`DEZAMĂGIRE`) nu sparg layout-ul (`overflow-wrap:break-word; hyphens:auto`, `line-height:0.95`).

### Story 5.3: Fullscreen cu degradare (FR8)

As fasty,
I want un mod prezentare pe tot ecranul,
So that pot face un cypher pe un ecran mare.

**Acceptance Criteria:**

**Given** `btn-fullscreen`
**When** browserul suportă Fullscreen API
**Then** butonul intră/iese din fullscreen (bara + puntea se retrag)
**And** pe iPhone (API no-op) butonul e ascuns prin feature-detect sau degradează la pseudo-fullscreen CSS — niciodată apăsare moartă.

### Story 5.4: Motion crisp (UX-DR5)

As fasty,
I want o tranziție subtilă la schimbarea cuvântului,
So that mișcarea ajută, nu distrage.

**Acceptance Criteria:**

**Given** `render()` care compară `prevWord` cu `state.word`
**When** cuvântul se schimbă
**Then** hero intră cu `translateY+opacity ~140ms` (doar la schimbare — nu la render de control); `timer-bar` curge prin CSS animation legată de `state.playing`
**And** `prefers-reduced-motion: reduce` → schimbare instantă, fără animație.

### Story 5.5: A11y floor (NFR2, UX-DR6)

As a screen-reader / keyboard user,
I want app-ul operabil și inteligibil,
So that nu sunt exclus de la singurul output.

**Acceptance Criteria:**

**Given** controalele și hero-ul
**When** navighez cu tastatura / SR
**Then** `playBtn` are `aria-pressed`+`aria-label`; slider-ul `aria-valuetext="<N> secunde"`; focus-visible (inel accent 2px); la pauză hero e focusabil + anunțat
**And** contrast AA pe perechile portante; `Space`/săgeți scopate să nu dubleze nativul.

### Story 5.6: Deploy final + gotchas (SM-1, SM-2)

As fasty,
I want app-ul complet live + lecțiile documentate,
So that proiectul e livrat și am învățat din el.

**Acceptance Criteria:**

**Given** toate epics-urile anterioare gata
**When** fac deploy final și completez `gotchas.md` pe parcurs
**Then** app-ul e live pe URL public cu inima FR1-FR9 funcțională (SM-1 PASS)
**And** `gotchas.md` are ≥8 lecții reale (SM-2), trăite pe parcurs, nu scrise retroactiv.
