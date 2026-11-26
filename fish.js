// ===== 垂釣湖：買釣竿和魚餌、釣魚小遊戲、賣魚換金幣、約好友一起釣 =====
const RODS={bamboo:{n:'竹釣竿',p:150,zone:24,luck:0},carbon:{n:'碳纖維釣竿',p:600,zone:31,luck:1},gold:{n:'黃金釣竿',p:2000,zone:38,luck:2}};
const BAITS={bread:{n:'麵包屑',p:30,luck:0},worm:{n:'蚯蚓',p:60,luck:1},shrimp:{n:'鮮蝦',p:120,luck:2},magic:{n:'魔法魚餌',p:300,luck:3}};
const BAIT_PACK=5;
// 魚：名字、價錢、稀有度（0 普通～4 傳說）、速度、顏色
const FISH=[
 ['boot','舊靴子',1,0,.2,'#8a6a4a'],['can','空罐子',1,0,.2,'#9aa8ba'],
 ['fry','小魚苗',6,0,.5,'#cfe3f3'],['tilapia','吳郭魚',15,0,.7,'#8a9a7a'],['crucian','鯽魚',20,0,.8,'#b0a070'],
 ['sweetfish','香魚',45,1,1,'#9fc8d8'],['carp','鯉魚',40,1,.9,'#d8a050'],['catfish','鯰魚',60,1,1.1,'#6a6a5a'],
 ['bass','鱸魚',100,2,1.3,'#7a9a8a'],['trout','虹鱒',85,2,1.25,'#e8a0a8'],['puffer','河豚',120,2,1.4,'#e8d070'],
 ['koi','錦鯉',160,3,1.5,'#ff8a5a'],['bigtrout','大鱒魚',220,3,1.6,'#c88a9a'],
 ['goldkoi','金錦鯉',520,4,1.9,'#ffc94a'],['lakebaby','湖怪寶寶',1000,4,2.1,'#7ad0b8']].map(([id,n,p,r,sp,c])=>({id,n,p,r,sp,c}));
const RARN=['普通','普通','少見','稀有','傳說'],RARC=['#8a8a8a','#8a8a8a','#2a9a5c','#3a7ae0','#c87a00'];
const fishSvg=(f,w)=>f.id==='boot'?`<svg viewBox="0 0 60 40" width="${w}"><path d="M14 4h16v20l18 4q6 2 4 10H10z" fill="${f.c}"/></svg>`:f.id==='can'?`<svg viewBox="0 0 60 40" width="${w}"><rect x="10" y="10" width="40" height="22" rx="5" fill="${f.c}" transform="rotate(-12 30 20)"/></svg>`
 :`<svg viewBox="0 0 60 40" width="${w}"><path d="M8 20q14-16 34-8l12-8v32l-12-8q-20 8-34-8z" fill="${f.c}"/><circle cx="16" cy="18" r="2.6" fill="#2e2320"/>${f.r>=3?'<path d="M24 8l3-6 3 6" fill="#ffe08a"/>':''}${f.r>=4?'<circle cx="30" cy="20" r="3" fill="#fff" opacity=".7"/>':''}</svg>`;
