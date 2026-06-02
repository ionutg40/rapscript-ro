---
name: RapScript RO — Experience
description: Behavior, states, interactions and flows for the single-screen RO freestyle word generator. Visual identity lives in DESIGN.md (Nocturn).
status: draft
created: 2026-06-02
updated: 2026-06-02
sources:
  - docs/prd.md
  - docs/groundwork.md
  - docs/DESIGN.md
---

# RapScript RO — Experience

> Spina de comportament. Identitatea vizuală (culori, fonturi, spacing) trăiește în `DESIGN.md`
> (Nocturn) și e referită aici prin `{path.to.token}`. Pe conflict cu orice mock, spinele câștigă.
> Acoperă FR-1…FR-10 din `prd.md`.

## Foundation

- **Form-factor:** multi-surface — telefon (portret), desktop, și ecran mare / proiector (mod prezentare).
  O singură pagină statică, fără rute, fără navigare, fără UI system (vanilla HTML/CSS/JS — vezi
  arhitectura). DESIGN.md = referința vizuală.
- **Un singur ecran.** Tot ce face aplicația se vede dintr-o privire. Nu există meniuri, taburi, modale
  sau pagini secundare. Adăugarea oricăror dintre ele e un miros de scope-creep (vezi PRD § OUT).

## Information Architecture

Trei zone, de sus în jos. Ierarhia atenției: **scena >> punte > bară**.

1. **Bară-sus (mobilier periferic).** Stânga: indicatorul de nivel curent (`NIVEL · avansat`, mono,
   `{colors.ink-dim}`). Dreapta: butonul Fullscreen (icon, ascuns când API-ul lipsește — FR-8).
2. **Scenă-centru (eroul).** Cuvântul uriaș (`hero-word`) la optical center ~42%. Imediat sub el,
   `timer-bar` subțire care arată cât mai e până la următorul cuvânt. Nimic altceva nu concurează aici.
3. **Punte-jos (controalele).** De la stânga: **Play/Pause** (primar) · **slider de viteză** + valoarea
   în secunde · **selector de nivel** în 3 segmente (începător / avansat / profesionist).

Surface closure: fiecare nevoie din PRD aterizează aici — afișare cuvânt (FR-1) → scenă; interval
(FR-2/5) → slider + timer-bar; play/pause (FR-4) → buton; dificultate (FR-6) → segmente; fullscreen
(FR-8) → bară-sus; responsive (FR-9) → toate zonele reflow. Niciun ecran orfan, nicio nevoie fără casă.

## Voice and Tone

Microcopy minimal, în română, încrezător, fără entuziasm fals și fără emoji. Sistemul vorbește scurt,
ca o regie de scenă. Brand-voice vizual (serif-ul) e în DESIGN.md.

Stringuri canonice (RO):

| Context | Text |
|---|---|
| Nivel (label) | `NIVEL · începător` / `NIVEL · avansat` / `NIVEL · profesionist` |
| Play (idle) | `▶ pornește` |
| Pause (playing) | `❚❚ pauză` |
| Valoare viteză | `4s` (doar cifra + `s`) |
| Loading | `–` (placeholder dimmed în scenă) + sub-text `se încarcă cuvintele…` |
| Eroare bancă | `nu am putut încărca cuvintele. reîncarcă pagina.` |
| Fullscreen indisponibil | (fără text — butonul pur și simplu lipsește, FR-8) |

Reguli: minuscule pentru acțiuni (`pornește`, `pauză`), uppercase + tracking doar pe label-ul de nivel.
Fără semne de exclamare. Fără „Oops". Eroarea spune ce s-a întâmplat + ce să faci, atât.

## Component Patterns (behavioral)

Specul vizual e în DESIGN.md › Components; aici e doar comportamentul.

- **hero-word** — afișează un cuvânt din nivelul activ. Nu e interactiv (nu se dă click pe el). Se
  schimbă singur (playing) sau rămâne fix (paused). Aria: vezi Accessibility.
