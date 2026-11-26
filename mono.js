// ===== 寵物小鎮（大富翁玩法）：和好友在同一張地圖上買地、收過路費、升級、賣出；每天擲骰 3 次 =====
const TOWN=[
 {t:'start',n:'起點'},{t:'prop',n:'甜點店',p:60,c:'#ff9fb4'},{t:'prop',n:'寵物公園',p:70,c:'#9fd3c4'},{t:'chance',n:'機會'},{t:'prop',n:'花店',p:80,c:'#ffb3d1'},
 {t:'prop',n:'咖啡廳',p:90,c:'#c9955a'},{t:'rest',n:'休息站'},{t:'prop',n:'麵包坊',p:100,c:'#f0c27a'},{t:'prop',n:'玩具店',p:110,c:'#7aa8ff'},{t:'chance',n:'機會'},
 {t:'prop',n:'水族館',p:130,c:'#7ac8f0'},{t:'prop',n:'圖書館',p:140,c:'#b58cff'},{t:'prop',n:'美容院',p:150,c:'#ff7c9c'},{t:'rest',n:'休息站'},{t:'prop',n:'遊樂園',p:170,c:'#ffc94a'},
 {t:'chance',n:'機會'},{t:'prop',n:'摩天輪',p:190,c:'#5fc9ae'},{t:'prop',n:'溫泉旅館',p:210,c:'#e8a07a'},{t:'prop',n:'寵物醫院',p:230,c:'#9fc8f0'},{t:'prop',n:'城堡',p:260,c:'#e8507a'}];
