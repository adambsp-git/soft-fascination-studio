import test from 'node:test';
import assert from 'node:assert/strict';
import {makeServer} from '../scripts/serve.js';
import {once} from 'node:events';
test('local server serves app and rejects unrelated files, traversal and writes',async()=>{
  const server=makeServer();server.listen(0,'127.0.0.1');await once(server,'listening');
  const base=`http://127.0.0.1:${server.address().port}`;
  try{
    const home=await fetch(base);assert.equal(home.status,200);assert.match(await home.text(),/Soft Fascination/);
    assert.match(home.headers.get('content-security-policy'),/frame-ancestors 'none'/);
    const js=await fetch(base+'/src/engine.js');assert.equal(js.status,200);assert.match(js.headers.get('content-type'),/javascript/);
    for(const path of ['/package.json','/.git/config','/web/%2e%2e%2fpackage.json','/src/%5c..%5cpackage.json','/web/%00','/web/%E0%A4%A'])assert.ok([400,404].includes((await fetch(base+path)).status));
    assert.equal((await fetch(base,{method:'POST'})).status,405);
    const head=await fetch(base,{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
  }finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
});
