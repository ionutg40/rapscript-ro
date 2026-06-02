# Accessibility Review — RapScript RO

> Reviewer pass over the Nocturn UX spine pair (`DESIGN.md` + `EXPERIENCE.md`) against `prd.md` NFRs and `groundwork.md` §5. Contrast ratios below are computed from the hex tokens with the WCAG 2.x relative-luminance formula (sRGB), not estimated.

## Overall verdict

The spine is in good a11y shape for a single-screen tool: the three load-bearing text pairs (ink, ink-dim, accent) all clear AA, and most of the spine's own contrast claims are honest-to-conservative (accent is actually 5.96:1, better than the "~5.4:1" claimed). Two concrete gaps need an implementer decision before build: (1) `ink-faint` at **2.89:1 on bg fails AA** yet is spec'd for the loading placeholder and disabled-state text that users must read, and (2) the **`aria-live="off"` hero decision silently excludes screen-reader users from the app's entire output** with no opt-in path. Everything else is small (slider label/announcement, focus-ring contrast on raised surfaces, reduced-motion coverage of the timer bar).

## Contrast (computed ratios)

WCAG thresholds: normal text needs **4.5:1**, large/bold text (≥24px, or ≥18.66px bold) needs **3:1**, non-text UI (focus ring, control borders, slider track) needs **3:1**.

| Pair | Computed | AA normal (4.5) | AA large/UI (3.0) | Spine claim | Verdict |
|---|---|---|---|---|---|
| ink `#F4F4F7` / bg `#0B0B0F` | **17.90:1** | PASS | PASS | ≈18:1 | Confirmed (AAA) |
| ink-dim `#9A9AA6` / bg | **7.06:1** | PASS | PASS | ≈7.3:1 | Confirmed (claim slightly high; still AA+) |
| accent `#8B7BFF` / bg | **5.96:1** | PASS | PASS | ≈5.4:1 | Refuted-favorably (better than claimed) |
| danger `#F0717A` / bg | **6.87:1** | PASS | PASS | — | PASS |
| ink-faint `#5A5A66` / bg | **2.89:1** | **FAIL** | **FAIL** | — | Fails AA for text |
| accent-dim `#6E5CF0` / bg | **4.16:1** | FAIL | PASS | — | OK for shapes, not for text |
| ink / surface `#15151C` | 16.55:1 | PASS | PASS | — | PASS |
| ink-dim / surface-2 `#1F1F28` | 5.87:1 | PASS | PASS | — | PASS (slider value sits here-ish) |
| accent / surface | 5.52:1 | PASS | PASS | — | PASS |
| accent / surface-2 | 4.96:1 | PASS | PASS | — | PASS |
| ink-faint / surface | 2.67:1 | FAIL | FAIL | — | Fails (disabled text) |
| ink-faint / surface-2 | 2.40:1 | FAIL | FAIL | — | Fails (disabled text) |
| border `#26262F` / bg | 1.31:1 | FAIL | FAIL | — | Below 3:1 UI floor |
| border / surface | 1.21:1 | FAIL | FAIL | — | Below 3:1 UI floor |

Note on the focus ring (accent on its adjacent surfaces): **5.96:1 on bg, 5.52:1 on surface, 4.96:1 on surface-2** — all clear the 3:1 non-text floor comfortably. The ring itself is fine; the offset gap is what makes or breaks it (see findings).

## Findings

### Contrast

- **[high]** `ink-faint #5A5A66` is **2.89:1 on bg** (and 2.67:1 / 2.40:1 on the two surface tones) — fails AA for text on every surface it touches (`DESIGN.md` Colors; `EXPERIENCE.md` State Patterns "loading"). It is spec'd for the loading placeholder `–`, the `se încarcă cuvintele…` sub-text, disabled-control labels, and the timer value at rest. The loading sub-text and disabled labels are real text a user must read. *Fix:* either lighten `ink-faint` to ≥4.5:1 on bg (around `#7A7A86` reaches ~4.6:1) for any token used as *text*, or split the token: keep a dim-but-decorative value for the giant placeholder glyph (`–` is large, so 3:1 suffices) and use a separate ≥4.5:1 token for the `se încarcă cuvintele…` line and disabled labels. Disabled controls are technically WCAG-exempt, but the loading sub-text is not.

- **[low]** `accent-dim #6E5CF0` is **4.16:1 on bg** — below AA-normal. Spec'd only as the pressed/active accent state on shapes (button glyph, segment underline), which lives under the 3:1 UI floor, so it passes *as used*. *Fix:* none required; just don't let `accent-dim` ever land on small text (it never is in the current spec — flag is preventive).

- **[low]** `border #26262F` is **1.31:1 on bg / 1.21:1 on surface** — hairlines are essentially invisible to low-vision users and fail the 3:1 non-text floor. Per WCAG these 1px separators are exempt when they're purely decorative and the control is identifiable by other means (the button has a bg-tone step + text), so this is acceptable by the letter. *Fix:* optional — if a control's *only* boundary cue is the border (e.g. an unfilled segment), bump that specific border to ≥3:1; otherwise leave as-is.

- **[note]** Stale NFR: `prd.md` §4 Accessibility still cites the dead Brutalist palette ("cerneală pe hârtie = 17:1", "accentul portocaliu și griul"). Nocturn supersedes it. *Fix:* update the PRD NFR text to the Nocturn pairs so a downstream implementer doesn't chase `#FF3B00`.

### Screen-reader exclusion (aria-live)