function fishSt(){if(!S.fish)S.fish={rods:[],rod:'',bait:{},sel:'',bag:[],log:{},caught:0};return S.fish}
document.head.insertAdjacentHTML('beforeend',`<style>
.lake{position:relative;height:230px;border-radius:22px;overflow:hidden;background:linear-gradient(#bfe6ff 0 28%,#8fd08a 28% 36%,#5aa8e0 36% 100%)}
.lake .wave{position:absolute;left:0;right:0;height:3px;background:#ffffff66;border-radius:3px;animation:lw 3s ease-in-out infinite}
@keyframes lw{50%{transform:translateX(12px)}}
.lake .dock{position:absolute;left:0;bottom:0;width:34%;height:30%;background:#c98a4b;border-top:6px solid #a8643a}
.lake .me{position:absolute;left:4%;bottom:24%;width:26%;max-width:110px}
.lake .pal{position:absolute;bottom:26%;width:16%;max-width:70px;text-align:center;font-size:11px}
.lake .pal span{background:#fff;border-radius:8px;padding:0 4px;white-space:nowrap}
.lake .line{position:absolute;left:24%;bottom:56%;height:2px;background:#fff;transform-origin:left center}
.lake .bob{position:absolute;width:16px;height:16px;border-radius:50%;background:linear-gradient(#e8304a 50%,#fff 50%);translate:-50% -50%;transition:left .6s ease-out,top .6s ease-out}
.lake .bob.bite{animation:bite .25s ease-in-out infinite}
@keyframes bite{50%{transform:translateY(7px)}}
.lake .bang{position:absolute;font:700 22px "Huninn",sans-serif;color:#fff;text-shadow:0 2px 6px #0006;translate:-50% -150%}
.reel{position:relative;height:40px;border-radius:14px;background:#e3f4ff;box-shadow:inset 0 0 0 3px #bfe2f7;overflow:hidden}
.reel .zone{position:absolute;top:3px;bottom:3px;border-radius:10px;background:#9fe0b8aa;border:2px solid #3cc47c}
.reel .fsh{position:absolute;top:4px;translate:-50% 0}
.prog{height:10px;border-radius:99px;background:var(--line);overflow:hidden}.prog i{display:block;height:100%;background:#3cc47c}
.fgridS{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:8px}
.fitem{background:var(--bg);border-radius:14px;padding:8px;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:13px;text-align:center;min-height:0;border:2px solid transparent}
.fitem.on{border-color:var(--berry)}.fitem em{font-style:normal;font-size:12px;color:var(--mute)}
.ftabs{display:flex;gap:6px;overflow-x:auto}.ftabs button{flex:none;min-height:34px;padding:2px 14px;font-size:14px;border-radius:99px;background:transparent;border:2px solid var(--line)}.ftabs button[aria-pressed=true]{border-color:var(--berry);color:var(--berry);font-weight:700}
.fishfeed{font-size:13px;background:var(--bg);border-radius:12px;padding:6px 10px;max-height:80px;overflow:auto}.fishfeed p{margin:2px 0}
</style>`);
let fTab='lake',fGame=null;
const atLake=()=>S.friends?(S.friends||[]).filter(id=>typeof isOnline==='function'&&isOnline(id)&&LIVE.docs[id]&&LIVE.docs[id].at==='lake'):[];
const palBonus=()=>Math.min(3,atLake().length)*.1;
function openFish(tab){$('ovMenu').classList.remove('on');if(!P()){openAdopt('first');return}fTab=tab||fTab;$('ovGame').classList.add('on');playing=true;$('gTitle').textContent='垂釣湖';
 if(typeof livePut==='function')livePut({at:'lake'});renderFish()}
