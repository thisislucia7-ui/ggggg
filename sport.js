// ===== 體育館：和寵物一起的每日運動（散步、接飛盤、伸展操），連續運動天數 =====
const EXS={walk:{n:'散步',d:'跟著節奏左右交替點腳印',ic:'<svg viewBox="0 0 44 44"><g fill="#a8643a"><ellipse cx="14" cy="30" rx="5" ry="7"/><ellipse cx="28" cy="16" rx="5" ry="7"/></g><g fill="#a8643a"><circle cx="10" cy="20" r="2"/><circle cx="14" cy="19" r="2"/><circle cx="18" cy="20" r="2"/><circle cx="24" cy="6" r="2"/><circle cx="28" cy="5" r="2"/><circle cx="32" cy="6" r="2"/></g></svg>'},
 disc:{n:'接飛盤',d:'飛盤飛到圈圈裡時按「接！」',ic:'<svg viewBox="0 0 44 44"><ellipse cx="22" cy="22" rx="16" ry="7" fill="#ff7c9c"/><ellipse cx="22" cy="20" rx="10" ry="3.5" fill="#ffb3c4"/></svg>'},
 yoga:{n:'伸展操',d:'照著箭頭做出一樣的動作',ic:'<svg viewBox="0 0 44 44"><circle cx="22" cy="8" r="5" fill="#5fc9ae"/><path d="M22 14v14M8 18l14 4 14-4M22 28l-8 12M22 28l8 12" stroke="#5fc9ae" stroke-width="4" stroke-linecap="round" fill="none"/></svg>'}};
function exDay(){const t=today();if(!S.ex||S.ex.day!==t){const prev=S.ex||{};const y=new Date(new Date(t+'T12:00:00+08:00').getTime()-864e5).toISOString().slice(0,10);
  const doneY=prev.day===y&&Object.keys(prev.done||{}).length>=3;S.ex={day:t,done:{},streak:doneY?(prev.streak||0):(prev.day===t?prev.streak||0:0),bonus:false}}return S.ex}
document.head.insertAdjacentHTML('beforeend',`<style>
.exw{background:linear-gradient(135deg,#e9fbf3,#fff6e6);border-radius:18px;padding:10px 12px}
.exw h3{margin:0 0 6px;font-size:16px;display:flex;justify-content:space-between;align-items:center}
.exw .exb{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.exw .exb button{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:14px;min-height:0;padding:8px 4px;border-radius:14px}
.exw .exb svg{width:36px;height:36px}.exw small{font-size:11px;opacity:.85}
.exstage{position:relative;height:200px;border-radius:18px;overflow:hidden;background:linear-gradient(#d8f2ff 0 60%,#9fd89a 60%)}
.exstage .pet{position:absolute;left:50%;bottom:8%;width:36%;max-width:150px;translate:-50% 0;transition:transform .15s}
.exstage .tgt{position:absolute;left:50%;top:22%;translate:-50% -50%;width:70px;height:70px;border-radius:50%;border:4px dashed #ffffffcc}
.exstage .disc{position:absolute;width:56px;translate:-50% -50%}
.exstage .cue{position:absolute;left:50%;top:26%;translate:-50% -50%;font:700 46px "Huninn",sans-serif;color:#fff;text-shadow:0 3px 10px #0005}
.exstage .ft{position:absolute;bottom:12%;width:34px;height:44px;border-radius:50%;background:#ffffffaa;border:3px solid #fff;translate:-50% 0}
.exstage .ft.on{background:#ffd23f}
.exctl{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.exctl button{min-height:58px;font-size:22px;touch-action:manipulation;padding:0}
</style>`);
const _ogS=openGym;openGym=function(){_ogS();const E=exDay(),n=Object.keys(E.done).length,g=$('gBody').querySelector('.gym');if(!g)return;
 g.insertAdjacentHTML('afterbegin',`<div class="exw"><h3><span>今天和${esc(P().name)}一起運動</span><span class="small">${n} / 3・連續 ${E.streak} 天</span></h3>
  <div class="exb">${Object.entries(EXS).map(([k,x])=>`<button type="button" class="${E.done[k]?'ghost':'save'}" data-ex="${k}" ${E.done[k]?'disabled':''}>${x.ic}${x.n}<small>${E.done[k]?'今天完成了 ✔':x.d}</small></button>`).join('')}</div>
  <p class="small" style="margin:6px 0 0">每天三項都做完：開心、友好度提升，還有額外金幣；連續天數越多獎勵越多。</p></div>`);
 g.querySelector('.exb').onclick=e=>{const b=e.target.closest('[data-ex]');if(!b||b.disabled)return;const p=P();if(p.asleep){toast(`${p.name}在睡覺，等牠醒來再運動吧`);return}
  ({walk:exWalk,disc:exDisc,yoga:exYoga})[b.dataset.ex](p,sc=>exDone(b.dataset.ex,sc))}};
