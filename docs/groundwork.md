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
