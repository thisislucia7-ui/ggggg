// ===== 佈置 2.0：鉛筆進入佈置、橫向滑動選家具、每個房間都能佈置、更多家具壁紙小物掛飾；左右滑動換房間 =====
// ---------- 更多商品 ----------
const CAT_OF={plant:'s',lamp:'f',shelf:'w',sofa:'f',bed:'f',tower:'f',tank:'f',toybox:'f',piano:'f',xmas:'f',painting:'w',clock:'w',balloons:'s',cactus:'s'};
Object.assign(FURN,{
 diningtable:{n:'小餐桌',p:120,k:'f',c:'f',w:26,v:'0 0 110 70',s:'<rect x="6" y="20" width="98" height="10" rx="4" fill="#c98a4b"/><path d="M8 28h94l-6 14H14z" fill="#ffe0e8"/><path d="M14 42h82" stroke="#ff9fb4" stroke-width="3" stroke-dasharray="6 5"/><rect x="16" y="30" width="7" height="40" fill="#a8643a"/><rect x="87" y="30" width="7" height="40" fill="#a8643a"/><circle cx="40" cy="14" r="8" fill="#fff" stroke="#e0d0c0" stroke-width="2"/><rect x="62" y="6" width="10" height="14" rx="3" fill="#7ac8f0"/>'},
 desk:{n:'小書桌',p:110,k:'f',c:'f',w:22,v:'0 0 100 76',s:'<rect x="4" y="30" width="92" height="8" rx="3" fill="#c98a4b"/><rect x="60" y="38" width="32" height="38" rx="3" fill="#d9a06a"/><path d="M66 50h20M66 62h20" stroke="#a8643a" stroke-width="2"/><rect x="8" y="38" width="6" height="38" fill="#a8643a"/><path d="M20 30V8l12-4" stroke="#8a6f68" stroke-width="3" fill="none"/><path d="M26 4h18l-6 10H32z" fill="#ffd23f"/><rect x="50" y="18" width="20" height="12" rx="2" fill="#7aa8ff"/>'},
 wardrobe:{n:'衣櫃',p:160,k:'f',c:'f',w:16,v:'0 0 64 110',s:'<rect x="4" y="4" width="56" height="102" rx="6" fill="#e8c49a"/><path d="M32 8v94" stroke="#c9955a" stroke-width="2"/><circle cx="27" cy="54" r="2.5" fill="#8a5634"/><circle cx="37" cy="54" r="2.5" fill="#8a5634"/><rect x="10" y="12" width="16" height="10" rx="2" fill="#fff6" /><path d="M8 106v4M56 106v4" stroke="#8a5634" stroke-width="4"/>'},
 cushion:{n:'軟墊窩',p:50,k:'f',c:'f',w:16,v:'0 0 80 36',s:'<ellipse cx="40" cy="22" rx="38" ry="13" fill="#ffc8d4"/><ellipse cx="40" cy="19" rx="28" ry="8" fill="#fff0f4"/><path d="M8 22q32 16 64 0" stroke="#f0a0b4" stroke-width="2" fill="none"/>'},
 tent:{n:'寵物帳篷',p:130,k:'f',c:'f',w:20,v:'0 0 90 84',s:'<path d="M45 4 6 80h78z" fill="#9fd3c4"/><path d="M45 4 30 80h30z" fill="#fff8ee"/><path d="M45 4v-2" stroke="#8a6f68" stroke-width="3"/><path d="M38 0l14 4-14 4z" fill="#ff7c9c"/><g fill="#ffc94a"><circle cx="20" cy="66" r="3"/><circle cx="70" cy="60" r="3"/></g>'},
 fireplace:{n:'壁爐',p:220,k:'f',c:'f',w:22,v:'0 0 100 92',heat:1,s:'<rect x="4" y="10" width="92" height="82" rx="4" fill="#d98a72"/><path d="M4 30h92M4 50h92M4 70h92M28 10v20M64 30v20M36 50v20M72 70v22" stroke="#c4705a" stroke-width="2"/><rect x="0" y="4" width="100" height="10" rx="3" fill="#a8643a"/><path d="M26 92V58a24 24 0 0 1 48 0v34z" fill="#3a2a2a"/><path class="flame" d="M50 90c-14 0-16-14-6-24 0 8 6 8 6 0 4 6 14 12 10 18-2 4-6 6-10 6z" fill="#ffb03a"/><path class="flame" d="M50 90c-6 0-8-6-2-12 0 4 4 4 4 0 4 4 4 12-2 12z" fill="#ffe08a"/>'},
 heater:{n:'暖氣機',p:180,k:'f',c:'f',w:9,v:'0 0 40 64',heat:1,s:'<rect x="4" y="6" width="32" height="50" rx="8" fill="#f4f0ea" stroke="#d8ccc4" stroke-width="2"/><rect x="9" y="12" width="22" height="30" rx="4" fill="#ff8a5a"/><path class="flame" d="M13 20h14M13 27h14M13 34h14" stroke="#ffd08a" stroke-width="3"/><circle cx="20" cy="48" r="3" fill="#8a6f68"/><path d="M8 56v6M32 56v6" stroke="#8a6f68" stroke-width="3"/>'},
 fridge:{n:'小冰箱',p:150,k:'f',c:'f',w:12,v:'0 0 50 100',s:'<rect x="3" y="3" width="44" height="94" rx="8" fill="#e3f3fb" stroke="#bcdcec" stroke-width="3"/><path d="M3 40h44" stroke="#bcdcec" stroke-width="3"/><rect x="9" y="14" width="4" height="18" rx="2" fill="#9ab8cf"/><rect x="9" y="48" width="4" height="22" rx="2" fill="#9ab8cf"/><path d="M33 22c-3-2-5-4-5-6a2.5 2.5 0 0 1 5-1 2.5 2.5 0 0 1 5 1c0 2-2 4-5 6z" fill="#ff7c9c"/>'},
 vase:{n:'花瓶',p:30,k:'f',c:'s',w:6,v:'0 0 30 54',s:'<path d="M9 30q-6 12 0 22h12q6-10 0-22z" fill="#7aa8ff"/><path d="M15 30V12M15 22l-8-8M15 18l8-6" stroke="#5fb04a" stroke-width="2"/><circle cx="15" cy="10" r="5" fill="#ff7c9c"/><circle cx="6" cy="13" r="4" fill="#ffd23f"/><circle cx="24" cy="11" r="4" fill="#b58cff"/>'},
 globe:{n:'地球儀',p:40,k:'f',c:'s',w:7,v:'0 0 36 54',s:'<circle cx="18" cy="20" r="15" fill="#7ac8f0"/><path d="M10 12q6 4 4 10-4 4 0 8M22 8q6 6 2 12 4 4 6 10" stroke="#5fb04a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M4 20a14 14 0 0 0 28 0" stroke="#c9a070" stroke-width="2" fill="none"/><path d="M18 36v10M8 50h20" stroke="#a8643a" stroke-width="4" stroke-linecap="round"/>'},
 candle:{n:'香氛蠟燭',p:25,k:'f',c:'s',w:5,v:'0 0 24 44',s:'<rect x="4" y="18" width="16" height="24" rx="3" fill="#fff0e0" stroke="#f0c8a0" stroke-width="2"/><path d="M12 18v-4" stroke="#3b2a2a" stroke-width="1.5"/><path class="flame" d="M12 14c-4-2-4-8 0-12 4 4 4 10 0 12z" fill="#ffb03a"/>'},
 basket:{n:'毛線籃',p:30,k:'f',c:'s',w:8,v:'0 0 44 34',s:'<path d="M4 14h36l-4 18H8z" fill="#c98a4b"/><path d="M6 20h32M8 26h28" stroke="#a8643a" stroke-width="1.5"/><circle cx="14" cy="11" r="7" fill="#ff7c9c"/><circle cx="26" cy="9" r="7" fill="#9b7be0"/><circle cx="34" cy="12" r="5" fill="#ffc94a"/>'},
 pillow:{n:'抱枕',p:25,k:'f',c:'s',w:8,v:'0 0 44 32',s:'<path d="M4 6q18-6 36 0 4 10 0 20-18 6-36 0-4-10 0-20z" fill="#ffd6a8"/><path d="M22 20c-3-2-5-4-5-6a2.5 2.5 0 0 1 5-1 2.5 2.5 0 0 1 5 1c0 2-2 4-5 6z" fill="#ff7c9c"/>'},
 duckie:{n:'小鴨玩偶',p:20,k:'f',c:'s',w:6,v:'0 0 40 34',s:'<ellipse cx="18" cy="24" rx="16" ry="9" fill="#ffd23f"/><circle cx="26" cy="12" r="9" fill="#ffd23f"/><path d="M34 12l7 2-7 3z" fill="#f59e2a"/><circle cx="28" cy="10" r="1.8" fill="#2e2320"/>'},
 books:{n:'書堆',p:20,k:'f',c:'s',w:7,v:'0 0 44 34',s:'<rect x="4" y="22" width="36" height="10" rx="2" fill="#7aa8ff"/><rect x="8" y="13" width="30" height="9" rx="2" fill="#ff9fb4"/><rect x="6" y="4" width="32" height="9" rx="2" fill="#5fc9ae" transform="rotate(-4 22 8)"/>'},
 cake:{n:'草莓蛋糕',p:35,k:'f',c:'s',w:7,v:'0 0 40 40',s:'<rect x="4" y="18" width="32" height="18" rx="4" fill="#fff6ea"/><rect x="4" y="24" width="32" height="4" fill="#ff9fb4"/><path d="M4 20q4-6 8 0t8 0 8 0 8 0" fill="#fff" stroke="#f0d0c0"/><circle cx="20" cy="12" r="5" fill="#e8304a"/><path d="M20 7l2-3" stroke="#5fb04a" stroke-width="2"/>'},
 ac:{n:'冷氣機',p:200,k:'w',c:'w',w:20,v:'0 0 100 40',cool:1,s:'<rect x="2" y="2" width="96" height="30" rx="8" fill="#fafcff" stroke="#cfe0ec" stroke-width="2.5"/><path d="M10 24h80" stroke="#cfe0ec" stroke-width="2"/><circle cx="84" cy="11" r="2.5" fill="#5fc9ae"/><path class="wind" d="M20 34q6 6 0 12M40 34q6 6 0 12M60 34q6 6 0 12" stroke="#bfe6ff" stroke-width="2.5" fill="none"/>'},
 wreath:{n:'花圈',p:45,k:'w',c:'w',w:10,v:'0 0 50 50',s:'<circle cx="25" cy="25" r="17" fill="none" stroke="#5fb04a" stroke-width="9"/><g fill="#ff7c9c"><circle cx="12" cy="18" r="3.5"/><circle cx="36" cy="14" r="3.5"/><circle cx="38" cy="34" r="3.5"/><circle cx="14" cy="36" r="3.5"/></g><path d="M20 44l5-6 5 6z" fill="#e8304a"/>'},
 photos:{n:'照片牆',p:60,k:'w',c:'w',w:16,v:'0 0 84 52',s:'<path d="M2 8q40 8 80 0" stroke="#8a6f68" stroke-width="1.5" fill="none"/><g><rect x="6" y="10" width="20" height="24" fill="#fff" stroke="#e0d0c0"/><rect x="9" y="13" width="14" height="14" fill="#ffd6a8"/></g><g transform="rotate(4 42 26)"><rect x="32" y="12" width="20" height="24" fill="#fff" stroke="#e0d0c0"/><rect x="35" y="15" width="14" height="14" fill="#bfe6f2"/></g><g transform="rotate(-3 68 24)"><rect x="58" y="10" width="20" height="24" fill="#fff" stroke="#e0d0c0"/><rect x="61" y="13" width="14" height="14" fill="#d9f3e8"/></g>'},
 windchime:{n:'風鈴',p:35,k:'w',c:'w',w:6,v:'0 0 30 64',s:'<path d="M15 0v10" stroke="#8a6f68"/><path d="M4 22a11 11 0 0 1 22 0z" fill="#bfe6ff" stroke="#7ac8f0"/><path d="M15 22v20" stroke="#8a6f68"/><rect x="9" y="42" width="12" height="18" rx="2" fill="#fff6c8" stroke="#e8c870"/>'},
 bunting:{n:'彩旗',p:40,k:'w',c:'w',w:26,v:'0 0 120 30',s:`<path d="M2 4q58 14 116 0" stroke="#8a6f68" stroke-width="1.5" fill="none"/>${[0,1,2,3,4,5,6].map(i=>`<path d="M${6+i*16} ${5+Math.sin(i/6*Math.PI)*6}l7 16 7-16z" fill="${['#ff9fb4','#ffd23f','#7ac8f0','#9fd3c4','#b58cff','#ff9fb4','#ffd23f'][i]}"/>`).join('')}`},
 moonlamp:{n:'月亮燈',p:55,k:'w',c:'w',w:9,v:'0 0 44 44',s:'<circle cx="22" cy="22" r="20" fill="#fff6c8" opacity=".5"/><path d="M28 6a16 16 0 1 0 10 28A13 13 0 0 1 28 6z" fill="#ffe08a"/><circle cx="20" cy="26" r="2" fill="#f0c860"/>'},
 mirror:{n:'圓鏡',p:50,k:'w',c:'w',w:9,v:'0 0 44 54',s:'<ellipse cx="22" cy="27" rx="18" ry="23" fill="#e6f6ff" stroke="#c9a070" stroke-width="4"/><path d="M14 16q4-6 10-6" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>'},
 starlights:{n:'星星燈串',p:45,k:'w',c:'w',w:26,v:'0 0 120 26',s:`<path d="M2 4q58 16 116 0" stroke="#8a6f68" stroke-width="1.2" fill="none"/>${[0,1,2,3,4,5,6,7].map(i=>{const x=8+i*15,y=6+Math.sin(i/7*Math.PI)*7;return `<path d="M${x} ${y}l2 4 4 .5-3 3 1 4-4-2-4 2 1-4-3-3 4-.5z" fill="${['#ffd23f','#ff9fb4','#7ac8f0','#fff6a0'][i%4]}"/>`}).join('')}`}});
