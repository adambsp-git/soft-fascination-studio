import {validateConfig, PALETTES, randomSequence, loopPhase} from './config.js';
const TAU = Math.PI * 2;
const f = n => Number(n.toFixed(3));
/** Pure SVG renderer. No DOM, external assets, scripts, fonts, or network. */
export function renderSVG(input, seconds = 0) {
  const c = validateConfig(input);
  const p = loopPhase(seconds, c.duration);
  const r = randomSequence(c.seed);
  const [bg, mid, light, accent] = PALETTES[c.palette];
  const w = c.width, h = c.height, unit = Math.min(w,h), a = p * TAU;
  const shapes = [];
  if (c.scene === 'water') {
    // Fixed centers and oscillating radial fields: no wrap discontinuity.
    for (let i = 0; i < c.density; i++) {
      const x = r()*w, y = r()*h, radius = unit*(0.04+r()*0.15), phase = r()*TAU;
      const pulse = (1+c.motion*Math.sin(a+phase))/2;
      for(let j=0;j<4;j++) {
        const rad = radius*(0.5+j*0.28+c.motion*0.18*Math.sin(a+phase));
        shapes.push(`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rad)}" ry="${f(rad*0.38)}" fill="none" stroke="${i%6===0?accent:light}" stroke-width="${f(unit/900)}" opacity="${f(0.035+(0.14+0.07*pulse)*(1-j/5))}"/>`);
      }
    }
  } else if (c.scene === 'rain') {
    for (let i=0;i<c.density*3;i++) {
      const x=r()*w, offset=r(), length=unit*(0.025+r()*0.1), cycles=1+Math.floor(r()*2);
      // Vertical travel wraps only outside the viewport. motion=0 is static.
      const travel=c.motion===0?offset:(offset+p*cycles)%1;
      const y=travel*(h+2*length)-length;
      const drift=c.motion*unit*0.025*Math.sin(a+r()*TAU);
      shapes.push(`<path d="M ${f(x+drift)} ${f(y)} l ${f(-length*0.15)} ${f(length)}" stroke="${light}" stroke-width="${f(unit*(0.0008+r()*0.001))}" opacity="${f(0.1+r()*0.3)}" stroke-linecap="round"/>`);
    }
    for(let i=0;i<7;i++) {
      const y=h*(0.78+i*0.045);
      shapes.push(`<path d="M 0 ${f(y)} Q ${f(w/2)} ${f(y-18*c.motion*Math.sin(a+i))} ${w} ${f(y)}" fill="none" stroke="${mid}" opacity="0.25"/>`);
    }
  } else {
    for(let i=0;i<c.density;i++) {
      const x=r()*w,y=r()*h,size=unit*(0.07+r()*0.15),phase=r()*TAU;
      const angle=r()*360+12*c.motion*Math.sin(a+phase);
      const dx=unit*0.025*c.motion*Math.sin(a+phase);
      const dy=unit*0.015*c.motion*Math.cos(a+phase);
      shapes.push(`<g transform="translate(${f(x+dx)} ${f(y+dy)}) rotate(${f(angle)})" opacity="${f(0.16+r()*0.3)}"><path d="M ${f(-size)} 0 Q 0 ${f(-size*0.8)} ${f(size)} 0 Q 0 ${f(size*0.8)} ${f(-size)} 0" fill="${i%5===0?accent:mid}"/><path d="M ${f(-size)} 0 L ${f(size)} 0" stroke="${light}" stroke-width="${f(unit/1300)}" opacity="0.5"/></g>`);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${c.scene} generative composition"><defs><radialGradient id="glow"><stop stop-color="${mid}" stop-opacity="0.24"/><stop offset="1" stop-color="${bg}" stop-opacity="0"/></radialGradient></defs><rect width="${w}" height="${h}" fill="${bg}"/><ellipse cx="${f(w*0.62)}" cy="${f(h*0.42)}" rx="${f(w*0.65)}" ry="${f(h*0.8)}" fill="url(#glow)"/>${shapes.join('')}<rect x="1" y="1" width="${w-2}" height="${h-2}" fill="none" stroke="${light}" stroke-opacity="0.06"/></svg>`;
}
