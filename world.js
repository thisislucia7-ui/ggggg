// ===== 世界：所有寵物同一個房間、便便與髒亂、洗澡濕身、打架勸架、金幣與佈置、好友拜訪 =====
document.head.insertAdjacentHTML('beforeend',`<style>
.t-towel{position:absolute;left:50%;bottom:22%;width:120px;margin-left:-60px;z-index:5;animation:towel .28s ease-in-out 6 alternate}
@keyframes towel{from{transform:translateX(-18px) rotate(-8deg)}to{transform:translateX(18px) rotate(8deg)}}
.vstage{position:relative!important;top:0!important}
#btnFriends b{background:var(--berry);color:#fff;border-radius:99px;padding:0 7px;font-size:12px;margin-left:4px}
</style>`);
const COIN=s=>`<svg width="${s}" height="${s}" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="#ffc94a" stroke="#e0a020" stroke-width="3"/><circle cx="20" cy="20" r="10.5" fill="none" stroke="#fff3b0" stroke-width="2.5"/><path d="M15 15h10M20 15v11" stroke="#c98a10" stroke-width="3" stroke-linecap="round"/></svg>`;
function earn(n,quiet){S.coins=(S.coins||0)+n;if(!quiet)fx(COIN(20)+'+'+n,52+Math.random()*18,28);renderWorldUI()}
const POS={};let editMode=false,fight=null,summoned=null,sumT=null,lastFight=Date.now();
const wOf=p=>p&&$('petsL').querySelector(`.pw[data-pid="${CSS.escape(p.id)}"]`);
function animEl(el,cls,ms){if(!el)return;el.classList.remove(cls);void el.getBoundingClientRect();el.classList.add(cls);setTimeout(()=>el.classList.remove(cls),ms||1300)}
function place(w,pos){w.style.left=pos.x+'%';w.style.bottom=pos.y+'%';w.style.zIndex=Math.round(100-pos.y*2)}
const petW=()=>{const n=S.pets.length;return n<=1?'46%':n===2?'34%':n===3?'28%':'23%'};

// ---------- 寵物們 ----------
function syncPets(){const L=$('petsL'),ids=new Set(S.pets.map(p=>p.id));
 L.querySelectorAll('.pw').forEach(w=>{if(!ids.has(w.dataset.pid))w.remove()});L.style.setProperty('--pw',petW());
 S.pets.forEach((p,i)=>{let w=wOf(p);
  if(!w){w=document.createElement('div');w.className='pw';w.dataset.pid=p.id;w.innerHTML='<svg class="pet" viewBox="0 0 200 190" role="img"></svg><span class="ptag"></span>';L.append(w);
   if(!POS[p.id])POS[p.id]=S.pets.length===1?{x:50,y:8}:{x:S.pets.length<2?50:12+i*(76/Math.max(1,S.pets.length-1)),y:4+((i*5)%11)};place(w,POS[p.id])}
  const sv=w.querySelector('.pet'),e=expr(p),cur=i===S.cur;
  if(sv.dataset.e!==e||sv.dataset.sp!==p.sp){sv.innerHTML=petSvg(p.sp,e);sv.dataset.e=e;sv.dataset.sp=p.sp}
  if(cur)sv.id='pet';else sv.removeAttribute('id');sv.setAttribute('aria-label',p.name);
  w.classList.toggle('cur',cur&&S.pets.length>1);const wet=!!(p.wetUntil&&p.wetUntil>Date.now());w.querySelector('.ptag').textContent=wet?p.name+'・濕答答':p.name;w.classList.toggle('wet',wet);if(wet)addDrips(p)});
 posBubble()}
function posBubble(){const p=P();if(!p||!POS[p.id])return;$('bubble').style.left=Math.max(26,Math.min(74,POS[p.id].x))+'%'}
setInterval(()=>{if(editMode||!S.pets.length||(typeof inRoom!=='undefined'&&inRoom))return;const one=S.pets.length===1;
 S.pets.forEach(p=>{if((busy&&p===P())||p.id===summoned||(fight&&(fight.a===p||fight.b===p)))return;if(Math.random()>.35)return;
  POS[p.id]=one?{x:32+Math.random()*36,y:5+Math.random()*8}:freeSpot(p);const w=wOf(p);w&&place(w,POS[p.id])});posBubble()},3200);
function freeSpot(p){let best=null,bd=-1;for(let k=0;k<6;k++){const c={x:10+Math.random()*80,y:3+Math.random()*14};const d=Math.min(...S.pets.filter(q=>q!==p&&POS[q.id]).map(q=>Math.abs(POS[q.id].x-c.x)),99);if(d>bd){bd=d;best=c}}return best}
function summon(){const p=P(),w=wOf(p);if(!w)return;summoned=p.id;w.classList.add('come');POS[p.id]={x:50,y:9};place(w,POS[p.id]);posBubble();
 S.pets.forEach(q=>{if(q!==p&&POS[q.id]&&Math.abs(POS[q.id].x-50)<20){POS[q.id].x=POS[q.id].x<50?18:82;const o=wOf(q);o&&place(o,POS[q.id])}});
 setTimeout(()=>w.classList.remove('come'),650);clearTimeout(sumT);sumT=setTimeout(()=>{summoned=null},5000)}