for(const [k,c] of Object.entries(CAT_OF))if(FURN[k])FURN[k].c=c;
Object.assign(WALLS,{polka:{n:'糖果圓點',p:90,bg:'#fff0f5',c2:'#ffd6e4',dot:'#ff9fbd',t:'polka'},heart:{n:'小愛心',p:110,bg:'#ffeef2',c2:'#ffd6e0',dot:'#ff7c9c',t:'heart'},brick:{n:'紅磚牆',p:130,bg:'#e8a088',c2:'#d98a72',dot:'#f6cbbb',t:'brick'},wave:{n:'海洋波浪',p:120,bg:'#e3f4ff',c2:'#bfe2f7',dot:'#8cc8ee',t:'wave'},lemon:{n:'檸檬格子',p:90,bg:'#fffbe0',c2:'#fff1a8',dot:'#ffd23f',t:'check'}});
Object.assign(FLOORS,{marble:{n:'大理石',p:120,c:'#f6f4f2',c2:'#dcd6d0',t:'marble'},tatami:{n:'榻榻米',p:100,c:'#dcd49a',c2:'#bfb46e',t:'tatami'},pinkwood:{n:'粉紅木地板',p:90,c:'#f4c6c6',c2:'#e6aeae',t:'plank'},bluetile:{n:'藍白磁磚',p:90,c:'#eef6fc',c2:'#cfe3f3',t:'check'}});
Object.assign(RUGS,{heartrug:{n:'愛心地毯',p:80,c:'#ff9fb4',t:'heart'},cloud:{n:'雲朵地毯',p:80,c:'#ffffff',t:'cloud'},mint:{n:'薄荷圓毯',p:50,c:'#9fd3c4',t:'ring'}});
const _wp=wallPattern;wallPattern=function(w){const W=WALLS[w];if(!W||!['polka','heart','brick','wave'].includes(W.t))return _wp(w);const b=W.bg,c=W.c2,d=W.dot;
 const body={polka:`<circle cx="7" cy="7" r="3.2" fill="${d}"/><circle cx="21" cy="21" r="3.2" fill="${d}"/><circle cx="21" cy="7" r="1.5" fill="${c}"/>`,
  heart:`<path d="M14 20c-5-3-8-6-8-9a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 3-3 6-8 9z" fill="${d}" opacity=".8"/><circle cx="3" cy="3" r="1.4" fill="${c}"/>`,
  brick:`<rect width="28" height="28" fill="${c}"/><rect x="1" y="1" width="26" height="12" rx="1" fill="${b}"/><rect x="-13" y="15" width="26" height="12" rx="1" fill="${b}"/><rect x="15" y="15" width="26" height="12" rx="1" fill="${b}"/>`,
  wave:`<path d="M0 10q7-6 14 0t14 0M0 22q7-6 14 0t14 0" stroke="${d}" stroke-width="2.5" fill="none"/>`}[W.t];
 return `<pattern id="wp" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="${b}"/>${body}</pattern>`};
