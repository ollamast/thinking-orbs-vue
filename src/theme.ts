// Theme resolution: explicit prop → ancestor data-theme/.dark|.light
// class (watched live) → prefers-color-scheme (subscribed live).
// SSR-safe: nothing touches the DOM until onMounted; the pre-mount
// fallback is dark, as upstream.

import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';
import type { OrbTheme } from './types';

function ancestorTheme(el: Element | null): boolean | null {
  let node: Element | null = el;
  while (node) {
    const attr = node.getAttribute('data-theme');
    if (attr === 'dark') return true;
    if (attr === 'light') return false;
    if (node.classList.contains('dark')) return true;
    if (node.classList.contains('light')) return false;
    node = node.parentElement;
  }
  return null;
}

function systemDark(): boolean {
  return typeof matchMedia === 'undefined' || matchMedia('(prefers-color-scheme: dark)').matches;
}

/** Resolve the effective dark/light substrate for a mounted element. */
export function useResolvedDark(theme: () => OrbTheme, host: Ref<Element | null>): Ref<boolean> {
  const dark = ref(true);
  let teardown: (() => void) | null = null;

  const setup = () => {
    teardown?.();
    teardown = null;

    const mode = theme();
    if (mode !== 'auto') {
      dark.value = mode === 'dark';
      return;
    }

    const resolve = () => {
      dark.value = ancestorTheme(host.value) ?? systemDark();
    };
    resolve();

    // live OS/browser theme switches
    const mq = typeof matchMedia !== 'undefined' ? matchMedia('(prefers-color-scheme: dark)') : null;
    mq?.addEventListener('change', resolve);

    // live app-level toggles: watch class/data-theme flips on ancestors
    let mo: MutationObserver | null = null;
    if (typeof MutationObserver !== 'undefined' && host.value) {
      mo = new MutationObserver(resolve);
      mo.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'data-theme'],
        subtree: true
      });
    }

    teardown = () => {
      mq?.removeEventListener('change', resolve);
      mo?.disconnect();
    };
  };

  onMounted(() => {
    setup();
    watch(theme, setup);
  });
  onBeforeUnmount(() => teardown?.());

  return dark;
}

/** Live `prefers-reduced-motion` — reduced users get a static frame. */
export function useReducedMotion(): Ref<boolean> {
  const reduced = ref(false);
  let teardown: (() => void) | null = null;

  onMounted(() => {
    if (typeof matchMedia === 'undefined') return;
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    reduced.value = mq.matches;
    const on = (e: MediaQueryListEvent) => {
      reduced.value = e.matches;
    };
    mq.addEventListener('change', on);
    teardown = () => mq.removeEventListener('change', on);
  });
  onBeforeUnmount(() => teardown?.());

  return reduced;
}
