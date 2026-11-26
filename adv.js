// ===== 探險（三種等級）與體育館（110 米跨欄、標槍、跳遠，全服每週排行榜） =====
document.head.insertAdjacentHTML('beforeend',`<style>
.adv{display:flex;flex-direction:column;gap:10px}
.adv .th{width:64px!important;height:64px!important;flex:none;border-radius:16px}
.advl{display:grid;gap:10px}
.advc{display:grid;grid-template-columns:72px 1fr auto;gap:10px;align-items:center;background:var(--bg);border-radius:18px;padding:10px;text-align:left;min-height:0;border:2px solid transparent}
.advc .ic{width:72px;height:60px;border-radius:14px;display:flex;align-items:flex-end;justify-content:center;overflow:hidden}
.advc h3{margin:0;font-size:17px}.advc p{margin:2px 0 0;font-size:13px;color:var(--mute)}
.advc .risk{font-size:12px;font-weight:700}
.trail{position:relative;height:210px;border-radius:20px;overflow:hidden}
.trail .bgL{position:absolute;inset:0;background-size:240px 100%;animation:trail 1.6s linear infinite}
.trail.stop .bgL{animation-play-state:paused}
@keyframes trail{to{background-position:-240px 0}}
.trail .me{position:absolute;left:14%;bottom:10px;width:34%;max-width:150px;animation:idle .45s ease-in-out infinite}
.trail.stop .me{animation:none}
.trail .foe{position:absolute;right:10%;bottom:12px;width:28%;max-width:120px;animation:pop .4s}
.trail .flee{animation:flee 1s ease-in forwards!important}
@keyframes flee{to{transform:translateX(-160%) scaleX(-1)}}
.trail .loot{position:absolute;right:20%;bottom:30px;font-size:15px;background:#fff;border-radius:14px;padding:4px 10px;animation:pop .3s}
.advlog{background:var(--bg);border-radius:14px;padding:8px 12px;min-height:70px;font-size:14px}
.advlog p{margin:3px 0}
.steps{display:flex;gap:6px;justify-content:center}.steps i{width:28px;height:8px;border-radius:99px;background:var(--line)}.steps i.on{background:var(--mint)}.steps i.bad{background:var(--berry)}
.gym{display:flex;flex-direction:column;gap:10px}
.gev{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.gev button{display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 4px;font-size:14px;min-height:0;border-radius:16px}
.gev button svg{width:44px;height:44px}.gev small{font-size:11px;opacity:.8}
.lb{background:var(--bg);border-radius:16px;padding:8px 10px}
.lb ol{margin:0;padding:0;list-style:none}.lb li{display:grid;grid-template-columns:30px 1fr auto;gap:6px;align-items:center;padding:5px 2px;border-bottom:1px dashed var(--line);font-size:14px}
.lb li:last-child{border:0}.lb li.me{color:var(--berry);font-weight:700}.lb .md{font-size:18px;text-align:center}
.field{position:relative;height:190px;border-radius:18px;overflow:hidden;background:linear-gradient(#bfe6ff 0 52%,#7cc48a 52% 100%)}
.field .lane{position:absolute;left:0;right:0;bottom:22px;height:6px;background:#e88a5a}
.field .runner{position:absolute;bottom:24px;left:14%;width:26%;max-width:110px;transition:bottom .12s}
.field .hur{position:absolute;bottom:24px;width:18px;height:40px;border-top:6px solid #fff;border-left:4px solid #d84a4a;border-right:4px solid #d84a4a;translate:-50% 0}
.field .fin{position:absolute;bottom:20px;width:6px;height:120px;background:repeating-linear-gradient(#222 0 10px,#fff 10px 20px);translate:-50% 0}
.field .board{position:absolute;bottom:20px;width:10px;height:10px;background:#fff;translate:-50% 0}
.field .pit{position:absolute;bottom:14px;height:16px;background:#f2dca0;border-radius:6px}
.field .jav{position:absolute;width:70px;height:4px;background:#8a5634;border-radius:2px;transform-origin:center}
.field .mark{position:absolute;bottom:2px;font-size:11px;color:#fff;translate:-50% 0}
.meter{height:22px;border-radius:99px;background:linear-gradient(90deg,#9fd3c4,#ffd23f 60%,#e8507a);position:relative}
.meter i{position:absolute;top:-4px;width:6px;height:30px;background:#3b2a2a;border-radius:3px;translate:-50% 0}
.gctl{display:flex;gap:10px}.gctl button{flex:1;min-height:64px;font-size:20px;touch-action:manipulation}
.ginfo{display:flex;justify-content:space-between;font-size:14px}
</style>`);
const LVOF=p=>Math.floor((p.aff||0)/100)+1;
const sv=(sp,e,st)=>`<svg viewBox="0 0 200 190" ${st?`style="${st}"`:''}>${petSvg(sp,e||'happy')}</svg>`;
// ---------- 探險 ----------
const FOES={
 dog:['野狗','<path d="M30 70q0-30 40-30h30q20 0 24 20l10 4-4 12H40z" fill="#8a6a4a"/><path d="M98 40l8-16 8 18z" fill="#6a4a2a"/><circle cx="110" cy="54" r="4" fill="#fff"/><circle cx="111" cy="55" r="2" fill="#000"/><path d="M118 70l6 4-8 2" fill="#fff"/><path d="M40 86v20M60 86v20M90 86v20M110 86v20" stroke="#6a4a2a" stroke-width="8"/>'],
 bee:['大黃蜂','<ellipse cx="70" cy="70" rx="40" ry="26" fill="#ffd23f"/><path d="M52 46v48M72 44v52M92 48v44" stroke="#3b2a2a" stroke-width="9"/><ellipse cx="60" cy="38" rx="16" ry="12" fill="#e6f6ff" opacity=".9"/><ellipse cx="84" cy="36" rx="16" ry="12" fill="#e6f6ff" opacity=".9"/><circle cx="104" cy="64" r="5" fill="#000"/><path d="M28 72l-14 4 14 4z" fill="#3b2a2a"/>'],
 mud:['滑溜泥巴','<ellipse cx="70" cy="90" rx="58" ry="16" fill="#8a6a3a"/><circle cx="50" cy="84" r="6" fill="#a8824a"/><circle cx="86" cy="88" r="4" fill="#a8824a"/><path d="M60 80q10-14 20 0" stroke="#6a4a2a" stroke-width="4" fill="none"/>'],
 bat:['蝙蝠群','<g fill="#4a3a5a"><path d="M20 50q20-10 30 4 6-12 16 0 10-14 30-4-14 0-20 14-10-4-16 8-10-10-12 4-20-14z"/><path d="M60 90q16-8 24 3 5-9 12 0 8-11 24-3-11 0-16 11-8-3-12 6-8-8-10 3-16-11z"/></g><g fill="#ff5a5a"><circle cx="54" cy="56" r="2"/><circle cx="62" cy="56" r="2"/></g>'],
 spider:['大蜘蛛','<g stroke="#3b2a2a" stroke-width="5" fill="none"><path d="M70 60l-40-20-10 30M70 64l-44 4-6 30M70 66l-36 24v20M70 60l40-20 10 30M70 64l44 4 6 30M70 66l36 24v20"/></g><ellipse cx="70" cy="64" rx="24" ry="20" fill="#5a4a6a"/><circle cx="62" cy="58" r="5" fill="#fff"/><circle cx="78" cy="58" r="5" fill="#fff"/><circle cx="62" cy="59" r="2.5"/><circle cx="78" cy="59" r="2.5"/>'],
 rock:['落石','<path d="M30 100l10-40 30-20 34 10 12 40-20 14H44z" fill="#9a908a"/><path d="M50 60l20 10 20-6M60 90l20-6" stroke="#7a706a" stroke-width="4" fill="none"/><g fill="#9a908a"><circle cx="20" cy="30" r="7"/><circle cx="110" cy="20" r="5"/></g>'],
 lizard:['火焰蜥蜴','<path d="M20 84q30-30 70-20l30 6-8 12-30 4q-30 10-62-2z" fill="#e86a3a"/><path d="M40 60q6-18 14 0 6-20 14 0 6-16 12 2" fill="#ffb03a"/><circle cx="104" cy="70" r="4" fill="#fff"/><circle cx="105" cy="70" r="2"/><path d="M40 88v14M80 88v14" stroke="#c84a2a" stroke-width="7"/>'],
 lava:['岩漿噴發','<path d="M20 110l30-50h40l30 50z" fill="#6a4a4a"/><path d="M60 60q-6-30 10-50 16 20 10 50z" fill="#ff7a2a"/><path d="M66 56q-2-20 4-30 6 10 4 30z" fill="#ffd23f"/><g fill="#ff7a2a"><circle cx="40" cy="30" r="6"/><circle cx="100" cy="36" r="5"/></g>'],
 eagle:['巨大老鷹','<path d="M10 60q30-30 60-6 30-24 60 6-30-6-40 10-8 16-20 16-12 0-20-16-10-16-40-10z" fill="#7a5a3a"/><circle cx="70" cy="50" r="12" fill="#fff"/><circle cx="74" cy="48" r="3"/><path d="M80 52l10 4-10 4z" fill="#ffc94a"/>']};
