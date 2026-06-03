# gotchas.md — RapScript RO

Jurnal de lecții trăite la build (SM-2: țintă ≥8). Se umple PE PARCURS, nu retroactiv.

## 2026-06-02

### 1. Verifică fontul cu fonttools ÎNAINTE de a-l adopta (diacritice RO)
Pentru română, formele corecte sunt **comma-below**: `ș U+0219`, `ț U+021B` (NU sedila `ş U+015F`,
`ţ U+0163`). Un font poate „suporta RO" la nivel de catalog dar să randeze sedilă, sau să depindă de
feature-ul OpenType `locl` (pe care `pyftsubset` îl aruncă la subsetting). **Verificare reală:**
```python
from fontTools.ttLib import TTFont
cmap = TTFont('Font.ttf').getBestCmap()
print(0x0219 in cmap, cmap.get(0x0219))  # vrei True + 'scommaaccent', NU 'scedilla'
```
**Fraunces:** PASS — `U+0219→scommaaccent`, `U+021B→tcommaaccent` (glife dedicate, nu prin locl).
Sursă TTF: `github.com/googlefonts/fraunces` → `fonts/Fraunces[SOFT,WONK,opsz,wght].ttf` (variable).
Lecția: code-point-prezent ≠ glifă-corectă; deschide fontul, nu te baza pe catalog.

### 2. Prima activare GitHub Pages durează (nu intra în panică la 404)
Prima dată când activezi Pages (`gh api --method POST repos/<u>/<r>/pages` cu
`{"source":{"branch":"main","path":"/"}}`), build-ul stă în `building` câteva minute (la noi ~4 min);
URL-ul dă **404 până termină**. Verifică statusul real: `gh api repos/<u>/<r>/pages/builds/latest`
(`status: building` + `error: None` = normal, doar așteaptă). NU re-push, NU schimba config-ul.
Confirmat live: `https://ionutg40.github.io/rapscript-ro/` servește `index.html` + `style.css` +
`assets/fonts/*.woff2` toate pe **căi relative** sub subfolder → căile relative sunt CORECTE pe Pages.

### 3. `pyftsubset` păstrează diacriticele DOAR dacă ceri code-point-urile + features
La subset: `--unicodes="...,U+0218-021B,..."` (cere direct ș/ț comma-below) **+** `--layout-features='*'`
(păstrează `locl` etc). Instanțierea unui variable font (`fontTools.varLib.instancer opsz=144 wght=600`)
înainte de subset dă un cut display mic (Fraunces: 358KB TTF → 19KB woff2). Warning-ul „meta NOT subset;
dropped" e inofensiv. Mono are nevoie de 2 fișiere (400+500) — un singur woff2/familie pierde o greutate.

### 4. Pages „built" (API) ≠ deployat — fișier nou dă 404 până termină Actions
`gh api repos/<u>/<r>/pages/builds/latest` poate zice `status: built` în timp ce deployment-ul real
(GitHub Actions `pages build and deployment`) e încă `in_progress` → **un fișier NOU (ex. app.js) dă 404
deși e în commit**. Nu re-push. Verifică run-ul corect: `gh run list` → așteaptă
`pages build and deployment` să fie `completed/success` (`gh run watch <id>`), abia apoi fișierul nou
e servit. La noi ~1-2 min după push.

### 5. Retrigger animație CSS = remove + reflow + restore
O animație CSS NU repornește dacă doar reaplici aceeași clasă. Trucul: `el.classList.remove('x');
void el.offsetWidth; el.classList.add('x');` (sau pe `style.animation`: `'none'` → reflow → `''`).
Folosit la hero (intrare la fiecare cuvânt nou) și la timer-bar (umplere de la 0 pe fiecare interval).

### 6. `render()` nu scrie `value` pe slider când e în drag
Dacă `render()` rescrie `slider.value` în timp ce userul trage de el (`document.activeElement === slider`),
îi smucește thumb-ul. Regulă: readout-ul live citește slider-ul în drag; `state.intervalMs` se scrie pe
`change`, nu pe `input`. `render` scrie `value` DOAR dacă slider-ul nu e `activeElement`.

### 7. Fullscreen: feature-detect + listener `fullscreenchange`
`document.documentElement.requestFullscreen` lipsește pe iPhone pentru elemente arbitrare → ascunde
butonul (`hidden=true`), nu-l lăsa mort (FR8). Esc/ieșirea nativă NU cheamă handler-ul tău → ai NEVOIE
de `document.addEventListener('fullscreenchange', ...)` ca să sincronizezi starea/eticheta.

### 8. localStorage aruncă pe `setItem` în Safari private (nu doar pe parse)
În modul privat Safari, `localStorage.setItem` aruncă `QuotaExceededError`. Wrap-uiește ȘI scrierea,
nu doar `JSON.parse` la citire; fail-silent → app-ul merge pe defaults (NFR Reliability).

### 9. „Backend fără server" pentru 2 useri = GitHub (repo+API+Actions+Pages)
Nu-ți trebuie Hetzner/Supabase pentru „cuvinte pe care le văd toți". Repo-ul E baza de date:
UI comite `wordbank.json` prin **GitHub Contents API** cu **token-ul PERSONAL al fiecărui user**
(fine-grained, `contents:write` pe acest repo, în localStorage — NU un token partajat băgat în site,
ăla ar fi leak). Un Action regenerează `words.js` și-l comite înapoi (guard anti-buclă:
`if: github.actor != 'github-actions[bot]'`). Pages redeployează. Zero server de administrat.
Latență ~1-2 min (commit→CI→deploy) — comunic-o onest în UI. base64 pt API trebuie UTF-8-safe
(`btoa(unescape(encodeURIComponent(s)))`) altfel diacriticele se strică.

