// ===== 喝水與水分條 =====
document.head.insertAdjacentHTML('beforeend',`<style>
#bWater{background-color:#5aa8e0}
.wbowl{position:absolute;left:50%;bottom:4%;width:min(28%,120px);margin-left:calc(min(28%,120px) / -2);z-index:4;animation:bowlIn .45s cubic-bezier(.3,1.5,.6,1) both}
.wbowl.out{animation:bowlOut .45s ease-in forwards}
.wbowl .surf{transform-box:fill-box;transform-origin:center;transition:transform 1.4s ease-in}
.wbowl.drink .surf{transform:scaleY(.25) translateY(10px)}
.wbowl .rip{transform-box:fill-box;transform-origin:center;animation:rip 1s ease-out infinite;opacity:0}
.wbowl.drink .rip{opacity:1}
@keyframes rip{from{transform:scale(.3);opacity:.9}to{transform:scale(1.4);opacity:0}}
</style>`);
const WICON='<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 4C14 13 9 19 9 25a11 11 0 0 0 22 0c0-6-5-12-11-21z" fill="#5aa8e0"/><path d="M15 25a5 5 0 0 0 5 5" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>';
S.pets.forEach(p=>{if(typeof p.water!=='number')p.water=70});
// 水分會隨時間下降，比飽足快一點；太渴的時候開心也會掉得比較快
// 水分用自己的時間戳記，離開一段時間回來也會正確下降
if(!S.wlast)S.wlast=S.last||Date.now();
const _decayW=decay;decay=function(){_decayW();const m=(Date.now()-(S.wlast||Date.now()))/60000;if(m<1)return;S.wlast=Date.now();
 S.pets.forEach(p=>{if(typeof p.water!=='number')p.water=70;p.water=clamp(p.water-m/15);if(p.water<30)p.joy=clamp(p.joy-m/20)});save()};
// 狀態條：插在飽足下面
{const full=$('tFull').closest('.meter'),m=document.createElement('div');m.className='meter';
 m.innerHTML=`<label><span class="ml">${WICON.replace('<svg','<svg width="18" height="18"')}水分</span> <span id="tWater"></span></label><span class="bar"><i id="bWater"></i></span>`;full.after(m)}
const _renderW=render;render=function(){const p=P();if(p&&typeof p.water!=='number')p.water=70;_renderW();if(!p)return;$('tWater').textContent=Math.round(p.water);$('bWater').style.width=p.water+'%'};
// 狀態增加通知也顯示水分
SICON.water=WICON;SNAME.water='水分';SCOL.water='#5aa8e0';
statWatch=function(){const p=P();if(!p)return;const cur={aff:p.aff,full:Math.round(p.full),joy:Math.round(p.joy),water:Math.round(p.water||0)},L=LAST[p.id];LAST[p.id]=cur;if(!L)return;
 const up={};for(const k of ['aff','full','water','joy'])if(cur[k]>(L[k]||0))up[k]=cur[k]-(L[k]||0);if(!Object.keys(up).length)return;
 if(popAcc&&popAcc.id===p.id){for(const k in up)popAcc.up[k]=(popAcc.up[k]||0)+up[k]}else popAcc={id:p.id,up};showPop(p,cur)};
showPop=function(p,cur){const st=$('stage');let el=st.querySelector('.statpop');if(!el){el=document.createElement('div');el.className='statpop';st.append(el)}el.classList.remove('out');const lv=Math.floor(p.aff/100);
 el.innerHTML=`<b>${esc(p.name)}</b>${['aff','full','water','joy'].filter(k=>popAcc.up[k]).map(k=>{const v=k==='aff'?cur.aff%100:cur[k];return `<div class="sr">${SICON[k]}<span>${SNAME[k]} <em>+${popAcc.up[k]}</em></span><span class="bb"><i style="width:${v}%;background:${SCOL[k]}"></i></span></div><div class="lv" style="margin:0 0 0 22px">${k==='aff'?`現在 ${cur.aff%100} / 100（Lv.${lv+1} ${LV[Math.min(lv,LV.length-1)]}）`:`現在 ${v} / 100`}</div>`}).join('')}`;
 clearTimeout(popT);popT=setTimeout(()=>{el.classList.add('out');setTimeout(()=>{el.remove();popAcc=null},400)},2800)};
