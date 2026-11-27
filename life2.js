// ===== 生活 2.0：台灣時間、天氣與室溫（冷氣暖氣）、日夜提醒、睡眠／黑眼圈／病懨懨／送醫、寵物衣服 =====
const HOUR=3.6e6;
// 台灣時間的某一點（今天/之後的 h 點）換算成時間戳
function twAt(ts,h){const d=new Date(ts),p=new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).format(d);return Date.parse(`${p}T${String(h).padStart(2,'0')}:00:00+08:00`)}
const twHourOf=ts=>Number(new Intl.DateTimeFormat('en-US',{timeZone:TZ,hour:'numeric',hourCycle:'h23'}).format(new Date(ts)))%24;
function lastAt(h,now){let t=twAt(now,h);if(t>now)t-=24*HOUR;return t}
function nextAt(h,ts){let t=twAt(ts,h);if(t<=ts)t+=24*HOUR;return t}

document.head.insertAdjacentHTML('beforeend',`<style>
.wxbar{display:flex;align-items:center;gap:8px;margin:0 0 10px;flex-wrap:wrap}
.wxchip{flex:1 1 220px;min-width:0;min-height:0;padding:5px 12px 5px 6px;border-radius:16px;background:var(--card);box-shadow:0 4px 12px -8px #0004;display:flex;align-items:center;gap:6px;font-size:12px;line-height:1.3;text-align:left;color:var(--ink)}
.wxchip svg{width:28px;height:28px;flex:none}.wxchip div{min-width:0}.wxchip b{font-size:13px}.wxchip span{display:block;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wxchip.warn{background:#fff3c8;animation:wxw 1.6s ease-in-out infinite}.wxchip.danger{background:#ffd9df}.wxchip.danger span,.wxchip.warn span{color:#b0304a;font-weight:700}
@keyframes wxw{50%{box-shadow:0 0 0 4px #ffc94a66}}
.wxac{display:flex;gap:6px}.wxac button{min-height:36px;padding:2px 12px;font-size:13px;border-radius:99px;background:var(--card);border:2px solid var(--line);color:var(--ink)}
#acCool[aria-pressed=true]{background:#7ac8f0;border-color:#7ac8f0;color:#fff}#acHeat[aria-pressed=true]{background:#ff8a5a;border-color:#ff8a5a;color:#fff}
@media(max-width:760px){.wxbar{margin:0 0 8px;flex-wrap:nowrap;gap:6px}.wxchip{flex:1 1 auto;padding:4px 8px 4px 4px}.wxchip svg{width:22px;height:22px}.wxchip b{font-size:12px}.wxac{flex-direction:column;gap:4px}.wxac button{min-height:28px;padding:0 10px;font-size:12px;white-space:nowrap}}
.wxrain line{stroke:#cfe6ff;stroke-width:1.6;stroke-linecap:round;animation:rain .7s linear infinite}
@keyframes rain{from{transform:translate(0,-40px)}to{transform:translate(-6px,60px)}}
.wxfrost{fill:#fff;opacity:.75}
.pw.shiver .pet{animation:shiver .18s linear infinite!important}
@keyframes shiver{0%,100%{transform:translateX(0)}25%{transform:translateX(-1.5px)}75%{transform:translateX(1.5px)}}
.pw.sick .pet{filter:grayscale(.55) brightness(.95) drop-shadow(0 6px 6px #8a4a2a22)}
.pw.asleep .pet{animation:breathe 3.4s ease-in-out infinite!important}
@keyframes breathe{50%{transform:scaleY(.96)}}
.pw.asleep .ptag{background:#6a5ab8;color:#fff;opacity:1}
.pw.sick .ptag{background:#9aa88a;color:#fff;opacity:1}
.pw .zz{position:absolute;right:8%;top:4%;font:700 18px "Huninn",sans-serif;color:#7a6ab8;animation:zz 2.4s ease-in-out infinite;pointer-events:none}
@keyframes zz{0%{opacity:0;transform:translate(0,6px) scale(.7)}40%{opacity:1}100%{opacity:0;transform:translate(10px,-16px) scale(1.1)}}
.stage.indoorCold::after,.stage.indoorHot::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:6}
.stage.indoorCold::after{background:radial-gradient(transparent 55%,#bfe2ff55)}
.stage.indoorHot::after{background:radial-gradient(transparent 55%,#ffb27a44)}
.clim{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}
.clim div{background:var(--bg);border-radius:14px;padding:10px;text-align:center}.clim b{display:block;font-size:26px}
.climb{display:flex;gap:8px;flex-wrap:wrap}.climb button{flex:1 1 30%}.climb button[aria-pressed=true]{background:var(--mint);color:#fff}
.wgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px;max-height:46vh;overflow:auto;padding:2px}
.wcard{background:var(--bg);border-radius:14px;padding:6px;display:flex;flex-direction:column;align-items:center;font-size:13px;border:2px solid transparent;min-height:0}
.wcard.on{border-color:var(--berry)}.wcard>svg:first-child{width:56px;height:48px}.wcard em svg{width:12px;height:12px}.wcard em{font-style:normal;font-size:12px;color:var(--mute)}
.wprev{width:140px;margin:0 auto;display:block}
.vet{font-size:15px;line-height:1.6}
</style>`);

