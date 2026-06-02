#!/usr/bin/env python3
"""Derivă words.js din assets/wordbank.json — determinist, validat, fail-loud.

Singurul scriitor al words.js (D3). Rulează:
    python gen_words.py           # generează words.js
    python gen_words.py --check   # verifică freshness (exit non-zero dacă words.js e stale)

Erorile se aruncă (nu try/except tăcut). Date proaste = NU se scrie nimic.
"""
import json
import hashlib
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "assets" / "wordbank.json"
OUT = ROOT / "words.js"
LEVELS = ("incepator", "avansat", "profesionist")  # ordinea de dificultate


def load_levels() -> dict:
    """Citește DOAR d['levels'] (ignoră meta/rubrics), sortat determinist."""
    data = json.loads(SRC.read_text(encoding="utf-8"))
    if "levels" not in data:
        raise SystemExit("EROARE: wordbank.json nu are cheia 'levels'.")
    raw = data["levels"]

    # validare: exact cele 3 niveluri, fiecare ≥2 cuvinte, fără dups intra-nivel
    bank = {}
    seen_global = {}
    for lvl in LEVELS:
        if lvl not in raw:
            raise SystemExit(f"EROARE: lipsește nivelul '{lvl}'.")
        words = raw[lvl]
        if not isinstance(words, list) or len(words) < 2:
            raise SystemExit(f"EROARE: nivelul '{lvl}' trebuie să aibă ≥2 cuvinte (are {len(words)}).")
        if len(set(words)) != len(words):
            dups = sorted({w for w in words if words.count(w) > 1})
            raise SystemExit(f"EROARE: dups intra-nivel în '{lvl}': {dups}")
        # dups cross-nivel (fail-loud — D4)
        for w in words:
            if w in seen_global:
                raise SystemExit(f"EROARE: '{w}' apare în '{seen_global[w]}' ȘI '{lvl}' (dup cross-nivel).")
            seen_global[w] = lvl
        bank[lvl] = sorted(words)  # sortare → diff curat
    return bank


def canonical_hash(bank: dict) -> str:
    """sha256 pe JSON-ul canonic al nivelurilor (sortat). Stabil între rulări."""
    canon = json.dumps(bank, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canon.encode("utf-8")).hexdigest()


def read_existing_hash() -> str | None:
    """Extrage WORD_BANK_META.hash din words.js existent (pentru --check)."""
    if not OUT.exists():
        return None
    import re
    m = re.search(r'hash:\s*"([0-9a-f]{64})"', OUT.read_text(encoding="utf-8"))
    return m.group(1) if m else None


def render_js(bank: dict, h: str) -> str:
    count = sum(len(v) for v in bank.values())
    generated = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    # WORD_BANK ca OBIECT (state.level îl indexează direct — D5)
    body = json.dumps(bank, ensure_ascii=False, indent=2, sort_keys=True)
    return (
        "// AUTO-GENERAT din wordbank.json — NU EDITA (rulează: python gen_words.py)\n"
        f"const WORD_BANK = {body};\n\n"
        f"const WORD_BANK_META = {{ count: {count}, hash: \"{h}\", generated: \"{generated}\" }};\n"
    )


def main() -> None:
    bank = load_levels()
    h = canonical_hash(bank)

    if "--check" in sys.argv:
        existing = read_existing_hash()
        if existing is None:
            raise SystemExit("CHECK FAIL: words.js lipsește sau nu are hash. Rulează: python gen_words.py")
        if existing != h:
            raise SystemExit(
                "CHECK FAIL: words.js e STALE (hash diferă de wordbank.json).\n"
                "  Cauză: ai editat wordbank.json fără să regenerezi, SAU ai editat words.js de mână.\n"
                "  Fix: python gen_words.py"
            )
        count = sum(len(v) for v in bank.values())
        print(f"CHECK OK: words.js e fresh ({count} cuvinte, hash {h[:12]}…).")
        return

    OUT.write_text(render_js(bank, h), encoding="utf-8")
    count = sum(len(v) for v in bank.values())
    print(f"OK: words.js scris — {count} cuvinte "
          f"({', '.join(f'{k}={len(v)}' for k, v in bank.items())}), hash {h[:12]}…")


if __name__ == "__main__":
    main()