// ---------- 便便與髒亂 ----------
const MESS={
 poop:{n:'便便',w:8,c:3,stink:1,v:'0 0 40 36',s:'<path d="M8 34c-6 0-7-8 0-9-3-6 3-10 8-8 0-6 8-8 11-2 5-2 9 4 5 8 6 2 5 11-1 11z" fill="#9a6a3a"/><path d="M12 25c4 2 10 2 14 0M14 18c3 1 6 1 9 0" stroke="#7a4a20" stroke-width="2" fill="none"/><circle cx="15" cy="29" r="1.6" fill="#fff"/><circle cx="23" cy="29" r="1.6" fill="#fff"/>'},
 puddle:{n:'水漬',w:13,c:2,v:'0 0 60 22',s:'<ellipse cx="30" cy="12" rx="28" ry="9" fill="#9fd6f5" opacity=".85"/><ellipse cx="22" cy="10" rx="8" ry="2.5" fill="#fff" opacity=".7"/><circle cx="50" cy="6" r="2.5" fill="#9fd6f5"/>'},
 crumbs:{n:'碎屑',w:9,c:1,v:'0 0 40 20',s:'<g fill="#d9a060"><circle cx="8" cy="14" r="3"/><circle cx="16" cy="10" r="2.4"/><circle cx="24" cy="15" r="3.2"/><circle cx="31" cy="9" r="2"/><circle cx="20" cy="17" r="2"/></g>'},
 paper:{n:'紙屑',w:9,c:1,v:'0 0 40 22',s:'<path d="M6 16l10-10 8 6 10-8-2 14-12 4z" fill="#fff" stroke="#d8ccc4" stroke-width="1.5"/><path d="M12 14l8-2" stroke="#ccc"/>'},
 fur:{n:'毛球',w:10,c:2,v:'0 0 40 20',s:'<g fill="#e8d8c8"><ellipse cx="12" cy="12" rx="9" ry="6"/><ellipse cx="26" cy="10" rx="8" ry="5"/><ellipse cx="20" cy="15" rx="7" ry="4"/></g><path d="M6 8l-3-3M30 6l3-3M18 4v-3" stroke="#d8c8b8"/>'},
 toy:{n:'亂丟的玩具',w:9,c:1,v:'0 0 40 26',s:'<circle cx="14" cy="14" r="10" fill="#ff7c9c"/><path d="M5 11q9 6 18 0" stroke="#fff" stroke-width="2.5" fill="none"/><rect x="24" y="12" width="12" height="10" rx="2" fill="#7aa8ff"/>'}};
function addMess(t,x,y,from){if(!MESS[t]||S.mess.length>=14)return;S.mess.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),t,x:Math.max(6,Math.min(94,x??(10+Math.random()*80))),y:Math.max(0,Math.min(22,y??(1+Math.random()*16))),from:from||''});save();renderMess()}
function renderMess(){$('messL').innerHTML=S.mess.map(m=>{const M=MESS[m.t]||MESS.paper;return `<button type="button" class="mess" data-mid="${esc(m.id)}" style="left:${Number(m.x)||50}%;bottom:${Number(m.y)||5}%;--mw:${M.w}%" aria-label="清掃${M.n}">${M.stink?'<span class="stink">~ ~</span>':''}<svg viewBox="${M.v}">${M.s}</svg>${m.from?`<span class="from">${esc(m.from)} 留下的</span>`:''}</button>`}).join('');renderWorldUI()}
const cleanliness=()=>Math.max(0,100-S.mess.reduce((a,m)=>a+(m.t==='poop'?16:m.t==='puddle'?11:7),0));
$('messL').onclick=e=>{const b=e.target.closest('[data-mid]');if(!b||editMode)return;const m=S.mess.find(x=>x.id===b.dataset.mid);if(!m)return;
 const br=add('broom',`<svg viewBox="0 0 40 60"><path d="M30 2 18 34" stroke="#a8643a" stroke-width="4" stroke-linecap="round"/><path d="M12 30l14 6-6 22c-8-2-14-6-16-12z" fill="#f0cf6a"/><path d="M10 44l10 4M8 50l10 4" stroke="#c9a040" stroke-width="1.5"/></svg>`,650);
 br.style.left=m.x+'%';br.style.bottom=(Number(m.y)+2)+'%';sfx('swoosh');b.style.opacity='.4';
 setTimeout(()=>{S.mess=S.mess.filter(x=>x.id!==m.id);earn(MESS[m.t].c);sfx('chime');for(let i=0;i<4;i++){const s=document.createElement('span');s.className='spark';s.textContent='✦';s.style.left=(m.x-4+Math.random()*8)+'%';s.style.bottom=(Number(m.y)+Math.random()*8)+'%';$('stage').append(s);setTimeout(()=>s.remove(),1100)}
  if(!S.mess.length)say(pick(['家裡變得亮晶晶的，謝謝你！','好乾淨！我們可以在地上打滾了～']));save();renderMess();render()},550)};
// 每 5 秒：到時間的寵物會便便、偶爾弄亂家裡、濕身太久會自己甩水
setInterval(()=>{if(!P()||editMode||playing||(typeof inRoom!=='undefined'&&inRoom)||document.querySelector('.ov.on'))return;const now=Date.now();
 S.pets.forEach(p=>{if(p.poopAt&&now>p.poopAt&&!(busy&&p===P())&&!fight){p.poopAt=0;const pos=POS[p.id]||{x:50,y:8};animEl(wOf(p)?.querySelector('.pet'),'squat',1200);
   setTimeout(()=>{addMess('poop',pos.x+7,Math.max(0,pos.y-3));sfx('pop');say(`${p.name}：「嗯……不好意思，我嗯嗯了～」`)},900)}
  if(p.wetUntil&&now>p.wetUntil&&!fight)shakeDry(p)});
 if(!busy&&!fight&&Math.random()<.025){const p=pick(S.pets);addMess(pick(['paper','toy','crumbs','fur']),(POS[p.id]?.x??50)+(Math.random()*20-10));say(`${p.name}：「啊，不小心把家裡弄亂了……」`);animEl(wOf(p)?.querySelector('.pet'),'hop',900)}
},5000);

// ---------- 洗澡濕身 ----------
function addDrips(p){const w=wOf(p);if(!w||w.querySelector('.drip'))return;
 for(let i=0;i<6;i++){const d=document.createElement('span');d.className='drip';d.style.left=(18+i*13)+'%';d.style.top=(42+Math.random()*30)+'%';d.style.animationDelay=(i*.19)+'s';w.append(d)}
 const pu=document.createElement('span');pu.className='puddle-under';w.append(pu)}
