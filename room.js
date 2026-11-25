// ===== 房間佈置：壁紙、地板、地毯、家具（可用金幣購買） =====
const WALLS={
 peach:{n:'蜜桃條紋',p:0,bg:'#ffe4cf',c2:'#ffdcc6',dot:'#ffc9a8',t:'stripe'},
 mint:{n:'薄荷格紋',p:80,bg:'#e6f6ef',c2:'#d3efe3',dot:'#9fd8c2',t:'check'},
 sky:{n:'天空雲朵',p:100,bg:'#dcefff',c2:'#ffffff',dot:'#bfe2f5',t:'cloud'},
 lav:{n:'薰衣草小花',p:100,bg:'#f1e8fb',c2:'#e6d9f8',dot:'#c3a6ee',t:'flower'},
 star:{n:'夜空星星',p:150,bg:'#3d3d72',c2:'#36366a',dot:'#ffe9a0',t:'star'},
 wood:{n:'原木牆板',p:120,bg:'#ecd0aa',c2:'#e2c49a',dot:'#c9a070',t:'plank'}};
const FLOORS={
 wood:{n:'木頭地板',p:0,c:'#f4b48f',c2:'#e8a47e',t:'plank'},
 tile:{n:'奶油磁磚',p:80,c:'#f6efe8',c2:'#e6d8cc',t:'check'},
 carpet:{n:'粉嫩地毯',p:80,c:'#f0cdd6',c2:'#e6bcc8',t:'plain'},
 grass:{n:'室內草皮',p:120,c:'#a9d98c',c2:'#93c978',t:'grass'}};
const RUGS={
 pink:{n:'粉紅毛線毯',p:0,c:'#f7a3b5',t:'knit'},
 blue:{n:'藍色圓毯',p:50,c:'#9fc8f0',t:'ring'},
 paw:{n:'腳印地墊',p:70,c:'#f3d9a0',t:'paw'},
 rainbow:{n:'彩虹地毯',p:90,c:'#ffb3a8',t:'rainbow'},
 none:{n:'不要地毯',p:0,c:'#000000',t:'none'}};
