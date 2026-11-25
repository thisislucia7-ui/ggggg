// ===== 30 隻動物的繪製（SVG，viewBox 0 0 200 190） =====
const INK='#2e2320';
function mix(a,b,t){const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
const blush=(a,b,y)=>`<ellipse cx="${a}" cy="${y}" rx="11" ry="7" fill="#ff9fb4" opacity=".7"/><ellipse cx="${b}" cy="${y}" rx="11" ry="7" fill="#ff9fb4" opacity=".7"/>`;
function eyes(a,b,y,r,e,ring,dark){
 if(e==='happy')return `<path d="M${a-r-1} ${y+2}q${r+1}-${r*1.5} ${2*r+2} 0M${b-r-1} ${y+2}q${r+1}-${r*1.5} ${2*r+2} 0" fill="none" stroke="${dark?'#fff':INK}" stroke-width="${Math.max(3,r*.7)}" stroke-linecap="round"/>`;
 const one=x=>`<g class="blink">${ring?`<circle cx="${x}" cy="${y}" r="${r+3.5}" fill="${ring}" stroke="${INK}" stroke-width="1.5"/>`:''}<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x+r*.35}" cy="${y-r*.4}" r="${Math.max(1.4,r*.32)}" fill="#fff"/></g>`;
 let out=one(a)+one(b);
 if(e==='sad')out+=`<path d="M${a-r-4} ${y-r-4}l${2*r+6} -6M${b+r+4} ${y-r-4}l-${2*r+6} -6" stroke="${dark?'#fff':INK}" stroke-width="3" stroke-linecap="round"/><path class="tear" d="M${a-2} ${y+r+5}q-4 9 0 12q4-3 0-12z" fill="#6fb2f0"/>`;
 return out}
function mouth(x,y,w,e,col){const k=col||INK;
 if(e==='happy')return `<path d="M${x-w} ${y}q${w} ${w*1.3} ${2*w} 0z" fill="#d9536f" stroke="${k}" stroke-width="2.5" stroke-linejoin="round"/>`;
 if(e==='calm')return `<path d="M${x-w*.7} ${y+2}q${w*.7} ${w*.45} ${w*1.4} 0" fill="none" stroke="${k}" stroke-width="3.5" stroke-linecap="round"/>`;
 return `<path d="M${x-w*.7} ${y+6}q${w*.7}-${w*.8} ${w*1.4} 0" fill="none" stroke="${k}" stroke-width="3.5" stroke-linecap="round"/>`}

// 圓滾滾身體：貓、狗、兔、熊、鼠、豬、鳥、蛙共用，靠參數換耳朵、花紋、嘴巴
function blob(o,e){
 const c=o.c,sh=o.sh||mix(c,'#8a5a3a',.2),ec=o.ec||c,ei=o.ei||mix(c,'#ff9fb4',.55),pc=o.pc||'#3a3340';
 const ear={
  tri:`<g class="ear"><path d="M44 56 30 14 76 40z" fill="${ec}"/><path d="M45 46 39 26 60 40z" fill="${ei}"/></g><path d="M156 56 170 14 124 40z" fill="${ec}"/><path d="M155 46 161 26 140 40z" fill="${ei}"/>`,
  big:`<g class="ear"><path d="M42 64 22 6 84 40z" fill="${ec}"/><path d="M44 52 32 20 66 40z" fill="${ei}"/></g><path d="M158 64 178 6 116 40z" fill="${ec}"/><path d="M156 52 168 20 134 40z" fill="${ei}"/>`,
  fox:`<g class="ear"><path d="M42 64 24 4 84 40z" fill="${ec}"/><path d="M30 24 24 4 40 16z" fill="#3a2a2a"/><path d="M44 52 33 20 66 40z" fill="${ei}"/></g><path d="M158 64 176 4 116 40z" fill="${ec}"/><path d="M170 24 176 4 160 16z" fill="#3a2a2a"/><path d="M156 52 167 20 134 40z" fill="${ei}"/>`,
  round:`<g class="ear"><circle cx="50" cy="50" r="22" fill="${ec}"/><circle cx="50" cy="50" r="12" fill="${ei}"/></g><circle cx="150" cy="50" r="22" fill="${ec}"/><circle cx="150" cy="50" r="12" fill="${ei}"/>`,
  small:`<g class="ear"><circle cx="60" cy="42" r="14" fill="${ec}"/><circle cx="60" cy="42" r="7" fill="${ei}"/></g><circle cx="140" cy="42" r="14" fill="${ec}"/><circle cx="140" cy="42" r="7" fill="${ei}"/>`,
  long:`<g class="ear"><ellipse cx="72" cy="30" rx="15" ry="30" fill="${ec}" transform="rotate(-8 72 60)"/><ellipse cx="72" cy="32" rx="7" ry="22" fill="${ei}" transform="rotate(-8 72 60)"/></g><ellipse cx="128" cy="30" rx="15" ry="30" fill="${ec}" transform="rotate(8 128 60)"/><ellipse cx="128" cy="32" rx="7" ry="22" fill="${ei}" transform="rotate(8 128 60)"/>`,
  pig:`<g class="ear"><path d="M40 62 44 26 78 42z" fill="${ec}"/><path d="M48 54 50 34 68 44z" fill="${ei}"/></g><path d="M160 62 156 26 122 42z" fill="${ec}"/><path d="M152 54 150 34 132 44z" fill="${ei}"/>`,
  frog:`<circle cx="64" cy="52" r="26" fill="${c}"/><circle cx="136" cy="52" r="26" fill="${c}"/>`,
  sprout:`<path d="M100 34c-1-14 5-24 16-26-2 11-7 20-16 26z" fill="#7cc46a"/><path d="M100 34c-5-11-13-15-22-13 4 9 11 13 22 13z" fill="#5fb04a"/><path d="M100 34v-8" stroke="#4a9a40" stroke-width="2.5"/>`,
  tuft:`<path d="M98 34c-4-14 2-24 8-26-2 8 0 16-2 26zM104 34c4-12 14-16 20-14-6 4-10 10-14 16z" fill="${mix(c,'#f59e2a',.3)}"/>`,
  owl:`<path d="M40 52 34 14 72 36z" fill="${ec}"/><path d="M160 52 166 14 128 36z" fill="${ec}"/>`,
  none:''}[o.ear||'none'];
 const front={
  floppy:`<ellipse class="wave" cx="34" cy="88" rx="17" ry="34" fill="${ec}" transform="rotate(18 34 88)"/><ellipse cx="166" cy="88" rx="17" ry="34" fill="${ec}" transform="rotate(-18 166 88)"/>`,
  lop:`<ellipse class="wave" cx="30" cy="104" rx="17" ry="46" fill="${ec}" transform="rotate(10 30 104)"/><ellipse cx="170" cy="104" rx="17" ry="46" fill="${ec}" transform="rotate(-10 170 104)"/>`}[o.ear]||'';
 let pat='';
 if(o.pat==='tabby')pat=`<path d="M86 40v14M100 36v16M114 40v14" stroke="${pc}" stroke-width="6" stroke-linecap="round"/><path d="M22 120h14M164 120h14" stroke="${pc}" stroke-width="5" stroke-linecap="round"/>`;
 if(o.pat==='patch')pat=`<path d="M40 74c2-28 30-42 54-34-4 22-28 38-54 34z" fill="${pc}"/><path d="M126 40c24-4 44 14 46 38-22 4-42-12-46-38z" fill="${o.pc2}"/><ellipse cx="150" cy="150" rx="16" ry="12" fill="${pc}"/>`;
 if(o.pat==='spots')pat=[[58,66,8],[142,58,7],[156,128,9],[44,140,7],[122,156,6],[84,44,5],[168,96,5]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${pc}"/>`).join('');
 if(o.pat==='point')pat=`<ellipse cx="100" cy="114" rx="36" ry="28" fill="${pc}" opacity=".8"/>`;
 if(o.pat==='panda')pat=`<ellipse cx="72" cy="94" rx="15" ry="20" fill="#2e2a30" transform="rotate(30 72 94)"/><ellipse cx="128" cy="94" rx="15" ry="20" fill="#2e2a30" transform="rotate(-30 128 94)"/>`;
 if(o.pat==='curl')pat=`<g fill="${o.cc}"><circle cx="72" cy="40" r="17"/><circle cx="100" cy="30" r="19"/><circle cx="128" cy="40" r="17"/></g>`;
 if(o.pat==='speckle')pat=[[52,70],[70,52],[130,56],[150,74],[44,104],[158,110],[60,140],[146,146],[84,46],[116,44],[40,130],[164,132]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${1.6+(i%3)*.8}" fill="${pc}" opacity=".55"/>`).join('');
 let face='';
 if(o.face==='penguin')face=`<path d="M100 62c30-30 72 0 64 48-6 38-32 64-64 64s-58-26-64-64c-8-48 34-78 64-48z" fill="#fff"/>`;
 else if(o.face==='disc')face=`<circle cx="74" cy="92" r="24" fill="${o.fc}"/><circle cx="126" cy="92" r="24" fill="${o.fc}"/>`;
 else if(o.face)face=`<ellipse cx="100" cy="126" rx="60" ry="44" fill="${o.face}"/>`;
 if(o.face==='emperor')face=`<path d="M100 30c-46 0-76 34-82 78 16-22 40-32 82-32s66 10 82 32c-6-44-36-78-82-78z" fill="#2e2a30"/><ellipse cx="72" cy="98" rx="25" ry="21" fill="#fff"/><ellipse cx="128" cy="98" rx="25" ry="21" fill="#fff"/>`;
 if(o.belly)face+=`<ellipse cx="100" cy="148" rx="52" ry="30" fill="${o.belly}"/>`;
 if(o.cheek)face+=`<ellipse cx="50" cy="122" rx="24" ry="20" fill="${o.cheek}"/><ellipse cx="150" cy="122" rx="24" ry="20" fill="${o.cheek}"/>`;
 const ey=o.ear==='frog'?52:92,ea=o.ear==='frog'?64:74,eb=o.ear==='frog'?136:126,er=o.er||7;
 let sn='',my=110,mw=12;
 if(o.snout==='dog'){sn=`<ellipse cx="100" cy="120" rx="28" ry="19" fill="${o.sc||mix(c,'#ffffff',.5)}"/><ellipse cx="100" cy="108" rx="9" ry="6.5" fill="${INK}"/>`;my=122;mw=9}
 if(o.snout==='wombat'){sn=`<ellipse cx="100" cy="116" rx="21" ry="14" fill="#3a2e28"/><ellipse cx="93" cy="111" rx="5" ry="3" fill="#7a6a5e"/>`;my=136;mw=8}
 if(o.snout==='pig'){sn=`<ellipse cx="100" cy="114" rx="21" ry="15" fill="${mix(c,'#d0607a',.3)}"/><ellipse cx="93" cy="114" rx="3.5" ry="5.5" fill="#a0485a"/><ellipse cx="107" cy="114" rx="3.5" ry="5.5" fill="#a0485a"/>`;my=134;mw=8}
 let mo=mouth(100,my,mw,e);
 if(o.snout==='beak')mo=e==='happy'?`<path d="M88 106l12-5 12 5-12 6z" fill="${o.beak||'#f59e2a'}"/><path d="M91 111l9 10 9-10z" fill="#d9536f" stroke="#c86a1a" stroke-width="1.5"/>`:`<path d="M88 106l12-5 12 5-12 12z" fill="${o.beak||'#f59e2a'}"/>`;
 const wing=o.wing?`<ellipse class="wave" cx="26" cy="128" rx="14" ry="28" fill="${o.wing}" transform="rotate(24 26 128)"/><ellipse cx="174" cy="128" rx="14" ry="28" fill="${o.wing}" transform="rotate(-24 174 128)"/>`:'';
 const hood=o.hoodie?`<path d="M28 112c-6-52 30-88 72-88s78 36 72 88" fill="none" stroke="${o.hoodie}" stroke-width="18" stroke-linecap="round"/>`:'';
 const hoodie=o.hoodie?`<path d="M22 136c6 28 36 44 78 44s72-16 78-44c-14-12-42-18-78-18s-64 6-78 18z" fill="${o.hoodie}"/><path d="M20 128c-8 8-10 20-4 28 8-2 14-10 16-20zM180 128c8 8 10 20 4 28-8-2-14-10-16-20z" fill="${o.hoodie}"/><path d="M76 156h48v14q0 4-4 4H80q-4 0-4-4z" fill="${mix(o.hoodie,'#000000',.15)}"/><path d="M100 142c-4-3-7-5-7-8a3 3 0 0 1 7-1 3 3 0 0 1 7 1c0 3-3 5-7 8z" fill="#ff7c9c"/>`:'';
 const feet=o.paws?`<ellipse cx="70" cy="176" rx="20" ry="9" fill="${o.paws}"/><ellipse cx="130" cy="176" rx="20" ry="9" fill="${o.paws}"/>${o.claws?`<path d="M58 179l-2 6M66 181l-1 6M74 181l1 6M82 179l2 6M118 179l-2 6M126 181l-1 6M134 181l1 6M142 179l2 6" stroke="#3a2e28" stroke-width="2.5" stroke-linecap="round"/>`:''}`:o.feet?`<path d="M64 176h20M70 170v8M116 176h20M126 170v8" stroke="${o.feet}" stroke-width="6" stroke-linecap="round"/>`:`<ellipse cx="70" cy="176" rx="18" ry="8" fill="${sh}"/><ellipse cx="130" cy="176" rx="18" ry="8" fill="${sh}"/>`;
 const tail=o.tail?`<path class="wag" d="M164 140c18-4 26-22 22-38 10 10 14 32-4 46z" fill="${o.tail}"/>`:'';
 return `<ellipse cx="100" cy="182" rx="70" ry="8" fill="#000" opacity=".12"/>${hood}${tail}${ear}
 <path d="M100 30c52 0 84 42 84 92 0 40-34 60-84 60s-84-20-84-60c0-50 32-92 84-92z" fill="${c}"/>
 <path d="M30 140c6 26 34 38 70 38s64-12 70-38c-10 18-36 28-70 28s-60-10-70-28z" fill="${sh}"/>
 ${pat}${face}<path d="M58 54c10-10 26-14 40-14" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".7"/>
 ${hoodie}${front}${wing}${o.noBlush?'':blush(56,144,114)}${eyes(ea,eb,ey,er,e,o.ring,o.dark)}${sn}${mo}${feet}`}

function dino(o,e){const c=o.c,dk=mix(c,'#000000',.12),b=o.b||'#f4f0c9',d=o.d;
 return `<ellipse cx="100" cy="183" rx="72" ry="7" fill="#000" opacity=".12"/>
 <path class="wag" d="M150 150c22-2 38-14 44-34 4 14-4 40-40 50z" fill="${dk}"/>
 <ellipse cx="100" cy="148" rx="56" ry="36" fill="${mix(c,'#000000',.05)}"/><ellipse cx="100" cy="156" rx="34" ry="24" fill="${b}"/>
 <ellipse class="wave" cx="46" cy="138" rx="10" ry="16" fill="${mix(c,'#000000',.05)}" transform="rotate(30 46 138)"/><ellipse cx="154" cy="138" rx="10" ry="16" fill="${mix(c,'#000000',.05)}" transform="rotate(-30 154 138)"/>
 <ellipse cx="72" cy="180" rx="20" ry="8" fill="${dk}"/><ellipse cx="128" cy="180" rx="20" ry="8" fill="${dk}"/>
 <path d="M60 52c4-30 76-30 80 0z" fill="${dk}"/>
 <ellipse cx="100" cy="88" rx="74" ry="50" fill="${c}"/>
 <path d="M48 58c14-10 34-14 52-14" stroke="${mix(c,'#ffffff',.45)}" stroke-width="7" stroke-linecap="round" fill="none"/>
 <path d="M24 70c-14 4-14 26-2 34 6-10 6-24 2-34z" fill="${d}"/><path d="M176 78c14 4 14 26 2 34-6-10-6-24-2-34z" fill="${d}"/>
 <circle cx="88" cy="78" r="3" fill="${d}"/><circle cx="112" cy="78" r="3" fill="${d}"/>
 ${eyes(82,118,44,7,e,'#fff')}${blush(48,152,104)}
 ${e==='happy'?`<path d="M44 102q56 46 112 0q-56 26-112 0z" fill="#c9455f" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`:e==='calm'?`<path d="M44 104q56 18 112 0" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`:`<path d="M50 114q50-22 100 0" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`}`}

function whale(o,e){const c=o.c,dk=mix(c,'#000000',.12),b=o.b||'#f8f3ef';
 return `<ellipse cx="96" cy="182" rx="80" ry="7" fill="#000" opacity=".12"/>
 <g class="spout" fill="#8fd3f4"><circle cx="96" cy="30" r="5"/><circle cx="84" cy="20" r="4"/><circle cx="108" cy="18" r="4"/><circle cx="96" cy="10" r="3.5"/></g>
 <path class="wag" d="M160 120c14-6 22-24 34-30-2 14-6 22-14 28 10 2 16 10 18 22-14-6-26-8-38-6z" fill="${dk}"/>
 <path d="M18 120c0-46 36-78 86-78 44 0 66 32 66 70 0 40-34 62-80 62-44 0-72-20-72-54z" fill="${c}"/>
 <path d="M20 128c18 20 50 30 84 30 26 0 50-6 64-20-6 26-36 42-78 42-38 0-62-16-70-52z" fill="${b}"/>
 ${o.patch?`<ellipse cx="80" cy="92" rx="20" ry="10" fill="#fff" transform="rotate(-10 80 92)"/>`:''}
 <path d="M46 66c14-14 32-20 52-20" stroke="${mix(c,'#ffffff',.5)}" stroke-width="7" stroke-linecap="round" fill="none"/>
 <path class="wave" d="M92 140c-6 18 0 34 14 40 6-14 0-30-14-40z" fill="${dk}"/>
 ${eyes(58,92,104,6,e,o.ring,o.dark)}${blush(46,104,120)}${mouth(30,128,7,e)}`}

function longBunny(o,e){const c=o.c,dk=mix(c,'#b07a00',.15);
 return `<ellipse cx="100" cy="183" rx="58" ry="7" fill="#000" opacity=".12"/>
 <g class="ear"><rect x="58" y="8" width="26" height="40" rx="13" fill="${c}"/></g><rect x="116" y="8" width="26" height="40" rx="13" fill="${c}"/>
 <path class="wave" d="M60 96c-20 4-34 14-40 26 14 4 30-2 42-12z" fill="${dk}"/><path d="M140 96c20 4 34 14 40 26-14 4-30-2-42-12z" fill="${dk}"/>
 <path d="M56 40h88c8 0 14 6 14 14v120c0 6-4 9-9 9h-26c-5 0-8-3-8-8v-22h-30v22c0 5-3 8-8 8h-26c-5 0-9-3-9-9V54c0-8 6-14 14-14z" fill="${c}"/>
 <path d="M66 50c8-4 18-6 28-6" stroke="${mix(c,'#ffffff',.55)}" stroke-width="6" stroke-linecap="round" fill="none"/>
 <path d="M100 116v36" stroke="${dk}" stroke-width="2" stroke-dasharray="4 4"/>
 ${eyes(82,118,70,4.5,e)}${blush(72,128,82)}${mouth(100,78,6,e)}`}

function fishGuy(o,e){const c=o.c,dk=mix(c,'#000000',.18),lip=mix(c,'#000000',.08),pa=o.pants,sp=mix(pa,'#000000',.25);
 const mo=e==='happy'?`<path d="M78 82q22 36 44 0z" fill="#8a1f2a" stroke="${lip}" stroke-width="5" stroke-linejoin="round"/><path d="M90 96q10 8 20 0" fill="#e8607a"/>`
  :e==='calm'?`<ellipse cx="100" cy="94" rx="15" ry="18" fill="#8a1f2a" stroke="${lip}" stroke-width="7"/><path d="M90 104q10-6 20 0" fill="#c8405a"/>`
  :`<ellipse cx="100" cy="100" rx="11" ry="13" fill="#8a1f2a" stroke="${lip}" stroke-width="6"/>`;
 return `<g transform="translate(100 0) scale(1.32 1) translate(-100 0)"><ellipse cx="100" cy="184" rx="48" ry="6" fill="#000" opacity=".12"/>
 <rect x="80" y="146" width="15" height="26" rx="6" fill="${pa}"/><rect x="105" y="146" width="15" height="26" rx="6" fill="${pa}"/>
 <path d="M86 170l-12 12h22zM114 170l12 12h-22z" fill="#e4e4ea"/>
 <path d="M60 56q0-36 40-36t40 36v74H60z" fill="${c}"/>
 <path d="M66 46q6-18 22-22" stroke="${mix(c,'#ffffff',.45)}" stroke-width="6" stroke-linecap="round" fill="none"/>
 <path d="M58 114h84v22q0 22-22 22H80q-22 0-22-22z" fill="${pa}"/>
 <g fill="${sp}"><ellipse cx="72" cy="128" rx="9" ry="7"/><ellipse cx="102" cy="122" rx="8" ry="5"/><ellipse cx="130" cy="134" rx="9" ry="8"/><ellipse cx="88" cy="148" rx="7" ry="6"/><ellipse cx="120" cy="152" rx="6" ry="5"/></g>
 <path class="wave" d="M62 78c-18 2-28 16-24 30 10-2 20-14 24-30z" fill="${mix(c,'#ffffff',.12)}"/>
 <path d="M138 80c16 6 22 22 16 36-10-6-16-20-16-36z" fill="${mix(c,'#ffffff',.12)}"/>
 <ellipse cx="82" cy="32" rx="17" ry="15" fill="#fff3a8" stroke="${dk}" stroke-width="1.5"/><ellipse cx="118" cy="32" rx="17" ry="15" fill="#fff3a8" stroke="${dk}" stroke-width="1.5"/>
 ${eyes(84,116,32,5,e)}${blush(68,132,66)}${mo}</g>`}
const FAMS={cat:'貓咪',dog:'狗狗',small:'兔兔・小動物',bear:'熊熊',dino:'恐龍',sea:'海洋',bird:'鳥兒・青蛙'};
// [id, 預設名字, 品種名, 家族, 飼料組, 繪製, 參數]
const SPECIES=[
 ['dango','小團子','白色團子貓','cat','cat',blob,{c:'#fffaf3',sh:'#f3d9c4',ear:'tri',ei:'#ffb8c6'}],
 ['orange','橘子','橘貓','cat','cat',blob,{c:'#f6a54a',ear:'tri',pat:'tabby',pc:'#d97f22',face:'#fff1de',tail:'#e8913a'}],
 ['blackcat','煤球','黑貓','cat','cat',blob,{c:'#3a3340',sh:'#2a2430',ear:'tri',ei:'#ff9fb4',ring:'#f7e06a',dark:1}],
 ['calico','三三','三花貓','cat','cat',blob,{c:'#fffaf3',sh:'#f0dccb',ear:'tri',pat:'patch',pc:'#f2a04a',pc2:'#3a3340'}],
 ['siamese','奶茶','暹羅貓','cat','cat',blob,{c:'#f5ead8',ear:'tri',ec:'#6b4a3a',ei:'#8a6655',pat:'point',pc:'#6b4a3a',ring:'#9fd0ff'}],
 ['shiba','豆柴','柴犬','dog','dog',blob,{c:'#e8a05a',ear:'tri',ei:'#fff1de',face:'#fff6ea',snout:'dog',sc:'#fff6ea',tail:'#e8a05a'}],
 ['corgi','短短','柯基','dog','dog',blob,{c:'#f0a457',ear:'big',ei:'#ffd9c0',face:'#ffffff',snout:'dog',sc:'#ffffff'}],
 ['poodle','捲捲','貴賓狗','dog','dog',blob,{c:'#c8855a',ear:'floppy',ec:'#b5744c',pat:'curl',cc:'#d4956a',snout:'dog',sc:'#dba57e'}],
 ['husky','二哈','哈士奇','dog','dog',blob,{c:'#8c97a8',ear:'tri',ei:'#ffffff',face:'#ffffff',snout:'dog',sc:'#ffffff'}],
 ['dalmatian','點點','大麥町','dog','dog',blob,{c:'#ffffff',sh:'#e6e2dc',ear:'floppy',ec:'#3a3340',pat:'spots',pc:'#3a3340',snout:'dog',sc:'#f3eee8'}],
 ['fox','火火','狐狸','dog','dog',blob,{c:'#f08a3c',ear:'fox',ei:'#ffe0c4',face:'#fff6ea',snout:'dog',sc:'#fff6ea',tail:'#f08a3c'}],
 ['huanghuang','黃黃','長長抱枕兔','small','herb',longBunny,{c:'#f7d33a'}],
 ['lop','垂垂','垂耳兔','small','herb',blob,{c:'#e9d3b8',ear:'lop',ec:'#d8b994'}],
 ['whiterabbit','雪球','小白兔','small','herb',blob,{c:'#ffffff',sh:'#ece6e0',ear:'long',ei:'#ffb8c6'}],
 ['greyrabbit','灰灰','灰兔','small','herb',blob,{c:'#b7b2b8',ear:'long',ei:'#ffc8d4',face:'#e8e4e8'}],
 ['hamster','布丁','倉鼠','small','herb',blob,{c:'#f3c27c',ear:'small',ei:'#ffb8a8',face:'#fff6ea',cheek:'#fff6ea'}],
 ['pig','噗噗','小豬','small','herb',blob,{c:'#ffc2cf',ear:'pig',ei:'#ff9fb4'}],
 ['brownbear','可可','棕熊','bear','bear',blob,{c:'#a86d45',ear:'round',ei:'#d9a37a',snout:'dog',sc:'#e2c09c'}],
 ['panda','圓圓','熊貓','bear','bear',blob,{c:'#ffffff',sh:'#e6e2dc',ear:'round',ec:'#2e2a30',ei:'#2e2a30',pat:'panda',ring:'#fff',er:5,dark:1}],
 ['polar','冰冰','北極熊','bear','bear',blob,{c:'#f7f6f2',sh:'#e2ddd4',ear:'round',ei:'#e8dccd',snout:'dog',sc:'#ffffff'}],
 ['lvlv','綠綠','大鼻子綠恐龍','dino','dino',dino,{c:'#62d364',d:'#2f8f3a'}],
 ['pinkdino','莓莓','粉紅恐龍','dino','dino',dino,{c:'#ff9cc0',d:'#d9467a',b:'#fff0f4'}],
 ['purpledino','葡萄','紫色恐龍','dino','dino',dino,{c:'#b48cf2',d:'#6a45b8',b:'#f3ecff'}],
 ['lanlan','藍藍','藍鯨','sea','sea',whale,{c:'#4fb6e3'}],
 ['pinkwhale','桃桃','粉紅鯨','sea','sea',whale,{c:'#ff9eb8'}],
 ['orca','黑白','虎鯨','sea','sea',whale,{c:'#2f3440',b:'#ffffff',patch:1,ring:'#fff',dark:1}],
 ['chick','啾啾','小雞','bird','bird',blob,{c:'#ffe066',sh:'#f5c842',ear:'tuft',snout:'beak',wing:'#f5cf3c',feet:'#f59e2a'}],
 ['penguin','企企','企鵝','bird','bird',blob,{c:'#36404f',sh:'#2a323e',face:'penguin',snout:'beak',wing:'#2a323e',feet:'#f59e2a'}],
 ['owl','咕咕','貓頭鷹','bird','bird',blob,{c:'#b0805a',ear:'owl',ec:'#8a5f3e',face:'disc',fc:'#f3dcc0',snout:'beak',ring:'#fff8e0',er:8,wing:'#8a5f3e',feet:'#f59e2a',noBlush:1}],
 ['frog','呱呱','青蛙','bird','bird',blob,{c:'#8fd06a',sh:'#74b852',ear:'frog',ring:'#fff',face:'#e6f6c8'}],
 ['surprisefish','歐摸君','驚訝魚','sea','sea',fishGuy,{c:'#a9a9ad',pants:'#b8ec5c'}],
 ['hoodiefox','竹子狐','帽T狐狸','dog','dog',blob,{c:'#f0783c',ear:'fox',ei:'#ffffff',face:'#fff6ea',snout:'dog',sc:'#fff6ea',hoodie:'#2c3a5e'}],
 ['wombat','毛毛','澳洲袋熊','small','herb',blob,{c:'#8c7b6b',sh:'#6f5f50',ear:'small',ec:'#7a6a5a',ei:'#c99a6a',snout:'wombat',pat:'speckle',pc:'#4a3c30',paws:'#6a4a30',claws:1}],
 ['mochi','桃麻糬','粉紅麻糬','small','herb',blob,{c:'#ffb8c8',sh:'#f59ab2',ear:'sprout',wing:'#ffc8d4',paws:'#fff0f3'}],
 ['penguinchick','呆呆','企鵝寶寶','bird','sea',blob,{c:'#b4b4be',sh:'#9a9aa6',face:'emperor',belly:'#ffffff',snout:'beak',beak:'#2e2a30',wing:'#a2a2ae',paws:'#2e2a30',noBlush:0}]
];
const SP={};SPECIES.forEach(([id,n,breed,fam,grp,fn,o])=>SP[id]={id,n,breed,fam,grp,o,bg:mix(o.c,'#ffffff',.72),draw:e=>fn(o,e)});
function petSvg(sp,e){return (SP[sp]||SP.dango).draw(e||'happy')}

// ===== 飼料：每個家族各五種，第一種無限，其餘四種要靠小遊戲獲得 =====
const FOOD={
 cat:[['貓咪乾糧','kibble','#c98a4b'],['鮪魚罐頭','can','#7fb0d8'],['小魚乾','fish','#9ab8cf'],['雞肉條','meat','#e8a77a'],['貓草餅乾','cookie','#9fcf7a']],
 dog:[['狗狗乾糧','kibble','#b97a45'],['牛肉罐頭','can','#d36b5a'],['潔牙骨','bone','#f3e3c3'],['烤雞腿','drum','#d98c4a'],['起司塊','cheese','#f7d046']],
 herb:[['綜合牧草','grass','#9fcf6a'],['胡蘿蔔','carrot','#f28c38'],['蘋果片','apple','#ec5b5b'],['葵花子','seed','#6b5a4a'],['草莓','berry','#e8455f']],
 bear:[['雜糧餅乾','kibble','#c9955a'],['蜂蜜罐','jar','#f2b632'],['烤鮭魚','fish','#f28c6a'],['綜合莓果','berry','#8a5ad8'],['嫩竹筍','bamboo','#8cc860']],
 dino:[['恐龍飼料','kibble','#7bbf5a'],['大肉排','meat','#c8553f'],['蕨葉','leaf','#5aa84a'],['西瓜','melon','#ff6b7a'],['星星糖','star','#ffd23f']],
 sea:[['海洋飼料','kibble','#6ab0d8'],['磷蝦','shrimp','#ff8a6a'],['小魚群','fish','#9ad0e8'],['海帶','leaf','#4a8a5a'],['魷魚圈','ring','#f3d9a0']],
 bird:[['穀物飼料','kibble','#d9b46a'],['麵包蟲','worm','#e0b070'],['葵花子','seed','#6b5a4a'],['小米穗','grain','#f0cf6a'],['藍莓','berry','#5a78d8']]};
const TIER=[{f:15,a:3},{f:20,a:6},{f:25,a:8},{f:30,a:10},{f:35,a:14}];
const FI={
 kibble:c=>`<path d="M4 22h32l-4 12H8z" fill="#e8e0d8"/><path d="M4 22h32" stroke="#c9beb2" stroke-width="2"/><g fill="${c}"><circle cx="13" cy="19" r="5"/><circle cx="22" cy="17" r="5"/><circle cx="29" cy="20" r="4"/><circle cx="18" cy="21" r="4"/></g>`,
 can:c=>`<rect x="8" y="10" width="24" height="24" rx="4" fill="${c}"/><ellipse cx="20" cy="10" rx="12" ry="4" fill="#dde3ea"/><rect x="8" y="18" width="24" height="8" fill="#fff" opacity=".7"/>`,
 fish:c=>`<path d="M6 20c6-9 18-10 24 0-6 10-18 9-24 0z" fill="${c}"/><path d="M28 20l8-7v14z" fill="${c}"/><circle cx="12" cy="18" r="2" fill="${INK}"/>`,
 meat:c=>`<path d="M8 22c0-10 10-14 20-12s8 14 0 18-20 4-20-6z" fill="${c}"/><path d="M14 20c4-4 10-4 12 0" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/><circle cx="30" cy="28" r="4" fill="#f3e3c3"/>`,
 cookie:c=>`<circle cx="20" cy="20" r="14" fill="#e3b278"/><g fill="${c}"><circle cx="14" cy="16" r="3"/><circle cx="24" cy="14" r="2.5"/><circle cx="22" cy="25" r="3"/></g>`,
 bone:c=>`<path d="M10 14a4 4 0 1 1 4-4l12 12a4 4 0 1 1 4 4 4 4 0 1 1-4 4L14 18a4 4 0 1 1-4-4z" fill="${c}" stroke="#d8c8a8" stroke-width="1.5"/>`,
 drum:c=>`<ellipse cx="17" cy="17" rx="11" ry="9" fill="${c}" transform="rotate(-35 17 17)"/><path d="M24 24l8 8" stroke="#f3e3c3" stroke-width="4" stroke-linecap="round"/><circle cx="33" cy="33" r="3" fill="#f3e3c3"/>`,
 cheese:c=>`<path d="M6 28l26-14 2 14z" fill="${c}"/><path d="M6 28h28v4H6z" fill="${mix(c,'#000000',.12)}"/><circle cx="22" cy="23" r="2" fill="#e0b020"/>`,
 grass:c=>`<path d="M10 34c0-10-4-16-6-22 6 4 8 10 9 16 0-10 2-18 7-24-1 10 0 18 0 28 2-8 6-14 12-18-4 8-6 14-6 20z" fill="${c}"/>`,
 carrot:c=>`<path d="M14 14l16 6-18 16c-4-4-4-14 2-22z" fill="${c}"/><path d="M22 14c2-6 6-8 10-8-2 4-4 6-8 8zm-2-2c-2-6 0-8 2-10 0 4 0 6-2 10z" fill="#5fb04a"/>`,
 apple:c=>`<path d="M20 12c8-4 16 2 14 12s-8 12-14 10c-6 2-12-2-14-10s6-16 14-12z" fill="${c}"/><path d="M20 12c0-4 2-6 4-8" stroke="#6b4a2a" stroke-width="2"/><path d="M22 8c4-2 8 0 8 0-2 3-6 3-8 0z" fill="#5fb04a"/>`,
 seed:c=>`<g fill="${c}"><ellipse cx="14" cy="20" rx="5" ry="9" transform="rotate(-20 14 20)"/><ellipse cx="26" cy="20" rx="5" ry="9" transform="rotate(20 26 20)"/></g><path d="M14 14v10M26 14v10" stroke="#fff" stroke-width="1.5" opacity=".7"/>`,
 berry:c=>`<g fill="${c}"><circle cx="14" cy="22" r="7"/><circle cx="26" cy="22" r="7"/><circle cx="20" cy="13" r="7"/></g><circle cx="17" cy="11" r="2" fill="#fff" opacity=".6"/>`,
 jar:c=>`<rect x="9" y="12" width="22" height="22" rx="6" fill="${c}"/><rect x="11" y="6" width="18" height="7" rx="2" fill="#c98a4b"/><rect x="13" y="19" width="14" height="8" rx="2" fill="#fff" opacity=".7"/>`,
 bamboo:c=>`<rect x="15" y="6" width="10" height="30" rx="4" fill="${c}"/><path d="M15 16h10M15 26h10" stroke="${mix(c,'#000000',.2)}" stroke-width="2"/><path d="M25 12c6-4 10-2 10-2-4 4-8 4-10 2z" fill="#5fb04a"/>`,
 leaf:c=>`<path d="M8 32C8 16 18 6 34 6c0 16-10 26-26 26z" fill="${c}"/><path d="M8 32 28 12" stroke="#fff" stroke-width="2" opacity=".6"/>`,
 melon:c=>`<path d="M4 16h32a16 16 0 0 1-32 0z" fill="#5fb04a"/><path d="M7 16h26a13 13 0 0 1-26 0z" fill="${c}"/><g fill="${INK}"><circle cx="14" cy="21" r="1.5"/><circle cx="20" cy="24" r="1.5"/><circle cx="26" cy="21" r="1.5"/></g>`,
 star:c=>`<path d="M20 4l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" fill="${c}"/>`,
 shrimp:c=>`<path d="M30 12c-12-6-24 4-20 14 2 6 10 8 14 4" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"/><path d="M24 30l6 4-2-7z" fill="${c}"/>`,
 ring:c=>`<circle cx="20" cy="20" r="12" fill="none" stroke="${c}" stroke-width="7"/><circle cx="20" cy="20" r="12" fill="none" stroke="#e0b878" stroke-width="2" stroke-dasharray="3 4"/>`,
 worm:c=>`<path d="M6 26c4-8 8 4 12-4s8 4 12-4" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/><circle cx="31" cy="17" r="1.5" fill="${INK}"/>`,
 grain:c=>`<path d="M20 36V8" stroke="#a88a4a" stroke-width="2"/><g fill="${c}">${[10,15,20,25].map(y=>`<ellipse cx="15" cy="${y}" rx="4" ry="3"/><ellipse cx="25" cy="${y}" rx="4" ry="3"/>`).join('')}</g>`};
function foodIcon(grp,i,s){const f=FOOD[grp][i];return `<svg width="${s||28}" height="${s||28}" viewBox="0 0 40 40" aria-hidden="true">${FI[f[1]](f[2])}</svg>`}
const STAR=s=>`<svg width="${s}" height="${s}" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3l5.5 11 12 1.8-8.7 8.4 2 12L20 30.6 9.2 36.2l2-12L2.5 15.8l12-1.8z" fill="#ffc94a" stroke="#e0a020" stroke-width="2" stroke-linejoin="round"/></svg>`;