const _fl=floorSvg;floorSvg=function(f){const F=FLOORS[f];if(!F||!['marble','tatami'].includes(F.t))return _fl(f);let s=`<rect x="0" y="222" width="400" height="78" fill="${F.c}"/>`;
 if(F.t==='marble')s+=`<g stroke="${F.c2}" stroke-width="1.5" fill="none">${[[20,236,90,250],[140,230,220,262],[260,244,360,236],[60,276,160,290],[240,282,340,270]].map(([a,b,c,d])=>`<path d="M${a} ${b}q${(c-a)/2} ${(d-b)-10} ${c-a} ${d-b}"/>`).join('')}</g><g stroke="#ffffff" stroke-width="2">${[100,200,300].map(x=>`<path d="M${x} 222v78"/>`).join('')}<path d="M0 261h400"/></g>`;
 if(F.t==='tatami')s+=`<g stroke="${F.c2}" stroke-width="2">${[0,80,160,240,320].map(x=>`<rect x="${x+2}" y="224" width="76" height="36" fill="none"/><rect x="${x+42}" y="262" width="76" height="36" fill="none"/>`).join('')}</g>`;
 return s};
const _rg=rugSvg;rugSvg=function(r){const R=RUGS[r];if(!R||!['heart','cloud'].includes(R.t))return _rg(r);
 if(R.t==='heart')return `<path d="M200 292c-60-14-110-30-110-46a22 14 0 0 1 110-8 22 14 0 0 1 110 8c0 16-50 32-110 46z" fill="${R.c}"/><path d="M200 284c-44-10-84-22-84-34" stroke="#fff" stroke-opacity=".5" stroke-width="3" fill="none" stroke-dasharray="3 6"/>`;
 return `<g fill="${R.c}" stroke="#e6eef6" stroke-width="3"><ellipse cx="170" cy="270" rx="70" ry="16"/><ellipse cx="240" cy="266" rx="60" ry="15"/><ellipse cx="205" cy="276" rx="86" ry="14"/></g>`};

