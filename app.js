const MOODS={happy:{n:'開心',c:'#ffc94a'},calm:{n:'平淡',c:'#9fd3c4'},sad:{n:'難過',c:'#9db8ea'}};
const GREET={
 happy:['看到你笑我也好開心！今天一定發生了好事吧？','耶～你開心，我的尾巴就停不下來！','把這份好心情分我一點點好不好？','今天的你閃閃發亮呢，要不要跟我說說？','你的笑容是我最喜歡的點心！','好心情會傳染耶，我現在也超開心！'],
 calm:['平平淡淡也很好，我陪你慢慢過。','今天普普通通嗎？那我們一起發呆一下～','沒有大起大落的日子，也值得被好好記住喔。','要不要陪我玩一下，讓今天多一點點顏色？','安安靜靜的一天，有你在旁邊就很好。','平凡的日子裡，你也一直很努力喔。'],
 sad:['抱抱你……難過的時候，我都在這裡。','不想說也沒關係，我就安靜地陪著你。','哭一哭也沒關係，你已經很努力了。','今天辛苦了，先休息一下，明天會好一點的。','你不是一個人喔，我會一直陪著你。','難過的心情也是你的一部分，我都喜歡。']};
const EXTRA={happy:'要不要把這份開心寫下來？以後想念的時候可以回來看。',calm:'平淡的日子裡，也藏著值得感謝的小事喔。',sad:'如果你願意，可以跟我一起慢慢深呼吸。'};
const REPLY={
 happy:['真替你高興！','聽起來好棒，我也跟著開心起來了！','你值得所有美好的事！','這一天一定要好好記住！'],
 calm:['謝謝你跟我分享～','平凡的一天也很珍貴喔。','有你陪我聊天，今天就很好了。','慢慢來，我們一起過每一天。'],
 sad:['給你一個大大的抱抱。','謝謝你願意告訴我，你真的很勇敢。','今天先好好休息，我會在這裡等你。','難過的時候，記得還有我喔。']};
// 日記關鍵字 → 貼心回覆
const KEYS=[
 [/成功|完成|考上|升職|做到|通過|拿到|錄取|贏/,['哇！你好厲害！我要幫你放煙火！','我就知道你做得到！真為你驕傲！']],
 [/累|睏|好忙|加班|熬夜|沒睡|疲/,['辛苦了！今天早點睡，讓我守護你的夢。','累了就休息一下吧，你已經做得很多了。']],
 [/考試|作業|報告|讀書|上課|期中|期末|功課/,['讀書辛苦了！不管結果如何，你的努力我都看見了。','加油加油！休息的時候記得來找我玩。']],
 [/工作|老闆|同事|上班|開會|主管|客戶/,['上班辛苦了！下班後的時間是屬於你的喔。','工作的事放一邊，現在換我來照顧你。']],
 [/吵架|分手|誤會|生氣|討厭/,['遇到不開心的事一定很難受，先抱一個。','你的感受很重要，生氣也沒關係，我陪你。']],
 [/朋友|家人|媽|爸|姐|哥|弟|妹|同學/,['有重要的人在身邊，真好。','你身邊的人一定也很珍惜你。']],
 [/好吃|吃|餐|飯|甜點|麵|蛋糕|咖啡|奶茶/,['聽起來好好吃！下次也帶一點給我好不好？','吃到好吃的東西，心情也會變好呢！']],
 [/生病|感冒|頭痛|不舒服|醫院|發燒|咳/,['要好好照顧身體喔，多喝水、早點休息。','希望你快點好起來，我會乖乖等你。']],
 [/下雨|天氣|好冷|好熱|颱風|太陽/,['天氣變化大，記得照顧好自己喔。','不管晴天雨天，我都陪著你。']],
 [/生日|禮物|紀念日|節日/,['生日快樂！不對……是特別的日子快樂！','好特別的一天，我也要送你一個抱抱當禮物！']],
 [/孤單|寂寞|一個人|沒人/,['你不是一個人，我一直都在這裡。','想聊天的時候就來找我，我永遠有空。']]];
const NOTES=['你今天也辛苦了，有好好吃飯嗎？','你笑起來的樣子，是我最喜歡的風景。','慢慢來也沒關係，我們不趕時間。','記得喝水，也記得對自己溫柔一點。','不管今天過得怎樣，你都很棒。','偶爾停下來，看看天空吧。','你不需要完美，你本來就很好。','謝謝你每天都來看我，我好幸福。','累的時候，可以把煩惱交給我保管。','今天有沒有遇到一件小小的好事呢？','你的努力，總有一天會開花的。','難過的時候也可以哭，哭完我們再一起笑。','你是被喜歡著的喔，至少我超喜歡你。','做不到的事先放著，你已經做了很多了。','今晚早點睡，明天會是新的一天。','你願意照顧我，也要記得照顧你自己。','世界很大，但我最想陪在你旁邊。','今天也請多多指教！','每一個平凡的日子，都因為你而特別。','深呼吸，你比自己想像的更堅強。'];
const PRAISE=['嘿嘿，被你摸摸了～','你在看我嗎？我也在看你！','我最喜歡你了！','你今天也好可愛！','跟你在一起好安心。','再摸一下下嘛～','你是世界上最好的主人！','嗯……好舒服……'];
const PURR=['呼嚕呼嚕……好舒服～','再多摸一點點！','被你摸摸，煩惱都飛走了！','我的心跳變成愛心形狀了！'];
const LV=['初次見面','漸漸熟悉','好朋友','知心夥伴','形影不離','一生摯友'];
const MAXSLOT=6,SLOTCOST=6,DAILY=3;
const TI=(b)=>`<svg viewBox="0 0 40 40" aria-hidden="true">${b}</svg>`;
const TOYS=[
 {id:'ball',n:'彩球',j:20,a:6,ic:TI('<circle cx="20" cy="20" r="16" fill="#ff7c9c"/><path d="M5 16q15 9 30 0M7 27q13-7 26 0" stroke="#fff" stroke-width="3" fill="none"/>'),say:['彩球好好玩！再丟一次嘛～','我抓到了！厲害吧！']},
 {id:'yarn',n:'毛線球',j:25,a:7,ic:TI('<circle cx="20" cy="20" r="16" fill="#9b7be0"/><path d="M7 14q13 6 26-2M5 22q15 6 30-2M14 5q-6 15 4 31" stroke="#d6c6ff" stroke-width="2.5" fill="none"/>'),say:['毛線球跑掉了，等等我！','滾滾滾～抓到了！']},
 {id:'feather',n:'羽毛棒',j:15,a:9,ic:TI('<path d="M36 4 16 26" stroke="#a8643a" stroke-width="3" stroke-linecap="round"/><path d="M16 26c-10 2-14 8-10 12 4-2 12-6 13-10z" fill="#ff7c9c"/>'),say:['哈哈哈好癢！再來一次！','抓不到抓不到～我要抓到你！']},
 {id:'bubbles',n:'泡泡機',j:18,a:7,ic:TI('<circle cx="14" cy="24" r="9" fill="#bfe6ff" stroke="#7aa8ff" stroke-width="2"/><circle cx="28" cy="14" r="6" fill="#bfe6ff" stroke="#7aa8ff" stroke-width="2"/><circle cx="30" cy="30" r="4" fill="#bfe6ff" stroke="#7aa8ff" stroke-width="2"/>'),say:['好多泡泡！我要一顆一顆戳破！','泡泡飛高高～好漂亮！']},
 {id:'frisbee',n:'飛盤',j:24,a:8,ic:TI('<ellipse cx="20" cy="22" rx="17" ry="8" fill="#5fc9ae"/><ellipse cx="20" cy="20" rx="11" ry="4" fill="#9fe6d4"/>'),say:['看我飛撲接住！','再丟遠一點，我跑得很快喔！']},
 {id:'balloon',n:'氣球',j:16,a:8,ic:TI('<ellipse cx="20" cy="16" rx="11" ry="13" fill="#ffc94a"/><path d="M20 29q-3 5 1 9" stroke="#8a6f68" stroke-width="1.5" fill="none"/><circle cx="16" cy="11" r="3" fill="#fff" opacity=".6"/>'),say:['氣球飛走了～好像在跟我們揮手！','我也想跟氣球一起飛上天！']},
 {id:'blocks',n:'積木',j:20,a:8,ic:TI('<rect x="6" y="22" width="14" height="13" rx="3" fill="#ff7c9c"/><rect x="20" y="22" width="14" height="13" rx="3" fill="#7aa8ff"/><rect x="13" y="8" width="14" height="13" rx="3" fill="#ffc94a"/>'),say:['蓋好了！……啊，倒掉了，哈哈！','我們一起蓋一座城堡吧！']},
 {id:'music',n:'音樂盒',j:22,a:10,ic:TI('<rect x="6" y="16" width="28" height="18" rx="4" fill="#c98a4b"/><path d="M6 16l4-8h20l4 8z" fill="#e3b278"/><path d="M26 4v10M26 4l6 2" stroke="#e8507a" stroke-width="2.5"/>'),say:['啦啦啦～我會跳舞喔！','這首歌送給你！']}];
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=v=>Math.max(0,Math.min(100,v));
// 遊戲時間一律以台灣時區為準
const TZ='Asia/Taipei';
function twHour(){return Number(new Intl.DateTimeFormat('en-US',{timeZone:TZ,hour:'numeric',hourCycle:'h23'}).format(new Date()))%24}
function twMin(){return Number(new Intl.DateTimeFormat('en-US',{timeZone:TZ,minute:'numeric'}).format(new Date()))}
const today=()=>new Date().toLocaleDateString('sv',{timeZone:TZ});
const KEY='petDiary.v2';

