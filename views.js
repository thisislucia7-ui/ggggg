// ===== 分頁式介面：客廳（首頁）、餐廳、浴室、遊戲室、任務、回憶；三橫線選單；好友家互動與 PK =====
const VIEWS={
 home:{n:'客廳',d:'動物的家和心情留言板',ic:'<svg viewBox="0 0 40 40"><path d="M6 19 20 7l14 12v15H6z" fill="#ff9fb4"/><rect x="16" y="23" width="8" height="11" rx="2" fill="#fff"/><path d="M3 20 20 5l17 15" stroke="#e8507a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>'},
 dining:{n:'餐廳',d:'選飼料餵牠吃飯',room:'dining',ic:'<svg viewBox="0 0 40 40"><path d="M4 18h32a16 14 0 0 1-32 0z" fill="#f0a04b"/><g fill="#c97a2a"><circle cx="14" cy="16" r="4"/><circle cx="21" cy="14" r="4"/><circle cx="27" cy="17" r="3.5"/></g></svg>'},
 bath:{n:'浴室',d:'洗澡、擦乾、梳毛',room:'bath',ic:'<svg viewBox="0 0 40 40"><path d="M5 20h30v6a8 8 0 0 1-8 8H13a8 8 0 0 1-8-8z" fill="#7ac8f0"/><circle cx="14" cy="14" r="5" fill="#eaf6ff" stroke="#7ac8f0" stroke-width="2"/><circle cx="24" cy="10" r="4" fill="#eaf6ff" stroke="#7ac8f0" stroke-width="2"/></svg>'},
 play:{n:'遊戲室',d:'玩具、互動、小遊戲',room:'play',ic:'<svg viewBox="0 0 40 40"><rect x="4" y="12" width="32" height="18" rx="9" fill="#b58cff"/><path d="M12 17v8M8 21h8" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="27" cy="19" r="2.5" fill="#fff"/><circle cx="31" cy="24" r="2.5" fill="#fff"/></svg>'},
 tasks:{n:'任務與禮物',d:'每日任務、每日禮物、小秘密',ic:'<svg viewBox="0 0 40 40"><rect x="8" y="16" width="24" height="18" rx="3" fill="#ff7c9c"/><rect x="6" y="11" width="28" height="7" rx="2" fill="#e8507a"/><rect x="18" y="11" width="4" height="23" fill="#ffc94a"/><path d="M20 11c-6-8-14-4-9 0zM20 11c6-8 14-4 9 0z" fill="#ffc94a"/></svg>'},
 memories:{n:'回憶相簿',d:'一起走過的重要時刻',ic:'<svg viewBox="0 0 40 40"><rect x="6" y="7" width="24" height="26" rx="2" fill="#fff" stroke="#c9a070" stroke-width="2.5" transform="rotate(-8 18 20)"/><rect x="11" y="9" width="24" height="26" rx="2" fill="#fff" stroke="#c9a070" stroke-width="2.5"/><path d="M23 26c-4-3-6-5-6-7a2.5 2.5 0 0 1 6-1 2.5 2.5 0 0 1 6 1c0 2-2 4-6 7z" fill="#ff7c9c"/></svg>'}};
const MENU_EXTRA=[
 ['shop','佈置房間','<svg viewBox="0 0 40 40"><path d="M8 30l14-14 4 4-14 14H8z" fill="#ffc94a"/><path d="M24 14l4-4 4 4-4 4z" fill="#e8507a"/></svg>',()=>$('btnShop').click()],
 ['friends','好友','<svg viewBox="0 0 40 40"><circle cx="14" cy="14" r="6" fill="#7aa8ff"/><circle cx="27" cy="15" r="5" fill="#5fc9ae"/><path d="M3 32c1-7 6-11 11-11s10 4 11 11z" fill="#7aa8ff"/><path d="M20 32c1-6 4-9 7-9s7 3 8 9z" fill="#5fc9ae"/></svg>',()=>openFriends()],
 ['msgs','訊息','<svg viewBox="0 0 40 40"><rect x="4" y="9" width="32" height="22" rx="5" fill="#b58cff"/><path d="M5 11l15 11 15-11" stroke="#fff" stroke-width="2.5" fill="none"/></svg>',()=>openMsgs()],
 ['me','個人資訊','<svg viewBox="0 0 40 40"><circle cx="20" cy="14" r="7" fill="#ffc94a"/><path d="M6 34c1-8 7-12 14-12s13 4 14 12z" fill="#ffc94a"/></svg>',()=>openProfile()]];
