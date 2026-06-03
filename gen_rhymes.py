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
EXTRA_SRC = ROOT / "assets" / "rhyme_extra.json"  # opțional: {cuvânt: [rime externe]} pt cuvinte sub-deservite (RoLEX)
OUT = ROOT / "rhymes.js"
MIN_HINT = 5  # câte sugestii vrem la afișaj (D41); sub atât → backfill din RoLEX
LEVELS = ("incepator", "avansat", "profesionist")

# litere-vocală (ortografic) → simbol fonetic (â și î colapsează în /ɨ/ = '1')
VOWEL_MAP = {"a": "a", "ă": "@", "â": "1", "î": "1", "e": "e", "i": "i", "o": "o", "u": "u"}
ORTHO_VOWELS = set("aăâeiouî")  # litere-vocală (pt numărat ordinea accentului din RoLEX)
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


def heuristic_from_end(toks):
    """Indexul-de-la-final al nucleului pe care l-ar alege euristica (fără override)."""
    nuc = nuclei_idx(toks)
    s = stressed_nucleus(toks, None)
    return (len(nuc) - 1) - nuc.index(s)


def load_rolex(path):
    """RoLEX → (forms, form_ph, col5_of). forms = listă (formă, foneme, msd, lemă) pt TOT lexiconul
    (căutare de sufix); form_ph/col5_of = prima apariție per formă. RoLEX NU se comite (OQ-V2)."""
    forms, form_ph, col5_of = [], {}, {}
    with open(path, encoding="utf-8") as f:
        for line in f:
            p = line.rstrip("\n").split("\t")
            if len(p) < 6:
                continue
            form = p[0].strip().lower()
            ph = tuple(p[5].split())
            lemma = p[1].strip().lower()
            if lemma == "=":      # RoLEX: '=' înseamnă lemă identică cu forma (cuvânt de bază)
                lemma = form
            forms.append((form, ph, p[2], lemma))
            if form not in form_ph:
                form_ph[form] = ph
                col5_of[form] = p[4]
    return forms, form_ph, col5_of


def extract_stress(col5_of, bank_words):
    """Override-uri de accent DOAR unde euristica greșește (accent = nucleu-de-la-final, alfabet g2p)."""
    overrides, missing, skipped = {}, [], []
    for w in sorted(bank_words):
        col5 = col5_of.get(w)
        if col5 is None:
            missing.append(w)
            continue
        toks = g2p(w)
        N = len(nuclei_idx(toks))
        if N == 0:
            continue
        apos = col5.find("'")
        if apos < 0:
            rolex_fe = 0  # monosilabă / fără marcaj → ultima
        else:
            if col5.replace("'", "").lower() != w:  # aliniere nesigură → lasă euristica
                skipped.append(w)
                continue
            ordinal = sum(1 for ch in w[:apos + 1] if ch in ORTHO_VOWELS)  # a câta vocală (de la start)
            if ordinal < 1 or ordinal > N:
                skipped.append(w)
                continue
            rolex_fe = N - ordinal
        if rolex_fe != heuristic_from_end(toks):
            overrides[w] = rolex_fe
    return overrides, missing, skipped


def find_rolex_rhymes(forms, form_ph, w, bank_set, want_n=6, zipf=None):
    """Rime externe pt un cuvânt: potrivire de sufix fonetic (grad 4 → grad 3), filtrând nume proprii
    (msd `Np`), flexiuni (aceeași lemă), și cuvintele din bancă. Preferă formele de bază (lemă).
    Rang (dacă `zipf` dat): cuvinte COMUNE întâi (freq desc); rarele-dar-valide doar ca umplutură —
    fiindcă corpusul RO al wordfreq e mic, freq=0 NU înseamnă junk (ex. artificiu/ceaun sunt valide)."""
    ph = form_ph.get(w)
    if not ph:
        return []
    w_lemma = next((lem for (f, p, m, lem) in forms if f == w), w)
    lemma_of = {}
    cand_grade = {}
    for grade in (4, 3):
        if len(ph) < grade:
            continue
        suf = ph[-grade:]
        for (form, fph, msd, lemma) in forms:
            if form == w or form in bank_set or msd.startswith("Np") or lemma == w_lemma:
                continue
            if len(fph) >= grade and fph[-grade:] == suf:
                lemma_of[form] = lemma
                if grade > cand_grade.get(form, 0):
                    cand_grade[form] = grade
    if not cand_grade:
        return []
    # dedupe pe lemă (preferă forma de bază)
    best = {}
    for form in cand_grade:
        key = lemma_of.get(form, form)
        if key not in best or form == key:
            best[key] = form
    cands = list(best.values())
    zf = (lambda c: zipf(c, "ro")) if zipf else (lambda c: 0.0)
    if zipf:
        known = sorted((c for c in cands if zf(c) >= 2.5), key=lambda c: -zf(c))     # comune, freq desc
        rare = sorted((c for c in cands if zf(c) < 2.5), key=lambda c: (-cand_grade[c], len(c), c))
        ordered = known + rare
    else:
        ordered = sorted(cands, key=lambda c: (-cand_grade[c], len(c), c))
    return ordered[:want_n]


def load_extra():
    if not EXTRA_SRC.exists():
        return {}
    raw = json.loads(EXTRA_SRC.read_text(encoding="utf-8"))
    return {str(k): list(v) for k, v in raw.items()}


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


def canonical_hash(index, keys, extra):
    canon = json.dumps({"i": index, "k": keys, "e": extra}, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canon.encode("utf-8")).hexdigest()