const rentOf=(i,lv)=>Math.round(TOWN[i].p*.2*lv),upCost=i=>Math.round(TOWN[i].p*.6);
// 6×6 外圈 20 格：從左上角順時針
const CELL=[...Array(6).keys()].map(c=>[0,c]).concat([1,2,3,4,5].map(r=>[r,5]),[4,3,2,1,0].map(c=>[5,c]),[4,3,2,1].map(r=>[r,0]));
document.head.insertAdjacentHTML('beforeend',`<style>
#ovTown{padding:0}
.twrap{background:var(--bg);width:min(760px,100%);height:100%;overflow:auto;display:flex;flex-direction:column}
.tboard{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));grid-template-rows:repeat(6,minmax(0,1fr));gap:4px;aspect-ratio:1/1;width:min(100%,560px);margin:0 auto;padding:4px}
.tcell{position:relative;background:var(--card);border-radius:10px;border:2px solid var(--line);font-size:10px;line-height:1.15;padding:3px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;overflow:hidden;text-align:center}
.tcell .band{height:6px;width:100%;border-radius:4px;margin-bottom:2px}
.tcell b{font-weight:700;font-size:11px}
.tcell small{color:var(--mute);font-size:10px}
.tcell.mine{border-color:var(--berry);background:light-dark(#fff0f4,#3a2433)}
.tcell.theirs{border-color:#7aa8ff;background:light-dark(#eef4ff,#24304a)}
.tcell.here{box-shadow:0 0 0 3px #ffc94a}
.tcell .houses{display:flex;gap:1px;margin-top:1px}.tcell .houses i{width:7px;height:7px;background:#5fb04a;border-radius:2px}
.tcell .tok{position:absolute;bottom:2px;display:flex;gap:1px;left:50%;translate:-50% 0}
.tcell .tok svg{width:22px;height:21px;border-radius:50%;background:#fff;box-shadow:0 1px 3px #0004}
.tcell .tok svg.me{width:28px;height:27px;outline:2px solid var(--berry)}
.tcenter{grid-row:2/6;grid-column:2/6;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:8px;text-align:center;background:light-dark(#fff8ee,#2a2030);border-radius:16px}
.tdice{width:64px;height:64px;border-radius:16px;background:#fff;box-shadow:0 6px 0 #e0d0c4,0 8px 14px -6px #0004;display:flex;align-items:center;justify-content:center;font:700 34px "Huninn",sans-serif;color:var(--berry)}
.tdice.roll{animation:droll .5s linear}@keyframes droll{50%{transform:rotate(180deg) scale(1.15)}}
.tcenter .save{min-height:44px}
.tlog{font-size:13px;min-height:2.6em;margin:0}
.tmine{padding:10px 14px;display:flex;flex-direction:column;gap:6px}
.tmine .row{margin:0}
.tprop{display:grid;grid-template-columns:10px minmax(0,1fr) auto auto;gap:8px;align-items:center;background:var(--card);border-radius:12px;padding:6px 10px;font-size:14px}
.tprop i{width:10px;height:24px;border-radius:4px}
.tprop button{min-height:34px;padding:2px 10px;font-size:13px}
@media(max-width:420px){.tcell b{font-size:9.5px}.tcell small{display:none}.tdice{width:52px;height:52px;font-size:28px}}
</style>`);
document.body.insertAdjacentHTML('beforeend',`<div class="ov" id="ovTown"><div class="twrap">
 <div class="ghead"><h2 style="margin:0;font-size:22px">寵物小鎮</h2><button class="ghost" id="tExit" style="background:var(--card)">回房間</button></div>
 <p class="small" style="margin:8px 14px 0">大富翁玩法：和好友在同一張地圖上買店面、收過路費。每天可以擲骰 3 次，經過起點 +50 金幣。</p>
 <div class="tboard" id="tBoard"></div>
 <div class="tmine"><div class="row"><h3 style="margin:0">我的店面</h3><span class="small" id="tWorth"></span></div><div id="tProps"></div></div>
</div></div>
<div class="ov" id="ovTAsk" style="z-index:16"><div class="dlg"><h2 id="taT"></h2><p id="taP"></p><div class="row" style="justify-content:center" id="taB"></div></div></div>`);
function townInit(){if(!S.mono||typeof S.mono!=='object')S.mono={pos:0,props:{}};if(!S.mono.props)S.mono.props={};if(typeof S.mono.pos!=='number')S.mono.pos=0}
function rollsLeft(){if(!S.monoDay||S.monoDay.day!==today())S.monoDay={day:today(),n:0};return 3-S.monoDay.n}
// 誰擁有哪一格：自己和好友中最早買下的人
function owners(){townInit();const own={};const claim=(uid,props)=>{for(const [i,v] of Object.entries(props||{})){if(!TOWN[i]||TOWN[i].t!=='prop'||!v)continue;const ts=Number(v.ts)||0,lv=Math.max(1,Math.min(3,Number(v.lv)||1));if(!own[i]||ts<own[i].ts)own[i]={uid,ts,lv}}};
 claim('me',S.mono.props);if(NET.state==='online')for(const f of S.friends){const h=netHome(f);if(h&&h.mono)claim(f,h.mono.props)}
 // 自己晚買到的店面：退錢
 for(const [i,v] of Object.entries(S.mono.props))if(own[i]&&own[i].uid!=='me'){const back=TOWN[i].p+upCost(i)*((v.lv||1)-1);S.coins+=back;delete S.mono.props[i];toast(`「${TOWN[i].n}」好友比你早一步買下了，退回 ${back} 金幣`);save()}
 return own}
