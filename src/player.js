import {validateConfig} from './config.js';
export function createPlayerHTML(config, engineSource) {
  const c = validateConfig(config);
  // engineSource is bundled first-party source, never user-supplied text.
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Soft Fascination Loop</title><style>body{margin:0;background:#101a18;color:#e0e9dc;font:14px system-ui}#art{height:100vh;display:grid;place-items:center}svg{max-width:100%;max-height:100vh;width:auto;height:auto}button{position:fixed;bottom:16px;left:16px;padding:12px;border:1px solid #8ea997;background:#142621;color:inherit}button:focus-visible{outline:3px solid #f0c889}</style><div id="art" aria-label="Generative visual composition"></div><button id="play" aria-pressed="false">Play</button><script type="module">${engineSource.replaceAll('</script', '<\\/script')}
const config=${JSON.stringify(c)};
const art=document.querySelector('#art'), button=document.querySelector('#play');
let elapsed=0,last=null,playing=false;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
function draw(){art.innerHTML=renderSVG(config,elapsed);}
function stop(){playing=false;last=null;button.textContent='Play';button.setAttribute('aria-pressed','false');}
function tick(now){if(!playing)return;if(last!==null)elapsed=(elapsed+(now-last)/1000)%config.duration;last=now;draw();requestAnimationFrame(tick);}
button.onclick=()=>{if(playing)stop();else{playing=true;last=null;button.textContent='Pause';button.setAttribute('aria-pressed','true');requestAnimationFrame(tick);}};
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
reduce.addEventListener('change',()=>{if(reduce.matches)stop();});
draw();
</script></html>`;
}
