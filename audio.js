// ===== 可愛音樂與音效（Web Audio 即時合成，原創旋律） =====
const Snd=(()=>{
 let ctx=null,music=null,sfxBus=null,timer=null,step=0,nextT=0,cur=null,want=null;
 let pref={music:true,sfx:true};try{Object.assign(pref,JSON.parse(localStorage.getItem('petAudio'))||{})}catch(e){}
 const savePref=()=>{try{localStorage.setItem('petAudio',JSON.stringify(pref))}catch(e){}};
 const F=n=>440*Math.pow(2,(n-69)/12);
 // 每格是八分音符；0 為休止
 const TR={
  room:{bpm:92,bell:true,
   mel:[72,0,76,79,77,76,74,0,72,74,76,72,74,0,67,0,76,0,79,81,79,77,76,0,74,76,77,74,72,0,0,0,
        69,72,76,0,74,72,71,0,72,76,79,0,77,76,74,0,76,77,79,81,79,76,72,74,76,74,71,74,72,0,0,0],
   bass:[48,55,52,55,53,57,55,59,48,55,52,55,53,55,48,0,45,52,48,52,53,57,55,59,48,55,53,57,55,59,48,0]},
  game:{bpm:138,bell:false,
   mel:[72,76,79,76,81,79,76,0,74,77,81,77,79,0,79,0,76,79,84,79,81,79,77,76,74,76,77,79,72,0,72,0],
   bass:[48,55,53,57,55,59,48,55,48,55,53,57,55,59,48,48]},
  title:{bpm:84,bell:true,
   mel:[79,0,76,0,77,79,81,0,79,77,76,74,72,0,0,0,74,0,76,77,79,0,84,0,83,81,79,77,79,0,0,0],
   bass:[48,52,53,57,48,55,48,0,50,53,55,59,48,55,48,0]}};
 function init(){if(ctx)return true;const A=window.AudioContext||window.webkitAudioContext;if(!A)return false;
  try{ctx=new A();const m=ctx.createGain();m.gain.value=.9;m.connect(ctx.destination);
   music=ctx.createGain();music.gain.value=pref.music?.2:0;music.connect(m);sfxBus=ctx.createGain();sfxBus.gain.value=pref.sfx?.45:0;sfxBus.connect(m)}catch(e){ctx=null;return false}
  return true}
 function tone(f,t,d,type,g,dest,slide){const o=ctx.createOscillator(),a=ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+d);
  a.gain.setValueAtTime(0,t);a.gain.linearRampToValueAtTime(g,t+.012);a.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(a);a.connect(dest);o.start(t);o.stop(t+d+.05)}
 function tick(){if(!ctx||!cur)return;const T=TR[cur],dt=60/T.bpm/2;
  while(nextT<ctx.currentTime+.2){const i=step%T.mel.length,n=T.mel[i];
   if(n){if(T.bell){tone(F(n),nextT,.7,'sine',.22,music);tone(F(n+12),nextT,.35,'sine',.06,music);tone(F(n+19),nextT,.18,'triangle',.02,music)}
    else{tone(F(n),nextT,.22,'square',.06,music);tone(F(n),nextT,.25,'triangle',.14,music)}}
   if(i%2===0){const b=T.bass[(i/2)%T.bass.length];if(b)tone(F(b),nextT,T.bell?.5:.2,'triangle',.16,music)}
   if(!T.bell&&i%4===2)tone(2200,nextT,.04,'square',.015,music);
   nextT+=dt;step++}}
 function play(name){want=name;if(!init()||!pref.music)return;if(ctx.state==='suspended')ctx.resume();if(cur===name&&timer)return;
  cur=name;step=0;nextT=ctx.currentTime+.08;clearInterval(timer);timer=setInterval(tick,40);tick()}
 function stop(){clearInterval(timer);timer=null;cur=null}
 const FX={
  click:t=>tone(880,t,.08,'sine',.2,sfxBus,1200),
  squeak:t=>{tone(900,t,.12,'sine',.25,sfxBus,1500);tone(1300,t+.1,.12,'sine',.2,sfxBus,1700)},
  heart:t=>{tone(988,t,.15,'sine',.22,sfxBus);tone(1319,t+.09,.25,'sine',.2,sfxBus)},
  eat:t=>{for(let k=0;k<4;k++)tone(500-k*40,t+k*.13,.09,'triangle',.25,sfxBus,300-k*20)},
  pop:t=>tone(500,t,.1,'sine',.3,sfxBus,1300),
  jump:t=>tone(380,t,.16,'triangle',.25,sfxBus,820),
  coin:t=>{tone(1319,t,.07,'square',.08,sfxBus);tone(1760,t+.06,.14,'square',.08,sfxBus)},
  hit:t=>tone(260,t,.25,'sawtooth',.14,sfxBus,90),
  swoosh:t=>tone(300,t,.2,'triangle',.18,sfxBus,1200),
  win:t=>[72,76,79,84].forEach((n,k)=>tone(F(n),t+k*.11,.35,'triangle',.25,sfxBus)),
  lose:t=>[67,64,60].forEach((n,k)=>tone(F(n),t+k*.16,.35,'triangle',.22,sfxBus)),
  level:t=>[72,76,79,84,88].forEach((n,k)=>{tone(F(n),t+k*.09,.4,'sine',.25,sfxBus);tone(F(n+12),t+k*.09,.2,'sine',.08,sfxBus)}),
  tune:t=>[79,81,79,76,77,76,72].forEach((n,k)=>tone(F(n),t+k*.16,.3,'sine',.25,sfxBus)),
  drum:t=>{tone(150,t,.15,'sine',.4,sfxBus,60);tone(150,t+.25,.15,'sine',.4,sfxBus,60);tone(200,t+.4,.12,'sine',.35,sfxBus,80)},
  bubble:t=>{for(let k=0;k<5;k++)tone(600+Math.random()*700,t+k*.12,.08,'sine',.18,sfxBus,1400)},
  chime:t=>[84,88,91].forEach((n,k)=>tone(F(n),t+k*.08,.5,'sine',.15,sfxBus)),
  lullaby:t=>[79,76,72,74,71,67].forEach((n,k)=>{tone(F(n),t+k*.35,.8,'sine',.2,sfxBus);tone(F(n-12),t+k*.35,.6,'sine',.06,sfxBus)}),
  splash:t=>{for(let k=0;k<8;k++)tone(1200+Math.random()*1500,t+k*.07,.05,'sine',.1,sfxBus,600)},
  gift:t=>[72,79,84,88,91].forEach((n,k)=>tone(F(n),t+k*.07,.4,'triangle',.2,sfxBus)),
  breathe:t=>tone(F(60),t,3.6,'sine',.12,sfxBus,F(67))};
 function sfx(n){if(!pref.sfx||!init())return;if(ctx.state==='suspended')ctx.resume();try{FX[n]&&FX[n](ctx.currentTime+.01)}catch(e){}}
 function setMusic(v){pref.music=v;savePref();if(!init())return;music.gain.value=v?.2:0;if(v&&want)play(want);if(!v)stop()}
 function setSfx(v){pref.sfx=v;savePref();if(init())sfxBus.gain.value=v?.45:0}
 return{play,stop,sfx,setMusic,setSfx,pref,init}})();
const sfx=n=>Snd.sfx(n);