function renderTown(){townInit();const own=owners(),me=P();
 const toks={};const addTok=(pos,sp,isMe)=>{(toks[pos]=toks[pos]||[]).push(`<svg viewBox="0 0 200 190" class="${isMe?'me':''}">${petSvg(sp,'happy')}</svg>`)};
 if(NET.state==='online')for(const f of S.friends){const h=netHome(f);if(h&&h.mono&&Array.isArray(h.pets)&&h.pets[0]&&SP[h.pets[0].sp])addTok(Math.max(0,Math.min(19,Number(h.mono.pos)||0)),h.pets[0].sp,false)}
 if(me)addTok(S.mono.pos,me.sp,true);
 const cells=TOWN.map((t,i)=>{const [r,c]=CELL[i],o=own[i];const cls=o?(o.uid==='me'?'mine':'theirs'):'';
  return `<div class="tcell ${cls} ${S.mono.pos===i?'here':''}" style="grid-row:${r+1};grid-column:${c+1}">${t.t==='prop'?`<span class="band" style="background:${t.c}"></span>`:''}<b>${t.n}</b>${t.t==='prop'?(o?`<small>${o.uid==='me'?'我的':esc(nickOf(o.uid))}</small><span class="houses">${'<i></i>'.repeat(o.lv)}</span>`:`<small>${t.p} 金幣</small>`):t.t==='start'?'<small>+50</small>':t.t==='chance'?'<small>？</small>':'<small>休息</small>'}${toks[i]?`<span class="tok">${toks[i].join('')}</span>`:''}</div>`}).join('');
 const left=rollsLeft();
 $('tBoard').innerHTML=cells+`<div class="tcenter"><div class="tdice" id="tDice">${S.mono.last||'?'}</div><button class="save" id="tRoll" ${left>0&&me?'':'disabled'}>${left>0?`擲骰子（今天還有 ${left} 次）`:'今天的骰子用完了'}</button><p class="tlog" id="tLog">${esc(S.mono.log||'看看會走到哪裡！')}</p><span class="small">${COIN(14)} 金幣 ${S.coins}</span></div>`;
 const mine=Object.entries(S.mono.props);let worth=0;
 $('tProps').innerHTML=mine.length?mine.map(([i,v])=>{const lv=v.lv||1,inv=TOWN[i].p+upCost(i)*(lv-1),sell=Math.round(inv*.6);worth+=inv;return `<div class="tprop"><i style="background:${TOWN[i].c}"></i><span>${TOWN[i].n}・${lv} 級<br><span class="small">過路費 ${rentOf(i,lv)}</span></span>${lv<3?`<button class="ghost" data-up="${i}">升級 ${upCost(i)}</button>`:'<span class="small">最高級</span>'}<button class="ghost" data-sell="${i}">賣出 +${sell}</button></div>`}).join(''):'<p class="small" style="margin:0">還沒有店面。走到沒人買的店，就可以買下來！</p>';
 $('tWorth').textContent=mine.length?`總價值 ${worth} 金幣`:'';
 $('tRoll').onclick=roll}
function tlog(t){S.mono.log=t;const l=$('tLog');if(l)l.textContent=t}
function ask(title,text,btns){return new Promise(res=>{$('taT').textContent=title;$('taP').textContent=text;$('taB').innerHTML=btns.map(([k,n,cls])=>`<button class="${cls||'ghost'}" data-k="${k}">${n}</button>`).join('');
 $('taB').onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;$('ovTAsk').classList.remove('on');res(b.dataset.k)};$('ovTAsk').classList.add('on')})}
let rolling=false;
async function roll(){if(rolling||rollsLeft()<=0||!P())return;rolling=true;S.monoDay.n++;const d=1+Math.floor(Math.random()*6);
 const dice=$('tDice');dice.classList.remove('roll');void dice.offsetWidth;dice.classList.add('roll');sfx('drum');
 for(let k=0;k<6;k++){await new Promise(r=>setTimeout(r,70));dice.textContent=1+Math.floor(Math.random()*6)}dice.textContent=d;S.mono.last=d;
 for(let s=0;s<d;s++){await new Promise(r=>setTimeout(r,230));S.mono.pos=(S.mono.pos+1)%20;if(S.mono.pos===0){earn(50,1);tlog('經過起點，拿到 50 金幣！');sfx('coin')}sfx('click');renderTown()}
 await land(S.mono.pos);save();netFlush(S);rolling=false;renderTown()}
