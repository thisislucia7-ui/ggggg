// ===== 側邊操作列、親手丟玩具、逗貓棒、狀態增加通知、客廳固定、小遊戲獨立視窗 =====
document.head.insertAdjacentHTML('beforeend',`<style>
body.act .panel{display:none!important}
body.act .fab{bottom:calc(18px + env(safe-area-inset-bottom));right:auto;left:16px}
.rail{display:none;position:absolute;right:8px;top:54px;bottom:10px;width:90px;z-index:7;background:light-dark(#ffffffe6,#2a2030e6);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);border-radius:18px;padding:8px 6px;overflow-y:auto;overscroll-behavior:contain;flex-direction:column;gap:6px;box-shadow:0 8px 20px -12px #0006;touch-action:pan-y}
body.act .rail{display:flex}
.rail h4{margin:0 0 2px;font:15px "Huninn",sans-serif;text-align:center}
.rail p{margin:0;font-size:11px;color:var(--mute);text-align:center;line-height:1.3}
.rail button{display:flex;flex-direction:column;align-items:center;gap:1px;padding:6px 2px;font-size:12px;line-height:1.2;min-height:58px;background:var(--bg);border:2px solid var(--line);border-radius:14px;flex:none}
.rail button svg{width:30px;height:30px}
.rail button b{font-weight:500;font-size:11px;color:var(--mute)}
.rail button[aria-pressed=true],.rail button.hot{border-color:var(--berry);background:light-dark(#fff0f4,#3a2433)}
.rail hr{border:0;border-top:2px dashed var(--line);margin:4px 2px;width:auto}
@media(min-width:761px){.rail{width:120px;right:12px;top:58px}.rail button{font-size:13px}}
.toss{position:absolute;left:0;top:0;width:50px;height:50px;z-index:6;touch-action:none;cursor:grab;filter:drop-shadow(0 4px 4px #0003)}
.toss svg{width:100%;height:100%;display:block}
.toss.drag{cursor:grabbing}
.toss .hint{position:absolute;left:50%;bottom:100%;translate:-50% -4px;white-space:nowrap;background:var(--berry);color:#fff;border-radius:99px;padding:2px 10px;font-size:12px;animation:breathe 1.2s ease-in-out infinite;pointer-events:none}
.toss.wand{width:70px;height:90px}
.statpop{position:absolute;left:12px;top:54px;z-index:8;background:light-dark(#fffffff0,#2a2030f0);border-radius:16px;padding:8px 12px;box-shadow:0 8px 20px -10px #0006;font-size:13px;min-width:170px;max-width:62%;animation:popin .3s cubic-bezier(.3,1.6,.6,1);transition:opacity .4s}
.statpop.out{opacity:0}
.statpop b{font:15px "Huninn",sans-serif;display:block;margin-bottom:2px}
.statpop .sr{display:grid;grid-template-columns:16px auto 1fr;gap:6px;align-items:center;margin-top:3px}
.statpop .sr em{font-style:normal;color:var(--berry);font-weight:700;white-space:nowrap}
.statpop .sr .bb{height:7px;border-radius:9px;background:var(--line);overflow:hidden;min-width:40px}
.statpop .sr .bb i{display:block;height:100%;border-radius:9px;transition:width .8s}
.statpop .lv{font-size:12px;color:var(--mute);margin-top:3px}
.rightcol{display:flex;flex-direction:column;gap:20px;min-width:0}
.rightcol .wrap.diary{grid-template-columns:minmax(0,1fr)!important;max-width:none;margin:0;gap:18px}
@media(max-width:760px){body[data-view=home] .stage{aspect-ratio:4/3!important;z-index:6;box-shadow:0 10px 18px -12px #7a3a1a}}
</style>`);

// ---------- 客廳：日記放在房間旁邊／下方，往下滑時房間固定不動 ----------
{const home=document.querySelector('.home'),rc=document.createElement('div');rc.className='rightcol';home.append(rc);rc.append(document.querySelector('.panel'));
 const dia=$('diarySec').querySelector('.wrap.diary');dia.dataset.v='home';rc.append(dia);$('diarySec').dataset.v='none';$('diarySec').hidden=true}