// ---------- 天氣（台北） ----------
const WXI={sun:'<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="8" fill="#ffc94a"/><g stroke="#ffc94a" stroke-width="3" stroke-linecap="round"><path d="M20 4v5M20 31v5M4 20h5M31 20h5M8.7 8.7l3.5 3.5M27.8 27.8l3.5 3.5M8.7 31.3l3.5-3.5M27.8 12.2l3.5-3.5"/></g></svg>',
 cloud:'<svg viewBox="0 0 40 40"><circle cx="26" cy="14" r="6" fill="#ffc94a"/><path d="M10 30a7 7 0 0 1 1-14 9 9 0 0 1 17 2 6 6 0 0 1 2 12z" fill="#dfe8f2"/></svg>',
 rain:'<svg viewBox="0 0 40 40"><path d="M10 24a7 7 0 0 1 1-14 9 9 0 0 1 17 2 6 6 0 0 1 2 12z" fill="#b9c8da"/><g stroke="#5aa8e0" stroke-width="3" stroke-linecap="round"><path d="M13 29l-2 6M21 29l-2 6M29 29l-2 6"/></g></svg>',
 storm:'<svg viewBox="0 0 40 40"><path d="M10 22a7 7 0 0 1 1-14 9 9 0 0 1 17 2 6 6 0 0 1 2 12z" fill="#9aa8ba"/><path d="M21 22l-5 9h5l-3 7 9-11h-5l3-5z" fill="#ffc94a"/></svg>',
 moon:'<svg viewBox="0 0 40 40"><path d="M26 6a14 14 0 1 0 8 22A12 12 0 0 1 26 6z" fill="#ffd23f"/></svg>',
 fog:'<svg viewBox="0 0 40 40"><g stroke="#b9c8da" stroke-width="4" stroke-linecap="round"><path d="M6 14h28M10 22h24M6 30h22"/></g></svg>'};
const wxKind=c=>c>=95?'storm':(c>=51&&c<=67)||(c>=80&&c<=82)?'rain':c===45||c===48?'fog':c>=2?'cloud':'sun';
const WXN={sun:'晴天',cloud:'多雲',rain:'下雨',storm:'雷雨',fog:'起霧'};
function simWx(){const now=new Date(),m=Number(new Intl.DateTimeFormat('en-US',{timeZone:TZ,month:'numeric'}).format(now))-1,h=twHour();
 const base=[16,16,18,22,25,28,30,30,28,25,22,18][m],t=Math.round(base+3*Math.sin((h-9)/24*2*Math.PI));
 const seed=[...today()].reduce((a,c)=>a*31+c.charCodeAt(0)>>>0,7),rainy=(seed%100)<[45,50,45,40,45,55,35,40,40,30,35,40][m];
 return {t,code:rainy?(seed%7===0&&m>=4&&m<=8?95:61):(seed%3?1:3),at:Date.now(),sim:1}}
async function fetchWx(){if(S.wx&&Date.now()-S.wx.at<30*60000&&!S.wx.sim)return;
 try{const ctl=new AbortController();setTimeout(()=>ctl.abort(),6000);
  const r=await fetch('https://api.open-meteo.com/v1/forecast?latitude=25.04&longitude=121.56&current=temperature_2m,weather_code&timezone=Asia%2FTaipei',{signal:ctl.signal});
  const j=await r.json();if(j&&j.current&&typeof j.current.temperature_2m==='number')S.wx={t:Math.round(j.current.temperature_2m),code:j.current.weather_code|0,at:Date.now()};else throw 0}
 catch(e){if(!S.wx||Date.now()-S.wx.at>30*60000)S.wx=simWx()}
 save();wxApply(true)}
const wx=()=>S.wx||(S.wx=simWx());
// ---------- 室內溫度：冷氣、暖氣 ----------
if(!S.climate)S.climate={mode:'off',last:Date.now()};
const ownAny=k=>true; // 冷氣、暖氣每個玩家都有，開了才付電費
const TRY_WEAR={};const wearOf=p=>TRY_WEAR[p.id]||p.wear||{};
function indoorT(){const o=wx().t,base=Math.round(o+(o<20?3:o>28?-1:1));const m=(S.climate||{}).mode;
 if(m==='cool'&&base>26)return 26;if(m==='heat'&&base<23)return 23;return base}
// ---------- 衣服 ----------
const CLOTHES={
 beanie:{n:'毛線帽',p:120,slot:'head',warm:2},straw:{n:'小草帽',p:90,slot:'head',warm:-1},bow:{n:'蝴蝶結',p:60,slot:'head',warm:0},crown:{n:'小皇冠',p:300,slot:'head',warm:0},
 scarf:{n:'溫暖圍巾',p:150,slot:'neck',warm:3},bowtie:{n:'紳士領結',p:70,slot:'neck',warm:0},bell:{n:'小鈴鐺',p:50,slot:'neck',warm:0},
 glasses:{n:'圓框眼鏡',p:80,slot:'face',warm:0},shades:{n:'太陽眼鏡',p:100,slot:'face',warm:-1},
 cape:{n:'毛毛斗篷',p:220,slot:'body',warm:4},raincoat:{n:'小雨衣',p:160,slot:'body',warm:1},
 blanket:{n:'小毛毯（睡覺蓋）',p:180,slot:'sleep',warm:5}};
const SLOTN={head:'頭上',neck:'脖子',face:'臉上',body:'身上',sleep:'睡覺用'};
const EYES={};
{const _eyes=eyes;let rec=null;eyes=function(a,b,y,r){if(rec&&!rec.done){Object.assign(rec,{a,b,y,r,done:1})}return _eyes.apply(this,arguments)};
 for(const id of Object.keys(SP)){rec={};try{SP[id].draw('calm')}catch(e){}EYES[id]=rec.done?rec:{a:80,b:120,y:80,r:6}}rec=null}