function clearDrips(p){const w=wOf(p);w&&w.querySelectorAll('.drip,.puddle-under').forEach(e=>e.remove())}
function wetPet(p){p.wetUntil=Date.now()+25000;save();syncPets()}
function dryPet(){const p=P();if(!p||busy)return;if(!(p.wetUntil>Date.now())){say('我身上乾乾的喔～洗完澡再用毛巾幫我擦吧！');return}
 lock(1900);summon();sfx('swoosh');add('t-towel',`<svg viewBox="0 0 120 60"><rect x="4" y="6" width="112" height="48" rx="10" fill="#ffb3c6"/><path d="M4 18h112M4 42h112" stroke="#fff" stroke-width="4" stroke-dasharray="6 5"/><path d="M4 50q56 14 112 0" stroke="#e890a8" stroke-width="3" fill="none"/></svg>`,1800);anim('purr',1700);
 setTimeout(()=>{p.wetUntil=0;clearDrips(p);p.joy=clamp(p.joy+6);gain(3);earn(2);sfx('heart');hearts(4);say(pick(['毛巾暖呼呼的，好舒服！','擦乾了！謝謝你，我現在蓬蓬鬆鬆的～']));save();render()},1700)}
function shakeDry(p){p.wetUntil=0;clearDrips(p);const w=wOf(p),pos=POS[p.id]||{x:50,y:8};animEl(w?.querySelector('.pet'),'shake',1300);sfx('splash');
 for(let i=0;i<18;i++){const d=document.createElement('span');d.className='spray';d.style.left=pos.x+'%';d.style.bottom=(pos.y+12)+'%';const a=Math.random()*Math.PI*2,r=50+Math.random()*80;d.style.setProperty('--dx',Math.cos(a)*r+'px');d.style.setProperty('--dy',Math.sin(a)*r*.6+'px');$('stage').append(d);setTimeout(()=>d.remove(),750)}
 addMess('puddle',pos.x-8,Math.max(0,pos.y-3));addMess('puddle',pos.x+12,Math.max(0,pos.y+2));say(`${p.name}：「抖抖抖！沒人幫我擦，水甩得到處都是了～」`);save();render()}

// ---------- 打架與勸架 ----------
const FLINES=['那是我的玩具！','你吃了我的點心！','是我先來的！','不要搶我的位置啦！','你踩到我的尾巴了！','主人比較喜歡我！'];
const ANGER='<svg class="anger" viewBox="0 0 40 40"><path d="M6 14q8 0 8-8M26 6q0 8 8 8M34 26q-8 0-8 8M14 34q0-8-8-8" stroke="#e8304a" stroke-width="5" fill="none" stroke-linecap="round"/></svg>';
const BRAWL=`<svg viewBox="0 0 220 150"><g fill="#f4ede6" stroke="#d8ccc4" stroke-width="3"><circle cx="70" cy="80" r="44"/><circle cx="120" cy="60" r="50"/><circle cx="160" cy="90" r="40"/><circle cx="105" cy="105" r="40"/></g>
<g fill="#ffd23f"><path d="M40 30l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z"/><path d="M185 40l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></g><path d="M30 120l-12 10M196 118l12 10M90 140l-4 10M140 140l4 10" stroke="#8a6f68" stroke-width="6" stroke-linecap="round"/><text x="96" y="80" font-size="34" font-weight="700" fill="#e8304a">!?</text></svg>`;
function startFight(a,b,why){if(fight||busy||editMode||S.pets.length<2||!a||!b||a===b)return;busy=true;lastFight=Date.now();fight={a,b,phase:'argue',taps:0};
 POS[a.id]={x:40,y:8};POS[b.id]={x:60,y:8};[a,b].forEach(p=>{const w=wOf(p);if(!w)return;w.classList.add('come','mad');place(w,POS[p.id]);w.insertAdjacentHTML('beforeend',ANGER);const sv=w.querySelector('.pet');sv.innerHTML=petSvg(p.sp,'sad');sv.dataset.e='fight'});
 S.pets.forEach(q=>{if(q!==a&&q!==b&&POS[q.id]&&Math.abs(POS[q.id].x-50)<24){POS[q.id].x=POS[q.id].x<50?12:88;const o=wOf(q);o&&place(o,POS[q.id])}});
 sfx('hit');say(`${a.name}：「${why||pick(FLINES)}」${b.name}：「哼！」`);$('btnStop').textContent='勸架！';$('btnStop').hidden=false;
 fight.t=setTimeout(brawl,5500)}
function brawl(){if(!fight)return;fight.phase='brawl';[fight.a,fight.b].forEach(p=>wOf(p)?.classList.add('hide'));
 const c=document.createElement('div');c.className='brawl';c.id='brawlC';c.innerHTML=BRAWL;c.onclick=stopTap;$('stage').append(c);
 $('btnStop').textContent='快拉開牠們！（0/6）';say('牠們打起來了！快連續點擊拉開牠們！');fight.snd=setInterval(()=>sfx('hit'),650);fight.t=setTimeout(()=>endFight('timeout'),7000)}
function stopTap(){if(!fight)return;if(fight.phase==='argue'){clearTimeout(fight.t);endFight('calm')}
 else if(fight.phase==='brawl'){fight.taps++;sfx('pop');$('btnStop').textContent=`快拉開牠們！（${fight.taps}/6）`;animEl($('brawlC'),'shake',300);if(fight.taps>=6){clearTimeout(fight.t);endFight('split')}}}
