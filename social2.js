// ===== 社交 2.0：在線狀態、好友小屋、好友上限 30、和好友一起玩你畫我猜 =====
// 資料：live/<uid>  每個人只寫自己的這一筆（暱稱、最後上線時間、你畫我猜的狀態）
const FR_MAX=30,ONLINE_MS=150000;
const LIVE={me:{},docs:{},subs:{},on:false,busy:false,again:false};
const liveOK=()=>NET.state==='online'&&!NET.ro&&NET.db&&NET.uid;
async function livePut(patch){if(!liveOK())return false;Object.assign(LIVE.me,patch||{},{nick:String(S.nick||'').slice(0,12),seen:Date.now()});
 for(const k of Object.keys(LIVE.me))if(LIVE.me[k]===undefined||LIVE.me[k]===null)delete LIVE.me[k];
 if(LIVE.busy){LIVE.again=true;return true}LIVE.busy=true;
 try{await NET.db.doc(`live/${NET.uid}`).set(JSON.parse(JSON.stringify(LIVE.me)));LIVE.docs[NET.uid]={...LIVE.me};return true}catch(e){LIVE.err=(e&&e.code)||'err';return false}
 finally{LIVE.busy=false;if(LIVE.again){LIVE.again=false;livePut()}}}
function liveWatch(){if(NET.state!=='online'||!NET.db)return;
 if(NET.mode==='firebase'){for(const id of [NET.uid,...(S.friends||[])])if(!LIVE.subs[id])LIVE.subs[id]=NET.db.doc(`live/${id}`).onSnapshot(d=>{LIVE.docs[id]=d.exists?d.data():null;liveChanged()},()=>{})}
 else if(!LIVE.subs.all)LIVE.subs.all=NET.db.collection('live').onSnapshot(q=>{LIVE.docs={};q.docs.forEach(d=>{LIVE.docs[d.id]=d.data()});liveChanged()},()=>{})}
function liveSub(id){if(NET.mode==='firebase'&&NET.db&&id&&!LIVE.subs[id])LIVE.subs[id]=NET.db.doc(`live/${id}`).onSnapshot(d=>{LIVE.docs[id]=d.exists?d.data():null;liveChanged()},()=>{})}
const isOnline=id=>{const d=LIVE.docs[id];return !!(d&&d.seen&&Date.now()-d.seen<ONLINE_MS)};
const onlineFriends=()=>(S.friends||[]).filter(isOnline);
let liveHooks=[];function liveChanged(){liveHooks.forEach(f=>{try{f()}catch(e){}})}
function liveStart(){if(LIVE.on||NET.state!=='online')return;LIVE.on=true;liveWatch();livePut({});
 setInterval(()=>{if(!document.hidden){livePut({});liveWatch()}},60000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)livePut({})})}
setInterval(()=>{if(NET.state==='online')liveStart()},1500);

// ---------- 好友上限 30 ----------
const frFull=()=>(S.friends||[]).length>=FR_MAX;
function frCapMsg(){toast(`好友最多 ${FR_MAX} 位喔，先整理一下好友名單吧！`);sfx('squeak')}
$('frBody').addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;if((t.id==='frAdd'||t.dataset.accept)&&frFull()){e.stopImmediatePropagation();frCapMsg()}},true);
document.addEventListener('click',e=>{const b=e.target.closest('.reqpop [data-q=ok]');if(b&&frFull()){e.stopImmediatePropagation();frCapMsg()}},true);