const ADV=[
 {id:1,n:'森林小徑',rec:1,foes:['dog','bee','mud'],coin:[15,35],danger:.4,bg:'linear-gradient(#cdeedd 0 55%,#8fd08a 55%)',deco:'#5fb04a',star:0},
 {id:2,n:'神秘洞穴',rec:4,foes:['bat','spider','rock'],coin:[40,80],danger:.5,bg:'linear-gradient(#5a4a6a 0 55%,#8a7a7a 55%)',deco:'#3a2a4a',star:1},
 {id:3,n:'火山秘境',rec:8,foes:['lizard','lava','eagle'],coin:[100,180],danger:.6,bg:'linear-gradient(#ffb08a 0 55%,#7a4a3a 55%)',deco:'#c84a2a',star:2}];
const ADV_DAY=3;
const fleeP=(p,a)=>Math.max(.05,Math.min(.92,.12+(a.rec+1-LVOF(p))*.13));
const advLeft=()=>{const d=daily();return ADV_DAY-(d.c.adv||0)};
function trailBg(a){const t=`<svg xmlns='http://www.w3.org/2000/svg' width='240' height='210'><g fill='${a.deco}' opacity='.55'><circle cx='40' cy='100' r='26'/><rect x='36' y='100' width='8' height='30'/><circle cx='170' cy='90' r='34'/><rect x='166' y='96' width='9' height='34'/></g><g fill='#fff' opacity='.35'><circle cx='110' cy='170' r='4'/><circle cx='210' cy='186' r='3'/></g></svg>`;
 return `background-image:url('data:image/svg+xml,${encodeURIComponent(t).replace(/'/g,'%27')}'),${a.bg}`}