- **timer-bar** — reprezintă progresul către următorul cuvânt: pornește gol/plin și se
  golește/umple linear pe durata `T`. La pauză îngheață. La schimbarea vitezei sau a nivelului, se
  resetează și repornește. E feedback-ul că „ceva se întâmplă", fără numere care distrag.
- **button play/pause** — un singur buton care comută starea (FR-4). Eticheta + glifa reflectă
  *acțiunea următoare* (`▶ pornește` când e oprit, `❚❚ pauză` când merge).
- **speed-slider** — `range`, ~2–12s (FR-5). Drag live: valoarea-text se actualizează în timp real;
  la eliberare (sau pe `input`) repornește numărătoarea cu noua valoare. Valoarea clampată la interval.
- **level-segment** — 3 segmente exclusive (FR-6). Click pe unul: devine activ, iar **următorul**
  cuvânt vine din noul nivel (cuvântul curent rămâne până la următorul tick — fără salt brusc).
- **fullscreen-button** — comută fullscreen pe browsere care suportă (FR-8); feature-detect → ascuns
  pe iPhone, sau degradare la pseudo-fullscreen CSS. Niciodată buton care „nu face nimic".

## State Patterns

**Stările aplicației** (mutual exclusive pe scenă):

- **loading** — la deschidere, până se încarcă banca de cuvinte. Scenă: placeholder `–`
  (`{colors.ink-faint}`) + sub-text `se încarcă cuvintele…`. Play **disabled**. (Anti-race: nu lăsa
  user-ul să pornească peste o bancă goală.)
- **ready / paused** — banca încărcată, un cuvânt pe scenă, generarea oprită. timer-bar îngheață.
  Butonul arată `▶ pornește`. Starea inițială după load (nu pornește singur).
- **playing** — cuvintele se schimbă la fiecare `T`s; timer-bar curge; butonul arată `❚❚ pauză`.
- **error** — banca nu s-a putut încărca. Scenă: mesaj `danger` cu textul canonic. Controalele
  rămân disabled. Degradare grațioasă, fără ecran alb, fără crash (NFR Reliability).
- **fullscreen-active** — strat ortogonal: aplicația umple ecranul; bara-sus și puntea se pot
  ascunde/subția ca să rămână doar cuvântul (regie de proiector). Iese cu Esc / butonul.

**Stările per-control:** disabled (în loading/error, opacitate redusă, `ink-faint`, fără hover),
hover (`surface`→`surface-2`), active/pressed (`accent-dim`), focus-visible (inel `accent` 2px, offset 2px).

## Interaction Primitives

- **Toggle play/pause** — click pe buton SAU tasta `Space`. Comută loading-safe (no-op dacă loading/error).
- **Reglaj viteză** — drag pe slider (mouse/touch) sau săgeți `←/→` când e focus. Live, clamp 2–12s,
  repornește numărătoarea. Persistă (FR-7).
- **Schimbare nivel** — click pe segment sau `Tab`+`Enter`. Imediat pentru *următorul* cuvânt. Persistă.
- **Fullscreen** — click pe buton (unde există). `Esc` iese (comportament nativ).
- **Tranziția la cuvânt nou (motion crisp, premium):** cuvântul nou intră cu `translateY(12px→0)` +
  `opacity 0→1` în ~140ms `ease-out`, fără suprapunere cu ieșirea, fără flash, fără shake, fără
  overshoot (alea erau STAMP-CUT brutalist, moarte la pivot). Doar transform + opacity (GPU-friendly).
- **`prefers-reduced-motion: reduce`** — tranziția devine schimbare instantă (zero animație). Obligatoriu.

## Accessibility Floor

- **Contrast:** perechile text/fond trec AA (vezi DESIGN.md › Colors). Accentul purple DOAR pe forme
  și text mare-bold, niciodată pe text mic (regulă moștenită din groundwork §5).
- **Tastatură:** play/pause, slider, segmente și fullscreen complet operabile fără mouse; focus-visible
  vizibil (inel `accent`). Ordine de tab logică: nivel → controale.