// ---------- 好友小屋 ----------
document.head.insertAdjacentHTML('beforeend',`<style>
.houses{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:10px 8px;margin:6px 0 4px}
.hs{position:relative;display:flex;flex-direction:column;align-items:center;background:none;border:0;padding:0;min-height:0;box-shadow:none;cursor:pointer;color:var(--ink)}
.hs svg.hh{width:100%;max-width:120px;height:auto;filter:drop-shadow(0 6px 6px #7a3a1a22);transition:transform .15s}
.hs:active svg.hh{transform:scale(.95)}
.hs b{font-size:13px;margin-top:-2px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.hs small{font-size:11px;color:var(--mute)}
.hs .dot{position:absolute;top:4px;right:10px;width:12px;height:12px;border-radius:50%;background:#c8c0bc;border:2px solid #fff}
.hs.on .dot{background:#3cc47c;box-shadow:0 0 0 3px #3cc47c44}
.hs .x{position:absolute;top:-4px;left:2px;width:22px;height:22px;min-height:0;padding:0;border-radius:50%;font-size:13px;line-height:1;background:light-dark(#fff,#3a3040);color:var(--mute);border:1px solid var(--line)}
.onl{display:inline-flex;align-items:center;gap:5px;font-size:13px;color:#2a9a5c;background:#e3f7ec;border-radius:99px;padding:2px 10px}
.onl i{width:8px;height:8px;border-radius:50%;background:#3cc47c}
#menuGrid [data-extra=friends] i.on{background:#3cc47c}
</style>`);
function hHash(id){let h=7;for(const c of id)h=(h*31+c.charCodeAt(0))>>>0;return h}
function houseSvg(id,h){const k=hHash(id),roof=['#e8507a','#7aa8ff','#5fc9ae','#f0a04b','#b58cff','#e86a5a'][k%6],wall=['#fff6ea','#fdeedd','#eef6ff','#f2fbf4','#fff0f6'][(k>>>3)%5],on=isOnline(id);
 const pet=((h&&h.pets)||[]).find(p=>SP[p.sp]);
 return `<svg class="hh" viewBox="0 0 120 110"><rect x="16" y="46" width="88" height="58" rx="6" fill="${wall}" stroke="${mix(wall,'#7a4a2a',.25)}" stroke-width="2"/>
 <path d="M8 50 60 12l52 38z" fill="${roof}"/><path d="M8 50 60 12l52 38" stroke="${mix(roof,'#000000',.2)}" stroke-width="3" fill="none" stroke-linejoin="round"/>
 <rect x="80" y="20" width="10" height="18" fill="${mix(roof,'#000000',.25)}"/>${on?'<g fill="#eee" opacity=".8"><circle cx="86" cy="12" r="4"/><circle cx="92" cy="5" r="3"/></g>':''}
 <rect x="50" y="70" width="22" height="34" rx="10" fill="${mix(roof,'#7a4a2a',.35)}"/><circle cx="67" cy="88" r="2" fill="#ffd23f"/>
 <rect x="24" y="60" width="20" height="18" rx="3" fill="${on?'#ffe9a0':'#cfe3f3'}" stroke="#fff" stroke-width="2"/><path d="M34 60v18M24 69h20" stroke="#fff" stroke-width="2"/>
 ${pet?`<svg x="78" y="58" width="30" height="30" viewBox="0 0 200 190">${petSvg(pet.sp,'happy')}</svg>`:''}
 <path d="M4 104h112" stroke="#8fd08a" stroke-width="6" stroke-linecap="round"/></svg>`}
function housesHtml(){const ids=S.friends||[];if(!ids.length)return '<p class="small">還沒有好友。把你的好友碼分享給朋友吧！</p>';
 const sorted=[...ids].sort((a,b)=>isOnline(b)-isOnline(a));
 return `<div class="houses">${sorted.map(id=>{const h=netHome(id),on=isOnline(id),mutual=h&&Array.isArray(h.friends)&&h.friends.includes(NET.uid);
  return `<div class="hs ${on?'on':''}" data-house="${esc(id)}" role="button" tabindex="0" aria-label="拜訪 ${esc(nickOf(id))} 的家">${houseSvg(id,h)}<span class="dot"></span><button type="button" class="x" data-unf="${esc(id)}" aria-label="刪除好友">×</button><b>${esc(nickOf(id))}</b><small>${on?'在線上':mutual?'不在線上':'等待對方加你'}</small></div>`}).join('')}</div>`}
const _rf2=renderFriends;renderFriends=function(){_rf2();if(NET.state!=='online')return;liveWatch();const B=$('frBody');
 const h3=[...B.querySelectorAll('h3')].find(x=>x.textContent.startsWith('我的好友'));if(!h3)return;
 const n=onlineFriends().length;h3.innerHTML=`我的好友小屋 <span class="small">${(S.friends||[]).length} / ${FR_MAX}</span> <span class="onl"><i></i>${n} 人在線</span>`;
 const nx=h3.nextElementSibling;const wrap=document.createElement('div');wrap.innerHTML=housesHtml();if(nx)nx.replaceWith(wrap);else h3.after(wrap);
 const top=B.querySelector('h2');if(top&&!B.querySelector('.onl.top')){top.insertAdjacentHTML('beforeend',` <span class="onl top"><i></i>${n} 位好友在線</span>`)}};