// 家具：f=地上（bottom 定位） w=牆上（top 定位）；w%=寬度佔房間比例
const FURN={
 plant:{n:'大盆栽',p:30,k:'f',w:10,v:'0 0 50 70',s:'<path d="M25 46C8 38 4 18 12 6c6 14 12 24 13 40zM25 46c16-10 24-28 16-40-8 12-14 24-16 40zM25 46c-4-14-2-30 4-40 4 14 2 28-4 40z" fill="#5fb08a"/><path d="M10 44h30l-4 26H14z" fill="#e98a5a"/><rect x="8" y="42" width="34" height="7" rx="3" fill="#d4774a"/>'},
 lamp:{n:'落地燈',p:40,k:'f',w:8,v:'0 0 40 110',s:'<circle class="glow" cx="20" cy="22" r="40" fill="url(#lampglow)"/><path d="M20 30v74" stroke="#8a6f68" stroke-width="3"/><ellipse cx="20" cy="105" rx="12" ry="4" fill="#8a6f68"/><path d="M4 30h32l-8-24H12z" fill="#ffe0a8"/><path d="M4 30h32" stroke="#e8b878" stroke-width="2"/>'},
 shelf:{n:'書架層板',p:40,k:'w',w:26,v:'0 0 104 42',s:'<rect x="0" y="34" width="104" height="7" rx="3" fill="#c98a4b"/><rect x="6" y="10" width="9" height="24" rx="2" fill="#7aa8ff"/><rect x="16" y="14" width="8" height="20" rx="2" fill="#ffc94a"/><rect x="25" y="8" width="10" height="26" rx="2" fill="#5fc9ae" transform="rotate(8 30 34)"/><rect x="50" y="6" width="26" height="28" rx="3" fill="#fff" stroke="#c98a4b" stroke-width="3"/><path d="M63 26c-5-3-8-6-8-9a3 3 0 0 1 8-1 3 3 0 0 1 8 1c0 3-3 6-8 9z" fill="#ff7c9c"/><path d="M90 34h12l-2-10h-8z" fill="#e98a5a"/><path d="M96 24c-6-6-6-14-2-18 2 6 4 10 2 18zm0 0c6-6 10-10 8-16-6 4-8 10-8 16z" fill="#5fb04a"/>'},
 sofa:{n:'小沙發',p:120,k:'f',w:30,v:'0 0 120 64',s:'<rect x="10" y="8" width="100" height="34" rx="14" fill="#f4a0b4"/><rect x="0" y="26" width="22" height="30" rx="10" fill="#e88aa0"/><rect x="98" y="26" width="22" height="30" rx="10" fill="#e88aa0"/><rect x="16" y="32" width="88" height="22" rx="8" fill="#ffb8c8"/><path d="M60 34v18" stroke="#e88aa0" stroke-width="2"/><rect x="14" y="54" width="6" height="10" fill="#c98a4b"/><rect x="100" y="54" width="6" height="10" fill="#c98a4b"/><circle cx="34" cy="22" r="7" fill="#ffd6a8"/>'},
 bed:{n:'寵物小床',p:80,k:'f',w:20,v:'0 0 90 44',s:'<ellipse cx="45" cy="30" rx="44" ry="14" fill="#9fc8f0"/><ellipse cx="45" cy="26" rx="34" ry="9" fill="#e6f2ff"/><path d="M8 28q37 22 74 0" stroke="#7aa8e0" stroke-width="3" fill="none"/><path d="M30 24q15-6 30 0" stroke="#bcd8f6" stroke-width="3" fill="none"/>'},
 tower:{n:'貓跳台',p:150,k:'f',w:15,v:'0 0 60 130',s:'<rect x="26" y="20" width="9" height="104" fill="#e8d0a8"/><path d="M26 30h9M26 44h9M26 58h9M26 72h9M26 86h9M26 100h9" stroke="#c9a070" stroke-width="2"/><rect x="4" y="12" width="44" height="10" rx="4" fill="#c98a4b"/><rect x="20" y="60" width="38" height="9" rx="4" fill="#c98a4b"/><rect x="2" y="120" width="56" height="10" rx="4" fill="#a8643a"/><circle cx="8" cy="30" r="5" fill="#ff7c9c"/><path d="M8 22v3" stroke="#8a6f68"/>'},
 tank:{n:'魚缸',p:140,k:'f',w:17,v:'0 0 70 76',s:'<rect x="4" y="50" width="62" height="26" rx="3" fill="#c98a4b"/><rect x="2" y="4" width="66" height="46" rx="6" fill="#bfe6f7" stroke="#e6f6ff" stroke-width="3"/><rect x="2" y="36" width="66" height="14" fill="#e3c99a"/><path d="M14 36c-4-10 0-18 4-22-2 8 2 14-4 22zM56 36c4-8 2-16-2-20 0 8-4 12 2 20z" fill="#5fb04a"/><g class="fish"><path d="M30 20c6-6 14-6 18 0-4 6-12 6-18 0z" fill="#ff8a5a"/><path d="M30 20l-6-5v10z" fill="#ff8a5a"/></g><circle cx="44" cy="12" r="2" fill="#fff"/><circle cx="48" cy="7" r="1.5" fill="#fff"/>'},
 toybox:{n:'玩具箱',p:60,k:'f',w:14,v:'0 0 60 50',s:'<rect x="4" y="16" width="52" height="34" rx="5" fill="#ffc94a"/><rect x="2" y="12" width="56" height="9" rx="3" fill="#f0a93a"/><circle cx="16" cy="10" r="7" fill="#ff7c9c"/><rect x="30" y="2" width="10" height="12" rx="2" fill="#7aa8ff"/><path d="M22 32h16" stroke="#fff" stroke-width="4" stroke-linecap="round"/>'},
 piano:{n:'小鋼琴',p:200,k:'f',w:24,v:'0 0 100 80',s:'<rect x="6" y="4" width="88" height="56" rx="6" fill="#4a3a4a"/><rect x="2" y="40" width="96" height="10" rx="3" fill="#3a2a3a"/><rect x="8" y="40" width="84" height="7" fill="#fff"/><path d="M14 40v7M20 40v7M26 40v7M32 40v7M38 40v7M44 40v7M50 40v7M56 40v7M62 40v7M68 40v7M74 40v7M80 40v7M86 40v7" stroke="#ccc"/><g fill="#222"><rect x="16" y="40" width="3" height="4"/><rect x="22" y="40" width="3" height="4"/><rect x="34" y="40" width="3" height="4"/><rect x="40" y="40" width="3" height="4"/><rect x="46" y="40" width="3" height="4"/></g><rect x="10" y="50" width="6" height="30" fill="#3a2a3a"/><rect x="84" y="50" width="6" height="30" fill="#3a2a3a"/><text x="38" y="26" font-size="16" fill="#ffd23f">♪♫</text>'},
 xmas:{n:'聖誕樹',p:180,k:'f',w:16,v:'0 0 70 100',s:'<path d="M35 4 8 44h12L4 70h20L8 90h54L46 70h20L50 44h12z" fill="#4fae6a"/><rect x="29" y="88" width="12" height="12" fill="#a8643a"/><path d="M35 0l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z" fill="#ffd23f"/><g><circle cx="26" cy="40" r="3" fill="#ff7c9c"/><circle cx="44" cy="54" r="3" fill="#7aa8ff"/><circle cx="22" cy="66" r="3" fill="#ffc94a"/><circle cx="48" cy="78" r="3" fill="#ff7c9c"/><circle cx="34" cy="72" r="3" fill="#fff"/></g>'},
 painting:{n:'小掛畫',p:50,k:'w',w:14,v:'0 0 60 50',s:'<rect x="2" y="2" width="56" height="46" rx="3" fill="#c98a4b"/><rect x="7" y="7" width="46" height="36" fill="#dff1fb"/><path d="M7 43l14-16 10 10 8-8 14 14z" fill="#7cc48a"/><circle cx="42" cy="16" r="5" fill="#ffd23f"/>'},
 clock:{n:'圓圓時鐘',p:45,k:'w',w:9,v:'0 0 40 40',s:'<circle cx="20" cy="20" r="18" fill="#fff" stroke="#ff9fb4" stroke-width="4"/><path d="M20 20V9M20 20l8 4" stroke="#3b2a2a" stroke-width="2.5" stroke-linecap="round"/><circle cx="20" cy="20" r="2" fill="#3b2a2a"/>'},
 balloons:{n:'氣球串',p:35,k:'f',w:10,v:'0 0 50 120',s:'<path d="M25 118C24 90 14 70 14 50M25 118c0-30 6-50 12-72M25 118c0-30 0-50 0-80" stroke="#8a6f68" stroke-width="1.2" fill="none"/><ellipse cx="14" cy="38" rx="11" ry="13" fill="#ff7c9c"/><ellipse cx="37" cy="34" rx="11" ry="13" fill="#7aa8ff"/><ellipse cx="25" cy="18" rx="11" ry="13" fill="#ffc94a"/>'},
 cactus:{n:'仙人掌',p:25,k:'f',w:7,v:'0 0 30 50',s:'<path d="M15 34V8a5 5 0 0 1 10 0v26zM15 22h-5a4 4 0 0 1-4-4v-6" stroke="#6ab86a" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M5 32h22l-3 18H8z" fill="#ff9fb4"/><circle cx="20" cy="4" r="3" fill="#ff7c9c"/>'}};