// ---------- 每個房間都能佈置（餐廳、浴室、遊戲室各自存家具） ----------
if(!S.roomDecor)S.roomDecor={dining:{items:[]},bath:{items:[]},play:{items:[]}};
['dining','bath','play'].forEach(k=>{if(!S.roomDecor[k])S.roomDecor[k]={items:[]}});
document.head.insertAdjacentHTML('beforeend',`<style>
.stage[data-room] #furnL{display:block!important}
.fu .flame{animation:flame .5s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}
@keyframes flame{to{transform:scaleY(.86) scaleX(1.05)}}
.fu .wind{animation:wind 1.4s ease-in-out infinite;opacity:0}.stage.acon .fu .wind{opacity:1}
@keyframes wind{50%{transform:translateY(3px)}}
.pencil{position:absolute;left:8px;bottom:8px;z-index:8;width:40px;height:40px;opacity:.92;min-height:0;padding:0;border-radius:50%;background:light-dark(#ffffffee,#2a2030ee);box-shadow:0 6px 14px -8px #0006;display:flex;align-items:center;justify-content:center}
.pencil svg{width:22px;height:22px}
.navarrow{position:absolute;top:50%;translate:0 -50%;z-index:7;width:34px;height:54px;min-height:0;padding:0;border-radius:14px;background:light-dark(#ffffffb0,#2a2030b0);display:flex;align-items:center;justify-content:center;opacity:.85}
.navarrow svg{width:18px;height:18px}.navarrow.l{left:6px}.navarrow.r{right:6px}
body.act .navarrow.r{right:104px}
@media(min-width:761px){body.act .navarrow.r{right:138px}}
.navarrow small{position:absolute;bottom:-18px;font-size:11px;white-space:nowrap;color:var(--ink);background:light-dark(#ffffffcc,#2a2030cc);border-radius:8px;padding:0 4px}
body.deco #petsL,body.deco #messL,body.deco .pencil,body.deco .navarrow,body.deco .affhud,body.deco .rail,body.deco .statpop,body.deco #bubble,body.deco .roompick,body.deco .fab,body.deco .wxchip,body.deco .toss,body.deco .emote{visibility:hidden!important}
body.deco .stage{outline:4px dashed var(--berry);outline-offset:-4px}
.decobar{position:fixed;left:0;right:0;bottom:0;z-index:12;background:var(--card);border-radius:24px 24px 0 0;box-shadow:0 -12px 30px -14px #7a3a1a88;padding:10px 0 calc(10px + env(safe-area-inset-bottom));display:none}
body.deco .decobar{display:block}
.decobar .dtop{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 14px 8px}
.decobar .dtop b{font:18px "Huninn",sans-serif;font-weight:400}
.decobar .dtop button{min-height:38px;padding:4px 16px}
.dtabs{display:flex;gap:6px;overflow-x:auto;padding:0 14px 8px;scrollbar-width:none}.dtabs::-webkit-scrollbar{display:none}
.dtabs button{flex:none;min-height:34px;padding:4px 14px;font-size:14px;border-radius:99px;background:transparent;border:2px solid var(--line)}
.dtabs button[aria-pressed=true]{border-color:var(--berry);color:var(--berry);font-weight:700}
.dstrip{display:flex;gap:10px;overflow-x:auto;padding:2px 14px 4px;scroll-snap-type:x proximity;overscroll-behavior-x:contain}
.dcard{flex:0 0 104px;scroll-snap-align:start;background:var(--bg);border-radius:16px;padding:6px;display:flex;flex-direction:column;align-items:center;gap:3px;font-size:13px;border:2px solid transparent;text-align:center;min-height:0}
.dcard.on{border-color:var(--mint)}
.dcard .pv{width:100%;height:58px;display:flex;align-items:center;justify-content:center}.dcard .pv svg{max-width:100%;max-height:58px;width:auto;height:58px}
.dcard em{font-style:normal;font-size:12px;color:var(--mute);display:flex;align-items:center;gap:2px}
.dcard em.buy{color:var(--berry);font-weight:700}
body.deco{padding-bottom:240px}
@media(max-width:760px){body.deco .stage{height:calc(100dvh - 300px)!important;min-height:220px!important;aspect-ratio:auto!important}}
</style>`);
const PENCIL='<svg viewBox="0 0 40 40"><path d="M8 32l2-8 18-18 6 6-18 18z" fill="#ffc94a" stroke="#c99a20" stroke-width="2"/><path d="M8 32l2-8 6 6z" fill="#f6d9b8"/><path d="M26 8l6 6" stroke="#e8507a" stroke-width="4"/></svg>';
$('stage').insertAdjacentHTML('beforeend',`<button type="button" class="pencil" id="pencil" aria-label="佈置這個房間">${PENCIL}</button>`);
document.body.insertAdjacentHTML('beforeend',`<div class="decobar" id="decoBar"><div class="dtop"><b id="dTitle">佈置房間</b><span class="small" id="dCoin"></span><button class="save" id="dDone">完成</button></div><div class="dtabs" id="dTabs"></div><div class="dstrip" id="dStrip"></div><p class="small" style="margin:6px 14px 0">點一下家具放進房間，拖曳可以移動位置，按 × 收起來。</p></div>`);
const curRoom=()=>typeof inRoom!=='undefined'&&inRoom?inRoom:null;
function curItems(){const r=curRoom();if(r){S.roomDecor[r]=S.roomDecor[r]||{items:[]};return S.roomDecor[r].items}return S.decor.items}
function renderCurFurn(){const r=curRoom();if(r){renderFurn($('furnL'),curItems().filter(i=>FURN[i.k]),true)}else{roomKey='';renderRoom(true)}applyAppliances()}
const _goRoomD=goRoom;goRoom=function(k,pets){_goRoomD(k,pets);setTimeout(()=>{if(curRoom()===k)renderCurFurn()},460)};
let decoOn=false,dTab='f';
const DTABS=[['f','家具'],['s','小物'],['w','掛飾'],['wall','壁紙'],['floor','地板'],['rug','地毯']];
function openDeco(){if(fight||busy)return;decoOn=true;document.body.classList.add('deco');$('stage').classList.add('editing');sfx('click');
 const r=curRoom();$('dTitle').textContent=`佈置${r?{dining:'餐廳',bath:'浴室',play:'遊戲室'}[r]:(S.rooms&&S.rooms[S.roomIdx]?.n||'客廳')}`;if(r&&!['f','s','w'].includes(dTab))dTab='f';renderDeco();
 requestAnimationFrame(()=>{const st=$('stage').getBoundingClientRect();if(st.top<0||st.top>80)scrollTo({top:Math.max(0,st.top+scrollY-8)})})}