$('frBody').addEventListener('click',e=>{if(e.target.closest('.x'))return;const hs=e.target.closest('[data-house]');if(!hs)return;const id=hs.dataset.house;if(!netHome(id)){toast('對方的家還在整理中，晚點再來拜訪吧');return}sfx('click');closeFriends();openVisit(id)});
liveHooks.push(()=>{if($('ovFriends').classList.contains('on')){const a=document.activeElement;if(!a||a.tagName!=='INPUT')renderFriends()}});
// 選單上顯示在線人數
const _rmS=renderMenu;renderMenu=function(){_rmS();const b=$('menuGrid').querySelector('[data-extra=friends]');if(b&&NET.state==='online'){const n=onlineFriends().length;if(n)b.insertAdjacentHTML('beforeend',`<i class="on">${n}</i>`)}};

// ---------- 你畫我猜：和好友一起 ----------
const DRAW_WORDS={動物:['貓咪','小狗','兔子','長頸鹿','大象','企鵝','烏龜','章魚','獅子','熊貓','小豬','蝸牛','螃蟹','鯨魚','刺蝟','老鼠','蝴蝶','青蛙'],
 蔬菜:['紅蘿蔔','南瓜','玉米','茄子','青椒','香菇','番茄','高麗菜','洋蔥','花椰菜','小黃瓜','地瓜','豌豆','蘿蔔'],
 玩具:['皮球','風箏','積木','泰迪熊','溜溜球','陀螺','機器人','小汽車','氣球','跳繩','飛盤','鈴鐺','逗貓棒','骨頭玩具']};