function fishLeave(){if(fGame){fGame.stop();fGame=null}if(typeof livePut==='function'&&LIVE.me&&LIVE.me.at)livePut({at:null})}
const _cgF=closeGames;closeGames=function(){fishLeave();return _cgF()};$('gExit').onclick=()=>closeGames();
function renderFish(){const F=fishSt();if(!$('ovGame').classList.contains('on'))return;
 const tabs=[['lake','釣魚'],['shop','釣具店'],['bag',`魚簍（${F.bag.length}）`],['book','圖鑑']];
 let body='';
 if(fTab==='lake')body=lakeHtml();
 if(fTab==='shop')body=`<p class="small" style="margin:0">${COIN(14)} ${S.coins}・釣竿買一次可以一直用；魚餌每包 ${BAIT_PACK} 個，每拋一次竿用掉 1 個。</p>
  <h3 style="margin:4px 0">釣竿</h3><div class="fgridS">${Object.entries(RODS).map(([id,r])=>{const own=F.rods.includes(id);return `<button type="button" class="fitem ${F.rod===id?'on':''}" data-rod="${id}">${rodSvg(id)}${r.n}<em>判定區 ${r.zone}%・好運 +${r.luck}</em><em>${own?(F.rod===id?'使用中':'換這支'):`${COIN(12)} ${r.p}`}</em></button>`}).join('')}</div>
  <h3 style="margin:4px 0">魚餌</h3><div class="fgridS">${Object.entries(BAITS).map(([id,b])=>`<button type="button" class="fitem ${F.sel===id?'on':''}" data-bait="${id}">${baitSvg(id)}${b.n}<em>稀有魚機率 +${b.luck}・剩 ${F.bait[id]||0} 個</em><em>${COIN(12)} ${b.p} / ${BAIT_PACK} 個</em></button>`).join('')}</div>`;
 if(fTab==='bag'){const tot=F.bag.reduce((a,x)=>a+sellP(x),0);
  body=F.bag.length?`<div class="row" style="margin:0"><span class="small">${palBonus()?`湖邊有 ${atLake().length} 位好友，賣價 +${Math.round(palBonus()*100)}%`:'和好友一起在湖邊，賣魚價錢會更高喔'}</span><button class="save" id="fSellAll">全部賣掉（${tot} 金幣）</button></div>
   <div class="fgridS">${F.bag.map((x,i)=>{const f=FISH.find(q=>q.id===x.id);return `<div class="fitem">${fishSvg(f,56)}<b>${f.n}</b><em style="color:${RARC[f.r]}">${RARN[f.r]}・${x.cm} 公分</em><button class="ghost" data-sell="${i}" style="min-height:30px;padding:2px 10px">賣 ${sellP(x)}</button></div>`}).join('')}</div>`:'<p class="small">魚簍是空的，去釣幾條魚吧！</p>'}
 if(fTab==='book')body=`<p class="small" style="margin:0">已發現 ${FISH.filter(f=>F.log[f.id]).length} / ${FISH.length} 種・總共釣到 ${F.caught} 次</p><div class="fgridS">${FISH.map(f=>{const L=F.log[f.id];return `<div class="fitem">${L?fishSvg(f,56):'<svg viewBox="0 0 60 40" width="56"><path d="M8 20q14-16 34-8l12-8v32l-12-8q-20 8-34-8z" fill="#ccc"/></svg>'}<b>${L?f.n:'？？？'}</b><em style="color:${RARC[f.r]}">${RARN[f.r]}</em><em>${L?`最大 ${L.max} 公分・${L.n} 次`:'還沒釣到'}</em></div>`}).join('')}</div>`;
 $('gBody').innerHTML=`<div class="gym"><div class="ftabs">${tabs.map(([k,n])=>`<button type="button" data-ft="${k}" aria-pressed="${fTab===k}">${n}</button>`).join('')}</div>${body}<div class="row"><button class="ghost" id="fHome">回房間</button></div></div>`;
 $('fHome').onclick=closeGames;if(fTab==='lake')bindLake()}
$('gBody').addEventListener('click',e=>{if(!$('gBody').querySelector('.ftabs'))return;const F=fishSt();
 const t=e.target.closest('[data-ft]');if(t){if(fGame){fGame.stop();fGame=null}fTab=t.dataset.ft;sfx('click');renderFish();return}
 const r=e.target.closest('[data-rod]');if(r){const id=r.dataset.rod,R=RODS[id];if(!F.rods.includes(id)){if(S.coins<R.p){toast('金幣不夠喔！');sfx('squeak');return}S.coins-=R.p;F.rods.push(id);sfx('gift');toast(`買了「${R.n}」！`)}F.rod=id;save();render();renderFish();return}
 const b=e.target.closest('[data-bait]');if(b){const id=b.dataset.bait,B=BAITS[id];if(S.coins<B.p){toast('金幣不夠喔！');sfx('squeak');return}S.coins-=B.p;F.bait[id]=(F.bait[id]||0)+BAIT_PACK;F.sel=id;sfx('gift');toast(`買了 ${BAIT_PACK} 個「${B.n}」`);save();render();renderFish();return}
 const s=e.target.closest('[data-sell]');if(s){const x=F.bag[+s.dataset.sell];if(!x)return;F.bag.splice(+s.dataset.sell,1);earn(sellP(x),1);sfx('coin');save();render();renderFish();return}
 if(e.target.closest('#fSellAll')){const tot=F.bag.reduce((a,x)=>a+sellP(x),0);const n=F.bag.length;F.bag=[];earn(tot,1);sfx('level');toast(`賣了 ${n} 條魚，拿到 ${tot} 金幣！`);save();render();renderFish();return}
 const bs=e.target.closest('[data-usebait]');if(bs){F.sel=bs.dataset.usebait;save();renderFish()}});