function closeDeco(){decoOn=false;document.body.classList.remove('deco');$('stage').classList.remove('editing');save();renderCurFurn();say('新的佈置好漂亮，我好喜歡！');sfx('chime')}
function renderDeco(){const r=curRoom(),tabs=r?DTABS.slice(0,3):DTABS;$('dCoin').innerHTML=`${COIN(16)} ${S.coins}`;
 $('dTabs').innerHTML=tabs.map(([k,n])=>`<button type="button" data-t="${k}" aria-pressed="${dTab===k}">${n}</button>`).join('');
 const items=curItems();let list;
 if(['f','s','w'].includes(dTab))list=Object.entries(FURN).filter(([id,F])=>(F.c||'f')===dTab).map(([id,F])=>{const own=S.owned.furn.includes(id),placed=items.some(i=>i.k===id);
  return `<button type="button" class="dcard ${placed?'on':''}" data-f="${id}"><span class="pv">${furnSvg(id)}</span>${F.n}<em class="${own?'':'buy'}">${own?(placed?'已擺放・點收起':'擺放'):`${COIN(13)} ${F.p}`}</em></button>`});
 else{const cat=dTab==='wall'?WALLS:dTab==='floor'?FLOORS:RUGS;list=Object.entries(cat).map(([id,it])=>{const own=S.owned[dTab].includes(id),on=S.decor[dTab]===id;
  return `<button type="button" class="dcard ${on?'on':''}" data-d="${id}"><span class="pv">${decorPreview(dTab,id)}</span>${it.n}<em class="${own?'':'buy'}">${own?(on?'使用中':'換上'):`${COIN(13)} ${it.p}`}</em></button>`})}
 $('dStrip').innerHTML=list.join('')}
