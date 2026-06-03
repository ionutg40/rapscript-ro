#!/usr/bin/env python3
"""Derivă rhymes.js din assets/wordbank.json (+ opțional assets/stress.json) — determinist, fail-loud.

Fratele lui gen_words.py (D27/D28/D37). NU îl modifică. Rulează:
    python gen_rhymes.py           # generează rhymes.js
    python gen_rhymes.py --check   # verifică freshness (exit non-zero dacă rhymes.js e stale)

Pipeline (D28): cuvânt RO --G2P pur-Python--> foneme --accent--> cheie de rimă.
  - cheie PERFECT  = fonemele de la ultima vocală ACCENTUATĂ până la final (rima clasică).
  - cheie ASONANȚĂ = doar vocalele de la accent la final (near-rhyme, fallback când perfect < 5).
Accent: heuristică (vocală→penultim, consoană→ultim) + override din stress.json (D28).
Fail-loud (D29): raportează cuvintele ORFANE (fără partener de rimă); date proaste = nu se scrie.

Gotcha-uri RO acoperite (D28): â/î→ɨ · ce/ci→/tʃ/ · ge/gi→/dʒ/ · che/ghe→/k,g/ · x→/ks/ ·
  -i final palatalizat (lupi /lupʲ/) ca marcaj, nu vocală.
"""
import json
import hashlib
import sys
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "assets" / "wordbank.json"
STRESS_SRC = ROOT / "assets" / "stress.json"   # opțional: {cuvânt: k} (k=nucleu de la final, 0=ultim)
OUT = ROOT / "rhymes.js"
LEVELS = ("incepator", "avansat", "profesionist")

# litere-vocală (ortografic) → simbol fonetic (â și î colapsează în /ɨ/ = '1')
VOWEL_MAP = {"a": "a", "ă": "@", "â": "1", "î": "1", "e": "e", "i": "i", "o": "o", "u": "u"}
# consoane simple → simbol (acoperă comma-below ȘI cedilă, ca să nu pice pe variante de input)
CONS_MAP = {
    "ș": "S", "ş": "S", "ț": "T", "ţ": "T", "j": "Z",
    "b": "b", "d": "d", "f": "f", "h": "h", "k": "k", "l": "l", "m": "m",
    "n": "n", "p": "p", "r": "r", "s": "s", "t": "t", "v": "v", "z": "z",
    "q": "k", "w": "v", "y": "i",
}


def g2p(word):
    """Cuvânt RO (lowercase) → listă de (simbol, e_vocală). Reguli context-sensitive (D28)."""
    toks = []
    i, n = 0, len(word)
    while i < n:
        c = word[i]
        nxt = word[i + 1] if i + 1 < n else ""
        if c == "c":
            if nxt == "h":               # ch → /k/ (vocala e/i ce urmează rămâne vocală reală)
                toks.append(("k", False)); i += 2; continue
            if nxt in ("e", "i"):        # ce/ci → /tʃ/ (consumă doar 'c', vocala rămâne)
                toks.append(("tS", False)); i += 1; continue
            toks.append(("k", False)); i += 1; continue
        if c == "g":
            if nxt == "h":               # gh → /g/
                toks.append(("g", False)); i += 2; continue
            if nxt in ("e", "i"):        # ge/gi → /dʒ/
                toks.append(("dZ", False)); i += 1; continue
            toks.append(("g", False)); i += 1; continue
        if c == "x":                     # x → /ks/
            toks.append(("k", False)); toks.append(("s", False)); i += 1; continue
        if c in VOWEL_MAP:
            toks.append((VOWEL_MAP[c], True)); i += 1; continue
        toks.append((CONS_MAP.get(c, c), False)); i += 1; continue

    # -i final palatalizat: 'i' vocală finală, după CONSOANĂ (nu după vocală) → marcaj /ʲ/, nu nucleu.
    # (lupi/munți rimează cu marcaj palatal; copii/întâi păstrează 'i' vocală fiindcă urmează vocalei)
    if len(toks) >= 2 and toks[-1] == ("i", True) and not toks[-2][1]:
        toks[-1] = ("j", False)
    return toks


def nuclei_idx(toks):
    """Indicii tokenilor-vocală (nucleele silabice)."""
    return [k for k, t in enumerate(toks) if t[1]]


def stressed_nucleus(toks, override):
    """Indexul (în toks) al vocalei accentuate. override = k de la final (0=ultim) sau None."""
    nuc = nuclei_idx(toks)
    if not nuc:
        return None
    if override is not None and 0 <= override < len(nuc):
        return nuc[-1 - override]
    # heuristică: ultimul token vocală → accent penultim; ultimul consoană → accent ultim
    if toks[-1][1]:
        return nuc[-2] if len(nuc) >= 2 else nuc[-1]
    return nuc[-1]


def rhyme_keys(word, override=None):
    """(cheie_perfect, cheie_asonanță, nr_silabe) sau None dacă nu are vocală."""
    toks = g2p(word)
    s = stressed_nucleus(toks, override)
    if s is None:
        return None
    tail = toks[s:]
    perfect = ".".join(sym for sym, _ in tail)          # toate fonemele de la accent
    ason = ".".join(sym for sym, isv in tail if isv)    # doar vocalele de la accent
    return perfect, ason, len(nuclei_idx(toks))


