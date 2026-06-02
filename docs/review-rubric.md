# Spine Pair Review — RapScript RO

## Overall verdict (2-3 sentences)

The Nocturn spine pair is **adequate, trending strong** — a tight, single-screen contract with fully-resolving tokens, a vivid named protagonist flow, and clean DESIGN/EXPERIENCE separation. Two real gaps block a clean "strong": **FR-3 (no immediate word repeat) has zero behavioral coverage** despite EXPERIENCE claiming "Acoperă FR-1…FR-10," and **component names diverge across the two files** (`button-primary` vs `button play/pause`, `level-segment` vs frontmatter's `-active`/`-idle` split, an orphan `message`, an EXPERIENCE-only `fullscreen-button`), which forces a downstream consumer to guess the join. Everything else — token resolution, state walk, contrast on load-bearing combos — is committed and source-extractable.

## 1. Flow coverage — adequate

### Findings
- **[critical]** FR-3 (fără repetare imediată) is never covered behaviorally. It appears in no Key Flow, no Component Pattern, and no Interaction Primitive (`EXPERIENCE.md` — grep for "repet/diferă/precedent" returns nothing; `hero-word` pattern line 66-67 only says "afișează un cuvânt din nivelul activ … se schimbă singur"). The climax flow shows a sequence (`umbră`→`presimțire`→`viitor`→`cenușă`, lines 137-141) but never commits the rule that the next word must differ from the current. EXPERIENCE's header (line 18) overclaims "Acoperă FR-1…FR-10." A story-dev consumer will not know this is a requirement from the spine. *Fix:* add a behavioral line to `hero-word` in Component Patterns — "următorul cuvânt diferă mereu de cel curent când nivelul are ≥2 cuvinte (FR-3)" — and cite FR-3.
- **[minor]** FR-2's testable consequence "schimbarea intervalului se aplică imediat, fără reload" is covered for the slider (line 74) and via timer-bar reset (line 70), but the auto-change cadence itself (FR-2 "un cuvânt nou la fiecare T") is only shown in the flow, never stated as a flat behavioral rule. *Fix:* one line in `timer-bar` or `playing` state cementing "la fiecare T s, cuvânt nou."
- **[strong/no-miss]** The heart flow is exemplary: named protagonist (fasty, 23:40), 6 numbered steps, explicit **Climax** (`DEZAMĂGIRE` not breaking layout), and a secondary projector flow with its own failure path (iPhone Fullscreen button absent, not dead). Failure paths for loading/error live in State Patterns. FR-1/4/5/6/7/8/9/10 all trace to a surface or pattern (surface-closure paragraph, lines 38-40).

## 2. Token completeness — strong

### Findings
- **[minor]** `danger` (`#F0717A`) has no stated contrast ratio on `bg`, unlike `ink` (≈18:1), `ink-dim` (≈7.3:1), and `accent` (≈5.4:1). The error message is load-bearing user-read text, so its contrast should be committed. Computed actual: **6.87:1 on `bg`** (passes AA normal text). *Fix:* add "≈6.9:1 pe `bg` (AA)" to the `danger` bullet (DESIGN line 137).
- **[info]** `ink-faint` (`#5A5A66`) is 2.89:1 on `bg` — fails AA, but it is explicitly the disabled/placeholder/`–`-loading color (WCAG exempts disabled + non-text), so this is correct, not a defect. Worth a one-word "(disabled — AA-exempt)" note to preempt a downstream auditor flagging it.
- **[strong/no-miss]** Every YAML frontmatter token resolves and every `{path.to.token}` reference in both files resolves to a real frontmatter key (verified by extraction: 8×`{colors.accent}`, `{typography.hero}`, `{rounded.full}` etc. in DESIGN; `{colors.ink-dim}`, `{colors.ink-faint}` in EXPERIENCE — all present). All 11 color tokens carry hex. No dangling references.

## 3. Component coverage — thin

### Findings
- **[major]** Name divergence: button is **`button-primary`** in DESIGN frontmatter + DESIGN Components prose (line 184), but **`button play/pause`** in EXPERIENCE Component Patterns (line 71). A consumer cannot mechanically join the visual row to the behavioral row. *Fix:* pick one canonical name (`button-primary`) and use it verbatim in both files; EXPERIENCE can subtitle "(Play/Pause)".
- **[major]** `level-segment` is one component in DESIGN Components prose (line 186) and EXPERIENCE (line 75), but the **frontmatter splits it into `level-segment-active` + `level-segment-idle`** with no row named plain `level-segment`. The visual-spec join is ambiguous: is `level-segment` a third token, or shorthand for the pair? *Fix:* either name the prose rows `level-segment-active`/`-idle` to match frontmatter, or add a frontmatter note that `level-segment` = {active, idle} states.
- **[major]** `message` has a DESIGN Components prose row (line 190) and a `typography.message` token, but **no `components.message` frontmatter entry** and **no EXPERIENCE Component Patterns row** (its behavior is split across Voice/State). The rubric requires a component used anywhere to have a row in BOTH visual and behavioral sections. *Fix:* either add a `message` row to EXPERIENCE Component Patterns (or explicitly demote it to "voice/state only, not a component") and add the frontmatter entry, or accept it as state-only and stop styling it like a component.
- **[major]** `fullscreen-button` has an EXPERIENCE Component Patterns row (line 78) but **no DESIGN visual row** — DESIGN folds Fullscreen into `button-primary` (line 184: "Play/Pause, Fullscreen"). Coverage exists but the name has no visual home. *Fix:* name it explicitly under `button-primary` in DESIGN ("variantă Fullscreen, icon-only") or give it its own row.
- **[minor]** `focus-ring` exists as a frontmatter component (color/width/offset) and its values are echoed in EXPERIENCE ("inel `accent` 2px, offset 2px", line 96) — values match — but it has **no DESIGN Components prose row**. Acceptable as a frontmatter-only token, but inconsistent with the others that all get prose. *Fix:* one prose line, or note it's intentionally token-only.

## 4. State coverage — strong

### Findings
- **[strong/no-miss]** Scene states are mutually-exclusive and complete: `loading` / `ready-paused` / `playing` / `error` / `fullscreen-active` (ortho layer) — State Patterns lines 84-93. Each names its scene treatment, control-disabled behavior, and recovery (Esc/button for fullscreen, "reîncarcă pagina" for error).
- **[strong]** Per-control states all present: disabled / hover / active-pressed / focus-visible (line 95-96), each mapped to a token. IA surface walk: bară-sus (level indicator + fullscreen), scenă (hero-word + timer-bar), punte (play / slider / segments) — every surface's states accounted for.
- **[minor]** `level-segment` disabled state: State Patterns says controls are disabled in loading/error globally, but the level selector during `playing` (mid-session level switch) is well-specified (line 76 — current word holds, next word from new level) while the *idle non-selected* segments' hover/active during loading isn't called out per-control. Negligible — covered by the global "disabled in loading/error" rule. *Fix:* none required; noting for completeness.

## 5. Visual reference coverage — adequate (spine-only, justified)

### Findings
- **[info]** No mockups, wireframes, or imports exist (`docs/` has only the spec docs; `find` for mock/wireframe returns nothing). Both files reference "mock" only abstractly ("Pe conflict cu orice mock, spinele câștigă") — no broken file paths, unlike the example's `→ Composition reference: mockups/today-cold.html`.
- **[minor]** This is a spine-only surface set. For most surfaces that's fine because the visual identity is fully token-committed (clamp sizing, optical-center 42%, layer tones). The one surface that would benefit from a visual ref is the **punte-jos layout on mobile** (play | slider | nivel on one compact row) — token spec alone leaves the horizontal arrangement/wrap behavior to consumer judgment. *Fix:* optional — a single wireframe of the mobile punte, or one extra sentence on slider/segment width allocation at narrow widths.

## 6. Bloat & overspecification — strong

### Findings
- **[strong/no-miss]** No pixel specs where tokens cover it; raw px appears only where it's the actual decision (timer-bar `height: 3px`, focus-ring `width: 2px`, shadow `0 4px 16px rgba(0,0,0,.45)`) — none of which has a token, so these are correct. Voice/Tone and State use tables where prose would bloat (canonical RO strings table, lines 49-57). Prose carries rationale, not restatement.
- **[minor]** The "moarte la pivot / brutalist reziduu" callouts repeat across DESIGN (lines 169, 200) and EXPERIENCE (lines 107, 165) — the dead-direction warning is stated ~4×. Defensible as anti-regression guardrail given the recent pivot, but it's the one spot approaching redundancy. *Fix:* none needed; if trimming, keep it in Do's/Don'ts + Anti-patterns only.

## 7. Inheritance discipline — adequate

### Findings
- **[major]** Component names are NOT verbatim-identical across sections/files (see §3): `button-primary`≠`button play/pause`, `level-segment`≠`level-segment-active/-idle`. This is the inheritance-discipline failure that makes the join non-mechanical. *Fix:* as §3.
- **[minor]** EXPERIENCE sources frontmatter (`docs/prd.md`, `docs/groundwork.md`, `docs/DESIGN.md`) all resolve (verified present). But requirement *naming* is by FR-number only; that's fine and resolves. The semantic drift: EXPERIENCE line 113 cites the accent-on-large-text rule as "moștenită din groundwork §5" — groundwork §5 states that rule for **orange `#FF3B00`**, while Nocturn's accent is **purple `#8B7BFF`**. The *rule* transfers correctly; the *source color* it was derived from is stale. Harmless to a consumer reading the spine (DESIGN restates it for purple at line 134-135), but the citation points at a superseded value. *Fix:* re-cite to DESIGN.md › Colors instead of groundwork §5, or note "rule survives the pivot, color changed."
- **[minor]** PRD is stale on design (DESIGN line 102-104 and PRD lines 12, 97, 127 still say "Underground Brutalist / portocaliu / Archivo Black"). DESIGN correctly declares itself the truth and "spina câștigă," which is the right discipline — but a naive consumer who reads PRD §NFR-Accessibility ("Accentul portocaliu") without the DESIGN override could inherit the wrong color. *Fix:* not a spine defect; recommend a one-line stale-banner at PRD top pointing to Nocturn, since PRD is a named `source`.
- **[strong]** All EXPERIENCE `{token}` refs resolve into DESIGN frontmatter (§2). DESIGN→EXPERIENCE handoff prose ("Spec vizual e în DESIGN.md › Components; aici e doar comportamentul") is clean and consistent both directions.

## 8. Shape fit — strong

### Findings
- **[strong/no-miss]** DESIGN.md follows the canonical section order exactly: Brand & Style → Colors → Typography → Layout & Spacing → Elevation & Depth → Shapes → Components → Do's and Don'ts. Frontmatter has all required keys (name, description, colors, typography, rounded, spacing, components) plus status/created/updated.
- **[strong]** EXPERIENCE.md has every default section from the reference example (Foundation, IA, Voice and Tone, Component Patterns, State Patterns, Interaction Primitives, Accessibility Floor, Inspiration & Anti-patterns, Key Flows) **plus** Responsive & Platform — correctly present here because this is multi-surface (phone/desktop/projector), whereas the single-surface example explicitly omits it.
- **[minor]** Section ordering differs from the example: EXPERIENCE places Key Flows *before* Responsive & Platform and Inspiration & Anti-patterns, while the example ends with Key Flows after Inspiration. EXPERIENCE.md section order is not strictly order-locked (only DESIGN.md is), so this is stylistic, not a defect. *Fix:* none required.

## Mechanical notes (name inconsistencies, broken cross-refs, frontmatter completeness)

**Name inconsistencies (the load-bearing ones for the consumer join):**
- `button-primary` (DESIGN fm + prose) vs `button play/pause` (EXPERIENCE) — pick one.
- `level-segment` (DESIGN prose + EXPERIENCE) vs `level-segment-active` / `level-segment-idle` (DESIGN frontmatter) — reconcile the split.
- `message` — DESIGN prose row + `typography.message` token, but no `components.message` frontmatter row and no EXPERIENCE Component Patterns row.
- `fullscreen-button` — EXPERIENCE row only; DESIGN covers it inside `button-primary` without the name.
- `focus-ring` — frontmatter component only; no DESIGN prose row (values do match EXPERIENCE's "inel accent 2px offset 2px").

**Cross-refs:** All `{path.to.token}` references in both files resolve (extraction-verified). No broken internal pointers. EXPERIENCE `sources:` all exist on disk. No mockup/wireframe file references exist to break (spine-only). The "groundwork §5" citation for the accent-contrast rule resolves but points at the pre-pivot orange color.

**Frontmatter completeness:** DESIGN — complete (name, description, status, created, updated, colors[11], typography[6 roles], rounded[5], spacing[12], components[7]). EXPERIENCE — complete (name, description, status, created, updated, sources[3]). All 11 colors have hex. Contrast targets stated for ink/ink-dim/accent; **missing for `danger`** (computed 6.87:1, AA-pass) and `ink-faint` (2.89:1, disabled-exempt).

**FR trace table (EXPERIENCE):** FR-1 ✓, FR-2 ✓(weak — cadence only in flow), **FR-3 ✗ (uncovered)**, FR-4 ✓, FR-5 ✓, FR-6 ✓, FR-7 ✓, FR-8 ✓(thorough), FR-9 ✓, FR-10 ✓.
