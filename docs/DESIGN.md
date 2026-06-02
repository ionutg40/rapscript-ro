---
name: Nocturn
description: Premium-clean dark identity for RapScript RO — editorial serif word over a near-black stage, one surgical purple accent, real depth (no glass, no neon).
status: draft
created: 2026-06-02
updated: 2026-06-02
colors:
  bg: '#0B0B0F'
  surface: '#15151C'
  surface-2: '#1F1F28'
  border: '#26262F'
  ink: '#F4F4F7'
  ink-dim: '#9A9AA6'
  ink-faint: '#5A5A66'
  accent: '#8B7BFF'
  accent-dim: '#6E5CF0'
  danger: '#F0717A'
typography:
  hero:
    fontFamily: Fraunces
    fontSize: clamp(4rem, 18vw, 13rem)
    fontWeight: '600'
    lineHeight: '0.95'
    letterSpacing: -0.01em
  label:
    fontFamily: IBM Plex Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.12em
  value:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
  button:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.08em
  message:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 6px
  md: 10px
  lg: 14px
  full: 9999px
  DEFAULT: 10px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '6': 24px
  '8': 32px
  '12': 48px
  '16': 64px
  gutter: 24px
  margin-mobile: 16px
components:
  hero-word:
    color: '{colors.ink}'
    font: '{typography.hero}'
    text-align: center
    rotation: '0deg'
  timer-bar:
    track: '{colors.surface-2}'
    fill: '{colors.accent}'
    height: 3px
    radius: '{rounded.full}'
  button-primary:
    bg: '{colors.surface}'
    border: 1px solid '{colors.border}'
    color: '{colors.ink}'
    radius: '{rounded.md}'
    accent-glyph: '{colors.accent}'
  level-segment-active:
    bg: '{colors.surface-2}'
    color: '{colors.ink}'
    underline: '{colors.accent}'
  level-segment-idle:
    bg: transparent
    color: '{colors.ink-dim}'
  speed-slider:
    track: '{colors.surface-2}'
    fill: '{colors.accent}'
    thumb: '{colors.ink}'
    thumb-radius: '{rounded.full}'
  focus-ring:
    color: '{colors.accent}'
    width: 2px
    offset: 2px
---

# Nocturn — RapScript RO

> ⚠️ **status: draft.** Această identitate înlocuiește direcția veche *Underground Brutalist*
> (hârtie + portocaliu + Archivo Black), abandonată la pivotul user din 2026-05-31
> (`groundwork.md` §2). PRD-ul încă citează „Brutalist" pe alocuri — stale; Nocturn e adevărul.
> `EXPERIENCE.md` referă tokenii de aici prin `{path.to.token}`. Pe conflict cu orice mock, spina câștigă.

## Brand & Style

Un singur cuvânt, uriaș, scris cu un serif editorial high-contrast (thin-thick, ca o copertă de
revistă literară) plutind pe un fundal aproape-negru. Atât. RapScript RO nu e un „SaaS de freestyle";
e o **scenă întunecată cu un reflector pe un cuvânt**. Restul (nivel, timer, controale) e mobilier
tehnic discret — mono, mic, periferic — ca să nu fure atenția de la vers.

Postura: **premium-clean, dark, încrezător.** Gradul Linear/Vercel — adâncime reală prin straturi
tonale și umbre subtile, NU prin sticlă blurată. Tensiunea care face identitatea: **serif editorial
(cuvântul) vs. monospace tehnic (UI-ul).** Un singur accent, purple, folosit chirurgical — niciodată
decorativ.

## Colors

Paleta e o singură familie de neutre reci foarte întunecate + un accent.

- **`bg` `#0B0B0F`** — scena. Aproape negru, cu o nuanță rece imperceptibilă (nu negru pur, care ar
  fi dur și ieftin). Tot ce e pe ecran stă pe el.
- **`surface` `#15151C` / `surface-2` `#1F1F28`** — adâncime prin straturi, nu prin umbre dramatice.
  Controalele (butoane, segmente) urcă cu un ton; hover/activ mai urcă unul. Asta E elevația aici.
- **`border` `#26262F`** — hairline-uri de 1px care separă fără să strige. Niciodată mai deschis.
- **`ink` `#F4F4F7`** — alb cald-rece, NU `#FFFFFF` (albul pur pe negru vibrează). Cuvântul-erou și
  textul primar. Contrast pe `bg` ≈ 18:1 (AAA).
- **`ink-dim` `#9A9AA6`** — voce secundară: label-ul de nivel, valoarea timer-ului în repaus,
  hint-uri. ≈ 7.3:1 pe `bg` (AA+).
- **`ink-faint` `#5A5A66`** — disabled, placeholder (`–` la loading), elemente inactive.
- **`accent` `#8B7BFF`** — **singurul accent.** Purple, premium. Apare DOAR pe: umplerea bării de
  timer, segmentul de nivel activ (underline), inelul de focus, triunghiul ▶ din butonul Play,
  fill-ul slider-ului. Regulă de contrast: accentul e permis doar pe **forme și pe text mare-bold**,
  niciodată pe text mic (≈5.4:1 — sigur pe shapes/large, riscant pe corp mic).
