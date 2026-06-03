---
title: 'Deep Research — Voce → Rimă Live'
feature: 'Voice → Live Rhyme (v2)'
date: '2026-06-02'
status: 'research complete'
method: '52 agenți (35 cercetare + 14 verificare adversarială + 3 sinteză) pe Opus'
relatedDocs:
  - docs/architecture-voice-rhyme.md   # addendum BMad (D26–D34, Epics 7–8) — decizii
  - docs/architecture.md               # v1 (D1–D25)
  - docs/prd.md
supersedesPremise: 'D28 prima propunere (matching pe ultimele N litere) și premisa „construim lexicon RO de la zero"'
---

# Deep Research — Voce → Rimă Live (RapScript RO v2)

Feature cerut: **microfonul ascultă → recunoaște cuvântul RO rostit → îl afișează → în aceeași
secundă scoate ≥5 sugestii de rimă rapide.** Acest doc e baza de dovezi (research + verificare
adversarială); deciziile de arhitectură trăiesc în `docs/architecture-voice-rhyme.md`.

---

## 0. Verdict în 4 propoziții

1. **Fezabil — dar „aceeași secundă" e dusă ~99% de recunoașterea vocală (STT), nu de rime.** Lookup-ul
   de rimă e <1ms; toată latența și tot riscul stau în microfon.
2. **Combinația „mic live → cuvânt pe ecran → rime live" nu există pe piață în nicio limbă, iar pe
   română slotul e complet gol.** Construim integrând piese dovedite, nu inventând primitive.
3. **Calea care prinde sub-1s pe laptopul tău de 2GB (ASUS X205TA) e Web Speech API cloud (`ro-RO`),
   NU Whisper local** (2–8s pe Atom — descalificat de 2 verificatori adversariali).
4. **Cea mai importantă decizie de arhitectură e ieftină și nu e în addendum-ul auto-generat:**
   *snap* fiecare transcript la cel mai apropiat cuvânt din banca de 417 → transformi un ASR cu ~11%+
   WER într-un clasificator pe 417 căi, aproape determinist.

---

## 1. Prior art — ce există și ce e nou

**Cele două jumătăți există separat; combinația, pe română, nu.**

| Categorie | Exemple reale | Ce fac / ce le lipsește |
|---|---|---|
| Generatoare de cuvinte freestyle | RapScript.net (17 limbi, incl. RO), The Rhyme Game (MWM 2024), Rhymeo (2015) | Flash de cuvinte random / tap-to-reveal. **Nu ascultă, nu dau rime.** |
| Motoare de rimă | Datamuse (`rel_rhy`), RhymeZone, RhymeBrain, B-Rhymes, RHYMEBOOK | Tipar clasic (foneme → sufix de la vocala accentuată → map invers). **Toate EN/ES; zero RO. Niciunul declanșat de microfon — cer să _scrii_.** |
| Mic → text live, context rap | **RapDrill** (rapdrill.com) | Ascultă live (Web Speech), EN, dar **scorează** cât de repede incluzi un cuvânt — nu sugerează rime. |
| Academic „ascultă + produce text" | **LyricJam** (U. Waterloo, 2021) | Generează versuri întregi din audio instrumental — nu rime pt un cuvânt rostit. |
| Site-uri RO de rime | rimeaza.ro, cerimeaza.ro, dexonline.net/dictionar-rime, ro.azrhymes.com | **UI-only, fără API, 403 la scraping.** Inutile la runtime. |