async function land(i){const t=TOWN[i],own=owners()[i],p=P();
 if(t.t==='start'){tlog('剛好停在起點，休息一下～');return}
 if(t.t==='rest'){p.joy=clamp(p.joy+5);tlog(`在休息站喝杯茶，${p.name}開心 +5`);return}
 if(t.t==='chance'){const r=Math.random();
  if(r<.35){const n=30+Math.floor(Math.random()*6)*10;earn(n,1);tlog(`機會：在路上撿到 ${n} 金幣！`);sfx('coin')}
  else if(r<.55){const n=Math.min(S.coins,20+Math.floor(Math.random()*4)*10);S.coins-=n;tlog(`機會：請大家吃冰淇淋，花了 ${n} 金幣`);sfx('pop')}
  else if(r<.75){const k=Math.floor(Math.random()*4);S.inv[k]++;tlog(`機會：抽中特別飼料「${FOOD[SP[p.sp].grp][k+1][0]}」！`);sfx('gift')}
  else{gain(3,p);p.joy=clamp(p.joy+8);tlog(`機會：${p.name}在廣場跳舞，大家都拍手！友好度 +3`);sfx('chime')}
  return}
 // 店面
 if(!own){if(S.coins<t.p){tlog(`「${t.n}」要 ${t.p} 金幣，錢不夠，下次再來買`);return}
  const k=await ask(`要買下「${t.n}」嗎？`,`價格 ${t.p} 金幣，買下後好友踩到要付你 ${rentOf(i,1)} 金幣過路費。你現在有 ${S.coins} 金幣。`,[['no','先不要'],['buy','買下來','save']]);
  if(k==='buy'){S.coins-=t.p;S.mono.props[i]={lv:1,ts:Date.now()};tlog(`買下了「${t.n}」！`);sfx('gift');if(!S.firstShop){S.firstShop=1;remember(p,`在寵物小鎮買下第一間店：${t.n}`)}}else tlog(`路過「${t.n}」`);return}
 if(own.uid==='me'){const v=S.mono.props[i];if(v.lv>=3){tlog(`回到自己的「${t.n}」，生意很好！`);return}
  const c=upCost(i);if(S.coins<c){tlog(`回到自己的「${t.n}」，升級要 ${c} 金幣`);return}
  const k=await ask(`升級「${t.n}」？`,`花 ${c} 金幣升到 ${v.lv+1} 級，過路費變成 ${rentOf(i,v.lv+1)} 金幣。`,[['no','先不要'],['up','升級','save']]);
  if(k==='up'){S.coins-=c;v.lv++;tlog(`「${t.n}」升到 ${v.lv} 級了！`);sfx('level')}return}
 const fee=Math.min(S.coins,rentOf(i,own.lv)),who=nickOf(own.uid);S.coins-=fee;tlog(`走到 ${who} 的「${t.n}」，付了 ${fee} 金幣過路費`);sfx('hit');
 if(fee>0)netSend({to:own.uid,type:'msg',act:'rent',amt:fee,text:`在寵物小鎮走到你的「${t.n}」，付了 ${fee} 金幣過路費`})}
$('tProps').onclick=async e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.sell){const i=b.dataset.sell,v=S.mono.props[i],inv=TOWN[i].p+upCost(i)*((v.lv||1)-1),back=Math.round(inv*.6);
  const k=await ask(`賣掉「${TOWN[i].n}」？`,`可以拿回 ${back} 金幣，賣掉後別人就可以買。`,[['no','不賣'],['sell','賣出','save']]);
  if(k==='sell'){delete S.mono.props[i];earn(back,1);tlog(`賣掉「${TOWN[i].n}」，拿回 ${back} 金幣`);sfx('coin');save();netFlush(S)}}
 if(b.dataset.up){const i=b.dataset.up,v=S.mono.props[i],c=upCost(i);if(S.coins<c){toast('金幣不夠喔');return}S.coins-=c;v.lv=Math.min(3,(v.lv||1)+1);tlog(`「${TOWN[i].n}」升到 ${v.lv} 級了！`);sfx('level');save();netFlush(S)}
 renderTown()};
function openTown(){if(!P()){openAdopt('first');return}townInit();renderTown();$('ovTown').classList.add('on');sfx('chime')}
$('tExit').onclick=()=>{$('ovTown').classList.remove('on');render()};
// 收到好友付的過路費
const _pinT=processInbox;processInbox=function(){_pinT();if(NET.state!=='online')return;let got=0;const who=new Set();
 for(const m of netInbox(NET.uid)){if(m.act!=='rent'||S.seenIn.includes(m.id))continue;S.seenIn.push(m.id);const n=Math.max(0,Math.min(500,Number(m.amt)||0));got+=n;who.add(nickOf(m.from))}
 if(got){S.coins+=got;save();renderWorldUI();const w=[...who];toast(`${w[0]}${w.length>1?` 等 ${w.length} 人`:''}在寵物小鎮付給你 ${got} 金幣過路費！`);sfx('coin')}};
// 選單加入「寵物小鎮」
MENU_EXTRA.splice(1,0,['town','寵物小鎮','<svg viewBox="0 0 40 40"><rect x="5" y="5" width="30" height="30" rx="6" fill="#fff" stroke="#e8507a" stroke-width="3"/><circle cx="14" cy="14" r="3" fill="#e8507a"/><circle cx="26" cy="26" r="3" fill="#e8507a"/><circle cx="20" cy="20" r="3" fill="#e8507a"/></svg>',()=>openTown()]);
// 好友那邊會看到我的位置和店面
townInit();