function advShell(t,html){$('ovGame').classList.add('on');playing=true;$('gTitle').textContent=t;$('gBody').innerHTML=html}
function openAdv(){const p=P();if(!p){openAdopt('first');return}$('ovMenu').classList.remove('on');sfx('click');const lv=LVOF(p),left=advLeft();
 const blk=p.asleep?`${p.name}正在睡覺，等牠醒來再出發吧。`:(typeof petStatus==='function'&&['sick','dying'].includes(petStatus(p)))?`${p.name}現在病懨懨的，先讓牠好好睡一覺再去探險。`:'';
 advShell('寵物探險',`<div class="adv"><div style="display:flex;gap:10px;align-items:center">${thumb(p.sp,'happy','th')}<div><b>${esc(p.name)}</b>　Lv.${lv}<p class="small" style="margin:2px 0">等級越低，遇到危險越容易嚇得逃跑。今天還可以探險 ${left} / ${ADV_DAY} 次。</p></div></div>
  ${blk?`<p class="netnote">${esc(blk)}</p>`:''}
  <div class="advl">${ADV.map(a=>{const f=Math.round(fleeP(p,a)*100);return `<button type="button" class="advc" data-adv="${a.id}" ${left<=0||blk?'disabled':''}><span class="ic" style="${trailBg(a)}"><svg viewBox="0 0 140 120" style="width:46px">${FOES[a.foes[0]][1]}</svg></span><span><h3>${'★'.repeat(a.id)} ${a.n}</h3><p>建議 Lv.${a.rec} 以上・金幣 ${a.coin[0]}～${a.coin[1]}${a.star?`・星星 ${a.star}`:''}</p><p class="risk" style="color:${f>60?'#d8304a':f>30?'#d88a20':'#2a9a5c'}">遇到危險時逃跑機率約 ${f}%</p></span><b>出發</b></button>`}).join('')}</div>
  <div class="row"><button class="ghost" id="advX">回房間</button></div></div>`);
 $('advX').onclick=closeGames;$('gBody').querySelector('.advl').onclick=e=>{const b=e.target.closest('[data-adv]');if(!b||b.disabled)return;runAdv(p,ADV.find(a=>a.id==+b.dataset.adv))}}