function load(){let s=null;try{s=JSON.parse(localStorage.getItem(KEY))}catch(e){}
 if(!(s&&Array.isArray(s.pets))){
  s={pets:[],cur:0,slots:2,gift26:1,stars:0,inv:[0,0,0,0],food:0,toy:'ball',plays:{},diary:[],checkDay:'',last:Date.now()};
  try{const o=JSON.parse(localStorage.getItem('petDiary.v1'));
   if(o&&o.name){const sp={cat:'dango',dino:'lvlv',whale:'lanlan',bunny:'huanghuang'}[o.sp||'cat']||'dango';
    s.pets=[{id:'p1',sp,name:o.name,aff:o.aff||0,full:o.full??70,joy:o.joy??70}];s.diary=(o.diary||[]).map(d=>({...d,mood:d.mood||'calm'}));s.checkDay=o.checkDay||'';s.last=o.last||Date.now()}}catch(e){}}
 return normalize(s)}
function normalize(s){if(!s.plays||'n' in s.plays)s.plays={};if(!s.streak)s.streak={last:'',n:0};if(!TOYS.some(t=>t.id===s.toy))s.toy='ball';
 if(s.coins==null)s.coins=20000;if(!s.decor)s.decor=JSON.parse(JSON.stringify(DEFAULT_DECOR));if(!s.owned)s.owned={wall:['peach'],floor:['wood'],rug:['pink','none'],furn:['shelf','plant','lamp']};
 ['mess','friends','seenIn','giftsIn','ignored'].forEach(k=>{if(!Array.isArray(s[k]))s[k]=[]});if(!s.poopDay)s.poopDay={};return s}
let S=load();
function save(){S.ts=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}if(typeof netSave==='function')netSave(S)}
const P=()=>S.pets[S.cur];
let busy=false,dMood='happy',filt='all',lastMood='',undoItem=null,toastTimer;

function decay(){const m=(Date.now()-S.last)/60000;if(m<1)return;const mf=1+(S.mess||[]).length*.15;S.pets.forEach(p=>{p.full=clamp(p.full-m/20);p.joy=clamp(p.joy-m*mf/30)});S.last=Date.now();save()}
const expr=p=>{const v=Math.min(p.full,p.joy);return v>=60?'happy':v>=30?'calm':'sad'};
function plays(){if(S.plays.day!==today())S.plays={day:today()};return S.plays}
const playsLeft=id=>DAILY-(plays()[id]||0);
const dayNo=()=>Math.floor((new Date(today()+'T00:00:00')).getTime()/864e5);
function timeHello(){const h=twHour();return h<5?'這麼晚還沒睡呀？':h<11?'早安！':h<14?'午安～':h<18?'下午好！':h<22?'晚上好～':'夜深了，'}

function face(m,s=40){const mouth=m==='happy'?'<path d="M13 24q7 8 14 0" fill="none" stroke="#4a2a1a" stroke-width="2.6" stroke-linecap="round"/>':m==='calm'?'<path d="M14 26h12" stroke="#4a2a1a" stroke-width="2.6" stroke-linecap="round"/>':'<path d="M13 29q7-7 14 0" fill="none" stroke="#4a2a1a" stroke-width="2.6" stroke-linecap="round"/><path d="M12 19q-2 5 0 7q2-2 0-7z" fill="#5aa0e8"/>';
 return `<svg width="${s}" height="${s}" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="${MOODS[m].c}"/><circle cx="14" cy="16" r="2.4" fill="#4a2a1a"/><circle cx="26" cy="16" r="2.4" fill="#4a2a1a"/>${mouth}</svg>`}
const thumb=(sp,e,cls)=>`<svg class="${cls||'th'}" viewBox="0 0 200 190" style="background:${SP[sp].bg}" aria-hidden="true">${petSvg(sp,e||'happy')}</svg>`;

function render(){const p=P();if(!p)return;if(!p.born)p.born=Date.now();$('stage').dataset.tod=tod();
 renderMemos();
 $('pStar').innerHTML=`${STAR(22)} 星星 <b>${S.stars}</b>`;
 $('pStreak').innerHTML=`陪伴第 <b>${S.streak.n||1}</b> 天`;
 let h='';for(let i=0;i<MAXSLOT;i++){
  if(i<S.pets.length){const q=S.pets[i];h+=`<button type="button" class="slot" data-i="${i}" aria-pressed="${i===S.cur}">${thumb(q.sp,expr(q))}${esc(q.name)}</button>`}
  else if(i<S.slots)h+=`<button type="button" class="slot empty" data-adopt="1"><span class="plus">+</span>領養</button>`;
  else h+=`<button type="button" class="slot lock" data-unlock="1" ${S.stars<SLOTCOST||i>S.slots?'disabled':''}><span class="plus" style="font-size:20px">${STAR(26)}</span>${i===S.slots?SLOTCOST+' 顆星解鎖':'未解鎖'}</button>`}
 $('slots').innerHTML=h;
 const lv=Math.floor(p.aff/100),rem=p.aff%100,sp=SP[p.sp],F=FOOD[sp.grp];
 $('pName').textContent=p.name;$('pBreed').textContent=`${sp.breed}・${(typeof PERS!=='undefined'&&PERS[p.pers]||{}).n||FAMS[sp.fam]}`;
 $('lvl').textContent=`Lv.${lv+1} ${LV[Math.min(lv,LV.length-1)]}`;
 $('pn').textContent=p.name;
 $('tAff').textContent=`${rem} / 100`;$('bAff').style.width=rem+'%';
 $('tFull').textContent=Math.round(p.full);$('bFull').style.width=p.full+'%';
 $('tJoy').textContent=Math.round(p.joy);$('bJoy').style.width=p.joy+'%';
 if(S.food>0&&!S.inv[S.food-1])S.food=0;
 $('foods').innerHTML=F.map((f,i)=>{const n=i?S.inv[i-1]:Infinity;return `<button type="button" data-f="${i}" aria-pressed="${S.food===i}" ${n?'':'disabled'} title="${f[0]}">${foodIcon(sp.grp,i,30)}${f[0]}<b>${i?'×'+n:'吃不完'}</b></button>`}).join('');
 $('toys').innerHTML=TOYS.map(t=>`<button type="button" data-t="${t.id}" aria-pressed="${S.toy===t.id}">${t.ic}${t.n}</button>`).join('');
 syncPets();renderWorldUI();
 renderQuests();
 $('note').innerHTML=`${thumb(p.sp,'happy','')}<div><p class="small">${esc(p.name)}給你的小紙條</p><p class="say">${esc(NOTES[dayNo()%NOTES.length])}</p></div>`}