- **`accent-dim` `#6E5CF0`** — starea pressed/active a accentului.
- **`danger` `#F0717A`** — exclusiv pentru mesajul de eroare RO. Nu e parte din identitate, e un semnal.

**Nu există** a doua culoare de brand, gradient, sau „accent secundar". Disciplina e produsul.

## Typography

Două familii, roluri opuse, zero ambiguitate.

- **`hero` — Fraunces**, serif variabil high-contrast. Cuvântul central: `clamp(4rem, 18vw, 13rem)`,
  weight 600, `line-height: 0.95`, tracking ușor negativ. Optical size mare (opsz≈144) ca să iasă
  contrastul thin-thick. Pe cuvinte RO lungi (`DEZAMĂGIRE`) line-height sub-1 ține masa compactă.
  *Alternativă numită (swappable): Playfair Display.*
- **UI — IBM Plex Mono** pentru tot restul: `label` (nivel, uppercase + tracking 0.12em), `value`
  (timer/secunde), `button`, `message`. Monospace-ul dă registrul „tehnic/script" care contrastează
  cu serif-ul și leagă subtil de *Rap-SCRIPT*. *Schimbat din Space Mono (draft pas-5) fiindcă Plex
  Mono acoperă sigur `ă â î ș ț`.*

**[NOTE FOR ARCHITECTURE]** Verifică la build cu fonttools că Fraunces + IBM Plex Mono randează
comma-below pe `ș ț` (nu sedilă) și au `ă î â` — pune `lang="ro"` pe `<html>`. Același protocol ca la
Archivo Black în groundwork §5.

## Layout & Spacing

Scală pe bază 8px (`spacing`). Trei zone verticale: **bară-sus** (nivel + fullscreen), **scenă-centru**
(cuvânt + bară timer), **punte-jos** (play / slider / selector nivel). Marginile ecranului: `gutter`
24px desktop, `margin-mobile` 16px. Scena domină — cuvântul ocupă optical center ~42% pe verticală
(ușor peste mijloc, ca să nu pară „căzut"), nu 50%.

## Elevation & Depth

**Umbre reale, discrete — niciodată glow.** Adâncimea vine întâi din straturile tonale
(`bg`→`surface`→`surface-2`). Umbre doar pe controalele ridicate: `0 4px 16px rgba(0,0,0,.45)`.
Touch premium opțional: highlight intern de 1px sus pe butoane `inset 0 1px 0 rgba(255,255,255,.04)`.
Accentul purple NU primește niciodată halo/glow (ar fi neon — interzis).

## Shapes

Colțuri subtile, nu pill, nu ascuțite: butoane și segmente `rounded.md` (10px), containere `lg` (14px).
`full` doar pe thumb-ul slider-ului și pe capetele bării de timer. Coerent cu „premium-clean": rotund
suficient cât să nu fie brutal, drept suficient cât să nu fie jucărie.

## Components

- **hero-word** — `{colors.ink}`, `{typography.hero}`, centrat, rotație 0° (premium = drept; rotația
  era din brutalist). Tranziția la cuvânt nou: vezi `EXPERIENCE.md` › Interaction Primitives.
- **timer-bar** — linie de 3px lățime plină, track `{colors.surface-2}`, fill `{colors.accent}`,
  capete `{rounded.full}`. Se golește/umple pe durata intervalului; e singurul „ceas" vizibil.
- **button-primary** (Play/Pause, Fullscreen) — `{colors.surface}`, border 1px `{colors.border}`,
  text `{colors.ink}` mono. Glifa ▶/❚❚ în `{colors.accent}`. Hover → `{colors.surface-2}`.
- **level-segment** — selector în 3 (începător/avansat/profesionist). Activ: `surface-2` +
  underline `{colors.accent}` + text `ink`. Idle: transparent + text `ink-dim`.
- **speed-slider** — track `surface-2`, fill stânga `accent`, thumb `ink` cerc `full`. Valoarea în
  secunde lângă slider, `{typography.value}` `ink-dim`.
- **message** — text mono `{typography.message}`; `ink-dim` pentru loading/hint, `danger` pentru eroare.

## Do's and Don'ts

**Do** — un singur cuvânt domină; accentul purple apare zgârcit și doar pe forme/text mare; adâncime
prin straturi tonale + umbre subtile; serif pentru vers, mono pentru mașină; `lang="ro"` + diacritice
verificate.

**Don't** — ZERO gradient (mai ales mov→albastru); ZERO glassmorphism / blur-ca-estetică; ZERO neon
glow pe accent; ZERO emoji; ZERO a doua culoare de accent; nu folosi accentul pe text mic; nu pune
alb pur `#FFFFFF`; fără rotații/shake/overshoot (alea erau brutalist, moarte la pivot).
