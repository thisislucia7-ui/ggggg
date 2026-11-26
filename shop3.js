// ===== 全部玩家禮物、好友遊戲（寵物小鎮＋垂釣湖＋體育館）、商店（試穿試用＋購物車） =====
// ---------- 送全部玩家 20000 金幣＋多一個寵物格（每個存檔一次） ----------
function grant26(s){if(!s||s.gift26)return false;s.gift26=1;s.coins=(s.coins||0)+20000;s.slots=Math.min(MAXSLOT,Math.max(2,(s.slots||1)+1));return true}
{const _n3=normalize;normalize=function(s){s=_n3(s);if(grant26(s))setTimeout(()=>toast('🎁 送你 20000 金幣，還多了一個寵物格，可以再養一隻！'),1500);return s}}
if(grant26(S)){save();setTimeout(()=>{render();toast('🎁 送你 20000 金幣，還多了一個寵物格，可以再養一隻！')},1500)}

// ---------- 好友遊戲：寵物小鎮、垂釣湖、體育館同一個視窗 ----------
document.head.insertAdjacentHTML('beforeend',`<style>
.fgtabs{display:flex;gap:6px;padding:8px 14px 0;background:var(--bg);position:sticky;top:58px;z-index:2;overflow-x:auto}
.fgtabs button{flex:1 0 auto;min-height:40px;padding:4px 14px;font-size:15px;border-radius:14px 14px 0 0;background:var(--line);color:var(--ink);border:0}
.fgtabs button[aria-pressed=true]{background:var(--card);color:var(--berry);font-weight:700}
#gBody .twrap{height:auto;width:100%;background:none;overflow:visible}#gBody .twrap>.ghead{display:none}
</style>`);
$('gBody').insertAdjacentHTML('beforebegin','<div class="fgtabs" id="fgTabs" hidden></div>');
const FG=[['town','寵物小鎮'],['fish','垂釣湖'],['gym','體育館'],['draw','你畫我猜']];
{const i=GAMES.findIndex(g=>g.id==='draw');if(i>=0)GAMES.splice(i,1)}let fgOn=false,fgCur='town';
const townWrap=$('ovTown').querySelector('.twrap');
function fgTabs(){$('fgTabs').hidden=!fgOn;if(fgOn)$('fgTabs').innerHTML=FG.map(([k,n])=>`<button type="button" data-fg="${k}" aria-pressed="${k===fgCur}">${n}</button>`).join('')}
function townBack(){if(townWrap.parentNode!==$('ovTown'))$('ovTown').append(townWrap)}
function openFG(k){$('ovMenu').classList.remove('on');if(!P()){openAdopt('first');return}if(stopGame){stopGame();stopGame=null}
 if(typeof fishLeave==='function'&&k!=='fish')fishLeave();fgOn=true;fgCur=k;townBack();
 if(k==='town'){$('ovGame').classList.add('on');playing=true;$('gTitle').textContent='好友遊戲';townInit();$('gBody').innerHTML='';$('gBody').append(townWrap);renderTown();sfx('click')}
 if(k==='fish')_openFish('lake');if(k==='gym')_openGym();if(k==='draw'){if(typeof DG!=='undefined'&&DG)dgRender();else drawLobby()}
 $('gTitle').textContent='好友遊戲';fgTabs()}
$('fgTabs').onclick=e=>{const b=e.target.closest('[data-fg]');if(b)openFG(b.dataset.fg)};
const _openFish=openFish,_openGym=openGym,_openTown=openTown;
openFish=function(t){if(!fgOn){fgOn=true;fgCur='fish'}_openFish(t);$('gTitle').textContent='好友遊戲';fgTabs()};
openGym=function(){if(!fgOn){fgOn=true;fgCur='gym'}_openGym();$('gTitle').textContent='好友遊戲';fgTabs()};
openTown=function(){openFG('town')};
// 其他遊戲（小遊戲屋、探險、你畫我猜）不顯示好友遊戲分頁
const _gm3=gameMenu;gameMenu=function(){if(fgOn&&fgCur==='draw'){drawLobby();$('gTitle').textContent='好友遊戲';fgTabs();return}fgOn=false;townBack();fgTabs();return _gm3()};
const _oa3=openAdv;openAdv=function(){fgOn=false;townBack();fgTabs();return _oa3()};
const _cg3=closeGames;closeGames=function(){fgOn=false;fgTabs();townBack();return _cg3()};$('gExit').onclick=()=>closeGames();
// 選單：三個合成「好友遊戲」
for(const k of ['town','fish','gym']){const i=MENU_EXTRA.findIndex(m=>m[0]===k);if(i>=0)MENU_EXTRA.splice(i,1)}
MENU_EXTRA.splice(0,0,['fgames','好友遊戲','<svg viewBox="0 0 40 40"><rect x="4" y="10" width="32" height="22" rx="10" fill="#7aa8ff"/><circle cx="13" cy="21" r="3" fill="#fff"/><circle cx="27" cy="21" r="3" fill="#fff"/><circle cx="20" cy="8" r="4" fill="#ffc94a"/></svg>',()=>openFG(fgCur)]);