const sellP=x=>{const f=FISH.find(q=>q.id===x.id);return Math.max(1,Math.round(f.p*(x.cm/x.base)*(1+palBonus())))};
const rodSvg=id=>`<svg viewBox="0 0 60 40" width="56"><path d="M6 36 54 6" stroke="${id==='gold'?'#e0a020':id==='carbon'?'#3a3a4a':'#a8843a'}" stroke-width="4" stroke-linecap="round"/><circle cx="16" cy="30" r="5" fill="#9aa8ba"/><path d="M54 6v26" stroke="#fff" stroke-width="1"/></svg>`;
const baitSvg=id=>`<svg viewBox="0 0 60 40" width="56">${id==='bread'?'<g fill="#e0b070"><circle cx="20" cy="22" r="6"/><circle cx="34" cy="18" r="5"/><circle cx="42" cy="26" r="4"/></g>':id==='worm'?'<path d="M10 26q8-12 16 0t16 0 10-4" stroke="#e88a8a" stroke-width="6" fill="none" stroke-linecap="round"/>':id==='shrimp'?'<path d="M14 26q4-16 22-14 10 2 12 10-10-4-18 4z" fill="#ff8a6a"/><path d="M46 20l8-6M46 22l8 0" stroke="#ff8a6a" stroke-width="2"/>':'<circle cx="30" cy="20" r="12" fill="#b58cff"/><path d="M30 10l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#fff"/>'}</svg>`;
function lakeHtml(){const F=fishSt(),p=P(),pals=atLake(),feed=pals.map(id=>{const d=LIVE.docs[id];return d&&d.fc&&Date.now()-d.fc.ts<10*60000?`<p>${esc(d.nick||nickOf(id))} 釣到了 <b>${esc(d.fc.n)}</b>（${d.fc.cm} 公分）</p>`:''}).join('');
 const baits=Object.keys(BAITS).filter(k=>F.bait[k]>0);
 return `<div class="lake" id="lake"><div class="wave" style="top:50%"></div><div class="wave" style="top:70%;animation-delay:1s"></div><div class="wave" style="top:86%;animation-delay:2s"></div><div class="dock"></div>
  <div class="me">${`<svg viewBox="0 0 200 190">${petSvg(p.sp,'happy')}</svg>`}</div>
  ${pals.slice(0,3).map((id,i)=>{const h=netHome(id),pp=h&&(h.pets||[]).find(q=>SP[q.sp]);return `<div class="pal" style="left:${36+i*15}%;bottom:${30+i%2*6}%">${pp?`<svg viewBox="0 0 200 190">${petSvg(pp.sp,'happy')}</svg>`:''}<span>${esc((LIVE.docs[id]&&LIVE.docs[id].nick)||nickOf(id))}</span></div>`}).join('')}
  <div class="line" id="fLine" hidden></div><div class="bob" id="fBob" hidden></div></div>
  <div class="ginfo"><span>釣竿：${F.rod?RODS[F.rod].n:'<b style="color:#d8304a">還沒有</b>'}</span><span>魚餌：${baits.length?`<select id="fBait" style="font-size:14px">${baits.map(k=>`<option value="${k}" ${F.sel===k?'selected':''}>${BAITS[k].n}（${F.bait[k]}）</option>`).join('')}</select>`:'<b style="color:#d8304a">沒有了</b>'}</span></div>
  <div id="fPanel"><div class="gctl"><button class="save" id="fCast">拋竿！</button></div></div>
  <div class="row" style="margin:0"><span class="small">湖邊好友：${pals.length?pals.map(id=>esc(nickOf(id))).join('、'):'沒有人'}${pals.length?`（賣魚 +${Math.round(palBonus()*100)}%）`:''}</span><button class="ghost" id="fiInv" style="min-height:34px;padding:2px 12px">約好友來釣魚</button></div>
  ${feed?`<div class="fishfeed">${feed}</div>`:''}`}