// ---------- 小遊戲獨立視窗 ----------
$('gamesSec').dataset.v='none';
MENU_EXTRA.unshift(['games','小遊戲','<svg viewBox="0 0 40 40"><rect x="4" y="10" width="32" height="22" rx="11" fill="#e8507a"/><path d="M12 16v10M7 21h10" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="26" cy="18" r="2.6" fill="#fff"/><circle cx="31" cy="24" r="2.6" fill="#fff"/></svg>',()=>{if(P())openGames();else openAdopt('first')}]);

// ---------- 狀態增加通知 ----------
const LAST={};let popT=null;
const SICON={aff:'<svg viewBox="0 0 26 24"><path d="M13 23S1 15 1 7a6 6 0 0 1 12-2 6 6 0 0 1 12 2c0 8-12 16-12 16z" fill="#e8507a"/></svg>',full:'<svg viewBox="0 0 40 40"><path d="M4 18h32a16 14 0 0 1-32 0z" fill="#f0a04b"/></svg>',joy:'<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="#5fc9ae"/><path d="M12 23q8 9 16 0" stroke="#fff" stroke-width="3.5" fill="none"/></svg>'};
const SNAME={aff:'友好度',full:'飽足',joy:'開心'},SCOL={aff:'var(--berry)',full:'#f0a04b',joy:'var(--mint)'};
let popAcc=null;
function statWatch(){const p=P();if(!p)return;const cur={aff:p.aff,full:Math.round(p.full),joy:Math.round(p.joy)},L=LAST[p.id];LAST[p.id]=cur;if(!L)return;
 const up={};for(const k of ['aff','full','joy'])if(cur[k]>L[k])up[k]=cur[k]-L[k];if(!Object.keys(up).length)return;
 if(popAcc&&popAcc.id===p.id){for(const k in up)popAcc.up[k]=(popAcc.up[k]||0)+up[k]}else popAcc={id:p.id,up};showPop(p,cur)}
function showPop(p,cur){const st=$('stage');let el=st.querySelector('.statpop');if(!el){el=document.createElement('div');el.className='statpop';st.append(el)}el.classList.remove('out');
 const lv=Math.floor(p.aff/100);
 el.innerHTML=`<b>${esc(p.name)}</b>${['aff','full','joy'].filter(k=>popAcc.up[k]).map(k=>{const v=k==='aff'?cur.aff%100:cur[k];return `<div class="sr">${SICON[k]}<span>${SNAME[k]} <em>+${popAcc.up[k]}</em></span><span class="bb"><i style="width:${v}%;background:${SCOL[k]}"></i></span></div><div class="lv" style="margin:0 0 0 22px">${k==='aff'?`現在 ${cur.aff%100} / 100（Lv.${lv+1} ${LV[Math.min(lv,LV.length-1)]}）`:`現在 ${v} / 100`}</div>`}).join('')}`;
 clearTimeout(popT);popT=setTimeout(()=>{el.classList.add('out');setTimeout(()=>{el.remove();popAcc=null},400)},2800)}
const _render=render;render=function(){_render();statWatch()};

// ---------- 側邊操作列 ----------
const THROW={ball:{g:1500,b:.62,fr:.8},yarn:{g:1700,b:.3,fr:.6},frisbee:{g:420,b:.25,fr:.7,glide:1}};
function renderRail(){let r=$('rail');if(!r){r=document.createElement('div');r.className='rail';r.id='rail';$('stage').append(r)}
 const p=P();if(!p||!ACT[view]){removeToss();return}
 if(view==='dining'){const grp=SP[p.sp].grp;r.innerHTML=`<h4>餵食</h4><p>點一下就餵</p>${FOOD[grp].map((f,i)=>{const n=i?S.inv[i-1]:Infinity;return `<button type="button" data-rf="${i}" ${n?'':'disabled'}>${foodIcon(grp,i,30)}${f[0]}<b>${i?'×'+n:'吃不完'}</b></button>`}).join('')}${S.pets.length>1?`<hr><button type="button" data-ra="feedall">${VIEWS.dining.ic}一起吃</button>`:''}`}
 if(view==='bath'){const wet=p.wetUntil>Date.now();r.innerHTML=`<h4>照顧</h4>${['bath','towel','brush'].map(k=>{const c=CARE.find(x=>x.id===k);return `<button type="button" data-rc="${k}" ${k==='towel'&&wet?'class="hot"':''}>${c.ic}${k==='towel'&&wet?'快擦乾':c.n}</button>`}).join('')}${S.pets.length>1?`<hr><button type="button" data-ra="bathall">${VIEWS.bath.ic}一起洗</button>`:''}`}
 if(view==='play'){r.innerHTML=`<h4>玩具</h4><p>${THROW[S.toy]?'拖曳玩具丟出去！':S.toy==='feather'?'拖著羽毛棒逗牠':'點一下就玩'}</p>${TOYS.map(t=>`<button type="button" data-rt="${t.id}" aria-pressed="${S.toy===t.id}">${t.ic}${t.n}</button>`).join('')}<hr>${['sleep','chat'].map(k=>{const c=CARE.find(x=>x.id===k);return `<button type="button" data-rc="${k}">${c.ic}${c.n}</button>`}).join('')}`;readyToss()}
 else removeToss()}
