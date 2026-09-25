// @vitest-environment node
// No window/document here: proves setup never touches the DOM (Nuxt SSR).

import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { ThinkingOrb } from '../src';

describe('ThinkingOrb SSR', () => {
  it('renders on the server without a DOM', async () => {
    expect(typeof document).toBe('undefined');
    const html = await renderToString(createSSRApp({ render: () => h(ThinkingOrb, { state: 'weaving' }) }));
    expect(html).toContain('<canvas');
    expect(html).toContain('aria-label="Weaving…"');
    expect(html).toContain('width:64px');
  });
});