function bindLake(){const F=fishSt();$('fBait')&&($('fBait').onchange=e=>{F.sel=e.target.value;save()});$('fCast').onclick=cast;$('fiInv').onclick=fishInvite}
function pickFish(luck){const w=FISH.map(f=>{const base=[30,30,14,6,1.2][f.r];return base*(f.r>=2?1+luck*.6:f.r===0&&f.p<=1?Math.max(.2,1-luck*.25):1)});let r=Math.random()*w.reduce((a,b)=>a+b,0);for(let i=0;i<FISH.length;i++){r-=w[i];if(r<=0)return FISH[i]}return FISH[2]}
function cast(){const F=fishSt();if(!F.rod){toast('要先到「釣具店」買一支釣竿喔！');fTab='shop';renderFish();return}
 const bait=F.sel&&F.bait[F.sel]>0?F.sel:Object.keys(BAITS).find(k=>F.bait[k]>0);if(!bait){toast('魚餌用完了，去釣具店買一些吧！');fTab='shop';renderFish();return}
 F.sel=bait;F.bait[bait]--;save();sfx('swoosh');const lake=$('lake'),bob=$('fBob'),line=$('fLine'),bx=55+Math.random()*30,by=55+Math.random()*30;bob.hidden=false;bob.style.left='24%';bob.style.top='44%';
 requestAnimationFrame(()=>{bob.style.left=bx+'%';bob.style.top=by+'%'});
 const R=lake.getBoundingClientRect(),dx=(bx-24)/100*R.width,dy=(by-44)/100*R.height;line.hidden=false;line.style.width=Math.hypot(dx,dy)+'px';line.style.transform=`rotate(${Math.atan2(dy,dx)}rad)`;
 $('fPanel').innerHTML='<p class="small" style="text-align:center">靜靜等待……浮標往下沉的時候快按「拉竿」！</p><div class="gctl"><button class="save" id="fHook">拉竿！</button></div>';
 const luck=RODS[F.rod].luck+BAITS[bait].luck,fish=pickFish(luck);let st='wait',to=null,biteT=null,over=false;
 const stop=()=>{over=true;clearTimeout(to);clearTimeout(biteT)};fGame={stop};
 to=setTimeout(()=>{if(over)return;st='bite';bob.classList.add('bite');sfx('splash');lake.insertAdjacentHTML('beforeend',`<div class="bang" style="left:${bx}%;top:${by}%">！</div>`);
  biteT=setTimeout(()=>{if(over||st!=='bite')return;st='miss';miss('魚把餌吃掉跑走了……')},900+RODS[F.rod].luck*250)},1800+Math.random()*4500);
 $('fHook').onpointerdown=e=>{e.preventDefault();if(st==='wait'){stop();miss('太早拉竿了，魚被嚇跑了！');return}if(st==='bite'){stop();lake.querySelector('.bang')?.remove();bob.classList.remove('bite');reel(fish)}};
 function miss(t){fGame=null;toast(t);sfx('squeak');setTimeout(()=>{if($('lake'))renderFish()},900)}}
