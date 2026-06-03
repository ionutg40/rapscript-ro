---
stepsCompleted: [1, 2, 3]
lastStep: 3
status: 'draft'
createdAt: '2026-06-02'
updatedAt: '2026-06-03'
parentDocument: docs/architecture.md
evidenceBase: docs/research-voice-rhyme-2026-06-02.md
inputDocuments:
  - docs/architecture.md
  - docs/research-voice-rhyme-2026-06-02.md
  - docs/addendum.md
  - docs/prd.md
workflowType: 'architecture-addendum'
feature: 'Voce → Rimă Live (v2)'
project_name: 'RapScript RO'
user_name: 'fasty'
date: '2026-06-03'
---

# Architecture Addendum — Voce → Rimă Live (v2)

_Addendum la `docs/architecture.md`. Continuă numerotarea deciziilor de la **D26** și FR-urile de la
**FR-11**. v1 (FR1-10, D1-D25) e LIVRAT. **Doc de DECIZII**; baza de dovezi (research + verificare
adversarială pe 52 agenți) trăiește în `docs/research-voice-rhyme-2026-06-02.md` — citește-l pentru
„de ce", aici e „ce facem". Status: **DRAFT** — o decizie majoră (D31) e deschisă pentru owner._

> **Sursă unică de adevăr (canonic 2026-06-03):** acest fișier a fost reconciliat dintr-un addendum
> scris manual + un addendum scris autonom de workflow-ul `rapscript-voice-rhyme-research`. Diferențele
> au fost îmbinate: fuzzy-snap (D36), descalificarea Whisper pe hardware-ul real (D31-B), fallback Groq
> (D38), plus evaluarea Gemini Live (eliminat) și Chirp 3 (D35). Nu mai există versiuni concurente.

> **Meta-principiu moștenit (deasupra tuturor): „Fail loud, never silent."**
> Pentru acest feature, modul #1 de eșec tăcut NU e crash-ul, nici latența — e **rima greșită afișată
> cu încredere** când ASR-ul aude prost un cuvânt rap spontan (WER RO spontan: 25–62%). Asta e cel mai
> prost mod de eșec pentru un tool de practică. Mitigarea centrală = **fuzzy-snap pe banca închisă
> (D36)**. În plus, microfonul sparge prima oară granița pe care v1 o marcase `N/A` (rețea + hardware):
> orice cădere (HTTPS lipsă, browser nesuportat, permisiune refuzată, rețea slabă) TREBUIE să lase un
> semnal vizibil și să degradeze la tastare, niciodată microfon mort tăcut.

---

## Project Context Analysis

### Ce se adaugă

Două capabilități noi, **deliberat decuplate** (D26):

1. **Motor de rimă** — dat un cuvânt RO, întoarce ≥5 sugestii (perfect → slant → asonanță) în <1ms,
   100% client-side.
2. **Intrare vocală** — microfonul ascultă, transcrie cuvântul rostit, îl **snap-uiește la banca de
   417** (D36), îl afișează „instant" (<1s) și alimentează motorul de rimă.

### Constatare de piață (research 2026-06-02, verificat adversarial)

- **Combinația „mic live → cuvânt pe ecran → rime live" nu există pe piață, în nicio limbă.** Pe română
  slotul e complet gol. Cele două jumătăți există separat (generatoare freestyle: RapScript.net, The
  Rhyme Game; motoare de rimă: Datamuse/RhymeZone — toate EN/ES, niciunul declanșat de mic). Cel mai
  apropiat: RapDrill (ascultă live EN, dar scorează, nu rimează) și LyricJam (academic, generează
  versuri din audio). Precedent arhitectural: app FR „Remède" (index fonetic offline = D27).
- **Corecție de premisă:** NU construim un lexicon de pronunție RO de la zero. Datele brute există
  (RoLEX 330k cu accent, MaRePhoR 72k, espeak-ng). Integrăm piese probate.
- **Riscul real e exclusiv în jumătatea de microfon** (acuratețe ASR + NFR), nu în rimă (banală).

### Requirements Overview (nou)