function wearSvg(id,E,back){const s=Math.max(24,E.b-E.a),cx=(E.a+E.b)/2,y=E.y,top=y-s*1.25,neck=y+s*.95;
 switch(id){
  case 'beanie':return `<path d="M${cx-s*.85} ${top+s*.42}q${s*.85}-${s*1.4} ${s*1.7} 0z" fill="#e8507a"/><rect x="${cx-s*.92}" y="${top+s*.34}" width="${s*1.84}" height="${s*.24}" rx="${s*.1}" fill="#ffd6e0"/><circle cx="${cx}" cy="${top-s*.32}" r="${s*.17}" fill="#fff"/>`;
  case 'straw':return `<ellipse cx="${cx}" cy="${top+s*.4}" rx="${s*1.2}" ry="${s*.2}" fill="#f2cf7a"/><path d="M${cx-s*.55} ${top+s*.4}q0-${s*.6} ${s*.55}-${s*.6}t${s*.55} ${s*.6}z" fill="#f6dc94"/><rect x="${cx-s*.55}" y="${top+s*.22}" width="${s*1.1}" height="${s*.12}" fill="#e8507a"/>`;
  case 'bow':return `<g transform="translate(${cx+s*.55} ${top+s*.3})"><path d="M0 0l-${s*.4}-${s*.25}v${s*.5}zM0 0l${s*.4}-${s*.25}v${s*.5}z" fill="#ff7c9c"/><circle r="${s*.1}" fill="#e8507a"/></g>`;
  case 'crown':return `<path d="M${cx-s*.5} ${top+s*.38}l-${s*.06}-${s*.6} ${s*.28} ${s*.28} ${s*.28}-${s*.46} ${s*.28} ${s*.46} ${s*.28}-${s*.28}-${s*.06} ${s*.6}z" fill="#ffd23f" stroke="#e0a020" stroke-width="2"/><circle cx="${cx}" cy="${top+s*.22}" r="${s*.07}" fill="#e8304a"/>`;
  case 'scarf':return `<path d="M${cx-s*1.05} ${neck}q${s*1.05} ${s*.45} ${s*2.1} 0v${s*.3}q-${s*1.05} ${s*.45}-${s*2.1} 0z" fill="#ff8a5a"/><path d="M${cx+s*.45} ${neck+s*.3}l${s*.1} ${s*.7}h${s*.3}l-${s*.05}-${s*.75}z" fill="#ff8a5a"/><path d="M${cx-s*.8} ${neck+s*.12}h${s*1.6}" stroke="#fff" stroke-width="2" stroke-dasharray="4 4"/>`;
  case 'bowtie':return `<g transform="translate(${cx} ${neck+s*.15})"><path d="M0 0l-${s*.38}-${s*.2}v${s*.4}zM0 0l${s*.38}-${s*.2}v${s*.4}z" fill="#3a3a6a"/><circle r="${s*.08}" fill="#5a5a9a"/></g>`;
  case 'bell':return `<path d="M${cx-s*.9} ${neck}q${s*.9} ${s*.35} ${s*1.8} 0" stroke="#e8304a" stroke-width="${s*.12}" fill="none"/><circle cx="${cx}" cy="${neck+s*.28}" r="${s*.16}" fill="#ffd23f" stroke="#e0a020" stroke-width="1.5"/>`;
  case 'glasses':case 'shades':{const R=Math.max(E.r*1.9,s*.27),f=id==='shades'?'#2e2320':'none',o=id==='shades'?.85:1;return `<g opacity="${o}"><circle cx="${E.a}" cy="${y}" r="${R}" fill="${f}" stroke="#3b2a2a" stroke-width="2.5"/><circle cx="${E.b}" cy="${y}" r="${R}" fill="${f}" stroke="#3b2a2a" stroke-width="2.5"/><path d="M${E.a+R} ${y}h${E.b-E.a-2*R}" stroke="#3b2a2a" stroke-width="2.5"/></g>`}
  case 'cape':return back?`<path d="M${cx-s*.9} ${neck-s*.1}q-${s*1.2} ${s*1.6}-${s*1.3} ${s*3}h${s*4.4}q-${s*.1}-${s*1.4}-${s*1.3}-${s*3}z" fill="#9b7be0" opacity=".95"/>`:`<circle cx="${cx}" cy="${neck+s*.08}" r="${s*.14}" fill="#ffd23f"/>`;
  case 'raincoat':return back?`<path d="M${cx-s*.9} ${neck-s*.1}q-${s*1} ${s*1.5}-${s*1.1} ${s*2.8}h${s*4}q-${s*.1}-${s*1.3}-${s*1.1}-${s*2.8}z" fill="#ffd23f"/>`:`<path d="M${cx-s*.9} ${top+s*.5}q${s*.9}-${s*1.6} ${s*1.8} 0" stroke="#ffd23f" stroke-width="${s*.22}" fill="none" stroke-linecap="round"/>`;
  case 'blanket':return `<path d="M18 150q82-30 164 0v38H18z" fill="#b9d8f6"/><path d="M18 150q82-30 164 0" stroke="#fff" stroke-width="5" fill="none" stroke-dasharray="2 9" stroke-linecap="round"/><g fill="#fff" opacity=".7"><circle cx="60" cy="168" r="4"/><circle cx="100" cy="160" r="4"/><circle cx="140" cy="170" r="4"/></g>`}
 return ''}
const wearIcon=id=>`<svg viewBox="40 0 120 150">${wearSvg(id,{a:80,b:120,y:80,r:6},1)}${wearSvg(id,{a:80,b:120,y:80,r:6})}</svg>`;
const DARK=E=>`<g opacity=".55" fill="none" stroke="#6a4a8a" stroke-width="3" stroke-linecap="round"><path d="M${E.a-E.r-2} ${E.y+E.r+4}q${E.r+2} ${E.r} ${2*E.r+4} 0"/><path d="M${E.b-E.r-2} ${E.y+E.r+4}q${E.r+2} ${E.r} ${2*E.r+4} 0"/></g>`;
function warmth(p){return Object.entries(p.wear||{}).reduce((a,[sl,id])=>a+(CLOTHES[id]&&(sl!=='sleep'||p.asleep)?CLOTHES[id].warm:0),0)}
const feels=p=>indoorT()+warmth(p);