function reel(f){const F=fishSt(),zw=RODS[F.rod].zone;let zx=40,zv=0,fx=50,fv=0,prog=35,hold=false,last=performance.now(),raf,over=false,tgt=50,tt=0;sfx('click');
 $('fPanel').innerHTML=`<p class="small" style="text-align:center">上鉤了！按住「收線」讓綠色框框跟住魚，進度條滿了就釣起來！</p><div class="reel" id="rl"><div class="zone" id="rz" style="width:${zw}%"></div><div class="fsh" id="rf">${f.r>=2?fishSvg(f,40):fishSvg(FISH[2],40)}</div></div><div class="prog"><i id="rp"></i></div><div class="gctl"><button class="save" id="fReel">按住收線</button></div>`;
 const b=$('fReel');b.onpointerdown=e=>{e.preventDefault();hold=true};b.onpointerup=b.onpointerleave=b.onpointercancel=()=>{hold=false};
 const key=e=>{if(e.key===' '){e.preventDefault();hold=e.type==='keydown'}};document.addEventListener('keydown',key);document.addEventListener('keyup',key);
 const stop=()=>{over=true;cancelAnimationFrame(raf);document.removeEventListener('keydown',key);document.removeEventListener('keyup',key)};fGame={stop};
 const loop=now=>{if(over)return;const dt=Math.min(.05,(now-last)/1000);last=now;tt-=dt;
  if(tt<=0){tgt=5+Math.random()*90;tt=.5+Math.random()*(1.6-f.sp*.4)}fv+=(tgt-fx)*dt*f.sp*3;fv*=Math.pow(.2,dt);fx=Math.max(3,Math.min(97,fx+fv*dt*4));
  zv+=(hold?140:-110)*dt;zv*=Math.pow(.3,dt);zx+=zv*dt;if(zx<0){zx=0;zv=Math.max(0,zv)}if(zx>100-zw){zx=100-zw;zv=Math.min(0,zv)}
  const inZ=fx>=zx&&fx<=zx+zw;prog+=(inZ?26:-11-f.r*2.5)*dt;
  if(!$('rz')){stop();return}$('rz').style.left=zx+'%';$('rf').style.left=fx+'%';$('rp').style.width=Math.max(0,Math.min(100,prog))+'%';$('rz').style.background=inZ?'#9fe0b8aa':'#ffd6d6aa';
  if(prog>=100){stop();fGame=null;landed(f);return}if(prog<=0){stop();fGame=null;toast(`${f.r>=2?f.n:'魚'}掙脫逃走了……`);sfx('squeak');setTimeout(()=>$('lake')&&renderFish(),900);return}raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(t=>{last=t;loop(t)})}
function landed(f){const F=fishSt(),base=[20,25,30,40,60][f.r],cm=f.p<=1?Math.round(20+Math.random()*10):Math.round(base*(.7+Math.random()*.7));
 const x={id:f.id,cm,base,ts:Date.now()};if(F.bag.length>=40){toast('魚簍滿了（40 條），先去賣掉一些吧！');}else F.bag.push(x);F.caught++;const L=F.log[f.id]||{n:0,max:0};const first=!L.n;L.n++;L.max=Math.max(L.max,cm);F.log[f.id]=L;
 const p=P();p.joy=clamp(p.joy+4);gain(1,p);if(first&&f.r>=3)remember(p,`一起在垂釣湖釣到了「${f.n}」`);save();render();
 if(typeof livePut==='function'&&f.r>=1)livePut({fc:{n:f.n,cm,ts:Date.now()}});
 sfx(f.r>=3?'level':'chime');if(f.r>=4&&typeof confetti==='function')confetti();
 $('fPanel').innerHTML=`<div class="result" style="gap:4px">${fishSvg(f,120)}<h2 style="margin:0">${f.n}${first?' <small style="color:var(--berry)">新發現！</small>':''}</h2><p style="margin:0;color:${RARC[f.r]}">${RARN[f.r]}・${cm} 公分・約 ${sellP(x)} 金幣</p><div class="gctl"><button class="save" id="fAgain">再拋一次</button></div></div>`;
 $('fAgain').onclick=()=>renderFish();say(`${p.name}：「${f.p<=1?'這……這不是魚吧？':f.r>=3?'哇！好大一條！我們好厲害！':'釣到了！今天晚餐有著落了～'}」`)}
// ---------- 約好友一起釣魚 ----------
function fishInvite(){if(typeof onlineFriends!=='function'||NET.state!=='online'){toast('約好友釣魚要先登入帳號喔');return}const on=onlineFriends();if(!on.length){toast('現在沒有好友在線上');return}
 livePut({fi:{ts:Date.now(),invite:on.slice(0,20)}});sfx('chime');toast(`已經約了 ${on.length} 位在線好友來湖邊釣魚！`)}
let fiShown={};
if(typeof liveHooks!=='undefined')liveHooks.push(()=>{for(const id of S.friends||[]){const d=LIVE.docs[id],fi=d&&d.fi;if(!fi||!(fi.invite||[]).includes(NET.uid)||fiShown[id+fi.ts]||Date.now()-fi.ts>10*60000||!isOnline(id))continue;fiShown[id+fi.ts]=1;
  if($('gBody').querySelector('#lake'))continue;const el=document.createElement('div');el.className='invpop';el.setAttribute('role','alert');el.innerHTML=`<p><b></b> 約你一起去垂釣湖釣魚！</p><div class="inrow"><button class="save" data-a="ok">走吧</button><button class="ghost" data-a="no">下次</button></div>`;
  el.querySelector('b').textContent=d.nick||nickOf(id);document.body.append(el);sfx('chime');el.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;el.remove();if(b.dataset.a==='ok'){if(stopGame){stopGame();stopGame=null}openFish('lake')}};setTimeout(()=>el.remove(),60000)}
 if($('gBody').querySelector('#lake')&&!fGame){const k=JSON.stringify(atLake());if(k!==fishPalKey){fishPalKey=k;renderFish()}}});
let fishPalKey='';
MENU_EXTRA.splice(3,0,['fish','垂釣湖','<svg viewBox="0 0 40 40"><ellipse cx="20" cy="30" rx="17" ry="7" fill="#5aa8e0"/><path d="M8 4 30 26" stroke="#a8843a" stroke-width="3" stroke-linecap="round"/><path d="M30 26v4" stroke="#fff"/><path d="M14 30q6-6 12-2l4-3v8l-4-3q-6 4-12 0z" fill="#ff8a5a"/></svg>',()=>openFish('lake')]);
