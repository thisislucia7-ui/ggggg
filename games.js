// ===== 三個小遊戲：魔王PK、冒險跑跑、射泡泡（泡泡龍玩法） =====
// 每個遊戲 (root, sp, done) => stop；done({win, feeds, stars, msg})
function petImg(sp,e){const i=new Image();i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 190">${petSvg(sp,e||'happy')}</svg>`);return i}
function fitCanvas(cv,w,h){const d=Math.min(2,window.devicePixelRatio||1);cv.width=w*d;cv.height=h*d;cv.style.width=w+'px';cv.style.height=h+'px';const x=cv.getContext('2d');x.setTransform(d,0,0,d,0,0);return x}
const heartsHtml=(n,max)=>Array.from({length:max},(_,i)=>`<svg width="22" height="20" viewBox="0 0 26 24" aria-hidden="true"><path d="M13 23S1 15 1 7a6 6 0 0 1 12-2 6 6 0 0 1 12 2c0 8-12 16-12 16z" fill="${i<n?'#e8507a':'#d8c8c8'}"/></svg>`).join('');

const BOSS_SVG=`<svg viewBox="0 0 200 190" aria-label="噗噗大魔王"><ellipse cx="100" cy="182" rx="74" ry="8" fill="#000" opacity=".15"/>
<path d="M58 44 44 6 78 34zM142 44 156 6 122 34z" fill="#ffd23f" stroke="#c99a10" stroke-width="3" stroke-linejoin="round"/>
<path d="M80 30l8-14 12 10 12-10 8 14z" fill="#ffd23f" stroke="#c99a10" stroke-width="3" stroke-linejoin="round"/>
<path d="M100 28c54 0 86 40 86 90 0 34-18 56-38 62-8-10-16-10-24 0-8-10-16-10-24 0-8-10-16-10-24 0-8-10-16-10-24 0-20-6-38-28-38-62 0-50 32-90 86-90z" fill="#6a4a9c"/>
<path d="M30 130c6 22 20 38 34 44 8-8 16-8 24 0 8-8 16-8 24 0 8-8 16-8 24 0 14-6 28-22 34-44-14 24-46 34-70 34s-56-10-70-34z" fill="#553a80"/>
<path d="M56 58c12-12 28-18 44-18" stroke="#9a7ad0" stroke-width="7" stroke-linecap="round" fill="none"/>
<path d="M54 80l34 12M146 80l-34 12" stroke="#2a1840" stroke-width="7" stroke-linecap="round"/>
<ellipse cx="72" cy="102" rx="14" ry="12" fill="#fff"/><ellipse cx="128" cy="102" rx="14" ry="12" fill="#fff"/><circle cx="76" cy="104" r="6" fill="#e8304a"/><circle cx="124" cy="104" r="6" fill="#e8304a"/>
<path d="M66 132q34 22 68 0q-34 12-68 0z" fill="#2a1840"/><path d="M78 136l5 9 5-8zM112 136l5 8 5-9z" fill="#fff"/></svg>`;

function gameBoss(root,sp,done){
 let hp=100,hearts=3,round=0,phase='attack',pos=0,dir=1,speed=.85,raf,last=performance.now(),dodgeT=0,timer,hurt=0,over=false;
 root.innerHTML=`<div class="g-hud"><span>你的愛心 <span id="bH">${heartsHtml(3,3)}</span></span><span class="g-boss">噗噗大魔王 <span class="g-hp"><i id="bHp"></i></span></span></div>
 <div class="arena" id="bArena"><div class="b-pet" id="bPet"><svg viewBox="0 0 200 190">${petSvg(sp,'calm')}</svg></div><div class="b-boss" id="bBoss">${BOSS_SVG}<b class="b-alert" id="bAlert">！</b></div><div class="g-msg" id="bMsg">準備開打！</div></div>
 <div class="timing" id="bTiming"><span class="z-good"></span><span class="z-perfect"></span><i id="bMark"></i></div>
 <button class="big g-btn" id="bBtn">攻擊！</button>
 <p class="small g-tip">指針停在中間金色區時按「攻擊」傷害最高。魔王頭上冒出「！」時，馬上按「閃避」。</p>`;
 const $=id=>root.querySelector('#'+id),pet=$('bPet'),boss=$('bBoss');
 const msg=t=>{$('bMsg').textContent=t;$('bMsg').classList.remove('pop');void $('bMsg').offsetWidth;$('bMsg').classList.add('pop')};
 const anim=(el,c)=>{el.classList.remove(c);void el.offsetWidth;el.classList.add(c)};
 function loop(t){const dt=Math.min(.05,(t-last)/1000);last=t;
  if(phase==='attack'){pos+=dir*speed*dt;if(pos>1){pos=1;dir=-1}if(pos<0){pos=0;dir=1}$('bMark').style.left=(pos*100)+'%'}
  raf=requestAnimationFrame(loop)}
 raf=requestAnimationFrame(loop);
 function charge(){phase='charge';$('bBtn').textContent='閃避！';$('bTiming').classList.add('off');msg('魔王在蓄力……');
  timer=setTimeout(()=>{phase='dodge';dodgeT=performance.now();$('bAlert').classList.add('on');anim(boss,'b-charge');
   timer=setTimeout(()=>{if(phase==='dodge')hit('來不及閃！')},Math.max(380,760-round*55))},900+Math.random()*1400)}
 function hit(t){phase='wait';$('bAlert').classList.remove('on');sfx('hit');hearts--;hurt++;anim(boss,'b-lunge');anim(pet,'b-hurt');$('bH').innerHTML=heartsHtml(hearts,3);msg(t);
  if(hearts<=0)return finish(false);timer=setTimeout(next,1000)}
 function next(){round++;speed+=.17;phase='attack';$('bBtn').textContent='攻擊！';$('bTiming').classList.remove('off');msg(`第 ${round+1} 回合：瞄準！`)}
 function press(){if(over)return;
  if(phase==='attack'){const d=Math.abs(pos-.5);const dmg=d<.07?25:d<.2?14:6;phase='wait';sfx('swoosh');
   anim(pet,'b-atk');setTimeout(()=>{anim(boss,'b-shake');sfx('pop')},220);hp=Math.max(0,hp-dmg);$('bHp').style.width=hp+'%';
   msg(dmg===25?`完美一擊！-${dmg}`:dmg===14?`打中了！-${dmg}`:`擦過去… -${dmg}`);
   if(hp<=0){timer=setTimeout(()=>finish(true),700);return}timer=setTimeout(charge,900)}
  else if(phase==='charge'){clearTimeout(timer);hit('太早閃了，被打到！')}
  else if(phase==='dodge'){clearTimeout(timer);phase='wait';$('bAlert').classList.remove('on');anim(pet,'b-dodge');sfx('jump');anim(boss,'b-lunge');msg('漂亮閃開！');timer=setTimeout(next,1000)}}
 function finish(win){over=true;phase='end';cancelAnimationFrame(raf);sfx(win?'win':'lose');
  if(win)anim(boss,'b-defeat');setTimeout(()=>done(win?{win,feeds:4+(hurt===0?1:0),stars:3,msg:hurt===0?'毫髮無傷打倒大魔王！':'打倒大魔王了！'}:{win,feeds:1,stars:hp<=50?1:0,msg:'差一點點！下次再來挑戰。'}),900)}
 $('bBtn').onclick=press;const key=e=>{if(e.code==='Space'||e.key==='Enter'){e.preventDefault();press()}};addEventListener('keydown',key);
 return()=>{over=true;cancelAnimationFrame(raf);clearTimeout(timer);removeEventListener('keydown',key)}}

function gameRun(root,sp,done){
 root.innerHTML=`<div class="g-hud"><span id="rH">${heartsHtml(3,3)}</span><span>果實 <b id="rC">0</b></span><span class="g-prog"><i id="rP"></i></span></div>
 <canvas class="g-cv" id="rCv"></canvas><button class="big g-btn" id="rBtn">跳！</button><p class="small g-tip">點畫面、按按鈕或空白鍵跳躍，空中可以再跳一次。撿果實、躲開石頭和樹樁，走到終點的寶箱！</p>`;
 const cv=root.querySelector('#rCv'),W=Math.min(root.clientWidth||600,760),H=280,ctx=fitCanvas(cv,W,H),img=petImg(sp,'happy');
 const G=H-46,PX=60,PS=64,GOAL=9000;
 let y=G,vy=0,jumps=0,speed=250,dist=0,obs=[],items=[],lives=3,inv=0,col=0,nextO=500,nextI=260,raf,last=performance.now(),over=false,t=0,goalX=null;
 function jump(){if(over)return;if(jumps<2){sfx('jump');vy=jumps?-520:-640;jumps++}}
 function spawnO(){const k=Math.random();const o=k<.35?{k:'rock',w:40,h:30}:k<.6?{k:'log',w:58,h:26}:k<.82?{k:'bush',w:46,h:40}:{k:'stump',w:30,h:66};o.x=W+20;obs.push(o)}
 function spawnI(){const base=40+Math.random()*90;for(let i=0;i<3;i++)items.push({x:W+20+i*34,y:G-base-Math.sin(i/2*Math.PI)*24,got:0})}
 function end(win){if(over)return;over=true;cancelAnimationFrame(raf);sfx(win?'win':'lose');
  setTimeout(()=>done({win,feeds:1+Math.min(3,Math.floor(col/5)),stars:win?2:dist>GOAL/2?1:0,msg:win?`走到終點了！撿到 ${col} 顆果實`:`冒險暫停在 ${Math.round(dist/GOAL*100)}%，撿到 ${col} 顆果實`}),600)}
 function step(dt){t+=dt;dist+=speed*dt;speed=250+dist/GOAL*150;
  if(dist>=nextO&&dist<GOAL-500){spawnO();nextO=dist+300+Math.random()*360+speed*.3}
  if(dist>=nextI&&dist<GOAL-500){spawnI();nextI=dist+380+Math.random()*480}
  for(const o of obs)o.x-=speed*dt;for(const i of items)i.x-=speed*dt;
  obs=obs.filter(o=>o.x>-80);items=items.filter(i=>i.x>-30&&!i.got);
  vy+=2000*dt;y+=vy*dt;if(y>=G){y=G;vy=0;jumps=0}
  if(inv>0)inv-=dt;
  const px1=PX+14,px2=PX+PS-14,py1=y-PS*.75,py2=y-4;
  for(const o of obs){if(inv<=0&&px2>o.x+6&&px1<o.x+o.w-6&&py2>G-o.h+6){lives--;inv=1.3;sfx('hit');root.querySelector('#rH').innerHTML=heartsHtml(lives,3);if(lives<=0)end(false)}}
  for(const i of items){if(Math.hypot(i.x-(PX+PS/2),i.y-(y-PS/2))<34){i.got=1;col++;sfx('coin');root.querySelector('#rC').textContent=col}}
  root.querySelector('#rP').style.width=Math.min(100,dist/GOAL*100)+'%';
  goalX=GOAL-dist<W?PX+PS+(GOAL-dist):null;if(dist>=GOAL+20)end(true)}
 function draw(){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#9fd8f5');g.addColorStop(1,'#e8f7ff');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#fff6b8';ctx.beginPath();ctx.arc(W-60,50,24,0,7);ctx.fill();
  const hill=(sp2,amp,base,col2)=>{ctx.fillStyle=col2;ctx.beginPath();ctx.moveTo(0,H);for(let x=0;x<=W;x+=10)ctx.lineTo(x,base-amp*Math.sin((x+dist*sp2)/90)*Math.cos((x+dist*sp2)/210));ctx.lineTo(W,H);ctx.fill()};
  hill(.2,26,G-50,'#bfe6c4');hill(.5,18,G-20,'#9fd6a2');
  ctx.fillStyle='#e8b27a';ctx.fillRect(0,G,W,H-G);ctx.fillStyle='#8fcf6a';ctx.fillRect(0,G,W,10);
  ctx.fillStyle='#d49a62';for(let x=-(dist%60);x<W;x+=60)ctx.fillRect(x,G+24,26,5);
  for(const o of obs){const top=G-o.h;
   if(o.k==='rock'){ctx.fillStyle='#9a9aa8';ctx.beginPath();ctx.ellipse(o.x+o.w/2,G-o.h/2+2,o.w/2,o.h/2+2,0,0,7);ctx.fill();ctx.fillStyle='#b8b8c4';ctx.beginPath();ctx.ellipse(o.x+o.w/2-6,G-o.h/2-4,8,5,0,0,7);ctx.fill()}
   if(o.k==='log'){ctx.fillStyle='#a8643a';ctx.fillRect(o.x,top,o.w,o.h);ctx.fillStyle='#e8b27a';ctx.beginPath();ctx.ellipse(o.x+o.w,top+o.h/2,7,o.h/2,0,0,7);ctx.fill()}
   if(o.k==='bush'){ctx.fillStyle='#4fa85a';[[.25,.6,.32],[.6,.55,.36],[.45,.3,.3]].forEach(([a,b,r])=>{ctx.beginPath();ctx.arc(o.x+o.w*a,top+o.h*b,o.w*r,0,7);ctx.fill()});ctx.fillStyle='#e8455f';ctx.beginPath();ctx.arc(o.x+o.w*.6,top+o.h*.4,3,0,7);ctx.fill()}
   if(o.k==='stump'){ctx.fillStyle='#8a5634';ctx.fillRect(o.x,top,o.w,o.h);ctx.fillStyle='#d9a06a';ctx.beginPath();ctx.ellipse(o.x+o.w/2,top,o.w/2,6,0,0,7);ctx.fill()}}
  for(const i of items){ctx.fillStyle='#ff6b8a';ctx.beginPath();ctx.arc(i.x,i.y+Math.sin(t*6+i.x/30)*3,9,0,7);ctx.fill();ctx.fillStyle='#5fb04a';ctx.fillRect(i.x-1,i.y-13,3,6);ctx.fillStyle='#fff';ctx.globalAlpha=.7;ctx.beginPath();ctx.arc(i.x-3,i.y-3,2.5,0,7);ctx.fill();ctx.globalAlpha=1}
  if(goalX!==null){ctx.fillStyle='#6b4a2a';ctx.fillRect(goalX,G-90,5,90);ctx.fillStyle='#e8507a';ctx.beginPath();ctx.moveTo(goalX+5,G-90);ctx.lineTo(goalX+44,G-78);ctx.lineTo(goalX+5,G-66);ctx.fill();ctx.fillStyle='#c98a4b';ctx.fillRect(goalX+20,G-28,40,28);ctx.fillStyle='#ffd23f';ctx.fillRect(goalX+20,G-30,40,8);ctx.fillRect(goalX+36,G-22,8,10)}
  if(!(inv>0&&Math.floor(t*12)%2)){ctx.save();ctx.translate(PX+PS/2,y);ctx.rotate(y<G?Math.sin(t*10)*.08:0);const sq=y<G?1:1+Math.sin(t*16)*.04;ctx.scale(1/sq,sq);if(img.complete)ctx.drawImage(img,-PS/2,-PS*.95,PS,PS*.95);ctx.restore()}}
 function loop(now){const dt=Math.min(.033,(now-last)/1000);last=now;if(!over)step(dt);draw();if(!over)raf=requestAnimationFrame(loop)}
 raf=requestAnimationFrame(loop);
 cv.onpointerdown=e=>{e.preventDefault();jump()};root.querySelector('#rBtn').onclick=jump;
 const key=e=>{if(e.code==='Space'||e.key==='ArrowUp'){e.preventDefault();jump()}};addEventListener('keydown',key);
 return()=>{over=true;cancelAnimationFrame(raf);removeEventListener('keydown',key)}}

function gameBubble(root,sp,done){
 const COLS=8,COLORS=['#ff7c9c','#ffc94a','#5fc9ae','#7aa8ff','#b58cff'],MAXS=40;
 root.innerHTML=`<div class="g-hud"><span>分數 <b id="pS">0</b></span><span>剩餘 <b id="pN">${MAXS}</b> 發</span></div>
 <canvas class="g-cv bub" id="pCv"></canvas><p class="small g-tip">移動手指或滑鼠瞄準，放開／點一下發射；鍵盤用左右鍵瞄準、空白鍵發射。三顆同色會破掉，懸空的泡泡會一起掉下來。每 8 發天花板會往下壓喔！</p>`;
 const cv=root.querySelector('#pCv'),W=Math.min(root.clientWidth||420,440),R=W/(COLS*2),RH=R*Math.sqrt(3),H=Math.round(W*1.4),ctx=fitCanvas(cv,W,H),img=petImg(sp,'happy');
 const SX=W/2,SY=H-R*2.2,DEAD=SY-R*2.6,ROWS=Math.ceil((DEAD)/RH)+1;
 let top=0,grid=[],ang=Math.PI/2,cur,nxt,ball=null,shots=0,score=0,over=false,raf,last=performance.now(),parts=[],float=[];
 const ncols=r=>r%2?COLS-1:COLS,cxy=(r,c)=>[R+c*2*R+(r%2?R:0),top+R+r*RH];
 for(let r=0;r<ROWS;r++)grid.push(Array(ncols(r)).fill(-1));
 for(let r=0;r<5;r++)for(let c=0;c<ncols(r);c++)grid[r][c]=Math.floor(Math.random()*COLORS.length);
 const present=()=>{const s=new Set();grid.forEach(row=>row.forEach(v=>v>=0&&s.add(v)));return [...s]};
 const pickC=()=>{const p=present();return p.length?p[Math.floor(Math.random()*p.length)]:0};
 cur=pickC();nxt=pickC();
 const nb=(r,c)=>{const o=r%2?[[-1,0],[-1,1],[0,-1],[0,1],[1,0],[1,1]]:[[-1,-1],[-1,0],[0,-1],[0,1],[1,-1],[1,0]];return o.map(([a,b])=>[r+a,c+b]).filter(([a,b])=>a>=0&&a<ROWS&&b>=0&&b<ncols(a))};
 function shoot(){if(over||ball)return;sfx('swoosh');ball={x:SX,y:SY,vx:Math.cos(ang)*1000,vy:-Math.sin(ang)*1000,c:cur};cur=nxt;nxt=pickC()}
 function snap(){let best=null,bd=1e9;
  for(let r=0;r<ROWS;r++)for(let c=0;c<ncols(r);c++){if(grid[r][c]>=0)continue;if(r>0&&!nb(r,c).some(([a,b])=>grid[a][b]>=0))continue;const [x,y]=cxy(r,c),d=Math.hypot(x-ball.x,y-ball.y);if(d<bd){bd=d;best=[r,c]}}
  const col=ball.c;ball=null;if(!best)return end();const [r,c]=best;grid[r][c]=col;
  const seen=new Set([r+','+c]),q=[[r,c]],grp=[];while(q.length){const [a,b]=q.pop();grp.push([a,b]);for(const [x,y] of nb(a,b)){const k=x+','+y;if(!seen.has(k)&&grid[x][y]===col){seen.add(k);q.push([x,y])}}}
  if(grp.length>=3){sfx('pop');grp.forEach(([a,b])=>{pop(a,b,0)});score+=grp.length*10;
   const keep=new Set(),q2=[];grid[0].forEach((v,b)=>{if(v>=0){keep.add('0,'+b);q2.push([0,b])}});
   while(q2.length){const [a,b]=q2.pop();for(const [x,y] of nb(a,b)){const k=x+','+y;if(!keep.has(k)&&grid[x][y]>=0){keep.add(k);q2.push([x,y])}}}
   let drop=0;for(let a=0;a<ROWS;a++)for(let b=0;b<ncols(a);b++)if(grid[a][b]>=0&&!keep.has(a+','+b)){pop(a,b,1);drop++}
   score+=drop*20;const [fx,fy]=cxy(r,c);float.push({x:fx,y:fy,t:1,s:'+'+(grp.length*10+drop*20)})}
  shots++;if(shots%8===0)top+=RH;
  root.querySelector('#pS').textContent=score;root.querySelector('#pN').textContent=MAXS-shots;
  if(!present().length)return end(true);
  for(let a=0;a<ROWS;a++)for(let b=0;b<ncols(a);b++)if(grid[a][b]>=0&&cxy(a,b)[1]+R>DEAD)return end(false);
  if(shots>=MAXS)end(false);
  if(!present().includes(cur))cur=pickC();if(!present().includes(nxt))nxt=pickC()}
 function pop(r,c,fall){const [x,y]=cxy(r,c);parts.push({x,y,vx:(Math.random()-.5)*120,vy:fall?-60:-160*Math.random(),c:grid[r][c],t:1,fall});grid[r][c]=-1}
 function end(win){if(over)return;over=true;sfx(win?'win':'lose');
  setTimeout(()=>{cancelAnimationFrame(raf);done(win?{win:true,feeds:3,stars:3,msg:`全部清光光！得到 ${score} 分`}:{win:false,feeds:1+Math.min(2,Math.floor(score/200)),stars:score>=300?2:score>=120?1:0,msg:`得到 ${score} 分`})},800)}
 function bubble(x,y,c,r,a){ctx.globalAlpha=a??1;const g=ctx.createRadialGradient(x-r*.35,y-r*.35,r*.1,x,y,r);g.addColorStop(0,'#fff');g.addColorStop(.25,COLORS[c]);g.addColorStop(1,mix(COLORS[c],'#000000',.15));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r-1,0,7);ctx.fill();
  ctx.fillStyle='#2e2320';ctx.beginPath();ctx.arc(x-r*.28,y+r*.05,r*.1,0,7);ctx.arc(x+r*.28,y+r*.05,r*.1,0,7);ctx.fill();ctx.strokeStyle='#2e2320';ctx.lineWidth=Math.max(1.2,r*.08);ctx.beginPath();ctx.arc(x,y+r*.18,r*.16,.2,Math.PI-.2);ctx.stroke();ctx.globalAlpha=1}
 function step(dt){if(ball){const n=Math.ceil(Math.hypot(ball.vx,ball.vy)*dt/4);for(let i=0;i<n&&ball;i++){ball.x+=ball.vx*dt/n;ball.y+=ball.vy*dt/n;
   if(ball.x<R){ball.x=R;ball.vx*=-1}if(ball.x>W-R){ball.x=W-R;ball.vx*=-1}
   if(ball.y-R<=top){snap();break}
   let hit=false;for(let r=0;r<ROWS&&!hit;r++)for(let c=0;c<ncols(r);c++)if(grid[r][c]>=0){const [x,y]=cxy(r,c);if(Math.hypot(x-ball.x,y-ball.y)<R*1.8){hit=true;break}}
   if(hit)snap()}}
  parts.forEach(p=>{p.t-=dt*(p.fall?.8:2.4);p.x+=p.vx*dt;p.vy+=(p.fall?900:300)*dt;p.y+=p.vy*dt});parts=parts.filter(p=>p.t>0);
  float.forEach(f=>{f.t-=dt;f.y-=40*dt});float=float.filter(f=>f.t>0)}
 function draw(){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#fff0f6');g.addColorStop(1,'#e6f4ff');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  if(top>0){ctx.fillStyle='#c8a0e0';ctx.fillRect(0,0,W,top);ctx.fillStyle='#b088d0';for(let x=0;x<W;x+=24)ctx.fillRect(x,top-6,12,6)}
  ctx.strokeStyle='#e8507a';ctx.setLineDash([6,6]);ctx.globalAlpha=.4;ctx.beginPath();ctx.moveTo(0,DEAD);ctx.lineTo(W,DEAD);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
  for(let r=0;r<ROWS;r++)for(let c=0;c<ncols(r);c++)if(grid[r][c]>=0){const [x,y]=cxy(r,c);bubble(x,y,grid[r][c],R)}
  if(!ball&&!over){ctx.fillStyle='#8a6f68';let x=SX,y=SY,dx=Math.cos(ang),dy=-Math.sin(ang);for(let i=0;i<34;i++){x+=dx*14;y+=dy*14;if(x<R||x>W-R){dx*=-1;x=Math.max(R,Math.min(W-R,x))}if(y<top+R)break;ctx.globalAlpha=1-i/36;ctx.beginPath();ctx.arc(x,y,2.6,0,7);ctx.fill()}ctx.globalAlpha=1}
  ctx.fillStyle='#e8d8ee';ctx.beginPath();ctx.ellipse(SX,SY+R*.8,R*1.8,R*.7,0,0,7);ctx.fill();
  if(ball)bubble(ball.x,ball.y,ball.c,R);if(!over||ball)bubble(SX,SY,cur,R);
  ctx.fillStyle='#8a6f68';ctx.font=`13px "Chiron GoRound TC",sans-serif`;ctx.fillText('下一顆',8,H-R*2.6);bubble(R+10,H-R*1.3,nxt,R*.75);
  if(img.complete){const s=R*3.4;ctx.drawImage(img,W-s-6,H-s*.95-4,s,s*.95)}
  parts.forEach(p=>bubble(p.x,p.y,p.c,R*(p.fall?1:1+(1-p.t)*.6),Math.max(0,p.t)));
  ctx.fillStyle='#e8507a';ctx.font=`bold 18px "Chiron GoRound TC",sans-serif`;float.forEach(f=>{ctx.globalAlpha=f.t;ctx.fillText(f.s,f.x-14,f.y)});ctx.globalAlpha=1}
 function loop(now){const dt=Math.min(.033,(now-last)/1000);last=now;step(dt);draw();if(!over||parts.length)raf=requestAnimationFrame(loop)}
 raf=requestAnimationFrame(loop);
 const aim=e=>{const b=cv.getBoundingClientRect(),x=(e.clientX-b.left)*(W/b.width),y=(e.clientY-b.top)*(H/b.height);let a=Math.atan2(SY-y,x-SX);if(a<0)a=x<SX?Math.PI-.15:.15;ang=Math.max(.15,Math.min(Math.PI-.15,a))};
 cv.onpointermove=aim;cv.onpointerdown=e=>{e.preventDefault();aim(e)};cv.onpointerup=e=>{aim(e);shoot()};
 const key=e=>{if(e.key==='ArrowLeft'){ang=Math.min(Math.PI-.15,ang+.06);e.preventDefault()}if(e.key==='ArrowRight'){ang=Math.max(.15,ang-.06);e.preventDefault()}if(e.code==='Space'){e.preventDefault();shoot()}};addEventListener('keydown',key);
 return()=>{over=true;cancelAnimationFrame(raf);removeEventListener('keydown',key)}}

const GAMES=[
 {id:'boss',n:'挑戰大魔王',d:'看準時機攻擊、閃避，打倒噗噗大魔王！飼料獎勵最多。',fn:gameBoss,reward:'勝利：飼料 ×4～5、星星 ×3'},
 {id:'run',n:'跟著小動物去冒險',d:'跳過石頭與樹樁，沿路撿果實，走到終點的寶箱。',fn:gameRun,reward:'飼料 ×1～4、星星最多 ×2'},
 {id:'bubble',n:'射泡泡',d:'泡泡龍玩法：三顆同色就會破掉，清光全部泡泡！',fn:gameBubble,reward:'飼料 ×1～3、星星最多 ×3'}];