function runAdv(p,a){const d=daily();d.c.adv=(d.c.adv||0)+1;save();let step=0,coins=0,food=[0,0,0,0],fled=false,timer=null,over=false;const N=5;
 advShell(`探險中：${a.n}`,`<div class="adv"><div class="steps">${Array.from({length:N},()=>'<i></i>').join('')}</div><div class="trail" id="trail"><div class="bgL" style="${trailBg(a)}"></div><div class="me" id="advMe">${sv(p.sp,'happy')}</div></div><div class="advlog" id="advLog"><p>${esc(p.name)}興奮地出發了！</p></div><div class="row" id="advBtns"></div></div>`);
 const log=t=>{const L=$('advLog');if(!L)return;L.insertAdjacentHTML('beforeend',`<p>${t}</p>`);L.scrollTop=1e4},tr=()=>$('trail');
 stopGame=()=>{over=true;clearTimeout(timer)};
 const next=()=>{if(over)return;if(step>=N||fled)return finish();const t=tr();if(!t)return;t.classList.remove('stop');t.querySelectorAll('.foe,.loot').forEach(x=>x.remove());timer=setTimeout(event,1500)};
 const mark=(cls)=>{const i=$('gBody').querySelectorAll('.steps i')[step];i&&i.classList.add(cls)};
 const event=()=>{if(over)return;const t=tr();if(!t)return;t.classList.add('stop');const r=Math.random();
  if(r<a.danger){const k=pick(a.foes),[fn,fs]=FOES[k];t.insertAdjacentHTML('beforeend',`<div class="foe"><svg viewBox="0 0 140 120">${fs}</svg></div>`);sfx('hit');log(`<b>遇到${fn}了！</b>`);
   $('advMe').innerHTML=sv(p.sp,'sad');
   timer=setTimeout(()=>{if(over)return;if(Math.random()<fleeP(p,a)){fled=true;$('advMe').classList.add('flee');log(`${esc(p.name)}嚇壞了，轉身逃跑了……（Lv.${LVOF(p)} 還太低）`);mark('bad');sfx('squeak');timer=setTimeout(finish,1300)}
    else{const c=Math.round((a.coin[0]+Math.random()*(a.coin[1]-a.coin[0]))/2);coins+=c;t.querySelector('.foe')?.classList.add('flee');$('advMe').innerHTML=sv(p.sp,'happy');log(`${esc(p.name)}勇敢地趕走了${fn}！撿到 ${c} 金幣`);mark('on');sfx('chime');step++;timer=setTimeout(next,1100)}},1300);return}
  if(r<a.danger+.25){const c=Math.round(a.coin[0]+Math.random()*(a.coin[1]-a.coin[0]));coins+=c;t.insertAdjacentHTML('beforeend',`<div class="loot">${COIN(16)} +${c}</div>`);log(`發現寶箱！裡面有 ${c} 金幣`);sfx('gift')}
  else{const tier=Math.min(3,Math.floor(Math.random()*(a.id+1)));food[tier]++;const nm=FOOD[SP[p.sp].grp][tier+1][0];t.insertAdjacentHTML('beforeend',`<div class="loot">${foodIcon(SP[p.sp].grp,tier+1,18)} ${esc(nm)}</div>`);log(`在路邊找到「${esc(nm)}」`);sfx('pop')}
  mark('on');step++;timer=setTimeout(next,1200)};
 const finish=()=>{if(over)return;over=true;stopGame=null;const ok=!fled,st=ok?a.star:0;if(ok)coins+=a.coin[1];
  earn(coins,1);food.forEach((n,i)=>S.inv[i]+=n);S.stars+=st;p.full=clamp(p.full-12);if(p.water!=null)p.water=clamp(p.water-12);
  if(ok){p.joy=clamp(p.joy+15);gain(6,p);p.advs=p.advs||{};if(!p.advs[a.id]){p.advs[a.id]=1;remember(p,`第一次走完「${a.n}」探險`)}}else{p.joy=clamp(p.joy-8);gain(1,p)}
  save();render();const t=tr();t&&t.classList.add('stop');
  log(ok?`<b>探險成功！</b>完成獎勵 ${a.coin[1]} 金幣${st?`、星星 ${st}`:''}`:`探險提早結束了。多陪牠玩、提升友好度等級，下次就更勇敢！`);
  log(`這次總共：${COIN(14)} ${coins}${food.some(Boolean)?'、'+food.map((n,i)=>n?`${FOOD[SP[p.sp].grp][i+1][0]}×${n}`:'').filter(Boolean).join('、'):''}`);
  $('advBtns').innerHTML=`<button class="ghost" id="advBack">再選一條路</button><button class="save" id="advHome">回房間</button>`;$('advBack').onclick=openAdv;$('advHome').onclick=closeGames;
  say(ok?`${p.name}：「探險好好玩！我是不是很勇敢？」`:`${p.name}：「嗚嗚……好可怕，下次我會更勇敢的！」`)};
 timer=setTimeout(next,600)}

// ---------- 體育館 ----------
const GYM_EV={h:{n:'110 米跨欄',u:'秒',ic:'<svg viewBox="0 0 44 44"><path d="M8 38V16h28v22" stroke="#d84a4a" stroke-width="4" fill="none"/><path d="M6 16h32" stroke="#fff" stroke-width="5"/><path d="M6 16h32" stroke="#3b2a2a" stroke-width="1"/></svg>'},
 j:{n:'標槍',u:'公尺',ic:'<svg viewBox="0 0 44 44"><path d="M6 38 38 6" stroke="#8a5634" stroke-width="4" stroke-linecap="round"/><path d="M38 6l-8 2 6 6z" fill="#9aa8ba"/></svg>'},
 l:{n:'跳遠',u:'公尺',ic:'<svg viewBox="0 0 44 44"><path d="M4 36h36" stroke="#e88a5a" stroke-width="4"/><path d="M8 30q14-26 30 0" stroke="#7aa8ff" stroke-width="3" stroke-dasharray="3 4" fill="none"/><rect x="28" y="32" width="14" height="6" rx="2" fill="#f2dca0"/></svg>'}};