def read_existing_hash():
    if not OUT.exists():
        return None
    import re
    m = re.search(r'hash:\s*"([0-9a-f]{64})"', OUT.read_text(encoding="utf-8"))
    return m.group(1) if m else None


def render_js(index, keys, stress, extra, h):
    idx_body = json.dumps(index, ensure_ascii=False, indent=2, sort_keys=True)
    keys_body = json.dumps(keys, ensure_ascii=False, indent=2, sort_keys=True)
    # doar override-urile pt cuvinte din bancă — JS le aplică identic (paritate g2p+accent)
    stress_body = json.dumps({w: stress[w] for w in sorted(stress) if w in keys}, ensure_ascii=False, sort_keys=True)
    extra_body = json.dumps({w: extra[w] for w in sorted(extra) if w in keys}, ensure_ascii=False, indent=2, sort_keys=True)
    return (
        "// AUTO-GENERAT din wordbank.json (+ assets/stress.json, assets/rhyme_extra.json) — NU EDITA (python gen_rhymes.py)\n"
        "// RHYME_INDEX: cheie_rimă → [cuvinte]. RHYME_KEYS: cuvânt → {p:perfect, a:asonanță, n:silabe}.\n"
        "// RHYME_STRESS: cuvânt → nucleu accentuat (override accent RoLEX, paritate JS).\n"
        "// RHYME_EXTRA: cuvânt → rime externe (RoLEX) pt cele sub-deservite în bancă (grad 4→3).\n"
        f"const RHYME_INDEX = {idx_body};\n\n"
        f"const RHYME_KEYS = {keys_body};\n\n"
        f"const RHYME_STRESS = {stress_body};\n\n"
        f"const RHYME_EXTRA = {extra_body};\n\n"
        f"const RHYME_META = {{ count: {len(keys)}, hash: \"{h}\" }};\n"
    )


def main():
    bank = load_levels()
    all_words = [w for ws in bank.values() for w in ws]

    # --from-rolex PATH: derivă assets/stress.json + assets/rhyme_extra.json din RoLEX (o dată / când
    # crește banca). RoLEX (24MB) NU se comite (OQ-V2); doar cele 2 fișiere derivate (mici) sunt livrate.
    if "--from-rolex" in sys.argv:
        path = sys.argv[sys.argv.index("--from-rolex") + 1]
        forms, form_ph, col5_of = load_rolex(path)
        # 1) accent
        overrides, missing, skipped = extract_stress(col5_of, all_words)
        STRESS_SRC.write_text(json.dumps(overrides, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        print(f"OK: stress.json — {len(overrides)} override-uri · {len(missing)} negăsite · {len(skipped)} sărite (aliniere).")
        # 2) backfill rime externe pt cuvinte sub-deservite (< MIN_HINT rime în bancă)
        try:
            from wordfreq import zipf_frequency as zipf  # rang după frecvență (comunele întâi)
        except ImportError:
            zipf = None
            print("  ⚠ wordfreq lipsește — fără rang de frecvență (mai mult zgomot). venv: ~/.venvs/rapscript")
        idx0, keys0, _ = build(bank, load_stress())
        bank_set = set(all_words)
        extra = {}
        for w in sorted(keys0):
            have = {x for x in (idx0["perfect"].get(keys0[w]["p"], []) + idx0["asonanta"].get(keys0[w]["a"], [])) if x != w}
            if len(have) >= MIN_HINT:
                continue
            rl = [r for r in find_rolex_rhymes(forms, form_ph, w, bank_set, zipf=zipf) if r not in have]
            if rl:
                extra[w] = rl
        EXTRA_SRC.write_text(json.dumps(extra, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        print(f"OK: rhyme_extra.json — {len(extra)} cuvinte sub-deservite primesc rime din RoLEX "
              f"(ex. sceptru: {', '.join(extra.get('sceptru', [])[:4]) or '—'}).")
        # cade spre regenerarea normală (folosește noile stress.json + rhyme_extra.json)

    stress = load_stress()
    extra = load_extra()
    index, keys, stats = build(bank, stress)
    h = canonical_hash(index, keys, extra)

    if stats["no_vowel"]:
        raise SystemExit(f"EROARE: cuvinte fără vocală (G2P degenerat): {stats['no_vowel']}")

    if "--check" in sys.argv:
        existing = read_existing_hash()
        if existing is None:
            raise SystemExit("CHECK FAIL: rhymes.js lipsește sau nu are hash. Rulează: python gen_rhymes.py")
        if existing != h:
            raise SystemExit(
                "CHECK FAIL: rhymes.js e STALE (hash diferă).\n"
                "  Cauză: wordbank.json/stress.json/rhyme_extra.json editate fără regenerare, SAU algoritm schimbat.\n"
                "  Fix: python gen_rhymes.py"
            )
        print(f"CHECK OK: rhymes.js e fresh ({stats['count']} cuvinte, hash {h[:12]}…).")
        return

    OUT.write_text(render_js(index, keys, stress, extra, h), encoding="utf-8")
    true_orphans = [w for w in stats["orphans"] if w not in extra]
    print(f"OK: rhymes.js scris — {stats['count']} cuvinte · {stats['perfect_groups']} grupuri perfecte · "
          f"{stats['heuristic_stress']} accente heuristice · {len(extra)} cu backfill RoLEX · hash {h[:12]}…")
    if true_orphans:
        print(f"⚠  {len(true_orphans)} încă orfane (nici bancă, nici RoLEX): {', '.join(true_orphans)}")
    else:
        print("✓ zero orfane (fiecare cuvânt are rime — din bancă sau RoLEX).")


if __name__ == "__main__":
    main()
