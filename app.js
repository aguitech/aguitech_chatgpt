'use strict';
document.documentElement.classList.add('js');
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

const canvas = document.getElementById('universe');
const ctx = canvas.getContext('2d');
const button = document.getElementById('motion');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduced.matches, width = 0, height = 0, angle = 0, tilt = 0.3, drag = null;
let previous = 0, visible = true;
// All geometry lives in 3D; rotation, perspective projection and depth sorting
// produce the sculpture without a network dependency or a graphics framework.
function rotate(point, a, b) {
  const [x,y,z] = point, xx = x*Math.cos(a)+z*Math.sin(a), zz = z*Math.cos(a)-x*Math.sin(a);
  return [xx,y*Math.cos(b)-zz*Math.sin(b),y*Math.sin(b)+zz*Math.cos(b)];
}
function project(point) {
  const scale = Math.min(width,height)*0.31, perspective = 5/(5+point[2]);
  return [width/2+point[0]*scale*perspective,height/2+point[1]*scale*perspective,point[2],perspective];
}
const particles = Array.from({length:58},(_,i) => {
  const t=i*2.399963, y=1-2*(i+.5)/58, r=Math.sqrt(1-y*y);
  return [Math.cos(t)*r*1.7,y*1.7,Math.sin(t)*r*1.7];
});
const cube = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(p=>p.map(v=>v*.57));
const faces = [[0,1,2,3],[4,7,6,5],[0,4,5,1],[3,2,6,7],[0,3,7,4],[1,5,6,2]];
function draw() {
  ctx.clearRect(0,0,width,height);
  ctx.strokeStyle='#20251f0c';ctx.lineWidth=1;
  for(let i=0;i<width;i+=42){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,height);ctx.stroke();}
  for(let i=0;i<height;i+=42){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(width,i);ctx.stroke();}
  const shadow=ctx.createRadialGradient(width/2,height*.77,0,width/2,height*.77,width*.3);
  shadow.addColorStop(0,'#20251f20');shadow.addColorStop(1,'#20251f00');
  ctx.save();ctx.translate(0,height*.77);ctx.scale(1,.22);ctx.translate(0,-height*.77);ctx.fillStyle=shadow;ctx.fillRect(0,0,width,height*5);ctx.restore();
  const paths=[];
  for(let ring=0;ring<3;ring++){
    for(let i=0;i<100;i++){
      const points=[i,i+1].map(n=>{const t=n/100*Math.PI*2;const p=[Math.cos(t)*1.4,Math.sin(t)*1.4,0];return project(rotate(rotate(p,ring*.95,ring*.8+.25),angle*.45,tilt));});
      paths.push({z:(points[0][2]+points[1][2])/2,type:'line',points});
    }
  }
  const vertices=cube.map(p=>project(rotate(p,angle,tilt+.35)));
  faces.forEach((f,i)=>paths.push({z:f.reduce((sum,n)=>sum+vertices[n][2],0)/4,type:'face',points:f.map(n=>vertices[n]),color:['#e84517','#fd7943','#f85824','#ff9560','#d94217','#ff6b30'][i]}));
  particles.forEach((p,i)=>{const q=project(rotate(p,angle*.2,tilt));paths.push({z:q[2],type:'dot',point:q,index:i});});
  paths.sort((a,b)=>b.z-a.z).forEach(item=>{
    if(item.type==='dot'){const [x,y,z,p]=item.point;ctx.beginPath();ctx.arc(x,y,(item.index%9===0?3:1.5)*p,0,Math.PI*2);ctx.fillStyle=item.index%9===0?'#fa5a28':`rgba(32,37,31,${.25+(2-z)/8})`;ctx.fill();return;}
    ctx.beginPath();item.points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
    if(item.type==='face'){ctx.closePath();ctx.fillStyle=item.color;ctx.fill();ctx.strokeStyle='#ffb388';ctx.lineWidth=1;ctx.stroke();}
    else{ctx.strokeStyle=`rgba(69,80,58,${item.z>0?.2:.45})`;ctx.lineWidth=.8;ctx.stroke();}
  });
}
function resize(){const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
new ResizeObserver(resize).observe(canvas);
function state(){button.textContent=paused?'▶':'Ⅱ';button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',paused?'Reanudar animación':'Pausar animación');}
button.addEventListener('click',()=>{paused=!paused;state();});
reduced.addEventListener('change',()=>{paused=reduced.matches;state();draw();});
canvas.addEventListener('pointerdown',e=>{drag=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(!drag)return;angle+=(e.clientX-drag[0])*.008;tilt=Math.max(-1,Math.min(1,tilt+(e.clientY-drag[1])*.005));drag=[e.clientX,e.clientY];draw();});
function release(){drag=null;}
canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);
document.addEventListener('visibilitychange',()=>{visible=!document.hidden;previous=0;});
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;previous=0;}).observe(canvas);
function frame(now){const delta=previous?Math.min((now-previous)/1000,.05):0;previous=now;if(!paused&&visible&&!drag){angle+=delta*.24;draw();}requestAnimationFrame(frame);}
state();requestAnimationFrame(frame);
