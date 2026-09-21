# Engine and preset API

The engine uses standard JavaScript modules and returns SVG text. It works in Node and browsers without a DOM.

```js
import {DEFAULT, validateConfig, parsePreset, serializePreset} from '../src/config.js';
import {renderSVG} from '../src/engine.js';
const config = validateConfig({...DEFAULT, seed: 23, scene: 'canopy'});
const frame = renderSVG(config, 2.5);
```

`validateConfig(object)` merges missing fields with defaults, rejects unknown fields and invalid values, and returns a frozen normalized object. `parsePreset(text)` enforces a maximum string length and parses/validates JSON. `serializePreset(object)` returns normalized indented JSON plus a newline. UI and CLI additionally enforce the file byte limit.

| Field | Default | Accepted values |
|---|---|---|
| version | 1 | 1 |
| scene | water | rain, water, canopy |
| palette | moss | moss, dusk, ink |
| seed | 1987 | integer 0 to 4,294,967,295 |
| density | 28 | integer 8 to 64 |
| motion | 0.55 | finite number 0 to 1 |
| duration | 12 | finite seconds 4 to 60 |
| width | 1280 | integer pixels 320 to 3840 |
| height | 720 | integer pixels 320 to 3840 |

Width × height must not exceed 8,294,400 pixels. Unknown properties, including prototype-like JSON fields, are rejected. Non-finite time inputs are rejected. Negative time wraps periodically.

`renderSVG(config, seconds)` creates one self-contained SVG. No resources, user-provided markup or image URLs are embedded. Exactly the same accepted inputs produce the same SVG within this engine version. Cross-version visual identity is not guaranteed.

Each period ends at its initial configuration. Frame exports sample `[0, duration)` and omit the duplicated last frame. For exact video timing, `duration * FPS` must be an integer. Seeded pseudo-randomness determines composition, not security-sensitive values. Sine/cosine phases use integer periods; the rain wraps beyond the viewport. Motion=0 yields a static SVG at every time. Rain motion controls lateral sway; duration controls falling speed for nonzero motion.

The exported loop player embeds this same renderer. It starts paused and stops when hidden. Do not pass arbitrary third-party source to `createPlayerHTML`; its `engineSource` argument is trusted build output, not a preset field.