// 喝水動畫
function waterBowl(x,w){const b=add('wbowl',`<svg viewBox="0 0 120 64" width="100%"><path d="M4 22q4 40 56 40t56-40z" fill="#7ac8f0"/><ellipse cx="60" cy="22" rx="56" ry="12" fill="#5aa8e0"/><ellipse class="surf" cx="60" cy="22" rx="46" ry="8" fill="#bfe6ff"/><ellipse class="rip" cx="60" cy="22" rx="20" ry="4" fill="none" stroke="#fff" stroke-width="2"/><path d="M20 42q40 12 80 0" stroke="#fff" stroke-width="3" fill="none" opacity=".5"/></svg>`,2700);
 if(x!=null){b.style.left=x+'%';b.style.width=w||'14%';b.style.marginLeft=`calc(${w||'14%'} / -2)`}return b}
function drink(){const p=P();if(busy||!p)return;if(p.water>=95){say('我現在不渴～等一下再喝！');anim('hop');sfx('squeak');return}
 lock(2500);summon();sfx('click');const b=waterBowl();
 setTimeout(()=>{anim('munch');b.classList.add('drink');sfx('splash')},650);
 setTimeout(()=>{p.water=clamp(p.water+35);gain(1);sfx('heart');say(pick(['咕嚕咕嚕……好清涼！','喝飽水，整個人都精神了！','謝謝你記得讓我喝水～']));save();render()},1800);
 setTimeout(()=>b.classList.add('out'),2250)}
function drinkAll(){if(busy||S.pets.length<2)return;const ds=S.pets.filter(p=>(p.water??70)<95);if(!ds.length){say('大家都喝飽水了～');return}
 lock(2700);sfx('click');const bowls=ds.map(p=>{const pos=POS[p.id]||{x:50,y:8};return waterBowl(pos.x)});
 setTimeout(()=>{ds.forEach(p=>animEl(wOf(p)?.querySelector('.pet'),'munch',1800));bowls.forEach(b=>b.classList.add('drink'));sfx('splash')},650);
 setTimeout(()=>{ds.forEach(p=>{p.water=clamp(p.water+35);p.aff+=1});hearts(4);say('大家一起咕嚕咕嚕，好清涼！');save();render()},1900);
 setTimeout(()=>bowls.forEach(b=>b.classList.add('out')),2300)}
// 餐廳側邊列加上喝水
const _railW=renderRail;renderRail=function(){_railW();if(view!=='dining'||!P())return;const r=$('rail');if(!r)return;const p=P();
 r.querySelector('h4').insertAdjacentHTML('afterend',`<button type="button" data-rw="one" ${p.water<30?'class="hot"':''}>${WICON}${p.water<30?'好渴！喝水':'喝水'}<b>水分 ${Math.round(p.water)}</b></button>${S.pets.length>1?`<button type="button" data-rw="all">${WICON}一起喝水</button>`:''}<hr>`)};
document.addEventListener('click',e=>{const b=e.target.closest('#rail [data-rw]');if(!b)return;if(b.dataset.rw==='one')drink();else drinkAll();setTimeout(()=>{if(view==='dining')renderRail()},2800)});
// 口渴時會說
setInterval(()=>{const p=P();if(!p||busy||playing||document.hidden||document.querySelector('.ov.on')||Date.now()-lastSay<15000)return;if(p.water<30&&Math.random()<.5){say(`${p.name}：「${pick(['好渴喔……可以給我水喝嗎？','嘴巴乾乾的，想喝水～','水碗空空的耶……'])}」`);sfx('squeak')}},10000);
if(P()){decay();render()}