const GYM_DAY=3,PRIZE=[3000,2000,1000];
const gymPts=(ev,v)=>Math.max(0,Math.round(ev==='h'?(40-v)*50:ev==='j'?v*13:v*120));
function weekOf(dayStr){const d=new Date(dayStr+'T12:00:00+08:00'),dow=(d.getUTCDay()+6)%7;return new Date(d.getTime()-dow*864e5).toISOString().slice(0,10)}
const curWeek=()=>weekOf(today()),prevWeek=()=>{const d=new Date(curWeek()+'T12:00:00+08:00');return new Date(d.getTime()-7*864e5).toISOString().slice(0,10)};
function gymState(){const w=curWeek();if(!S.gym||S.gym.week!==w){const o=S.gym;if(o&&o.week)S.gymPrev={week:o.week,total:Object.values(o.pts||{}).reduce((a,b)=>a+b,0),best:o.best||{},ts:Date.now()};S.gym={week:w,best:{},pts:{}}}return S.gym}
const gymTotal=()=>{const g=gymState();return Object.values(g.pts).reduce((a,b)=>a+b,0)};
const gymLeft=ev=>{const d=daily();return GYM_DAY-(d.c['gym_'+ev]||0)};
let GYMD={},gymSub=null;
function gymWatch(){if(gymSub||NET.state!=='online'||!NET.db)return;
 const cb=q=>{GYMD={};q.docs.forEach(d=>{GYMD[d.id]=d.data()});gymPrize();if($('gymLb'))$('gymLb').innerHTML=lbHtml()};
 try{gymSub=NET.mode==='firebase'?NET.db.collection('gym').where('week','in',[curWeek(),prevWeek()]).onSnapshot(cb,()=>{gymSub=null}):NET.db.collection('gym').onSnapshot(cb,()=>{gymSub=null})}catch(e){gymSub=null}}
async function gymPush(){if(NET.state!=='online'||NET.ro||!NET.db)return;const g=gymState(),p=P();
 const doc={nick:String(S.nick||'神秘玩家').slice(0,12),week:g.week,total:Math.min(20000,gymTotal()),best:g.best,sp:p?p.sp:'',pet:p?String(p.name).slice(0,12):'',ts:Date.now()};
 if(S.gymPrev&&S.gymPrev.week!==g.week)doc.prev=S.gymPrev;
 try{await NET.db.doc(`gym/${NET.uid}`).set(doc);GYMD[NET.uid]=doc}catch(e){}}
// 上週的成績：自己的 gym 文件被新的一週覆蓋前，保留在 prev
function rankOf(week){const rows=[];for(const [id,d] of Object.entries(GYMD)){if(!d)continue;if(d.week===week)rows.push({id,...d});else if(d.prev&&d.prev.week===week)rows.push({id,nick:d.nick,sp:d.sp,pet:d.pet,...d.prev})}
 if(NET.uid&&S.gymPrev&&S.gymPrev.week===week&&!rows.some(r=>r.id===NET.uid))rows.push({id:NET.uid,nick:S.nick,...S.gymPrev});
 return rows.filter(r=>r.total>0).sort((a,b)=>b.total-a.total||a.ts-b.ts)}
function gymPrize(){const pw=prevWeek();if(S.gymPrize===pw||!NET.uid)return;const r=rankOf(pw);if(!r.length)return;const i=r.slice(0,3).findIndex(x=>x.id===NET.uid);
 if(i<0){if(!r.some(x=>x.id===NET.uid))return;S.gymPrize=pw;save();return}
 S.gymPrize=pw;earn(PRIZE[i],1);save();render();confetti&&confetti();sfx('level');toast(`上週體育館排行第 ${i+1} 名！獲得 ${PRIZE[i]} 金幣 🏅`)}
function lbHtml(){const w=curWeek(),rows=rankOf(w).slice(0,20),me=NET.uid;
 if(NET.state!=='online')return '<p class="small">登入帳號後就能和全部玩家比賽，看到排行榜。</p>';
 if(!rows.length)return '<p class="small">這週還沒有人上榜，快來搶第一！</p>';
 return `<ol>${rows.map((r,i)=>`<li class="${r.id===me?'me':''}"><span class="md">${['🥇','🥈','🥉'][i]||i+1}</span><span>${esc(r.nick||'神秘玩家')}${r.pet?` <small class="small">與 ${esc(r.pet)}</small>`:''}</span><b>${r.total}</b></li>`).join('')}</ol>`}
