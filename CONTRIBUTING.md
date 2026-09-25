# Contributing

```bash
bun install
bun run dev             # demo playground
bun run release:check   # typecheck, tests, build, dist guard
```

## Updating the upstream engine

The engine from `thinking-orbs` is bundled into `dist/` at build time (it is a devDependency),
so users never install `thinking-orbs` or the `react` peer it declares.

1. Bump `thinking-orbs` in `devDependencies`. Prefer a version published with provenance
   (`npm view thinking-orbs@x.y.z dist.attestations`).
2. Run `bun run typecheck`. `test/types.test-d.ts` fails if upstream added or removed a state; in
   that case update `src/types.ts` and the labels in `src/ThinkingOrb.vue`.
3. Update the version in `NOTICE`, then release.
