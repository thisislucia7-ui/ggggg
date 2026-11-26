// ===== 帳號安全：帳號名稱登入（不需要電子郵件）、強密碼、登入失敗鎖定、帳號安全中心（改密碼、刪除帳號） =====
document.head.insertAdjacentHTML('beforeend',`<style>
.pwm{height:6px;border-radius:99px;background:var(--line);overflow:hidden;margin:-2px 0 2px}.pwm i{display:block;height:100%;width:0;transition:width .2s,background .2s}
.sec{display:flex;flex-direction:column;gap:10px}
.sec .card{background:var(--bg);border-radius:16px;padding:10px 12px}
.sec .card h3{margin:0 0 4px;font-size:16px}.sec .card p{margin:2px 0;font-size:14px}
.sec .ok{color:#2a9a5c;font-weight:700}.sec .no{color:#d8304a;font-weight:700}
</style>`);
// ---------- 註冊：強密碼 ----------
function pwScore(p){let s=0;if(p.length>=8)s++;if(p.length>=12)s++;if(/[a-z]/i.test(p)&&/\d/.test(p))s++;if(/[^a-z0-9]/i.test(p))s++;if(/[A-Z]/.test(p)&&/[a-z]/.test(p))s++;return Math.min(4,s)}
function pwProblem(p,email){if(p.length<8)return '密碼至少要 8 個字';if(!/[a-z]/i.test(p)||!/\d/.test(p))return '密碼要同時有英文字母和數字';
 if(/^(.)\1+$/.test(p)||/^(12345678|password|qwerty)/i.test(p))return '這個密碼太好猜了，換一個吧';const name=String(email||'').split('@')[0];if(name.length>=4&&p.toLowerCase().includes(name.toLowerCase()))return '密碼不要包含帳號名稱';return ''}
if($('lgPass')){$('lgPass').insertAdjacentHTML('afterend','<div class="pwm" aria-hidden="true"><i id="pwmI"></i></div>');
 $('lgPass').addEventListener('input',()=>{const s=pwScore($('lgPass').value),c=['#e8507a','#e8507a','#f0a04b','#ffd23f','#3cc47c'][s];$('pwmI').style.width=($('lgPass').value?(s+1)*20:0)+'%';$('pwmI').style.background=c})}
// ---------- 登入失敗太多次：暫時鎖定 ----------
const LOCK_KEY='petDiary.lock';
function lockInfo(){try{return JSON.parse(localStorage.getItem(LOCK_KEY))||{n:0,until:0}}catch(e){return{n:0,until:0}}}
function setLock(o){try{localStorage.setItem(LOCK_KEY,JSON.stringify(o))}catch(e){}}
if(typeof fbLogin==='function'){const _fbS=fbLogin;fbLogin=async function(kind,email,pass){const L=lockInfo();
 if(L.until>Date.now())return `嘗試太多次了，請 ${Math.ceil((L.until-Date.now())/1000)} 秒後再試`;
 if(kind==='up'){const pr=pwProblem(pass||'',email);if(pr)return pr}
 const r=await _fbS(kind,email,pass);
 if(r&&kind==='in'&&/不正確|找不到/.test(r)){L.n=(L.n||0)+1;if(L.n>=5){L.until=Date.now()+Math.min(15*60000,60000*Math.pow(2,L.n-5));setLock(L);return `密碼錯太多次了，為了保護帳號，請 ${Math.round((L.until-Date.now())/60000)||1} 分鐘後再試`}setLock(L);return r+`（還可以再試 ${5-L.n} 次）`}
 if(!r)setLock({n:0,until:0});return r}}