const DRAW_SEC=70;
document.head.insertAdjacentHTML('beforeend',`<style>
.dg{display:flex;flex-direction:column;gap:10px}
.dg .dgtop{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
.dg canvas{width:100%;aspect-ratio:4/3;background:#fff;border-radius:18px;box-shadow:inset 0 0 0 3px var(--line);touch-action:none;display:block}
.dg .word{font:20px "Huninn",sans-serif;letter-spacing:4px}
.dg .tools{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.dg .tools button{width:34px;height:34px;min-height:0;padding:0;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 2px var(--line)}
.dg .tools button[aria-pressed=true]{box-shadow:0 0 0 3px var(--berry)}
.dg .tools .clr{width:auto;border-radius:99px;padding:0 12px;font-size:13px}
.dg .pl{display:flex;gap:6px;flex-wrap:wrap}.dg .pl span{background:var(--bg);border-radius:99px;padding:3px 10px;font-size:13px}.dg .pl span.ok{background:#e3f7ec;color:#2a9a5c}.dg .pl span.dr{background:#ffe3ea;color:var(--berry)}
.dg .log{max-height:110px;overflow:auto;font-size:13px;background:var(--bg);border-radius:12px;padding:6px 10px}
.dg .log p{margin:2px 0}.dg .bar{height:8px;border-radius:99px;background:var(--line);overflow:hidden}.dg .bar i{display:block;height:100%;background:var(--mint);transition:width .5s linear}
.dg .fl{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px}
.dg .fl label{display:flex;align-items:center;gap:8px;background:var(--bg);border-radius:12px;padding:8px 10px;font-size:14px}
.dg .fl label.off{opacity:.45}
.invpop{position:fixed;left:50%;translate:-50% 0;top:calc(12px + env(safe-area-inset-top));z-index:40;width:min(92vw,380px);background:var(--card);border-radius:20px;padding:14px 16px;box-shadow:0 16px 40px -16px #0008;animation:pop .3s}
.invpop p{margin:0 0 8px}
</style>`);
let DG=null; // 目前這場：{gid,host}
const gidHost=g=>String(g||'').split('_')[0];
const hostDoc=()=>DG&&LIVE.docs[DG.host]&&LIVE.docs[DG.host].dg&&LIVE.docs[DG.host].dg.gid===DG.gid?LIVE.docs[DG.host].dg:null;
const normW=s=>String(s||'').replace(/\s/g,'').replace(/[台]/g,'臺').toLowerCase();
function drawNeeds(){if(NET.state!=='online')return '和好友一起玩需要先登入帳號喔！';if(NET.ro)return '目前沒有寫入權限，不能和好友連線。';if(!onlineFriends().length)return '至少要有 1 位好友在線上（2 人以上）才能開始。現在沒有好友在線，晚點再來或邀朋友上線吧！';return ''}
// 遊戲選單：你畫我猜改成揪好友（不扣每日次數）
const DG_GAME=GAMES.find(g=>g.id==='draw');if(DG_GAME){DG_GAME.d='和好友一起玩！輪流畫題目（動物、蔬菜、玩具），其他人來猜。2 人以上就能開始。';DG_GAME.reward='猜對、被猜對都有金幣和飼料';}
const _gm2=gameMenu;gameMenu=function(){_gm2();const b=$('gBody').querySelector('[data-g=draw]');if(!b)return;b.disabled=false;b.textContent='揪好友一起玩';const c=b.closest('.gcard'),l=c&&c.querySelector('.left');if(l)l.textContent=`好友連線不限次數・在線好友 ${onlineFriends().length} 位`};
$('gBody').addEventListener('click',e=>{const b=e.target.closest('[data-g=draw]');if(!b)return;e.stopImmediatePropagation();drawLobby()},true);
function dgShell(html){$('ovGame').classList.add('on');playing=true;$('gTitle').textContent='你畫我猜（好友連線）';$('gBody').innerHTML=`<div class="dg" id="dg">${html}</div>`}
function drawLobby(){const need=drawNeeds();
 if(need){dgShell(`<p>${esc(need)}</p><p class="small">好友 ${(S.friends||[]).length} 位・在線 ${onlineFriends().length} 位</p><div class="row"><button class="ghost" id="dgBack">回遊戲選單</button></div>`);$('dgBack').onclick=()=>{playing=false;gameMenu()};return}
 const on=onlineFriends();
 dgShell(`<p style="margin:0">選擇要邀請的在線好友（最多 7 位）：</p><div class="fl">${(S.friends||[]).map(id=>{const o=isOnline(id);return `<label class="${o?'':'off'}"><input type="checkbox" value="${esc(id)}" ${o?'checked':'disabled'}>${esc(nickOf(id))}${o?'':'（離線）'}</label>`}).join('')}</div>
  <div class="row"><button class="ghost" id="dgBack">回遊戲選單</button><button class="save" id="dgInv">送出邀請</button></div>`);
 $('dgBack').onclick=()=>{playing=false;gameMenu()};
 $('dgInv').onclick=()=>{const ids=[...$('dg').querySelectorAll('input:checked')].map(i=>i.value).slice(0,7);if(!ids.length){toast('至少選 1 位好友');return}
  const gid=NET.uid+'_'+Date.now().toString(36);DG={gid,host:NET.uid};
  livePut({dg:{gid,state:'lobby',invite:ids,players:[NET.uid],round:0,scores:{},solved:[],used:[],ts:Date.now()},dj:{gid},dd:null,dq:null});sfx('chime');dgRender()}}
// 被邀請：跳出通知
let invShown={};
liveHooks.push(()=>{if(!NET.uid)return;for(const id of S.friends||[]){const d=LIVE.docs[id],g=d&&d.dg;if(!g||g.state!=='lobby'||!isOnline(id)||!(g.invite||[]).includes(NET.uid)||invShown[g.gid]||(DG&&DG.gid===g.gid))continue;
  if(Date.now()-(g.ts||0)>10*60000)continue;invShown[g.gid]=1;const el=document.createElement('div');el.className='invpop';el.setAttribute('role','alert');
  el.innerHTML=`<p><b></b> 邀請你一起玩「你畫我猜」！</p><div class="inrow"><button class="save" data-a="ok">加入</button><button class="ghost" data-a="no">下次再玩</button></div>`;el.querySelector('b').textContent=d.nick||nickOf(id);document.body.append(el);sfx('chime');
  el.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;el.remove();if(b.dataset.a!=='ok')return;if(stopGame){stopGame();stopGame=null}
   DG={gid:g.gid,host:id};livePut({dj:{gid:g.gid},dd:null,dq:null});$('ovMenu')?.classList.remove('on');dgRender()};setTimeout(()=>el.remove(),60000)}});