const DEFAULT_DECOR={wall:'peach',floor:'wood',rug:'pink',items:[{k:'shelf',x:4,y:32},{k:'plant',x:5,y:14},{k:'lamp',x:88,y:16}]};

function wallPattern(w){const W=WALLS[w]||WALLS.peach,b=W.bg,c=W.c2,d=W.dot;
 const body={stripe:`<rect width="14" height="28" fill="${c}"/><circle cx="21" cy="8" r="1.6" fill="${d}"/><path d="M5 20l2-2 2 2-2 2z" fill="${d}"/>`,
  check:`<rect width="14" height="14" fill="${c}"/><rect x="14" y="14" width="14" height="14" fill="${c}"/><circle cx="21" cy="7" r="1.5" fill="${d}"/>`,
  cloud:`<g fill="${c}" opacity=".9"><ellipse cx="10" cy="12" rx="7" ry="4"/><ellipse cx="15" cy="10" rx="5" ry="4"/></g><circle cx="23" cy="23" r="1.2" fill="${d}"/>`,
  flower:`<g fill="${d}"><circle cx="9" cy="7" r="2.4"/><circle cx="13" cy="9" r="2.4"/><circle cx="11" cy="13" r="2.4"/><circle cx="7" cy="11" r="2.4"/></g><circle cx="10" cy="10" r="1.6" fill="#ffe08a"/><circle cx="22" cy="22" r="1.2" fill="${d}"/>`,
  star:`<path d="M8 4l1.5 3 3.3.5-2.4 2.3.6 3.3L8 11.5 5 13.1l.6-3.3L3.2 7.5l3.3-.5z" fill="${d}"/><circle cx="21" cy="19" r="1" fill="#fff"/><circle cx="17" cy="25" r=".8" fill="#fff"/>`,
  plank:`<rect x="13" width="2" height="28" fill="${c}"/><circle cx="6" cy="20" r="1.2" fill="${d}"/>`}[W.t];
 return `<pattern id="wp" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="${b}"/>${body}</pattern>`}
