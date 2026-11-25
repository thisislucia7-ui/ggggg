// ===== 個性、咬人與教育、手機底部選單、個人資訊、放養與賣出 =====
const PERS={
 clingy:{n:'黏人精',d:'最喜歡被摸摸，一刻都離不開你。',like:'pet',bite:.02,fight:.8,mess:1,lines:['你要去哪裡？帶我一起去嘛！','再摸我一下下就好～','我可以一直黏著你嗎？']},
 tsun:{n:'傲嬌',d:'嘴巴說不要，其實很在意你。偶爾會鬧脾氣咬人。',like:'play',bite:.14,fight:1.2,mess:1,lines:['哼，才不是因為喜歡你才等你的！','……你今天比較晚來喔。（小聲）','我、我才沒有想你呢！']},
 foodie:{n:'貪吃鬼',d:'聽到碗的聲音就會衝過來，吃飽最幸福。',like:'feed',bite:.05,fight:1,mess:1.2,lines:['肚子餓了……現在是點心時間嗎？','我聞到好吃的味道了！','吃飽飽才有力氣愛你！']},
 playful:{n:'活潑好動',d:'精力旺盛，最愛玩，但常把家裡弄得亂七八糟。',like:'play',bite:.06,fight:1.2,mess:1.8,lines:['我們來玩嘛！來嘛來嘛！','我剛剛在房間跑了十圈！','球呢？我的球呢？']},
 shy:{n:'害羞內向',d:'慢熟又溫柔，喜歡聽你說心事。',like:'diary',bite:.03,fight:.5,mess:.8,lines:['（偷偷看你）……嗨。','你今天過得好嗎？可以跟我說喔。','我、我其實很喜歡你……']},
 grumpy:{n:'暴躁小霸王',d:'脾氣火爆，愛打架也容易咬人，需要很多耐心。',like:'game',bite:.2,fight:2,mess:1.3,lines:['誰敢搶我的位置！','哼！今天心情不好！','……好啦，你可以靠近一點點。']},
 lazy:{n:'懶洋洋',d:'最愛睡覺和發呆，很少惹麻煩。',like:'care',bite:.04,fight:.6,mess:.5,lines:['呼啊……好想睡喔……','今天也要好好躺平。','你也躺下來一起休息嘛～']},
 neat:{n:'愛乾淨',d:'喜歡洗澡和整齊的家，看到髒亂會不開心。',like:'care',bite:.05,fight:.9,mess:.6,lines:['地上那個……可以掃一下嗎？','香香的感覺最棒了！','我今天也是乾乾淨淨的喔。']}};
const PKEYS=Object.keys(PERS);
const rollPers=()=>pick(PKEYS);
const biteLv=k=>{const b=PERS[k].bite;return b>=.14?'偏高':b>=.06?'普通':'很低'};
const LIKE_N={pet:'被摸摸',play:'玩耍',feed:'吃東西',diary:'聽你寫日記',game:'一起玩小遊戲',care:'被照顧（洗澡、睡覺）'};
function persCard(k){const Q=PERS[k]||PERS.clingy;return `<b>個性：${Q.n}</b><span>${Q.d}</span><span class="small">最喜歡：${LIKE_N[Q.like]}・咬人機率：${biteLv(k)}</span>`}
$('adReroll').onclick=()=>{let n;do{n=rollPers()}while(n===adPers);adPers=n;sfx('pop');$('adPersBox').innerHTML=persCard(adPers);animEl($('adPersBox'),'pop',400)};
$('adRandom').onclick=()=>{const s=pick(SPECIES);adFam=s[3];adSp=s[0];adPers=rollPers();$('adName').value=SP[adSp].n;sfx('chime');renderAdopt();animEl($('adPrev'),'pop',400)};
// 舊寵物補上個性
S.pets.forEach(p=>{if(!PERS[p.pers])p.pers=rollPers()});
function persAvg(key){if(!S.pets.length)return 1;return S.pets.reduce((a,p)=>a+((PERS[p.pers]||PERS.clingy)[key]||1),0)/S.pets.length}
// 個性加成：做牠喜歡的事會多加友好度
const _track=track;track=function(k){_track(k);const p=P();if(!p)return;const Q=PERS[p.pers];
 if(Q&&Q.like===k&&Math.random()<.7)setTimeout(()=>{gain(2,p);say(`${p.name}（${Q.n}）：「${k==='pet'?'最喜歡被你摸了！':k==='feed'?'吃東西是世界上最幸福的事！':k==='play'?'再玩！再玩一次！':k==='diary'?'謝謝你願意跟我分享心事。':k==='game'?'跟你一起贏最爽快了！':'被你照顧好舒服喔～'}」`)},1500)};