// ---------- 商店：所有東西都在這裡買，可以試穿試用，購物車結帳才付錢 ----------
VIEWS.shop={n:'商店',d:'家具、壁紙、衣服、釣具、飼料都在這裡買',ic:'<svg viewBox="0 0 40 40"><path d="M6 14h28l-3 20H9z" fill="#ff9fb4"/><path d="M14 14v-3a6 6 0 0 1 12 0v3" stroke="#e8507a" stroke-width="3" fill="none"/><circle cx="15" cy="20" r="2" fill="#fff"/><circle cx="25" cy="20" r="2" fill="#fff"/></svg>'};
const FOODP=[30,50,80,120];
const SHOPCAT=[['f','家具'],['s','小物'],['w','掛飾'],['wall','壁紙'],['floor','地板'],['rug','地毯'],['wear','衣服'],['fish','釣具'],['food','飼料']];
let shCat='f',cart=[],TRY={furn:[],wall:null,floor:null,rug:null};
document.head.insertAdjacentHTML('beforeend',`<style>
.shopv{display:flex;flex-direction:column;gap:10px;margin-top:4px;grid-column:1/-1;min-width:0}
@media(min-width:761px){body[data-view=shop] .panel{display:none!important}body[data-view=shop] .shopv{grid-column:2;grid-row:1;align-self:start;max-height:calc(100vh - 24px);overflow:auto;position:sticky;top:12px;margin:0;padding-right:4px}}
@media(max-width:760px){body[data-view=shop] .shopv{position:fixed;left:0;right:0;bottom:0;z-index:12;margin:0;background:var(--card);border-radius:24px 24px 0 0;padding:10px 12px calc(10px + env(safe-area-inset-bottom));box-shadow:0 -12px 30px -14px #7a3a1a88;max-height:48vh;overflow:auto;gap:6px}
 body[data-view=shop] .sitem{padding:6px;font-size:13px;gap:1px}body[data-view=shop] .sitem .pv{height:46px}body[data-view=shop] .sitem .pv svg{height:46px;max-height:46px}body[data-view=shop] .sitem em{font-size:11px}body[data-view=shop] .sitem .acts button{min-height:28px;font-size:11px}body[data-view=shop] .sgrid>.sitem{flex-basis:112px}body[data-view=shop] .stabs button{min-height:30px;padding:2px 12px;font-size:13px}.shead b{font-size:16px!important}.shead button{min-height:30px!important}
 body[data-view=shop]{padding-bottom:340px}body[data-view=shop] .fab{display:none!important}body[data-view=shop] .viewtitle{display:none}
 .shopv .trynote{display:none}.shopv .sitem{background:var(--bg);box-shadow:none}.shopv .cartbar{position:static;margin:0!important;box-shadow:none;background:var(--bg)}}
.shead{display:flex;justify-content:space-between;align-items:center}.shead b{font:18px "Huninn",sans-serif;font-weight:400}.shead button{min-height:34px;padding:2px 14px}
@media(min-width:761px){.shead{display:none}}
@media(max-width:760px){.cartbar{margin-right:72px;padding:8px 10px;gap:6px;font-size:13px}.cartbar b{font-size:13px}.cartbar button{min-height:36px;padding:2px 10px}.sgrid>.sitem{flex-basis:124px}}
.shopv .stabs{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px;scrollbar-width:none}.shopv .stabs::-webkit-scrollbar{display:none}
.shopv .stabs button{flex:none;min-height:36px;padding:4px 14px;font-size:14px;border-radius:99px;background:var(--card);border:2px solid var(--line);color:var(--ink)}
.shopv .stabs button[aria-pressed=true]{border-color:var(--berry);color:var(--berry);font-weight:700}
.sgrid{display:flex;gap:10px;overflow-x:auto;padding:2px 2px 8px;scroll-snap-type:x proximity;overscroll-behavior-x:contain;scrollbar-width:thin}.sgrid>.sitem{flex:0 0 136px;scroll-snap-align:start}
.sitem{position:relative;background:var(--card);border-radius:18px;padding:8px;display:flex;flex-direction:column;align-items:center;gap:3px;font-size:14px;text-align:center;border:2px solid transparent;min-height:0;box-shadow:0 6px 14px -12px #7a3a1a88}
.sitem.try{border-color:var(--mint);box-shadow:0 0 0 3px #5fc9ae44}.sitem.inc{border-color:var(--berry)}
.sitem .pv{height:64px;display:flex;align-items:center;justify-content:center;width:100%}.sitem .pv svg{max-height:64px;max-width:100%;width:auto;height:64px}
.sitem em{font-style:normal;font-size:12px;color:var(--mute)}.sitem .pr{color:var(--berry);font-weight:700;display:flex;align-items:center;gap:3px}
.sitem .tag{position:absolute;top:6px;left:6px;font-size:11px;background:var(--mint);color:#fff;border-radius:99px;padding:0 8px}
.sitem .acts{display:flex;gap:4px;width:100%}.sitem .acts button{flex:1;min-height:32px;padding:2px 4px;font-size:12px;border-radius:10px}
.cartbar{position:sticky;bottom:calc(8px + env(safe-area-inset-bottom));z-index:9;background:var(--card);border-radius:20px;padding:10px 14px;box-shadow:0 10px 30px -12px #7a3a1a88;display:flex;align-items:center;gap:10px}
.cartbar b{flex:1}.cartbar button{min-height:40px}
.cartlist{background:var(--card);border-radius:18px;padding:8px 12px}
.cartlist .ci{display:grid;grid-template-columns:40px 1fr auto auto;gap:8px;align-items:center;padding:6px 0;border-bottom:1px dashed var(--line);font-size:14px}
.cartlist .ci:last-child{border:0}.cartlist .ci svg{width:40px;height:32px}
.cartlist .q{display:flex;align-items:center;gap:4px}.cartlist .q button{width:28px;height:28px;min-height:0;padding:0;border-radius:50%}
.trynote{font-size:13px;background:#e3f7ec;color:#2a7a4c;border-radius:12px;padding:6px 10px}
</style>`);
document.querySelector('.band.top .home').insertAdjacentHTML('beforeend',`<div class="shopv" data-v="shop" hidden><div class="shead"><b>商店</b><button type="button" class="ghost" id="shExit">回客廳</button></div><div class="stabs" id="shTabs"></div><p class="trynote" id="shNote">左右滑動挑商品，點一下就能先試穿、試用（看看擺在房間的樣子），喜歡再加入購物車，結帳時才付錢。</p><div class="sgrid" id="shGrid"></div><div class="cartlist" id="shCart" hidden></div><div class="cartbar" id="shBar"></div></div>`);
function itemsOf(cat){const F=typeof fishSt==='function'?fishSt():{rods:[],bait:{}},p=P(),grp=p?SP[p.sp].grp:'cat';
 if(['f','s','w'].includes(cat))return Object.entries(FURN).filter(([id,x])=>(x.c||'f')===cat).map(([id,x])=>({t:'furn',id,n:x.n,p:x.p,own:S.owned.furn.includes(id),pv:furnSvg(id),d:x.heat?'可以讓房間變暖':x.cool?'可以讓房間變涼':''}));
 if(cat==='wall'||cat==='floor'||cat==='rug'){const C=cat==='wall'?WALLS:cat==='floor'?FLOORS:RUGS;return Object.entries(C).map(([id,x])=>({t:cat,id,n:x.n,p:x.p,own:S.owned[cat].includes(id),pv:decorPreview(cat,id)}))}
 if(cat==='wear')return Object.entries(CLOTHES).map(([id,c])=>({t:'wear',id,n:c.n,p:c.p,own:(S.owned.clothes||[]).includes(id),pv:wearIcon(id),d:`${SLOTN[c.slot]}・${c.warm>0?'保暖+'+c.warm:c.warm<0?'涼快':'裝飾'}`}));
 if(cat==='fish')return [...Object.entries(RODS).map(([id,r])=>({t:'rod',id,n:r.n,p:r.p,own:F.rods.includes(id),pv:rodSvg(id),d:`判定區 ${r.zone}%・好運 +${r.luck}`})),...Object.entries(BAITS).map(([id,b])=>({t:'bait',id,n:`${b.n}（${BAIT_PACK} 個）`,p:b.p,qty:1,pv:baitSvg(id),d:`稀有魚 +${b.luck}・現有 ${F.bait[id]||0} 個`}))];
 if(cat==='food')return FOOD[grp].slice(1).map((f,i)=>({t:'food',id:String(i),n:f[0],p:FOODP[i],qty:1,pv:foodIcon(grp,i+1,56),d:`飽足 +${TIER[i+1].f}・友好 +${TIER[i+1].a}・背包 ${S.inv[i]}`}));return []}