function exShell(p,title,extra,ctl){$('gTitle').textContent=title;$('gBody').innerHTML=`<div class="gym"><div class="ginfo" id="exInfo"></div><div class="exstage" id="exS">${extra||''}<div class="pet" id="exP"><svg viewBox="0 0 200 190">${petSvg(p.sp,'happy')}</svg></div></div>${ctl}<div class="row"><button class="ghost" id="exQuit">不做了</button></div></div>`;
 $('exQuit').onclick=()=>{stopGame&&stopGame();stopGame=null;openGym()}}
function exDone(k,sc){stopGame=null;const E=exDay(),p=P();E.done[k]=1;const good=sc>=60;
 p.joy=clamp(p.joy+(good?12:8));p.full=clamp(p.full-5);if(p.water!=null)p.water=clamp(p.water-8);gain(good?4:2,p);earn(good?20:10,1);track('play');
 let extra='';if(Object.keys(E.done).length>=3&&!E.bonus){E.bonus=true;E.streak=(E.streak||0)+1;const c=30+Math.min(10,E.streak)*10;earn(c,1);gain(5,p);extra=`今天三項運動全部完成！連續 ${E.streak} 天，額外 ${c} 金幣`;if(E.streak===7)remember(p,'連續運動一整個星期！');sfx('level');confetti&&confetti()}
 save();render();$('gTitle').textContent='寵物體育館';
 $('gBody').innerHTML=`<div class="result"><svg viewBox="0 0 200 190" style="width:130px;border-radius:24px;background:${SP[p.sp].bg}">${petSvg(p.sp,'happy')}</svg><h2>${EXS[k].n}完成！</h2><p style="margin:0">表現 ${sc} 分・金幣 +${good?20:10}・開心 +${good?12:8}</p>${extra?`<p class="say">${extra}</p>`:''}<p class="small">運動完會口渴，記得讓${esc(p.name)}喝水喔。</p><div class="row" style="justify-content:center"><button class="save" id="exBack">回體育館</button></div></div>`;
 $('exBack').onclick=openGym;say(`${p.name}：「${pick(['流了好多汗，好舒服！','明天也要一起運動喔！','我覺得自己變強壯了！'])}」`)}
// 散步：左右腳印交替亮起，按對應的按鈕
function exWalk(p,done){let i=0,hit=0,N=24,over=false,t=null,cur='L',ok=false;
 exShell(p,'散步',`<div class="ft" id="fL" style="left:38%"></div><div class="ft" id="fR" style="left:62%"></div>`,`<div class="exctl" style="grid-template-columns:1fr 1fr"><button class="ghost" id="bL">左腳</button><button class="ghost" id="bR">右腳</button></div>`);
 const step=()=>{if(over)return;if(i>=N){over=true;return done(Math.round(hit/N*100))}cur=Math.random()<.75?(cur==='L'?'R':'L'):cur;ok=false;$('fL').classList.toggle('on',cur==='L');$('fR').classList.toggle('on',cur==='R');i++;$('exInfo').innerHTML=`<span>${i} / ${N} 步</span><span>踩對 ${hit}</span>`;t=setTimeout(step,Math.max(520,900-i*15))};
 const press=s=>{if(over||ok)return;if(s===cur){ok=true;hit++;sfx('pop');$('exP').style.transform=`translateX(${s==='L'?-6:6}px)`;setTimeout(()=>$('exP')&&($('exP').style.transform=''),140)}else{sfx('squeak');ok=true}};
 $('bL').onpointerdown=e=>{e.preventDefault();press('L')};$('bR').onpointerdown=e=>{e.preventDefault();press('R')};
 stopGame=()=>{over=true;clearTimeout(t)};t=setTimeout(step,700)}