// 個性閒聊
setInterval(()=>{if(!S.pets.length||busy||playing||document.hidden||document.querySelector('.ov.on')||Date.now()-lastSay<18000||Math.random()>.4)return;
 const p=pick(S.pets),Q=PERS[p.pers];if(Q){say(`${p.name}：「${pick(Q.lines)}」`);animEl(wOf(p)?.querySelector('.pet'),'hop',900)}},9000);

// ---------- 摸摸時咬人 ----------
let biting=null;
function petBlocked(p){if(p.fear&&p.fear>Date.now()){say(`${p.name}躲開了……牠還在害怕，先給牠一點時間吧。`);animEl($('pet'),'shake',800);return true}
 const Q=PERS[p.pers]||PERS.clingy,r=Q.bite*(1-Math.min(4,p.trained||0)*.2)*(p.joy<40?1.6:1);
 if(Math.random()<r){bite(p);return true}return false}
function bite(p){busy=true;biting=p;anim('bite',700);sfx('hit');
 add('bitefx',`<svg viewBox="0 0 120 80"><g fill="#fff" stroke="#e8304a" stroke-width="3"><path d="M20 20l10 16 10-16z"/><path d="M45 18l10 18 10-18z"/><path d="M70 18l10 18 10-18z"/><path d="M95 20l-10 16"/><path d="M25 62l10-16 10 16z"/><path d="M50 64l10-18 10 18z"/><path d="M75 62l10-16 10 16z"/></g></svg><b>啊嗚！</b>`,1000);
 say(`${p.name}：「啊嗚！」（咬了你一口）`);
 setTimeout(()=>{$('biteFace').innerHTML=`<svg viewBox="0 0 200 190">${petSvg(p.sp,'calm')}</svg>`;$('biteTxt').textContent=`${p.name}突然咬了你一口！要怎麼回應牠？`;
  $('biteAsk').hidden=false;$('biteRes').hidden=true;$('ovBite').classList.add('on')},900)}
$('biteHit').onclick=()=>{const p=biting;if(!p)return;p.aff=Math.max(0,p.aff-8);p.joy=clamp(p.joy-20);p.fear=Date.now()+60000;p.hits=(p.hits||0)+1;sfx('lose');
 $('biteFace').innerHTML=`<svg viewBox="0 0 200 190">${petSvg(p.sp,'sad')}</svg>`;animEl($('biteFace'),'shake',1200);
 $('biteResTxt').textContent=`${p.name}嚇得一直發抖，躲得遠遠的……友好度 -8、開心 -20，接下來一分鐘都不敢讓你摸。`;
 $('biteTip').textContent='打罵只會讓動物害怕、不信任你，反而更容易咬人。現實生活中請絕對不要打寵物，被咬時先停下動作、冷靜離開，再用溫和堅定的方式教導。';
 $('biteAsk').hidden=true;$('biteRes').hidden=false};
$('biteLove').onclick=()=>{const p=biting;if(!p)return;const was=p.trained||0;p.trained=Math.min(4,was+1);gain(3,p);p.joy=clamp(p.joy+3);sfx('chime');
 $('biteFace').innerHTML=`<svg viewBox="0 0 200 190">${petSvg(p.sp,'happy')}</svg>`;animEl($('biteFace'),'pop',500);
 $('biteResTxt').textContent=`你蹲下來，溫柔但堅定地說：「不可以咬人喔。」${p.name}低下頭：「嗚……對不起。」然後輕輕蹭了蹭你的手。友好度 +3，教養程度 ${p.trained}/4。`;
 $('biteTip').textContent=p.trained>=4?`${p.name}已經學會不咬人了，真了不起！耐心和溫柔是最好的教育。`:'教養程度越高，越不容易咬人。耐心、溫柔又堅定，就是最好的教育方式。';
 if(p.trained>=4&&was<4)remember(p,'在愛的教育下學會了不咬人');
 $('biteAsk').hidden=true;$('biteRes').hidden=false};
