import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,writeFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {engineSource} from '../scripts/build.js';
import {createPlayerHTML} from '../src/player.js';
import {DEFAULT} from '../src/config.js';
import {ENGINE_SOURCE} from '../web/runtime-source.js';
test('generated runtime matches engine sources',async()=>assert.equal(ENGINE_SOURCE,await engineSource()));
test('standalone editor and player contain exactly one syntactically valid inline module',async()=>{
  const root=await mkdtemp(join(tmpdir(),'sfs-build-'));
  try{
    const editor=await readFile('studio.html','utf8');
    const player=createPlayerHTML(DEFAULT,await engineSource());
    for(const [i,html] of [editor,player].entries()){
      assert.ok(html.includes('<script type="module">'));
      assert.equal((html.match(/<\/script>/g)||[]).length,1);
      assert.doesNotMatch(html,/<script[^>]*src=|<link[^>]*rel="stylesheet"/);
      const marker='<script type="module">';
      const script=html.slice(html.indexOf(marker)+marker.length,html.lastIndexOf('</script>'));
      assert.doesNotMatch(script,/^import /m);
      const path=join(root,`${i}.mjs`);await writeFile(path,script);
      const check=spawnSync(process.execPath,['--check',path],{encoding:'utf8'});
      assert.equal(check.status,0,check.stderr);
    }
    // Every authored label/translation target has corresponding DOM nodes.
    const app=await readFile('web/app.js','utf8');
    for(const match of app.matchAll(/\$\('([^']+)'\)/g))assert.ok(editor.includes(`id="${match[1]}"`),match[1]);
  }finally{await rm(root,{recursive:true,force:true});}
});