const ckey=x=>x.t+':'+x.id,inCart=x=>cart.find(c=>ckey(c)===ckey(x));
const isTry=x=>(x.t==='furn'&&TRY.furn.includes(x.id))||(['wall','floor','rug'].includes(x.t)&&TRY[x.t]===x.id)||(x.t==='wear'&&P()&&TRY_WEAR[P().id]&&TRY_WEAR[P().id][CLOTHES[x.id].slot]===x.id);
function renderShop(){if(view!=='shop')return;const list=itemsOf(shCat);
 $('shTabs').innerHTML=SHOPCAT.map(([k,n])=>`<button type="button" data-sc="${k}" aria-pressed="${k===shCat}">${n}</button>`).join('');
 $('shGrid').scrollLeft=0;$('shGrid').innerHTML=list.map(x=>{const c=inCart(x),tr=isTry(x),consum=x.t==='bait'||x.t==='food';
  return `<div class="sitem ${tr?'try':''} ${c?'inc':''}" data-k="${ckey(x)}">${tr?'<span class="tag">試穿中</span>':''}<button type="button" class="pv" data-try="${ckey(x)}" aria-label="試用${esc(x.n)}" style="background:none;border:0;padding:0;min-height:0;box-shadow:none">${x.pv}</button><b>${esc(x.n)}</b>${x.d?`<em>${esc(x.d)}</em>`:''}
  ${x.own&&!consum?'<em>已經擁有</em>':`<span class="pr">${COIN(13)} ${x.p}</span>`}
  <div class="acts"><button type="button" class="ghost" data-try="${ckey(x)}">${tr?'取消試用':x.t==='wear'?'試穿':'試用'}</button>${x.own&&!consum?'':`<button type="button" class="${c?'ghost':'save'}" data-cart="${ckey(x)}">${c?(consum?'再加一份':'已在車上'):'加入購物車'}</button>`}</div></div>`}).join('')||'<p class="small">這裡還沒有商品。</p>';
 renderCart()}
