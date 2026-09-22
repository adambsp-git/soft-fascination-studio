import {validateConfig, serializePreset} from './config.js';

/** Bounded, immutable composition history. Rejected edits never change history. */
export function createHistory(initial, limit = 50) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 500) throw new Error('Invalid history limit.');
  let entries = [validateConfig(initial)], index = 0;
  return {
    get current() { return entries[index]; },
    get canUndo() { return index > 0; },
    get canRedo() { return index < entries.length - 1; },
    commit(value) {
      const next = validateConfig(value);
      if (serializePreset(next) === serializePreset(entries[index])) return entries[index];
      entries = entries.slice(0, index + 1);
      entries.push(next);
      if (entries.length > limit + 1) entries.shift();
      index = entries.length - 1;
      return next;
    },
    undo() { if (index > 0) index--; return entries[index]; },
    redo() { if (index < entries.length - 1) index++; return entries[index]; },
  };
}