$('btnStop').onclick=stopTap;
function endFight(r){if(!fight)return;const {a,b}=fight;clearInterval(fight.snd);$('btnStop').hidden=true;$('brawlC')?.remove();
 [a,b].forEach(p=>{const w=wOf(p);if(!w)return;w.classList.remove('mad','hide','come');w.querySelectorAll('.anger').forEach(e=>e.remove())});
 if(r==='calm'){[a,b].forEach(p=>{p.joy=clamp(p.joy+3);gain(2,p);animEl(wOf(p)?.querySelector('.pet'),'hug',1600)});earn(8);hearts(6);sfx('chime');
  say(`${a.name}、${b.name}：「對不起……我們和好了！」`);if(!S.firstCalm){S.firstCalm=1;remember(a,`第一次成功勸架，${a.name}和${b.name}和好了`)}}
 else if(r==='split'){[a,b].forEach(p=>{p.joy=clamp(p.joy-8);animEl(wOf(p)?.querySelector('.pet'),'purr',1200)});earn(4);addMess('fur',44,6);addMess('fur',58,10);sfx('heart');say('呼……終於拉開了。牠們有點委屈，記得摸摸安慰一下喔。')}
 else{[a,b].forEach(p=>{p.joy=clamp(p.joy-18);p.aff=Math.max(0,p.aff-3)});['fur','fur','paper'].forEach(t=>addMess(t,35+Math.random()*30,3+Math.random()*10));sfx('lose');say(`${a.name}和${b.name}氣呼呼地分開了……友好度下降了，下次要早點勸架！`)}
 fight=null;busy=false;save();render()}
setInterval(()=>{if(S.pets.length<2||busy||fight||editMode||playing||(typeof inRoom!=='undefined'&&inRoom)||document.querySelector('.ov.on')||Date.now()-lastFight<80000)return;
 const avg=S.pets.reduce((a,p)=>a+p.joy,0)/S.pets.length;if(Math.random()<.1+(avg<40?.15:0)+(S.mess.length>4?.08:0)){const a=pick(S.pets);startFight(a,pick(S.pets.filter(q=>q!==a)))}},8000);
function jealous(){if(S.pets.length<2||Math.random()>.12||Date.now()-lastFight<40000)return;const me=P();
 setTimeout(()=>{if(busy||fight||document.querySelector('.ov.on'))return;const o=pick(S.pets.filter(q=>q!==me));o&&startFight(o,me,'主人只顧著你！我也要！')},3400)}

// ---------- 佈置與商店 ----------
const clone=o=>JSON.parse(JSON.stringify(o));
function cleanDecor(d){d=d&&typeof d==='object'?d:{};return{wall:WALLS[d.wall]?d.wall:'peach',floor:FLOORS[d.floor]?d.floor:'wood',rug:RUGS[d.rug]?d.rug:'pink',
 items:(Array.isArray(d.items)?d.items:[]).filter(i=>i&&FURN[i.k]).slice(0,20).map(i=>({k:i.k,x:Math.max(3,Math.min(97,Number(i.x)||50)),y:Math.max(0,Math.min(60,Number(i.y)||10))}))}}
let roomKey='';
function renderRoom(force){S.decor=cleanDecor(S.decor);const k=JSON.stringify(S.decor);if(k===roomKey&&!force)return;roomKey=k;$('scene').innerHTML=sceneSvg(S.decor);renderFurn($('furnL'),S.decor.items,true)}
function renderFurn(L,items,mine){L.innerHTML=items.map((it,i)=>{const F=FURN[it.k];return `<div class="fu" data-i="${i}" style="left:${it.x}%;${F.k==='w'?'top':'bottom'}:${it.y}%;width:${F.w}%">${furnSvg(it.k)}${mine?`<button type="button" class="fx-x" data-rm="${i}" aria-label="收起${F.n}">×</button>`:''}</div>`}).join('')}
let shopTab='furn';
const SHOPT=[['furn','家具'],['wall','壁紙'],['floor','地板'],['rug','地毯']];
const CAT={furn:FURN,wall:WALLS,floor:FLOORS,rug:RUGS};
function renderShop(){$('shopCoin').innerHTML=`${COIN(22)} 金幣 <b>${S.coins}</b>`;
 $('shopTabs').innerHTML=SHOPT.map(([k,n])=>`<button type="button" data-tab="${k}" aria-pressed="${shopTab===k}">${n}</button>`).join('');
 $('shopGrid').innerHTML=Object.entries(CAT[shopTab]).map(([id,it])=>{const own=S.owned[shopTab].includes(id);let on,lab,act;
  if(shopTab==='furn'){on=S.decor.items.some(x=>x.k===id);lab=!own?'':on?'收起來':'擺出來';act=!own?'buy':on?'unplace':'place'}
  else{on=S.decor[shopTab]===id;lab=on?'使用中':'換上';act=!own?'buy':on?'':'use'}
  return `<div class="sitem ${on?'on':''}"><div class="pv">${decorPreview(shopTab,id)}</div><b>${it.n}</b>${own?`<button type="button" class="${act?'ghost':''}" data-act="${act}" data-id="${id}" ${act?'':'disabled'}>${lab}</button>`:`<button type="button" class="save" data-act="buy" data-id="${id}" ${S.coins<it.p?'disabled':''}><span class="price">${COIN(16)} ${it.p}</span></button>`}</div>`}).join('')}
$('shopTabs').onclick=e=>{const b=e.target.closest('[data-tab]');if(b){shopTab=b.dataset.tab;sfx('click');renderShop()}};
$('shopGrid').onclick=e=>{const b=e.target.closest('[data-act]');if(!b||!b.dataset.act)return;const id=b.dataset.id,it=CAT[shopTab][id],act=b.dataset.act;
 if(act==='buy'){if(S.coins<it.p){toast('金幣不夠喔，再多陪寵物玩一下吧！');return}S.coins-=it.p;S.owned[shopTab].push(id);sfx('gift');toast(`買了「${it.n}」！`);
  if(shopTab==='furn')S.decor.items.push({k:id,x:30+Math.random()*40,y:it.k==='w'?18:8});else S.decor[shopTab]=id;
  if(S.owned.furn.length+S.owned.wall.length+S.owned.floor.length+S.owned.rug.length===8)remember(P(),`第一次佈置新家：${it.n}`)}
 if(act==='place')S.decor.items.push({k:id,x:30+Math.random()*40,y:it.k==='w'?18:8});
 if(act==='unplace')S.decor.items=S.decor.items.filter(x=>x.k!==id);
 if(act==='use')S.decor[shopTab]=id;
 if(act!=='buy')sfx('click');save();renderRoom();renderShop();renderWorldUI()};
