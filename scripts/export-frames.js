import {readFile,mkdir,writeFile,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {parsePreset} from '../src/config.js';
import {renderSVG} from '../src/engine.js';
const [presetPath,outPath,fpsArg='24']=process.argv.slice(2);
if(!presetPath||!outPath)throw new Error('Usage: npm run frames -- examples/lake.json output-frames 24');
const fps=Number(fpsArg);
if(!Number.isInteger(fps)||fps<1||fps>60)throw new Error('FPS must be an integer from 1 to 60.');
if((await stat(presetPath)).size>8192)throw new Error('Preset exceeds 8 KB.');
const config=parsePreset(await readFile(presetPath,'utf8'));
const count=Math.round(config.duration*fps);
if(Math.abs(count-config.duration*fps)>1e-7)throw new Error('duration × FPS must be an integer to preserve exact loop timing.');
const out=resolve(outPath);await mkdir(out); // Refuse to overwrite existing exports.
for(let i=0;i<count;i++)await writeFile(resolve(out,`frame-${String(i).padStart(5,'0')}.svg`),renderSVG(config,i/fps));
await writeFile(resolve(out,'manifest.json'),JSON.stringify({version:1,format:'svg',fps,frames:count,duration:config.duration,preset:config},null,2)+'\n');
console.log(`Exported ${count} SVG frames to ${out}; end frame intentionally omitted.`);