document.addEventListener('click',e=>{const b=e.target.closest('#rail button');if(!b||b.disabled)return;
 if(b.dataset.rf){S.food=+b.dataset.rf;feed();setTimeout(renderRail,2600)}
 if(b.dataset.ra==='feedall')feedAll();if(b.dataset.ra==='bathall')bathAll();
 if(b.dataset.rc){b.dataset.rc==='chat'?openChat():care(b.dataset.rc);setTimeout(renderRail,3000)}
 if(b.dataset.rt){const id=b.dataset.rt,same=S.toy===id;S.toy=id;save();sfx('click');renderRail();if(!THROW[id]&&id!=='feather'&&(same||true))play()}});
const _apply=applyView;applyView=function(){_apply();renderRail()};
const _rwu2=renderWorldUI;renderWorldUI=function(){_rwu2();if(ACT[view]&&view!=='play'&&$('rail'))renderRail()};

// ---------- 親手丟玩具 ----------
let tossEl=null,toss=null,tossRaf=null;
function stageWH(){const r=$('stage').getBoundingClientRect();return{W:r.width,H:r.height,r}}
function removeToss(){cancelAnimationFrame(tossRaf);if(tossEl){tossEl.remove();tossEl=null}toss=null}
function placeToss(){tossEl.style.transform=`translate(${toss.x-tossEl.offsetWidth/2}px,${toss.y-tossEl.offsetHeight/2}px) rotate(${toss.rot||0}deg)`}
function readyToss(){removeToss();const t=TOYS.find(x=>x.id===S.toy);if(!THROW[t.id]&&t.id!=='feather')return;const {W,H}=stageWH();
 tossEl=document.createElement('div');tossEl.className='toss'+(t.id==='feather'?' wand':'');
 tossEl.innerHTML=(t.id==='feather'?`<svg viewBox="0 0 70 90"><path d="M66 88 26 30" stroke="#a8643a" stroke-width="4" stroke-linecap="round"/><path d="M26 30C8 30 0 14 6 2c8 6 22 14 24 26z" fill="#ff7c9c"/><path d="M28 34C14 40 10 54 16 62c6-8 12-18 12-28z" fill="#ffc94a"/></svg>`:t.ic)+`<span class="hint">${t.id==='feather'?'拖著逗牠':'拖曳丟出去'}</span>`;
 $('stage').append(tossEl);toss={x:W*.2,y:H*(t.id==='feather'?.45:.82),vx:0,vy:0,state:'idle',rot:0,id:t.id,samples:[]};placeToss();
 tossEl.addEventListener('pointerdown',tossDown);tossEl.addEventListener('pointermove',tossMove);tossEl.addEventListener('pointerup',tossUp);tossEl.addEventListener('pointercancel',tossUp)}
let wandDist=0,wandGain=0,wandHop=0;
function tossDown(e){if(!toss||toss.state==='fly'||busy)return;const p=P();if(p.full<15){say('肚子咕嚕咕嚕叫……先吃點東西再玩好嗎？');return}
 e.preventDefault();tossEl.setPointerCapture(e.pointerId);toss.state='drag';tossEl.classList.add('drag');tossEl.querySelector('.hint')?.remove();toss.samples=[];tossMove(e)}
