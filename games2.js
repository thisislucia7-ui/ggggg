// ===== 新小遊戲：你畫我猜、消消樂 =====
document.head.insertAdjacentHTML('beforeend',`<style>
.dg-wrap{display:grid;grid-template-columns:minmax(0,1fr);gap:10px;max-width:460px;margin:0 auto;width:100%}
.dg-board{position:relative;background:#fffdf6;border-radius:20px;aspect-ratio:1/1;box-shadow:inset 0 0 0 3px #f0d9cc;overflow:hidden}
.dg-board svg.pic{position:absolute;inset:8%;width:84%;height:84%}
.dg-board svg.pic path,.dg-board svg.pic circle,.dg-board svg.pic ellipse,.dg-board svg.pic rect{fill:none;stroke:#3b2a2a;stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round}
.dg-pet{position:absolute;right:6px;bottom:4px;width:24%}
.dg-pet svg{width:100%;height:auto}
.dg-time{height:10px;border-radius:9px;background:var(--line);overflow:hidden}.dg-time i{display:block;height:100%;background:var(--berry);transition:width .2s linear}
.dg-opts{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.dg-opts button{font-size:18px;min-height:52px;background:var(--card);border:2px solid var(--line)}
.dg-opts button.ok{border-color:var(--mint);background:light-dark(#e8fbf4,#244038)}
.dg-opts button.no{border-color:#e8304a;background:light-dark(#ffeef0,#40242a)}
.m3{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;background:light-dark(#fff4e8,#2a2030);padding:6px;border-radius:18px;max-width:440px;width:100%;margin:0 auto;touch-action:none}
.m3 button{aspect-ratio:1/1;min-height:0;padding:2px;border-radius:12px;background:var(--card);border:2px solid transparent;display:flex;align-items:center;justify-content:center;transition:transform .15s}
.m3 button svg{width:88%;height:88%}
.m3 button.sel{border-color:var(--berry);transform:scale(1.08)}
.m3 button.pop{animation:m3pop .3s forwards}
@keyframes m3pop{to{transform:scale(0);opacity:0}}
.m3 button.drop{animation:m3drop .25s ease-out}
@keyframes m3drop{from{transform:translateY(-60%);opacity:.3}}
.m3 button.bad{animation:shk .1s linear 3}
.m3-combo{text-align:center;font:20px "Huninn",sans-serif;color:var(--berry);min-height:28px}
</style>`);

