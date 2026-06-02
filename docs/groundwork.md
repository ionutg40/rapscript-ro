# Groundwork — RapScript RO

> Research front-loaded (workflow `rapscript-ro-groundwork`, 12 agenți, 2026-05-31).
> **Acestea sunt INPUTURI pentru fazele BMad, nu decizii finale.** Stack-ul se confirmă oficial în `bmad-create-architecture`, design-ul în `bmad-create-ux-design`, epics-urile în `bmad-create-epics-and-stories`.

## 1. Word bank RO (asset) → `assets/wordbank.json`

422 cuvinte verificate, în 3 niveluri:

| Nivel | Cuvinte | Rubrică |
|---|---|---|
| Începător | 136 | comune, concrete, 1-3 silabe, ușor de rimat |
| Avansat | 154 | frecvență medie, abstracte/lungi, emoții & concepte |
| Profesionist | 132 | rare, livrești, filozofice, greu de rimat |

Pipeline: generate (~130/nivel) → editor sever (elimină englezisme, nume proprii, non-cuvinte, duplicate). Tăiate la verificare: „spleen" (englezism), „neînfiptură" (inventat).

**De curățat la implementare:** 5 cuvinte apar în 2 niveluri — `anxietate, deznădejde, melancolie, uitare, îndoială` (avansat ∩ profesionist). Decizie de leveling, nu bug.

## 2. Direcția de design (input fază UX) — câștigătoare juriu: **Underground Brutalist / „Subsol"** (8.5/10)

> ⚠️ **PIVOT 2026-05-31 (decizie user, faza UX):** direcția Underground Brutalist e **superseded**. fasty a ales o direcție nouă: **Premium Clean + accent purple chirurgical** (sleek/modern, grad Linear/Vercel — dark-premium, UN singur accent purple, tipografie confidentă, depth subtil prin umbre reale NU sticlă blurată, motion crisp, contrast-safe). Reguli anti-slop păstrate: ZERO gradient mov→albastru, ZERO glassmorphism-ca-estetică, ZERO neon glow smeared, ZERO emoji, un singur accent, ierarhie reală. Designul se formalizează în `bmad-create-ux-design`. Conceptul brutalist de mai jos rămâne ca referință/istoric.

Vibe: pivniță de bloc, foaie xeroxată prinsă în pioneze, cuvântul izbește ecranul ca un punchline scris cu Sharpie. Anti-SaaS, anti-slop.

- **Paletă:** hârtie `#F2F0EB` + cerneală `#0A0A0A`, UN singur accent portocaliu `#FF3B00` (folosit zgârcit: doar pe „REC ●" și pe print-misalignment).
- **Tipografie:** cuvântul central în **Archivo Black** 900 (`clamp(4rem, 18vw, 14rem)`, uppercase, rotit -1.5°); UI/timer în **Space Mono**.
- **Animație „STAMP CUT"** (~320ms): cuvântul vechi se prăbușește → flash de inversiune 40ms → cuvântul nou izbește de sus cu overshoot violent. Fără fade, fără blur.
- **Layout:** chenar negru 4px, registration marks în colțuri, label vertical, bară de timer groasă care „ticăie", page-shake 1px la schimbare.
- **Anti-slop strict:** ZERO gradient mov, glassmorphism, neon glow, emoji, colțuri rotunjite, Inter/Poppins.

**Runner-ups & grefe (de la juriu):** de la *Neon Cypher* — `prefers-reduced-motion` fallback (obligatoriu), bara de timer care se „aprinde" portocaliu în ultimele 20%, transform+opacity only, optical center ~42%. De la *Editorial Bold* — `line-height: 0.9` pe cuvinte RO lungi (DEZAMĂGIRE), slider stilizat ca riglă de tipograf, livrare în 2 straturi (MVP fără grime → textură xerox „când prinde curaj").

## 3. Stack recomandat (input fază Arhitectură)

**Vanilla HTML + CSS + JS pur. Zero build, zero dependințe, zero framework.**

- Fișiere: `index.html`, `style.css`, `app.js`, `words.js`.
- Rațiune (pedagogic, pentru începător): vezi rezultatul fără nimic între tine și browser; fundamentele reale în ordinea corectă (HTML=schelet, CSS=aspect, JS=comportament); fără „npm install a eșuat" în ziua 1. Vite/React = overkill care ascunde fix lecția (DOM-ul real).
- **Deploy: GitHub Pages** (peste Netlify/Vercel) — gratuit fără card, te învață git+GitHub, fără build step. Live la `https://ionutg40.github.io/rapscript-ro/`.
- API-uri cheie: `setInterval`, Fullscreen API, `<input type=range>`, `Math.random`, DOM API, CSS clamp/flexbox, `localStorage` (opțional).
- ⚠️ **Capcana #1 sub subfolder:** căi RELATIVE în HTML (`href="style.css"`, NU `/style.css`) — altfel pagină albă live deși merge local.

## 4. Leverage & ordinea de atac (input fază Epics)

**Insight:** codul inimii e trivial (~40 linii `setInterval`). Partea grea (word bank) e deja gata. Pârghii reale:
1. **Deploy GOL în prima oră** — walking skeleton: țeavă completă fișier→URL public, testată goală. Omoară 90% din frica „nu pot face un web app".
2. **`words.js` separat de la prima linie** — date vs cod, diferențiatorul izolat.
3. **Căi relative** — capcana clasică pe Pages.