$('btnShop').onclick=()=>{sfx('click');renderShop();$('ovShop').classList.add('on')};
$('shopClose').onclick=()=>$('ovShop').classList.remove('on');
$('shopEdit').onclick=()=>{$('ovShop').classList.remove('on');setEdit(true)};
function setEdit(on){editMode=on;$('stage').classList.toggle('editing',on);$('editBar').hidden=!on;if(on){$('stage').scrollIntoView({behavior:'smooth',block:'center'});say('拖曳家具，把家佈置成你喜歡的樣子吧！')}else{save();say('新的佈置好漂亮，我好喜歡！');sfx('chime')}}
$('editDone').onclick=()=>setEdit(false);
{let drag=null;const st=$('stage');
 $('furnL').addEventListener('pointerdown',e=>{if(!editMode)return;const rm=e.target.closest('[data-rm]');
  if(rm){S.decor.items.splice(+rm.dataset.rm,1);save();renderRoom();sfx('pop');return}
  const f=e.target.closest('.fu');if(!f)return;e.preventDefault();const it=S.decor.items[+f.dataset.i];drag={f,it,sx:e.clientX,sy:e.clientY,ox:it.x,oy:it.y};f.setPointerCapture(e.pointerId)});
 $('furnL').addEventListener('pointermove',e=>{if(!drag)return;const r=st.getBoundingClientRect(),F=FURN[drag.it.k];
  drag.it.x=Math.max(3,Math.min(97,drag.ox+(e.clientX-drag.sx)/r.width*100));
  const dy=(e.clientY-drag.sy)/r.height*100;drag.it.y=F.k==='w'?Math.max(2,Math.min(48,drag.oy+dy)):Math.max(0,Math.min(28,drag.oy-dy));
  drag.f.style.left=drag.it.x+'%';drag.f.style[F.k==='w'?'top':'bottom']=drag.it.y+'%'});
 $('furnL').addEventListener('pointerup',()=>{if(drag){drag=null;save();roomKey=''}})}


// ---------- 大家一起：吃飯、洗澡 ----------
function feedAll(){if(busy||fight||S.pets.length<2)return;const F=FOOD[SP[P().sp].grp];lock(2700);sfx('click');let n=0;
 S.pets.forEach(p=>{if(p.full>=95)return;n++;const pos=POS[p.id]||{x:50,y:8},grp=SP[p.sp].grp;
  const b=add('bowl',`<svg viewBox="0 0 120 60" width="100%"><ellipse cx="60" cy="20" rx="56" ry="12" fill="#c25a7a"/><path d="M4 20q4 38 56 38t56-38z" fill="#e8507a"/><ellipse cx="60" cy="20" rx="46" ry="8" fill="#8a3050"/></svg><div class="food">${foodIcon(grp,0,60)}</div>`,2600);
  b.style.left=pos.x+'%';b.style.bottom=Math.max(0,pos.y-4)+'%';b.style.width='14%';b.style.marginLeft='-7%';b.style.zIndex=4;
  setTimeout(()=>{animEl(wOf(p)?.querySelector('.pet'),'munch',1800);b.querySelector('.food')?.classList.add('eat')},700);
  setTimeout(()=>{p.full=clamp(p.full+15);p.aff+=2;if(!p.poopAt)p.poopAt=Date.now()+(90+Math.random()*150)*1000;b.classList.add('out')},2000)});
 if(!n){say('大家都吃飽飽了～等一下再吃吧！');busy=false;$('btnFeed').disabled=$('btnPlay').disabled=false;return}
 setTimeout(()=>sfx('eat'),700);setTimeout(()=>{earn(n);hearts(5);sfx('heart');say(pick(['大家一起開飯好開心！','一起吃飯，每一口都特別香！']));track('feed');save();render()},2100)}
function bathAll(){if(busy||fight||S.pets.length<2)return;const d=daily();if((d.c.c_bath||0)>=2){say('今天已經洗過很多次澡了，明天再洗吧～');return}d.c.c_bath=(d.c.c_bath||0)+1;
 lock(2800);sfx('splash');for(let i=0;i<60;i++)setTimeout(()=>{const r=document.createElement('span');r.className='drop2';r.style.left=(4+Math.random()*92)+'%';$('stage').append(r);setTimeout(()=>r.remove(),800)},i*30);
 setTimeout(()=>{sfx('bubble');S.pets.forEach(p=>{const pos=POS[p.id]||{x:50,y:8};for(let i=0;i<5;i++){const f=document.createElement('span');f.className='foam';const sz=14+Math.random()*18;f.style.width=f.style.height=sz+'px';f.style.left=(pos.x-6+Math.random()*12)+'%';f.style.bottom=(pos.y+6+Math.random()*16)+'%';f.style.animationDelay=Math.random()*.4+'s';$('stage').append(f);setTimeout(()=>f.remove(),3000)}animEl(wOf(p)?.querySelector('.pet'),'purr',1100)})},1000);
 setTimeout(()=>{S.pets.forEach(p=>{p.joy=clamp(p.joy+8);p.aff+=2;p.wetUntil=Date.now()+20000+Math.random()*12000});earn(S.pets.length*2);track('care');sfx('heart');say('大家都變成落湯雞了！快一隻一隻點牠們、用毛巾擦乾，不然會把水甩得滿地都是！');save();render()},2400)}
$('btnFeedAll').onclick=feedAll;$('btnBathAll').onclick=bathAll;