function tossMove(e){if(!toss||toss.state!=='drag')return;const {W,H,r}=stageWH();const nx=Math.max(20,Math.min(W-20,e.clientX-r.left)),ny=Math.max(20,Math.min(H-16,e.clientY-r.top));
 if(toss.id==='feather'){const d=Math.hypot(nx-toss.x,ny-toss.y);wandDist+=d;const p=P(),w=wOf(p);POS[p.id]={x:Math.max(10,Math.min(80,nx/W*100)),y:8};if(w){w.style.transition='left .45s ease-out,bottom .45s';place(w,POS[p.id])}
  if(d>18&&Date.now()-wandHop>650){wandHop=Date.now();animEl($('pet'),'hop',1000)}
  if(wandDist>700){wandDist=0;if(wandGain<12){wandGain++;p.joy=clamp(p.joy+3);gain(1);if(wandGain%3===1){track('play');say(pick(TOYS.find(x=>x.id==='feather').say))}sfx('squeak');save();render()}else say('呼……玩得好累，休息一下吧～')}
  toss.rot=(nx-toss.x)*1.5}
 toss.x=nx;toss.y=ny;toss.samples.push({x:nx,y:ny,t:performance.now()});if(toss.samples.length>8)toss.samples.shift();placeToss()}
function tossUp(){if(!toss||toss.state!=='drag')return;tossEl.classList.remove('drag');
 if(toss.id==='feather'){toss.state='idle';const p=P(),w=wOf(p);if(w)setTimeout(()=>{w.style.transition=''},500);return}
 const s=toss.samples,now=performance.now(),rec=s.filter(q=>now-q.t<120);const a=rec[0]||s[0],b=s[s.length-1];const dt=Math.max(.016,(b.t-a.t)/1000);
 toss.vx=(b.x-a.x)/dt;toss.vy=(b.y-a.y)/dt;const sp=Math.hypot(toss.vx,toss.vy);if(sp>2200){toss.vx*=2200/sp;toss.vy*=2200/sp}
 toss.state='fly';toss.thrown=sp>260;if(toss.thrown){sfx('swoosh');animEl($('pet'),'hop',900)}let last=performance.now(),t0=last;
 const step=now=>{const dt=Math.min(.033,(now-last)/1000);last=now;const {W,H}=stageWH(),T=THROW[toss.id],floor=H*.86;
  toss.vy+=T.g*dt;if(T.glide&&toss.vy>0)toss.vy*=1-1.8*dt;toss.x+=toss.vx*dt;toss.y+=toss.vy*dt;toss.rot+=toss.vx*dt*(T.glide?2.5:.9);
  if(toss.x<24){toss.x=24;toss.vx=-toss.vx*.7}if(toss.x>W-24){toss.x=W-24;toss.vx=-toss.vx*.7}if(toss.y<24){toss.y=24;toss.vy=-toss.vy*.5}
  if(toss.y>floor){toss.y=floor;toss.vy=-toss.vy*T.b;toss.vx*=T.fr;if(Math.abs(toss.vy)<140)toss.vy=0;if(toss.vy)sfx('pop')}
  placeToss();
  if((toss.y>=floor&&Math.abs(toss.vx)<25&&!toss.vy)||now-t0>4500){toss.state='landed';fetchToy();return}
  tossRaf=requestAnimationFrame(step)};tossRaf=requestAnimationFrame(step)}
function fetchToy(){const p=P(),w=wOf(p);if(!p||!w||!toss)return;const {W}=stageWH();const tx=Math.max(8,Math.min(82,toss.x/W*100));
 if(!toss.thrown){toss.state='idle';return}
 busy=true;w.style.transition='left .9s ease-in-out,bottom .9s ease-in-out';POS[p.id]={x:tx,y:6};place(w,POS[p.id]);posBubble();say(pick(['等等我！','我來了我來了！','衝呀～']));
 setTimeout(()=>{if(!tossEl)return;tossEl.style.opacity='0';animEl($('pet'),'hop',900);sfx('coin');hearts(4);
  p.joy=clamp(p.joy+7);p.full=clamp(p.full-2);const id=toss.id;if(!favHit(p,'toy',id,3)){gain(3);say(pick(['接到了！再丟一次嘛！','我撿回來了，厲害吧？','再遠一點我也接得到！']))}track('play');earn(1);save();render()},950);
 setTimeout(()=>{POS[p.id]={x:44,y:9};place(w,POS[p.id]);posBubble()},1700);
 setTimeout(()=>{w.style.transition='';busy=false;if(view==='play')readyToss()},2700)}