**Epics propuse (cap-coadă):**
1. Walking skeleton live (țeavă goală → URL public)
2. Word bank RO în date
3. Generatorul (inima: random + setInterval)
4. Controale (play/pause, viteză, dificultate)
5. Fullscreen + responsive
6. Polish: design Underground Brutalist + animație
7. Deploy final + `gotchas.md` (SM-2) + share

> Detaliul complet pe stories e în output-ul workflow-ului; se rafinează oficial în `bmad-create-epics-and-stories`.

## 5. Verificare adversarială (2026-05-31, workflow `rapscript-ro-verify`, 20 agenți)

Verdict: **groundwork solid pentru PRD** (confidence high, claim-uri verificate empiric pe git/gh/python). Corecții:

### Aplicate deja (în asset)
- ✅ Typo: `eshatologie` → `escatologie` (formă DEX corectă).
- ✅ Dedup cross-nivel: cele 5 cuvinte din avansat∩profesionist (anxietate, deznădejde, melancolie, uitare, îndoială) scoase din profesionist (rămân în avansat, unde aparțin).
- ✅ **Counts reale: 136 / 154 / 127 = 417** (NU 155/133/424 din output-ul workflow-ului — acela e driftat; sursa de adevăr = `assets/wordbank.json`).
- ✅ Confirmat: 0 duplicate intra-nivel, 0 cedile greșite, diacritice comma-below 100% corecte.

### Decizii pentru fazele BMad (de respectat în PRD/UX/Arhitectură/Epics)
- **Format date (Arhitectură):** `words.js` cu `const WORD_BANK = {...}` încărcat prin `<script>`, **derivat determinist din `wordbank.json`** (NU a doua copie tastată). Motiv: `fetch('assets/wordbank.json')` pe `file://` pică pe CORS → strică promisiunea „dublu-click rulează".
- **Epic 1 (Epics): repo-ul EXISTĂ deja** (2 commits, main↔origin, tree clean). Scoate din plan `gh repo create`, `git branch -M main`, „scaffold gol", „fără commituri". Real: adaugi cele 4 fișiere noi (`index.html`, `style.css`, `app.js`, `words.js`) peste structura existentă + al 3-lea commit + push + activează Pages. `.gitignore` și `README.md` există deja.
- **Fullscreen (PRD constraint + Arhitectură):** Fullscreen API e **efectiv no-op pe iPhone** pentru elemente arbitrare (nu doar „limitat"). Tratează ca enhancement: feature-detect + ascunde butonul când lipsește; degradare la pseudo-fullscreen CSS (`position:fixed;inset:0`) + „Add to Home Screen".
- **.nojekyll:** adaugă fișier gol în root de la walking skeleton (Pages rulează Jekyll implicit, ignoră silențios fișiere/foldere cu `_`).
- **Accesibilitate (UX/design):** `#FF3B00` pe hârtie = 3.14:1, `#8A8578` = 3.23:1 → pică AA pe text normal. Regulă: portocaliu + gri DOAR pe text mare-bold sau forme, niciodată pe text mic. Label vertical → cerneală `#0A0A0A` (17.38:1, AAA).
- **Animație în 3 straturi (design):** Strat 1 MVP = un cuvânt intră cu `translateY+opacity` ~150ms (fără fază de ieșire suprapusă, fără flash/shake). Strat 2 = flash-invert. Strat 3 = overshoot + page-shake + STAMP CUT complet. STAMP CUT complet NU e acceptance criteria v1.
- **Textura xerox: scoasă din v1** (juriul i-a dat fezabilitate 6/10). Identitatea brutalist supraviețuiește fără grime. Dacă se vrea: un PNG noise tileable opacity ~4%, zero JS/SVG.
- **Epic 6 — contradicție rezolvată:** NU „fade sau slide" (conceptul interzice explicit fade/blur). Tranziția = STAMP CUT pe straturi.
- ✅ **Diacritice Archivo Black: confirmat OK** (verificat cu fonttools — are glyph-uri comma-below dedicate + feature `locl` RO auto-corect). Doar pune `lang="ro"` pe `<html>`. Coborât din „risc" în „rezolvat".

### Re-leveling fin (deferat la editare, NU blocant)
~10 cuvinte borderline de mutat între niveluri (ex. `prăjitură`→avansat; `trecut/tron/umbră/viitor/presimțire`→mediu; `concluzie/actualitate/extaz/neliniște`→avansat). Judecăți de conținut, nu erori.

### Gotchas tehnice (pentru `gotchas.md`, Epic 7)
- Căi RELATIVE sub subfolder Pages (`style.css`, nu `/style.css`) — altfel 404 alb.
- `.nojekyll` gol în root oprește Jekyll.
- Nume fișiere strict lowercase ASCII (server Pages e case-sensitive, local nu).
- Prima activare Pages 1-3 min + Fastly cache agresiv → hard-refresh/incognito înainte de panică.
- Activare Pages scriptat: `gh api --method POST repos/ionutg40/rapscript-ro/pages --input -` cu `{"source":{"branch":"main","path":"/"}}` (scope `repo` suficient); fallback manual Settings>Pages dacă dă 409/422.