$('biteOk').onclick=()=>{const p=biting;$('ovBite').classList.remove('on');biting=null;busy=false;
 if(p&&p.fear>Date.now()){POS[p.id]={x:POS[p.id]&&POS[p.id].x<50?6:94,y:4};const w=wOf(p);w&&place(w,POS[p.id]);say(`${p.name}：「嗚嗚……」（躲在角落發抖）`)}
 else if(p){anim('hug',1600);hearts(5);say(`${p.name}：「我以後會乖乖的！」`)}save();render()};

// ---------- 手機底部選單 ----------
function toStage(){const r=$('stage').getBoundingClientRect();if(r.top<0||r.bottom>innerHeight)scrollTo({top:Math.max(0,r.top+scrollY-8),behavior:'smooth'})}
function navOn(k){document.querySelectorAll('#bnav button').forEach(b=>b.setAttribute('aria-current',b.dataset.nav===k?'page':'false'))}
function openSheet(kind){const p=P();if(!p)return;sfx('click');
 if(kind==='feed'){const grp=SP[p.sp].grp;$('shT').textContent=`給${p.name}吃什麼？`;
  $('shBody').innerHTML=`<div class="shgrid">${FOOD[grp].map((f,i)=>{const n=i?S.inv[i-1]:Infinity;return `<button type="button" data-shf="${i}" ${n?'':'disabled'}>${foodIcon(grp,i,40)}<span>${f[0]}</span><b>${i?'×'+n:'吃不完'}</b></button>`}).join('')}</div>
  ${S.pets.length>1?'<button type="button" class="save" data-sha="feedall" style="width:100%;margin-top:10px">大家一起吃飯</button>':''}
  <p class="small" style="margin:14px 0 6px">陪牠玩</p><div class="shgrid">${TOYS.map(t=>`<button type="button" data-sht="${t.id}">${t.ic}<span>${t.n}</span></button>`).join('')}</div>`}
 if(kind==='bath'){$('shT').textContent=`照顧${p.name}`;const wet=p.wetUntil>Date.now();
  $('shBody').innerHTML=`<div class="shgrid">${[['bath','洗澡'],['towel',wet?'擦乾（牠濕答答的！）':'擦乾'],['brush','梳毛'],['sleep','哄睡覺'],['chat','說說話']].map(([k,n])=>{const c=CARE.find(x=>x.id===k);return `<button type="button" data-shc="${k}" ${k==='towel'&&wet?'class="hot"':''}>${c?c.ic:''}<span>${n}</span></button>`}).join('')}</div>
  ${S.pets.length>1?'<button type="button" class="save" data-sha="bathall" style="width:100%;margin-top:10px">大家一起洗澡</button>':''}
  ${S.mess.length?`<p class="small" style="margin:12px 0 0">地上有 ${S.mess.length} 個髒東西，直接點它們就能打掃。</p>`:''}`}
 $('ovSheet').classList.add('on')}
$('shBody').onclick=e=>{const b=e.target.closest('button');if(!b||b.disabled)return;$('ovSheet').classList.remove('on');toStage();
 setTimeout(()=>{if(b.dataset.shf){S.food=+b.dataset.shf;render();feed()}if(b.dataset.sht){S.toy=b.dataset.sht;render();play()}
  if(b.dataset.shc){b.dataset.shc==='chat'?openChat():care(b.dataset.shc)}if(b.dataset.sha==='feedall')feedAll();if(b.dataset.sha==='bathall')bathAll()},350)};
