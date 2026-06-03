# Code Review — RapScript v2 (Epic 7 rime + Epic 8 voce)

> Range: `167250e..6438e4b` · 5 commits · data: 2026-06-03
> Layere: Blind Hunter (ce-adversarial-reviewer) + Edge Case Hunter + Acceptance Auditor (vs `architecture-voice-rhyme.md`)
> Verificat la sursă înainte de triaj. 1 fals-pozitiv aruncat (`is-listening` ESTE stilizat, style.css:287-289).

## Decision-needed (REZOLVATE 2026-06-03)

- [x] **D1** → **implementează D34 (QQ)**: `continuous=false` + interim estompat → confirmat pe `isFinal` (app.js:470,474). *Mutat în Patch.*
- [x] **D2** → **defer**: snap tăcut rămâne; semnal de incertitudine la v2.1.
- [x] **D3** → **hold-only button (QQ)**: butonul 🎤 devine press-and-hold ca Space (app.js:500). *Mutat în Patch.*
- [x] **D4** → **fail-loud guard (QQ)**: `SystemExit` pe `true_orphans` rămase după backfill (gen_rhymes.py:358). *Mutat în Patch.*
- [x] **D5** → **defer + item ER**: rulează testul live 20+ cuvinte pe Chrome (gate-ul D36 nesatisfăcut la ship).

## Patch

- [ ] **P1** — freshness hash divergent: `canonical_hash` hash-uiește `extra` nefiltrat (gen_rhymes.py:271) dar `render_js` filtrează `if w in keys` (288); `stress.json` lipsește complet din hash → editări de accent nedetectate. Fix: hash extra filtrat + include stress.
- [x] **P2** — Space-tap dublu (app.js:243): tap cât mic-ul e pornit din buton → oprește mic ȘI toggle play. **APLICAT**: guard `if (state.listening) return` în `handleSpaceUp`.
- [x] **P3** — PTT timer leak (app.js:240): ții Space → schimbi tab → `keyup` nu vine → mic blocat ON. **APLICAT**: `abortPtt()` pe `blur`+`visibilitychange`.
- [x] **P4** — `aborted` nemapat (app.js:477): stop normal arată „⚠ microfon: aborted". **APLICAT**: `aborted` → tăcut.
- [ ] **P5** — CI push race (check.yml): commit-uri UI apropiate → al 2-lea push respins → `rhymes.js` pierdut. Fix: `pull --rebase` + retry sau `concurrency` group. *(→ QQ)*
- [x] **P6** — disclosure GDPR incomplet (app.js:492): lipsește „Niciun fragment audio nu e stocat" (D39). **APLICAT**: „nimic nu se stochează".
- [ ] **P7** (din D1) — implementează D34: `continuous=false` + interim estompat → confirmat pe `isFinal` (app.js:469-475). Task QQ.
- [ ] **P8** (din D3) — buton 🎤 hold-only: press-and-hold ca Space, eliberezi → stop (app.js:500, 583+). Task QQ.
- [ ] **P9** (din D4) — fail-loud orfane: `SystemExit` pe `true_orphans` rămase după backfill RoLEX (gen_rhymes.py:358). Task QQ.

## Defer (data-quality / pre-existent / deja urmărit)

- [x] onend lasă `micMsg` stale cât e pauză (Low) — deferred
- [x] `extract_stress` aliniere vocale ortografice vs nuclee g2p; diftongi → unele din 71 overrides posibil greșite (gen_rhymes.py:1034) — deferred, data-quality
- [x] D28 „0% accent" overclaim: 102 cuvinte cad pe heuristic, neverificate RoLEX — deferred, data-quality
- [x] snap O(bancă×len) per interim, fără debounce (app.js:447) — deferred, perf micro
- [x] `startListening` setează `playing=false`+`restartTimer` înainte de a confirma `.start()` (app.js:489) — deferred, Low
- [x] `find_rolex_rhymes` ordine dedupe lemă poate degrada o rimă (gen_rhymes.py:1068) — deferred, data-quality
- [x] OQ-V7: cuvinte rostite/adăugate fără backfill RoLEX până la regen — deferred, deja tracked în git
- [x] FR-15: toggle manual de limbă neimplementat (hard-coded ro-RO) — deferred, scoped în 8.4
- [x] snap exact-tie → rezolvă pe ordinea de iterație, nu frecvență (app.js:451) — deferred, Low