$('pencil').onclick=e=>{e.stopPropagation();openDeco()};$('pencil').addEventListener('pointerdown',e=>e.stopPropagation());
$('dDone').onclick=closeDeco;
$('dTabs').onclick=e=>{const b=e.target.closest('[data-t]');if(!b)return;dTab=b.dataset.t;sfx('click');renderDeco();$('dStrip').scrollLeft=0};
function buy(price,name){if(S.coins<price){toast('金幣不夠喔，再多陪寵物玩一下吧！');sfx('squeak');return false}S.coins-=price;sfx('gift');toast(`買了「${name}」！`);return true}
$('dStrip').onclick=e=>{const b=e.target.closest('.dcard');if(!b)return;const items=curItems();
 if(b.dataset.f){const id=b.dataset.f,F=FURN[id];if(!S.owned.furn.includes(id)){if(!buy(F.p,F.n))return;S.owned.furn.push(id)}
  const i=items.findIndex(x=>x.k===id);if(i>=0){items.splice(i,1);sfx('pop')}else{items.push({k:id,x:30+Math.random()*40,y:F.k==='w'?16+Math.random()*10:4+Math.random()*10});sfx('click')}}
 if(b.dataset.d){const id=b.dataset.d,cat=dTab==='wall'?WALLS:dTab==='floor'?FLOORS:RUGS;if(!S.owned[dTab].includes(id)){if(!buy(cat[id].p,cat[id].n))return;S.owned[dTab].push(id)}S.decor[dTab]=id;sfx('click')}
 save();renderCurFurn();renderDeco()};