// ---------- 介面數字 ----------
function renderWorldUI(){if(!$('pCoin'))return;$('pCoin').innerHTML=`${COIN(22)} 金幣 <b>${S.coins||0}</b>`;
 const c=cleanliness();$('tClean').textContent=c;$('bClean').style.width=c+'%';
 const unread=NET.state==='online'?netInbox(NET.uid).filter(x=>x.ts>(S.lastRead||0)).length:0;
 $('btnFriends').innerHTML=`好友${unread?`<b>${unread}</b>`:''}`;$('btnFriends2').textContent=unread?`好友與留言板（${unread} 則新的）`:'好友與留言板';
 $('allBox').hidden=S.pets.length<2;
 const tw=document.querySelector('#care [data-c="towel"]');if(tw)tw.style.borderColor=P()&&P().wetUntil>Date.now()?'var(--berry)':''}

// ---------- 帳號與好友 ----------
const nickOf=id=>{const h=netHome(id);return (h&&h.nick)||'神秘玩家'};
function acctLine(){const fb=NET.mode==='firebase';if(NET.state==='online')return NET.ro?(fb?'已登入，但雲端暫時無法寫入，紀錄先存在這台裝置。':'已登入，但你目前只有瀏覽權限：紀錄只存在這台裝置，也不能留言。'):fb?`已登入：${NET.email}${S.nick?'（'+S.nick+'）':''}，遊玩紀錄會自動存到雲端。`:`已用 Claude 帳號登入${S.nick?'：'+S.nick:''}，遊玩紀錄會自動存到雲端。`;
 if(NET.state==='loading')return '正在連線你的帳號……';if(NET.state==='login')return '登入或註冊帳號，遊玩紀錄就能存到雲端，還能交朋友。';
 return fb?'目前沒有登入：紀錄只存在這台裝置。到「個人」頁可以登入。':(window.FIREBASE_CONFIG&&window.FIREBASE_CONFIG.apiKey)?'無法連線到雲端：紀錄先存在這台裝置。':'離線模式：紀錄只存在這台裝置。在 claude.ai 上開啟並登入，就能雲端存檔和交朋友。'}
function renderFriends(){const B=$('frBody');
 if(NET.state!=='online'){B.innerHTML=`<h2>好友與留言板</h2><p class="netnote">${esc(acctLine())}</p><div class="row" style="justify-content:flex-end"><button class="save" id="frClose">關閉</button></div>`;$('frClose').onclick=closeFriends;return}
 const me=NET.uid,code=netCode(me),mine=S.friends;
 const req=Object.entries(NET.homes).filter(([id,h])=>id!==me&&h&&Array.isArray(h.friends)&&h.friends.includes(me)&&!mine.includes(id)&&!S.ignored.includes(id));
 const inbox=netInbox(me);
 B.innerHTML=`<div class="row" style="margin:0"><h2 style="margin:0">好友與留言板</h2><button class="ghost" id="frClose">關閉</button></div>
 ${NET.ro?`<p class="netnote">你目前只有瀏覽權限，可以看但不能存檔、加好友或留言。請頁面主人在分享設定裡把你加為「編輯者」。</p>`:''}
 <h3>我的帳號</h3><p class="small">${NET.mode==='firebase'?`登入帳號：${esc(NET.email)}`:'用 Claude 帳號登入，不需要另外設定密碼'}；遊玩紀錄會自動存到雲端，換裝置也能繼續玩。</p>
 <div class="inrow"><input id="frNick" maxlength="12" placeholder="玩家暱稱" value="${esc(S.nick||'')}"><button class="save" id="frNickSave">儲存暱稱</button></div>
 <p style="margin:10px 0 4px">我的好友碼</p><div class="inrow" style="align-items:center"><span class="codebox">${code}</span><button class="ghost" id="frCopy">複製</button></div>
 <h3>加好友</h3><div class="inrow"><input id="frCode" maxlength="6" inputmode="numeric" pattern="[0-9]*" autocomplete="off" placeholder="輸入好友的 6 位數好友碼"><button class="save" id="frAdd">加好友</button></div>
 ${req.length?`<h3>好友邀請</h3><div class="fgrid">${req.map(([id,h])=>`<div class="fcard"><b>${esc(h.nick||'神秘玩家')}</b> 想跟你當好友<div class="inrow"><button class="save" data-accept="${esc(id)}">接受</button><button class="ghost" data-ignore="${esc(id)}">略過</button></div></div>`).join('')}</div>`:''}
 <h3>我的好友</h3>${mine.length?`<div class="fgrid">${mine.map(id=>{const h=netHome(id);const mutual=h&&Array.isArray(h.friends)&&h.friends.includes(me);
  return `<div class="fcard"><b>${esc(nickOf(id))}</b><div class="pets">${((h&&h.pets)||[]).filter(p=>SP[p.sp]).slice(0,6).map(p=>thumb(p.sp,p.e==='sad'?'sad':'happy','')).join('')}</div>${mutual?'':'<span class="small">等待對方也加你</span>'}<div class="inrow"><button class="save" data-visit="${esc(id)}" ${h?'':'disabled'}>拜訪</button><button class="ghost" data-unf="${esc(id)}">刪除</button></div></div>`}).join('')}</div>`:'<p class="small">還沒有好友。把你的好友碼分享給朋友吧！</p>'}
 <h3>我的留言板</h3>${inbox.length?`<div class="msgs">${inbox.map(m=>msgHtml(m,true)).join('')}</div>`:'<p class="small">還沒有人留言。</p>'}`;
 $('frClose').onclick=closeFriends}
function giftText(g,grp){if(!g)return '';if(g.kind==='coins')return `送你 ${Number(g.n)||0} 枚金幣`;const t=Math.max(0,Math.min(3,Number(g.tier)||0));return `送你特別飼料「${FOOD[grp][t+1][0]}」`}
function msgHtml(m,mine){const grp=P()?SP[P().sp].grp:'cat',claimed=S.giftsIn.includes(m.id);
 const body=m.type==='poop'?'偷偷在你家留下了一坨便便！':esc(String(m.text||'').slice(0,200));
 return `<div class="msg"><small>${esc(nickOf(m.from))}・${esc(new Date(m.ts).toLocaleString('zh-TW',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}))}</small>${body}${m.gift?`<div class="gift">${esc(giftText(m.gift,grp))} ${mine?(claimed?'（已收下）':`<button class="save" data-claim="${esc(m.id)}" style="min-height:32px;padding:2px 12px">收下</button>`):''}</div>`:''}</div>`}
