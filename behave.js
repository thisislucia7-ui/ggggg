// ===== 寵物自己會做的事：睡覺、伸懶腰、理毛、追尾巴、暴衝、看窗外、聞聞、找飯碗、互相蹭蹭 =====
document.head.insertAdjacentHTML('beforeend',`<style>
.emote{position:absolute;left:50%;top:-4%;translate:-50% 0;z-index:4;min-width:34px;height:34px;padding:0 6px;border-radius:17px;background:#fff;box-shadow:0 4px 10px -4px #0004;display:flex;align-items:center;justify-content:center;font:700 15px "Huninn",sans-serif;color:#7a6ab8;pointer-events:none;animation:emIn .35s cubic-bezier(.3,1.6,.6,1)}
.emote:after{content:"";position:absolute;left:50%;bottom:-6px;margin-left:-6px;border:6px solid transparent;border-bottom:0;border-top-color:#fff}
.emote svg{width:22px;height:22px}
.emote.out{animation:emOut .3s forwards}
@keyframes emIn{from{transform:scale(0) translateY(10px)}}@keyframes emOut{to{transform:scale(0);opacity:0}}
.pw .pet.nap{animation:napb 3.2s ease-in-out infinite!important}
@keyframes napb{50%{transform:scale(1.03,.95)}}
.pw .pet.stretch{animation:stretch 1.8s ease-in-out!important}
@keyframes stretch{35%,65%{transform:scale(1.2,.8) translateY(4%)}}
.pw .pet.spin2{animation:spin2 .42s linear 5!important;transform-origin:50% 60%!important}
@keyframes spin2{to{transform:rotate(360deg)}}
.pw .pet.groom{animation:groom .35s ease-in-out 6!important}
@keyframes groom{50%{transform:rotate(-6deg) translateY(2%)}}
.pw .pet.sniff{animation:sniff .3s ease-in-out 8!important}
@keyframes sniff{50%{transform:translateY(5%) rotate(3deg)}}
.pw.dash{transition:left .55s ease-in-out,bottom .55s ease-in-out!important}
.pw.flip .pet{scale:-1 1}
</style>`);
const BEH={};
const EM={zzz:'Z z',heart:'<svg viewBox="0 0 26 24"><path d="M13 23S1 15 1 7a6 6 0 0 1 12-2 6 6 0 0 1 12 2c0 8-12 16-12 16z" fill="#e8507a"/></svg>',
 drop:'<svg viewBox="0 0 40 40"><path d="M20 4C14 13 9 19 9 25a11 11 0 0 0 22 0c0-6-5-12-11-21z" fill="#5aa8e0"/></svg>',
 bowl:'<svg viewBox="0 0 40 40"><path d="M4 18h32a16 14 0 0 1-32 0z" fill="#f0a04b"/><g fill="#c97a2a"><circle cx="14" cy="16" r="4"/><circle cx="21" cy="14" r="4"/><circle cx="27" cy="17" r="3.5"/></g></svg>',
 note:'♪',q:'?',dots:'…',spark:'<svg viewBox="0 0 40 40"><path d="M20 4l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" fill="#ffc94a"/></svg>',bang:'!',yawn:'哈～'};
function emote(p,k,ms){const w=wOf(p);if(!w)return;w.querySelector('.emote')?.remove();const e=document.createElement('span');e.className='emote';e.innerHTML=EM[k]||k;w.append(e);
 setTimeout(()=>{e.classList.add('out');setTimeout(()=>e.remove(),300)},ms||2600)}
const petEl=p=>wOf(p)?.querySelector('.pet');
function behCls(p,cls,ms){const el=petEl(p);if(!el)return;el.classList.remove('nap','stretch','spin2','groom','sniff');void el.getBoundingClientRect();el.classList.add(cls);if(ms)setTimeout(()=>el.classList.remove(cls),ms)}
function moveTo(p,x,y,fast){const w=wOf(p);if(!w)return;POS[p.id]={x:Math.max(8,Math.min(92,x)),y:y??POS[p.id]?.y??8};w.classList.toggle('dash',!!fast);
 const old=parseFloat(w.style.left)||50;w.classList.toggle('flip',POS[p.id].x<old);place(w,POS[p.id]);if(p===P())posBubble();if(fast)setTimeout(()=>w.classList.remove('dash'),700)}
function startNap(p,ms){const el=petEl(p);if(!el)return;BEH[p.id]={act:'nap',until:Date.now()+ms};el.innerHTML=petSvg(p.sp,'happy');el.dataset.e='nap';behCls(p,'nap');emote(p,'zzz',ms);
 clearTimeout(BEH[p.id].t);BEH[p.id].t=setTimeout(()=>wake(p,true),ms)}
function wake(p,quiet){const b=BEH[p.id];if(!b||b.act!=='nap')return;clearTimeout(b.t);delete BEH[p.id];const el=petEl(p);if(el){el.classList.remove('nap');el.dataset.e=''}
 wOf(p)?.querySelector('.emote')?.remove();if(!quiet){emote(p,'q',1600);say(`${p.name}：「嗯……？${pick(['你回來啦～','我剛剛夢到你耶','再睡五分鐘嘛……'])}」`)}else{behCls(p,'stretch',1800);emote(p,'yawn',1600)}render()}