// 你畫我猜：寵物一筆一筆畫，你來猜（100×100 的原創線稿）
const DRAWS=[
 ['蘋果','<path d="M50 30c-18-10-36 2-34 24 2 22 18 34 34 28 16 6 32-6 34-28 2-22-16-34-34-24z"/><path d="M50 30c0-10 4-16 10-20"/><path d="M54 20c8-6 16-4 18 0-6 4-12 4-18 0z"/>'],
 ['魚','<path d="M14 50c14-18 44-22 62 0-18 22-48 18-62 0z"/><path d="M76 50l16-14v28z"/><circle cx="30" cy="46" r="3"/><path d="M44 40q6 10 0 20"/>'],
 ['房子','<path d="M20 48 50 22l30 26"/><rect x="26" y="46" width="48" height="36"/><rect x="44" y="60" width="12" height="22"/><rect x="30" y="54" width="10" height="10"/>'],
 ['星星','<path d="M50 14l10 24 26 2-20 16 7 26-23-14-23 14 7-26-20-16 26-2z"/>'],
 ['愛心','<path d="M50 80S16 58 16 36a17 17 0 0 1 34-6 17 17 0 0 1 34 6c0 22-34 44-34 44z"/>'],
 ['太陽','<circle cx="50" cy="50" r="16"/><path d="M50 14v12M50 74v12M14 50h12M74 50h12M24 24l9 9M67 67l9 9M76 24l-9 9M33 67l-9 9"/>'],
 ['樹','<path d="M50 84V54"/><path d="M50 58c-26 4-30-20-16-26-4-16 14-24 22-14 10-10 28 0 22 14 14 8 8 30-16 26z"/><path d="M40 84h20"/>'],
 ['雨傘','<path d="M14 52a36 30 0 0 1 72 0c-6-6-12-6-18 0-6-6-12-6-18 0-6-6-12-6-18 0-6-6-12-6-18 0z"/><path d="M50 52v26q0 8-8 8t-8-8"/>'],
 ['杯子','<path d="M24 32h44l-6 48H30z"/><path d="M68 42h8a8 8 0 0 1 0 16h-10"/><path d="M38 14q4 6 0 12M50 12q4 6 0 12"/>'],
 ['花','<circle cx="50" cy="38" r="8"/><circle cx="50" cy="22" r="9"/><circle cx="66" cy="38" r="9"/><circle cx="50" cy="54" r="9"/><circle cx="34" cy="38" r="9"/><path d="M50 62v26M50 76c8-8 16-8 20-6-4 8-12 10-20 6z"/>'],
 ['船','<path d="M14 62h72l-10 18H24z"/><path d="M50 62V16l26 38H50"/><path d="M50 28 30 54h20"/>'],
 ['月亮','<path d="M62 16a34 34 0 1 0 22 52A28 28 0 0 1 62 16z"/>'],
 ['汽車','<path d="M14 64V50l10-4 10-14h30l12 14 10 4v14z"/><circle cx="30" cy="66" r="8"/><circle cx="70" cy="66" r="8"/><path d="M38 34v12M58 34v12"/>'],
 ['冰淇淋','<path d="M32 46l18 40 18-40"/><path d="M30 46c-6-16 8-26 20-22 12-4 26 6 20 22z"/><path d="M40 46l20 20M58 46 46 72"/>'],
 ['雲','<path d="M24 66c-14 0-14-20 0-20-2-14 16-22 26-12 6-12 26-10 26 6 14 0 16 26 0 26z"/>'],
 ['眼鏡','<circle cx="30" cy="54" r="14"/><circle cx="70" cy="54" r="14"/><path d="M44 52q6-6 12 0M16 50 8 42M84 50l8-8"/>'],
 ['鑰匙','<circle cx="28" cy="50" r="14"/><path d="M42 50h44M72 50v12M82 50v8"/>'],
 ['氣球','<ellipse cx="50" cy="38" rx="22" ry="26"/><path d="M46 64h8l-4 6zM50 70q-8 10 2 18"/>']];