- **[high]** `aria-live="off"` on the hero word during `playing` (`EXPERIENCE.md` Accessibility Floor) means a screen-reader user gets **zero announcement of the app's only output** while it runs — the entire product is silent to them. The justification ("would flood an SR; user #1 is visual") is reasonable as a *default* but ships as a hard exclusion, and it's marked `[ASSUMPTION]`. The hero is the whole app; silencing it is silencing everything. *Fix:* keep `off` as the playing-state default (correct — a word every 2–12s via `polite` would still queue and lag), but (a) when **paused**, the word must be a readable, focusable/labeled region so an SR user can land on it and hear it — the spine says "citibil normal ca text" but doesn't guarantee it's reachable, so make the hero `tabindex="-1"` + programmatically focus it on pause, or expose it as a labeled region; and (b) add a low-cost setting (a single toggle, "anunță cuvintele") that flips the hero to `aria-live="polite"` for users who *want* the announcements. This converts a silent exclusion into an informed default. Document the decision either way so it isn't an unreviewed assumption at build time.

### Keyboard & focus

- **[medium]** Focus order is asserted ("nivel → controale") but the spine never enumerates the **full tab sequence**, and the DOM source order (bar-top: level + fullscreen; stage; bridge: play, slider, segments) does not match the visual reading order if authored top-down. *Fix:* specify the explicit tab order and make DOM order match it: Fullscreen (top-right) and the level label are in the top bar but the level *selector* is in the bridge — confirm whether the top-bar level indicator is interactive (it reads as display-only `NIVEL · avansat`) vs. the bridge 3-segment selector (interactive). If the top indicator is non-interactive, good; just ensure it's not a tab stop. Enumerate: `[Fullscreen] → [Play/Pause] → [Slider] → [Segment 1/2/3]`.

- **[medium]** **`Space` is bound to play/pause globally**, but `Space` is also the native activation key for a focused `<button>` and scrolls the page by default. If focus is on the Play button, Space fires twice (native click + global handler) unless the global handler checks target/`preventDefault`. *Fix:* scope the global `Space` handler to no-op when a button/slider already has focus (let native handling win), and `preventDefault` on the document-level binding to stop scroll. Same care for arrows: `←/→` adjust the slider natively when it's focused **and** are spec'd as speed control globally — make sure they don't double-apply.

- **[low]** No keyboard trap risk identified — single screen, no modal, Esc exits fullscreen natively. Confirmed clean.

- **[medium]** **Disabled Play in loading/error**: the spine disables Play and "controls remain disabled." A truly `disabled` button is removed from the tab order, which is fine, but the loading state then has *no* focusable element and an SR user gets no programmatic cue that loading is happening. *Fix:* either keep Play focusable-but-inert with `aria-disabled="true"` + `aria-describedby` pointing at the loading text, or put the loading/error message in an `aria-live="polite"` region so its appearance is announced. (This is the one place a live region is unambiguously correct.)

### Focus-visible indicator

- **[medium]** The purple ring (`accent`, 2px, 2px offset) has adequate color contrast against all three surfaces (4.96–5.96:1, computed above — well over 3:1). The risk is the **2px offset gap**: the offset exposes the surface *behind* the control, and on a raised button (`surface`/`surface-2`) the ring sits in a low-contrast tonal band. Contrast is still ≥3:1 so it's compliant, but on the segment underline (which *already* uses accent) a focus ring in the same accent could be visually ambiguous (is it focused, or just active?). *Fix:* for the active level segment, differentiate focus from active — e.g. focus ring offset + a second cue (the ring fully encircling vs. the active underline only on the bottom edge), so "active" and "focused-active" are distinguishable. Keep 2px/2px elsewhere.

### Reduced motion

- **[low]** `prefers-reduced-motion: reduce` is correctly mandated to make the word transition instant. But the spine doesn't say it also covers the **timer-bar fill animation** — a 2–12s continuously animating purple bar is exactly the kind of persistent motion RM users opt out of, and it's not the word transition. *Fix:* under reduced-motion, either stop animating the timer bar smoothly and step it (or hide it), or keep it but confirm it's an intentional exception. Also confirm the word's `translateY(12px→0)+opacity` is the *only* motion being killed — the timer bar is the one the spine forgot. (No auto-playing motion at load is correct since the app starts paused.)

### Touch targets

- **[medium]** The ≥44px claim (`EXPERIENCE.md`, FR-9) covers buttons but the **slider thumb and the 3 level segments** are the at-risk targets. A `range` thumb defaults well under 44px, and three segments crammed onto one compact mobile row easily fall below 44px each. *Fix:* explicitly spec a ≥44×44px hit area for the slider thumb (visual thumb can stay small; pad the touch target) and a ≥44px min-height for each segment with adequate spacing, so adjacent segments aren't mis-tapped. Verify on the "compact bottom row" mobile layout, which is where they'll be squeezed.

### RO language / diacritics

- **[low]** `lang="ro"` on `<html>` is correctly required (drives both correct comma-below rendering and SR pronunciation). Good. *Fix:* none — just ensure it's `ro`, not `ro-RO` only if the font's `locl` feature keys on the bare tag; either is valid for SR pronunciation. The build-time fonttools check for comma-below on `ș ț` is already noted in DESIGN.md.

### Slider accessibility

- **[high]** The spine says the speed value is shown as text "`4s` lângă slider" but **never assigns the `<input type="range">` an accessible name or value announcement**. A bare range input announces as "slider, 4" with no label and no unit — an SR user hears a number with no idea it's *seconds between words*. *Fix:* give the range an `aria-label="viteză (secunde între cuvinte)"` (or `aria-labelledby` the visible label), and add `aria-valuetext` so it announces "4 secunde" rather than a raw "4" (the slider's internal value may be ms or an index, making the raw number meaningless). Bind the visible `Ns` text to the input via `aria-describedby` so it's spoken too. Without this the slider is operable but unintelligible to SR users.