**Ce e genuin nou:** combinația de produs + limba română. Trei dosare independente au convers pe
„nimeni nu închide bucla completă, în nicio limbă". Precedent arhitectural cel mai apropiat: o app FR
de rime offline („Remède") cu exact abordarea index-fonetic-precalculat (= D27). **Bună poziție:
integrezi piese probate, nu inventezi.**

**Corecția-cheie la premisa proiectului:** NU trebuie să construim un lexicon de pronunție RO de la
zero. Datele lingvistice brute există deja:
- **RoLEX** (`github.com/adrianastan/rolex`) — 330.866 forme RO cu transcriere fonemică, silabație și
  **accent lexical**. E „CMUdict-ul românesc". *(licență de verificat — OQ-V2)*
- **MaRePhoR** (`speech.utcluj.ro/marephor`) — 72.375 cuvinte, SAMPA, cu accent. CC BY-NC.
- **espeak-ng** (reguli G2P `ro`) + **phonemizer** — fallback pentru cuvinte lipsă (slang, neologisme).

---

## 2. Fezabilitate & buget de latență (onest)

Bugetul „aceleiași secunde" se cheltuie aproape integral pe STT. Defalcare realistă (path cloud):

| Etapă | Cost | Note |
|---|---|---|
| Captură mic (`getUserMedia`) | 50–100ms | Podea fixă; ~100ms pe Atom de 2GB |
| VAD / endpointing | 150–500ms | **Cel mai mare buton.** Pragurile default (500–800ms) sparg singure bugetul → tunează la 150–300ms (risc: tai cuvinte cu plosivă finală) |
| STT — rezultat **interim** (Web Speech, `ro-RO`) | 200–500ms | Round-trip la Google. Apare **înainte** de `isFinal`; pe ăsta declanșezi |
| Extragere cheie de rimă (JS) | <5ms | Normalizezi diacritice + sufixul de la vocala accentuată |
| Lookup index rimă (JSON precalc.) | <1ms | Acces O(1). Verdict adversarial: **CONFIRMED/high** |
| Render 5 carduri | ~16ms | Un frame rAF |
| **Total perceput (cale interim)** | **~400–700ms** | Sub-1s pe Chrome + rețea decentă |

Verdictele adversariale pe „sub-1s" au ieșit **PARTIAL/high** și **PARTIAL/medium** — ambele se reduc
la *aceeași* condiție: **ține pe calea cloud cu rețea bună; pică pe Firefox, iOS-Chrome, offline, pe
Whisper-WASM în browser, și degradează pe conexiuni slabe.**

**Trucul care-l face să meargă:** declanșează lookup-ul de rimă pe rezultatul **interim**
(`interimResults=true`, `isFinal=false`), nu pe final. Pentru un cuvânt unic, ipoteza interimă vine în
~150–300ms. Afișezi rimele provizoriu (estompat), confirmi pe `isFinal`. E tiparul de stabilitate
Google Live Caption — diferența între „pare instant" și „pare laggy".

---

## 3. Recomandare — stratul de captură vocală (ASR)

**PRIMAR: Web Speech API (`SpeechRecognition`), mod cloud, `lang='ro-RO'`, `interimResults=true`,
`continuous=false`.** Singura cale care prinde sub-1s pe hardware-ul țintă, zero dependențe, zero build,
zero cost/cerere, pur client-side peste HTTPS → fit perfect pe GitHub Pages. ro-RO e **confirmat
acceptat** pe backend-ul cloud Chrome/Safari.

**De ce NU alternativele ca primar:**
- **Whisper-WASM local (transformers.js/whisper-tiny):** infirmat de 2 verdicte adversariale pe ținta
  low-end. Pe Atom Z3735F (PassMark 540, fără SIMD/WebGPU) → **2–8s/cuvânt**, sparge bugetul de 3–8×;
  cere și COOP/COEP pe care GitHub Pages nu le poate seta. Off the table pt v1.
- **Web Speech on-device (Chrome 139 `processLocally`/SODA):** **româna NU e în pachetul SODA** (doar
  en-US confirmat). Orice apel ro-RO cade pe rețea oricum. Nu te baza pe el.
- **Cloud streaming (Deepgram/Groq):** real sub-1s + RO, dar cer Cloudflare Worker (proxy de cheie) +
  cont/billing → **tier de upgrade/fallback, nu default.**

**FALLBACK: Cloudflare Worker → Groq Whisper `whisper-large-v3-turbo` (`language='ro'`), gated pe VAD.**
Pentru browsere fără `SpeechRecognition` (Firefox = 0; iOS Chrome blocat de WebKit) sau la erori
`network` repetate. Worker-ul există deja în repo (`worker/`) — singura lui treabă: ține `GROQ_API_KEY`
server-side și releuiește clipul Opus. ~400–700ms total. Groq peste Deepgram pt fallback: e simplu REST
relay (nu WebSocket), cheia Groq e deja în stack, iar pt cuvinte de 1–2s nu există avantaj de streaming
care să justifice complexitatea.

**Endpointing/VAD (fallback):** `@ricky0123/vad-web` (Silero v5, AudioWorklet, ~2.4MB). Tunare critică
pt cuvinte izolate: `redemptionFrames` 3–5 (~290–480ms, nu ~1400ms default), `preSpeechPadMs` 0–100,
`minSpeechFrames` 1–2. Pre-gate RMS ieftin ca Silero să ruleze doar când e sunet (economie CPU pe 2GB).

---

## 4. Recomandare — motorul de rimă

**Construim index static precalculat (NU API).** Datamuse/RhymeBrain n-au RO; site-urile RO n-au API
și dau 403. La 417 cuvinte, problema se reduce la o buclă de build + un lookup pe obiect în memorie.

**Build offline — `gen_rhymes.py` (frate cu `gen_words.py`, NU îl modifică):**
1. **Intrări:** `wordbank.json` (417) + **`stress.json` NOU** (accent adnotat o dată) + RoLEX (build-time,
   pt stress+IPA) + `wordfreq` (zipf, ranking) + espeak-ng (G2P fallback OOV).
2. **Cheia de rimă** = sufix fonetic de la **ultima vocală accentuată** până la final (NU ultimele N
   litere — rima e fenomen sonor). Normalizări în build: `â/î→ɨ`; `ce/ci→/tʃ/`, `ge/gi→/dʒ/`,
   `che/ghe→/k,g/`; `-i` final palatalizat (`lupi` /lupʲ/) ca marcaj, nu vocală.
3. **Trei chei per cuvânt (cascadă):** PERFECT (sufix de la accent) · SLANT (coade relaxate pe familie
   fonetică) · ASONANȚĂ (secvența de vocale a ultimelor 1/2/3 silabe). Inversare în buckets pre-sortate
   pe scor la build.
4. **Output `rhymes.js`** (`const RHYME_INDEX={...}` + `RHYME_META={count,hash}`), inclus prin
   `<script>` înainte de `app.js` (fără `fetch` → merge pe `file://` și pe subpath Pages). ~5–15KB raw,
   ~4–6KB gzip. `--check` freshness gate ca la `gen_words.py`. Verdict lookup <50ms: **CONFIRMED**.

**De ce adnotăm accentul (`stress.json`) în loc să-l calculăm:** verdictul „româna e destul de fonetică
fără dicționar" e **PARTIAL** — pică pe omografe de accent (`copii` copii vs `cópii`), `-i` final, și
neologisme. Pentru banca închisă de 417, adnotarea o-dată (câteva ore, cross-check vs RoLEX) duce
eroarea de accent la **0%**. Heuristica penultimă-silabă rămâne doar fallback pt cuvinte OOV la runtime.

**Ranking 5 cele mai bune (instant, toate semnalele precalculate):**
`scor = 0.55·overlap_fonetic + 0.20·potrivire_silabe + 0.15·frecvență(zipf) + 0.10·bonus_rimă_bogată`.
Buckets pre-sortate la build → runtime = walk perfect → dacă <5 adaugă slant → dacă <5 adaugă asonanță
→ `.slice(0,5)`. Total <1ms.

---

## 5. Mitigarea #1 (cea mai importantă, ieftină, lipsește din addendum)

> **Snap fiecare ieșire ASR la cel mai apropiat cuvânt din banca de 417 ÎNAINTE de afișare/lookup.**

Cel mai mare risc nu e latența — e **acuratețea ASR pe livrare rap rapidă, cuvinte izolate**. Whisper:
~10.9% WER pe RO citit curat (Soniox, mar. 2025) dar **25–62% WER pe RO spontan** (RoWhisper-large-v2,
arXiv 2511.03361). Freestyle = spontan. Un transcript greșit produce **rime greșite cu încredere, fără
semnal de eroare** — cel mai prost mod de eșec pt un tool de practică.

Pentru că **controlezi un vocabular închis (417 cuvinte)**, un fuzzy-match (Levenshtein / sufix comun,
insensibil la diacritice) pe ieșirea ASR transformă un WER open-domain de ~11% într-un clasificator pe
417 căi, aproape determinist. `SpeechGrammarList` e mort în Chrome → fă snap-ul **post-recunoaștere**.
Pe Groq, pasează banca și ca `prompt` (bias). **Aceasta e cea mai importantă decizie de arhitectură din
tot feature-ul și e ieftină.** Gate de calitate recomandat: vocea nu se lansează până un test live pe
20+ cuvinte din bancă, rostite în cadență rap, nu atinge o rată de snap acceptabilă (prag de stabilit).

---

## 6. Privacy & permisiuni (EU/RO)

**Default = push-to-talk, nu always-listening.** Ții butonul → `getUserMedia` se deschide pe apăsare,
track-ul se oprește la eliberare (stinge indicatorul de mic, economisește baterie). Cea mai curată
postură GDPR pt o app statică fără backend.

**Onestitate cloud (path A trimite audio la Google — trebuie declarat, nu ascuns):** notă inline când
mic-ul e activ: *„Recunoașterea vocală se face prin serverele Google. Niciun fragment audio nu este
stocat de RapScript."* Voce pt **transcriere** (nu identificare vorbitor) = Art. 6 GDPR, nu Art. 9
biometric → obligații simple; consimțământ = baza legală. Worker-ul (fallback Groq) = passthrough
stateless. **Niciodată credențiale de la user — doar chei scoped server-side.** Adevăr de spus simplu:
**nu există cale 100% privată pe hardware-ul ăsta** (Whisper local, singura fără egress, e descalificat
de cei 2GB).

---

## 7. Registru de riscuri (top 5)

| # | Risc | Severitate | Mitigare |
|---|---|---|---|
| 1 | ASR confundă cuvinte rap rapide → rime greșite fără semnal de eroare | **Critic** | **Fuzzy-snap pe banca de 417** (§5). Stare de incertitudine vizibilă. Căști (taie bleed-ul de beat). Test 20+ cuvinte înainte de lansare |
| 2 | Fragmentare browser: Firefox=0, iOS-Chrome=0, iOS-Safari interim instabil (~15–25% useri fără voce) | **Înalt** | Tastarea (FR-13) e co-egală, merge peste tot incl. `file://`. Feature-detect butonul (D32); niciodată buton mort. Deferred: Groq-via-Worker pt Firefox/iOS |
| 3 | Buget spart de pragul VAD sau rețea slabă (nu de calcul) | **Înalt** | VAD 150–300ms; declanșare pe interim; pe cădere rețea → fail loud → tastare |
| 4 | Regresie privacy + `file://` (v1 garanta local-only la dublu-click) | **Mediu** | Decuplarea D26 localizează tot răul în modulul voce opt-in. Rimă + tastare păstrează toate NFR v1. Voce = enhancement HTTPS-gated + disclosure |
| 5 | Licențe date (RoLEX fără LICENSE explicit; MaRePhoR/ipa-dict CC BY-NC) | **Mediu** | Build-time only; livrăm doar `rhymes.js` derivat (chei + liste), nu dump-ul RoLEX. Reguli espeak-ng (GPL) reimplementate ca ~25 reguli JS. Confirmă RoLEX cu autorul înainte de pivot comercial |

---

## 8. Rollout fazat (mapat pe Epics)

**Epic 7 — Motor de rimă (NEBLOCAT, începe ACUM):** aditiv-pur, zero regresie pe NFR v1, valoros
independent prin tastare pe orice browser incl. `file://`.
- 7.1 `gen_rhymes.py`: RoLEX+stress.json → cheie fonetică → `rhymes.js` + `--check` + fail-loud.
- 7.2 încărcare `rhymes.js` + guard + CI freshness gate (oglindă la 2.2/2.3).
- 7.3 UI rimă: `<input>` text → ≥5 sugestii prin `render()` unic (tokeni Nocturn, `aria-live`,
  reduced-motion). Default OFF, persistat localStorage cu try/catch (Safari).
- 7.4 gotcha-uri RO (`â/î`, `ce/ci`, `ge/gi`, `che/ghe`, `-i` final) verificate cu `?test=1`.
- *Cut din MVP:* mic, VAD, selector limbă, cascada slant completă (livrezi perfect+asonanță), Whisper.

**Epic 8 — Intrare vocală (BLOCAT pe D31 → recomandare cloud-primar):**
- 8.1 adapter Web Speech (`ro-RO`, interim-fire) → fuzzy-snap pe bancă → pre-completează inputul 7.3.
- 8.2 `@ricky0123/vad-web` tunat + push-to-talk + feature-detect/degradare (D32) + `<select>` limbă (D33).
- 8.3 fail-loud pe HTTPS lipsă / Firefox / permisiune refuzată / cădere rețea + disclosure privacy.
- 8.4 (deferred) cascadă slant/asonanță 3-tier; fallback Groq-via-Worker; mod privacy Whisper-WASM opt-in.

**Dependency:** Epic 7 → Epic 8. Epic 7 nu așteaptă nicio decizie.

---

## 9. Decizii deschise pentru owner (fasty)

- **D31 / OQ-V1 (BLOCANT pt voce):** care cale de recunoaștere? Recomandare: **cloud-primar (Web Speech
  `ro-RO`), HTTPS-gated, Whisper-WASM amânat ca opt-in privacy.** Singura ce prinde sub-1s pe laptopul de
  2GB azi. Costul: (a) vocea sparge `file://`, (b) audio merge la Google, (c) Firefox/iOS-Chrome = doar
  tastare. Alternativă: „100% local privacy" = Whisper, ~1–2s + 31–75MB la prima încărcare.
- **OQ-V3:** rime doar din banca proprie (417, curate dar puține per cuvânt) vs dicționar mare (RoLEX
  330k, volum dar ne-curat)? Recomandare: **hibrid** — banca proprie prima, backfill dintr-o felie RoLEX
  filtrată pe frecvență.
- **OQ-V4:** doar rime perfecte sau și slant/asonanță (mai utile la freestyle)? Recomandare: cascadă
  3-tier; MVP perfect+asonanță, slant complet în 8.4.
- **Întrebare de produs nouă:** mic-ul **înlocuiește** generatorul random (rapezi la ce-ai zis) sau
  **se suprapune** (cuvânt random apare, rapezi, rimele apar pt cuvântul TĂU)? Addendum-ul e ambiguu aici.

---

## 10. Surse (research 2026-06-02)

- **ASR:** MDN Web Speech API / `SpeechRecognition.processLocally` · caniuse speech-recognition · Chrome
  139 SODA (en-US only) · RoWhisper-large-v2 (arXiv 2511.03361, 25–62% WER spontan) · Whisper-large-v3
  ~10.9% WER RO citit (Soniox, mar. 2025) · `@ricky0123/vad-web` (Silero) · Groq `whisper-large-v3-turbo`
  · Deepgram Nova-3 (RO nov. 2025) · transformers.js / whisper.cpp WASM · vosk-browser (RO indisponibil).
- **Rimă:** RoLEX (`github.com/adrianastan/rolex`, 330k +accent) · MaRePhoR (`speech.utcluj.ro/marephor`,
  CC BY-NC) · open-dict-data/ipa-dict (RO) · espeak-ng/phonemizer · Ciobanu & Dinu „On the Romanian Rhyme
  Detection" (COLING 2012, `aclanthology.org/C12-3011`) · Steve Hanov „A Rhyming Engine" (2007, index
  sufix-fonetic) · Datamuse (EN/ES) · RhymeBrain (fără RO) · `wordfreq` (zipf, MIT).
- **Prior art:** RapScript.net · RapDrill (rapdrill.com) · LyricJam (U. Waterloo 2021) · The Rhyme Game
  (MWM 2024) · Rhymeo · „Remède" (FR offline, precedent index precalculat).

> **Notă proces:** rulat ca workflow `rapscript-voice-rhyme-research` — 52 agenți Opus (35 cercetare,
> 14 verificare adversarială pe 7 afirmații critice, 3 sinteză). Un agent de cercetare (codebase
> architecture) a picat la output structurat; acoperit de ceilalți. Un agent de sinteză a scris
> autonom `docs/architecture-voice-rhyme.md` (addendum BMad D26–D34). Acest raport îl extinde cu
> mitigarea fuzzy-snap (§5), `stress.json` din RoLEX (§4), descalificarea Whisper-WASM pe 2GB (§3) și
> fallback-ul Groq — care lipsesc din addendum.