// 主持人：管理流程
function hostTick(){if(!DG||DG.host!==NET.uid)return;const g=LIVE.me.dg;if(!g||g.gid!==DG.gid)return;let ch=false;const now=Date.now();
 const joined=[NET.uid,...(g.invite||[]).filter(id=>{const d=LIVE.docs[id];return d&&d.dj&&d.dj.gid===g.gid&&isOnline(id)})];
 if(g.state==='lobby'){if(JSON.stringify(joined)!==JSON.stringify(g.players)){g.players=joined;ch=true}}
 if(g.state==='play'){
  for(const id of g.players){if(id===g.drawer||g.solved.includes(id))continue;const d=id===NET.uid?LIVE.me:LIVE.docs[id],q=d&&d.dq;
   if(q&&q.gid===g.gid&&q.round===g.round&&normW(q.text)===normW(g.word)){g.solved.push(id);g.scores[id]=(g.scores[id]||0)+(g.solved.length===1?3:2);g.scores[g.drawer]=(g.scores[g.drawer]||0)+1;ch=true}}
  const left=g.players.filter(id=>id!==g.drawer&&(id===NET.uid||isOnline(id)));
  if(now>g.deadline||(left.length&&left.every(id=>g.solved.includes(id)))||!g.players.includes(g.drawer)||(g.drawer!==NET.uid&&!isOnline(g.drawer))){
   g.last={word:g.word,drawer:g.drawer,solved:[...g.solved]};if(g.round>=g.total){g.state='end';g.ts=now}else nextRound(g);ch=true}}
 if(ch){g.ts=g.ts||now;livePut({dg:g})}}
function nextRound(g){const all=Object.entries(DRAW_WORDS).flatMap(([c,ws])=>ws.map(w=>[c,w])).filter(([c,w])=>!g.used.includes(w));const [cat,word]=pick(all.length?all:[['動物','貓咪']]);
 g.round++;g.drawer=g.players[(g.round-1)%g.players.length];g.word=word;g.cat=cat;g.used.push(word);g.solved=[];g.deadline=Date.now()+DRAW_SEC*1000}
function dgStart(){const g=LIVE.me.dg;if(!g||g.players.length<2){toast('至少要有 1 位好友加入才能開始');return}g.state='play';g.total=g.players.length<3?g.players.length*2:g.players.length;g.round=0;g.scores={};g.players.forEach(id=>g.scores[id]=0);nextRound(g);livePut({dg:g});sfx('chime')}
// 畫布
let cv=null,ctx=null,strokes=[],cur=null,penC='#3b2a2a',sendT=null,drawnKey='';
function encode(s){return s.c+'|'+s.p.map(([x,y])=>x+','+y).join(' ')}
function decode(str){const [c,pts]=String(str).split('|');return {c,p:(pts||'').split(' ').filter(Boolean).map(t=>t.split(',').map(Number))}}
function paint(list){if(!ctx)return;ctx.clearRect(0,0,cv.width,cv.height);ctx.lineCap=ctx.lineJoin='round';
 for(const s of list){if(!s.p.length)continue;ctx.strokeStyle=s.c;ctx.lineWidth=s.c==='#ffffff'?28:7;ctx.beginPath();ctx.moveTo(s.p[0][0],s.p[0][1]);if(s.p.length===1)ctx.lineTo(s.p[0][0]+.1,s.p[0][1]);for(const [x,y] of s.p.slice(1))ctx.lineTo(x,y);ctx.stroke()}}
