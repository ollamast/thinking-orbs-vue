<script setup lang="ts">
// The ThinkingOrb component. One shared clock (performance.now) keeps
// every mounted orb in phase; each instance runs its own rAF loop but
// pauses automatically while offscreen (IntersectionObserver) or when
// the tab is hidden (visibilitychange). Reduced-motion users get a
// static representative frame that still follows the live theme.
//
// Geometry and painting come verbatim from `thinking-orbs/engine`; this
// file is only the Vue binding (a port of upstream's ThinkingOrb.tsx).

import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { MODE_DRAWS, resolvePreset } from 'thinking-orbs/engine';
import { useReducedMotion, useResolvedDark } from './theme';
import type { ThinkingOrbProps } from './types';

const LABELS: Record<string, string> = {
  working: 'Working…',
  searching: 'Searching…',
  solving: 'Solving…',
  listening: 'Listening…',
  connecting: 'Connecting…',
  weaving: 'Weaving…',
  composing: 'Composing…',
  breathing: 'Thinking…',
  shaping: 'Shaping…'
};

const props = withDefaults(defineProps<ThinkingOrbProps>(), {
  state: 'working',
  size: 64,
  theme: 'auto',
  speed: 1,
  paused: false
});

const canvas = ref<HTMLCanvasElement | null>(null);
const dark = useResolvedDark(() => props.theme, canvas);
const reduced = useReducedMotion();

// Vue does not add `px` to numeric styles the way React does.
const sizeStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  display: 'block'
}));

let cleanup: (() => void) | null = null;

function run() {
  cleanup?.();
  cleanup = null;

  const el = canvas.value;
  if (!el) return;
  const { state, size, speed, paused } = props;
  const isDark = dark.value;

  const dpr = Math.min(2, (typeof devicePixelRatio !== 'undefined' && devicePixelRatio) || 1);
  el.width = Math.round(size * dpr);
  el.height = Math.round(size * dpr);
  const ctx = el.getContext('2d');
  if (!ctx) return;

  const { mode, speed: baseSpeed, opts } = resolvePreset(state, size);
  const draw = MODE_DRAWS[mode];
  const effSpeed = baseSpeed * speed;

  const frame = (tSec: number) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    draw(ctx, size, tSec, isDark, opts);
  };

  // reduced motion → one static, deterministic frame
  if (reduced.value) {
    frame(0.6);
    return;
  }

  let raf = 0;
  let running = false;
  const loop = () => {
    frame((performance.now() / 1000) * effSpeed);
    if (running) raf = requestAnimationFrame(loop);
  };
  const start = () => {
    if (running || paused) return;
    running = true;
    raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  // draw at least one frame even when paused/offscreen
  frame((performance.now() / 1000) * effSpeed);

  // pause offscreen + on hidden tabs — free when not visible
  let visible = true;
  const io =
    typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible && document.visibilityState !== 'hidden') start();
          else stop();
        })
      : null;
  io?.observe(el);
  const onVis = () => {
    if (document.visibilityState === 'hidden') stop();
    else if (visible) start();
  };
  document.addEventListener('visibilitychange', onVis);
  if (!io) start();

  cleanup = () => {
    stop();
    io?.disconnect();
    document.removeEventListener('visibilitychange', onVis);
  };
}

onMounted(() => {
  run();
  watch(
    () => [props.state, props.size, props.speed, props.paused, dark.value, reduced.value],
    run
  );
});
onBeforeUnmount(() => {
  cleanup?.();
  cleanup = null;
});
</script>

<template>
  <!-- fallthrough attrs (class, style, aria-label, listeners…) land here and
       win over the defaults below -->
  <canvas ref="canvas" role="img" :aria-label="LABELS[props.state]" :style="sizeStyle" />
</template>
