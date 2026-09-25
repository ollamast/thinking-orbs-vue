/**
 * The nine shipped states — each a hand-tuned animation:
 * - `working`    — particles on tilted orbits
 * - `searching`  — a scan meridian sweeps a dotted globe
 * - `solving`    — bands scramble in quarter turns, then click back
 * - `listening`  — a waveform rolls through latitude rings
 * - `connecting` — a constellation wires itself, packets running the edges
 * - `weaving`    — three strands plait around the sphere
 * - `composing`  — an undulating multi-band sash
 * - `breathing`  — a face-on ring slowly morphing
 * - `shaping`    — a dotted outline morphs circle → triangle → square
 *
 * Declared locally (not re-exported from `thinking-orbs`) so the published
 * types never reference the upstream package, whose typings import React.
 * `test/types.test-d.ts` fails the typecheck if this drifts from upstream.
 */
export type OrbState =
  | 'working'
  | 'searching'
  | 'solving'
  | 'listening'
  | 'connecting'
  | 'weaving'
  | 'composing'
  | 'breathing'
  | 'shaping';

/**
 * Rendered size in CSS pixels. Exactly two tuned presets ship:
 * 64 (chat-avatar scale) and 20 (inline-text scale). Each size carries its
 * own dot count, dot size and speed tuning — they are separate designs,
 * not a scale factor.
 */
export type OrbSize = 64 | 20;

/**
 * Theme mode.
 *
 * - `auto` (default) resolves in two layers, live-updating on change:
 *   1. a `data-theme="dark|light"` attribute or `dark`/`light` class on any
 *      ancestor (the Tailwind / shadcn / Nuxt color-mode convention);
 *   2. otherwise `prefers-color-scheme`.
 * - `dark` / `light` pin the palette regardless of context.
 *
 * Dark renders light ink on the transparent canvas (for dark backgrounds);
 * light renders dark ink (for light backgrounds).
 */
export type OrbTheme = 'auto' | 'dark' | 'light';

/** Props for the ThinkingOrb Vue component. */
export interface ThinkingOrbProps {
  /** Which animation to show. @default 'working' */
  state?: OrbState;
  /** Tuned size preset — 64 or 20 CSS px. @default 64 */
  size?: OrbSize;
  /** Theme mode; `auto` detects from the host project. @default 'auto' */
  theme?: OrbTheme;
  /** Animation speed multiplier on top of the preset's baked speed. @default 1 */
  speed?: number;
  /** Freeze the animation on the current frame. @default false */
  paused?: boolean;
}