// 點到正在睡覺的寵物會把牠叫醒
$('stage').addEventListener('pointerdown',e=>{const w=e.target.closest('.pw');if(!w)return;const p=S.pets.find(q=>q.id===w.dataset.pid);if(p&&BEH[p.id]?.act==='nap')wake(p)},true);
// render 時保留睡覺的樣子
const _syncB=syncPets;syncPets=function(){_syncB();for(const p of S.pets){const b=BEH[p.id];if(b&&b.act==='nap'){const el=petEl(p);if(el&&el.dataset.e!=='nap'){el.innerHTML=petSvg(p.sp,'happy');el.dataset.e='nap';el.classList.add('nap')}}}};
function choose(p){const Q=p.pers,night=tod()==='night',n=S.pets.length,w=[];
 const add=(k,v)=>{if(v>0)w.push([k,v])};
 add('nap',(night?6:1)+(Q==='lazy'?4:0)+(p.joy>80?1:0));
 add('hungry',p.full<35?6:0);add('thirsty',(p.water??70)<30?6:0);
 add('stretch',2);add('groom',2+(Q==='neat'?4:0)+(Q==='aloof'?2:0));
 add('tail',p.joy>50?2+(Q==='playful'?3:0):0);add('zoom',p.joy>65?1+(Q==='playful'?4:0)+(Q==='grumpy'?1:0):0);
 add('window',2+(Q==='shy'?2:0)+(Q==='aloof'?2:0));add('sniff',2);
 add('social',n>1?(Q==='clingy'?5:Q==='aloof'?0:2):0);add('corner',Q==='aloof'?4:Q==='shy'?2:0);
 let r=Math.random()*w.reduce((a,x)=>a+x[1],0);for(const [k,v] of w){r-=v;if(r<=0)return k}return 'sniff'}
function doBeh(p){const k=choose(p),x=POS[p.id]?.x??50,now=Date.now();BEH[p.id]={act:k,until:now+6000};
 if(k==='nap'){moveTo(p,20+Math.random()*60,6);setTimeout(()=>startNap(p,25000+Math.random()*25000),2600);return}
 if(k==='hungry'){moveTo(p,10,5);setTimeout(()=>{emote(p,'bowl',3000);behCls(p,'sniff',2400)},2600);if(p===P()&&Date.now()-lastSay>12000)say(`${p.name}：「肚子餓了……飯碗在哪裡？」`);return}
 if(k==='thirsty'){moveTo(p,12,5);setTimeout(()=>emote(p,'drop',3000),2600);return}
 if(k==='stretch'){behCls(p,'stretch',1800);emote(p,'yawn',1800);return}
 if(k==='groom'){behCls(p,'groom',2200);emote(p,'spark',2200);return}
 if(k==='tail'){behCls(p,'spin2',2200);emote(p,'bang',1500);sfx('squeak');return}
 if(k==='zoom'){emote(p,'bang',1200);[12,88,20,80,50].forEach((tx,i)=>setTimeout(()=>moveTo(p,tx,4+Math.random()*10,true),i*600));BEH[p.id].until=now+3600;return}
 if(k==='window'){moveTo(p,72+Math.random()*10,14);setTimeout(()=>emote(p,Math.random()<.5?'note':'q',3200),2600);BEH[p.id].until=now+9000;return}
 if(k==='sniff'){moveTo(p,x+(Math.random()*30-15),POS[p.id]?.y);setTimeout(()=>{behCls(p,'sniff',2400);emote(p,'dots',2400)},2600);return}
 if(k==='corner'){moveTo(p,Math.random()<.5?8:90,4);setTimeout(()=>emote(p,'dots',3000),2600);BEH[p.id].until=now+12000;return}
 if(k==='social'){const o=pick(S.pets.filter(q=>q!==p&&!BEH[q.id]));if(!o)return;const ox=POS[o.id]?.x??50;moveTo(p,ox+(ox>50?-14:14),POS[o.id]?.y);
  BEH[o.id]={act:'social',until:now+6000};setTimeout(()=>{emote(p,'heart',2600);emote(o,'heart',2600);behCls(p,'groom',1800);behCls(o,'groom',1800);sfx('heart')},2700)}}
setInterval(()=>{if(!S.pets.length||editMode||playing||fight||(typeof inRoom!=='undefined'&&inRoom)||document.hidden)return;const now=Date.now();
 for(const p of S.pets){if(p===P()&&busy)continue;const b=BEH[p.id];if(b&&b.until>now)continue;if(b&&b.act==='nap')continue;if(Math.random()<.45)doBeh(p)}},4000);
// 動作開始時，叫醒被照顧的寵物；換房間時大家都醒來
const _sumB=summon;summon=function(){const p=P();if(p&&BEH[p.id]?.act==='nap')wake(p,true);if(p)delete BEH[p.id];_sumB()};
const _goRoomB=goRoom;goRoom=function(k,pets){(pets||[]).forEach(p=>{if(BEH[p.id]?.act==='nap')wake(p,true);delete BEH[p.id]});_goRoomB(k,pets)};
