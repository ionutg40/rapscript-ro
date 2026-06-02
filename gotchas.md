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