$('frBody').addEventListener('click',async e=>{const t=e.target.closest('button');if(!t)return;
 if(t.id==='frNickSave'){const n=$('frNick').value.trim().slice(0,12);if(!n)return;S.nick=n;save();toast('暱稱已儲存');renderFriends()}
 if(t.id==='frCopy'){try{await navigator.clipboard.writeText(netCode(NET.uid));toast('好友碼已複製')}catch(err){toast('請手動選取好友碼')}}
 if(t.id==='frAdd'){const c=$('frCode').value;const id=await netFindCode(c);if(!id){toast('找不到這個好友碼，請確認對方已經開過遊戲');return}if(id===NET.uid){toast('這是你自己的好友碼喔');return}
  if(!S.friends.includes(id))S.friends.push(id);save();netFlush(S);sfx('chime');toast(`已加 ${nickOf(id)} 為好友！`);renderFriends()}
 if(t.dataset.accept){S.friends.push(t.dataset.accept);save();netFlush(S);sfx('chime');remember(P(),`和 ${nickOf(t.dataset.accept)} 成為好朋友`);renderFriends()}
 if(t.dataset.ignore){S.ignored.push(t.dataset.ignore);save();renderFriends()}
 if(t.dataset.unf){S.friends=S.friends.filter(x=>x!==t.dataset.unf);save();netFlush(S);renderFriends()}
 if(t.dataset.visit){closeFriends();openVisit(t.dataset.visit)}
 if(t.dataset.claim){const m=netInbox(NET.uid).find(x=>x.id===t.dataset.claim);if(!m||!m.gift||S.giftsIn.includes(m.id))return;S.giftsIn.push(m.id);
  if(m.gift.kind==='coins')earn(Math.max(0,Math.min(100,Number(m.gift.n)||0)),1);else S.inv[Math.max(0,Math.min(3,Number(m.gift.tier)||0))]++;
  sfx('gift');toast('收下禮物了！');save();render();renderFriends()}});
function openFriends(){S.lastRead=Date.now();save();renderFriends();renderWorldUI();$('ovFriends').classList.add('on')}
function closeFriends(){$('ovFriends').classList.remove('on')}
$('btnFriends').onclick=openFriends;$('btnFriends2').onclick=openFriends;
// 別人留下的便便：出現在我家
function processInbox(){if(NET.state!=='online')return;let n=0;
 for(const m of netInbox(NET.uid))if(m.type==='poop'&&!S.seenIn.includes(m.id)){S.seenIn.push(m.id);if(S.pets.length){addMess('poop',undefined,undefined,nickOf(m.from));n++}}
 if(S.seenIn.length>300)S.seenIn=S.seenIn.slice(-300);if(n){save();toast(`有朋友來拜訪時偷偷留下了 ${n} 坨便便！快打掃吧`)}renderWorldUI()}

// ---------- 拜訪好友 ----------
let visitId=null,visitT=null;
function openVisit(fid){const h=netHome(fid);if(!h)return;visitId=fid;netWatchBoard(fid);const d=cleanDecor(h.decor);
 $('vTitle').textContent=`${h.nick||'好友'}的家`;$('vStage').dataset.tod=tod();$('vScene').innerHTML=sceneSvg(d);renderFurn($('vFurn'),d.items,false);
 const pets=(Array.isArray(h.pets)?h.pets:[]).filter(p=>p&&SP[p.sp]).slice(0,6),w=pets.length<=1?'46%':pets.length===2?'34%':pets.length===3?'28%':'23%';
 $('vPets').style.setProperty('--pw',w);
 $('vPets').innerHTML=pets.map((p,i)=>`<div class="pw" data-vi="${i}" style="left:${15+((i*29)%70)}%;bottom:${5+(i*4)%10}%"><svg class="pet" viewBox="0 0 200 190">${petSvg(p.sp,p.e==='sad'?'sad':'happy')}</svg><span class="ptag"></span></div>`).join('');
 $('vPets').querySelectorAll('.ptag').forEach((t,i)=>t.textContent=String(pets[i].name||'').slice(0,10));
 $('vPets').onclick=e=>{const el=e.target.closest('[data-vi]');if(!el)return;const p=pets[+el.dataset.vi];animEl(el.querySelector('.pet'),'hop',900);sfx('squeak');$('vBubble').textContent=`${String(p.name||'').slice(0,10)}：「${pick(['你好呀～歡迎來玩！','你是主人的朋友嗎？','摸摸我嘛～','要不要留言給主人？'])}」`};
 clearInterval(visitT);visitT=setInterval(()=>$('vPets').querySelectorAll('.pw').forEach(el=>{if(Math.random()<.4){el.style.left=(10+Math.random()*80)+'%';el.style.bottom=(3+Math.random()*14)+'%'}}),3200);
 const grp=P()?SP[P().sp].grp:'cat';
 $('vGift').innerHTML=`<option value="">不送禮物</option>${[10,30].filter(n=>S.coins>=n).map(n=>`<option value="c${n}">${n} 枚金幣（你有 ${S.coins}）</option>`).join('')}${[0,1,2,3].filter(t=>S.inv[t]>0).map(t=>`<option value="t${t}">${esc(FOOD[grp][t+1][0])} ×1（你有 ${S.inv[t]}）</option>`).join('')}`;
 const done=S.poopDay[fid]===today();$('vPoop').disabled=done||NET.ro;$('vPoopNote').textContent=done?'今天已經在這裡留過便便了':'';
 $('vMsg').value='';$('vBubble').textContent=`${pets[0]?String(pets[0].name||'').slice(0,10)+'：「':'「'}歡迎來玩！」`;renderBoard();$('ovVisit').classList.add('on');sfx('chime')}