### 10. Timestamp volatil în fișier generat = churn de CI (commit + deploy la fiecare push)
`gen_words.py` scria `generated: "<timestamp>"` în `words.js` → la fiecare push CI rula gen → words.js
diferea (doar timestamp-ul) → bot-ul comitea un words.js nou → încă un deploy Pages care ANULA
deploy-ul anterior (confuzie: „deploy cancelled"). Fix: scos `generated` (volatil, fără valoare —
`hash` e identitatea de conținut, stabilă). Regulă: fișierele auto-generate-și-comise NU trebuie să
conțină timestamp/nonce, altfel orice rulare le „schimbă" și intri în churn.

### 11. „Zero token în browser" = backend obligatoriu (un secret în browser nu e secret)
Cerința „token o dată pe veci sau deloc" nu se poate face client-side: orice secret pus în site-ul
static e public (View Source) → furat + GitHub îl revocă. Soluția = un backend care ține secretul
(Cloudflare Worker: token ca Secret, setat o dată; browserul cheamă Worker-ul). Costul: endpoint public
→ anti-bot (Turnstile) + rate-limit + token scoped + validare în Worker ȘI în CI. Pentru 2 useri,
direct-commit cu Turnstile e ok; la abuz real, treci pe batch (KV+cron), nu commit-per-call.

---

## Retrospective v2 (Epic 7 rime + Epic 8 voce) — 2026-06-03

> Construit quick-dev (commit-uri directe, fără sprint cycle, fără review înainte de deploy).
> CR post-factum a găsit 9 patch + 9 defer pe cod DEJA live. Lecțiile de proces:

### 12. Gate-ul pe care-l scrii trebuie să BLOCHEZE, nu să fie opțional
D36 zicea „vocea nu se lansează până la test live pe 20+ cuvinte". Codul a fost deployat cu mențiunea
proprie „verificat doar logica prin simulare onresult". Un gate pe care-l scrii și apoi îl sari nu e
gate, e o notă. Dacă e condiție de ship, fă-o blocantă (checklist înainte de merge, nu după).

### 13. Când închizi o întrebare deschisă, actualizează TOATE referințele
D31 a fost marcat „✅ DECIS" în header dar OQ-V1 a rămas „BLOCANT (owner: nu știu încă)" în registrul
de open questions, în ACELAȘI doc. Sursă unică de adevăr: când o decizie se ia, grep după ID-ul ei și
actualizează fiecare loc, altfel doc-ul se autocontrazice și nu mai știi ce e decis.

### 14. Claim în doc = ce GARANTEAZĂ codul, nu ce speri. Paritate ≠ corectitudine
D28 zicea „accent → eroare 0%". Realitatea: 71/417 overrides din RoLEX, 102 cuvinte cad pe heuristică
(neverificate), `copíi/cópii` încă greșit. Ce s-a obținut e paritate JS↔Python, nu accent corect.
Distinge mereu „cele două implementări dau același rezultat" de „rezultatul e corect".

### 15. Invariant afirmat = invariant PĂZIT în cod
„Zero orfane (toate au rime)" e afirmat, dar `true_orphans` doar printează (față de `no_vowel` care
face `SystemExit`). Un invariant fără guard fail-loud e un snapshot care putrezește la primul cuvânt
nou. Dacă scrii „garantat X", pune codul să cadă tare când X nu mai e adevărat.

### 16. Freshness gate trebuie să hash-uiască TOATE inputurile lui
`canonical_hash` include `extra` (nefiltrat) dar NU `stress.json` deloc → editări de accent nu sunt
prinse de CI, deși comentariul promite că sunt. Un gate de freshness care ratează un input dă fals
confort (mai rău decât niciun gate, fiindcă te bazezi pe el). Hash-uiește exact ce intră în output.

### 17. Quick-dev fără pas de review = cod live nereviziuit
v2 a mers direct live. CR a găsit 9 patch-uri (inclusiv un leak de microfon care rămâne ON și un gap
GDPR pe disclosure) pe cod deja la utilizatori. Quick-dev e ok pentru viteză, dar la features care
ating privacy (microfon) sau CI, fă măcar un review pass înainte de deploy, nu după.

### 18. rimeaza.ro NU se scrapează (blocat explicit) → reprodu comportamentul din RoLEX
Cererea „scrape rimeaza.ro, îmi plac rimele lor". Verificat înainte: `robots.txt` are `Disallow: /` pt
ClaudeBot + toți boții AI, semnal `ai-train=no`, iar pagina de cuvânt dă 403 la acces automat. Plus
copyright (datele lor, livrate într-un tool public). Decizie: NU scrapăm. Ce-ți place nu e site-ul, e
COMPORTAMENTUL (rime pe grade + degradare). Reprodus legitim din RoLEX (date deschise, build-time):
`rhyme_rolex.js` = index `cheie→[cuvinte comune]` (perfect/cons/asonanță, zipf≥3.0, cap 12/cheie =
144KB/47KB gzip). Motorul umple grade 1→5 (bank-perfect → RoLEX-perfect → RoLEX-cons → bank-ason →
RoLEX-ason) până la 5. Rezultat: rime instant la ORICE cuvânt (gunoi/cola/ghiveci), offline, pe file://.
Cheie nouă `c` (consonantic) oglindită Python `cons_key` ↔ JS `rhymeKeysFor(.c)`. `rhyme_rolex.js` se
generează DOAR cu `--from-rolex` (CI n-are RoLEX) → comis ca input, ca stress.json. Regulă generală:
când un site interzice scraping (robots/ai-train/403), nu-l ocoli — livrează rezultatul din date deschise.
