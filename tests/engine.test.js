import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT,validateConfig,parsePreset,serializePreset,SCENES,PALETTES,randomSequence,loopPhase} from '../src/config.js';
import {renderSVG} from '../src/engine.js';
import {createPlayerHTML} from '../src/player.js';
import {engineSource} from '../scripts/build.js';
import vm from 'node:vm';
test('preset round trip preserves every field',()=>{
  const config=validateConfig({...DEFAULT,scene:'canopy',seed:4294967295,motion:0,width:1080,height:1920});
  assert.deepEqual(parsePreset(serializePreset(config)),config);
  assert.ok(Object.isFrozen(config));
});
test('unsafe and ambiguous inputs are rejected before rendering',()=>{
  for(const input of [null,[],3,{scene:'<script>'},{palette:'__proto__'},{density:65},{density:8.5},{seed:-1},{seed:NaN},{motion:Infinity},{duration:0},{version:2},{width:3840,height:3840},{unknown:1},{seed:'3'}])assert.throws(()=>validateConfig(input));
  assert.throws(()=>parsePreset('{'));
  assert.throws(()=>parsePreset(' '.repeat(8193)));
  assert.throws(()=>parsePreset('{"__proto__":{"injected":true}}'));
  assert.equal({}.injected,undefined);
});
test('random sequence is bounded, deterministic and seed-sensitive',()=>{
  const seq=seed=>{const r=randomSequence(seed);return Array.from({length:1000},r);};
  const values=seq(42);assert.deepEqual(values,seq(42));assert.notDeepEqual(values,seq(43));
  assert.ok(values.every(n=>n>=0&&n<1));
});
for(const scene of SCENES){
  test(`${scene}: period endpoint matches exactly and different seeds differ`,()=>{
    const c={...DEFAULT,scene};assert.equal(renderSVG(c,0),renderSVG(c,c.duration));
    assert.equal(renderSVG(c,0),renderSVG(c,2*c.duration));
    assert.notEqual(renderSVG(c,0),renderSVG({...c,seed:99},0));
    assert.notEqual(renderSVG(c,0),renderSVG(c,3));
  });
  test(`${scene}: zero amplitude produces a static composition`,()=>{
    const c={...DEFAULT,scene,motion:0};assert.equal(renderSVG(c,0),renderSVG(c,3));
  });
  test(`${scene}: valid finite self-contained SVG at all supported palettes`,()=>{
    for(const palette of Object.keys(PALETTES))for(const time of [-12,-0.01,0,11.999,12,1200]){
      const svg=renderSVG({...DEFAULT,scene,palette,density:64,width:1080,height:1920},time);
      assert.ok(svg.startsWith('<svg '));assert.ok(svg.endsWith('</svg>'));
      assert.doesNotMatch(svg,/NaN|Infinity|undefined|<script|<image|foreignObject|onload=/);
      assert.match(svg,/viewBox="0 0 1080 1920"/);
    }
  });
}
test('time handling rejects non-finite values and supports negative time',()=>{
  assert.equal(loopPhase(-3,12),0.75);assert.equal(loopPhase(12,12),0);
  for(const n of [NaN,Infinity,'0'])assert.throws(()=>renderSVG(DEFAULT,n));
});
test('standalone export uses the same renderer and does not autoplay',async()=>{
  const source=await engineSource();
  const standalone=vm.runInNewContext(`${source}; renderSVG(${JSON.stringify(DEFAULT)},3)`);
  assert.equal(standalone,renderSVG(DEFAULT,3));
  const html=createPlayerHTML(DEFAULT,source);
  assert.equal((html.match(/<script/g)||[]).length,1);
  assert.equal((html.match(/<\/script>/g)||[]).length,1);
  assert.doesNotMatch(html,/<script[^>]*src=|https?:\/\/(?!www.w3.org)/);
  assert.match(html,/playing=false/);
  assert.match(html,/visibilitychange/);
});
