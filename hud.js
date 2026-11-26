// ===== 手機版：房間上方的即時友好度進度條 =====
document.head.insertAdjacentHTML('beforeend',`<style>
.affhud{display:none}
@media(max-width:760px){
 .affhud{display:grid;grid-template-columns:auto auto minmax(0,1fr) auto;align-items:center;gap:6px;position:absolute;top:10px;right:10px;z-index:8;width:min(58%,230px);background:light-dark(#ffffffec,#2a2030ec);border-radius:99px;padding:5px 10px 5px 8px;box-shadow:0 6px 14px -8px #0006;font-size:12px;pointer-events:none}
 body.act .affhud{right:auto;left:50%;translate:-50% 0;top:8px}
 body.act .roomtag{top:46px}
 .stage .bubble{top:44px!important}
 body.act .stage .bubble{top:84px!important;max-width:62%}
 body.act .statpop{top:auto;bottom:12px;left:10px;max-width:56%}
 body.act .stage .bubble{left:42%!important}
 .affhud svg{width:16px;height:16px}
 .affhud .lv{font:700 12px "Huninn",sans-serif;color:var(--berry);white-space:nowrap}
 .affhud .bar{height:9px;margin:0;border-radius:9px;background:var(--line);overflow:hidden;position:relative}
 .affhud .bar i{display:block;height:100%;width:0;border-radius:9px;background:var(--berry) linear-gradient(#ffffff70,#ffffff00 60%);transition:width .8s cubic-bezier(.3,1.2,.5,1)}
 .affhud b{font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap}
 .affhud.bump{animation:hudbump .6s cubic-bezier(.3,1.6,.6,1)}
 .affhud.bump .bar i{box-shadow:0 0 8px var(--berry)}
 @keyframes hudbump{40%{transform:scale(1.08)}}
 .affhud .plus{position:absolute;right:10px;top:-4px;font:700 14px "Huninn",sans-serif;color:var(--berry);animation:hudplus 1.1s ease-out forwards}
 @keyframes hudplus{to{transform:translateY(-22px);opacity:0}}
}
</style>`);
{const h=document.createElement('div');h.className='affhud';h.id='affHud';h.setAttribute('aria-label','友好度');
 h.innerHTML='<svg viewBox="0 0 26 24"><path d="M13 23S1 15 1 7a6 6 0 0 1 12-2 6 6 0 0 1 12 2c0 8-12 16-12 16z" fill="#e8507a"/></svg><span class="lv" id="hudLv"></span><span class="bar"><i id="hudBar"></i></span><b id="hudNum"></b>';
 $('stage').append(h)}
let hudLast={id:null,aff:null};
function renderHud(){const p=P(),h=$('affHud');if(!p){h.hidden=true;return}h.hidden=false;
 const lv=Math.floor(p.aff/100),rem=p.aff%100;$('hudLv').textContent=`Lv.${lv+1}`;$('hudBar').style.width=rem+'%';$('hudNum').textContent=`${rem}/100`;
 h.title=`${p.name}：${LV[Math.min(lv,LV.length-1)]}`;
 if(hudLast.id===p.id&&hudLast.aff!=null&&p.aff>hudLast.aff){const d=p.aff-hudLast.aff;h.classList.remove('bump');void h.offsetWidth;h.classList.add('bump');
  const s=document.createElement('span');s.className='plus';s.textContent='+'+d;h.append(s);setTimeout(()=>s.remove(),1100)}
 hudLast={id:p.id,aff:p.aff}}
const _renderH=render;render=function(){_renderH();renderHud()};
renderHud();