function cartTotal(){return cart.reduce((a,c)=>a+c.p*(c.qty||1),0)}
function renderCart(){const n=cart.reduce((a,c)=>a+(c.qty||1),0),tot=cartTotal();
 $('shBar').innerHTML=`${COIN(18)}<span>${S.coins}</span><b>購物車 ${n} 件・合計 ${tot}</b><button type="button" class="ghost" id="shView" ${n?'':'disabled'}>${$('shCart').hidden?'查看':'收起'}</button><button type="button" class="save" id="shPay" ${n?'':'disabled'}>結帳</button>`;
 if(!$('shCart').hidden)$('shCart').innerHTML=cart.length?cart.map((c,i)=>`<div class="ci">${c.pv}<span>${esc(c.n)}<br><em class="small">${COIN(11)} ${c.p}${c.qty>1?` × ${c.qty}`:''}</em></span><span class="q">${c.t==='bait'||c.t==='food'?`<button type="button" class="ghost" data-dq="${i}">−</button>${c.qty}<button type="button" class="ghost" data-iq="${i}">＋</button>`:''}</span><button type="button" class="link" data-rm="${i}">移除</button></div>`).join(''):'<p class="small">購物車是空的。</p>'}
function previewRoom(){if(view!=='shop'||inRoom)return;const d={...S.decor,wall:TRY.wall||S.decor.wall,floor:TRY.floor||S.decor.floor,rug:TRY.rug||S.decor.rug};
 $('scene').innerHTML=sceneSvg(d);const items=[...S.decor.items.filter(i=>FURN[i.k]),...TRY.furn.filter(id=>!S.decor.items.some(i=>i.k===id)).map((id,j)=>{const F=FURN[id];return {k:id,x:22+((j*29)%58),y:F.k==='w'?18:6,_t:1}})];
 renderFurn($('furnL'),items,false);roomKey='';typeof wxApply==='function'&&wxApply()}