function sendStrokes(g){clearTimeout(sendT);sendT=setTimeout(()=>{let enc=strokes.map(encode);while(enc.join('').length>60000)enc.shift();livePut({dd:{gid:g.gid,round:g.round,s:enc}})},350)}
function dgRender(){if(!DG)return;liveSub(DG.host);const g=hostDoc(),me=NET.uid;if(g)(g.players||[]).forEach(liveSub);
 if(!g){dgShell(`<p>正在連線到房間……</p><p class="small">如果一直連不上，可能是房主已經離開了。</p><div class="row"><button class="ghost" id="dgLeave">離開</button></div>`);$('dgLeave').onclick=dgLeave;return}
 const names=id=>id===me?'你':esc((LIVE.docs[id]&&LIVE.docs[id].nick)||nickOf(id));
 if(g.state==='lobby'){const host=DG.host===me;
  dgShell(`<p style="margin:0">${host?'等待好友加入……':'已加入房間，等待房主開始……'}</p><div class="pl">${g.players.map(id=>`<span>${names(id)}${id===DG.host?'（房主）':''}</span>`).join('')}</div>
   <p class="small">邀請中：${(g.invite||[]).filter(id=>!g.players.includes(id)).map(names).join('、')||'無'}</p><p class="small">題目都跟動物、蔬菜、玩具有關，每人輪流畫，每題 ${DRAW_SEC} 秒。</p>
   <div class="row"><button class="ghost" id="dgLeave">離開</button>${host?`<button class="save" id="dgGo" ${g.players.length<2?'disabled':''}>開始（${g.players.length} 人）</button>`:''}</div>`);
  $('dgLeave').onclick=dgLeave;if(host)$('dgGo').onclick=dgStart;return}
 if(g.state==='end'){const rank=[...g.players].sort((a,b)=>(g.scores[b]||0)-(g.scores[a]||0));const mine=g.scores[me]||0;
  dgShell(`<h2 style="margin:0">遊戲結束！</h2>${g.last?`<p class="small">最後一題是「${esc(g.last.word)}」</p>`:''}<div class="pl" style="flex-direction:column">${rank.map((id,i)=>`<span class="${i===0?'dr':''}">${['🥇','🥈','🥉'][i]||(i+1)+'.'} ${names(id)}：${g.scores[id]||0} 分</span>`).join('')}</div>
   <div class="row"><button class="save" id="dgDone">領取獎勵</button></div>`);
  $('dgDone').onclick=()=>{const gg=DG.gid;dgLeave(true);if(S.dgClaim===gg)return gameMenu();S.dgClaim=gg;const win=rank[0]===me&&mine>0;stopGame=null;
   reward({id:'draw',n:'你畫我猜'},{feeds:Math.min(4,1+Math.floor(mine/3)),stars:win?2:mine>=3?1:0,win,msg:`你在這場拿到 ${mine} 分${win?'，是第一名！':''}`})};return}
 // 遊戲中
 const drawer=g.drawer===me,solved=g.solved.includes(me),key=g.gid+':'+g.round+':'+drawer;
 if(drawnKey!==key){drawnKey=key;strokes=[];
  dgShell(`<div class="dgtop"><b>第 ${g.round} / ${g.total} 題・${names(g.drawer)}${drawer?'畫':'在畫'}</b><span class="small" id="dgT"></span></div><div class="bar"><i id="dgBar"></i></div>
   <div class="word" id="dgWord"></div><canvas id="dgC" width="800" height="600"></canvas>
   ${drawer?`<div class="tools">${['#3b2a2a','#e8507a','#f0a04b','#ffd23f','#5fc9ae','#7aa8ff','#9b7be0','#a8643a'].map(c=>`<button type="button" data-c="${c}" style="background:${c}" aria-pressed="${c===penC}" aria-label="顏色"></button>`).join('')}<button type="button" data-c="#ffffff" class="clr" aria-pressed="false">橡皮擦</button><button type="button" class="clr" id="dgClr">清空</button></div>`
    :`<div class="inrow"><input id="dgIn" maxlength="10" placeholder="輸入你的答案" autocomplete="off"><button class="save" id="dgSend">猜！</button></div>`}
   <div class="pl" id="dgPl"></div><div class="log" id="dgLog"></div><div class="row"><button class="ghost" id="dgLeave">離開遊戲</button></div>`);
  cv=$('dgC');ctx=cv.getContext('2d');paint([]);$('dgLeave').onclick=dgLeave;
  if(drawer){$('dg').querySelector('.tools').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.id==='dgClr'){strokes=[];paint(strokes);sendStrokes(g);return}penC=b.dataset.c;$('dg').querySelectorAll('.tools [data-c]').forEach(x=>x.setAttribute('aria-pressed',x===b))};
   const pt=e=>{const r=cv.getBoundingClientRect();return [Math.round((e.clientX-r.left)/r.width*800),Math.round((e.clientY-r.top)/r.height*600)]};
   cv.onpointerdown=e=>{e.preventDefault();cv.setPointerCapture(e.pointerId);cur={c:penC,p:[pt(e)]};strokes.push(cur);paint(strokes)};
   cv.onpointermove=e=>{if(!cur)return;const p=pt(e),l=cur.p[cur.p.length-1];if(Math.hypot(p[0]-l[0],p[1]-l[1])<6)return;cur.p.push(p);paint(strokes)};
   cv.onpointerup=cv.onpointercancel=()=>{if(cur){cur=null;sendStrokes(hostDoc()||g)}}}
  else{const send=()=>{const v=$('dgIn').value.trim();if(!v)return;const gg=hostDoc();if(!gg)return;livePut({dq:{gid:gg.gid,round:gg.round,text:v.slice(0,10),ts:Date.now()}});
    const ok=normW(v)===normW(gg.word);DG.log=(DG.log||[]).concat(ok?'你猜對了！等待其他人…':`你猜：${v}`).slice(-30);$('dgIn').value='';sfx(ok?'chime':'click');dgUpdate()};
   $('dgSend').onclick=send;$('dgIn').onkeydown=e=>{if(e.key==='Enter')send()}}}
 dgUpdate()}