let view='home';
const CARE_VIEW={bath:'bath',towel:'bath',brush:'bath',sleep:'play',chat:'play'};
const ACT={dining:'餵食',bath:'洗澡與照顧',play:'玩耍與小遊戲'};
function drawer(open){document.querySelector('.panel').classList.toggle('open',!!open)}
function applyView(){document.body.dataset.view=view;document.body.classList.toggle('act',!!ACT[view]);
 if(ACT[view]){$('drawLab').textContent=ACT[view];drawer(true)}else drawer(false);
 document.querySelectorAll('[data-v]').forEach(el=>{el.hidden=!el.dataset.v.split(' ').includes(view)});
 document.querySelectorAll('#care [data-c]').forEach(b=>{b.hidden=CARE_VIEW[b.dataset.c]!==view});
 $('careLab').textContent=view==='bath'?'照顧':'互動';
 const panelExtra=view==='home'||view==='tasks'||view==='memories';
 document.querySelector('.panel').classList.toggle('mini',panelExtra);
 const V=VIEWS[view];$('viewTitle').innerHTML=`${V.ic.replace('<svg','<svg width="30" height="30"')}<span>${V.n}</span><button type="button" class="ghost" id="backHome">回客廳</button>`;
 if($('backHome'))$('backHome').onclick=()=>setView('home');
 if(view==='play')renderGamesInline();
 renderWorldUI()}
function setView(v){if(!VIEWS[v]||!P()&&v!=='home')return;const prev=VIEWS[view].room,next=VIEWS[v].room;view=v;$('ovMenu').classList.remove('on');sfx('click');
 if(next){viewRoom=next;goRoom(next,[P()])}else if(prev||inRoom){viewRoom=null;goHome(0)}
 applyView();
 const t=v==='tasks'?$('tasksSec'):v==='memories'?$('memSec'):v==='play'?null:null;
 if(t)setTimeout(()=>t.scrollIntoView({behavior:'smooth',block:'start'}),120);else scrollTo({top:0,behavior:'smooth'})}
function renderMenu(){const unread=NET.state==='online'?netInbox(NET.uid).filter(x=>x.ts>(S.lastRead||0)).length:0;
 $('menuGrid').innerHTML=Object.entries(VIEWS).map(([k,V])=>`<button type="button" data-view="${k}" aria-current="${k===view?'page':'false'}">${V.ic}${V.n}</button>`).join('')+
  MENU_EXTRA.map(([k,n,ic])=>`<button type="button" data-extra="${k}">${ic}${n}${k==='msgs'&&unread?`<i>${unread}</i>`:''}</button>`).join('')}
$('fab').onclick=()=>{renderMenu();$('ovMenu').classList.add('on');sfx('click')};
$('menuClose').onclick=()=>$('ovMenu').classList.remove('on');
$('ovMenu').onclick=e=>{if(e.target.id==='ovMenu')$('ovMenu').classList.remove('on')};
$('menuGrid').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.view){if(!P()){$('ovMenu').classList.remove('on');openAdopt('first');return}setView(b.dataset.view)}
 else{$('ovMenu').classList.remove('on');const x=MENU_EXTRA.find(m=>m[0]===b.dataset.extra);x&&x[3]()}};
$('btnMood2').onclick=()=>{sfx('click');openMood()};
// 換寵物時，若在餐廳或浴室，新寵物也一起過去
$('slots').addEventListener('click',()=>{if(viewRoom)setTimeout(()=>{if(viewRoom&&P())goRoom(viewRoom,[P()])},450)},true);
// 遊戲室：小遊戲卡片直接放在頁面上
function renderGamesInline(){if(!P())return;$('gamesNote').textContent=`每個遊戲每天可以玩 3 次。贏了有飼料、星星和金幣。`;
 $('gamesInline').innerHTML=GAMES.map(g=>{const l=playsLeft(g.id);return `<div class="gcard">${ART[g.id]()}<h3>${g.n}</h3><p>${g.d}</p><p class="rw">${g.reward}</p><p class="left">今天還可以玩 ${l} / 3 次</p><button class="save" data-gi="${g.id}" ${l>0?'':'disabled'}>${l>0?'開始':'明天再來'}</button></div>`}).join('')}
