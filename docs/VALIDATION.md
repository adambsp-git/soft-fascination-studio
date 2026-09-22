# Validation record

Updated: 2026-09-22. Local runtime: Node.js 24 on Linux.

## Completed checks

- `npm run build`: static build and self-contained editor generated successfully.
- `npm run check`: source, editor, tooling and test JavaScript syntax checked.
- `npm test`: 24 passing tests, covering:
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

Additional 0.2.0 regression coverage: complete preset restoration through undo/redo; invalid/duplicate edits preserving redo; redo branch truncation; bounded immutable history; gallery/example parity; entry and module paths under a nested hosting prefix; standalone entry parity.

## Hosted browser checks

Public demo: https://adambsp-git.github.io/soft-fascination-studio/

The v0.2 pull request passed all four CI checks (Node 22/24, push and pull-request runs) before merge: https://github.com/adambsp-git/soft-fascination-studio/pull/1 . GitHub Pages deployment succeeded from `main`.

On 2026-09-22, the hosted editor was exercised in the available cloud Chrome browser (exact browser version unavailable):

- All three presets loaded with their corresponding scene, palette, dimensions and timing.
- Undo/redo restored the previous complete composition; Ctrl+Z worked from a preset button.
- Refresh restored the last saved composition and started paused; history was correctly empty after reload.
- English/Chinese switching updated controls and region labels.
- Playback advanced the timeline; Pause stopped it.
- The published rain JSON example imported through the file chooser, including portrait dimensions.
- PNG generation reached “Export ready.”, but the browser download event timed out. The downloaded file and its dimensions have **not** been verified.
- Visual inspection found that range labels were associated with the nested outputs instead of their sliders. Explicit `for` attributes were added to the density and motion labels.

## Not completed

Cross-browser and real-device acceptance remain pending. The available cloud browser permits only HTTP/HTTPS navigation, so direct local-file execution was not verified. No screen-reader audit, unavailable-storage test, reduced-motion system setting test, fullscreen acceptance, prolonged playback, frame-rate benchmark or external security audit is claimed. Downloaded export files and offline exported-player execution remain unverified.

## Remaining acceptance before a stable release

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