function gameDraw(root,sp,done){const ROUNDS=6,DUR=9000;let r=0,score=0,right=0,t0=0,raf,over=false,locked=false;
 root.innerHTML=`<div class="dg-wrap"><div class="g-hud"><span>第 <b id="dgR">1</b> / ${ROUNDS} 題</span><span>分數 <b id="dgS">0</b></span></div>
 <div class="dg-time"><i id="dgT" style="width:100%"></i></div>
 <div class="dg-board"><svg class="pic" id="dgPic" viewBox="0 0 100 100"></svg><div class="dg-pet"><svg viewBox="0 0 200 190">${petSvg(sp,'happy')}</svg></div></div>
 <p class="g-msg" id="dgMsg" style="position:static;color:var(--ink);text-shadow:none;font-size:18px">我在畫畫，猜猜看是什麼？</p>
 <div class="dg-opts" id="dgOpts"></div><p class="small g-tip">越早猜對分數越高，猜錯就直接公布答案。</p></div>`;
 const $$=id=>root.querySelector('#'+id),order=DRAWS.slice().sort(()=>Math.random()-.5).slice(0,ROUNDS);
 function next(){if(r>=ROUNDS)return end();locked=false;const [ans,pic]=order[r];$$('dgR').textContent=r+1;$$('dgMsg').textContent=pick(['我在畫畫，猜猜看是什麼？','嗯……這樣畫對嗎？','快猜快猜！']);
  const svg=$$('dgPic');svg.innerHTML=pic;const parts=[...svg.children];const each=(DUR*.75)/parts.length;
  parts.forEach((el,i)=>{let L=300;try{L=el.getTotalLength()}catch(e){}el.style.strokeDasharray=L;el.style.strokeDashoffset=L;el.style.transition=`stroke-dashoffset ${each/1000}s linear ${i*each/1000}s`;requestAnimationFrame(()=>requestAnimationFrame(()=>{el.style.strokeDashoffset=0}))});
  const wrong=DRAWS.filter(d=>d[0]!==ans).sort(()=>Math.random()-.5).slice(0,3).map(d=>d[0]),opts=[ans,...wrong].sort(()=>Math.random()-.5);
  $$('dgOpts').innerHTML=opts.map(o=>`<button type="button" data-o="${o}">${o}</button>`).join('');t0=performance.now();tick()}
 function tick(){const f=Math.max(0,1-(performance.now()-t0)/DUR);$$('dgT').style.width=f*100+'%';if(f<=0&&!locked){reveal(null);return}if(!locked)raf=requestAnimationFrame(tick)}
 function reveal(pickd){locked=true;cancelAnimationFrame(raf);const ans=order[r][0];$$('dgPic').querySelectorAll('*').forEach(el=>{el.style.transition='stroke-dashoffset .3s';el.style.strokeDashoffset=0});
  root.querySelectorAll('[data-o]').forEach(b=>{if(b.dataset.o===ans)b.classList.add('ok');else if(b.dataset.o===pickd)b.classList.add('no');b.disabled=true});
  if(pickd===ans){const pts=Math.max(20,Math.round(100*(1-(performance.now()-t0)/DUR)));score+=pts;right++;sfx('coin');$$('dgMsg').textContent=`答對了！是「${ans}」，+${pts} 分`}
  else{sfx('pop');$$('dgMsg').textContent=pickd?`不是喔，答案是「${ans}」`:`時間到！答案是「${ans}」`}
  $$('dgS').textContent=score;r++;setTimeout(()=>{if(!over)next()},1500)}
 $$('dgOpts').onclick=e=>{const b=e.target.closest('[data-o]');if(!b||locked)return;reveal(b.dataset.o)};
 function end(){if(over)return;over=true;const win=right>=4;sfx(win?'win':'lose');
  setTimeout(()=>done({win,feeds:1+Math.min(3,Math.floor(score/150)),stars:right>=5?2:right>=3?1:0,msg:`${ROUNDS} 題答對 ${right} 題，得到 ${score} 分`}),500)}
 next();return()=>{over=true;cancelAnimationFrame(raf)}}

