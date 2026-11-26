// ===== 手機版精簡：點寵物看狀態、寵物縮小、通知不遮畫面、減少卡頓 =====
document.head.insertAdjacentHTML('beforeend',`<style>
/* 修正：通知卡裡的小圖示一定要固定大小（iPhone 會把沒設尺寸的圖示撐到很大） */
.statpop svg{width:16px!important;height:16px!important;flex:none}
.petcard{display:grid;grid-template-columns:84px minmax(0,1fr);gap:12px;align-items:center;margin-bottom:10px}
.petcard svg.th{width:84px;height:auto;border-radius:18px}
.petcard h3{font-size:22px;margin:0}
.petcard p{margin:2px 0 0;font-size:13px;color:var(--mute)}
.pcm{display:grid;grid-template-columns:22px 48px minmax(0,1fr) 54px;gap:6px;align-items:center;font-size:14px;margin:7px 0}
.pcm svg{width:18px;height:18px}.pcm b{font-weight:500;text-align:right;font-variant-numeric:tabular-nums;font-size:13px;color:var(--mute)}
.pcm .bar{margin:0;height:11px}
@media(max-width:760px){
 .panel{display:none!important}
 #petsL .pw,.vstage .pw{width:calc(var(--pw,46%) * .7)!important}
 .mote{display:none}
 .scene .bulbs circle{animation:none!important}
 .rail{-webkit-backdrop-filter:none!important;backdrop-filter:none!important;background:light-dark(#fffffff2,#2a2030f2)!important}
 .statpop{left:50%!important;right:auto!important;top:auto!important;bottom:10px!important;translate:-50% 0;min-width:0!important;max-width:calc(100% - 24px)!important;padding:6px 12px!important;border-radius:99px!important;display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;font-size:13px}
 body.act .statpop{left:40%!important}
 .statpop b{display:inline!important;margin:0!important;font-size:14px!important}
 .statpop .sr{display:inline-flex!important;gap:4px!important;margin:0!important}
 .statpop .sr .bb,.statpop .lv{display:none!important}
 .bubble{font-size:15px!important;padding:6px 12px!important;max-width:70%!important}
}
</style>`);
// 點一下寵物：看牠的狀態
function openPetCard(pid){const p=S.pets.find(q=>q.id===pid)||P();if(!p)return;const sp=SP[p.sp],Q=(typeof PERS!=='undefined'&&PERS[p.pers])||{n:''},lv=Math.floor(p.aff/100);
 const row=(ic,n,v,col,txt)=>`<div class="pcm">${ic}<span>${n}</span><span class="bar"><i style="width:${Math.max(0,Math.min(100,v))}%;background:${col}"></i></span><b>${txt}</b></div>`;
 const H=SICON;
 $('pcBody').innerHTML=`<div class="petcard">${thumb(p.sp,expr(p),'th')}<div><h3>${esc(p.name)}</h3><p>${esc(sp.breed)}・${esc(Q.n||FAMS[sp.fam])}</p><p style="color:var(--berry)">Lv.${lv+1} ${LV[Math.min(lv,LV.length-1)]}・相處第 ${Math.floor((Date.now()-(p.born||Date.now()))/864e5)+1} 天</p></div></div>
 ${row(H.aff,'友好度',p.aff%100,'var(--berry)',`${p.aff%100}/100`)}
 ${row(H.full,'飽足',p.full,'#f0a04b',Math.round(p.full))}
 ${row(H.water||'','水分',p.water??70,'#5aa8e0',Math.round(p.water??70))}
 ${row(H.joy,'開心',p.joy,'var(--mint)',Math.round(p.joy))}
 ${row('<svg viewBox="0 0 40 40"><path d="M8 34h24l-3-16H11z" fill="#9fc8f0"/></svg>','整潔',cleanliness(),'#7aa8e0',cleanliness())}
 <div class="row"><button class="ghost" id="pcRename">改名</button><button class="ghost" id="pcSecret">牠的小秘密</button><button class="save" id="pcClose">好</button></div>`;
 $('pcRename').onclick=()=>{$('ovPetCard').classList.remove('on');const i=S.pets.indexOf(p);if(i>=0&&i!==S.cur){S.cur=i;render()}$('btnRename').click()};
 $('pcSecret').onclick=()=>{$('ovPetCard').classList.remove('on');setView('tasks')};
 $('pcClose').onclick=()=>$('ovPetCard').classList.remove('on');
 $('ovPetCard').classList.add('on')}
document.body.insertAdjacentHTML('beforeend','<div class="ov sheet" id="ovPetCard"><div class="sheetbox"><div class="grab"></div><div id="pcBody"></div></div></div>');
$('ovPetCard').onclick=e=>{if(e.target.id==='ovPetCard')$('ovPetCard').classList.remove('on')};
{let d=null;const st=$('stage');
 st.addEventListener('pointerdown',e=>{const w=e.target.closest('.pw');d=w&&!editMode&&!fight?{x:e.clientX,y:e.clientY,pid:w.dataset.pid,t:Date.now()}:null});
 st.addEventListener('pointerup',e=>{if(!d)return;const moved=Math.hypot(e.clientX-d.x,e.clientY-d.y),pid=d.pid,long=Date.now()-d.t;d=null;
  if(moved<10&&long<600&&!(typeof BEH!=='undefined'&&BEH[pid]?.act==='nap'))setTimeout(()=>openPetCard(pid),350)})}
// 個人頁也看得到改名按鈕（手機上狀態面板已隱藏）