function dgUpdate(){const g=hostDoc();if(!g||g.state!=='play'||!$('dgC'))return dgRender();const me=NET.uid,drawer=g.drawer===me,solved=g.solved.includes(me);
 const names=id=>id===me?'你':esc((LIVE.docs[id]&&LIVE.docs[id].nick)||nickOf(id));
 if((g.gid+':'+g.round+':'+drawer)!==drawnKey)return dgRender();
 $('dgWord').innerHTML=drawer?`請畫：<b>${esc(g.word)}</b> <span class="small">（${esc(g.cat)}）</span>`:solved?`答對了！答案是 <b>${esc(g.word)}</b>`:`提示：${esc(g.cat)}・${g.word.length} 個字 ${'＿ '.repeat(g.word.length)}`;
 $('dgPl').innerHTML=g.players.map(id=>`<span class="${id===g.drawer?'dr':g.solved.includes(id)?'ok':''}">${names(id)} ${g.scores[id]||0} 分${id===g.drawer?' ✏️':g.solved.includes(id)?' ✔':''}</span>`).join('');
 if(!drawer){const d=g.drawer===me?LIVE.me:LIVE.docs[g.drawer],dd=d&&d.dd;const list=dd&&dd.gid===g.gid&&dd.round===g.round?(dd.s||[]).map(decode):[];paint(list);
  const inp=$('dgIn');if(inp){inp.disabled=solved;$('dgSend').disabled=solved}}
 $('dgLog').innerHTML=(g.last&&g.round>1?`<p>上一題答案：<b>${esc(g.last.word)}</b>（${g.last.solved.length} 人猜對）</p>`:'')+(DG.log||[]).slice(-6).map(t=>`<p>${esc(t)}</p>`).join('')}
function dgTimer(){const g=hostDoc();if(!g||g.state!=='play'||!$('dgT'))return;const s=Math.max(0,Math.ceil((g.deadline-Date.now())/1000));$('dgT').textContent=`剩 ${s} 秒`;$('dgBar').style.width=Math.min(100,s/DRAW_SEC*100)+'%'}
function dgLeave(quiet){if(DG&&DG.host===NET.uid&&LIVE.me.dg&&LIVE.me.dg.state!=='end'){LIVE.me.dg.state='end';LIVE.me.dg.ts=Date.now()}
 DG=null;drawnKey='';livePut({dj:null,dd:null,dq:null});if(quiet!==true){playing=false;gameMenu()}}
let dgLast='';liveHooks.push(()=>{if(!DG)return;const g=hostDoc(),k=g?JSON.stringify([g.state,g.round,g.players,g.solved,g.scores]):'none';
 if(g&&g.state==='play'&&drawnKey&&k===dgLast){dgUpdate();return}dgLast=k;if(!$('ovGame').classList.contains('on'))return;dgRender()});
setInterval(()=>{if(!DG)return;hostTick();dgTimer();if(DG.host!==NET.uid&&!hostDoc()&&$('dg')&&!$('dg').textContent.includes('連線'))dgRender()},700);
// 關掉遊戲視窗時離開房間
const _cg2=closeGames;closeGames=function(){if(DG)dgLeave(true);return _cg2()};$('gExit').onclick=()=>closeGames();
