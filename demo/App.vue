<script setup lang="ts">
import { ref } from 'vue';
import { ThinkingOrb, type OrbState, type OrbTheme } from '../src';

const states: OrbState[] = [
  'working',
  'searching',
  'solving',
  'listening',
  'connecting',
  'weaving',
  'composing',
  'breathing',
  'shaping'
];

const speed = ref(1);
const paused = ref(false);
const pageTheme = ref<'light' | 'dark'>('light');
const orbTheme = ref<OrbTheme>('auto');
</script>

<template>
  <main :data-theme="pageTheme" class="page">
    <header>
      <h1>thinking-orbs-vue</h1>
      <p>
        Vue 3 port of
        <a href="https://github.com/Jakubantalik/thinking-orbs">thinking-orbs</a>
        by Jakub Antalik.
      </p>
      <div class="controls">
        <label>
          Page
          <select v-model="pageTheme">
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </label>
        <label>
          Orb theme
          <select v-model="orbTheme">
            <option value="auto">auto</option>
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </label>
        <label>
          Speed {{ speed.toFixed(2) }}
          <input v-model.number="speed" type="range" min="0.25" max="3" step="0.05" />
        </label>
        <label><input v-model="paused" type="checkbox" /> Paused</label>
      </div>
    </header>

    <section class="grid">
      <article v-for="s in states" :key="s" class="card">
        <ThinkingOrb :state="s" :theme="orbTheme" :speed="speed" :paused="paused" />
        <div class="chip">
          <ThinkingOrb :state="s" :size="20" :theme="orbTheme" :speed="speed" :paused="paused" />
          <code>{{ s }}</code>
        </div>
      </article>
    </section>
  </main>
</template>

<style>
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
.page {
  --bg: #fafafa;
  --fg: #111;
  --card: #fff;
  --line: #e5e5e5;
  min-height: 100vh;
  padding: 32px 16px;
  background: var(--bg);
  color: var(--fg);
  box-sizing: border-box;
}
.page[data-theme='dark'] {
  --bg: #0b0b0c;
  --fg: #eee;
  --card: #151517;
  --line: #2a2a2d;
}
header {
  max-width: 960px;
  margin: 0 auto 24px;
}
h1 {
  margin: 0 0 4px;
  font-size: 22px;
}
a {
  color: inherit;
}
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  font-size: 14px;
}
.grid {
  max-width: 960px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px 12px 16px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 12px;
}
.chip {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
</style>