def load_levels():
    """Reia validarea din gen_words.py: 3 niveluri, ≥2 cuvinte, fără dups intra/cross-nivel."""
    data = json.loads(SRC.read_text(encoding="utf-8"))
    if "levels" not in data:
        raise SystemExit("EROARE: wordbank.json nu are cheia 'levels'.")
    raw, bank, seen = data["levels"], {}, {}
    for lvl in LEVELS:
        if lvl not in raw:
            raise SystemExit(f"EROARE: lipsește nivelul '{lvl}'.")
        words = raw[lvl]
        if not isinstance(words, list) or len(words) < 2:
            raise SystemExit(f"EROARE: nivelul '{lvl}' trebuie să aibă ≥2 cuvinte.")
        for w in words:
            if w in seen:
                raise SystemExit(f"EROARE: '{w}' apare în '{seen[w]}' ȘI '{lvl}' (dup cross-nivel).")
            seen[w] = lvl
        bank[lvl] = words
    return bank


def load_stress():
    if not STRESS_SRC.exists():
        return {}
    raw = json.loads(STRESS_SRC.read_text(encoding="utf-8"))
    return {str(k): int(v) for k, v in raw.items()}


def build(bank, stress):
    """Construiește index invers + chei per cuvânt. Întoarce (index, keys, stats)."""
    all_words = sorted(w for ws in bank.values() for w in ws)
    perfect_idx, ason_idx, keys = {}, {}, {}
    no_vowel = []
    for w in all_words:
        rk = rhyme_keys(w, stress.get(w))
        if rk is None:
            no_vowel.append(w)
            continue
        p, a, nsyl = rk
        keys[w] = {"p": p, "a": a, "n": nsyl}
        perfect_idx.setdefault(p, []).append(w)
        ason_idx.setdefault(a, []).append(w)
    for d in (perfect_idx, ason_idx):
        for k in d:
            d[k].sort()

    # fail-loud (D29): orfan = niciun partener nici pe perfect, nici pe asonanță
    orphans = [w for w, k in keys.items()
               if len(perfect_idx[k["p"]]) == 1 and len(ason_idx[k["a"]]) == 1]
    perfect_only_orphan = [w for w, k in keys.items() if len(perfect_idx[k["p"]]) == 1]
    stats = {
        "count": len(keys),
        "heuristic_stress": len(keys) - len([w for w in keys if w in stress]),
        "no_vowel": no_vowel,
        "orphans": sorted(orphans),
        "perfect_orphans": len(perfect_only_orphan),
        "perfect_groups": sum(1 for v in perfect_idx.values() if len(v) > 1),
    }
    index = {"perfect": perfect_idx, "asonanta": ason_idx}
    return index, keys, stats


def canonical_hash(index, keys):
    canon = json.dumps({"i": index, "k": keys}, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canon.encode("utf-8")).hexdigest()


def read_existing_hash():
    if not OUT.exists():
        return None
    import re
    m = re.search(r'hash:\s*"([0-9a-f]{64})"', OUT.read_text(encoding="utf-8"))
    return m.group(1) if m else None


def render_js(index, keys, h):
    idx_body = json.dumps(index, ensure_ascii=False, indent=2, sort_keys=True)
    keys_body = json.dumps(keys, ensure_ascii=False, indent=2, sort_keys=True)
    return (
        "// AUTO-GENERAT din wordbank.json (+ assets/stress.json) — NU EDITA (rulează: python gen_rhymes.py)\n"
        "// RHYME_INDEX: cheie_rimă → [cuvinte]. RHYME_KEYS: cuvânt → {p:perfect, a:asonanță, n:silabe}.\n"
        f"const RHYME_INDEX = {idx_body};\n\n"
        f"const RHYME_KEYS = {keys_body};\n\n"
        f"const RHYME_META = {{ count: {len(keys)}, hash: \"{h}\" }};\n"
    )


def main():
    bank = load_levels()
    stress = load_stress()
    index, keys, stats = build(bank, stress)
    h = canonical_hash(index, keys)

    if stats["no_vowel"]:
        raise SystemExit(f"EROARE: cuvinte fără vocală (G2P degenerat): {stats['no_vowel']}")

    if "--check" in sys.argv:
        existing = read_existing_hash()
        if existing is None:
            raise SystemExit("CHECK FAIL: rhymes.js lipsește sau nu are hash. Rulează: python gen_rhymes.py")
        if existing != h:
            raise SystemExit(
                "CHECK FAIL: rhymes.js e STALE (hash diferă).\n"
                "  Cauză: wordbank.json/stress.json editate fără regenerare, SAU algoritm schimbat, SAU rhymes.js editat de mână.\n"
                "  Fix: python gen_rhymes.py"
            )
        print(f"CHECK OK: rhymes.js e fresh ({stats['count']} cuvinte, hash {h[:12]}…).")
        return

    OUT.write_text(render_js(index, keys, h), encoding="utf-8")
    print(f"OK: rhymes.js scris — {stats['count']} cuvinte · "
          f"{stats['perfect_groups']} grupuri perfecte · "
          f"{stats['heuristic_stress']} accente heuristice · hash {h[:12]}…")
    if stats["orphans"]:
        print(f"⚠  {len(stats['orphans'])} ORFANE (nicio rimă nici perfect nici asonanță) — "
              f"vor arăta „fără rime” în UI:\n   {', '.join(stats['orphans'])}")
    else:
        print("✓ zero orfane totale (fiecare cuvânt are cel puțin o rimă/asonanță).")


if __name__ == "__main__":
    main()