const fbUser=()=>NET.mode==='firebase'&&NET.auth&&NET.auth.currentUser;
// ---------- 帳號安全中心 ----------
document.body.insertAdjacentHTML('beforeend','<div class="ov" id="ovSec"><div class="dlg"><h2>帳號安全</h2><div class="sec" id="secBody"></div><div class="row"><button class="save" id="secClose">好</button></div></div></div>');
$('ovSec').style.zIndex=17;$('secClose').onclick=()=>$('ovSec').classList.remove('on');$('ovSec').onclick=e=>{if(e.target.id==='ovSec')$('ovSec').classList.remove('on')};
async function openSec(){$('ovMenu').classList.remove('on');const u=fbUser();
 if(!u){$('secBody').innerHTML=`<div class="card"><p>${NET.mode==='claude'?'目前是用 Claude 帳號登入，帳號安全由 claude.ai 保護。':'目前沒有登入。登入後紀錄會存在雲端，換裝置也不會不見。'}</p></div>`;$('ovSec').classList.add('on');return}
 const meta=u.metadata||{},byName=String(u.email||'').endsWith('@'+ACCT_DOMAIN),fmt=t=>t?new Date(t).toLocaleString('zh-TW',{timeZone:TZ,year:'numeric',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}):'—';
 $('secBody').innerHTML=`<div class="card"><h3>登入帳號</h3><p>${esc(acctName(u.email))}</p><p class="small">${byName?'這個帳號沒有綁定電子郵件或手機，遊戲不會蒐集你的個人資料。':'這是舊的電子郵件帳號，之後可以繼續用電子郵件登入。'}</p>
  <p class="small">建立時間：${fmt(meta.creationTime)}・上次登入：${fmt(meta.lastSignInTime)}</p></div>
 <div class="card"><h3>變更密碼</h3><input id="secOld" type="password" placeholder="目前的密碼" autocomplete="current-password"><input id="secNew" type="password" placeholder="新密碼（至少 8 個字，含英文和數字）" autocomplete="new-password" style="margin-top:6px"><div class="row" style="margin:6px 0 0"><span class="small" id="secPwMsg" role="status"></span><button class="save" id="secPw">變更密碼</button></div></div>
 <div class="card"><h3>保護帳號的小提醒</h3><p class="small">・${byName?'帳號沒有綁定信箱，<b>忘記密碼就無法找回</b>，請把帳號名稱和密碼記在安全的地方。<br>・':''}帳號名稱和暱稱不要用真實姓名、生日、電話或學號。<br>・密碼不要跟其他網站共用，也不要告訴別人；遊戲不會跟你要密碼。<br>・在別人的手機玩完記得從選單「登出」。</p></div>
 <div class="card"><h3>刪除帳號</h3><p class="small">會永久刪除雲端存檔、你的家、排行榜成績，無法復原。</p><div class="inrow"><input id="secDelPw" type="password" placeholder="輸入密碼確認" autocomplete="current-password"><button class="ghost" id="secDel" style="color:#d8304a">刪除</button></div><p class="small" id="secMsg" role="status"></p></div>`;
 const reauth=async pw=>u.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(u.email,pw));
 const errTxt=e=>e&&(e.code==='auth/wrong-password'||e.code==='auth/invalid-credential')?'目前的密碼不正確':e&&e.code==='auth/too-many-requests'?'嘗試太多次了，請稍後再試':e&&e.code==='auth/weak-password'?'新密碼太簡單了':'失敗了，請稍後再試';
 $('secPw').onclick=async()=>{const o=$('secOld').value,n=$('secNew').value,pr=pwProblem(n,u.email);if(!o){$('secPwMsg').textContent='請輸入目前的密碼';return}if(pr){$('secPwMsg').textContent=pr;return}if(n===o){$('secPwMsg').textContent='新密碼要跟舊的不一樣';return}
  $('secPwMsg').textContent='變更中……';try{await reauth(o);await u.updatePassword(n);$('secOld').value=$('secNew').value='';$('secPwMsg').textContent='密碼已經變更好了！';sfx('chime')}catch(e){$('secPwMsg').textContent=errTxt(e)}};
 $('secDel').onclick=async()=>{const pw=$('secDelPw').value;if(!pw){$('secMsg').textContent='請先輸入密碼';return}if(!confirm('確定要永久刪除帳號和所有雲端紀錄嗎？'))return;$('secMsg').textContent='刪除中……';
  try{await reauth(pw);for(const p of [`data/users/${u.uid}/save`,`homes/${u.uid}`,`live/${u.uid}`,`gym/${u.uid}`]){try{await NET.db.doc(p).delete()}catch(e){}}
   await u.delete();try{localStorage.removeItem(KEY)}catch(e){}NET.state='offline';toast('帳號已刪除，謝謝你陪伴牠們');setTimeout(()=>location.reload(),1200)}
  catch(e){$('secMsg').textContent=errTxt(e).replace('目前的','')}};
 $('ovSec').classList.add('on')}
MENU_EXTRA.push(['sec','帳號安全','<svg viewBox="0 0 40 40"><path d="M20 4 6 9v10c0 9 6 15 14 17 8-2 14-8 14-17V9z" fill="#5fc9ae"/><path d="M13 20l5 5 9-10" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',()=>openSec()]);