function renderBoard(){const list=netInbox(visitId).slice(0,30);$('vBoard').innerHTML=list.length?list.map(m=>msgHtml(m,false)).join(''):'<p class="small">還沒有人留言，當第一個吧！</p>';$('vSend').disabled=NET.ro}
$('vSend').onclick=async()=>{if(!visitId)return;const text=$('vMsg').value.trim().slice(0,200),g=$('vGift').value;if(!text&&!g){toast('寫點什麼或選個禮物吧～');return}
 let gift=null;if(g[0]==='c'){const n=+g.slice(1);if(S.coins<n)return;gift={kind:'coins',n}}else if(g[0]==='t'){const t=+g.slice(1);if(!S.inv[t])return;gift={kind:'feed',tier:t}}
 $('vSend').disabled=true;const ok=await netSend({to:visitId,type:gift?'gift':'msg',text,gift});$('vSend').disabled=false;
 if(!ok){toast('送不出去，可能你目前只有瀏覽權限');return}
 if(gift){if(gift.kind==='coins')S.coins-=gift.n;else S.inv[gift.tier]--}save();sfx('heart');toast('留言送出了！');$('vMsg').value='';openVisit(visitId)};
$('vPoop').onclick=async()=>{if(!visitId||S.poopDay[visitId]===today())return;$('vPoop').disabled=true;const ok=await netSend({to:visitId,type:'poop'});
 if(!ok){toast('送不出去，可能你目前只有瀏覽權限');$('vPoop').disabled=false;return}S.poopDay[visitId]=today();save();sfx('pop');
 const m=document.createElement('div');m.className='mess';m.style.cssText=`left:${30+Math.random()*40}%;bottom:${3+Math.random()*12}%;--mw:8%;z-index:2`;m.innerHTML=`<span class="stink">~ ~</span><svg viewBox="${MESS.poop.v}">${MESS.poop.s}</svg>`;$('vStage').append(m);
 $('vBubble').textContent='「咦？這是什麼味道……」';$('vPoopNote').textContent='嘿嘿，留下便便了！主人回家就會看到';renderBoard()};
$('vExit').onclick=()=>{clearInterval(visitT);visitId=null;$('ovVisit').classList.remove('on');document.querySelectorAll('#vStage .mess').forEach(e=>e.remove())};
$('nickForm').onsubmit=e=>{e.preventDefault();const n=$('nickIn').value.trim().slice(0,12);if(!n)return;S.nick=n;save();$('ovNick').classList.remove('on');toast(`歡迎你，${n}！`);$('tAcct').textContent=acctLine()};

// ---------- 啟動 ----------
function updateTitle(){const p=P();$('tWait').innerHTML=p?`<div class="wait">${thumb(p.sp,expr(p),'')}<span>${esc(p.name)}${S.pets.length>1?`和其他 ${S.pets.length-1} 隻`:''}正在房間裡等你！</span></div>`:'';$('tGo').textContent=p?'進入房間':'開始選寵物';$('tAcct').textContent=acctLine();const lg=NET.state==='login';$('loginForm').hidden=!lg;$('tGo').hidden=lg}
const _enter=enterRoom;enterRoom=function(){_enter();renderMess();if(NET.state==='online'&&!NET.ro&&!S.nick)setTimeout(()=>{$('ovNick').classList.add('on');$('nickIn').focus()},2600);processInbox()};
S=normalize(S);decay();renderDiaryForm();renderDiary();renderRoom(true);renderMess();if(S.pets.length)render();
showTitle();updateTitle();
setInterval(()=>{if(!playing&&P()){decay();render()}},60000);
$('stage').dataset.tod=tod();
NET.onChange=k=>{if(k==='login')updateTitle();if(k==='out')processInbox();if($('ovFriends').classList.contains('on'))renderFriends();if(visitId&&k==='out')renderBoard();renderWorldUI();$('tAcct').textContent=acctLine()};
netInit().then(cloud=>{
 const fb=NET.mode==='firebase'&&NET.state==='online',other=fb&&S.owner&&S.owner!==NET.uid;
 let c=null;if(cloud){try{c=JSON.parse(cloud.state)}catch(e){}}
 const apply=n=>{S=normalize(n);try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}renderRoom(true);renderMess();renderDiary();if(S.pets.length)render();else $('petsL').innerHTML=''};
 if(c&&Array.isArray(c.pets)&&(other||((c.ts||0)>(S.ts||0)&&($('ovTitle').classList.contains('on')||!S.pets.length)))){apply(c);toast('已從雲端載入你的遊玩紀錄')}
 else if(other)apply({pets:[],cur:0,slots:1,stars:0,inv:[0,0,0,0],food:0,toy:'ball',plays:{},diary:[],checkDay:'',last:Date.now()});
 if(fb)S.owner=NET.uid;
 updateTitle();if(NET.state==='online'&&!NET.ro)netFlush(S);processInbox()});
// ---------- 公開網站：電子郵件登入 ----------
async function doLogin(kind){const em=$('lgEmail').value.trim(),pw=$('lgPass').value;$('lgMsg').textContent=kind==='up'?'註冊中……':'登入中……';
 const err=await fbLogin(kind,em,pw);$('lgMsg').textContent=err;if(!err){sfx('chime');toast(kind==='up'?'註冊成功，歡迎你！':'登入成功！')}}
$('loginForm').onsubmit=e=>{e.preventDefault();doLogin('in')};
$('lgUp').onclick=()=>doLogin('up');
$('lgForgot').onclick=async()=>{const em=$('lgEmail').value.trim();if(!em){$('lgMsg').textContent='請先在上面填好電子郵件';return}$('lgMsg').textContent=await fbReset(em)};
$('lgSkip').onclick=()=>{fbSkip();updateTitle()};