$('gamesInline').onclick=e=>{const b=e.target.closest('[data-gi]');if(!b||b.disabled)return;openGames();const s=$('gBody').querySelector(`[data-g="${b.dataset.gi}"]`);s&&s.click()};
const _close=closeGames;closeGames=function(){_close();if(view==='play')renderGamesInline()};
$('gExit').onclick=closeGames;
const _rwu=renderWorldUI;renderWorldUI=function(){_rwu();const n=NET.state==='online'?netInbox(NET.uid).filter(x=>x.ts>(S.lastRead||0)).length:0;$('fabBadge').textContent=n||'';$('fabBadge').hidden=!n};
document.querySelector('.panel').insertAdjacentHTML('afterbegin','<button type="button" class="drawhandle" id="drawHandle" aria-label="拉出或收起選單"><span class="grab"></span><span class="lab"><b id="drawLab">選單</b><svg viewBox="0 0 20 20"><path d="M5 12l5-5 5 5" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg></span></button>');
$('drawHandle').onclick=()=>{sfx('click');drawer(!document.querySelector('.panel').classList.contains('open'))};
// 按下動作後收起抽屜，讓你看清楚動畫
document.querySelector('.panel').addEventListener('click',e=>{if(!document.body.classList.contains('act'))return;if(e.target.closest('#btnFeed,#btnPlay,#btnFeedAll,#btnBathAll,#care [data-c]'))setTimeout(()=>drawer(false),60)});
// 在舞台上往上滑也能拉出抽屜
{let y0=null;document.querySelector('.panel').addEventListener('touchstart',e=>{y0=e.touches[0].clientY},{passive:true});document.querySelector('.panel').addEventListener('touchend',e=>{if(y0==null||!document.body.classList.contains('act'))return;const dy=e.changedTouches[0].clientY-y0;if(e.target.closest('.drawhandle')){if(dy<-30)drawer(true);if(dy>30)drawer(false)}y0=null},{passive:true})}
document.head.insertAdjacentHTML('beforeend','<style>.panel.mini>div:not(.pname):not(.meter){display:none}.panel>*{order:2}.panel>.pname{order:0}body:not([data-view=home]) .panel>.meter{order:5}</style>');

// ---------- 好友家：摸摸、餵點心、寵物 PK ----------
let vPets=[],vSel=0;
function vlog(fid){if(!S.vlog||S.vlog.day!==today())S.vlog={day:today(),pk:0};S.vlog[fid]=S.vlog[fid]||{pat:0,feed:0};return S.vlog[fid]}
function vRefresh(){if(!visitId)return;const L=vlog(visitId),ro=NET.ro||!vPets.length;
 $('vPatN').textContent=`今天還可以 ${Math.max(0,3-L.pat)} 次`;$('vFeedN').textContent=`今天還可以 ${Math.max(0,2-L.feed)} 次`;$('vPKN').textContent=`今天還可以 ${Math.max(0,3-S.vlog.pk)} 次`;
 $('vPat').disabled=ro||L.pat>=3;$('vFeed').disabled=ro||L.feed>=2;$('vPK').disabled=ro||S.vlog.pk>=3||!P();
 $('vPets').querySelectorAll('.pw').forEach((el,i)=>el.classList.toggle('sel',i===vSel));
 $('vSelNote').textContent=vPets[vSel]?`目前選擇：${String(vPets[vSel].name||'').slice(0,10)}（點別隻可以換）`:'這位好友還沒有寵物'}
const _ov=openVisit;openVisit=function(fid){_ov(fid);const h=netHome(fid);vPets=(h&&Array.isArray(h.pets)?h.pets:[]).filter(p=>p&&SP[p.sp]).slice(0,6);vSel=0;
 const prev=$('vPets').onclick;$('vPets').onclick=e=>{prev&&prev(e);const el=e.target.closest('[data-vi]');if(el){vSel=+el.dataset.vi;vRefresh()}};vRefresh()};
