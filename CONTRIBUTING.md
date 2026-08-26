# Contributing

Typed Unit System is maintained by Artem Prianishnikov.

A change should include:

- a focused use case;
- exact conversion factors and their source when adding physical units;
- RED then GREEN tests for behavior changes;
- round-trip coverage where applicable;
- explicit handling for affine or composite semantics;
- a passing `bun run verify`.

Avoid silent breaking changes to unit keys, persisted cursors, canonical factors, or composite tuple order.
