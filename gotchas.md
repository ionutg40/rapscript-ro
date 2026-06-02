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