// 拖曳家具（佈置模式）
{let drag=null;const st=$('stage');
 $('furnL').addEventListener('pointerdown',e=>{if(!decoOn)return;const rm=e.target.closest('[data-rm]');if(rm){e.preventDefault();curItems().splice(+rm.dataset.rm,1);save();renderCurFurn();renderDeco();sfx('pop');return}
  const f=e.target.closest('.fu');if(!f)return;e.preventDefault();const it=curItems()[+f.dataset.i];if(!it)return;drag={f,it,sx:e.clientX,sy:e.clientY,ox:it.x,oy:it.y};f.setPointerCapture(e.pointerId)});
 $('furnL').addEventListener('pointermove',e=>{if(!drag||!decoOn)return;const r=st.getBoundingClientRect(),F=FURN[drag.it.k];
  drag.it.x=Math.max(3,Math.min(97,drag.ox+(e.clientX-drag.sx)/r.width*100));const dy=(e.clientY-drag.sy)/r.height*100;
  drag.it.y=F.k==='w'?Math.max(2,Math.min(48,drag.oy+dy)):Math.max(0,Math.min(28,drag.oy-dy));drag.f.style.left=drag.it.x+'%';drag.f.style[F.k==='w'?'top':'bottom']=drag.it.y+'%'});
 $('furnL').addEventListener('pointerup',()=>{if(drag){drag=null;save()}})}
