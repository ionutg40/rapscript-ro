# Architecture — Pas 5 (DRAFT recuperat): Implementation Patterns & Consistency Rules

> ⚠️ **Status: DRAFT NEAPROBAT, RECUPERAT DIN CONTEXT.** Acest text a supraviețuit doar
> pentru că a fost lipit într-un mesaj (2026-06-02). Restul arhitecturii (pașii 1-4, deciziile
> D1-D18) NU a fost salvat în sesiunea precedentă și trebuie regenerat. Acest fișier referă
> D2/D6/D7/D11/D13/D14/D15/D17 care vor fi definiți când refacem pașii 1-4.
> Nu trata ca sursă de adevăr până nu e re-integrat în `architecture.md`.

---

## Implementation Patterns & Consistency Rules

Puncte de conflict reale pentru un app vanilla 1-fișier: 6 (naming JS, clase CSS, refs DOM,
format erori, loading, comentarii). N/A: DB naming, API endpoints, event systems, state libs,
response wrappers — nu există.

### Naming

JS: funcții/variabile camelCase (`pickWord`, `delayMs`); config UPPER_SNAKE
(`MIN_DELAY=1000`, `MAX_DELAY=15000`, `DEFAULT_DELAY=4000`, `MAX_WORD_LEN=13`) — numere
magice ca constante sus, niciodată inline; fără clase (D14) → fără PascalCase; refs DOM
cache-uite o dată, sufix `El`/`Btn` (`wordEl`, `playBtn`, `speedSlider`).

CSS: clase kebab-case, stări prefix `is-` (`is-playing`, `is-paused`), animație
`word-enter`/`word-leave`; fără BEM greu.

CSS vars: `--<categorie>-<nume>` (`--color-bg`, `--space-md`), toți tokenii Nocturn în
`:root`, zero hardcodări.

Fișiere: lowercase ASCII strict (`index.html`, `style.css`, `app.js`, `wordbank.json`);
cheie localStorage `rapscript:settings` (D17).

### Structure

Un fișier per strat (D15), fără splitting; utilitare (`clampDelay`) inline în `app.js`;
fără folder de teste în v1 (verificare = `validate.js` manual, D11); assets doar în
`assets/fonts/`.

### Format

JSON cu chei lowercase RO fără diacritice (D13); booleeni reali `true`/`false`; date/ore N/A
(doar ms intern, UI în secunde).

### State & Communication

Regula de aur (D14): logica doar mută state; toate scrierile DOM trec prin
`render()`/`renderWord()`. Handlere cu nume, prefix `handle` (`handlePlayClick`), legate cu
`addEventListener` la fundul fișierului — fără arrow-uri anonime inline. Logging:
`console.error` doar în catch, zero `console.log` livrat.

### Process

Erori boundary-only: try/catch doar la fetch (`loadWords`) și localStorage
(`load/saveSettings`); user vede mesaj RO în `messageEl`, app degradează grațios, detaliul →
`console.error`. Loading: placeholder `–` dimmed + `playBtn` disabled până rezolvă
`loadWords()` (anti-race D2/D15). Validare la intrare: `clampDelay()` pe slider+localStorage
(D7), validare bancă la load (D13).

### Enforcement

Orice agent: mută starea în state & scrie DOM doar prin `render*()`; folosește constantele de
config; prinde erori doar la granițe; căi relative + lowercase ASCII. Comentarii în română,
scurte, explică DE CE (proiect de învățare).

**Bun:**
```js
state.delayMs = clampDelay(slider.value); saveSettings(); restartTimer(); render();
```

**Anti-pattern:**
```js
wordEl.textContent = words[Math.floor(Math.random()*words.length)] // direct în handler
```
sare peste state, `pickWord` (D6), render. Drift garantat.
