import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,readdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {DEFAULT} from '../src/config.js';
import {renderSVG} from '../src/engine.js';
test('frame CLI produces exact timeline, manifest and refuses overwrite',async()=>{
  const root=await mkdtemp(join(tmpdir(),'sfs-test-'));
  try{
    const path=join(root,'preset.json'),out=join(root,'frames');
    const c={...DEFAULT,duration:4};await writeFile(path,JSON.stringify(c));
    const run=(fps='2')=>spawnSync(process.execPath,['scripts/export-frames.js',path,out,fps],{encoding:'utf8'});
    assert.equal(run().status,0);assert.equal((await readdir(out)).length,9);
    assert.equal(await readFile(join(out,'frame-00007.svg'),'utf8'),renderSVG(c,3.5));
    const manifest=JSON.parse(await readFile(join(out,'manifest.json'),'utf8'));assert.equal(manifest.frames,8);
    assert.notEqual(run().status,0);assert.notEqual(run('0').status,0);
  }finally{await rm(root,{recursive:true,force:true});}
});