function openGym(){$('ovMenu').classList.remove('on');if(!P()){openAdopt('first');return}sfx('click');gymWatch();const g=gymState(),pw=prevWeek(),prev=rankOf(pw).slice(0,3);
 advShell('寵物體育館',`<div class="gym"><p style="margin:0">和<b>全部玩家</b>比賽！每週一（台灣時間）重新計分，每項取本週最佳成績加總。<b>每週前三名</b>分別獲得 ${PRIZE.join('、')} 金幣。</p>
  <div class="gev">${Object.entries(GYM_EV).map(([k,e])=>`<button type="button" class="${gymLeft(k)>0?'save':'ghost'}" data-ev="${k}" ${gymLeft(k)>0?'':'disabled'}>${e.ic}${e.n}<small>最佳 ${g.best[k]!=null?g.best[k]+' '+e.u:'—'}・${g.pts[k]||0} 分</small><small>今天剩 ${gymLeft(k)} 次</small></button>`).join('')}</div>
  <div class="lb"><div class="row" style="margin:0 0 4px"><b>本週排行榜（${curWeek().slice(5).replace('-','/')} 起）</b><span>我的總分 <b>${gymTotal()}</b></span></div><div id="gymLb">${lbHtml()}</div></div>
  ${prev.length?`<p class="small">上週前三名：${prev.map((r,i)=>`${['🥇','🥈','🥉'][i]} ${esc(r.nick||'神秘玩家')}（${r.total}）`).join('　')}</p>`:''}
  <div class="row"><button class="ghost" id="gymX">回房間</button></div></div>`);
 $('gymX').onclick=closeGames;$('gBody').querySelector('.gev').onclick=e=>{const b=e.target.closest('[data-ev]');if(!b||b.disabled)return;const ev=b.dataset.ev,d=daily();d.c['gym_'+ev]=(d.c['gym_'+ev]||0)+1;save();
  ({h:gymHurdle,j:gymJav,l:gymJump})[ev](P(),res=>gymDone(ev,res))}}
function gymDone(ev,v){stopGame=null;const g=gymState(),e=GYM_EV[ev],pts=gymPts(ev,v||0),better=v!=null&&(g.best[ev]==null||(ev==='h'?v<g.best[ev]:v>g.best[ev]));
 if(better){g.best[ev]=v;g.pts[ev]=pts}const p=P();earn(10+Math.round(pts/100),1);gain(3,p);p.joy=clamp(p.joy+8);track('game');save();render();gymPush();
 $('gBody').innerHTML=`<div class="result">${sv(p.sp,v!=null?'happy':'calm','width:140px;border-radius:24px;background:'+SP[p.sp].bg)}<h2>${e.n}</h2><p style="margin:0;font-size:22px">${v!=null?`<b>${v}</b> ${e.u}・${pts} 分`:'犯規了！這次不算成績'}</p>${better?'<p class="say">刷新本週最佳紀錄！</p>':''}
  <p class="small">本週總分 ${gymTotal()}・金幣 +${10+Math.round(pts/100)}</p><div class="row" style="justify-content:center"><button class="ghost" id="gymBack">回體育館</button><button class="save" id="gymHome">回房間</button></div></div>`;
 $('gymBack').onclick=openGym;$('gymHome').onclick=closeGames;sfx(better?'level':'chime')}