// ---------- 睡眠與健康 ----------
// awakeSince：最後一次睡飽的時間。熬夜（凌晨 2 點還醒著）→ 黑眼圈＋脾氣差；連續清醒 20 小時或補眠不滿 4 小時 → 病懨懨；連續 24 小時 → 昏倒
S.pets.forEach(p=>{if(!p.awakeSince)p.awakeSince=Date.now()});
const awakeH=p=>p.asleep?0:(Date.now()-(p.awakeSince||Date.now()))/HOUR;
function petStatus(p){if(p.asleep)return 'sleep';const h=awakeH(p);if(h>=24)return 'dying';if(p.sick||h>=20)return 'sick';if(p.tired||h>=18)return 'tired';return 'ok'}
function wakeAtOf(p){const st=p.sleepStart,h=twHourOf(st);if(h>=8&&h<19)return st+4*HOUR;const n7=nextAt(7,st);return n7-st>=4*HOUR?Math.min(n7,st+9*HOUR):st+4*HOUR}
function doWake(p,at,early){const slept=(at-p.sleepStart)/HOUR;p.asleep=false;delete p.sleepStart;
 if(BEH[p.id]?.act==='nap'){delete BEH[p.id];const el=petEl(p);if(el){el.classList.remove('nap');el.dataset.e=''}}
 if(slept>=4){p.awakeSince=at;p.tired=false;p.sick=false;return 'rested'}
 if(slept>=1){const was=p.tired||p.sick;p.awakeSince=at;if(was){p.sick=true;p.tired=false;return 'sick'}return 'nap'}
 return 'short'}
function sleepPet(p){if(!p||p.asleep)return;if(petStatus(p)==='dying')return faint(p);p.asleep=true;p.sleepStart=Date.now();
 BEH[p.id]={act:'nap',until:Date.now()+864e5};const el=petEl(p);if(el){el.innerHTML=petSvg(p.sp,'happy');el.dataset.e='nap';el.classList.add('nap')}
 sfx('lullaby');const tw=twHour(),day=tw>=8&&tw<19;
 say(day?`${p.name}躺下來補眠了……${p.tired||p.sick?'要讓牠睡滿 4 小時才會恢復精神喔！':'午睡一下下～'}`:`晚安，${p.name}。明天早上 7 點牠會自己醒來。`);
 toast(`${p.name} 睡著了（會在 ${new Intl.DateTimeFormat('zh-TW',{timeZone:TZ,hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(wakeAtOf(p)))} 左右醒來）`);save();render()}
function wakePet(p){if(!p||!p.asleep)return;const slept=(Date.now()-p.sleepStart)/HOUR;
 if(slept<4&&!confirm(`${p.name} 才睡了 ${slept<1?Math.round(slept*60)+' 分鐘':slept.toFixed(1)+' 小時'}。\n沒睡滿 4 小時就叫醒，${p.tired||p.sick?'牠會病懨懨的':'牠可能會沒精神'}。確定要叫醒嗎？`))return;
 const r=doWake(p,Date.now(),1);say(r==='rested'?`${p.name}：「睡飽飽了！精神超好～」`:r==='sick'?`${p.name}：「頭好暈……全身沒力氣……」（病懨懨）`:`${p.name}：「嗯……再讓我睡一下嘛……」`);
 if(r!=='rested')emote(p,'dots',2000);save();render()}
// 點到睡著的寵物：不會被吵醒，只會提醒
const _wakeB=wake;wake=function(p,quiet){if(p&&p.asleep){if(!quiet){const s=(Date.now()-p.sleepStart)/HOUR;say(`噓……${p.name}睡得正香（已經睡了 ${s<1?Math.round(s*60)+' 分鐘':s.toFixed(1)+' 小時'}）。想叫醒牠可以點牠的資料卡。`)}return}return _wakeB(p,quiet)};
const _choose=choose;choose=function(p){if(p.asleep)return 'sniff';let k=_choose(p);if(k==='nap'&&petStatus(p)==='ok'&&Math.random()<.6)k='stretch';return k};
const _doBeh=doBeh;doBeh=function(p){if(p.asleep)return;return _doBeh(p)};
// 哄睡覺 → 真的睡覺
const _care2=care;care=function(id){if(id==='sleep'){const p=P();if(!p)return;if(p.asleep)return wakePet(p);return sleepPet(p)}const p=P();if(p&&p.asleep){say(`噓……${p.name}正在睡覺。`);return}return _care2(id)};
const _feed2=feed;feed=function(){const p=P();if(p&&p.asleep){say(`${p.name}睡著了，等牠醒來再吃吧～`);sfx('squeak');return}return _feed2()};
const _play2=play;play=function(){const p=P();if(p&&p.asleep){say(`噓……${p.name}在睡覺，不要吵醒牠。`);sfx('squeak');return}return _play2()};
if(typeof petBlocked==='function'){const _pb=petBlocked;petBlocked=function(p){if(p.asleep){say(`${p.name}睡著了，輕輕摸一下就好……`);return true}
 const st=petStatus(p);if((st==='tired'||st==='sick')&&!busy&&Math.random()<.22){say(`${p.name}熬夜脾氣超差！`);bite(p);return true}return _pb(p)}}
// 病懨懨時友好度只長一半
const _gain2=gain;gain=function(a,p){p=p||P();if(p&&petStatus(p)==='sick'&&a>1)a=Math.ceil(a/2);return _gain2(a,p)};

