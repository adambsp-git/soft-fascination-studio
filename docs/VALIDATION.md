# Validation record

Prepared: 2026-09-21. Runtime actually used: Node.js v24.19.0 on Linux.

## Completed checks

- `npm run build`: static build and self-contained editor generated successfully.
- `npm run check`: source, editor, tooling and test JavaScript syntax checked.
- `npm test`: 18 passing tests, covering:
  - schema round-trip, unknown-field and unsafe-input rejection;
  - seeded randomness and seed differences;
  - exact period endpoints for all three scenes;
  - static output at zero amplitude for all scenes;
  - finite SVG output across palettes and time values;
  - time validation;
  - standalone renderer equivalence and generated-source parity;
  - syntactically valid standalone editor and loop-player modules;
  - local HTTP server path restrictions, methods and headers;
  - frame CLI timestamps, manifest and refusal to overwrite an export directory.
- All three example SVGs rasterized using the available Sharp tool and visually inspected as static frames. `examples/scene-overview.png` is an engine-output contact sheet, not an editor screenshot.

## Not completed

The available cloud browser rejected local-file navigation because only HTTP/HTTPS navigation was permitted. No attempt was made to bypass that restriction. Consequently, full browser execution, exported PNG downloads, localStorage behavior, fullscreen, responsiveness, keyboard navigation, reduced-motion behavior and import/export dialogs have **not** been manually verified in this preparation session. Source review and syntax tests are not substitutes for those checks.

Node 22 and hosted GitHub Actions runs are configured but have not been executed. No mobile-device testing, screen-reader audit, prolonged playback, frame-rate benchmark or external security audit is claimed.

## Required manual acceptance before public release

- [ ] Open studio.html and the localhost editor in Chrome, Firefox and Safari.
- [ ] Switch scene/palette, change numeric controls and confirm a visible update.
- [ ] Play, pause, scrub, hide the tab and return; it must remain paused.
- [ ] Enable reduced motion; playback must not start automatically.
- [ ] Save JSON, reset, import, and check restoration including portrait format.
- [ ] Import invalid/oversize JSON; preserve the current composition.
- [ ] Export PNG and SVG at each aspect ratio; verify dimensions and appearance.
- [ ] Export HTML and open with network disabled; verify explicit play/pause and loop seam.
- [ ] Test unavailable localStorage and fullscreen without losing the composition.
- [ ] Use keyboard only and test the 375px mobile layout, zoom and focus indicators.
- [ ] Record actual browser versions, results and issues here.
