import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,extname,dirname} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml'};
export function makeServer(){return createServer(async(req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});return res.end();}
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end();}
  if(pathname==='/')pathname='/web/index.html';
  // Do not serve project docs, tests, source maps, dotfiles or traversal paths.
  const segments=pathname.split('/');
  if(!/^\/(web|src|examples)\//.test(pathname)||segments.some(s=>s.startsWith('.'))||pathname.includes('\\')||pathname.includes('\0')||!Object.hasOwn(types,extname(pathname))){res.writeHead(404);return res.end();}
  try{const path=resolve(root,'.'+pathname);if(!(await stat(path)).isFile())throw new Error('not file');const body=await readFile(path);res.writeHead(200,{'Content-Type':types[extname(path)],'X-Content-Type-Options':'nosniff','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'"});res.end(req.method==='HEAD'?undefined:body);}catch{res.writeHead(404);res.end('Not found');}
});}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const port=Number(process.env.PORT||4173);
  if(!Number.isInteger(port)||port<1||port>65535)throw new Error('Invalid PORT.');
  makeServer().listen(port,'127.0.0.1',()=>console.log(`Soft Fascination Studio: http://127.0.0.1:${port}`));
}