// ---------- 昏倒 → 送醫 → 埋葬（都要付錢） ----------
document.body.insertAdjacentHTML('beforeend',`<div class="ov" id="ovVet"><div class="dlg"><h2 id="vetT"></h2><div class="biteface" id="vetFace"></div><div class="vet" id="vetTxt"></div><div class="row" id="vetBtns"></div></div></div>
<div class="ov" id="ovClimate"><div class="dlg"><h2>天氣與室內溫度</h2><div id="climBody"></div><div class="row"><button class="save" id="climClose">好</button></div></div></div>
<div class="ov" id="ovWear"><div class="dlg"><h2 id="wearT">衣櫃</h2><div id="wearBody"></div><div class="row"><button class="save" id="wearClose">好</button></div></div></div>`);
['ovVet','ovClimate','ovWear'].forEach(id=>$(id).style.zIndex=17);
$('climClose').onclick=()=>$('ovClimate').classList.remove('on');$('wearClose').onclick=()=>{$('ovWear').classList.remove('on');save();render()};
$('ovClimate').onclick=e=>{if(e.target.id==='ovClimate')$('ovClimate').classList.remove('on')};
$('ovWear').onclick=e=>{if(e.target.id==='ovWear'){$('ovWear').classList.remove('on');save();render()}};
const VETFEE=800,BURY=500;let vetFor=null;
function pay(n){const c=Math.min(S.coins,n);S.coins-=c;return c}
function faint(p){if(vetFor||!p)return;vetFor=p;busy=true;sfx('hit');
 $('vetT').textContent=`${p.name} 昏倒了！`;$('vetFace').innerHTML=petSvg(p.sp,'sad');$('vetFace').style.filter='grayscale(.8)';
 $('vetTxt').innerHTML=`<p>${esc(p.name)} 已經連續 24 小時沒有睡覺，身體撐不住倒下了……</p><p>必須馬上送到動物醫院急救（醫療費 ${COIN(14)} ${VETFEE}）。</p>`;
 $('vetBtns').innerHTML=`<button class="save" id="vetGo">送醫急救（${VETFEE} 金幣）</button>`;$('ovVet').classList.add('on');
 $('vetGo').onclick=()=>{const paid=pay(VETFEE);save();sfx('click');$('vetTxt').innerHTML=`<p>醫生和護理師努力搶救了好久……</p><p class="small">（付了 ${paid} 金幣${paid<VETFEE?'，剩下的醫院讓你先欠著':''}）</p>`;$('vetBtns').innerHTML='';
  setTimeout(()=>{$('vetT').textContent='很遺憾……';$('vetTxt').innerHTML=`<p>醫生輕輕搖頭：「${esc(p.name)} 太累了，已經去當小天使了。」</p><p>讓我們好好送牠最後一程，為牠準備一個安靜的小墓地（埋葬費 ${COIN(14)} ${BURY}）。</p>`;
   $('vetBtns').innerHTML=`<button class="save" id="vetBury">埋葬 ${esc(p.name)}（${BURY} 金幣）</button>`;$('vetBury').onclick=()=>bury(p)},2600)}}
function bury(p){const paid=pay(BURY);S.memorial=(S.memorial||[]).concat({name:p.name,sp:p.sp,day:today(),aff:p.aff}).slice(-50);
 const i=S.pets.indexOf(p);if(i>=0){S.pets.splice(i,1);delete POS[p.id];delete BEH[p.id]}S.cur=Math.max(0,Math.min(S.cur>=i?S.cur-1:S.cur,S.pets.length-1));
 $('vetT').textContent='安息吧';$('vetFace').innerHTML='<svg viewBox="0 0 120 110"><path d="M30 100V44a30 30 0 0 1 60 0v56z" fill="#cfc8c2"/><path d="M60 52v26M48 62h24" stroke="#9a908a" stroke-width="6" stroke-linecap="round"/><g fill="#ff9fb4"><circle cx="22" cy="100" r="7"/><circle cx="98" cy="100" r="7"/></g><path d="M0 104h120" stroke="#8fd08a" stroke-width="8"/></svg>';$('vetFace').style.filter='';
 $('vetTxt').innerHTML=`<p>${esc(p.name)} 安葬在花園裡了（付了 ${paid} 金幣）。</p><p>牠會一直記得你給的愛。以後晚上一定要記得讓寵物好好睡覺喔。</p><p class="small">現實中，寵物生病或不舒服時請盡快帶去看獸醫。</p>`;
 $('vetBtns').innerHTML='<button class="save" id="vetOk">我知道了</button>';
 $('vetOk').onclick=()=>{$('ovVet').classList.remove('on');vetFor=null;busy=false;save();if(!S.pets.length)openAdopt('first');else{render();typeof renderDiary==='function'&&renderDiary()}};save()}

// ---------- 每分鐘檢查 ----------
let wxNotice='',lastRemind=S.lastRemind||'';
function lifeTick(){if(!S.pets.length)return;const now=Date.now();
 for(const p of S.pets){if(!p.awakeSince)p.awakeSince=now;
  if(p.asleep){const w=wakeAtOf(p);if(now>=w){doWake(p,w);if(!document.hidden)say(`${p.name}睡飽飽醒來了！「早安～」`)}continue}
  const n2=lastAt(2,now);if(p.awakeSince<n2-HOUR&&!p.tired&&!p.sick)p.tired=true; // 凌晨兩點還沒睡
  if(awakeH(p)>=20&&!p.sick){p.sick=true}
  // 熬夜的寵物：到了傍晚還沒補眠 → 病懨懨
  if(p.tired&&!p.sick&&twHour()>=18&&now-n2>12*HOUR)p.sick=true}
 // 冷氣暖氣電費：每小時 3 金幣
 const m=(S.climate||{}).mode;if(m!=='off'){const hrs=(now-(S.climate.last||now))/HOUR;if(hrs>=1/3){const fee=Math.round(hrs*3);if(fee>0){S.coins=Math.max(0,S.coins-fee);S.climate.last=now}}}else S.climate.last=now;
 if(m!=='off'&&!ownAny(m==='cool'?'cool':'heat'))(S.climate||{}).mode='off';
 // 冷熱影響（只在開著遊戲時）
 const dm=Math.min(5,(now-(S.wxTick||now))/60000);S.wxTick=now;
 for(const p of S.pets){const f=feels(p);if(f<16){p.joy=clamp(p.joy-dm*.5)}else if(f>30){p.joy=clamp(p.joy-dm*.3);if(p.water!=null)p.water=clamp(p.water-dm*.6)}}
 const dy=S.pets.find(p=>petStatus(p)==='dying');if(dy&&!document.querySelector('.ov.on'))faint(dy);
 remind();wxApply();save()}
