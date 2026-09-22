import {createHistory} from '../src/history.js';
import {PRESETS} from '../src/presets.js';
import {DEFAULT, validateConfig, parsePreset, serializePreset} from '../src/config.js';
import {renderSVG} from '../src/engine.js';
import {createPlayerHTML} from '../src/player.js';
import {ENGINE_SOURCE} from './runtime-source.js';
const $ = id => document.getElementById(id);
const strings = {
  en: {gallery:'START WITH A SCENE',undo:'Undo',redo:'Redo',loaded:'Scene loaded. Undo restores your previous composition.',exporting:'Preparing PNG…',preview:'Composition preview',settings:'Composition settings',eyebrow:'A FIELD GUIDE TO SLOWER IMAGES',lede:'Compose a little rain. A surface of water. A canopy in motion.',timeline:'Timeline',fullscreen:'Fullscreen',caption:'A composition, not a prescription. Move at your own pace.',compose:'COMPOSE',scene:'Scene',water:'Water / ripples',rain:'Rain / falling lines',canopy:'Canopy / drifting leaves',palette:'Palette',moss:'Moss & brass',dusk:'Dusk & clay',ink:'Ink & mist',density:'Density',motion:'Motion amplitude',duration:'Loop duration · seconds',seed:'Seed',shuffle:'Shuffle',format:'Export format',png:'Export PNG',svg:'Export SVG',save:'Save preset',import:'Import preset',html:'Export loop HTML',reset:'Reset',note1:'Made for making.',body1:'A small instrument for artists, filmmakers and creative coders. Export a still, exchange a preset, or take a loop into an installation.',note2:'Yours, locally.',body2:'No account. No analytics. No external assets. Your composition stays in this browser unless you export it.',note3:'Leave room for attention.',body3:'Inspired by natural rhythms. This is an artistic tool, without claims about brain activity, therapy or measured attention restoration.',play:'Play',pause:'Pause',saved:'Preset saved.',imported:'Preset imported.',exported:'Export ready.',invalid:'Could not use that value or file. ',storage:'Browser storage unavailable; exports still work.',reduce:'Reduced motion is enabled. Playback starts only when you press Play.',corrupt:'The saved preset was invalid. Defaults restored.'},
  zh: {gallery:'从一幅场景开始',undo:'撤销',redo:'重做',loaded:'场景已载入。撤销可恢复上一幅构图。',exporting:'正在生成 PNG…',preview:'构图预览',settings:'构图设置',eyebrow:'为缓慢的影像，留下一点空间',lede:'一场雨，一池水，一片轻轻摇动的树冠。',timeline:'时间轴',fullscreen:'全屏',caption:'这是创作工具。请按自己的节奏观看。',compose:'创作参数',scene:'场景',water:'水面 / 涟漪',rain:'雨 / 垂落的线',canopy:'树冠 / 浮动的叶',palette:'色调',moss:'苔绿与铜金',dusk:'暮色与陶土',ink:'水墨与薄雾',density:'密度',motion:'运动幅度',duration:'循环时长 · 秒',seed:'随机种子',shuffle:'换一组',format:'导出画幅',png:'导出 PNG',svg:'导出 SVG',save:'保存预设',import:'导入预设',html:'导出循环 HTML',reset:'重置',note1:'为创作而生。',body1:'给艺术家、影像作者与创意开发者的小工具。导出静帧，交换预设，或将循环带进装置。',note2:'在本地，属于你。',body2:'无需账号，不采集使用数据，不加载外部素材。除非主动导出，你的构图保存在当前浏览器。',note3:'给注意力留白。',body3:'灵感来自自然节律。这是艺术工具，不宣称改变脑活动、治疗疾病或经测量证实恢复注意力。',play:'播放',pause:'暂停',saved:'预设已保存。',imported:'预设已导入。',exported:'导出已就绪。',invalid:'无法使用该数值或文件。',storage:'浏览器存储不可用，仍可导出文件。',reduce:'系统已启用减少动态效果。按下播放才会开始动画。',corrupt:'已保存的预设无效，已恢复默认值。'}
};
let config = DEFAULT, lang = navigator.language.startsWith('zh') ? 'zh':'en';
let elapsed=0,playing=false,last=null,raf=0,storageNotice='';
try {
  const saved = localStorage.getItem('sfs:config');
  if (saved) { try { config = parsePreset(saved); } catch { storageNotice = 'corrupt'; } }
  const language = localStorage.getItem('sfs:language');
  if (language === 'zh' || language === 'en') lang = language;
} catch { storageNotice = 'storage'; }
const history = createHistory(config);
const t=key=>strings[lang][key];
function status(message){$('status').textContent=message;}
function persist(){try{localStorage.setItem('sfs:config',serializePreset(config));localStorage.setItem('sfs:language',lang);}catch{status(t('storage'));}}
function draw(){
  $('art').innerHTML=renderSVG(config,elapsed);
  $('time').value=String(Math.round(elapsed/config.duration*1000));
  $('clock').textContent=`${elapsed.toFixed(1)} / ${config.duration} s`;
  $('sceneTag').textContent=`0${['water','rain','canopy'].indexOf(config.scene)+1} / ${config.scene.toUpperCase()}`;
}
function sync(){
  for(const k of ['scene','palette','seed','density','duration'])$(k).value=config[k];
  $('motion').value=Math.round(config.motion*100);
  $('densityValue').textContent=config.density;$('motionValue').textContent=`${Math.round(config.motion*100)}%`;
  const format=`${config.width},${config.height}`;
  for(const option of Array.from($('format').options))if(option.dataset.custom)option.remove();
  if(!Array.from($('format').options).some(o=>o.value===format)){
    const option=new Option(`${config.width} × ${config.height}`,format);option.dataset.custom='true';$('format').add(option);
  }
  $('format').value=format;
  $('stage').style.aspectRatio=`${config.width}/${config.height}`;
  $('undo').disabled=!history.canUndo; $('redo').disabled=!history.canRedo;
  draw();
}
function localize(){
  document.documentElement.lang=lang==='zh'?'zh-CN':'en';
  document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  $('language').textContent=lang==='zh'?'EN':'中文';
  $('language').setAttribute('aria-label',lang==='zh'?'Switch to English':'切换到中文');
  $('preview').setAttribute('aria-label',t('preview'));
  $('settings').setAttribute('aria-label',t('settings'));
  for(const preset of PRESETS) $('preset-'+preset.id).textContent=preset[lang];
  $('play').textContent=t(playing?'pause':'play');
}
function stop(){playing=false;last=null;cancelAnimationFrame(raf);$('play').textContent=t('play');$('play').setAttribute('aria-pressed','false');}
function tick(now){if(!playing)return;if(last!==null)elapsed=(elapsed+(now-last)/1000)%config.duration;last=now;draw();raf=requestAnimationFrame(tick);}
$('play').onclick=()=>{if(playing)stop();else{playing=true;last=null;$('play').textContent=t('pause');$('play').setAttribute('aria-pressed','true');raf=requestAnimationFrame(tick);}};
$('time').oninput=()=>{stop();elapsed=Number($('time').value)/1000*config.duration;draw();};
function update(patch){try{config=history.commit({...config,...patch});elapsed%=config.duration;status('');sync();persist();}catch(error){status(t('invalid')+error.message);sync();}}
for(const k of ['scene','palette'])$(k).onchange=()=>update({[k]:$(k).value});
for(const k of ['seed','duration'])$(k).onchange=()=>update({[k]:Number($(k).value)});
$('density').onchange=()=>update({density:Number($('density').value)});
$('motion').onchange=()=>update({motion:Number($('motion').value)/100});
$('format').onchange=()=>{const [width,height]=$('format').value.split(',').map(Number);update({width,height});};
$('random').onclick=()=>update({seed:crypto.getRandomValues(new Uint32Array(1))[0]});
$('reset').onclick=()=>{stop();elapsed=0;config=history.commit(DEFAULT);sync();persist();status('');};
$('language').onclick=()=>{lang=lang==='zh'?'en':'zh';localize();persist();};
function download(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);status(t('exported'));}
const filename=ext=>`soft-fascination-${config.scene}-${config.seed}.${ext}`;
$('save').onclick=()=>{download(new Blob([serializePreset(config)],{type:'application/json'}),filename('json'));status(t('saved'));};
$('svg').onclick=()=>download(new Blob([renderSVG(config,elapsed)],{type:'image/svg+xml'}),filename('svg'));
$('html').onclick=()=>download(new Blob([createPlayerHTML(config,ENGINE_SOURCE)],{type:'text/html'}),filename('html'));
$('png').onclick=async()=>{
  $('png').disabled=true;$('png').setAttribute('aria-busy','true');status(t('exporting'));const snapshot=config;const svg=renderSVG(snapshot,elapsed);
  const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
  try{const image=new Image();image.src=url;await image.decode();const canvas=document.createElement('canvas');canvas.width=snapshot.width;canvas.height=snapshot.height;canvas.getContext('2d').drawImage(image,0,0);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('PNG export unavailable. Try SVG.');download(blob,`soft-fascination-${snapshot.scene}-${snapshot.seed}.png`);}catch(error){status(error.message);}finally{URL.revokeObjectURL(url);$('png').disabled=false;$('png').removeAttribute('aria-busy');}
};
$('import').onclick=()=>$('file').click();
$('file').onchange=async()=>{const file=$('file').files[0];if(!file)return;try{if(file.size>8192)throw new Error('Preset exceeds 8 KB.');const imported=parsePreset(await file.text());stop();config=history.commit(imported);elapsed=0;sync();persist();status(t('imported'));}catch(error){status(t('invalid')+error.message);}finally{$('file').value='';}};
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('stage').requestFullscreen();}catch{status(lang==='zh'?'此浏览器不支持全屏。':'Fullscreen is unavailable in this browser.');}};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
reduced.addEventListener('change',()=>{if(reduced.matches){stop();status(t('reduce'));}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
for (const preset of PRESETS) {
  const button=document.createElement('button'); button.id='preset-'+preset.id;
  button.type='button'; button.onclick=()=>{stop();elapsed=0;config=history.commit(preset.config);sync();persist();status(t('loaded'));};
  $('presets').append(button);
}
function restore(direction) { stop();config=history[direction]();elapsed=0;sync();persist();status(''); }
$('undo').onclick=()=>restore('undo'); $('redo').onclick=()=>restore('redo');
document.addEventListener('keydown',event=>{
  if(event.defaultPrevented || event.isComposing || event.altKey) return;
  const target=event.target;
  if(target instanceof Element && (target.closest('input,textarea,select') || target.isContentEditable)) return;
  if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z') {
    event.preventDefault();restore(event.shiftKey?'redo':'undo');
  }
});
localize();sync();if(storageNotice)status(t(storageNotice));else if(reduced.matches)status(t('reduce'));
