# thinking-orbs-vue

Dotted thought-orb loading indicators for AI & agent UIs, for **Vue 3** and **Nuxt**.

A Vue port of [thinking-orbs](https://github.com/Jakubantalik/thinking-orbs) by
[Jakub Antalik](https://jakubantalik.com). It bundles upstream's own engine untouched, so the
orbs render exactly like the React original. No runtime dependencies, no React, ~8 kB gzipped.

## Install

```bash
npm install thinking-orbs-vue   # or pnpm / yarn / bun
```

## Usage

```vue
<script setup lang="ts">
import { ThinkingOrb } from 'thinking-orbs-vue';
</script>

<template>
  <ThinkingOrb state="searching" />
  <ThinkingOrb state="composing" :size="20" theme="dark" :speed="1.5" />
</template>
```

| Prop     | Type                          | Default     | Description                                    |
| -------- | ----------------------------- | ----------- | ---------------------------------------------- |
| `state`  | see below                     | `'working'` | Which animation to show.                       |
| `size`   | `64 \| 20`                    | `64`        | Tuned size preset, in CSS px.                  |
| `theme`  | `'auto' \| 'dark' \| 'light'` | `'auto'`    | Ink palette. `auto` follows the host page.     |
| `speed`  | `number`                      | `1`         | Multiplier on top of the preset's tuned speed. |
| `paused` | `boolean`                     | `false`     | Freeze on the current frame.                   |

**States:** `working`, `searching`, `solving`, `listening`, `connecting`, `weaving`,
`composing`, `breathing`, `shaping`. You can browse them all on the
[upstream demo](https://orbs.jakubantalik.com).

**Sizes:** only `64` and `20` exist. Each one is a separately tuned design, not a scale factor.

**Theme:** `auto` uses the nearest ancestor with `data-theme="dark|light"` or a `dark` / `light`
class (Tailwind, shadcn-vue and `@nuxtjs/color-mode` all follow this convention). Otherwise it
falls back to `prefers-color-scheme`.

Other attributes (`class`, `style`, `aria-label`…) go to the underlying `<canvas>`. The orb
pauses when offscreen or when the tab is hidden, and shows a static frame under
`prefers-reduced-motion`.

## Nuxt

The component is SSR-safe, so you don't need `<ClientOnly>`. Import it where you need it, or
register it globally:

```ts
// plugins/thinking-orbs.ts
import { ThinkingOrb } from 'thinking-orbs-vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('ThinkingOrb', ThinkingOrb);
});
```

## License

MIT. Includes code from [thinking-orbs](https://github.com/Jakubantalik/thinking-orbs),
© Jakub Antalik, MIT; see [`NOTICE`](./NOTICE).