function floorSvg(f){const F=FLOORS[f]||FLOORS.wood;let s=`<rect x="0" y="222" width="400" height="78" fill="${F.c}"/>`;
 if(F.t==='plank')s+=`<g stroke="#00000014" stroke-width="2">${[244,268,292].map(y=>`<path d="M0 ${y}h400"/>`).join('')}${[[80,222],[230,222],[150,246],[320,246],[60,270],[270,270]].map(([x,y])=>`<path d="M${x} ${y}v22"/>`).join('')}</g>`;
 if(F.t==='check')for(let y=222,r=0;y<300;y+=26,r++)for(let x=(r%2)*26;x<400;x+=52)s+=`<rect x="${x}" y="${y}" width="26" height="26" fill="${F.c2}"/>`;
 if(F.t==='plain')s+=`<g fill="${F.c2}">${Array.from({length:40},(_,i)=>`<circle cx="${(i*53)%400}" cy="${230+(i*37)%66}" r="1.4"/>`).join('')}</g>`;
 if(F.t==='grass')s+=`<g stroke="${F.c2}" stroke-width="2" stroke-linecap="round">${Array.from({length:60},(_,i)=>{const x=(i*67)%400,y=230+(i*29)%66;return `<path d="M${x} ${y}l-2-6M${x+3} ${y}l2-7"/>`}).join('')}</g>`;
 return s}