// 換頁或換玩具時重新準備
const _setView=setView;setView=function(v){removeToss();_setView(v)};
addEventListener('resize',()=>{if(view==='play'&&toss&&toss.state==='idle')readyToss()});
applyView();

// ---------- 選單：登入／登出 ----------
const ACC_IN='<svg viewBox="0 0 40 40"><rect x="6" y="6" width="18" height="28" rx="4" fill="#9fd3c4"/><path d="M16 20h18M28 14l6 6-6 6" stroke="#2f7a68" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ACC_OUT='<svg viewBox="0 0 40 40"><rect x="16" y="6" width="18" height="28" rx="4" fill="#ffc8d4"/><path d="M24 20H6M12 14l-6 6 6 6" stroke="#c83a5a" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ACC=['account','登入',ACC_IN,()=>accountAction()];MENU_EXTRA.push(ACC);
function accState(){if(NET.mode==='firebase')return NET.state==='online'?'out':'in';if(NET.mode==='claude'&&NET.state==='online')return 'claude';return(window.FIREBASE_CONFIG&&window.FIREBASE_CONFIG.apiKey)?'in':'none'}
const _rm=renderMenu;renderMenu=function(){const st=accState();ACC[1]=st==='out'?'登出':st==='claude'?'Claude 帳號':'登入／註冊';ACC[2]=st==='out'?ACC_OUT:ACC_IN;_rm()};
async function accountAction(){const st=accState();
 if(st==='out'){toast(`正在登出 ${NET.email}……`);save();try{await netFlush(S)}catch(e){}await fbLogout();try{localStorage.removeItem(KEY)}catch(e){}setTimeout(()=>location.reload(),500)}
 else if(st==='in'){location.reload()}
 else if(st==='claude'){openProfile();toast('這裡是用你的 Claude 帳號登入；要換帳號，請在 claude.ai 登出後再打開')}
 else toast('這個版本沒有帳號功能，紀錄只存在這台裝置')}

// ---------- 好友邀請即時通知 ----------
document.head.insertAdjacentHTML('beforeend',`<style>
.reqpop{position:fixed;left:50%;top:calc(12px + env(safe-area-inset-top));translate:-50% 0;z-index:25;width:min(380px,calc(100% - 24px));background:var(--card);border-radius:20px;padding:12px 14px;box-shadow:0 14px 30px -12px #0008;border:2px solid var(--berry);display:grid;grid-template-columns:52px minmax(0,1fr);gap:4px 12px;align-items:center;animation:reqin .4s cubic-bezier(.3,1.5,.6,1)}
@keyframes reqin{from{transform:translateY(-140%)}}
.reqpop .av{grid-row:span 2;width:52px;height:52px;border-radius:14px;overflow:hidden;background:var(--bg)}.reqpop .av svg{width:100%;height:100%}
.reqpop p{margin:0;font-size:15px}.reqpop p b{font-family:"Huninn",sans-serif;font-weight:400;color:var(--berry)}
.reqpop .inrow button{min-height:36px;padding:4px 12px;font-size:14px;flex:1}
.menugrid [data-extra=friends] i{background:#ffc94a;color:#3b2a2a}
</style>`);
let reqQueue=[],reqShown=null;
function pendingReqs(){if(NET.state!=='online')return[];const me=NET.uid;return Object.entries(NET.homes).filter(([id,h])=>id!==me&&h&&Array.isArray(h.friends)&&h.friends.includes(me)&&!S.friends.includes(id)&&!S.ignored.includes(id)).map(([id])=>id)}
function checkFriends(){if(NET.state!=='online'||!S.pets.length)return;S.reqSeen=S.reqSeen||[];S.mutualSeen=S.mutualSeen||[];
 for(const id of pendingReqs())if(!S.reqSeen.includes(id)&&!reqQueue.includes(id)&&reqShown!==id)reqQueue.push(id);
 for(const id of S.friends){const h=netHome(id);if(h&&Array.isArray(h.friends)&&h.friends.includes(NET.uid)&&!S.mutualSeen.includes(id)){S.mutualSeen.push(id);save();
  if(S.mutualSeen.length>0&&!$('ovTitle').classList.contains('on')){toast(`${nickOf(id)} 接受了你的好友邀請，你們是好朋友了！`);sfx('chime')}}}
 showNextReq();renderWorldUI()}