function gymField(p,extra,ctl){$('gBody').innerHTML=`<div class="gym"><div class="ginfo" id="gInfo"></div><div class="field" id="fld">${extra||''}<div class="lane"></div><div class="runner" id="rn">${sv(p.sp,'happy')}</div></div>${ctl}</div>`}
// 110 米跨欄：一直點「跑」加速，看到欄架按「跳」
function gymHurdle(p,done){const H=Array.from({length:10},(_,i)=>13.72+i*9.14);let pos=0,v=0,air=0,t0=0,raf,last=0,over=false,hit={};const SC=7;
 gymField(p,H.map((_,i)=>`<div class="hur" id="h${i}"></div>`).join('')+'<div class="fin" id="fin"></div>',`<div class="gctl"><button class="ghost" id="bRun">跑！</button><button class="save" id="bJump">跳！</button></div><p class="small" style="margin:0">一直點「跑」加速（鍵盤：← →），靠近欄架時按「跳」（空白鍵）。撞到欄架會變慢。</p>`);
 const run=()=>{if(over)return;if(!t0){t0=performance.now();last=t0;raf=requestAnimationFrame(loop)}v=Math.min(11,v+.75);sfx('click')},jump=()=>{if(over||air>0||!t0)return;air=.62;sfx('swoosh')};
 $('bRun').onpointerdown=e=>{e.preventDefault();run()};$('bJump').onpointerdown=e=>{e.preventDefault();jump()};
 const key=e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();run()}if(e.key===' '||e.key==='ArrowUp'){e.preventDefault();jump()}};document.addEventListener('keydown',key);
 const loop=now=>{if(over)return;const dt=Math.min(.05,(now-last)/1000);last=now;v*=Math.pow(.55,dt);pos+=v*dt;if(air>0)air-=dt;
  H.forEach((h,i)=>{if(!hit[i]&&pos>=h-.2&&pos<=h+.4){hit[i]=1;if(air<=0){v*=.35;sfx('hit');animEl($('rn'),'shake',300)}}});
  const x=m=>15+(m-pos)*SC;H.forEach((h,i)=>{const el=$('h'+i);if(el){el.style.left=x(h)+'%';el.style.display=x(h)<-5||x(h)>105?'none':''}});const f=$('fin');f.style.left=x(110)+'%';f.style.display=x(110)>105?'none':'';
  $('rn').style.bottom=(24+(air>0?Math.sin((.62-air)/.62*Math.PI)*60:0))+'px';const t=(now-t0)/1000;
  $('gInfo').innerHTML=`<span>${pos.toFixed(1)} / 110 m</span><span>${t.toFixed(2)} 秒</span>`;
  if(pos>=110){over=true;document.removeEventListener('keydown',key);setTimeout(()=>done(Math.round(t*100)/100),600);return}
  if(t>60){over=true;document.removeEventListener('keydown',key);done(null);return}raf=requestAnimationFrame(loop)};
 $('gInfo').innerHTML='<span>0 / 110 m</span><span>點「跑」開始計時</span>';
 stopGame=()=>{over=true;cancelAnimationFrame(raf);document.removeEventListener('keydown',key)}}
// 標槍：先停力量，再停角度，三次取最好
function gymJav(p,done){let ph='pow',pow=0,ang=0,t0=performance.now(),raf,over=false,n=0,best=null;
 gymField(p,'<div class="jav" id="jv" style="left:30%;bottom:80px"></div>'+[20,40,60,80].map(m=>`<div class="mark" style="left:${20+m*.85}%">${m}m</div>`).join(''),`<div class="meter" id="mt"><i id="mi"></i></div><div class="gctl"><button class="save" id="bOk">停！</button></div><p class="small" style="margin:0" id="jHint"></p>`);
 const hint=()=>{$('jHint').textContent=ph==='pow'?`第 ${n+1} / 3 投：在力量最大的時候按「停」`:ph==='ang'?'再按一次決定角度（45 度左右飛最遠）':'';$('gInfo').innerHTML=`<span>第 ${n+1} / 3 投</span><span>最佳 ${best!=null?best+' m':'—'}</span>`};
 const loop=now=>{if(over)return;const t=(now-t0)/1000;if(ph==='pow'){pow=Math.abs(Math.sin(t*2.6))*100;$('mi').style.left=pow+'%'}else if(ph==='ang'){ang=Math.abs(Math.sin(t*1.9))*80;$('mi').style.left=(ang/80*100)+'%';$('jv').style.transform=`rotate(${-ang}deg)`}raf=requestAnimationFrame(loop)};
 const ok=()=>{if(over)return;if(ph==='pow'){ph='ang';t0=performance.now();sfx('click');hint();$('mt').style.background='linear-gradient(90deg,#e8507a,#ffd23f 45%,#9fd3c4 56%,#ffd23f 70%,#e8507a)';return}
  if(ph!=='ang')return;ph='fly';const dist=ang<5?0:Math.round(Math.pow(pow/100,1.1)*95*Math.sin(2*ang*Math.PI/180)*10)/10;sfx('swoosh');const jv=$('jv');
  jv.animate([{left:'30%',bottom:'80px'},{left:(30+dist*.35)+'%',bottom:(80+dist*.9)+'px',offset:.5},{left:Math.min(96,20+dist*.85)+'%',bottom:'26px'}],{duration:1300,easing:'ease-out',fill:'forwards'});
  setTimeout(()=>{if(over||!$('jv'))return;n++;if(dist>0&&(best==null||dist>best))best=dist;toast(dist>0?`飛了 ${dist} 公尺！`:'角度太低，犯規！');
   if(n>=3){over=true;cancelAnimationFrame(raf);setTimeout(()=>done(best),700);return}jv.getAnimations().forEach(a=>a.cancel());jv.style.transform='';ph='pow';t0=performance.now();$('mt').style.background='';hint()},1500)};
 $('bOk').onpointerdown=e=>{e.preventDefault();ok()};const key=e=>{if(e.key===' '){e.preventDefault();ok()}};document.addEventListener('keydown',key);
 hint();raf=requestAnimationFrame(loop);stopGame=()=>{over=true;cancelAnimationFrame(raf);document.removeEventListener('keydown',key)}}