// 冷氣、暖氣家具：有沒有擺在家裡（任何房間）
function hasAppliance(kind){const all=[...(S.decor.items||[]),...Object.values(S.roomDecor||{}).flatMap(r=>r.items||[]),...(S.rooms||[]).flatMap(r=>(r.decor&&r.decor.items)||[])];return all.some(i=>FURN[i.k]&&FURN[i.k][kind])}
function applyAppliances(){$('stage').classList.toggle('acon',!!(S.climate&&S.climate.mode==='cool'))}

// ---------- 選單：拿掉餐廳、浴室、遊戲室和佈置房間 ----------
const _rmD=renderMenu;renderMenu=function(){_rmD();document.querySelectorAll('#menuGrid [data-view=dining],#menuGrid [data-view=bath],#menuGrid [data-view=play],#menuGrid [data-extra=shop]').forEach(b=>b.remove())};

// ---------- 左右滑動換房間：客廳 → 餐廳 → 浴室 → 遊戲室 ----------
const ORDER=['home','dining','bath','play'],ONAME={home:'客廳',dining:'餐廳',bath:'浴室',play:'遊戲室'};
const CHEV=d=>`<svg viewBox="0 0 20 20"><path d="${d==='l'?'M13 4 7 10l6 6':'M7 4l6 6-6 6'}" stroke="currentColor" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
$('stage').insertAdjacentHTML('beforeend',`<button type="button" class="navarrow l" id="navL" aria-label="上一間">${CHEV('l')}<small></small></button><button type="button" class="navarrow r" id="navR" aria-label="下一間">${CHEV('r')}<small></small></button>`);
function navUpdate(){const i=ORDER.indexOf(view);const show=i>=0&&P();$('navL').hidden=!show||i<=0;$('navR').hidden=!show||i>=ORDER.length-1;
 if(show){$('navL').querySelector('small').textContent=i>0?ONAME[ORDER[i-1]]:'';$('navR').querySelector('small').textContent=i<ORDER.length-1?ONAME[ORDER[i+1]]:''}}
function navGo(d){if(decoOn||fight||busy)return;const i=ORDER.indexOf(view);if(i<0)return;const j=i+d;if(j<0||j>=ORDER.length){animEl($('stage'),'shake',300);return}setView(ORDER[j])}
['navL','navR'].forEach((id,k)=>{$(id).onclick=e=>{e.stopPropagation();navGo(k?1:-1)};$(id).addEventListener('pointerdown',e=>e.stopPropagation())});
{const st=$('stage');let s=null;const skip=t=>t.closest('.pw,.toss,.rail,.fu,.roompick,.pencil,.navarrow,button,.mess');
 st.addEventListener('touchstart',e=>{if(decoOn||e.touches.length!==1||skip(e.target)){s=null;return}s={x:e.touches[0].clientX,y:e.touches[0].clientY,t:Date.now()}},{passive:true});
 st.addEventListener('touchend',e=>{if(!s)return;const t=e.changedTouches[0],dx=t.clientX-s.x,dy=t.clientY-s.y;if(Math.abs(dx)>60&&Math.abs(dy)<60&&Date.now()-s.t<800)navGo(dx<0?1:-1);s=null},{passive:true});
 let m=null;st.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||decoOn||skip(e.target)){m=null;return}m={x:e.clientX,y:e.clientY}});
 st.addEventListener('pointerup',e=>{if(!m)return;const dx=e.clientX-m.x,dy=e.clientY-m.y;if(Math.abs(dx)>80&&Math.abs(dy)<60)navGo(dx<0?1:-1);m=null})}
const _apD=applyView;applyView=function(){_apD();navUpdate()};
navUpdate();renderCurFurn();
