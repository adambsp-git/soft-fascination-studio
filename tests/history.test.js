import test from 'node:test';
import assert from 'node:assert/strict';
import {createHistory} from '../src/history.js';
import {DEFAULT} from '../src/config.js';
import {PRESETS} from '../src/presets.js';
import {readFile} from 'node:fs/promises';

test('undo restores all composition fields and redo restores a preset',()=>{
  const h=createHistory(DEFAULT);
  h.commit(PRESETS[1].config);
  assert.deepEqual(h.undo(),DEFAULT);
  assert.deepEqual(h.redo(),PRESETS[1].config);
  assert.equal(h.canRedo,false);
  assert.equal(Object.isFrozen(h.current),true);
});
test('invalid edits and duplicate edits preserve the redo branch',()=>{
  const h=createHistory(DEFAULT);
  h.commit({...DEFAULT,seed:42});h.undo();
  assert.throws(()=>h.commit({...DEFAULT,seed:-1}));
  h.commit({...DEFAULT});
  assert.equal(h.canRedo,true);
  assert.equal(h.redo().seed,42);
});
test('editing after undo discards only the abandoned future',()=>{
  const h=createHistory(DEFAULT);
  h.commit({...DEFAULT,seed:1});h.commit({...DEFAULT,seed:2});h.undo();
  h.commit({...DEFAULT,seed:3});
  assert.equal(h.canRedo,false);
  assert.equal(h.undo().seed,1);
  assert.equal(h.undo().seed,DEFAULT.seed);
});
test('history is bounded and never retains mutable caller objects',()=>{
  const h=createHistory(DEFAULT,2), value={...DEFAULT,seed:1};
  h.commit(value);value.seed=99;
  h.commit({...DEFAULT,seed:2});h.commit({...DEFAULT,seed:3});
  assert.equal(h.undo().seed,2);assert.equal(h.undo().seed,1);
  assert.equal(h.canUndo,false);assert.equal(h.undo().seed,1);
  for(const limit of [0,-1,501,1.5])assert.throws(()=>createHistory(DEFAULT,limit));
});
test('gallery exactly reproduces the published example files',async()=>{
  for(const preset of PRESETS){
    assert.deepEqual(preset.config,JSON.parse(await readFile(`examples/${preset.id}.json`,'utf8')));
    assert.ok(preset.en&&preset.zh);
  }
});
