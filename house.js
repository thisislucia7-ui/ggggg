// ===== 用金幣買更多房間（最多 6 間），每間有自己的佈置 =====
const HOUSE=[
 {n:'客廳',p:0,d:null},
 {n:'臥室',p:300,d:{wall:'lav',floor:'carpet',rug:'pink',items:[{k:'bed',x:30,y:6},{k:'lamp',x:86,y:14},{k:'clock',x:20,y:20}]}},
 {n:'書房',p:500,d:{wall:'wood',floor:'wood',rug:'blue',items:[{k:'shelf',x:8,y:30},{k:'painting',x:24,y:14},{k:'plant',x:90,y:12}]}},
 {n:'陽光房',p:800,d:{wall:'sky',floor:'grass',rug:'none',items:[{k:'plant',x:8,y:12},{k:'cactus',x:92,y:12},{k:'balloons',x:84,y:10}]}},
 {n:'閣樓',p:1200,d:{wall:'star',floor:'wood',rug:'rainbow',items:[{k:'tower',x:12,y:8},{k:'toybox',x:86,y:6}]}},
 {n:'花園小屋',p:2000,d:{wall:'mint',floor:'grass',rug:'paw',items:[{k:'tank',x:14,y:6},{k:'xmas',x:88,y:8},{k:'plant',x:70,y:12}]}}];
document.head.insertAdjacentHTML('beforeend',`<style>
.roompick{position:absolute;left:10px;top:10px;z-index:8;display:flex;align-items:center;gap:6px;background:light-dark(#ffffffec,#2a2030ec);border-radius:99px;padding:5px 12px 5px 8px;font:14px "Huninn",sans-serif;box-shadow:0 6px 14px -8px #0006;min-height:0}
.roompick svg{width:18px;height:18px}
body.act .roompick,.editing .roompick{display:none}
.hlist{display:flex;flex-direction:column;gap:8px}
.hroom{display:grid;grid-template-columns:72px minmax(0,1fr) auto;gap:10px;align-items:center;background:var(--bg);border-radius:16px;padding:8px;border:2px solid transparent}
.hroom.on{border-color:var(--berry)}
.hroom .mini{width:72px;height:54px;border-radius:10px;overflow:hidden}
.hroom .mini svg{width:100%;height:100%}
.hroom b{font:16px "Huninn",sans-serif;font-weight:400}
.hroom button{min-height:38px;padding:4px 14px;font-size:14px}
</style>`);
function ensureRooms(){if(!Array.isArray(S.rooms)||!S.rooms.length){S.rooms=[{n:'客廳',decor:clone(S.decor)}];S.roomIdx=0}if(typeof S.roomIdx!=='number'||!S.rooms[S.roomIdx])S.roomIdx=0}
ensureRooms();
const HOUSE_IC='<svg viewBox="0 0 40 40"><path d="M6 19 20 7l14 12v15H6z" fill="#ff9fb4"/><rect x="16" y="23" width="8" height="11" rx="2" fill="#fff"/></svg>';
$('stage').insertAdjacentHTML('beforeend',`<button type="button" class="roompick" id="roomPick">${HOUSE_IC}<span id="roomPickN">客廳</span><svg viewBox="0 0 20 20" style="width:12px;height:12px"><path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg></button>`);
document.body.insertAdjacentHTML('beforeend','<div class="ov sheet" id="ovHouse"><div class="sheetbox"><div class="grab"></div><h3 style="margin:0 0 4px">我的房間</h3><p class="small" style="margin:0 0 10px">用金幣買新房間，最多 6 間。每間房間可以各自佈置，寵物會一起搬過去。</p><div class="hlist" id="hList"></div><button class="ghost" id="hClose" style="width:100%;margin-top:12px">關閉</button></div></div>');
function roomPreview(d){return `<svg class="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice">${sceneSvg(cleanDecor(d))}</svg>`}
function renderHouse(){ensureRooms();S.rooms[S.roomIdx].decor=clone(S.decor);const own=S.rooms.length;
 $('hList').innerHTML=HOUSE.map((h,i)=>{const r=S.rooms[i];if(r)return `<div class="hroom ${i===S.roomIdx?'on':''}"><span class="mini">${roomPreview(r.decor)}</span><div><b>${esc(r.n)}</b><p class="small" style="margin:0">${i===S.roomIdx?'目前在這裡':'已擁有'}</p></div>${i===S.roomIdx?'<span class="small">✓</span>':`<button type="button" class="ghost" data-go="${i}">搬過去</button>`}</div>`;
  if(i===own)return `<div class="hroom"><span class="mini">${roomPreview(h.d)}</span><div><b>${h.n}</b><p class="small" style="margin:0">附送一組佈置</p></div><button type="button" class="save" data-buy="${i}" ${S.coins<h.p?'disabled':''}><span class="price">${COIN(16)} ${h.p}</span></button></div>`;
  return `<div class="hroom" style="opacity:.5"><span class="mini">${roomPreview(h.d)}</span><div><b>${h.n}</b><p class="small" style="margin:0">先買下前一間才能解鎖</p></div><span class="price small">${COIN(14)} ${h.p}</span></div>`}).join('')}
function goHouse(i){if(i===S.roomIdx||!S.rooms[i])return;S.rooms[S.roomIdx].decor=clone(S.decor);S.roomIdx=i;S.decor=clone(S.rooms[i].decor);
 add('roomfade','',820);sfx('swoosh');setTimeout(()=>{renderRoom(true);S.pets.forEach(p=>{const w=wOf(p);POS[p.id]={x:15+Math.random()*70,y:4+Math.random()*10};w&&place(w,POS[p.id])});updatePick();say(`搬到${S.rooms[i].n}了！這裡好舒服～`);save()},400)}
function updatePick(){ensureRooms();$('roomPickN').textContent=S.rooms[S.roomIdx]?.n||'客廳'}
$('roomPick').onclick=e=>{e.stopPropagation();sfx('click');renderHouse();$('ovHouse').classList.add('on')};
$('roomPick').addEventListener('pointerdown',e=>e.stopPropagation());
$('hClose').onclick=()=>$('ovHouse').classList.remove('on');
$('ovHouse').onclick=e=>{if(e.target.id==='ovHouse')$('ovHouse').classList.remove('on')};
$('hList').onclick=e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.go){$('ovHouse').classList.remove('on');goHouse(+b.dataset.go)}
 if(b.dataset.buy){const i=+b.dataset.buy,h=HOUSE[i];if(S.coins<h.p){toast('金幣不夠喔，再多陪寵物玩一下吧！');return}
  S.coins-=h.p;const d=clone(h.d);['wall','floor','rug'].forEach(k=>{if(!S.owned[k].includes(d[k]))S.owned[k].push(d[k])});d.items.forEach(it=>{if(!S.owned.furn.includes(it.k))S.owned.furn.push(it.k)});
  S.rooms.push({n:h.n,decor:d});sfx('gift');confetti();toast(`買下了「${h.n}」！`);remember(P(),`我們有了新房間：${h.n}`);save();renderWorldUI();$('ovHouse').classList.remove('on');goHouse(i)}};
// 存檔前把目前房間的佈置寫回去
const _saveH=save;save=function(){if(S.rooms&&S.rooms[S.roomIdx]&&S.rooms[S.roomIdx].decor!==undefined)S.rooms[S.roomIdx].decor=S.decor;_saveH()};
updatePick();