const vName=()=>String((vPets[vSel]||{}).name||'').slice(0,10);
const vEl=()=>$('vPets').querySelectorAll('.pw')[vSel];
function vHearts(n){const st=$('vStage'),el=vEl();const x=el?parseFloat(el.style.left)||50:50;for(let k=0;k<n;k++)setTimeout(()=>{const d=document.createElement('div');d.className='fx';d.innerHTML=heart(pick(['var(--berry)','#ffc94a','#ff9fb4']));d.style.left=(x-8+Math.random()*16)+'%';d.style.top='40%';st.append(d);setTimeout(()=>d.remove(),1500)},k*120)}
async function vSend(act,text,extra){const p=vPets[vSel];return netSend({to:visitId,type:'msg',act,pid:String(p.id||''),pname:vName(),text,...(extra||{})})}
$('vPat').onclick=async()=>{const p=vPets[vSel];if(!p)return;const L=vlog(visitId);if(L.pat>=3)return;
 const Q=PERS[p.pers]||null,bitten=Q&&Math.random()<Q.bite;animEl(vEl()?.querySelector('.pet'),bitten?'shake':'purr',1100);sfx(bitten?'hit':'heart');
 $('vBubble').textContent=bitten?`${vName()}：「啊嗚！」（被輕輕咬了一口，牠還不太熟你）`:`${vName()}：「${pick(['好舒服～謝謝你！','再摸一下嘛～','你的手好溫暖！'])}」`;if(!bitten)vHearts(4);
 $('vPat').disabled=true;const ok=await vSend('pet',bitten?`想摸摸你家的${vName()}，結果被輕輕咬了一口！`:`摸了摸你家的${vName()}，牠好開心！`);
 if(ok){L.pat++;save();renderBoard()}else toast('送不出去，可能你目前只有瀏覽權限');vRefresh()};
$('vFeed').onclick=async()=>{const p=vPets[vSel];if(!p)return;const L=vlog(visitId);if(L.feed>=2)return;const grp=SP[p.sp].grp,f=FOOD[grp][0][0];
 const st=$('vStage'),el=vEl(),x=el?parseFloat(el.style.left)||50:50;const b=document.createElement('div');b.className='bowl';b.style.cssText=`left:${x}%;bottom:2%;width:14%;margin-left:-7%;z-index:4`;
 b.innerHTML=`<svg viewBox="0 0 120 60" width="100%"><ellipse cx="60" cy="20" rx="56" ry="12" fill="#c25a7a"/><path d="M4 20q4 38 56 38t56-38z" fill="#e8507a"/><ellipse cx="60" cy="20" rx="46" ry="8" fill="#8a3050"/></svg><div class="food">${foodIcon(grp,0,60)}</div>`;st.append(b);
 setTimeout(()=>{animEl(el?.querySelector('.pet'),'munch',1800);b.querySelector('.food').classList.add('eat');sfx('eat')},600);setTimeout(()=>{b.classList.add('out');setTimeout(()=>b.remove(),500)},2200);
 $('vBubble').textContent=`${vName()}：「${f}好好吃！謝謝你～」`;$('vFeed').disabled=true;const ok=await vSend('feed',`餵你家的${vName()}吃了${f}`);
 if(ok){L.feed++;save();setTimeout(renderBoard,900)}else toast('送不出去，可能你目前只有瀏覽權限');setTimeout(vRefresh,900)};
// PK 友誼賽：撲撲 > 裝可愛 > 閃閃 > 撲撲
const MV={pounce:'撲撲',dodge:'閃閃',cute:'裝可愛'},BEATS={pounce:'cute',cute:'dodge',dodge:'pounce'};
const PKW={grumpy:{pounce:3,dodge:1,cute:1},tsun:{pounce:2,dodge:2,cute:1},clingy:{pounce:1,dodge:1,cute:3},shy:{pounce:1,dodge:3,cute:1},playful:{pounce:2,dodge:2,cute:2},foodie:{pounce:2,dodge:1,cute:2},lazy:{pounce:1,dodge:2,cute:2},neat:{pounce:1,dodge:2,cute:2},aloof:{pounce:1,dodge:3,cute:1}};
let pk=null;
const pkHearts=n=>heartsHtml(n,3);
function pkDraw(){$('pkMe').innerHTML=`<svg viewBox="0 0 200 190" style="transform:scaleX(-1)">${petSvg(P().sp,pk.me>1?'happy':'calm')}</svg><b>${esc(P().name)}</b>${pkHearts(pk.me)}`;
 $('pkYou').innerHTML=`<svg viewBox="0 0 200 190">${petSvg(pk.p.sp,pk.you>1?'happy':'calm')}</svg><b>${esc(String(pk.p.name||'').slice(0,10))}</b>${pkHearts(pk.you)}`}
