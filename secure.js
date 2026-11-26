// ===== 帳號安全：強密碼、電子郵件驗證、登入失敗鎖定、帳號安全中心（改密碼、刪除帳號） =====
document.head.insertAdjacentHTML('beforeend',`<style>
.pwm{height:6px;border-radius:99px;background:var(--line);overflow:hidden;margin:-2px 0 2px}.pwm i{display:block;height:100%;width:0;transition:width .2s,background .2s}
.sec{display:flex;flex-direction:column;gap:10px}
.sec .card{background:var(--bg);border-radius:16px;padding:10px 12px}
.sec .card h3{margin:0 0 4px;font-size:16px}.sec .card p{margin:2px 0;font-size:14px}
.sec .ok{color:#2a9a5c;font-weight:700}.sec .no{color:#d8304a;font-weight:700}
.vbanner{position:fixed;left:50%;translate:-50% 0;bottom:calc(84px + env(safe-area-inset-bottom));z-index:30;width:min(92vw,420px);background:#fff3c8;color:#6a4a00;border-radius:16px;padding:8px 12px;font-size:13px;box-shadow:0 10px 24px -14px #0008;display:flex;gap:8px;align-items:center}
.vbanner button{min-height:32px;padding:2px 10px;font-size:13px;flex:none}
</style>`);
// ---------- 註冊：強密碼 ----------
function pwScore(p){let s=0;if(p.length>=8)s++;if(p.length>=12)s++;if(/[a-z]/i.test(p)&&/\d/.test(p))s++;if(/[^a-z0-9]/i.test(p))s++;if(/[A-Z]/.test(p)&&/[a-z]/.test(p))s++;return Math.min(4,s)}
function pwProblem(p,email){if(p.length<8)return '密碼至少要 8 個字';if(!/[a-z]/i.test(p)||!/\d/.test(p))return '密碼要同時有英文字母和數字';
 if(/^(.)\1+$/.test(p)||/^(12345678|password|qwerty)/i.test(p))return '這個密碼太好猜了，換一個吧';const name=String(email||'').split('@')[0];if(name.length>=4&&p.toLowerCase().includes(name.toLowerCase()))return '密碼不要包含電子郵件的帳號名稱';return ''}
if($('lgPass')){$('lgPass').placeholder='密碼（至少 8 個字，含英文和數字）';$('lgPass').insertAdjacentHTML('afterend','<div class="pwm" aria-hidden="true"><i id="pwmI"></i></div>');
 $('lgPass').addEventListener('input',()=>{const s=pwScore($('lgPass').value),c=['#e8507a','#e8507a','#f0a04b','#ffd23f','#3cc47c'][s];$('pwmI').style.width=($('lgPass').value?(s+1)*20:0)+'%';$('pwmI').style.background=c})}
// ---------- 登入失敗太多次：暫時鎖定 ----------
const LOCK_KEY='petDiary.lock';
function lockInfo(){try{return JSON.parse(localStorage.getItem(LOCK_KEY))||{n:0,until:0}}catch(e){return{n:0,until:0}}}
function setLock(o){try{localStorage.setItem(LOCK_KEY,JSON.stringify(o))}catch(e){}}
if(typeof fbLogin==='function'){const _fbS=fbLogin;fbLogin=async function(kind,email,pass){const L=lockInfo();
 if(L.until>Date.now())return `嘗試太多次了，請 ${Math.ceil((L.until-Date.now())/1000)} 秒後再試`;
 if(kind==='up'){const pr=pwProblem(pass||'',email);if(pr)return pr}
 const r=await _fbS(kind,email,pass);
 if(r&&kind==='in'&&/不正確|找不到/.test(r)){L.n=(L.n||0)+1;if(L.n>=5){L.until=Date.now()+Math.min(15*60000,60000*Math.pow(2,L.n-5));setLock(L);return `密碼錯太多次了，為了保護帳號，請 ${Math.round((L.until-Date.now())/60000)||1} 分鐘後再試，或用「忘記密碼」重設`}setLock(L);return r+`（還可以再試 ${5-L.n} 次）`}
 if(!r){setLock({n:0,until:0});if(kind==='up')setTimeout(sendVerify,1500)}return r}}
// ---------- 電子郵件驗證 ----------
const fbUser=()=>NET.mode==='firebase'&&NET.auth&&NET.auth.currentUser;
const verified=()=>{const u=fbUser();return !u||u.emailVerified};
async function sendVerify(){const u=fbUser();if(!u||u.emailVerified)return;try{await u.sendEmailVerification();toast(`驗證信已寄到 ${u.email}，請到信箱點連結完成驗證`)}catch(e){toast(e&&e.code==='auth/too-many-requests'?'寄太多次了，請稍後再試':'驗證信寄送失敗，請稍後再試')}}
async function refreshVerify(){const u=fbUser();if(!u)return false;try{await u.reload()}catch(e){}renderVBanner();return u.emailVerified}
function renderVBanner(){document.querySelector('.vbanner')?.remove();const u=fbUser();if(!u||u.emailVerified||S.vbHide===today()||$('ovTitle').classList.contains('on'))return;
 const el=document.createElement('div');el.className='vbanner';el.innerHTML=`<span>帳號還沒驗證電子郵件。驗證後才能加好友、留言，也能在忘記密碼時找回帳號。</span><button class="save" data-v="send">寄驗證信</button><button class="ghost" data-v="done">我驗證好了</button><button class="ghost" data-v="x" aria-label="今天不再提醒">×</button>`;
 el.onclick=async e=>{const b=e.target.closest('[data-v]');if(!b)return;const v=b.dataset.v;if(v==='send')sendVerify();if(v==='done'){if(await refreshVerify()){toast('驗證完成，謝謝！');el.remove()}else toast('還沒收到驗證喔，請先點信裡的連結')}if(v==='x'){S.vbHide=today();save();el.remove()}};document.body.append(el)}