function rugSvg(r){const R=RUGS[r]||RUGS.pink;if(R.t==='none')return '';
 if(R.t==='rainbow')return ['#ffb3a8','#ffd59a','#fff0a0','#bfe8b0','#a8d4f5','#c9b4f0'].map((c,i)=>`<ellipse cx="200" cy="268" rx="${136-i*16}" ry="${22-i*2.6}" fill="${c}"/>`).join('');
 let s=`<ellipse cx="200" cy="268" rx="136" ry="22" fill="${R.c}"/>`;
 if(R.t==='knit')s+=`<ellipse cx="200" cy="268" rx="136" ry="22" fill="url(#knit)"/><ellipse cx="200" cy="268" rx="112" ry="16" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-dasharray="2 6"/>`;
 if(R.t==='ring')s+=`<ellipse cx="200" cy="268" rx="110" ry="17" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="4"/><ellipse cx="200" cy="268" rx="70" ry="10" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="4"/>`;
 if(R.t==='paw')s+=`<g fill="#e0b870">${[[120,266],[170,276],[230,262],[280,274]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="6" ry="4"/><circle cx="${x-6}" cy="${y-6}" r="2"/><circle cx="${x}" cy="${y-8}" r="2"/><circle cx="${x+6}" cy="${y-6}" r="2"/>`).join('')}</g>`;
 return s}
function sceneSvg(d){const W=WALLS[d.wall]||WALLS.peach,wain=mix(W.bg,'#c08060',.16),trim=mix(W.bg,'#a06040',.32);
 const bulbs=Array.from({length:15},(_,i)=>{const x=25+i*25;return `<circle cx="${x}" cy="${16+(x%100===50?11:x%100===25||x%100===75?2:0)}" r="3.6" fill="${['#ffc94a','#ff9fb4','#9fd3c4','#b9a0ff'][i%4]}" style="animation-delay:${(i*.37).toFixed(2)}s"/>`}).join('');
 return `<defs>${wallPattern(d.wall)}
 <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sky1)"/><stop offset="1" style="stop-color:var(--sky2)"/></linearGradient>
 <pattern id="knit" width="10" height="6" patternUnits="userSpaceOnUse"><path d="M0 3q2.5-3 5 0t5 0" stroke="#fff" stroke-opacity=".25" fill="none"/></pattern></defs>
 <rect width="400" height="300" fill="url(#wp)"/>
 <rect y="196" width="400" height="26" fill="${wain}"/><rect y="194" width="400" height="4" fill="${trim}"/>
 <g class="win"><rect x="276" y="50" width="96" height="84" rx="12" fill="url(#sky)"/>
  <g class="sun"><circle cx="344" cy="76" r="11" fill="#fff3b0"/><circle cx="344" cy="76" r="17" fill="#fff3b0" opacity=".3"/></g>
  <g class="moon"><circle cx="342" cy="74" r="10" fill="#fff3c4"/><circle cx="347" cy="70" r="9" style="fill:var(--sky1)"/><g fill="#fff"><circle cx="296" cy="66" r="1.4"/><circle cx="312" cy="88" r="1.1"/><circle cx="360" cy="104" r="1.3"/><circle cx="300" cy="112" r="1"/></g></g>
  <g class="cloud" fill="#fff" opacity=".85"><ellipse cx="300" cy="100" rx="14" ry="6"/><ellipse cx="310" cy="96" rx="9" ry="6"/></g>
  <path d="M324 50v84M276 92h96" stroke="#fff" stroke-width="5"/><rect x="276" y="50" width="96" height="84" rx="12" fill="none" stroke="#fff" stroke-width="6"/>
  <rect x="270" y="132" width="108" height="7" rx="3" fill="${trim}"/></g>
 <path d="M262 44q12 46 4 96l22-4q-10-40-6-92z" fill="#ff9fb4" opacity=".85"/><path d="M386 44q-12 46-4 96l-22-4q10-40 6-92z" fill="#ff9fb4" opacity=".85"/><rect x="256" y="40" width="136" height="6" rx="3" fill="#c98a4b"/>
 <path d="M0 16q50 22 100 4t100 4 100-4 100 4" fill="none" stroke="#8a6f68" stroke-width="1.4" opacity=".6"/><g class="bulbs">${bulbs}</g>
 ${floorSvg(d.floor)}${rugSvg(d.rug)}
 <rect class="dim" width="400" height="300" fill="#1d1b4a"/>`}
function furnSvg(k){const F=FURN[k];return `<svg viewBox="${F.v}" aria-hidden="true"><defs><radialGradient id="lampglow"><stop offset="0" stop-color="#ffd98a" stop-opacity=".9"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient></defs>${F.s}</svg>`}
function decorPreview(kind,id){
 if(kind==='wall')return `<svg viewBox="0 0 60 44"><defs>${wallPattern(id).replace('id="wp"',`id="pv-${id}"`)}</defs><rect width="60" height="44" rx="6" fill="url(#pv-${id})"/></svg>`;
 if(kind==='floor')return `<svg viewBox="0 222 140 78" preserveAspectRatio="xMidYMid slice">${floorSvg(id)}</svg>`;
 if(kind==='rug')return `<svg viewBox="60 240 280 56">${RUGS[id].t==='none'?'<text x="160" y="276" font-size="22" fill="#8a6f68">無</text>':rugSvg(id).replace(/url\(#knit\)/g,'none')}</svg>`;
 return furnSvg(id)}