**Functional (continuă de la FR-10):**
- **FR-11** — Dat un cuvânt (tastat SAU vorbit), afișează ≥5 sugestii de rimă RO.
- **FR-12** — Rimele apar „la fel de repede cum apare cuvântul" — buget lookup <1ms (efectiv instant).
- **FR-13** — Intrare prin tastare — universală, fără hardware, merge peste tot (incl. `file://`).
- **FR-14** — Intrare prin microfon — cuvântul rostit apare în <1s (best-effort, vezi NFR + D31).
- **FR-15** — Selector de limbă (default `ro-RO`); auto-detect NU în v2 (D33).
- **FR-16** — Orice cădere a vocii degradează grațios la tastare (FR-13), cu mesaj vizibil.
- **FR-17 ▲ NEW** — Ieșirea ASR e **snap-uită la cel mai apropiat cuvânt din bancă** înainte de
  afișare/lookup (D36); stare de incertitudine vizibilă când snap-ul e slab.

**Non-Functional (nou + impact pe cele existente):**
- **Latență rimă:** <1ms (hash lookup) — bugetul „aceeași secundă" e rezolvat trivial de rimă; toată
  întârzierea vine din STT (D34).
- **Portability (driver #1, ÎN CONFLICT):** Web Speech / Chirp cer HTTPS → omoară `file://` pentru
  voce. Rima + tastarea rămân pe `file://`. Vezi D31 (deschisă) + D32 (degradare).
- **Privacy (ÎN CONFLICT):** v1 = „local-only, zero network". Calea cloud trimite audio la Google/Groq.
  Whisper local NU — dar e descalificat pe hardware (D31-B). Vezi D39 (push-to-talk + disclosure).
- **Hardware-țintă real:** ASUS X205TA (Atom Z3735F, 2GB RAM, fără SIMD/WebGPU) — constrânge dur
  opțiunile (Whisper-WASM = 2–8s/cuvânt → off the table). Cloud e singura cale sub-1s azi.
- **Calitate rimă RO:** româna cvasi-fonemică → matching pe sufix fonetic; gotcha `â/î`, `ce/ci`,
  `ge/gi`, `che/ghe`, `-i` final palatalizat (D28).
- **Accessibility / Reliability:** moștenite din v1. Microfonul = enhancement opt-in, niciodată cale
  obligatorie.

### Cross-Cutting Concerns (nou)

Granița nouă rețea/hardware (prima oară non-`N/A`) · secure-context (`https:` vs `file:`) · permisiuni
mic (push-to-talk, D39) · acuratețe ASR pe rap spontan (fuzzy-snap, D36) · suport browser neuniform
(Firefox 0, iOS-Chrome 0) · privacy audio (cloud vs local) · decuplarea rimă↔voce.

---

## Core Architectural Decisions (D26+)

### Decision Priority Analysis

- **Critical (blochează implementarea):** D26, D27, D28, D36, D41, D31 (DESCHISĂ).
- **Important (modelează arhitectura):** D29, D30, D32, D33, D34, D37, D38, D39, D40.
- **Conditional (doar pe path C, escaladat prin D40):** D35.
- **Deferred (post-v2):** auto-detect limbă (Whisper), mod offline Whisper-WASM opt-in, cascadă slant completă.

---

### Rhyme Engine (jumătatea ușoară, fără conflict NFR)

- **D26 — Decuplare strictă rimă ↔ voce.** Module independente. Motorul de rimă (D27) NU depinde de
  microfon: e valoros prin tastare (FR-13), merge pe `file://`, pe iPhone, în Firefox. Microfonul e un
  *adapter de intrare* peste el. Izolează tot riscul (HTTPS/privacy/browser/ASR) într-un modul opt-in.
  _(Reframe: „nu construim un feature de voce — construim un motor de rimă cu DOUĂ intrări, una riscantă.")_

- **D27 — Motorul de rimă = index precalculat local, NU API.** Tiparul `words.js` (D2/D3): un
  `gen_rhymes.py` offline derivă `rhymes.js` (`const RHYME_INDEX = {...}`), inclus prin `<script>`
  înainte de `app.js`. Lookup = acces O(1). Motiv: Datamuse/RhymeBrain **n-au RO**; site-urile RO
  (rimeaza.ro) n-au API și dau 403; `fetch` pe `file://` pică pe CORS (D2). Privacy + ~0ms după load.
  Verdict adversarial lookup <50ms: **CONFIRMED**. ~5–15KB raw (~4–6KB gzip) pt 417 cuvinte.

- **D28 ▲ — Cheia de rimă = sufix fonetic de la ultima vocală accentuată, cu accent ADNOTAT.** Pentru
  fiecare cuvânt, cheia = secvența de foneme de la ultima vocală accentuată până la final. **▲ Schimbat
  față de prima propunere** (ultimele N litere — rima e fenomen sonor, nu ortografic). Detalii:
  - **Surse pronunție (build-time, în `gen_rhymes.py`):** RoLEX (330k, +accent +IPA) → ipa-dict/MaRePhoR
    → espeak-ng/phonemizer ca fallback OOV (slang/neologisme).
  - **`stress.json` (din RoLEX) — LIVRAT 2026-06-03:** `gen_rhymes.py --from-rolex` derivă
    `assets/stress.json` = **71 override-uri** (din 417) unde euristica greșea accentul (taină→`a`,
    cafea/verbe oxitone `-a`, doctor, pasăre…). 93 negăsite în RoLEX + 9 sărite → rămân pe euristică
    (penultim/ultim). RoLEX (24MB) **NU se comite** (OQ-V2); doar `stress.json` (mic) e livrat. JS aplică
    override-urile prin `RHYME_STRESS` emis în `rhymes.js` → **paritate 417/417 menținută**. _(Reziduu:
    omografe de accent `copíi`/`cópii` — RoLEX dă prima formă; refinare viitoare.)_
  - **Normalizări în build:** `â/î → ɨ`; `ce/ci → /tʃ/`, `ge/gi → /dʒ/`, `che/ghe → /k,g/`; `-i` final
    palatalizat (`lupi` /lupʲ/) ca marcaj, nu vocală.

- **D37 ▲ NEW — Trei chei per cuvânt (cascadă) + ranking precalculat.** Inversare în buckets pre-sortate
  pe scor la BUILD → runtime e doar walk + slice, <1ms:
  - **PERFECT** (sufix de la accent) · **SLANT** (coade relaxate pe familie fonetică) · **ASONANȚĂ**
    (secvența de vocale a ultimelor 1/2/3 silabe).
  - **Scor** = `0.55·overlap_fonetic + 0.20·potrivire_silabe + 0.15·frecvență(zipf, wordfreq) +
    0.10·bonus_rimă_bogată`.
  - Runtime: walk perfect → dacă <5 adaugă slant → dacă <5 adaugă asonanță → `.slice(0,5)`.
  - **MVP:** livrează **perfect + asonanță**; cascada slant completă = 8.4 (deferred).

- **D29 — Fail-loud pe banca de rime (oglindă la D3).** `gen_rhymes.py`: validează (raportează LOUD
  cuvintele „orfane" fără nicio rimă în bancă), scrie `RHYME_INDEX` + `RHYME_META = {count, hash}`,
  header `// AUTO-GENERAT — NU EDITA`, mod `--check` (hash mismatch → exit non-zero). Refuză să scrie pe
  date stricate. Cuvânt fără rimă → UI arată „n-am găsit rime pentru «x»", NU listă goală tăcută.
  NU modifică `gen_words.py` (frate, nu refactor).

- **D30 ▲ — Intrarea prin tastare: capabilitate de motor, NE-surfacată în UI v2.** Motorul de rimă
  funcționează cu orice `<input>` text (G2P runtime), independent de microfon. **▲ 2026-06-03:** suprafața
  de tastare (drawer) a fost SCOASĂ din UI la cererea owner-ului (D41) → FR-13 ne-surfacat în v2; doar
  capabilitatea rămâne în cod (pt voce / re-adăugare). Rimele ambientale (D41) sunt singura suprafață.

- **D42 ▲ NEW — Backfill RoLEX pt cuvintele sub-deservite (rezolvă OQ-V3).** Cuvintele cu < 5 rime în
  bancă (orfanele incluse — sceptru, haos, scaun…) primesc rime din **tot lexiconul RoLEX** prin
  potrivire de sufix fonetic **grad 4 → grad 3** (câte foneme finale se potrivesc). Cerut de owner
  („pentru cele fără rimă directă, ia grad 3/4"); **rimeaza.ro era sursa inițială dar e blocat
  Cloudflare 403** → RoLEX (local) îl înlocuiește, fără scraping.
  - **Filtre:** nume proprii (msd `Np`), flexiuni (aceeași lemă — RoLEX `=` = lemă-identică-cu-forma),
    cuvinte din bancă.
  - **Rang `wordfreq` (zipf RO):** COMUNELE întâi (pentru/nostru/patru peste sieptru/schiptru-arhaice).
    Corpusul RO e mic → freq=0 NU e prag dur (artificiu/ceaun sunt valide); rarele-valide doar ca umplutură.
  - **Pipeline (ca stress.json):** `gen_rhymes.py --from-rolex` (rulat în venv cu wordfreq) → derivă
    `assets/rhyme_extra.json` (60 cuvinte) + emite `RHYME_EXTRA` în `rhymes.js`. **CI/runtime NU cer
    RoLEX/wordfreq** — citesc fișierul comis. **STARE: LIVRAT.** Rezultat: **zero orfane** (toate au rime).
  - Runtime: `rhymesFor` adaugă `RHYME_EXTRA[w]` ca backfill la 5 în hint-ul ambiental (D41).

---

### Voice Input (jumătatea riscantă)

- **D31 ▲ — [DECIZIE DESCHISĂ — OWNER] Calea de recunoaștere vocală.** Sparge două NFR-uri sacre.
  Patru căi, mutual exclusive ca PRIMAR:

  | Opțiune | file:// | Privacy | Latență primul cuvânt | Backend | Browser | Verdict |
  |---|---|---|---|---|---|---|
  | **A. Web Speech API (cloud, `ro-RO`)** | ❌ HTTPS | ❌ audio→Google | ✅ 200–500ms interim | **zero** | Chrome/Edge; Firefox/iOS-Chrome 0 | **RECOMANDAT primar** |
  | **B. Whisper-WASM local** | ✅ | ✅ 100% local | ❌ **2–8s pe Atom 2GB** | zero (+download 31–75MB) | toate | **DESCALIFICAT** pe hardware-țintă |
  | **C. Chirp 3 prin proxy Hetzner** | ❌ HTTPS | ❌ audio→Google | ✅ ~300–550ms | proxy VPS (~130 LOC) | toate | tier acuratețe-maximă (D35) |
  | **D. Gemini Live API** | ❌ HTTPS | ❌ audio→Google | ❌ **sentence-final**, 500–800ms+ (freeze 5–20s) | token-minter | toate | **ELIMINAT** ca afișaj real-time |

  **Constatări (înlocuiesc presupunerile inițiale):**
  - **A e singura cu ZERO backend + parțiale reale per-cuvânt + sub-1s pe laptopul de 2GB.** `ro-RO`
    confirmat pe backend cloud Chrome/Safari. `continuous=false`, `interimResults=true`.
  - **B descalificat:** 2 verdicte adversariale — Atom Z3735F → 2–8s/cuvânt (sparge bugetul 3–8×) + cere
    COOP/COEP pe care GitHub Pages nu le setează. Rămâne doar ca mod privacy opt-in, deferred.
  - **D eliminat:** Gemini `inputAudioTranscription` întoarce un singur mesaj după sfârșitul vorbirii
    (NU parțiale), cu freeze raportat 5–20s la vorbire continuă. Gândit pt agenți conversaționali, nu
    dictare. _(Eventual util doar ca „corecție" post-frază.)_
  - **C = Chirp 3 (Cloud STT v2)** e tool-ul Google CORECT pt streaming per-cuvânt (`ro-RO` GA,
    `SUPERSHORT`), DAR gRPC-only → proxy obligatoriu pe Hetzner (D35), heavier. Tier de acuratețe-maximă.

  **Recomandarea arhitecturii:** **PRIMAR A (Web Speech), HTTPS-gated, NU cale obligatorie (D32)** →
  `file://` + restul app-ului intacte. **Fallback D38 (Groq via Worker)** pt Firefox/iOS/erori rețea.
  **B amânat** ca opt-in privacy. **C** doar dacă A se dovedește insuficient pe acuratețe/control. **D**
  eliminat. **✅ DECIS (2026-06-03): A (Web Speech `ro-RO`)** — Epic 8 v1 LIVRAT. Whisper (B) respins
  explicit de owner; C = tier premium condiționat (D40). _(Nimic din Epic 7 nu a depins de ea.)_

- **D36 ▲ NEW — [CEA MAI IMPORTANTĂ] Snap ieșirea ASR la cel mai apropiat cuvânt din banca de 417,
  ÎNAINTE de afișare/lookup.** Cel mai mare risc nu e latența — e **acuratețea ASR pe rap spontan**
  (WER RO 25–62%). Un transcript greșit → rime greșite cu încredere, fără semnal de eroare. Pentru că
  **vocabularul e închis (417)**, un fuzzy-match (Levenshtein / sufix comun, insensibil la diacritice)
  pe ieșirea ASR transformă WER-ul open-domain într-un **clasificator pe 417 căi, aproape determinist**.
  - `SpeechGrammarList` e mort în Chrome → snap **post-recunoaștere** în JS.
  - Pe Groq (D38): pasează banca și ca `prompt` (bias).
  - **Stare de incertitudine vizibilă** când scorul de snap e slab (fail-loud).
  - **Gate de calitate:** vocea nu se lansează până un test live pe 20+ cuvinte din bancă, rostite în
    cadență rap, nu atinge o rată de snap acceptabilă (prag de stabilit).

- **D32 — Feature-detect + degradare grațioasă (oglindă la fullscreen v1).** Butonul de mic apare DOAR
  dacă `location.protocol === 'https:'` ȘI (`'webkitSpeechRecognition' in window || 'SpeechRecognition'
  in window`). Pe `file://` → buton ascuns + banner „microfonul cere HTTPS; folosește tastarea sau
  versiunea live". Firefox / iOS-Chrome / permisiune refuzată / cădere rețea → mesaj vizibil + degradare
  la FR-13. NICIODATĂ buton mort tăcut.

- **D33 ▲ — Limbă: fără auto-detect util în path A/C; default `ro-RO` + toggle manual (FR-15).** Web
  Speech are un singur `recognition.lang`. Auto-detect built-in există doar la Whisper (B, descalificat)
  și Gemini (D, eliminat). Chirp (C) acceptă `languageCodes` ca hint, nu detecție robustă pe cuvinte
  izolate. Decizie: default `ro-RO` + `<select>` mic; auto-detect real = Deferred.

- **D34 — Bugetul de latență „aceeași secundă" se cheltuie INTEGRAL pe STT.** Rima e <1ms (D27). Cel mai
  mare buton e **VAD/endpointing** (pragurile default 500–800ms sparg singure bugetul → tunează la
  150–300ms, risc: tai plozive finale). Declanșăm lookup-ul de rimă pe rezultat **interim**
  (`isFinal=false`, ~150–300ms pt cuvânt unic), afișăm rimele provizoriu (estompat), confirmăm pe
  `isFinal` — tiparul de stabilitate Google Live Caption. Total perceput ~400–700ms (cale interim).

- **D35 ▲ — Conditional (doar path C): proxy-ul Chirp stă pe Hetzner, NU pe Cloudflare Worker.**
  Constatare hard: **Workers/Durable Objects NU pot face gRPC** (fără HTTP/2 bidi outbound, issue
  `workerd#6455`). Chirp 3 `StreamingRecognize` e gRPC-only → Worker exclus. Soluția: proxy ~100–130 LOC
  Node (`@google-cloud/speech` `v2.SpeechClient._streamingRecognize`) pe **VPS-ul Hetzner deținut deja**
  (`fasty@95.217.59.112`): browser WSS → proxy → gRPC `eu` → relay parțiale.
  - Auth: service-account GC (`roles/speech.client`), cheia JSON pe VPS, NU în browser.
  - Securitate: origin-lock handshake + rate-limit per-IP + WSS (fail-loud pe origin străin).
  - Latență: Hetzner (DE) → Google `eu` ~5–15ms; total ~300–550ms. VPS în EU, NU US.
  - Cost: $0.016/min, 60 min/lună gratis (~$3.8/lună la 10 min/zi). Limită stream 5 min → restart.
  - **Trade-off:** leagă URL-ul live de uptime-ul VPS-ului — pierzi „static pur pe Pages".

- **D38 ▲ NEW — Fallback STT = Groq Whisper (`whisper-large-v3-turbo`, `language='ro'`) prin Worker-ul
  EXISTENT (REST, gated pe VAD).** Pentru browsere fără `SpeechRecognition` (Firefox 0, iOS-Chrome 0)
  sau la erori `network` repetate. **Cheia REST aici e decisivă:** Groq e REST → **Worker-ul îl POATE
  releua** (spre deosebire de Chirp gRPC din D35). Worker-ul din `worker/` are o singură treabă nouă:
  ține `GROQ_API_KEY` server-side + releuiește clipul Opus. ~400–700ms total. Groq peste Deepgram pt
  fallback: REST simplu (nu WebSocket), iar pt cuvinte de 1–2s nu există avantaj de streaming care să
  justifice complexitatea. VAD: `@ricky0123/vad-web` (Silero, ~2.4MB) tunat — `redemptionFrames` 3–5
  (~290–480ms), `minSpeechFrames` 1–2, pre-gate RMS pt CPU pe 2GB.

- **D39 ▲ NEW — Push-to-talk default + disclosure privacy (GDPR).** NU always-listening: ții butonul →
  `getUserMedia` se deschide pe apăsare, track-ul se oprește la eliberare (stinge indicatorul mic,
  economisește baterie). Cea mai curată postură GDPR pt o app statică. Disclosure inline când mic-ul e
  activ: *„Recunoașterea vocală se face prin serverele Google. Niciun fragment audio nu e stocat de
  RapScript."* Voce pt transcriere (nu identificare vorbitor) = Art. 6 GDPR (consimțământ), nu Art. 9
  biometric. **Adevăr de spus simplu: NU există cale 100% privată pe hardware-ul ăsta** (Whisper local,
  singura fără egress, e descalificat de cei 2GB — D31-B).

- **D41 ▲ NEW — Rimele sunt AMBIENTALE, legate de cuvântul generatorului (NU lookup manual).** Decizie
  de owner (2026-06-03, „așa vreau arhitectura"): pentru FIECARE cuvânt afișat în centru, **top-5 rime
  apar automat SUS, în gri-umbră** (`--color-ink-faint`), actualizate la fiecare schimbare de cuvânt.
  Înlocuiește modelul „deschizi un drawer și tastezi ca să vezi cu ce rimează".
  - **Implementare:** `updateRhymeHint(word)` apelat din `render()` în blocul de schimbare-cuvânt
    (D7-compatibil: rima-hint e acum parte din afișajul generatorului, scrisă tot prin render()).
  - **Rezolvă OQ-V5:** rima **SE SUPRAPUNE** peste generator (cuvânt random apare → rimele lui apar),
    NU îl înlocuiește. Definește și ținta de integrare voce (Epic 8): cuvântul ROSTIT devine cuvântul
    din centru → aceleași rime ambientale îl urmează.
  - **Drawer-ul de tastare a fost SCOS** (owner, 2026-06-03) — UI curat, DOAR rime ambientale. Motorul
    (G2P + `rhymesFor`) rămâne și poate cheia cuvinte arbitrare (refolosit la voce / re-adăugare ulterioară).
  - **Fail-loud:** cuvânt orfan → zona de sus rămâne goală (ambient, fără zgomot), nu mesaj de eroare.

- **D40 ▲ NEW — Chirp 3 = upgrade PREMIUM condiționat, NU punct de plecare.** Decision record explicit
  ca să nu reluăm raționamentul:
  - **Web Speech (A) și Chirp 3 (C) produc ACELAȘI rezultat vizibil** — cuvânt parțial pe ecran cum îl
    spui (ambele `interim_results`/`interimResults`, `ro-RO`, ~400–700ms vs ~300–550ms). Diferența NU e
    „pune cuvântul pe ecran" (amândouă o fac); e **acuratețe + suport browser + control endpointing**.
  - **Costul lui Chirp față de A:** proxy gRPC obligatoriu pe Hetzner (D35, Worker exclus), service-acc,
    cost $0.016/min, și leagă URL-ul live de uptime-ul VPS-ului. Sparge aceleași NFR ca A (HTTPS +
    audio→Google) → **zero câștig pe privacy/portabilitate** pt costul în plus.
  - **Fuzzy-snap (D36) erodează exact avantajul lui Chirp:** fiindcă snap-uim ieșirea la banca închisă
    de 417, o transcriere mai slabă se corectează aproape determinist (`abiss/abys → abis`). Acuratețea
    brută superioară a lui Chirp contează mai puțin când vocabularul-țintă e mic și fix.
  - **Trigger de escaladare A → C (singurul care justifică Chirp+Hetzner):** gate-ul D36 (20+ cuvinte
    rostite în cadență rap) **eșuează pe Web Speech** — rată de snap inacceptabilă pe rap RO rapid —
    SAU e nevoie obligatorie de Firefox/iOS-Chrome, SAU de procesare server-side a transcriptului.
    Până atunci, Chirp rămâne documentat ca tier, **nu construit**. _(Occam: nu plăti pt acuratețe pe
    care snap-ul ți-o dă gratis.)_

---

## NFR Impact (vs. v1)

| NFR v1 | v1 | Rimă (D27-D30,D37) | Voce A (Web Speech) | Voce B (Whisper) | Voce C (Chirp+Hetzner) |
|---|---|---|---|---|---|
| Portability `file://` | ✅ | ✅ | ❌ pt voce | ✅ | ❌ pt voce |
| Privacy zero-network | ✅ | ✅ | ❌ audio→Google | ✅ | ❌ audio→Google |
| Latență „instant" | ✅ | ✅ <1ms | ✅ ~400–700ms | ❌ 2–8s (2GB) | ✅ ~300–550ms |
| Suport browser | universal | universal | Chrome/Edge | toate | toate |

**Citire:** rima (D27-D30,D37) e aditivă pură — zero regresie NFR. Toată tensiunea e localizată în D31.

---

## Open Questions

- **OQ-V1 (BLOCANT pt voce):** D31 — care cale primară? Recomandare: A (Web Speech `ro-RO`) +
  fallback D38 (Groq via Worker); B amânat; C dacă A e insuficient; D eliminat. (owner: „nu știu încă").
- **OQ-V2 ✅ mitigat (2026-06-03):** RoLEX folosit STRICT build-time, local (`/tmp`), **NU comis**. Livrăm
  doar `assets/stress.json` (71 poziții de accent derivate) + `rhymes.js` (chei+liste) — date derivate,
  nu dump-ul RoLEX. Risc licență minim (fapte de pronunție pt 417 cuvinte). De reconfirmat doar la pivot
  comercial. (G2P-ul e reguli proprii în Python/JS, nu espeak/RoLEX.)
- **OQ-V3 ✅ REZOLVAT (2026-06-03, D42):** hibrid — banca proprie prima, backfill din RoLEX (grad 4→3,
  filtrat de frecvență wordfreq) pt cuvintele sub-deservite. Implementat în `rhyme_extra.json`.
- **OQ-V4:** doar rime perfecte sau și slant/asonanță? Recomandare: cascadă 3-tier (D37); MVP
  perfect+asonanță, slant complet în 8.4.
- **OQ-V5 ✅ REZOLVAT (2026-06-03):** rima **SE SUPRAPUNE** peste generator — top-5 rime ambientale apar
  sus pt cuvântul curent (D41). La voce (Epic 8): cuvântul rostit devine cuvântul din centru.

---

## Epics Sketch (continuă de la Epic 6)

- **Epic 7 — Motor de rimă (NEBLOCAT, începe ACUM):** aditiv-pur, zero regresie NFR v1, valoros
  independent prin tastare pe orice browser incl. `file://`.
  - 7.1 `gen_rhymes.py`: RoLEX + `stress.json` → cheie fonetică (D28) → `rhymes.js` + `--check` + fail-loud (D29).
  - 7.2 **LIVRAT**: `rhymes.js` inclus + guard; CI (`check.yml`) **regenerează** rhymes.js la fiecare
    push (oglindă la words.js) → cuvinte adăugate prin UI primesc rime automat.
  - 7.3 UI rimă: rime ambientale sus, gri-umbră, pt cuvântul curent (D41), prin `render()` (D7). Tokeni
    Nocturn, reduced-motion. (Drawer de tastare SCOS la cererea owner-ului — UI curat.) **STARE: LIVRAT +
    DEPLOYAT** (G2P JS oglindă a Python, paritate 417/417 în `?test=1`, 11/11 teste).
  - 7.4 gotcha-uri RO (`â/î`, `ce/ci`, `ge/gi`, `che/ghe`, `-i` final) verificate cu `?test=1`.
  - *Cut din MVP:* mic, VAD, selector limbă, cascadă slant completă (livrezi perfect+asonanță), Whisper.

- **Epic 8 — Intrare vocală (D31=A) — v1 LIVRAT (2026-06-03):**
  - 8.1 ✅ Web Speech (`ro-RO`, `interimResults`/`continuous`, D34) → **fuzzy-snap pe bancă (D36)**
    (Levenshtein insensibil la diacritice, prag ~34% → snap; sub prag → cuvântul brut via G2P) → cuvântul
    rostit devine cuvântul central (D41), rimele ambientale îl urmează.
  - 8.2 ✅ push-to-talk: **ține apăsat `M`** (Fn/Win+H NU se pot capta în browser — taste hardware/OS) +
    buton 🎤 toggle; feature-detect `isSecureContext` + Web Speech (D32) → ascuns pe file:///Firefox/iOS.
  - 8.3 ✅ fail-loud pe permisiune/no-speech/network/nesuportat + disclosure „audio → Google" (D39);
    pornirea mic-ului oprește generatorul auto.
  - 8.4 *(deferred)* `@ricky0123/vad-web` + selector limbă (D33); **fallback Groq via Worker (D38)** pt
    Firefox/iOS; mod privacy Whisper-WASM (D31-B); *(path C)* proxy Hetzner Chirp (D35).
  - ⚠ **De testat de owner pe Chrome live (HTTPS):** permisiune mic + acuratețe ASR RO pe rap rapid
    (gate D36, 20+ cuvinte). Până acum verificat doar logica (snap/flux, prin simulare `onresult`).

**Dependency:** Epic 7 → Epic 8. Epic 7 nu așteaptă nicio decizie.

---

## Sources

### Bază de dovezi
- `docs/research-voice-rhyme-2026-06-02.md` — research complet (52 agenți: 35 cercetare + 14 verificare
  adversarială + 3 sinteză), cu verdicte per-afirmație. **Citește-l pentru „de ce".**

### Rimă
- RoLEX (github.com/adrianastan/rolex, 330k +accent) · MaRePhoR (speech.utcluj.ro, CC BY-NC) ·
  open-dict-data/ipa-dict (RO) · espeak-ng/phonemizer · Ciobanu & Dinu „On the Romanian Rhyme Detection"
  (COLING 2012) · Steve Hanov „A Rhyming Engine" (index sufix-fonetic) · Datamuse/RhymeBrain (fără RO) ·
  wordfreq (zipf, MIT).

### ASR / voce
- MDN Web Speech API / `processLocally` · caniuse speech-recognition · Chrome 139 SODA (en-US only) ·
  RoWhisper-large-v2 (arXiv 2511.03361, 25–62% WER spontan) · Whisper-large-v3 ~10.9% WER RO citit
  (Soniox) · `@ricky0123/vad-web` (Silero) · Groq `whisper-large-v3-turbo` · transformers.js/whisper.cpp
  WASM (descalificat 2GB) · vosk-browser (RO indisponibil).
- Gemini Live API (ai.google.dev, `inputAudioTranscription` sentence-final) · `gemini-3.1-flash-live`
  (blog 26-mar-2026) · forum: freeze 5–20s → **ELIMINAT**.
- Cloud STT v2 / Chirp 3 (`ro-RO` GA, `StreamingRecognize` gRPC-only, `SUPERSHORT`, $0.016/min, 60min/lună
  gratis) · **`cloudflare/workerd#6455`** (gRPC nesuportat în Workers) · `@google-cloud/speech` v2.

### Prior art
- RapScript.net · RapDrill · LyricJam (U. Waterloo 2021) · The Rhyme Game · „Remède" (FR offline).