// ---------- 提醒：現在該做什麼 ----------
function plan(){const h=twHour(),awake=S.pets.filter(p=>!p.asleep),names=a=>a.map(p=>p.name).slice(0,2).join('、')+(a.length>2?'…':'');
 const sickP=S.pets.filter(p=>['sick','tired'].includes(petStatus(p))&&!p.asleep),worst=S.pets.filter(p=>!p.asleep&&awakeH(p)>=18);
 if(worst.length)return {lv:'danger',t:`${names(worst)} 已經 ${Math.floor(awakeH(worst[0]))} 小時沒睡！`,s:'超過 24 小時會昏倒，快讓牠睡覺'};
 if(h>=21||h<5){if(awake.length)return {lv:'warn',t:'晚上了，該哄寵物睡覺',s:`${names(awake)} 還醒著，熬夜隔天會有黑眼圈`};return {t:'夜深了，大家都睡了',s:'明天早上 7 點會醒來'}}
 if(sickP.length&&h>=8&&h<19)return {lv:'warn',t:`${names(sickP)} ${sickP.some(p=>petStatus(p)==='sick')?'病懨懨':'有黑眼圈'}`,s:'白天讓牠補眠滿 4 小時才會恢復'};
 if(h<10)return {t:'早安！',s:'準備早餐和清水，開始新的一天'};
 if(h<14)return {t:'午餐時間',s:'餵飯、陪牠玩一下'};
 if(h<18)return {t:'午後時光',s:'洗澎澎、梳梳毛、玩小遊戲'};
 return {t:'傍晚了',s:'吃晚餐、洗澡，準備睡覺囉'}}
function remind(){const h=twHour(),key=today()+':'+(h>=21||h<5?'night':h<10?'am':h<14?'noon':h<18?'pm':'eve');const pl=plan();
 if(key!==lastRemind&&!document.hidden&&P()){lastRemind=S.lastRemind=key;if(pl.lv)toast(`${pl.t}：${pl.s}`);else if(Date.now()-lastSay>8000)say(`${pl.t}${pl.s}～`)}}
// ---------- 畫面：天氣小卡、窗外的雨、寵物狀態 ----------
document.querySelector('.band.top .head').insertAdjacentHTML('afterend','<div class="wxbar" id="wxBar"><button type="button" class="wxchip" id="wxChip" aria-label="天氣與提醒"></button><div class="wxac"><button type="button" id="acCool" aria-pressed="false">開冷氣</button><button type="button" id="acHeat" aria-pressed="false">開暖氣</button></div></div>');
$('wxChip').onclick=e=>{e.stopPropagation();openClimate()};
function setAC(m){const cur=(S.climate||{}).mode;S.climate=S.climate||{};S.climate.mode=cur===m?'off':m;S.climate.last=Date.now();sfx('click');save();wxApply();
 toast(S.climate.mode==='off'?'空調關掉了':`${m==='cool'?'冷氣':'暖氣'}打開了（每小時 3 金幣電費），室內 ${indoorT()}°`)}
