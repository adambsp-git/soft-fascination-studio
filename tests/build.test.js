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
    assert.equal(await readFile('index.html','utf8'),editor);
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

test('static entry assets and module imports resolve under nested hosting paths',async()=>{
  const rootPage=await readFile('dist/index.html','utf8');
  const nestedPage=await readFile('dist/web/index.html','utf8');
  for(const [url,html] of [['https://example.test/studio/',rootPage],['https://example.test/studio/web/index.html',nestedPage]]){
    for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){
      if(match[1].startsWith('#'))continue;
      const resolved=new URL(match[1],url);
      assert.ok(resolved.pathname.startsWith('/studio/'));
      await readFile('dist/'+resolved.pathname.slice('/studio/'.length));
    }
  }
  const app=await readFile('dist/web/app.js','utf8');
  for(const match of app.matchAll(/^import .* from '([^']+)';/gm)){
    const path=new URL(match[1],'https://example.test/studio/web/app.js').pathname;
    assert.ok(path.startsWith('/studio/'));await readFile('dist/'+path.slice(8));
  }
});