$('shClose').onclick=()=>$('ovSheet').classList.remove('on');
$('ovSheet').onclick=e=>{if(e.target.id==='ovSheet')$('ovSheet').classList.remove('on')};
let frMode='all';
const _rf=renderFriends;renderFriends=function(){frMode==='msgs'?renderMsgs():_rf()};
const _of=openFriends;openFriends=function(){frMode='all';_of()};
function renderMsgs(){const B=$('frBody');
 B.innerHTML=`<div class="row" style="margin:0"><h2 style="margin:0">訊息</h2><button class="ghost" id="frClose">關閉</button></div>
 ${NET.state!=='online'?`<p class="netnote">${esc(acctLine())}</p>`:(()=>{const l=netInbox(NET.uid);return l.length?`<div class="msgs" style="max-height:none;margin-top:12px">${l.map(m=>msgHtml(m,true)).join('')}</div>`:'<p class="small" style="margin-top:12px">還沒有訊息。加好友後，朋友來拜訪時就能留言、送禮物給你。</p>'})()}
 <div class="row"><button class="ghost" id="msgToFr">前往好友</button></div>`;
 $('frClose').onclick=closeFriends;$('msgToFr').onclick=()=>{frMode='all';renderFriends()}}
function openMsgs(){frMode='msgs';S.lastRead=Date.now();save();renderFriends();renderWorldUI();$('ovFriends').classList.add('on')}
$('bnav').onclick=e=>{const b=e.target.closest('[data-nav]');if(!b)return;const k=b.dataset.nav;navOn(k);
 if(!P()&&k!=='me'){openAdopt('first');return}
 if(k==='room'){scrollTo({top:0,behavior:'smooth'});sfx('click')}
 if(k==='feed')openSheet('feed');if(k==='bath')openSheet('bath');
 if(k==='diary'){$('diarySec').scrollIntoView({behavior:'smooth'});sfx('click')}
 if(k==='msgs')openMsgs();if(k==='friends')openFriends();if(k==='me')openProfile()};

// ---------- 個人資訊 ----------
function openProfile(){renderProfile();$('ovProfile').classList.add('on');sfx('click')}
function renderProfile(){const grp=P()?SP[P().sp].grp:'cat';
 $('pfBody').innerHTML=`<div class="row" style="margin:0"><h2 style="margin:0">個人資訊</h2><button class="ghost" id="pfClose">關閉</button></div>
 <div class="pfhead"><div><b style="font-size:20px">${esc(S.nick||'還沒取暱稱')}</b><p class="small" style="margin:2px 0 0">${esc(acctLine())}</p>${NET.state==='online'?`<p style="margin:6px 0 0">好友碼 <span class="codebox" style="font-size:18px;padding:4px 10px">${netCode(NET.uid)}</span></p>`:''}</div><button class="ghost" id="pfNick">修改暱稱</button></div>
 <div class="pfstats"><span>${COIN(22)} 金幣 <b>${S.coins}</b></span><span>${STAR(22)} 星星 <b>${S.stars}</b></span><span>陪伴 <b>${S.streak.n||1}</b> 天</span><span>寵物格 <b>${S.pets.length}/${S.slots}</b></span></div>
 <p class="small" style="margin:8px 0 0">背包：${[0,1,2,3].map(t=>`${esc(FOOD[grp][t+1][0])} ×${S.inv[t]}`).join('、')}</p>
 <h3>我的寵物</h3><div class="pflist">${S.pets.map((p,i)=>{const Q=PERS[p.pers]||PERS.clingy,lv=Math.floor(p.aff/100)+1;return `<div class="pfpet ${i===S.cur?'on':''}">${thumb(p.sp,expr(p),'')}<div><b>${esc(p.name)}</b> <span class="small">${esc(SP[p.sp].breed)}・Lv.${lv}・相處 ${Math.floor((Date.now()-(p.born||Date.now()))/864e5)+1} 天</span>
  <p style="margin:4px 0 0"><span class="ptrait">${Q.n}</span> <span class="small">${Q.d}</span></p><p class="small" style="margin:2px 0 0">教養程度 ${p.trained||0}/4</p>
  <div class="inrow" style="margin-top:6px">${i===S.cur?'<span class="small" style="align-self:center">正在陪你</span>':`<button class="ghost" data-pc="${i}">換牠陪我</button>`}<button class="ghost" data-bye="release" data-pi="${i}">放養</button><button class="ghost" data-bye="sell" data-pi="${i}">賣出（${sellPrice(p)} 金幣）</button></div></div></div>`}).join('')}</div>
 <h3>設定</h3><div class="inrow"><button class="ghost" id="pfMusic">${Snd.pref.music?'音樂：開':'音樂：關'}</button><button class="ghost" id="pfSfx">${Snd.pref.sfx?'音效：開':'音效：關'}</button></div>`;
 $('pfClose').onclick=()=>$('ovProfile').classList.remove('on');
 $('pfNick').onclick=()=>{$('ovProfile').classList.remove('on');if(NET.state==='online'){openFriends()}else{$('nickIn').value=S.nick||'';$('ovNick').classList.add('on')}};
 $('pfMusic').onclick=()=>{$('sMusic').click();renderProfile()};$('pfSfx').onclick=()=>{$('sSfx').click();renderProfile()}}
