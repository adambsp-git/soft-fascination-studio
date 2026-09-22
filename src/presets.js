import {validateConfig} from './config.js';

// Original project examples, packaged locally for offline use.
export const PRESETS = Object.freeze([
  {
    "id": "lake",
    "en": "Lake at rest",
    "zh": "湖面微光",
    "config": {
      "version": 1,
      "scene": "water",
      "palette": "moss",
      "seed": 1987,
      "density": 28,
      "motion": 0.55,
      "duration": 12,
      "width": 1280,
      "height": 720
    }
  },
  {
    "id": "rain",
    "en": "Rain in ink",
    "zh": "水墨细雨",
    "config": {
      "version": 1,
      "scene": "rain",
      "palette": "ink",
      "seed": 608,
      "density": 24,
      "motion": 0.35,
      "duration": 16,
      "width": 1080,
      "height": 1920
    }
  },
  {
    "id": "canopy",
    "en": "Canopy at dusk",
    "zh": "暮色树冠",
    "config": {
      "version": 1,
      "scene": "canopy",
      "palette": "dusk",
      "seed": 2608,
      "density": 32,
      "motion": 0.45,
      "duration": 20,
      "width": 1080,
      "height": 1080
    }
  }
].map(p => Object.freeze({...p, config: validateConfig(p.config)})));