function clearTry(){const had=TRY.furn.length||TRY.wall||TRY.floor||TRY.rug;TRY={furn:[],wall:null,floor:null,rug:null};for(const k in TRY_WEAR)delete TRY_WEAR[k];if(had)renderRoom(true);typeof dress==='function'&&dress()}
function toggleTry(key){const [t,id]=key.split(':'),p=P();
 if(t==='furn'){const i=TRY.furn.indexOf(id);if(i>=0)TRY.furn.splice(i,1);else{TRY.furn.push(id);say(`${p.name}：「${pick(['擺在這裡好像不錯！','哇，家裡變得不一樣了～','這個我喜歡！'])}」`)}previewRoom()}
 if(['wall','floor','rug'].includes(t)){TRY[t]=TRY[t]===id?null:id;previewRoom()}
 if(t==='wear'){const c=CLOTHES[id],cur=TRY_WEAR[p.id]||{...(p.wear||{})};if(cur[c.slot]===id&&TRY_WEAR[p.id])delete cur[c.slot];else cur[c.slot]=id;TRY_WEAR[p.id]=cur;dress();say(`${p.name}：「${pick(['好看嗎？轉一圈給你看！','這件好適合我！','我覺得還不錯耶～'])}」`);if(c.slot==='sleep')toast('毛毯要在睡覺時才會蓋上喔')}
 if(t==='rod'){const r=RODS[id];toast(`試用「${r.n}」：綠色判定框 ${r.zone}%，越寬越好釣；好運 +${r.luck} 比較容易釣到稀有魚`);animEl($('pet'),'hop',600)}
 if(t==='bait'){const b=BAITS[id];toast(`試用「${b.n}」：稀有魚機率 +${b.luck}。每包 ${BAIT_PACK} 個，拋一次竿用 1 個`)}
 if(t==='food'){const f=FOOD[SP[p.sp].grp][+id+1];say(`${p.name}聞了聞「${f[0]}」：「${pick(['好香喔！可以買給我嗎？','口水流下來了……','這個一定很好吃！'])}」`);animEl($('pet'),'hop',600)}
 sfx('pop');renderShop();const st=$('stage').getBoundingClientRect();if(st.bottom<60)scrollTo({top:scrollY+st.top-8,behavior:'smooth'})}
document.addEventListener('click',e=>{if(view!=='shop')return;if(e.target.closest('#shExit')){setView('home');return}const sc=e.target.closest('#shTabs [data-sc]');if(sc){shCat=sc.dataset.sc;sfx('click');renderShop();return}
 const tr=e.target.closest('#shGrid [data-try]');if(tr){toggleTry(tr.dataset.try);return}
 const ca=e.target.closest('#shGrid [data-cart]');if(ca){const x=itemsOf(shCat).find(i=>ckey(i)===ca.dataset.cart);if(!x)return;const c=inCart(x);
  if(c){if(x.t==='bait'||x.t==='food')c.qty++;else{toast('已經在購物車裡了');return}}else cart.push({...x,qty:1});sfx('coin');toast(`「${x.n}」加入購物車`);renderShop();return}
 if(e.target.closest('#shView')){$('shCart').hidden=!$('shCart').hidden;renderCart();return}
 const rm=e.target.closest('#shCart [data-rm]');if(rm){cart.splice(+rm.dataset.rm,1);renderShop();return}
 const iq=e.target.closest('#shCart [data-iq]');if(iq){cart[+iq.dataset.iq].qty++;renderCart();return}
 const dq=e.target.closest('#shCart [data-dq]');if(dq){const c=cart[+dq.dataset.dq];if(--c.qty<=0)cart.splice(+dq.dataset.dq,1);renderShop();return}
 if(e.target.closest('#shPay'))checkout()});