const sellPrice=p=>30+Math.floor(p.aff/100)*25;
$('pfBody').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.pc){S.cur=+b.dataset.pc;save();render();renderProfile();sfx('squeak')}
 if(b.dataset.bye)askBye(b.dataset.bye,+b.dataset.pi)});
// ---------- 放養／賣出（附現實提醒） ----------
let byeAct=null;
function askBye(kind,i){const p=S.pets[i];if(!p)return;if(busy||fight){toast('現在有點忙，等一下再處理吧');return}byeAct={kind,id:p.id};
 $('byeT').textContent=kind==='sell'?`要把${p.name}賣出嗎？`:`要把${p.name}放養嗎？`;
 $('byeFace').innerHTML=`<svg viewBox="0 0 200 190">${petSvg(p.sp,'sad')}</svg>`;
 $('byeTxt').textContent=kind==='sell'?`${p.name}會到遊戲裡的新家生活，你會得到 ${sellPrice(p)} 枚金幣。牠的回憶相簿也會一起帶走，無法復原。`:`${p.name}會回到遊戲裡的大自然生活。牠的回憶相簿也會一起帶走，無法復原。`;
 $('byeOk').textContent=kind==='sell'?'確定賣出':'確定放養';$('byeChk').checked=false;$('byeOk').disabled=true;$('ovBye').classList.add('on')}
$('byeChk').onchange=()=>{$('byeOk').disabled=!$('byeChk').checked};
$('byeNo').onclick=()=>{$('ovBye').classList.remove('on');byeAct=null};
$('byeOk').onclick=()=>{if(!byeAct||!$('byeChk').checked)return;const i=S.pets.findIndex(p=>p.id===byeAct.id);if(i<0)return;const p=S.pets[i],kind=byeAct.kind;byeAct=null;
 $('ovBye').classList.remove('on');$('ovProfile').classList.remove('on');toStage();busy=true;
 const w=wOf(p);if(w){w.classList.remove('come');w.style.transition='left 2.2s ease-in,opacity 2.2s';animEl(w.querySelector('.pet'),'hop',900);setTimeout(()=>{w.style.left='112%';w.style.opacity='0'},700)}
 say(kind==='sell'?`${p.name}：「謝謝你照顧我，我會在新家好好生活的！」`:`${p.name}：「再見了，我會永遠記得你！」`);sfx('lose');
 setTimeout(()=>{S.pets.splice(i,1);delete POS[p.id];if(kind==='sell')earn(sellPrice(p),1);S.cur=Math.max(0,Math.min(S.cur>=i?S.cur-1:S.cur,S.pets.length-1));busy=false;save();
  toast(kind==='sell'?`${p.name}去了新家，得到 ${sellPrice(p)} 枚金幣`:`${p.name}回到大自然了`);
  if(!S.pets.length){openAdopt('first')}else{render();renderDiary()}},3000)};
// 手機：未讀數字
const _rw=renderWorldUI;renderWorldUI=function(){_rw();const n=NET.state==='online'?netInbox(NET.uid).filter(x=>x.ts>(S.lastRead||0)).length:0;const b=document.querySelector('#bnav [data-nav="msgs"] i');if(b){b.textContent=n||'';b.hidden=!n}};
renderWorldUI();
$('btnFriends').onclick=openFriends;$('btnFriends2').onclick=openFriends;
if(S.pets.length)render();