// 跳遠：一直點加速，踩到起跳板前按「跳」，超過板子算犯規
function gymJump(p,done){let pos=0,v=0,t0=0,last=0,raf,over=false,n=0,best=null,ph='run';const BOARD=30,SC=4.2;
 gymField(p,'<div class="board" id="bd"></div><div class="pit" id="pit"></div>',`<div class="gctl"><button class="ghost" id="bRun">跑！</button><button class="save" id="bJump">跳！</button></div><p class="small" style="margin:0">一直點「跑」加速，在白色起跳板前一點點按「跳」，越接近板子越遠；踩過板子算犯規。三次取最好。</p>`);
 const reset=()=>{if(over||!$('rn'))return;pos=0;v=0;t0=0;ph='run';$('rn').style.bottom='24px';draw();$('gInfo').innerHTML=`<span>第 ${n+1} / 3 跳</span><span>最佳 ${best!=null?best+' m':'—'}</span>`};
 const draw=()=>{if(!$('bd'))return;const x=m=>15+(m-pos)*SC;$('bd').style.left=x(BOARD)+'%';$('pit').style.left=x(BOARD+1)+'%';$('pit').style.width=(9*SC)+'%'};
 const end=d=>{n++;if(d!=null&&(best==null||d>best))best=d;toast(d!=null?`跳了 ${d} 公尺！`:'犯規！踩過起跳板了');if(n>=3){over=true;cancelAnimationFrame(raf);setTimeout(()=>done(best),800)}else setTimeout(reset,1100)};
 const loop=now=>{if(over)return;const dt=Math.min(.05,(now-last)/1000);last=now;if(ph==='run'){v*=Math.pow(.6,dt);pos+=v*dt;draw();if(pos>BOARD+.3){ph='foul';sfx('squeak');end(null)}}raf=requestAnimationFrame(loop)};
 const run=()=>{if(over||ph!=='run')return;if(!t0){t0=last=performance.now()}v=Math.min(11,v+.8);sfx('click')};
 const jump=()=>{if(over||ph!=='run'||!t0)return;ph='jump';const off=BOARD-pos;if(off<0){end(null);return}const d=Math.max(0,Math.round((v*.82-off*.9)*100)/100);sfx('swoosh');
  const r=$('rn');r.animate([{bottom:'24px'},{bottom:'90px',offset:.5},{bottom:'20px'}],{duration:900,easing:'ease-in-out'});const st=pos,tgt=pos+off+d;const a0=performance.now();
  const fly=now=>{if(over)return;const k=Math.min(1,(now-a0)/900);pos=st+(tgt-st)*k;draw();if(k<1&&!over)requestAnimationFrame(fly);else end(d)};requestAnimationFrame(fly)};
 $('bRun').onpointerdown=e=>{e.preventDefault();run()};$('bJump').onpointerdown=e=>{e.preventDefault();jump()};
 const key=e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();run()}if(e.key===' '||e.key==='ArrowUp'){e.preventDefault();jump()}};document.addEventListener('keydown',key);
 reset();raf=requestAnimationFrame(t=>{last=t;loop(t)});stopGame=()=>{over=true;cancelAnimationFrame(raf);document.removeEventListener('keydown',key)}}
// 新的一週：保留上週成績給排行榜
{const g0=S.gym;if(g0&&g0.week&&g0.week!==curWeek()){S.gymPrev={week:g0.week,total:Object.values(g0.pts||{}).reduce((a,b)=>a+b,0),best:g0.best||{},ts:Date.now()}}}
setInterval(()=>{if(NET.state==='online'){gymWatch();if(S.gymPrev&&S.gymPushed!==curWeek()){S.gymPushed=curWeek();gymPush()}}},3000);
// 選單
MENU_EXTRA.splice(1,0,['adv','探險','<svg viewBox="0 0 40 40"><path d="M4 34 16 12l8 12 4-6 8 16z" fill="#5fb04a"/><path d="M16 12l3 5h-6z" fill="#fff"/><circle cx="31" cy="9" r="4" fill="#ffc94a"/></svg>',()=>openAdv()],
 ['gym','體育館','<svg viewBox="0 0 40 40"><path d="M12 6h16v8a8 8 0 0 1-16 0z" fill="#ffc94a"/><path d="M12 9H6q0 8 7 9M28 9h6q0 8-7 9" stroke="#ffc94a" stroke-width="3" fill="none"/><rect x="17" y="22" width="6" height="7" fill="#e0a020"/><rect x="11" y="29" width="18" height="5" rx="2" fill="#a8643a"/></svg>',()=>openGym()]);