function checkout(){const tot=cartTotal();if(!cart.length)return;if(S.coins<tot){toast(`金幣不夠喔：還差 ${tot-S.coins} 金幣，先把一些東西拿出購物車吧`);sfx('squeak');return}
 if(!confirm(`確定要花 ${tot} 金幣買 ${cart.reduce((a,c)=>a+(c.qty||1),0)} 件東西嗎？`))return;
 S.coins-=tot;const p=P(),F=typeof fishSt==='function'?fishSt():null;let placed=0;
 for(const c of cart){const q=c.qty||1;
  if(c.t==='furn'){if(!S.owned.furn.includes(c.id))S.owned.furn.push(c.id);if(!S.decor.items.some(i=>i.k===c.id)){const Fu=FURN[c.id];S.decor.items.push({k:c.id,x:20+Math.random()*60,y:Fu.k==='w'?16+Math.random()*10:4+Math.random()*10});placed++}}
  if(['wall','floor','rug'].includes(c.t)){if(!S.owned[c.t].includes(c.id))S.owned[c.t].push(c.id);S.decor[c.t]=c.id}
  if(c.t==='wear'){S.owned.clothes=S.owned.clothes||[];if(!S.owned.clothes.includes(c.id))S.owned.clothes.push(c.id);p.wear=p.wear||{};p.wear[CLOTHES[c.id].slot]=c.id}
  if(c.t==='rod'&&F){if(!F.rods.includes(c.id))F.rods.push(c.id);F.rod=c.id}
  if(c.t==='bait'&&F){F.bait[c.id]=(F.bait[c.id]||0)+BAIT_PACK*q;F.sel=c.id}
  if(c.t==='food')S.inv[+c.id]+=q}
 const n=cart.reduce((a,c)=>a+(c.qty||1),0);cart=[];$('shCart').hidden=true;clearTry();save();render();renderRoom(true);typeof dress==='function'&&dress();
 sfx('gift');confetti&&confetti();toast(`結帳完成！買了 ${n} 件東西，花了 ${tot} 金幣${placed?`，新家具已經擺進客廳（可以用鉛筆調整位置）`:''}`);say(`${p.name}：「謝謝你！我好喜歡～」`);gain(2,p);renderShop()}
// 進出商店
const _av3=applyView;applyView=function(){_av3();const sh=view==='shop';document.querySelector('.panel').classList.toggle('mini',sh||document.querySelector('.panel').classList.contains('mini'));
 if(sh){renderShop();previewRoom();if(innerWidth<=760)setTimeout(()=>{const st=$('stage').getBoundingClientRect();scrollTo({top:Math.max(0,scrollY+st.top-4)})},200)}else if(TRY.furn.length||TRY.wall||TRY.floor||TRY.rug||Object.keys(TRY_WEAR).length)clearTry()};
const _sv3=setView;setView=function(v){if(view==='shop'&&v!=='shop'&&cart.length&&!confirm('購物車裡還有東西沒結帳，要離開商店嗎？（購物車會保留）'))return;return _sv3(v)};
// 房間重畫時保留試用中的樣子
const _rr3=renderRoom;renderRoom=function(f){_rr3(f);if(view==='shop'&&(TRY.furn.length||TRY.wall||TRY.floor||TRY.rug))previewRoom()};

// ---------- 選單改成橫向滑動 ----------
document.head.insertAdjacentHTML('beforeend',`<style>
#ovMenu .menugrid{display:flex;gap:10px;overflow-x:auto;padding:2px 2px 10px;scroll-snap-type:x proximity;overscroll-behavior-x:contain;scrollbar-width:thin}
#ovMenu .menugrid button{flex:0 0 92px;scroll-snap-align:start;padding:10px 4px;font-size:14px;white-space:nowrap}
#ovMenu .sheetbox h3{font-size:16px}
</style>`);
{const _rmH=renderMenu;renderMenu=function(){_rmH();const cur=$('menuGrid').querySelector('[aria-current=page]');if(cur)requestAnimationFrame(()=>cur.scrollIntoView({inline:'center',block:'nearest'}))}}
{const _og3=openGames;openGames=function(){fgOn=false;townBack();fgTabs();return _og3()};$('btnGame')&&($('btnGame').onclick=()=>openGames())}