// 接飛盤：飛盤沿著弧線飛，飛進圈圈時按接
function exDisc(p,done){let n=0,hit=0,N=6,over=false,raf,t0=0,dur=1600,caught=false,from=0;
 exShell(p,'接飛盤',`<div class="tgt"></div><div class="disc" id="dc"><svg viewBox="0 0 44 44"><ellipse cx="22" cy="22" rx="20" ry="8" fill="#ff7c9c"/><ellipse cx="22" cy="20" rx="12" ry="4" fill="#ffb3c4"/></svg></div>`,`<div class="gctl"><button class="save" id="bC">接！</button></div>`);
 const throwIt=()=>{if(over)return;if(n>=N){over=true;return done(Math.round(hit/N*100))}n++;caught=false;from=Math.random()<.5?-10:110;dur=Math.max(900,1700-n*120);t0=performance.now();$('exInfo').innerHTML=`<span>第 ${n} / ${N} 次</span><span>接到 ${hit}</span>`;raf=requestAnimationFrame(fly)};
 const pos=k=>({x:from+(50-from)*k*1.6,y:70-Math.sin(Math.min(1,k*1.25)*Math.PI*.8)*50});
 const fly=now=>{if(over)return;const k=(now-t0)/dur;const q=pos(k);$('dc').style.left=q.x+'%';$('dc').style.top=q.y+'%';if(k<1&&!caught)raf=requestAnimationFrame(fly);else{if(!caught)sfx('squeak');setTimeout(throwIt,500)}};
 $('bC').onpointerdown=e=>{e.preventDefault();if(over||caught||!t0)return;const k=(performance.now()-t0)/dur,q=pos(k);if(Math.abs(q.x-50)<9&&Math.abs(q.y-22)<14){caught=true;hit++;sfx('chime');animEl($('exP'),'hop',500)}else{sfx('squeak')}};
 stopGame=()=>{over=true;cancelAnimationFrame(raf)};setTimeout(throwIt,600)}
// 伸展操：照著箭頭按
function exYoga(p,done){const A=['↑','↓','←','→'],N=10;let i=0,hit=0,over=false,t=null,want='',ok=false;
 exShell(p,'伸展操','<div class="cue" id="cue"></div>',`<div class="exctl">${A.map(a=>`<button class="ghost" data-a="${a}">${a}</button>`).join('')}</div>`);
 const next=()=>{if(over)return;if(i>=N){over=true;$('cue').textContent='';return done(Math.round(hit/N*100))}want=pick(A);ok=false;i++;$('cue').textContent=want;$('exInfo').innerHTML=`<span>${i} / ${N} 個動作</span><span>做對 ${hit}</span>`;t=setTimeout(next,Math.max(900,1500-i*50))};
 $('gBody').querySelector('.exctl').onpointerdown=e=>{const b=e.target.closest('[data-a]');if(!b||over||ok)return;e.preventDefault();ok=true;if(b.dataset.a===want){hit++;sfx('pop');$('exP').style.transform={'↑':'translateY(-14px) scaleY(1.08)','↓':'scaleY(.82)','←':'rotate(-14deg)','→':'rotate(14deg)'}[want];setTimeout(()=>$('exP')&&($('exP').style.transform=''),400)}else sfx('squeak')};
 stopGame=()=>{over=true;clearTimeout(t)};t=setTimeout(next,700)}