- **`lang="ro"`** pe `<html>` (corectează randarea diacriticelor — vezi DESIGN.md NOTE).
- **Cuvântul-erou și screen-readere:** `aria-live` pe hero setat `off` în playing (un cuvânt nou la
  câteva secunde ar inunda un cititor de ecran și nu servește user-ul țintă — un freestyler vizual).
  La pauză cuvântul e citibil normal ca text. **[ASSUMPTION]** — fasty (user #1) e vizual, nu pe SR;
  revizuit dacă apare nevoie reală.
- **Reduced motion** respectat (vezi mai sus).
- **Touch targets** ≥44px pe telefon (FR-9).

## Key Flows

**Fluxul inimii — „cinci minute, noaptea".**

Protagonist: **fasty**, 23:40, căști pe urechi, lumina stinsă, un beat în loop în cap. Vrea cinci
minute de freestyle fără să se gândească la următorul cuvânt.

1. Deschide URL-ul live pe telefon. Ecranul e negru-premium; apare scurt `–` și `se încarcă cuvintele…`,
   apoi un prim cuvânt: **`umbră`**, mare, serif, calm.
2. Lasă nivelul pe `avansat` (e ținut minte din data trecută — FR-7). Trage slider-ul la `5s` — îi dă
   timp să lege o rimă fără să se grăbească.
3. Apasă **`▶ pornește`**. timer-bar purple începe să curgă. La 5s, `umbră` urcă-și-dispare, iar
   **`presimțire`** intră de jos, crisp.
4. Intră în ritm: `viitor` → `cenușă` → `mărturisire`. Mâna stă pe telefon, ochii pe cuvânt, gura merge.
   Nu atinge nimic — exact asta e ideea: zero fricțiune între el și vers.
5. **Climax:** pică **`DEZAMĂGIRE`** — cuvânt lung, dar nu sparge layout-ul (clamp + line-height 0.95);
   se așază perfect pe punchline-ul pe care tocmai îl construia. Ăla e momentul: unealta a dispărut,
   a rămas doar fluxul.
6. După câteva minute, apasă `❚❚ pauză`. `cenușă` rămâne înghețat pe ecran. Închide telefonul. A mers.

**Flux secundar — proiector (mod prezentare).** Pe desktop conectat la un ecran mare: apasă Fullscreen;
bara și puntea se retrag; rămâne doar cuvântul pe tot ecranul, pentru un cypher cu prietenii. Pe iPhone,
butonul Fullscreen lipsește din start (FR-8) — nicio apăsare moartă.

## Responsive & Platform

- **Telefon (portret):** scenă domină; puntea se așază pe un rând compact jos (play | slider | nivel),
  touch targets ≥44px. Cuvântul scalează cu `clamp(...18vw...)`.
- **Desktop:** cele trei zone aerisite, `gutter` 24px; cuvântul poate ajunge la `13rem`.
- **Ecran mare / proiector:** fullscreen ascunde mobilierul; cuvântul umple.
- **iPhone:** Fullscreen API e no-op pentru elemente arbitrare → feature-detect ascunde butonul;
  opțional pseudo-fullscreen CSS `position:fixed;inset:0` + hint „Add to Home Screen". Nicio iluzie de bug.
- **Cuvinte lungi** (`DEZAMĂGIRE`, `MĂRTURISIRE`): `line-height: 0.95` + clamp împiedică spargerea.

## Inspiration & Anti-patterns

**Inspirație:** scena de teatru cu un singur reflector; coperta unei reviste literare (serif high-contrast);
instrumentarul minimal Linear/Vercel (mono periferic, accent zgârcit).

**Anti-patterns (interzise):** gradient mov→albastru; glassmorphism / blur ca estetică; neon glow pe
accent; emoji; a doua culoare de accent; numere de timer mari care fură atenția; orice animație
violentă (shake/overshoot/flash — reziduu brutalist); ecran alb la eroare; buton care nu face nimic.