// 消消樂：交換相鄰的兩格，排成三個以上就消掉
function gameMatch(root,sp,done){const N=7,MOVES=20,TARGET=600,grp=SP[sp].grp;let g=[],moves=MOVES,score=0,sel=null,busyM=false,over=false;
 const KINDS=6,icon=k=>k<5?foodIcon(grp,k,40):STAR(40);
 root.innerHTML=`<div class="g-hud" style="max-width:440px;margin:0 auto;width:100%"><span>分數 <b id="m3S">0</b> / ${TARGET}</span><span>剩下 <b id="m3M">${MOVES}</b> 步</span></div>
 <div class="m3-combo" id="m3C"></div><div class="m3" id="m3G"></div><p class="small g-tip">點一格，再點旁邊的一格交換位置。三個以上一樣的排成一直線或橫線就會消掉，連鎖消除分數加倍！</p>`;
 const $$=id=>root.querySelector('#'+id);
 const rnd=()=>Math.floor(Math.random()*KINDS);
 for(let y=0;y<N;y++){g.push([]);for(let x=0;x<N;x++){let k;do{k=rnd()}while((x>1&&g[y][x-1]===k&&g[y][x-2]===k)||(y>1&&g[y-1][x]===k&&g[y-2][x]===k));g[y].push(k)}}
 function draw(drop){$$('m3G').innerHTML=g.map((row,y)=>row.map((k,x)=>`<button type="button" data-x="${x}" data-y="${y}" class="${drop&&drop.has(y*N+x)?'drop':''}" aria-label="第${y+1}列第${x+1}格">${k<0?'':icon(k)}</button>`).join('')).join('');$$('m3S').textContent=score;$$('m3M').textContent=moves}
 function matches(){const m=new Set();for(let y=0;y<N;y++)for(let x=0;x<N;x++){const k=g[y][x];if(k<0)continue;
  if(x<N-2&&g[y][x+1]===k&&g[y][x+2]===k){let i=x;while(i<N&&g[y][i]===k)m.add(y*N+i++)}
  if(y<N-2&&g[y+1][x]===k&&g[y+2][x]===k){let j=y;while(j<N&&g[j][x]===k)m.add(j++*N+x)}}return m}
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 async function resolve(){let combo=0,m;while((m=matches()).size){combo++;m.forEach(i=>$$('m3G').children[i]?.classList.add('pop'));sfx('pop');
  score+=m.size*10*combo;$$('m3C').textContent=combo>1?`連鎖 ×${combo}！`:'';await wait(300);
  m.forEach(i=>{g[Math.floor(i/N)][i%N]=-1});const drop=new Set();
  for(let x=0;x<N;x++){let w=N-1;for(let y=N-1;y>=0;y--)if(g[y][x]>=0){if(w!==y){g[w][x]=g[y][x];drop.add(w*N+x)}w--}for(let y=w;y>=0;y--){g[y][x]=rnd();drop.add(y*N+x)}}
  draw(drop);await wait(280)}setTimeout(()=>{$$('m3C').textContent=''},800)}
 $$('m3G').onclick=async e=>{const b=e.target.closest('[data-x]');if(!b||busyM||over)return;const x=+b.dataset.x,y=+b.dataset.y;
  if(!sel){sel={x,y};b.classList.add('sel');sfx('click');return}
  const a=sel;sel=null;if(Math.abs(a.x-x)+Math.abs(a.y-y)!==1){draw();if(!(a.x===x&&a.y===y)){sel={x,y};$$('m3G').children[y*N+x].classList.add('sel')}return}
  busyM=true;[g[a.y][a.x],g[y][x]]=[g[y][x],g[a.y][a.x]];draw();
  if(!matches().size){[g[a.y][a.x],g[y][x]]=[g[y][x],g[a.y][a.x]];await wait(150);draw();[$$('m3G').children[a.y*N+a.x],$$('m3G').children[y*N+x]].forEach(c=>c&&c.classList.add('bad'));sfx('hit');busyM=false;return}
  moves--;await resolve();draw();busyM=false;
  if(score>=TARGET||moves<=0)end()};
 function end(){if(over)return;over=true;const win=score>=TARGET;sfx(win?'win':'lose');
  setTimeout(()=>done({win,feeds:1+Math.min(3,Math.floor(score/300)),stars:score>=TARGET?2:score>=300?1:0,msg:win?`達成目標！得到 ${score} 分`:`得到 ${score} 分，再接再厲！`}),600)}
 draw();return()=>{over=true}}

GAMES.push(
 {id:'draw',n:'你畫我猜',d:'寵物一筆一筆畫，你來猜是什麼！越早猜對分數越高。',fn:gameDraw,reward:'飼料 ×1～4、星星最多 ×2'},
 {id:'match',n:'消消樂',d:'交換相鄰的格子，三個以上一樣就消掉，連鎖分數加倍！',fn:gameMatch,reward:'飼料 ×1～4、星星最多 ×2'});
ART.draw=()=>`<div class="art" style="background:#fffdf6"><svg viewBox="0 0 100 100" style="height:90%"><g fill="none" stroke="#3b2a2a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M50 30c-18-10-36 2-34 24 2 22 18 34 34 28 16 6 32-6 34-28 2-22-16-34-34-24z"/><path d="M50 30c0-10 4-16 10-20"/></g><text x="70" y="96" font-size="26" fill="#e8507a" font-weight="700">?</text></svg></div>`;
ART.match=()=>{const grp=P()?SP[P().sp].grp:'cat';return `<div class="art" style="background:linear-gradient(#fff4e8,#ffe4cf)"><div style="display:grid;grid-template-columns:repeat(3,28px);gap:4px">${[0,1,2,3,0,4,0,2,1].map(k=>`<div style="background:#fff;border-radius:8px;width:28px;height:28px;display:flex;align-items:center;justify-content:center">${foodIcon(grp,k,22)}</div>`).join('')}</div></div>`};