function showNextReq(){if(reqShown||!reqQueue.length||$('ovTitle').classList.contains('on'))return;const id=reqQueue.shift(),h=netHome(id);if(!h)return showNextReq();reqShown=id;
 const pet=(Array.isArray(h.pets)?h.pets:[]).find(p=>p&&SP[p.sp]);
 const el=document.createElement('div');el.className='reqpop';el.setAttribute('role','alert');
 el.innerHTML=`<div class="av">${pet?`<svg viewBox="0 0 200 190" style="background:${SP[pet.sp].bg}">${petSvg(pet.sp,'happy')}</svg>`:''}</div><p><b></b> 想跟你當好友！</p><div class="inrow"><button class="save" data-q="ok">接受</button><button class="ghost" data-q="no">略過</button><button class="ghost" data-q="later">之後再說</button></div>`;
 el.querySelector('b').textContent=h.nick||'神秘玩家';document.body.append(el);sfx('chime');
 el.onclick=e=>{const b=e.target.closest('[data-q]');if(!b)return;const q=b.dataset.q;
  if(q==='ok'){if(!S.friends.includes(id))S.friends.push(id);S.mutualSeen.push(id);save();netFlush(S);sfx('heart');toast(`你和 ${h.nick||'新朋友'} 成為好友了！`);remember(P(),`和 ${h.nick||'新朋友'} 成為好朋友`)}
  if(q==='no'){S.ignored.push(id);save()}
  if(q==='later'){S.reqSeen.push(id);save();toast('之後可以在「好友」裡接受邀請')}
  el.remove();reqShown=null;renderWorldUI();if($('ovFriends').classList.contains('on'))renderFriends();setTimeout(showNextReq,400)}}
const _oc=NET.onChange;NET.onChange=k=>{_oc&&_oc(k);if(k==='homes')checkFriends()};
const _ent=enterRoom;enterRoom=function(){_ent();setTimeout(checkFriends,3500)};
// 徽章：未讀訊息＋好友邀請
const _rwu3=renderWorldUI;renderWorldUI=function(){_rwu3();if(typeof pendingReqs!=='function')return;const r=pendingReqs().length,m=NET.state==='online'?netInbox(NET.uid).filter(x=>x.ts>(S.lastRead||0)).length:0,n=r+m;
 $('fabBadge').textContent=n||'';$('fabBadge').hidden=!n;$('btnFriends').innerHTML=`好友${r+m?`<b>${r+m}</b>`:''}`};
const _rm2=renderMenu;renderMenu=function(){_rm2();const r=pendingReqs().length,b=document.querySelector('#menuGrid [data-extra=friends]');if(b&&r)b.insertAdjacentHTML('beforeend',`<i>${r}</i>`)};

// ---------- 寵物視窗固定在上方：所有可捲動的內容都放在房間下方／旁邊 ----------
{const rc=document.querySelector('.rightcol');
 for(const [sec,v] of [['tasksSec','tasks'],['memSec','memories']]){const w=$(sec).querySelector('.wrap');w.dataset.v=v;w.classList.add('moved',sec==='tasksSec'?'qband-in':'mband-in');rc.append(w);$(sec).dataset.v='none';$(sec).hidden=true}}
document.head.insertAdjacentHTML('beforeend',`<style>
.rightcol .wrap.moved{max-width:none;margin:0;padding:0}
.rightcol .qgrid{grid-template-columns:minmax(0,1fr)!important}
.rightcol .qband-in .card,.rightcol .mband-in{background:transparent}
@media(max-width:760px){body:not(.act) .stage{aspect-ratio:4/3!important;position:sticky!important;top:0!important;z-index:6;box-shadow:0 10px 18px -12px #7a3a1a}}
@media(min-width:761px){body:not(.act) .stage{position:sticky!important;top:12px!important}}
</style>`);
const _setView2=setView;setView=function(v){_setView2(v);setTimeout(()=>scrollTo({top:0,behavior:'smooth'}),140)};
applyView();