$('acCool').onclick=()=>setAC('cool');$('acHeat').onclick=()=>setAC('heat');
function wxApply(force){const w=wx(),k=wxKind(w.code),h=twHour(),night=h>=19||h<5,ic=k==='sun'&&night?'moon':k,inT=indoorT(),pl=plan();
 const tm=new Intl.DateTimeFormat('zh-TW',{timeZone:TZ,hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());
 $('wxChip').innerHTML=`${WXI[ic]}<div><b>${tm}・${WXN[k]} ${w.t}°・室內 ${inT}°</b><span>${esc(pl.t)}</span></div>`;
 $('wxChip').className='wxchip'+(pl.lv?' '+pl.lv:'');{const m=(S.climate||{}).mode;$('acCool').setAttribute('aria-pressed',m==='cool');$('acHeat').setAttribute('aria-pressed',m==='heat');$('acCool').textContent=m==='cool'?'關冷氣':'開冷氣';$('acHeat').textContent=m==='heat'?'關暖氣':'開暖氣'}const st=$('stage');st.dataset.wx=k;st.classList.toggle('indoorCold',inT<16);st.classList.toggle('indoorHot',inT>30);
 const sc=$('scene');if(sc&&!st.dataset.room){sc.querySelector('.wxrain')?.remove();sc.querySelector('.wxfrost')?.remove();
  if(k==='rain'||k==='storm')sc.insertAdjacentHTML('beforeend',`<g class="wxrain"><clipPath id="wxclip"><rect x="276" y="50" width="96" height="84" rx="12"/></clipPath><g clip-path="url(#wxclip)"><rect x="276" y="50" width="96" height="84" fill="#5a6a8a" opacity=".35"/>${Array.from({length:16},(_,i)=>`<line x1="${282+i*6}" y1="${50+(i*23)%60}" x2="${279+i*6}" y2="${62+(i*23)%60}" style="animation-delay:${(i*.13%0.7).toFixed(2)}s"/>`).join('')}</g></g>`);
  else if(w.t<14)sc.insertAdjacentHTML('beforeend',`<path class="wxfrost" d="M276 112q10 4 14 22h-14zM372 108q-12 6-16 26h16z"/>`)}
 dress()}
const _rr2=renderRoom;renderRoom=function(f){_rr2(f);wxApply()};
function dress(){for(const p of S.pets){const w=wOf(p);if(!w)continue;const sv=w.querySelector('.pet');if(!sv)continue;const st=petStatus(p),f=feels(p);
  const key=JSON.stringify([wearOf(p),st,p.asleep,sv.dataset.e,sv.dataset.sp]);
  if(sv.dataset.dk!==key||!sv.querySelector('.wearF')){sv.querySelectorAll('.wearF,.wearB').forEach(g=>g.remove());const E=EYES[p.sp]||{a:80,b:120,y:80,r:6};let fr='',bk='';
   for(const [sl,id] of Object.entries(wearOf(p))){if(!CLOTHES[id])continue;if(sl==='sleep'){if(p.asleep)fr+=wearSvg(id,E);continue}bk+=wearSvg(id,E,1);fr+=wearSvg(id,E)}
   if((st==='tired'||st==='sick')&&!p.asleep)fr+=DARK(E);
   sv.insertAdjacentHTML('afterbegin',`<g class="wearB">${bk}</g>`);sv.insertAdjacentHTML('beforeend',`<g class="wearF">${fr}</g>`);sv.dataset.dk=key}
  w.classList.toggle('asleep',!!p.asleep);w.classList.toggle('sick',st==='sick');w.classList.toggle('shiver',!p.asleep&&f<16);
  let z=w.querySelector('.zz');if(p.asleep&&!z){z=document.createElement('span');z.className='zz';z.textContent='Z z';w.append(z)}else if(!p.asleep&&z)z.remove();
  const tg=w.querySelector('.ptag');if(tg&&!(p.wetUntil&&p.wetUntil>Date.now())){tg.textContent=p.name+(p.asleep?'・睡覺中':st==='sick'?'・病懨懨':st==='tired'?'・黑眼圈':f<16?'・好冷':f>30?'・好熱':'')}}}
const _sync2=syncPets;syncPets=function(){_sync2();for(const p of S.pets)if(p.asleep&&!BEH[p.id])BEH[p.id]={act:'nap',until:Date.now()+864e5};dress()};
// 冷熱時偶爾說話
setInterval(()=>{const p=P();if(!p||p.asleep||busy||document.hidden||document.querySelector('.ov.on')||Date.now()-lastSay<20000||Math.random()>.35)return;const f=feels(p),k=wxKind(wx().code),st=petStatus(p);
 if(st==='sick')return say(`${p.name}：「頭暈暈的……好想睡覺……」`);if(st==='tired')return say(`${p.name}：「哈～欠……昨天沒睡好，不要煩我啦！」`);
 if(f<16)return say(`${p.name}：「好冷喔……${ownAny('heat')?'可以開暖氣嗎？':'想要一條圍巾或是暖氣……'}」`);
 if(f>30)return say(`${p.name}：「好熱好熱～${ownAny('cool')?'開冷氣啦！':'可以買台冷氣嗎？'}」`);
 if(k==='rain'||k==='storm')return say(`${p.name}：「外面在下雨耶，滴滴答答的……今天在家陪我玩好不好？」`)},15000);
// ---------- 冷暖氣面板 ----------
function openClimate(){const w=wx(),k=wxKind(w.code),inT=indoorT(),m=(S.climate||{}).mode,hc=ownAny('cool'),hh=ownAny('heat');
 const pets=S.pets.map(p=>{const f=feels(p);return `<li>${esc(p.name)}：體感 ${f}°${f<16?'，好冷！':f>30?'，好熱！':'，剛剛好'}${warmth(p)?`（衣服保暖 ${warmth(p)>0?'+':''}${warmth(p)}°）`:''}</li>`}).join('');
 $('climBody').innerHTML=`<div class="clim"><div>${WXI[k]}<small>台北・${WXN[k]}${w.sim?'（估計）':''}</small><b>${w.t}°</b></div><div><small>室內溫度</small><b>${inT}°</b><small>${m==='cool'?'冷氣運轉中':m==='heat'?'暖氣運轉中':'沒開空調'}</small></div></div>
  <div class="climb"><button type="button" data-m="off" aria-pressed="${m==='off'}">關掉</button><button type="button" data-m="cool" aria-pressed="${m==='cool'}" ${hc?'':'disabled'}>冷氣 26°</button><button type="button" data-m="heat" aria-pressed="${m==='heat'}" ${hh?'':'disabled'}>暖氣 23°</button></div>
  <p class="small">每個家都有冷氣和暖氣，打開後每小時付 3 金幣電費。也可以直接按頁面最上面的「開冷氣／開暖氣」。</p>
  <ul class="small" style="margin:6px 0 0;padding-left:18px">${pets}</ul><p class="small">太冷可以幫牠戴毛線帽、圍巾、披斗篷；太熱就把衣服脫掉、開冷氣。</p>
  <button type="button" class="ghost" id="climWear" style="width:100%;margin-top:6px">打開衣櫃</button>`;
 $('climBody').querySelector('.climb').onclick=e=>{const b=e.target.closest('[data-m]');if(!b||b.disabled)return;(S.climate||{}).mode=b.dataset.m;S.climate.last=Date.now();sfx('click');save();wxApply();openClimate()};
 $('climWear').onclick=()=>{$('ovClimate').classList.remove('on');openWear()};$('ovClimate').classList.add('on')}
// ---------- 衣櫃 ----------
let wearPid=null;
function openWear(pid){const p=S.pets.find(q=>q.id===(pid||wearPid))||P();if(!p)return;wearPid=p.id;S.owned.clothes=S.owned.clothes||[];p.wear=p.wear||{};
 const E=EYES[p.sp]||{a:80,b:120,y:80,r:6};const cl={...p.wear};delete cl.sleep;
 const prev=`<svg class="wprev" viewBox="0 0 200 190"><g>${Object.entries(cl).map(([s,id])=>wearSvg(id,E,1)).join('')}</g>${petSvg(p.sp,'happy')}${Object.entries(cl).map(([s,id])=>wearSvg(id,E)).join('')}</svg>`;
 $('wearT').textContent=`${p.name} 的衣櫃`;
 $('wearBody').innerHTML=`${S.pets.length>1?`<div class="dtabs" style="padding:0 0 8px">${S.pets.map(q=>`<button type="button" data-pp="${q.id}" aria-pressed="${q===p}">${esc(q.name)}</button>`).join('')}</div>`:''}${prev}
  <p class="small" style="text-align:center">${COIN(14)} ${S.coins}・保暖 ${warmth(p)>=0?'+':''}${warmth(p)}°・體感 ${feels(p)}°</p>
  <div class="wgrid">${Object.entries(CLOTHES).map(([id,c])=>{const own=S.owned.clothes.includes(id),on=p.wear[c.slot]===id;return `<button type="button" class="wcard ${on?'on':''}" data-w="${id}">${wearIcon(id)}${c.n}<em>${SLOTN[c.slot]}・${c.warm>0?'保暖+'+c.warm:c.warm<0?'涼快':'裝飾'}</em><em>${own?(on?'穿著中・點脫下':'穿上'):`${COIN(12)} ${c.p}`}</em></button>`}).join('')}</div>`;
 $('wearBody').onclick=e=>{const pp=e.target.closest('[data-pp]');if(pp)return openWear(pp.dataset.pp);const b=e.target.closest('[data-w]');if(!b)return;const id=b.dataset.w,c=CLOTHES[id];
  if(!S.owned.clothes.includes(id)){if(S.coins<c.p){toast('金幣不夠喔！');sfx('squeak');return}S.coins-=c.p;S.owned.clothes.push(id);sfx('gift');toast(`買了「${c.n}」`)}
  if(p.wear[c.slot]===id)delete p.wear[c.slot];else{p.wear[c.slot]=id;gain(1,p);say(`${p.name}：「${pick(['好看嗎？好看嗎？','我覺得自己變時髦了！','謝謝你送我新衣服～'])}」`)}
  sfx('click');save();dress();openWear(p.id)};
 $('ovWear').classList.add('on')}
// 寵物資料卡：加上睡覺狀態、叫醒／哄睡、衣櫃
if(typeof openPetCard==='function'){const _opc=openPetCard;openPetCard=function(pid){_opc(pid);const p=S.pets.find(q=>q.id===pid)||P();if(!p)return;const st=petStatus(p),row=$('pcBody').querySelector('.row');if(!row)return;
  const h=awakeH(p),info={sleep:`睡覺中（已睡 ${((Date.now()-p.sleepStart)/HOUR).toFixed(1)} 小時）`,ok:`精神很好（醒著 ${h.toFixed(1)} 小時）`,tired:'黑眼圈・脾氣差：白天讓牠睡滿 4 小時',sick:'病懨懨：要睡滿 4 小時才會好',dying:'快撐不住了！'}[st];
  row.insertAdjacentHTML('beforebegin',`<p class="small" style="margin:6px 0">${info}・體感 ${feels(p)}°</p>`);
  row.insertAdjacentHTML('afterbegin',`<button class="ghost" id="pcSleep">${p.asleep?'叫醒牠':'哄牠睡覺'}</button><button class="ghost" id="pcWear">衣櫃</button>`);
  $('pcSleep').onclick=()=>{$('ovPetCard').classList.remove('on');p.asleep?wakePet(p):sleepPet(p)};$('pcWear').onclick=()=>{$('ovPetCard').classList.remove('on');openWear(p.id)}}}
// 選單加上衣櫃、冷暖氣
MENU_EXTRA.splice(1,0,['wear','衣櫃','<svg viewBox="0 0 40 40"><path d="M14 6l-10 6 4 7 4-2v17h16V17l4 2 4-7-10-6q-6 5-12 0z" fill="#ff9fb4"/></svg>',()=>openWear()],
 ['climate','天氣冷暖氣','<svg viewBox="0 0 40 40"><rect x="15" y="4" width="10" height="24" rx="5" fill="#fff" stroke="#e8507a" stroke-width="2.5"/><circle cx="20" cy="30" r="7" fill="#e8507a"/><path d="M20 14v14" stroke="#e8507a" stroke-width="4"/></svg>',()=>openClimate()]);
document.addEventListener('visibilitychange',()=>{if(!document.hidden){lifeTick();fetchWx()}});
setInterval(lifeTick,60000);setInterval(()=>{if(!document.hidden)fetchWx()},30*60000);
lifeTick();fetchWx();syncPets();
// 雲端存檔載入時補上新欄位
const _norm2=normalize;normalize=function(s){s=_norm2(s);if(!s.roomDecor)s.roomDecor={};['dining','bath','play'].forEach(k=>{if(!s.roomDecor[k])s.roomDecor[k]={items:[]}});
 if(!s.climate)s.climate={mode:'off',last:Date.now()};if(!s.owned.clothes)s.owned.clothes=[];(s.pets||[]).forEach(p=>{if(!p.awakeSince)p.awakeSince=Date.now()});
 return s};
// 新註冊：新存檔本來就有 20000 金幣（app.js），這裡不再重複發放
