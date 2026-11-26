// ===== 寵物立體動作：遠近大小、走路彈跳、3D 轉身、呼吸與張望 =====
document.head.insertAdjacentHTML('beforeend',`<style>
#petsL .pw{scale:var(--dz,1);transition:left 2.6s ease-in-out,bottom 2.6s ease-in-out,scale 2.6s ease-in-out;perspective:520px;filter:brightness(var(--db,1))}
#petsL .pw.dash{transition:left .55s ease-in-out,bottom .55s ease-in-out,scale .55s ease-in-out!important}
#petsL .pw .pet{transition:rotate .5s cubic-bezier(.4,1.6,.5,1);transform-origin:50% 100%;animation:idle3 3.2s ease-in-out infinite}
#petsL .pw.flip .pet{scale:1 1;rotate:y 180deg}
#petsL .pw.look .pet{rotate:y 28deg}#petsL .pw.flip.look .pet{rotate:y 152deg}
#petsL .pw.walking .pet{animation:walk3 .42s ease-in-out infinite!important}
#petsL .pw.dash.walking .pet{animation-duration:.26s!important}
#petsL .pw::before{content:"";position:absolute;left:18%;right:18%;bottom:-2px;height:9%;border-radius:50%;background:radial-gradient(#5a3a2a40,transparent 70%);transition:transform .2s;z-index:-1}
#petsL .pw.walking::before{animation:shadow3 .42s ease-in-out infinite}
@keyframes idle3{0%,100%{transform:scale(1,1)}45%{transform:scale(1.025,.975) translateY(1px)}55%{transform:scale(1.02,.98)}}
@keyframes walk3{0%,100%{transform:translateY(0) rotate(-3deg) scale(1.02,.98)}25%{transform:translateY(-7%) rotate(0deg) scale(.98,1.03)}50%{transform:translateY(0) rotate(3deg) scale(1.03,.97)}75%{transform:translateY(-6%) rotate(0deg) scale(.98,1.03)}}
@keyframes shadow3{25%,75%{transform:scale(.82)}}
#petsL .pw .pet.nap{animation:none}
@media(prefers-reduced-motion:reduce){#petsL .pw .pet{animation:none!important}}
</style>`);
// 位置越下面（越靠近鏡頭）越大，越上面越小、稍暗
const depthOf=y=>({sc:Math.max(.78,1.08-(y||0)*.016),br:Math.max(.9,1-(y||0)*.004)});
const _place3=place;place=function(w,pos){const old=parseFloat(w.style.left);_place3(w,pos);if(!w.closest||!w.closest('#petsL'))return;
 const d=depthOf(pos.y);w.style.setProperty('--dz',d.sc.toFixed(3));w.style.setProperty('--db',d.br.toFixed(3));
 if(!isNaN(old)&&Math.abs(pos.x-old)>1.2){w.classList.toggle('flip',pos.x<old);w.classList.remove('look');w.classList.add('walking');clearTimeout(w._wt);
  w._wt=setTimeout(()=>w.classList.remove('walking'),w.classList.contains('dash')||w.classList.contains('come')?600:2600)}};
// 偶爾轉頭張望
setInterval(()=>{if(document.hidden)return;document.querySelectorAll('#petsL .pw:not(.walking):not(.asleep)').forEach(w=>{if(Math.random()<.25){w.classList.add('look');setTimeout(()=>w.classList.remove('look'),1200+Math.random()*1200)}})},2500);
// 現有寵物套用遠近
document.querySelectorAll('#petsL .pw').forEach(w=>{const y=parseFloat(w.style.bottom)||8,d=depthOf(y);w.style.setProperty('--dz',d.sc.toFixed(3));w.style.setProperty('--db',d.br.toFixed(3))});
const _sync3=syncPets;syncPets=function(){_sync3();document.querySelectorAll('#petsL .pw').forEach(w=>{if(!w.style.getPropertyValue('--dz')){const d=depthOf(parseFloat(w.style.bottom)||8);w.style.setProperty('--dz',d.sc.toFixed(3))}})};