setInterval(()=>{if(fbUser()&&!fbUser().emailVerified&&!document.querySelector('.vbanner'))renderVBanner()},5000);
// 沒驗證的帳號不能加好友、留言
function needVerify(){if(verified())return false;toast('請先驗證電子郵件才能使用好友和留言功能（選單 →「帳號安全」）');sfx('squeak');return true}
document.addEventListener('click',e=>{const t=e.target.closest('#frAdd,[data-accept],.reqpop [data-q=ok],#vSend,#vGift,#vPoop,#dgInv,#fiInv');if(t&&needVerify()){e.stopImmediatePropagation();e.preventDefault()}},true);
// ---------- 帳號安全中心 ----------
document.body.insertAdjacentHTML('beforeend','<div class="ov" id="ovSec"><div class="dlg"><h2>帳號安全</h2><div class="sec" id="secBody"></div><div class="row"><button class="save" id="secClose">好</button></div></div></div>');
$('ovSec').style.zIndex=17;$('secClose').onclick=()=>$('ovSec').classList.remove('on');$('ovSec').onclick=e=>{if(e.target.id==='ovSec')$('ovSec').classList.remove('on')};
async function openSec(){$('ovMenu').classList.remove('on');const u=fbUser();
 if(!u){$('secBody').innerHTML=`<div class="card"><p>${NET.mode==='claude'?'目前是用 Claude 帳號登入，帳號安全由 claude.ai 保護（建議在 claude.ai 開啟雙重驗證）。':'目前沒有登入。登入後紀錄會存在雲端，換裝置也不會不見。'}</p></div>`;$('ovSec').classList.add('on');return}
 await refreshVerify();const meta=u.metadata||{};const fmt=t=>t?new Date(t).toLocaleString('zh-TW',{timeZone:TZ,year:'numeric',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}):'—';
 $('secBody').innerHTML=`<div class="card"><h3>登入帳號</h3><p>${esc(u.email||'')}</p><p>電子郵件驗證：${u.emailVerified?'<span class="ok">已驗證</span>':'<span class="no">還沒驗證</span>'}</p>${u.emailVerified?'':'<button class="save" id="secVer">寄驗證信</button>'}
  <p class="small">建立時間：${fmt(meta.creationTime)}・上次登入：${fmt(meta.lastSignInTime)}</p></div>
 <div class="card"><h3>變更密碼</h3><p class="small">會寄一封重設密碼的信到你的信箱，從信裡的連結設定新密碼（至少 8 個字，含英文和數字）。</p><button class="ghost" id="secPw">寄送變更密碼信</button></div>
 <div class="card"><h3>保護帳號的小提醒</h3><p class="small">・密碼不要跟其他網站共用，也不要告訴別人。<br>・遊戲不會用任何方式跟你要密碼；看到要你輸入密碼的訊息或網址，請確認網址是 gameforan-37213.web.app。<br>・在別人的手機玩完記得從選單「登出」。</p></div>
 <div class="card"><h3>刪除帳號</h3><p class="small">會永久刪除雲端存檔、你的家、排行榜成績，無法復原。</p><div class="inrow"><input id="secDelPw" type="password" placeholder="輸入密碼確認" autocomplete="current-password"><button class="ghost" id="secDel" style="color:#d8304a">刪除</button></div><p class="small" id="secMsg" role="status"></p></div>`;
 $('secVer')&&($('secVer').onclick=sendVerify);$('secPw').onclick=async()=>{toast(await fbReset(u.email))};
 $('secDel').onclick=async()=>{const pw=$('secDelPw').value;if(!pw){$('secMsg').textContent='請先輸入密碼';return}if(!confirm('確定要永久刪除帳號和所有雲端紀錄嗎？'))return;$('secMsg').textContent='刪除中……';
  try{const cred=firebase.auth.EmailAuthProvider.credential(u.email,pw);await u.reauthenticateWithCredential(cred);
   for(const p of [`data/users/${u.uid}/save`,`homes/${u.uid}`,`live/${u.uid}`,`gym/${u.uid}`]){try{await NET.db.doc(p).delete()}catch(e){}}
   await u.delete();try{localStorage.removeItem(KEY)}catch(e){}NET.state='offline';toast('帳號已刪除，謝謝你陪伴牠們');setTimeout(()=>location.reload(),1200)}
  catch(e){$('secMsg').textContent=e&&(e.code==='auth/wrong-password'||e.code==='auth/invalid-credential')?'密碼不正確':e&&e.code==='auth/too-many-requests'?'嘗試太多次了，請稍後再試':'刪除失敗，請稍後再試'}};
 $('ovSec').classList.add('on')}
MENU_EXTRA.push(['sec','帳號安全','<svg viewBox="0 0 40 40"><path d="M20 4 6 9v10c0 9 6 15 14 17 8-2 14-8 14-17V9z" fill="#5fc9ae"/><path d="M13 20l5 5 9-10" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',()=>openSec()]);
