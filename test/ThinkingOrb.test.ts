import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { ThinkingOrb } from '../src';

// happy-dom has no real 2D context: stub one that records draw calls, so the
// component actually runs its render loop and the bundled engine paints.
function fakeCtx() {
  const calls = { arc: 0, stroke: 0, fill: 0 };
  const ctx = new Proxy(
    {},
    {
      get: (_t, key) =>
        key in calls
          ? () => {
              calls[key as keyof typeof calls]++;
            }
          : () => {},
      set: () => true
    }
  );
  return { ctx, calls };
}

let calls: { arc: number; stroke: number; fill: number };
type Spy = { mock: { calls: unknown[][] } };
let add: Spy;
let remove: Spy;
const visCount = (spy: Spy) => spy.mock.calls.filter((c) => c[0] === 'visibilitychange').length;

beforeEach(() => {
  const f = fakeCtx();
  calls = f.calls;
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    f.ctx as unknown as CanvasRenderingContext2D
  );
  add = vi.spyOn(document, 'addEventListener');
  remove = vi.spyOn(document, 'removeEventListener');
});
afterEach(() => vi.restoreAllMocks());

describe('ThinkingOrb', () => {
  it('renders an accessible canvas sized in CSS px', () => {
    const w = mount(ThinkingOrb, { props: { state: 'searching', size: 20 } });
    const canvas = w.get('canvas');
    expect(canvas.attributes('role')).toBe('img');
    expect(canvas.attributes('aria-label')).toBe('Searching…');
    expect(canvas.attributes('style')).toContain('width: 20px');
    expect(canvas.attributes('style')).toContain('height: 20px');
  });

  it('lets a consumer aria-label, class and style win', () => {
    const w = mount(ThinkingOrb, {
      attrs: { 'aria-label': 'Loading answer', class: 'mine', style: 'opacity: 0.5' }
    });
    const canvas = w.get('canvas');
    expect(canvas.attributes('aria-label')).toBe('Loading answer');
    expect(canvas.classes()).toContain('mine');
    expect(canvas.attributes('style')).toContain('opacity: 0.5');
    expect(canvas.attributes('style')).toContain('width: 64px');
  });

  it('uses the "Thinking…" label for breathing, like upstream', () => {
    const w = mount(ThinkingOrb, { props: { state: 'breathing' } });
    expect(w.get('canvas').attributes('aria-label')).toBe('Thinking…');
  });

  it('paints a frame with the bundled engine, dots and edges', () => {
    mount(ThinkingOrb, { props: { state: 'connecting' } });
    expect(calls.arc).toBeGreaterThan(0);
    expect(calls.stroke).toBeGreaterThan(0);
  });

  it('sets the backing store to size × devicePixelRatio (capped at 2)', () => {
    vi.stubGlobal('devicePixelRatio', 3);
    const w = mount(ThinkingOrb, { props: { size: 20 } });
    const el = w.get('canvas').element as HTMLCanvasElement;
    expect(el.width).toBe(40);
    expect(el.height).toBe(40);
    vi.unstubAllGlobals();
  });

  it('re-runs on prop change and leaves no listener behind', async () => {
    const w = mount(ThinkingOrb, { attachTo: document.body });
    expect(visCount(add)).toBe(1);
    await w.setProps({ state: 'weaving' });
    await w.setProps({ paused: true });
    await nextTick();
    expect(visCount(add)).toBe(3);
    expect(visCount(remove)).toBe(2);
    w.unmount();
    expect(visCount(remove)).toBe(visCount(add));
  });
});