$('vPK').onclick=()=>{const p=vPets[vSel];if(!p||!P()||S.vlog.pk>=3)return;pk={p,me:3,you:3,done:false};$('pkTitle').textContent=`${P().name} VS ${vName()}`;$('pkSay').textContent='友誼賽開始！選一招吧（撲撲贏裝可愛、裝可愛贏閃閃、閃閃贏撲撲）';
 $('pkMoves').hidden=false;pkDraw();$('ovPK').classList.add('on');sfx('chime')};
$('pkMoves').onclick=e=>{const b=e.target.closest('[data-mv]');if(!b||!pk||pk.done)return;const me=b.dataset.mv,w=PKW[pk.p.pers]||PKW.playful;let r=Math.random()*(w.pounce+w.dodge+w.cute),you='pounce';for(const k of ['pounce','dodge','cute']){r-=w[k];if(r<=0){you=k;break}}
 let msg=`${P().name}用「${MV[me]}」，${vName()}用「${MV[you]}」——`;
 if(me===you){msg+='平手！兩隻互看了一眼。';sfx('pop')}
 else if(BEATS[me]===you){pk.you--;msg+=`${P().name}得分！`;sfx('swoosh');pkDraw();animEl($('pkMe'),'hitL',500);setTimeout(()=>animEl($('pkYou'),'ouch',600),200)}
 else{pk.me--;msg+=`${vName()}得分！`;sfx('hit');pkDraw();animEl($('pkYou'),'hitR',500);setTimeout(()=>animEl($('pkMe'),'ouch',600),200)}
 $('pkSay').textContent=msg;if(pk.me>0&&pk.you>0)return;
 pk.done=true;$('pkMoves').hidden=true;S.vlog.pk++;const win=pk.you<=0,p=P();
 if(win){earn(20,1);gain(3,p);p.joy=clamp(p.joy+8);sfx('win');$('pkSay').textContent=`${msg} ${p.name}贏了！得到 20 枚金幣。兩隻握握手，是好朋友！`}
 else{earn(5,1);p.joy=clamp(p.joy+3);sfx('lose');$('pkSay').textContent=`${msg} ${vName()}贏了！${p.name}拿到 5 枚金幣參加獎，下次再挑戰！`}
 if(win&&!p.pkWin){p.pkWin=1;remember(p,`第一次在好友家 PK 獲勝（對手：${vName()}）`)}
 save();render();vSend('pk',win?`帶著${p.name}來 PK，這次${p.name}贏了你家的${vName()}！`:`帶著${p.name}來 PK，你家的${vName()}贏了，好厲害！`,{win:!win}).then(()=>{renderBoard();vRefresh()})};
$('pkClose').onclick=()=>{$('ovPK').classList.remove('on');pk=null;vRefresh()};
// 主人這邊：好友摸摸、餵點心、PK 會影響自己的寵物
const _pin=processInbox;processInbox=function(){_pin();if(NET.state!=='online'||!S.pets.length)return;const got=[];
 for(const m of netInbox(NET.uid)){if(!m.act||S.seenIn.includes(m.id))continue;S.seenIn.push(m.id);
  const p=S.pets.find(q=>q.id===m.pid)||S.pets.find(q=>q.name===m.pname);if(!p)continue;const who=nickOf(m.from);
  if(m.act==='pet'){p.aff+=1;p.joy=clamp(p.joy+3);got.push(`${who}摸了摸${p.name}`)}
  if(m.act==='feed'){p.full=clamp(p.full+10);p.aff+=2;got.push(`${who}餵${p.name}吃點心`)}
  if(m.act==='pk'){p.joy=clamp(p.joy+(m.win?6:2));if(m.win)p.aff+=2;got.push(`${who}來找${p.name} PK`+(m.win?`，${p.name}贏了！`:''))}}
 if(got.length){save();render();toast(got.slice(0,2).join('、')+(got.length>2?`，還有 ${got.length-2} 件事`:''));if(!S.firstFriendAct){S.firstFriendAct=1;remember(P()||S.pets[0],`第一次有好友來家裡玩：${got[0]}`)}}};
// 啟動：預設在客廳
applyView();
