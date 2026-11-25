// ===== 換房間：餵食到餐廳、洗澡到浴室 =====
document.head.insertAdjacentHTML('beforeend',`<style>
#frontL{position:absolute;inset:0;width:100%;height:100%;z-index:4;pointer-events:none}
.roomfade{position:absolute;inset:0;z-index:9;background:linear-gradient(var(--room),var(--wall));pointer-events:none;animation:roomfade .8s ease-in-out forwards}
@keyframes roomfade{0%{opacity:0}40%,60%{opacity:1}100%{opacity:0}}
.roomtag{position:absolute;left:14px;top:12px;z-index:7;background:var(--card);border-radius:99px;padding:4px 14px 4px 8px;font:16px "Huninn",sans-serif;display:flex;align-items:center;gap:6px;box-shadow:0 4px 10px -6px #0005;animation:popin .35s cubic-bezier(.3,1.6,.6,1)}
.roomtag svg{width:24px;height:24px}
.stage[data-room] #furnL,.stage[data-room] #messL{display:none}
.stage[data-room] .pw.away{display:none}
#frontL .bub{animation:bubfloat 2.4s ease-in-out infinite alternate}
@keyframes bubfloat{to{transform:translateY(-6px)}}
#frontL .duck{animation:duck 1.6s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}
@keyframes duck{to{transform:rotate(8deg)}}
.scene .steam{animation:steam 3s ease-in-out infinite;opacity:.0}
@keyframes steam{0%{opacity:0;transform:translateY(10px)}50%{opacity:.6}100%{opacity:0;transform:translateY(-30px)}}
</style>`);
$('stage').insertAdjacentHTML('beforeend','<svg id="frontL" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true"></svg>');
const SKY=`<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sky1)"/><stop offset="1" style="stop-color:var(--sky2)"/></linearGradient>`;
const DIM='<rect class="dim" width="400" height="300" fill="#1d1b4a"/>';
const WIN=(x,y)=>`<g class="win"><rect x="${x}" y="${y}" width="80" height="66" rx="10" fill="url(#sky)"/><g class="sun"><circle cx="${x+56}" cy="${y+20}" r="9" fill="#fff3b0"/></g><g class="moon"><circle cx="${x+54}" cy="${y+20}" r="8" fill="#fff3c4"/><circle cx="${x+58}" cy="${y+17}" r="7" style="fill:var(--sky1)"/></g><path d="M${x+40} ${y}v66M${x} ${y+33}h80" stroke="#fff" stroke-width="4"/><rect x="${x}" y="${y}" width="80" height="66" rx="10" fill="none" stroke="#fff" stroke-width="5"/></g>`;
const ROOMS={
 dining:{n:'餐廳',ic:'<svg viewBox="0 0 40 40"><path d="M12 4v14a4 4 0 0 0 8 0V4M16 4v32M28 4c-5 4-5 14 0 16v16" stroke="#e8507a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
  scene:()=>`<defs>${SKY}<pattern id="dwp" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#fff3da"/><rect width="12" height="12" fill="#ffecc8"/><rect x="12" y="12" width="12" height="12" fill="#ffecc8"/></pattern><radialGradient id="pglow"><stop offset="0" stop-color="#ffe7a0" stop-opacity=".85"/><stop offset="1" stop-color="#ffe7a0" stop-opacity="0"/></radialGradient></defs>
  <rect width="400" height="300" fill="url(#dwp)"/>
  <rect y="190" width="400" height="32" fill="#e8c49a"/><rect y="188" width="400" height="4" fill="#c98a4b"/>
  ${WIN(160,54)}
  <g><rect x="8" y="132" width="132" height="90" rx="6" fill="#f0b27a"/><rect x="4" y="126" width="140" height="10" rx="3" fill="#c98a4b"/><rect x="16" y="146" width="54" height="66" rx="4" fill="#f7c897"/><rect x="78" y="146" width="54" height="66" rx="4" fill="#f7c897"/><circle cx="64" cy="180" r="3" fill="#a8643a"/><circle cx="84" cy="180" r="3" fill="#a8643a"/>
   <rect x="20" y="108" width="22" height="18" rx="4" fill="#ff9fb4"/><rect x="22" y="104" width="18" height="5" rx="2" fill="#e88aa0"/><path d="M58 126c0-14 26-14 26 0z" fill="#9fc8f0"/><rect x="96" y="112" width="12" height="14" rx="3" fill="#ffc94a"/><rect x="112" y="108" width="14" height="18" rx="3" fill="#5fc9ae"/></g>
  <g><rect x="14" y="52" width="110" height="7" rx="3" fill="#c98a4b"/><circle cx="34" cy="44" r="9" fill="#fff" stroke="#e0d0c0" stroke-width="2"/><circle cx="58" cy="44" r="9" fill="#fff" stroke="#e0d0c0" stroke-width="2"/><rect x="78" y="34" width="14" height="18" rx="3" fill="#f7a3b5"/><rect x="98" y="38" width="16" height="14" rx="3" fill="#9fd3c4"/></g>
  <g><rect x="306" y="96" width="78" height="126" rx="12" fill="#e3f3fb" stroke="#bcdcec" stroke-width="3"/><path d="M306 150h78" stroke="#bcdcec" stroke-width="3"/><rect x="314" y="112" width="5" height="26" rx="2" fill="#9ab8cf"/><rect x="314" y="160" width="5" height="34" rx="2" fill="#9ab8cf"/><path d="M350 124c-3-2-5-4-5-6a2.5 2.5 0 0 1 5-1 2.5 2.5 0 0 1 5 1c0 2-2 4-5 6z" fill="#ff7c9c"/><circle cx="364" cy="176" r="5" fill="#ffc94a"/></g>
  <path d="M200 0v34" stroke="#8a6f68" stroke-width="2"/><circle class="glow" cx="200" cy="56" r="60" fill="url(#pglow)" style="opacity:1"/><path d="M180 52c0-16 40-16 40 0z" fill="#ff9fb4"/><rect x="178" y="50" width="44" height="5" rx="2" fill="#e88aa0"/>
  <rect x="0" y="222" width="400" height="78" fill="#f4dcc0"/>${Array.from({length:16},(_,i)=>`<rect x="${(i%8)*50+(Math.floor(i/8)%2)*25}" y="${222+Math.floor(i/8)*39}" width="25" height="39" fill="#ecceac"/>`).join('')}
  <rect x="120" y="252" width="160" height="30" rx="14" fill="#ffd0dc"/><path d="M132 267h136" stroke="#fff" stroke-width="3" stroke-dasharray="6 6"/>
  ${DIM}`,front:()=>''},
 play:{n:'遊戲室',ic:'<svg viewBox="0 0 40 40"><rect x="4" y="12" width="32" height="18" rx="9" fill="#b58cff"/><path d="M12 17v8M8 21h8" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="27" cy="19" r="2.5" fill="#fff"/><circle cx="31" cy="24" r="2.5" fill="#fff"/></svg>',
  scene:()=>`<defs>${SKY}<pattern id="pwp" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#eef3ff"/><path d="M10 8l1.6 3.4 3.6.4-2.7 2.4.8 3.6L10 16l-3.3 1.8.8-3.6-2.7-2.4 3.6-.4z" fill="#ffe08a"/><circle cx="30" cy="28" r="2.2" fill="#ffb3c6"/></pattern></defs>
  <rect width="400" height="300" fill="url(#pwp)"/>
  <path d="M0 14q25 16 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0" fill="none" stroke="#8a6f68" stroke-width="1.2" opacity=".5"/>
  <g>${Array.from({length:16},(_,i)=>`<path d="M${i*25+2} ${10+(i%2)*4}l10 16 10-16z" fill="${['#ff9fb4','#ffd23f','#7ac8f0','#9fd3c4'][i%4]}" opacity=".9"/>`).join('')}</g>
  ${WIN(158,46)}
  <g><rect x="14" y="96" width="88" height="126" rx="6" fill="#f7c897"/><rect x="14" y="134" width="88" height="5" fill="#d9a06a"/><rect x="14" y="176" width="88" height="5" fill="#d9a06a"/>
   <circle cx="34" cy="122" r="11" fill="#ff7c9c"/><rect x="54" y="110" width="18" height="22" rx="3" fill="#7aa8ff"/><path d="M84 132l-8-20h16z" fill="#ffd23f"/>
   <rect x="24" y="152" width="22" height="22" rx="4" fill="#5fc9ae"/><rect x="50" y="156" width="18" height="18" rx="4" fill="#ff9fb4"/><circle cx="84" cy="164" r="9" fill="#b58cff"/>
   <rect x="22" y="194" width="30" height="26" rx="5" fill="#ffc94a"/><circle cx="76" cy="206" r="12" fill="#7ac8f0"/></g>
  <g><path d="M290 222V120h16v102" fill="none" stroke="#7aa8ff" stroke-width="6"/><path d="M306 128h22v94" fill="none" stroke="#7aa8ff" stroke-width="6"/><path d="M296 136h24M296 156h24M296 176h24M296 196h24" stroke="#7aa8ff" stroke-width="4"/>
   <path d="M328 128q40 30 56 94h-16q-14-56-40-80z" fill="#ff9fb4"/></g>
  <rect x="0" y="222" width="400" height="78" fill="#fff4e0"/>${Array.from({length:12},(_,i)=>`<rect x="${(i%6)*67}" y="${222+Math.floor(i/6)*39}" width="67" height="39" fill="${['#ffd6e0','#d6ecff','#fff0b8','#d9f3e8','#e6dcff','#ffe1c8'][(i+Math.floor(i/6))%6]}" stroke="#fff" stroke-width="2"/>`).join('')}
  <g><ellipse cx="342" cy="272" rx="52" ry="16" fill="#e6dcff"/>${[[312,266,'#ff7c9c'],[326,262,'#ffd23f'],[340,268,'#7ac8f0'],[354,262,'#5fc9ae'],[368,268,'#ff9fb4'],[332,274,'#b58cff'],[350,276,'#ffd23f']].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="7" fill="${c}"/>`).join('')}</g>
  ${DIM}`,front:()=>''},
 bath:{n:'浴室',ic:'<svg viewBox="0 0 40 40"><path d="M4 20h32v5a9 9 0 0 1-9 9H13a9 9 0 0 1-9-9z" fill="#7ac8f0"/><path d="M10 20V9a4 4 0 0 1 8 0" stroke="#9ab8cf" stroke-width="3" fill="none"/><circle cx="26" cy="13" r="4" fill="#eaf6ff" stroke="#7ac8f0" stroke-width="2"/></svg>',
  scene:()=>`<defs>${SKY}<pattern id="btile" width="26" height="26" patternUnits="userSpaceOnUse"><rect width="26" height="26" fill="#e3f4fb"/><path d="M0 0h26v26" fill="none" stroke="#cbe7f3" stroke-width="2"/></pattern><pattern id="bfloor" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#f5fbff"/><rect width="20" height="20" fill="#d6ecf7"/><rect x="20" y="20" width="20" height="20" fill="#d6ecf7"/></pattern></defs>
  <rect width="400" height="300" fill="url(#btile)"/><rect y="150" width="400" height="72" fill="#ffffff" opacity=".55"/><rect y="148" width="400" height="4" fill="#9fd3e8"/>
  ${WIN(24,40)}
  <g><ellipse cx="330" cy="78" rx="30" ry="38" fill="#e8f6ff" stroke="#c9a070" stroke-width="5"/><path d="M314 64q8-12 20-12" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none"/></g>
  <g><rect x="300" y="132" width="70" height="5" rx="2" fill="#c9a070"/><rect x="312" y="136" width="22" height="44" rx="4" fill="#ffb3c6"/><rect x="338" y="136" width="20" height="36" rx="4" fill="#9fd3c4"/><path d="M312 170h22M338 164h20" stroke="#fff" stroke-width="2" stroke-dasharray="3 3"/></g>
  <g><path d="M262 40v40q0 10-10 10h-14" stroke="#9ab8cf" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M226 84h26l-4 10h-18z" fill="#bcd8ea"/><g fill="#7ac8f0">${[0,1,2,3,4].map(i=>`<circle cx="${230+i*5}" cy="${100+(i%2)*6}" r="1.6"/>`).join('')}</g></g>
  <g class="steam" fill="#fff"><ellipse cx="170" cy="170" rx="18" ry="8"/><ellipse cx="230" cy="160" rx="22" ry="9"/></g>
  <rect x="0" y="222" width="400" height="78" fill="url(#bfloor)"/>
  <path d="M110 206q0-10 10-10h160q10 0 10 10" fill="#fdfdfd" stroke="#d7e9f3" stroke-width="3"/><ellipse cx="200" cy="208" rx="86" ry="9" fill="#bfe6ff"/>
  <rect x="56" y="262" width="60" height="26" rx="12" fill="#ffd0dc"/><path d="M62 275h48" stroke="#fff" stroke-width="3" stroke-dasharray="4 5"/>
  <g transform="translate(338 214)"><rect x="4" y="26" width="26" height="22" rx="5" fill="#e98a5a"/><path d="M17 26c-10-6-12-20-4-24 2 10 6 14 4 24zm0 0c10-8 14-16 10-24-6 8-8 14-10 24z" fill="#5fb08a"/></g>
  ${DIM}`,
  front:()=>`<path d="M104 208h192q6 0 5 8l-8 44q-4 18-24 18H131q-20 0-24-18l-8-44q-1-8 5-8z" fill="#ffffff" stroke="#d7e9f3" stroke-width="3"/><path d="M114 226h172" stroke="#e6f3fa" stroke-width="4"/>
  <rect x="128" y="276" width="10" height="12" rx="3" fill="#ffc94a"/><rect x="262" y="276" width="10" height="12" rx="3" fill="#ffc94a"/>
  <g class="bub" fill="#ffffff" stroke="#d7eef9" stroke-width="1.5">${[[112,208,10],[132,205,11],[156,207,9],[184,204,10],[212,207,9],[240,204,11],[266,207,9],[288,208,9],[146,200,6],[226,199,7],[198,198,5]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>
  <g transform="translate(262 176)"><g class="duck"><ellipse cx="14" cy="20" rx="14" ry="9" fill="#ffd23f"/><circle cx="20" cy="9" r="8" fill="#ffd23f"/><path d="M27 9l7 2-7 3z" fill="#f59e2a"/><circle cx="22" cy="7" r="1.6" fill="#2e2320"/></g></g>`}};
let inRoom=null,roomT=null,viewRoom=null;
function goRoom(kind,pets){const R=ROOMS[kind],st=$('stage');clearTimeout(roomT);inRoom=kind;
 add('roomfade','',820);sfx('swoosh');
 setTimeout(()=>{st.dataset.room=kind;$('scene').innerHTML=R.scene();$('frontL').innerHTML=R.front();
  const ids=new Set(pets.map(p=>p.id));S.pets.forEach(p=>wOf(p)?.classList.toggle('away',!ids.has(p.id)));
  const n=pets.length;pets.forEach((p,i)=>{POS[p.id]=kind==='bath'?{x:n===1?50:32+i*(36/Math.max(1,n-1)),y:27}:{x:n===1?50:22+i*(56/Math.max(1,n-1)),y:8};const w=wOf(p);if(w){w.classList.add('come');place(w,POS[p.id]);setTimeout(()=>w.classList.remove('come'),650)}});
  st.querySelector('.roomtag')?.remove();st.insertAdjacentHTML('beforeend',`<div class="roomtag">${R.ic}${R.n}</div>`);posBubble()},400)}
function goHome(delay){clearTimeout(roomT);roomT=setTimeout(()=>{if(!inRoom||viewRoom)return;add('roomfade','',820);
 setTimeout(()=>{inRoom=null;const st=$('stage');delete st.dataset.room;$('frontL').innerHTML='';st.querySelector('.roomtag')?.remove();
  S.pets.forEach(p=>wOf(p)?.classList.remove('away'));renderRoom(true);renderMess();render()},400)},delay)}
// 換房間期間：寵物不亂走、不弄亂家裡（在 world.js 的計時器裡檢查 inRoom）
const _feed=feed;feed=function(){const p=P();if(busy||!p)return;if(viewRoom==='dining')return _feed();
 if(p.full>=95||(S.food>0&&!S.inv[S.food-1]))return _feed();
 busy=true;goRoom('dining',[p]);setTimeout(()=>{busy=false;_feed();goHome(2500)},480)};
const _care=care;care=function(id){const p=P();if(id!=='bath'||busy||!p)return _care(id);if(viewRoom==='bath'){_care(id);setTimeout(()=>{POS[p.id]={x:50,y:27};const w=wOf(p);w&&place(w,POS[p.id]);posBubble()},60);return}
 if((daily().c.c_bath||0)>=2)return _care(id);
 busy=true;goRoom('bath',[p]);setTimeout(()=>{busy=false;_care(id);POS[p.id]={x:50,y:27};const w=wOf(p);w&&place(w,POS[p.id]);posBubble();goHome(2700)},480)};
const _feedAll=feedAll;feedAll=function(){if(busy||fight||S.pets.length<2)return;if(viewRoom==='dining'){goRoom('dining',S.pets);setTimeout(()=>_feedAll(),480);return}const eaters=S.pets.filter(p=>p.full<95);if(!eaters.length)return _feedAll();
 busy=true;goRoom('dining',S.pets);setTimeout(()=>{busy=false;_feedAll();goHome(2900)},480)};
const _bathAll=bathAll;bathAll=function(){if(busy||fight||S.pets.length<2)return;if(viewRoom==='bath'){goRoom('bath',S.pets);setTimeout(()=>_bathAll(),480);return}if((daily().c.c_bath||0)>=2)return _bathAll();
 busy=true;goRoom('bath',S.pets);setTimeout(()=>{busy=false;_bathAll();goHome(3000)},480)};
$('btnFeed').onclick=feed;$('btnFeedAll').onclick=feedAll;$('btnBathAll').onclick=bathAll;
