// Compile-time guard: our locally-declared OrbState/OrbSize must match the
// upstream engine exactly. Bumping `thinking-orbs` to a version that adds
// (or removes) a state breaks `npm run typecheck` until types.ts catches up.

import type { OrbSize as UpstreamSize, OrbState as UpstreamState } from 'thinking-orbs/engine';
import type { OrbSize, OrbState } from '../src/types';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

export type _checks = [Expect<Equal<OrbState, UpstreamState>>, Expect<Equal<OrbSize, UpstreamSize>>];
