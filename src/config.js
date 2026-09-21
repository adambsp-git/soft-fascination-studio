/** Versioned, deliberately small interchange format. All inputs are untrusted. */
export const SCENES = Object.freeze(['rain', 'water', 'canopy']);
export const PALETTES = Object.freeze({
  moss: Object.freeze(['#112b29', '#729887', '#ced9b6', '#dfad77']),
  dusk: Object.freeze(['#25273e', '#787994', '#d4bfbc', '#d49c7c']),
  ink: Object.freeze(['#182427', '#658185', '#c3d5d2', '#ddd0ab']),
});
export const DEFAULT = Object.freeze({version: 1, scene: 'water', palette: 'moss', seed: 1987, density: 28, motion: 0.55, duration: 12, width: 1280, height: 720});
const keys = Object.keys(DEFAULT);
function number(value, low, high, integer, name) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < low || value > high || (integer && !Number.isInteger(value))) {
    throw new Error(`${name} must be ${integer ? 'an integer' : 'a number'} between ${low} and ${high}.`);
  }
  return value;
}
export function validateConfig(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Preset must be an object.');
  if (Object.keys(input).some(key => !keys.includes(key))) throw new Error('Unknown preset field.');
  const c = {...DEFAULT, ...input};
  if (c.version !== 1) throw new Error('Unsupported preset version.');
  if (!SCENES.includes(c.scene)) throw new Error('Unknown scene.');
  if (!Object.hasOwn(PALETTES, c.palette)) throw new Error('Unknown palette.');
  number(c.seed, 0, 4294967295, true, 'seed');
  number(c.density, 8, 64, true, 'density');
  number(c.motion, 0, 1, false, 'motion');
  number(c.duration, 4, 60, false, 'duration');
  number(c.width, 320, 3840, true, 'width');
  number(c.height, 320, 3840, true, 'height');
  if (c.width * c.height > 8294400) throw new Error('Resolution exceeds 8,294,400 pixels.');
  return Object.freeze(c);
}
export function parsePreset(text) {
  if (typeof text !== 'string' || text.length > 8192) throw new Error('Preset is too large (8 KB maximum).');
  return validateConfig(JSON.parse(text));
}
export function serializePreset(config) { return JSON.stringify(validateConfig(config), null, 2) + '\n'; }
export function loopPhase(time, duration) {
  if (!Number.isFinite(time) || !Number.isFinite(duration) || duration <= 0) throw new Error('Invalid time or duration.');
  return ((time % duration) + duration) % duration / duration;
}
export function randomSequence(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let t = Math.imul(state ^ state >>> 15, state | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