function say(t){const b=$('bubble');b.textContent=t;b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');lastSay=Date.now()}
const heart=c=>`<svg width="26" height="24" viewBox="0 0 26 24"><path d="M13 23S1 15 1 7a6 6 0 0 1 12-2 6 6 0 0 1 12 2c0 8-12 16-12 16z" fill="${c||'var(--berry)'}"/></svg>`;
function fx(html,x,y){const d=document.createElement('div');d.className='fx';d.innerHTML=html;d.style.left=x+'%';d.style.top=(y||40)+'%';$('stage').append(d);setTimeout(()=>d.remove(),1500)}
function hearts(n){for(let k=0;k<n;k++)setTimeout(()=>fx(heart(pick(['var(--berry)','#ffc94a','#ff9fb4'])),25+Math.random()*50,30+Math.random()*25),k*120)}
function confetti(){for(let k=0;k<36;k++){const c=document.createElement('span');c.className='confetti';c.style.left=Math.random()*100+'%';c.style.background=pick(['#ff7c9c','#ffc94a','#5fc9ae','#7aa8ff','#b58cff']);c.style.setProperty('--dx',(Math.random()*120-60)+'px');c.style.animationDelay=Math.random()*.5+'s';$('stage').append(c);setTimeout(()=>c.remove(),2500)}}
function gain(a,p){p=p||P();const before=Math.floor(p.aff/100);p.aff+=a;if(p===P())fx(heart()+'+'+a,38+Math.random()*20);
 if(Math.floor(p.aff/100)>before&&p===P())setTimeout(()=>{sfx('level');confetti();S.stars+=2;earn(20);remember(p,`友好等級升到 Lv.${before+2}「${LV[Math.min(before+1,LV.length-1)]}」`);render();toast('升級獎勵：2 顆星星！');say(`我們變得更親近了！現在是「${LV[Math.min(before+1,LV.length-1)]}」，謝謝你一直陪著我！`)},1600)}
function lock(ms){busy=true;$('btnFeed').disabled=$('btnPlay').disabled=true;setTimeout(()=>{busy=false;$('btnFeed').disabled=$('btnPlay').disabled=false},ms)}
function anim(cls,ms){const p=$('pet');if(!p)return;p.classList.remove('hop','munch','chase','spin','leap','dance','hug','purr');void p.getBoundingClientRect();p.classList.add(cls);setTimeout(()=>p.classList.remove(cls),ms||1900)}
function add(cls,html,ms){const d=document.createElement('div');d.className=cls;d.innerHTML=html;$('stage').append(d);setTimeout(()=>d.remove(),ms);return d}

function feed(){if(busy)return;decay();const p=P(),sp=SP[p.sp],i=S.food,f=FOOD[sp.grp][i],T=TIER[i];
 if(p.full>=95){say('嗝～我吃不下了啦，等等再吃好不好？');anim('hop');sfx('squeak');return}
 if(i>0){if(!S.inv[i-1])return;S.inv[i-1]--}
 summon();earn(2);p.poopAt=Date.now()+(90+Math.random()*150)*1000;jealous();
 lock(2300);sfx('click');
 const bowl=add('bowl',`<svg viewBox="0 0 120 60" width="100%"><ellipse cx="60" cy="20" rx="56" ry="12" fill="#c25a7a"/><path d="M4 20q4 38 56 38t56-38z" fill="#e8507a"/><ellipse cx="60" cy="20" rx="46" ry="8" fill="#8a3050"/><path d="M20 38q40 12 80 0" stroke="#fff" stroke-width="3" fill="none" opacity=".5"/></svg><div class="food">${foodIcon(sp.grp,i,80)}</div>`,2600);
 setTimeout(()=>{anim('munch');sfx('eat');bowl.querySelector('.food').classList.add('eat');
  for(let k=0;k<10;k++)setTimeout(()=>{const c=document.createElement('span');c.className='crumb';c.style.background=f[2];c.style.left=(44+Math.random()*12)+'%';c.style.bottom='14%';c.style.setProperty('--dx',(Math.random()*120-60)+'px');c.style.setProperty('--dy',(-30-Math.random()*60)+'px');$('stage').append(c);setTimeout(()=>c.remove(),900)},k*110)},700);
 setTimeout(()=>{p.full=clamp(p.full+T.f);track('feed');if(favHit(p,'food',i,T.a))return save(),render();gain(T.a);sfx('heart');say(i?pick([`哇！是${f[0]}！好香喔！`,`${f[0]}好好吃～謝謝你記得我喜歡的！`,'這是特別的點心耶，被你寵愛好幸福！']):pick([`${f[0]}吃飽飽～`,'嗯嗯嗯，好吃！謝謝你照顧我。','有你餵我，每一口都特別香！']));save();render()},1700);
 setTimeout(()=>bowl.classList.add('out'),2050)}

function toyAnim(id){
 if(id==='ball'){add('toyfx t-ball',TOYS[0].ic.replace('<svg','<svg width="46"'),1700);anim('hop');sfx('jump')}
 if(id==='yarn'){add('toyfx t-yarn',`<svg viewBox="0 0 400 60" preserveAspectRatio="none" width="100%" height="60" style="position:absolute;inset:0"><path d="M400 50C330 30 300 58 240 44S150 30 90 50" stroke="#9b7be0" stroke-width="3" fill="none"/></svg><svg class="y" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#9b7be0"/><path d="M6 14q14 6 28-2M4 22q16 6 32-2M8 30q12 4 24-2M14 4q-6 16 4 34" stroke="#d6c6ff" stroke-width="2.5" fill="none"/></svg>`,1950);anim('chase');sfx('swoosh')}
 if(id==='feather'){add('toyfx t-feather',`<svg viewBox="0 0 90 120"><path d="M88 0 30 80" stroke="#a8643a" stroke-width="4" stroke-linecap="round"/><path d="M30 80c-24 4-34 22-26 38 10-6 30-16 34-30z" fill="#ff7c9c"/><path d="M30 80c-6 14-18 26-22 34" stroke="#fff" stroke-width="2" fill="none"/><path d="M34 86c-16 10-20 22-16 30 8-6 16-16 18-26z" fill="#ffc94a"/></svg>`,1850);anim('hop');sfx('squeak')}
 if(id==='bubbles'){for(let k=0;k<12;k++)setTimeout(()=>{const b=document.createElement('span');b.className='t-bub';b.style.left=(15+Math.random()*25)+'%';const s=16+Math.random()*24;b.style.width=b.style.height=s+'px';b.style.setProperty('--dx',(Math.random()*240+40)+'px');$('stage').append(b);setTimeout(()=>b.remove(),2300)},k*90);anim('hop');sfx('bubble')}
 if(id==='frisbee'){add('toyfx t-frisbee',TOYS[4].ic.replace('<svg','<svg width="64"'),1900);setTimeout(()=>anim('leap',1800),300);sfx('swoosh')}
 if(id==='balloon'){add('toyfx t-balloon',`<svg viewBox="0 0 40 70"><ellipse cx="20" cy="18" rx="16" ry="18" fill="${pick(['#ffc94a','#ff7c9c','#7aa8ff','#b58cff'])}"/><path d="M18 36h4l-2 3z" fill="#8a6f68"/><path d="M20 39q-6 10 2 18t-2 12" stroke="#8a6f68" stroke-width="1.5" fill="none"/><ellipse cx="14" cy="11" rx="4" ry="6" fill="#fff" opacity=".5"/></svg>`,2300);anim('hop');sfx('chime')}
 if(id==='blocks'){const d=add('toyfx t-blocks',['#ff7c9c','#7aa8ff','#ffc94a','#5fc9ae'].map((c,k)=>`<span style="background:${c};bottom:${k*34}px;left:${k%2?16:0}px;animation-delay:${k*.22}s;--dx:${(k%2?1:-1)*(40+k*20)}px;--r:${(k%2?1:-1)*(60+k*30)}deg"></span>`).join(''),2200);
  [0,1,2,3].forEach(k=>setTimeout(()=>sfx('click'),k*220+300));setTimeout(()=>{d.classList.add('fall');sfx('drum');anim('hop')},1400)}
 if(id==='music'){for(let k=0;k<8;k++)setTimeout(()=>{const n=document.createElement('span');n.className='t-note';n.textContent=pick(['♪','♫','♬']);n.style.color=pick(['#e8507a','#7aa8ff','#5fc9ae','#b58cff']);n.style.left=(40+Math.random()*20)+'%';n.style.setProperty('--dx',(Math.random()*160-80)+'px');n.style.setProperty('--r',(Math.random()*60-30)+'deg');$('stage').append(n);setTimeout(()=>n.remove(),1900)},k*180);anim('dance');sfx('tune')}}
function play(){if(busy)return;decay();const p=P(),t=TOYS.find(x=>x.id===S.toy);
 if(p.full<15){say('肚子咕嚕咕嚕叫……先吃點東西再玩好嗎？');sfx('squeak');return}
 if(p.joy>=98){say('今天玩得好開心了，我們休息一下，靠在一起就好～');anim('purr',1200);return}
 lock(2100);summon();earn(3);jealous();setTimeout(()=>toyAnim(t.id),250);
 setTimeout(()=>{p.joy=clamp(p.joy+t.j);p.full=clamp(p.full-5);track('play');if(!favHit(p,'toy',t.id,t.a)){gain(t.a);say(pick(t.say))}save();render()},1200)}


// ===== 溫馨細節：時段、光點、閒聊、回憶 =====
function tod(){const h=twHour();return h>=5&&h<10?'morning':h<17&&h>=10?'day':h>=17&&h<19?'evening':'night'}
for(let i=0;i<9;i++){const m=document.createElement('span');m.className='mote';m.style.left=(8+Math.random()*84)+'%';m.style.top=(30+Math.random()*55)+'%';m.style.animationDelay=(-Math.random()*9)+'s';m.style.animationDuration=(7+Math.random()*5)+'s';$('stage').append(m)}
let lastSay=Date.now();
const IDLE={
 hungry:['肚子咕嚕咕嚕……有點想吃東西了。','聞到好香的味道，是要開飯了嗎？'],
 bored:['好無聊喔，陪我玩一下好不好？','我把玩具都排好了，等你來玩！'],
 morning:['早晨的陽光暖暖的，好舒服～','今天也要一起過得開開心心喔！'],
 day:['窗外的雲好像一隻小綿羊！','我剛剛在想你，你就出現了！'],
 evening:['夕陽好漂亮，好想跟你一起看。','今天辛苦了，晚餐吃了什麼呀？'],
 night:['夜深了，記得早點休息喔。','檯燈暖暖的，跟你待在一起好安心。'],
 any:['（偷偷看你）嘿嘿。','我會一直在這裡陪你的。','你知道嗎？你是我最重要的人。','今天有喝水嗎？要記得照顧自己喔。']};
setInterval(()=>{const p=P();if(!p||busy||playing||document.hidden||document.querySelector('.ov.on'))return;if(Date.now()-lastSay<16000)return;
 const pool=p.full<35?IDLE.hungry:p.joy<35?IDLE.bored:Math.random()<.5?IDLE[tod()]:IDLE.any;say(pick(pool));anim(pick(['purr','hop']),1100);sfx('squeak')},5000);
function remember(p,text){if(!p)return;p.mem=p.mem||[];p.mem.push({ts:Date.now(),text});if(p.mem.length>60)p.mem.shift();save();renderMemos()}
function renderMemos(){const p=P();if(!p)return;$('mn').textContent=p.name;const m=(p.mem||[]).slice().reverse();
 $('memos').innerHTML=m.length?m.map((x,i)=>`<figure class="memo" style="margin:0">${thumb(p.sp,i%4===3?'calm':'happy','')}<time>${esc(new Date(x.ts).toLocaleDateString('zh-TW',{year:'numeric',month:'long',day:'numeric'}))}</time><p>${esc(x.text)}</p></figure>`).join('')
  :'<div class="empty">還沒有回憶，一起創造第一個吧！</div>'}

// ===== 摸摸：在寵物身上滑動 =====
{let down=false,dist=0,lx=0,ly=0,lastPet=0;const st=$('stage');
 st.addEventListener('pointerdown',e=>{const w=e.target.closest('.pw');if(!w||editMode||fight)return;const i=S.pets.findIndex(q=>q.id===w.dataset.pid);
  if(i<0)return;if(i!==S.cur){if(busy)return;S.cur=i;save();sfx('squeak');render();say(pick(['叫我嗎？','我在這裡！','輪到我了嗎？']));anim('hop');return}
  down=true;dist=0;lx=e.clientX;ly=e.clientY});
 st.addEventListener('pointermove',e=>{if(!down)return;dist+=Math.hypot(e.clientX-lx,e.clientY-ly);lx=e.clientX;ly=e.clientY;
  if(dist>140&&Date.now()-lastPet>2500&&P()&&!busy){lastPet=Date.now();dist=0;if(petBlocked(P())){down=false;return}anim('purr',1100);hearts(3);sfx('heart');say(pick(PURR));const p=P();p.joy=clamp(p.joy+2);gain(1);track('pet');save();render()}});
 const up=()=>{if(down&&dist<10&&P()){anim('hop');sfx('squeak');say(pick(PRAISE))}down=false};
 st.addEventListener('pointerup',up);st.addEventListener('pointerleave',()=>{down=false})}

// ===== 進入頁 =====
function showTitle(){const all=Object.keys(SP);let ids=[];while(ids.length<7){const k=pick(all);if(!ids.includes(k))ids.push(k)}
 $('parade').innerHTML=ids.map((k,i)=>`<svg viewBox="0 0 200 190" style="animation-delay:${-i*2}s,${-i*.13}s">${petSvg(k,'happy')}</svg>`).join('');
 const p=P();$('tWait').innerHTML=p?`<div class="wait">${thumb(p.sp,expr(p),'')}<span>${esc(p.name)}正在房間裡等你！</span></div>`:'';
 $('tGo').textContent=p?'進入房間':'開始選寵物';syncSound();$('ovTitle').classList.add('on');
 for(let i=0;i<10;i++){const f=document.createElement('div');f.className='floaty';f.innerHTML=heart(pick(['#ff9fb4','#ffc94a','#ffffff','#9fd3c4']));f.style.left=Math.random()*100+'%';f.style.animationDelay=(-Math.random()*9)+'s';f.style.animationDuration=(8+Math.random()*6)+'s';f.style.transform=`scale(${.6+Math.random()*.8})`;$('ovTitle').append(f)}}
function syncSound(){['tMusic','sMusic'].forEach(i=>$(i).setAttribute('aria-pressed',Snd.pref.music));['tSfx','sSfx'].forEach(i=>$(i).setAttribute('aria-pressed',Snd.pref.sfx));
 ['tMusic','sMusic'].forEach(i=>$(i).textContent=Snd.pref.music?'音樂 開':'音樂 關');['tSfx','sSfx'].forEach(i=>$(i).textContent=Snd.pref.sfx?'音效 開':'音效 關')}
['tMusic','sMusic'].forEach(i=>$(i).onclick=()=>{Snd.setMusic(!Snd.pref.music);if(Snd.pref.music)Snd.play($('ovTitle').classList.contains('on')?'title':$('ovGame').classList.contains('on')&&playing?'game':'room');syncSound()});
['tSfx','sSfx'].forEach(i=>$(i).onclick=()=>{Snd.setSfx(!Snd.pref.sfx);sfx('click');syncSound()});
$('tGo').onclick=()=>{Snd.init();sfx('chime');Snd.play('room');$('ovTitle').classList.remove('on');
 if(!S.pets.length)return openAdopt('first');enterRoom()};
function enterRoom(){checkStreak();render();const p=P(),e=expr(p);
 say(timeHello()+(e==='sad'?'我好想你……肚子也有點餓了':e==='calm'?'你回來啦～陪我玩一下嘛':`你來啦！${p.name}好開心見到你！`));anim('hop');sfx('squeak');setTimeout(()=>{if(S.checkDay!==today())openMood()},900)}
function checkStreak(){const t=today();if(S.streak.last===t)return;const y=new Date(Date.now()-864e5).toLocaleDateString('sv',{timeZone:TZ});
 S.streak.n=S.streak.last===y?S.streak.n+1:1;S.streak.last=t;
 if(S.streak.n>1&&S.streak.n%7===0){S.stars+=2;setTimeout(()=>remember(P(),`連續陪伴 ${S.streak.n} 天`),100);setTimeout(()=>{toast(`連續陪伴 ${S.streak.n} 天！送你 2 顆星星`);confetti();sfx('level')},1500)}
 else if(S.streak.n>1)setTimeout(()=>toast(`連續陪伴第 ${S.streak.n} 天，謝謝你每天都來！`),1500);save()}

// ===== 領養與寵物格 =====
let adFam='cat',adSp='dango',adMode='first',adPers='clingy';
function openAdopt(mode){adMode=mode;const first=mode==='first';
 $('adH').textContent=first?'選一隻想要的寵物吧！':'領養新夥伴';
 $('adSub').textContent=first?`共有 ${SPECIES.length} 種動物、7 個家族。每個人一開始只能養一隻，玩小遊戲收集星星就能解鎖更多寵物格。`:`你有空的寵物格了，從 ${SPECIES.length} 種動物裡選一隻吧！`;
 $('adCancel').hidden=first;adPers=rollPers();renderAdopt();$('ovAdopt').classList.add('on');$('adName').value=SP[adSp].n}
function renderAdopt(){
 $('famTabs').innerHTML=Object.keys(FAMS).map(k=>`<button type="button" data-fam="${k}" aria-pressed="${adFam===k}">${FAMS[k]}</button>`).join('');
 $('spGrid').innerHTML=SPECIES.filter(s=>s[3]===adFam).map(([id])=>`<button type="button" data-sp="${id}" aria-pressed="${adSp===id}">${thumb(id,'happy','')}${SP[id].breed}</button>`).join('');
 $('adPrev').style.background=SP[adSp].bg;$('adPrev').innerHTML=petSvg(adSp,'happy');
 $('adPersBox').innerHTML=persCard(adPers);
 const g=SP[adSp].grp;$('adInfo').innerHTML=`<b>${esc(SP[adSp].breed)}</b>　<span class="small">愛吃：${FOOD[g].map(f=>esc(f[0])).join('、')}</span>`}
$('famTabs').onclick=e=>{const b=e.target.closest('[data-fam]');if(!b)return;sfx('click');adFam=b.dataset.fam;adSp=SPECIES.find(s=>s[3]===adFam)[0];adPers=rollPers();$('adName').value=SP[adSp].n;renderAdopt()};
$('spGrid').onclick=e=>{const b=e.target.closest('[data-sp]');if(!b)return;sfx('squeak');const old=SP[adSp].n;adSp=b.dataset.sp;adPers=rollPers();if(!$('adName').value.trim()||$('adName').value===old)$('adName').value=SP[adSp].n;renderAdopt()};
$('adCancel').onclick=()=>$('ovAdopt').classList.remove('on');
$('adoptForm').onsubmit=e=>{e.preventDefault();if(S.pets.length>=S.slots)return;
 S.pets.push({id:'p'+Date.now().toString(36),sp:adSp,name:$('adName').value.trim()||SP[adSp].n,aff:0,full:70,joy:70,pers:adPers});
 S.cur=S.pets.length-1;P().born=Date.now();remember(P(),'我們第一次見面的日子');$('ovAdopt').classList.remove('on');checkStreak();render();renderDiary();anim('spin');sfx('level');confetti();
 setTimeout(()=>say(`你好！我是${P().name}，謝謝你選了我，請多多指教！`),500);
 if(adMode==='first')setTimeout(()=>{if(S.checkDay!==today())openMood()},1600)};
$('slots').onclick=e=>{const b=e.target.closest('button');if(!b||b.disabled)return;
 if(b.dataset.i!==undefined){const i=+b.dataset.i;if(i===S.cur)return;S.cur=i;save();anim('spin');sfx('swoosh');setTimeout(()=>{render();renderDiary()},400);setTimeout(()=>say(`轉身～換我${P().name}陪你！`),800)}
 else if(b.dataset.adopt)openAdopt('more');
 else if(b.dataset.unlock&&S.stars>=SLOTCOST){S.stars-=SLOTCOST;S.slots++;save();render();sfx('level');toast('解鎖了一個新的寵物格！');openAdopt('more')}};
$('btnRename').onclick=()=>{$('rnName').value=P().name;$('ovRename').classList.add('on');$('rnName').select()};
$('rnCancel').onclick=()=>$('ovRename').classList.remove('on');
$('renameForm').onsubmit=e=>{e.preventDefault();const nn=$('rnName').value.trim();if(nn&&nn!==P().name){P().name=nn;remember(P(),`有了新名字「${nn}」`)}save();$('ovRename').classList.remove('on');render();renderDiary();say('新名字好好聽，我很喜歡！');sfx('heart')};

// ===== 心情關心 =====
function openMood(){$('mPick').hidden=false;$('mReply').hidden=true;$('mTitle').textContent=`${P().name}想知道：今天心情怎麼樣呢？`;$('ovMood').classList.add('on')}
function chooseMood(m){lastMood=m;const g=pick(GREET[m]);$('mSay').textContent=g;$('mExtra').textContent=EXTRA[m];$('mTitle').textContent=`你選了「${MOODS[m].n}」`;$('mPick').hidden=true;$('mReply').hidden=false;$('mBreath').hidden=m==='happy';say(g);
 if(m==='happy'){anim('dance');hearts(4);sfx('chime')}else if(m==='sad'){anim('hug',1600);hearts(6);sfx('heart')}else{anim('purr',1100);sfx('heart')}
 track('mood');if(S.checkDay!==today()){S.checkDay=today();gain(5)}if(m==='sad')P().joy=clamp(P().joy+5);save();render();$('mWrite').focus()}
$('mFaces').innerHTML=Object.keys(MOODS).map(k=>`<button type="button" data-m="${k}">${face(k,56)}${MOODS[k].n}</button>`).join('');
$('mFaces').onclick=e=>{const b=e.target.closest('[data-m]');if(b)chooseMood(b.dataset.m)};
$('mClose').onclick=()=>$('ovMood').classList.remove('on');
$('mWrite').onclick=()=>{$('ovMood').classList.remove('on');dMood=lastMood;renderDiaryForm();$('form').scrollIntoView({behavior:'smooth'});$('txt').focus({preventScroll:true})};
$('mBreath').onclick=()=>{$('ovMood').classList.remove('on');breathe()};
let brT=[];
function breathe(){const p=P();$('brBall').innerHTML=`<svg viewBox="0 0 200 190">${petSvg(p.sp,'calm')}</svg>`;$('ovBreath').classList.add('on');$('brBall').classList.remove('in');$('brTxt').textContent='準備好了嗎？跟著圓圈一起呼吸。';
 brT.forEach(clearTimeout);brT=[];
 for(let k=0;k<3;k++){brT.push(setTimeout(()=>{$('brBall').classList.add('in');$('brTxt').textContent=`吸氣……（${k+1}/3）`;sfx('breathe')},1500+k*8000));
  brT.push(setTimeout(()=>{$('brBall').classList.remove('in');$('brTxt').textContent='慢慢吐氣……'},5500+k*8000))}
 brT.push(setTimeout(()=>{$('brBall').innerHTML=`<svg viewBox="0 0 200 190">${petSvg(p.sp,'happy')}</svg>`;$('brTxt').textContent='做得很好！你的心一定也輕鬆一點了。';sfx('chime');gain(2);p.joy=clamp(p.joy+5);save();render()},25500))}
$('brClose').onclick=()=>{brT.forEach(clearTimeout);$('ovBreath').classList.remove('on');say('不管什麼時候，我都會陪你慢慢呼吸。');anim('hug',1600);hearts(4)};

// ===== 日記 =====
function renderDiaryForm(){$('dFaces').innerHTML=Object.keys(MOODS).map(k=>`<button type="button" data-m="${k}" aria-pressed="${dMood===k}">${face(k,36)}${MOODS[k].n}</button>`).join('')}
function fmt(ts){const d=new Date(ts);return d.toLocaleDateString('zh-TW',{month:'long',day:'numeric',weekday:'short'})+' '+d.toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit',hour12:false})}
function diaryReply(m,t){const k=KEYS.find(([re])=>re.test(t));return k?pick(k[1]):pick(REPLY[m])}
function renderDiary(){
 $('filter').innerHTML=[['all','全部'],...Object.keys(MOODS).map(k=>[k,MOODS[k].n])].map(([k,n])=>`<button type="button" data-k="${k}" aria-pressed="${filt===k}">${n}</button>`).join('');
 const items=S.diary.filter(d=>filt==='all'||d.mood===filt);
 $('list').innerHTML=items.length?items.map(d=>`<article class="entry">${face(MOODS[d.mood]?d.mood:'calm',44)}<div><time>${esc(fmt(d.ts))} · ${MOODS[d.mood]?.n||''}</time><p>${esc(d.text)}</p><div class="reply wk">${thumb(SP[d.sp]?d.sp:(P()?.sp||'dango'),'happy','')}<span>${esc(d.who||P()?.name||'')}：${esc(d.reply)}</span></div></div><button class="del" data-del="${esc(d.id)}" aria-label="刪除這則">刪除</button></article>`).join('')
  :`<div class="empty">${S.diary.length?'這個心情還沒有紀錄。':'還沒有日記。<br>寫下第一則心情點滴吧！'}</div>`;
 const n=S.diary.length,wk=S.diary.filter(d=>Date.now()-d.ts<7*864e5),hp=wk.filter(d=>d.mood==='happy').length;
 $('tally').innerHTML=n?`<p class="small">共 ${n} 則心情紀錄${wk.length?`。這 7 天寫了 ${wk.length} 則，其中 ${hp} 則是開心的${hp?'，真好！':'，下週一起找找小確幸吧！'}`:''}</p>`+Object.keys(MOODS).map(k=>{const c=S.diary.filter(d=>d.mood===k).length;return `<div>${face(k,24)}<span class="bar"><i style="width:${c/n*100}%;background:${MOODS[k].c}"></i></span><b>${c}</b></div>`}).join(''):''}
$('dFaces').onclick=e=>{const b=e.target.closest('[data-m]');if(b){dMood=b.dataset.m;sfx('click');renderDiaryForm()}};
$('txt').oninput=()=>{$('count').textContent=$('txt').value.length+' / 500'};
$('form').onsubmit=e=>{e.preventDefault();const t=$('txt').value.trim();if(!t){toast('先寫一點點內容吧～');$('txt').focus();return}
 const r=diaryReply(dMood,t);S.diary.unshift({id:Date.now().toString(36),ts:Date.now(),mood:dMood,text:t,reply:r,who:P().name,sp:P().sp});if(S.diary.length===1)remember(P(),'一起寫下第一則心情日記');$('txt').value='';$('count').textContent='0 / 500';
 gain(3);track('diary');say(r);if(dMood==='sad'){anim('hug',1600);hearts(6)}else if(dMood==='happy'){anim('dance');hearts(4)}else anim('purr',1100);
 sfx('heart');save();render();renderDiary();toast(`${P().name}讀完你的日記了`);$('stage').scrollIntoView({behavior:'smooth',block:'center'})};
$('filter').onclick=e=>{const b=e.target.closest('[data-k]');if(b){filt=b.dataset.k;renderDiary()}};
$('list').onclick=e=>{const b=e.target.closest('[data-del]');if(!b)return;const i=S.diary.findIndex(d=>d.id===b.dataset.del);if(i<0)return;
 undoItem={i,d:S.diary.splice(i,1)[0]};save();renderDiary();toast('已刪除一則日記',true)};
function toast(t,undo){$('toastT').textContent=t;$('toastU').hidden=!undo;$('toast').classList.add('on');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('on'),4000)}
$('toastU').onclick=()=>{if(undoItem){S.diary.splice(undoItem.i,0,undoItem.d);undoItem=null;save();renderDiary()}$('toast').classList.remove('on')};

// ===== 小遊戲屋：每個遊戲每天 3 次 =====
let stopGame=null,playing=false;
const ART={
 boss:()=>`<div class="art" style="background:linear-gradient(#3a2a5a,#8a6ab8)">${BOSS_SVG}</div>`,
 run:()=>`<div class="art" style="background:linear-gradient(#9fd8f5,#e8f7ff 70%,#e8b27a 70%)"><svg viewBox="0 0 200 190">${petSvg(P().sp,'happy')}</svg></div>`,
 bubble:()=>`<div class="art" style="background:linear-gradient(#fff0f6,#e6f4ff)"><svg viewBox="0 0 160 100">${[['#ff7c9c',30,24],['#ffc94a',60,24],['#5fc9ae',90,24],['#7aa8ff',120,24],['#b58cff',45,50],['#ff7c9c',75,50],['#ffc94a',105,50],['#5fc9ae',80,84]].map(([c,x,y])=>`<circle cx="${x}" cy="${y}" r="14" fill="${c}"/><circle cx="${x-5}" cy="${y-5}" r="4" fill="#fff" opacity=".7"/>`).join('')}</svg></div>`};
function gameMenu(){playing=false;$('gTitle').textContent='小遊戲屋';Snd.play('room');
 $('gBody').innerHTML=`<p style="margin:0">每個遊戲每天都可以玩 <b>${DAILY}</b> 次。贏得的飼料會放進背包，星星累積 ${SLOTCOST} 顆可以解鎖新的寵物格。</p>
 <div class="gcards">${GAMES.map(g=>{const l=playsLeft(g.id);return `<div class="gcard">${ART[g.id]()}<h3>${g.n}</h3><p>${g.d}</p><p class="rw">${g.reward}</p><p class="left">今天還可以玩 ${l} / ${DAILY} 次</p><button class="save" data-g="${g.id}" ${l>0?'':'disabled'}>${l>0?'開始':'明天再來'}</button></div>`}).join('')}</div>
 <p class="small">目前背包：${FOOD[SP[P().sp].grp].slice(1).map((f,i)=>`${f[0]} ×${S.inv[i]}`).join('、')}</p>`}
function openGames(){$('ovGame').classList.add('on');sfx('click');gameMenu()}
$('gBody').onclick=e=>{const b=e.target.closest('[data-g]');if(!b)return;const g=GAMES.find(x=>x.id===b.dataset.g);if(playsLeft(g.id)<=0)return;
 plays()[g.id]=(plays()[g.id]||0)+1;track('game');save();render();sfx('chime');Snd.play('game');
 playing=true;$('gTitle').textContent=g.n;$('gBody').innerHTML='<div id="gRoot" style="display:flex;flex-direction:column;gap:12px"></div>';
 stopGame=g.fn($('gRoot'),P().sp,res=>{stopGame=null;playing=false;reward(g,res)})};
function reward(g,res){const p=P(),grp=SP[p.sp].grp,got=[0,0,0,0];Snd.play('room');
 for(let k=0;k<res.feeds;k++){const r=Math.random();const t=r<.4?0:r<.7?1:r<.9?2:3;got[t]++;S.inv[t]++}
 S.stars+=res.stars;gain(5,p);const cn=res.win?30:12;earn(cn,1);p.wins=p.wins||{};if(res.win&&!p.wins[g.id]){p.wins[g.id]=1;remember(p,{boss:'一起打倒了噗噗大魔王！',run:'第一次一起冒險走到終點',bubble:'一起把泡泡全部清光光'}[g.id])}p.joy=clamp(p.joy+10);save();render();
 const cheer=res.win?pick(['我們是最強的搭檔！','跟你一起贏的感覺最棒了！','你好厲害，我好崇拜你！']):pick(['沒關係！跟你一起玩就很開心了。','輸贏不重要，重要的是我們在一起！','下次我們一定會更好的，我相信你！']);
 $('gBody').innerHTML=`<div class="result"><svg class="rp" viewBox="0 0 200 190" style="background:${SP[p.sp].bg};border-radius:24px">${petSvg(p.sp,res.win?'happy':'calm')}</svg>
 <h2>${res.win?'成功了！':'辛苦了！'}</h2><p style="margin:0">${esc(res.msg)}</p><p class="say" style="margin:0">${esc(p.name)}：「${cheer}」</p>
 <div class="rewards">${got.map((n,i)=>n?`<span>${foodIcon(grp,i+1,26)}${FOOD[grp][i+1][0]} ×${n}</span>`:'').join('')}<span>${COIN(22)}金幣 ×${cn}</span>${res.stars?`<span>${STAR(22)}星星 ×${res.stars}</span>`:''}</div>
 <p class="small">一起玩讓${esc(p.name)}的友好度 +5、開心 +10。這個遊戲今天還能玩 ${playsLeft(g.id)} 次。</p>
 <div class="row" style="justify-content:center"><button class="ghost" id="gAgain">回遊戲選單</button><button class="save" id="gHome">回房間</button></div></div>`;
 $('gAgain').onclick=gameMenu;$('gHome').onclick=closeGames;say(cheer)}
function closeGames(){if(stopGame){stopGame();stopGame=null;toast('中途離開，這次遊玩次數已經用掉囉')}playing=false;$('ovGame').classList.remove('on');Snd.play('room');render()}
$('gExit').onclick=closeGames;
$('btnGame').onclick=openGames;

// ===== 友好度：照顧、聊天、今日任務、每日禮物、小秘密 =====
const QUESTS=[['feed','餵食 2 次',2],['play','玩耍 2 次',2],['pet','在牠身上摸摸 3 次',3],['care','照顧牠 2 次（洗澡、梳毛、哄睡）',2],['mood','關心今天的心情',1],['diary','寫 1 則心情日記',1],['game','玩 1 次小遊戲',1]];
function daily(){if(!S.daily||S.daily.day!==today())S.daily={day:today(),c:{},done:{},bonus:false,gift:false};return S.daily}
function track(k){const d=daily();d.c[k]=(d.c[k]||0)+1;
 QUESTS.forEach(([id,n,goal])=>{if(!d.done[id]&&(d.c[id]||0)>=goal){d.done[id]=true;setTimeout(()=>{gain(5);earn(10,1);toast(`完成任務「${n}」，友好度 +5、金幣 +10`);sfx('chime');save();render()},900)}});
 if(!d.bonus&&QUESTS.every(q=>d.done[q[0]])){d.bonus=true;if(!P().allDone){P().allDone=1;remember(P(),'第一次完成所有每日任務')}setTimeout(()=>{gain(15);S.stars+=2;earn(30,1);confetti();sfx('level');say('今天的任務全部完成了！你是全世界最棒的主人！');toast('全部完成！友好度 +15、星星 +2');save();render()},2200)}
 save();renderQuests()}
function fav(p){let h=7;for(const ch of p.id+p.sp)h=(h*31+ch.charCodeAt(0))>>>0;return{toy:TOYS[h%TOYS.length].id,food:1+((h>>>4)%4)}}
function favHit(p,kind,val,base){const f=fav(p);if(f[kind]!==val)return false;p.known=p.known||{};const first=!p.known[kind];p.known[kind]=true;if(first)remember(p,`發現牠最愛的${kind==='toy'?'玩具':'飼料'}：${kind==='toy'?TOYS.find(x=>x.id===val).n:FOOD[SP[p.sp].grp][val][0]}`);
 gain(base*2);hearts(6);sfx('chime');say(first?`發現了！這是我最喜歡的${kind==='toy'?'玩具':'食物'}！友好度加倍！`:pick(['最喜歡這個了！謝謝你記得！','果然還是這個最棒！友好度加倍～']));return true}
function renderQuests(){if(!P())return;const d=daily(),n=QUESTS.filter(q=>d.done[q[0]]).length;$('qBar').style.width=n/QUESTS.length*100+'%';
 $('quests').innerHTML=QUESTS.map(([id,t,g])=>{const c=Math.min(g,d.c[id]||0),ok=d.done[id];return `<div class="quest ${ok?'ok':''}"><span class="ck">${ok?'<svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7l3.5 3.5L12 3" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>':''}</span><span>${t}</span><b>${c} / ${g}</b></div>`}).join('')+(d.bonus?'<p class="small" style="color:var(--berry)">今天全部完成了，謝謝你這麼用心！</p>':'');
 renderGift();renderSecret()}
const GIFT_SVG=o=>`<svg viewBox="0 0 120 110" aria-hidden="true">${o?'<g fill="#ffc94a"><path d="M30 18l4 8 8 1-6 6 2 8-8-4-8 4 2-8-6-6 8-1z"/><path d="M92 10l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z"/></g>':''}<rect x="18" y="50" width="84" height="56" rx="8" fill="#ff7c9c"/><rect x="52" y="50" width="16" height="56" fill="#ffc94a"/>
<g transform="${o?'translate(-2 -26) rotate(-14 60 44)':''}"><rect x="12" y="34" width="96" height="20" rx="6" fill="#e8507a"/><rect x="52" y="34" width="16" height="20" fill="#ffc94a"/>${o?'':'<path d="M60 34c-14-20-34-14-26-2 4 6 16 4 26 2zM60 34c14-20 34-14 26-2-4 6-16 4-26 2z" fill="#ffc94a"/>'}</g></svg>`;
function renderGift(){const d=daily();
 $('gift').innerHTML=d.gift?`${GIFT_SVG(1).replace('<svg','<svg width="120"')}<p style="margin:0">${esc(d.giftTxt||'今天的禮物已經打開了')}</p><p class="small">明天再來拿新的禮物喔！</p>`
  :`<button class="giftbox" id="giftBtn" aria-label="打開禮物">${GIFT_SVG(0)}</button><p style="margin:0">${esc(P().name)}幫你準備了一份禮物！</p><button class="save" id="giftOpen">打開看看</button>`;
 if(!d.gift){$('giftBtn').onclick=$('giftOpen').onclick=openGift}}
function openGift(){const d=daily();if(d.gift||!$('giftBtn'))return;$('giftBtn').classList.add('shake');$('giftOpen').disabled=true;sfx('click');
 setTimeout(()=>{const r=Math.random(),p=P(),grp=SP[p.sp].grp;let txt;
  if(r<.45){const t=Math.floor(Math.random()*4);S.inv[t]+=2;gain(3);txt=`得到 ${FOOD[grp][t+1][0]} ×2，友好度 +3！`}
  else if(r<.6){gain(10);txt='得到一個大大的親親，友好度 +10！'}
  else if(r<.8){earn(40,1);gain(3);txt='得到 40 枚金幣，友好度 +3！'}
  else{S.stars+=1;gain(3);txt='得到 1 顆星星，友好度 +3！'}
  d.gift=true;d.giftTxt=txt;sfx('gift');confetti();say('鏘鏘～這是我特別為你準備的禮物！');save();render()},1000)}
function renderSecret(){const p=P(),f=fav(p),k=p.known||{},t=TOYS.find(x=>x.id===f.toy),grp=SP[p.sp].grp,lv=Math.floor(p.aff/100);
 $('secret').innerHTML=`<div class="secret"><span class="ic">${k.toy?t.ic:'？'}</span><p>${k.toy?`最愛玩具：<b>${t.n}</b>（友好度 ×2）`:'最愛玩具：？？？<br><span class="small">每種玩具都試試看吧！</span>'}</p></div>
 <div class="secret"><span class="ic">${k.food?foodIcon(grp,f.food,32):'？'}</span><p>${k.food?`最愛飼料：<b>${FOOD[grp][f.food][0]}</b>（友好度 ×2）`:'最愛飼料：？？？<br><span class="small">藏在特別飼料裡，玩小遊戲就有機會拿到</span>'}</p></div>
 <div class="secret"><span class="ic">${STAR(30)}</span><p>再 <b>${100-p.aff%100}</b> 點升到 Lv.${lv+2}<br><span class="small">每升一級送 2 顆星星</span></p></div>`}

const CI=b=>`<svg viewBox="0 0 40 40" aria-hidden="true">${b}</svg>`;
const CARE=[
 {id:'bath',n:'洗澡',ic:CI('<path d="M6 20h28v6a8 8 0 0 1-8 8H14a8 8 0 0 1-8-8z" fill="#7ac8f0"/><circle cx="14" cy="14" r="5" fill="#eaf6ff" stroke="#7ac8f0" stroke-width="2"/><circle cx="24" cy="11" r="4" fill="#eaf6ff" stroke="#7ac8f0" stroke-width="2"/><path d="M10 34l-2 4M30 34l2 4" stroke="#8a6f68" stroke-width="2"/>')},
 {id:'brush',n:'梳毛',ic:CI('<rect x="20" y="16" width="18" height="6" rx="3" fill="#c98a4b"/><rect x="4" y="12" width="20" height="14" rx="5" fill="#ff9fb4"/><path d="M7 26v6M11 26v6M15 26v6M19 26v6" stroke="#8a6f68" stroke-width="2"/>')},
 {id:'sleep',n:'哄睡覺',ic:CI('<path d="M26 6a14 14 0 1 0 8 22A12 12 0 0 1 26 6z" fill="#ffd23f"/><text x="24" y="18" font-size="10" font-weight="700" fill="#7a6ab8">z</text>')},
 {id:'towel',n:'擦乾',ic:CI('<rect x="4" y="8" width="32" height="24" rx="5" fill="#ffb3c6"/><path d="M4 14h32M4 26h32" stroke="#fff" stroke-width="2.5" stroke-dasharray="3 3"/>')},
 {id:'chat',n:'說說話',ic:CI('<path d="M6 8h28a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H18l-8 7v-7H6a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3z" fill="#5fc9ae"/><circle cx="13" cy="18" r="2.2" fill="#fff"/><circle cx="20" cy="18" r="2.2" fill="#fff"/><circle cx="27" cy="18" r="2.2" fill="#fff"/>')}];
$('care').innerHTML=CARE.map(c=>`<button type="button" data-c="${c.id}">${c.ic}${c.n}</button>`).join('');
$('care').onclick=e=>{const b=e.target.closest('[data-c]');if(!b||busy||!P())return;const id=b.dataset.c;if(id==='chat')return openChat();care(id)};
function care(id){if(id==='towel')return dryPet();const p=P(),d=daily(),k='c_'+id,n=d.c[k]||0;
 if(n>=2){say({bath:'我已經香噴噴的了！明天再洗吧～',brush:'毛毛已經好蓬好順了！明天再梳～',sleep:'我睡飽飽了，現在精神超好！'}[id]);anim('hop');sfx('squeak');return}
 d.c[k]=n+1;lock(id==='sleep'?4200:2700);summon();earn(3);
 if(id==='bath'){sfx('splash');for(let i=0;i<26;i++)setTimeout(()=>{const r=document.createElement('span');r.className='drop2';r.style.left=(30+Math.random()*40)+'%';$('stage').append(r);setTimeout(()=>r.remove(),800)},i*45);
  setTimeout(()=>{sfx('bubble');for(let i=0;i<12;i++){const f=document.createElement('span');f.className='foam';const sz=18+Math.random()*26;f.style.width=f.style.height=sz+'px';f.style.left=(36+Math.random()*28)+'%';f.style.bottom=(16+Math.random()*30)+'%';f.style.animationDelay=Math.random()*.4+'s';$('stage').append(f);setTimeout(()=>f.remove(),3000)}anim('purr',1100)},900)}
 if(id==='brush'){sfx('swoosh');add('toyfx t-brush',`<svg viewBox="0 0 80 40"><rect x="40" y="14" width="38" height="10" rx="5" fill="#c98a4b"/><rect x="4" y="8" width="40" height="22" rx="8" fill="#ff9fb4"/><path d="M8 30v8M14 30v8M20 30v8M26 30v8M32 30v8M38 30v8" stroke="#8a6f68" stroke-width="2"/></svg>`,2100);setTimeout(()=>sfx('swoosh'),700);anim('purr',2000)}
 if(id==='sleep'){sfx('lullaby');add('night','',4100);setTimeout(()=>{$('pet').innerHTML=petSvg(p.sp,'happy');$('pet').dataset.e='sleep'},400);
  for(let i=0;i<5;i++)setTimeout(()=>{const z=document.createElement('span');z.className='zzz';z.textContent='Z';z.style.fontSize=(18+i*4)+'px';$('stage').append(z);setTimeout(()=>z.remove(),1700)},600+i*600)}
 setTimeout(()=>{for(let i=0;i<6;i++)setTimeout(()=>{const s=document.createElement('span');s.className='spark';s.textContent='✦';s.style.left=(30+Math.random()*40)+'%';s.style.top=(35+Math.random()*35)+'%';$('stage').append(s);setTimeout(()=>s.remove(),1100)},i*90);
  p.joy=clamp(p.joy+(id==='sleep'?15:8));gain(4);track('care');if(id==='bath')wetPet(p);sfx('heart');
  say(pick({bath:['洗好了！可是全身濕答答的……快拿毛巾幫我擦乾！','泡泡浴好好玩～現在好冷，要毛巾！'],brush:['毛毛變得好蓬鬆！我是不是更可愛了？','梳毛好舒服，我都快睡著了～'],sleep:['呼……睡飽了！夢裡也有你喔。','謝謝你哄我睡覺，我做了一個好甜的夢！']}[id]));save();render()},id==='sleep'?3900:2300)}

const CHAT=[
 ['你好可愛！',p=>['嘿嘿，被你誇獎了！你也超可愛的！','真的嗎？那我要更可愛給你看！'],'dance'],
 ['謝謝你陪我',p=>['是我要謝謝你，每天都來看我。','能陪著你，是我最幸福的事。'],'purr'],
 ['我好愛你',p=>['我也超級超級愛你！','愛你愛到尾巴都在發光！'],'dance'],
 ['今天好累喔',p=>['辛苦了，靠在我身上休息一下吧。','累的話就什麼都不要想，我陪你發呆。'],'hug'],
 ['我們是好朋友嗎？',p=>p.aff>=200?['當然！你是我最好最好的朋友！']:p.aff>=100?['是呀！我們已經是好朋友了！']:['我們正在變成好朋友喔，再多陪我一下下～'],'hop'],
 ['給你一個抱抱',p=>['抱緊緊～好溫暖！','嗚嗚，好幸福的抱抱！'],'hug'],
 ['你今天開心嗎？',p=>expr(p)==='happy'?['超開心！因為你在這裡！']:expr(p)==='calm'?['還不錯～如果你陪我玩就會更開心！']:['有一點點寂寞……可以陪陪我嗎？'],'hop'],
 [()=>twHour()<12?'早安！':'晚安～',p=>twHour()<12?['早安！今天也一起加油吧！']:['晚安，祝你做個好夢，明天見！'],'purr']];
function openChat(){const p=P(),left=Math.max(0,5-(daily().c.chat||0));$('chH').textContent=`想跟${p.name}說什麼？`;
 $('chSub').textContent=left?`今天聊天還能增加 ${left} 次友好度（每次 +2）`:'今天聊天的友好度加滿了，但牠還是很喜歡聽你說話！';
 $('chList').innerHTML=CHAT.map((c,i)=>`<button type="button" data-ch="${i}">${typeof c[0]==='function'?c[0]():c[0]}</button>`).join('');$('chReply').hidden=true;$('ovChat').classList.add('on')}
$('chList').onclick=e=>{const b=e.target.closest('[data-ch]');if(!b)return;const p=P(),c=CHAT[+b.dataset.ch],r=pick(c[1](p)),d=daily();
 $('chReply').hidden=false;$('chReply').textContent=`${p.name}：「${r}」`;say(r);anim(c[2],c[2]==='hug'?1600:1100);sfx('squeak');hearts(2);
 if((d.c.chat||0)<5){d.c.chat=(d.c.chat||0)+1;gain(2);const left=5-d.c.chat;$('chSub').textContent=left?`今天聊天還能增加 ${left} 次友好度（每次 +2）`:'今天聊天的友好度加滿了，但牠還是很喜歡聽你說話！'}save();render()};
$('chClose').onclick=()=>$('ovChat').classList.remove('on');

// ===== 其他控制 =====
$('foods').onclick=e=>{const b=e.target.closest('[data-f]');if(b&&!b.disabled){S.food=+b.dataset.f;sfx('click');save();render()}};
$('toys').onclick=e=>{const b=e.target.closest('[data-t]');if(b){S.toy=b.dataset.t;sfx('click');save();render()}};
$('btnFeed').onclick=feed;$('btnPlay').onclick=play;$('btnMood').onclick=()=>{sfx('click');openMood()};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('ovMood').classList.remove('on');$('ovChat').classList.remove('on');$('ovRename').classList.remove('on');if(S.pets.length&&adMode!=='first')$('ovAdopt').classList.remove('on')}});

