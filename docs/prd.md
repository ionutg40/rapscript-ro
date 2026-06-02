---
title: RapScript RO
status: final
created: 2026-05-31
updated: 2026-05-31
---

# PRD: RapScript RO

## 0. Document Purpose

Acest PRD detaliază features-urile, requirements-urile funcționale și constraint-urile pentru **v1 ("inima")** a RapScript RO — o aplicație web care generează cuvinte random în română pentru antrenament de freestyle rap. Construiește pe brief-ul aprobat (`briefs/brief-rapscript-ro-2026-05-31/brief.md`) și pe groundwork-ul verificat adversarial (`/home/fasty/rapscript-ro/docs/groundwork.md`, în special §5). Audience: fasty (builder + user #1). Downstream: design-ul **Nocturn** (Premium Clean dark + accent purple — vezi `docs/DESIGN.md` + `docs/EXPERIENCE.md`; direcția Brutalist din groundwork e superseded la pivotul din 2026-05-31) și `bmad-create-architecture` (stack vanilla + format date).

Miză: proiect de **build/învățare**, solo. PRD scurt, pe măsură.

## 1. Vision

Un cuvânt mare pe ecran, care se schimbă la un interval ales — atât. Tu îl țeși în freestyle. RapScript RO face un lucru și-l face curat, peste un word bank românesc real (golul pe care originalul rapscript.net nu-l acoperă pe web). Scopul nu e să cucerească o piață, ci ca fasty să ducă o aplicație web cap-coadă, live pe un URL public, și să aibă o unealtă pe care chiar o folosește.

## 2. Target User

**fasty — builder + user #1.** Intern, învață web dev construind. NU e freestyler (poate învață pe propria unealtă), nu are un public de servit. Succes = livrat cap-coadă + învățat. Nu există persona secundară în v1; oricine altcineva e beneficiar oportunist, nu țintă.

## 3. Features

### 3.1 Generatorul (inima)

#### FR-1: Afișare cuvânt random
Aplicația afișează un singur cuvânt din word bank-ul nivelului curent, dominant pe ecran.
**Consequences (testabile):**
- Cuvântul afișat aparține nivelului selectat.
- Diacriticele RO (ă â î ș ț) se randează corect (comma-below, nu sedilă).

#### FR-2: Schimbare automată la interval reglabil
Cuvântul se schimbă singur la intervalul curent, fără click per cuvânt.
**Consequences (testabile):**
- La pornire, un cuvânt nou apare la fiecare T secunde (T = valoarea slider-ului).
- Schimbarea intervalului se aplică imediat, fără reload.

#### FR-3: Fără repetare imediată
Același cuvânt nu apare de două ori la rând.
**Consequences (testabile):**
- Cuvântul nou diferă mereu de cel precedent (când nivelul are ≥2 cuvinte).

### 3.2 Controale

#### FR-4: Play / Pause
Utilizatorul pornește și oprește generarea.
**Consequences (testabile):**
- Pause oprește schimbarea; cuvântul curent rămâne pe ecran.
- Play reia de la intervalul curent.

#### FR-5: Reglaj viteză
Slider pentru intervalul dintre cuvinte, ~2–12 secunde.
**Consequences (testabile):**
- Valoarea curentă în secunde e vizibilă lângă slider.
- Modificarea repornește numărătoarea cu noua valoare.

#### FR-6: Selector dificultate
Trei niveluri: începător / avansat / profesionist. Schimbă din ce listă trage generatorul.
**Consequences (testabile):**
- Selectarea unui nivel face următoarele cuvinte să provină din acel nivel.
- Nivelul activ e vizibil.

#### FR-7: Persistență preferințe
Ultima viteză + nivel aleasă se rețin între sesiuni (localStorage). În scope v1.
**Consequences (testabile):**
- După refresh, slider-ul și nivelul revin la ultima alegere.
- Absența localStorage nu blochează aplicația (degradare la valori default).

### 3.3 Mod prezentare

#### FR-8: Fullscreen (enhancement, cu degradare)
Buton care duce cuvântul pe tot ecranul (proiector / monitor).
**Consequences (testabile):**
- Pe browsere care suportă Fullscreen API, butonul intră/iese din fullscreen.
- Pe iPhone (unde Fullscreen API e no-op pentru elemente arbitrare), butonul fie e ascuns prin feature-detect, fie degradează la pseudo-fullscreen CSS — NU pare bug (apăs și nu se întâmplă nimic = interzis).

#### FR-9: Responsive
Funcționează pe telefon, desktop și ecran mare.
**Consequences (testabile):**
- Cuvântul se scalează cu ecranul (umple frumos, nu se taie).
- Cuvintele lungi (ex. „DEZAMĂGIRE") nu sparg layout-ul.
- Controalele rămân ușor de atins pe telefon.

### 3.4 Conținut

#### FR-10: Word bank RO ca fundație
3 liste de cuvinte românești (începător / avansat / profesionist), seed verificat de 417 cuvinte (136 / 154 / 127).
**Consequences (testabile):**
- Fiecare nivel are cuvinte (niciun nivel gol).
- Banca e ușor de extins fără a atinge logica (date separate de cod).

## 4. Cross-Cutting NFRs

- **Performance.** Cuvântul nou apare instant la schimbare; intervalul respectă valoarea aleasă (precizie de secundă, nu frame-perfect).
- **Accesibilitate.** Contrast WCAG: text citibil pe perechi care trec AA (ink pe bg Nocturn = 17.9:1, verificat). Accentul purple `#8B7BFF` (5.96:1) și griurile dim DOAR pe text mare-bold sau forme, niciodată pe text mic. Vezi `docs/DESIGN.md` › Colors + `docs/validation-report.md`.
- **Reliability.** Refuzul fullscreen (ex. iOS) nu crapă aplicația. Un nivel ales rămâne stabil până la schimbare.
- **Maintainability.** Datele (word bank) separate de logică; `words.js` derivat determinist din `assets/wordbank.json`, nu copie tastată manual.
- **Privacy.** Local-only. Zero network în afară de fonturile web. Fără cont, fără cloud, fără tracking.
- **Portability.** Merge la dublu-click pe `index.html` (fără server) ȘI live pe GitHub Pages (căi relative).

## 5. Success Metrics

### Primary
- **SM-1: Livrare cap-coadă.** Aplicație live pe URL public, cu inima completă (FR-1…FR-9 funcționale). Măsurare: demo live. Target: PASS.

### Secondary
- **SM-2: Învățare documentată.** `gotchas.md` cu lecțiile din primul build web. Target: ≥8 lecții.
- **SM-3 (soft): Folosibilitate dovedită.** fasty folosește aplicația câteva minute ca să facă freestyle real. Target: o sesiune.

### Counter-metrics (nu optimiza)
- **SM-C1:** numărul brut de cuvinte în bank dacă sunt slabe.
- **SM-C2:** feature-uri adăugate care întârzie livrarea inimii.

## 6. Scope

**IN (v1 — „inima"):** FR-1…FR-10 de mai sus. Web app responsive, deployat live.

**OUT (faze viitoare):** beat player de fundal; recording (înregistrare freestyle); mod sincron worldwide (cyphere Discord/Twitch); apps native iOS/Android; comunitate (comentarii, news); cont / cloud / multi-user; dashboard de navigare a word bank-ului.

## 7. Constraints & Guardrails

- **Fullscreen pe iPhone** = no-op pentru elemente arbitrare → tratat ca enhancement (feature-detect + degradare CSS / „Add to Home Screen"). NU feature de bază garantat pe mobil.
- **Word bank ca diferențiator** — calitatea conținutului RO e produsul; seed-ul de 417 e fundație, nu plafon. Sursa de extindere viitoare (manual / AI+curat / scraping) = decizie ulterioară.
- **Stack & format date** — vanilla HTML/CSS/JS + GitHub Pages e recomandarea de groundwork; se confirmă oficial în `bmad-create-architecture`. `words.js` derivat din `wordbank.json` (fetch pe `file://` pică CORS).
- **Design** — **Nocturn** (Premium Clean dark + accent purple chirurgical; serif editorial pentru cuvânt, mono pentru UI). Formalizat în `docs/DESIGN.md` + `docs/EXPERIENCE.md`. Direcția veche Underground Brutalist „Subsol" e superseded (pivot user 2026-05-31).

## 8. Open Questions

1. **Re-leveling fin** — ~10 cuvinte borderline de mutat între niveluri (deferat la editare conținut; nu blochează build-ul).
2. **Extinderea word bank-ului** — cum crește banca peste seed-ul de 417, și cine validează calitatea? (post-v1)

## 9. Assumptions Index

- `[ASUMPȚIE]` Single-word (un cuvânt o dată); multi-word / fraze = out v1.
- `[ASUMPȚIE]` Interval 2–12s (din modelul rapscript.net); exact reglabil la implementare.
- `[ASUMPȚIE]` fasty rămâne singurul user în v1; fără nevoi multi-user.
