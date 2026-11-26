// ===== 雲端：兩種模式 =====
// 1) 在 claude.ai 上開啟：用 Claude 帳號登入與 artifact 資料庫
// 2) 公開網站（Firebase）：用電子郵件＋密碼登入，資料存在 Firestore（設定見 fbconfig.js）
// 都沒有時為離線模式，紀錄只存在這台裝置。
// 資料位置（兩種模式共用）：
//  data/users/<id>/save   自己的完整存檔（只有自己讀寫）
//  homes/<id>             公開的家：暱稱、好友碼、寵物、佈置、好友名單（只能寫自己的）
//  claude.ai 模式：outbox/<id> 我寄出去的留言／禮物／便便
//  Firebase 模式：board/<主人id>/msgs/<自動id> 寫給某個家的留言
const NET={mode:'offline',state:'loading',db:null,user:null,auth:null,uid:null,email:'',ro:false,homes:{},out:{},boards:{},watched:{},listeners:[],onChange:null,saveBusy:false,saveAgain:false,homeSent:'',saveTimer:null,loginWait:null};
const FB_VER='10.12.2';
const fire=k=>NET.onChange&&NET.onChange(k);
function netCode(uid){let h=2166136261;for(const c of uid)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return String(h%1000000).padStart(6,'0')}
function loadScript(src){return new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=no;document.head.append(s)})}
async function netInit(){
 if(window.claude&&window.claude.use)return claudeInit();
 if(window.FIREBASE_CONFIG&&window.FIREBASE_CONFIG.apiKey)return fbInit();
 NET.state='offline';return null}

// ---------- claude.ai 模式 ----------
async function claudeInit(){NET.mode='claude';
 const timeout=new Promise(r=>setTimeout(()=>r(null),10000));
 try{
  const [db,user]=await Promise.all([Promise.race([claude.use('db'),timeout]),Promise.race([claude.use('user'),timeout])]);
  if(!db||!user){NET.state='offline';return null}
  const uid=await user.id();if(!uid){NET.state='offline';return null}
  NET.db=db;NET.user=user;NET.uid=uid;
  try{const w=await user.can('data.write');if(w===false)NET.ro=true}catch(e){}
  let cloud=null;try{const s=await db.doc(`data/users/${uid}/save`).get();if(s.exists)cloud=s.data()}catch(e){}
  NET.state='online';
  NET.listeners.push(db.collection('homes').onSnapshot(q=>{NET.homes={};q.docs.forEach(d=>{NET.homes[d.id]=d.data()});fire('homes')},()=>{}));
  NET.listeners.push(db.collection('outbox').onSnapshot(q=>{NET.out={};q.docs.forEach(d=>{NET.out[d.id]=d.data()});fire('out')},()=>{}));
  return cloud&&cloud.state?cloud:null}
 catch(e){NET.state='offline';return null}}

// ---------- Firebase 模式 ----------
async function fbInit(){NET.mode='firebase';
 try{for(const m of ['app','auth','firestore'])await loadScript(`https://www.gstatic.com/firebasejs/${FB_VER}/firebase-${m}-compat.js`)}catch(e){NET.state='offline';return null}
 try{firebase.initializeApp(window.FIREBASE_CONFIG);NET.auth=firebase.auth();NET.db=firebase.firestore()}catch(e){NET.state='offline';return null}
 const u=await new Promise(r=>{const off=NET.auth.onAuthStateChanged(x=>{off();r(x)})});
 if(u)return fbStart(u);
 NET.state='login';fire('login');
 const u2=await new Promise(r=>{NET.loginWait=r});
 if(!u2){NET.state='offline';fire('login');return null}
 return fbStart(u2)}
async function fbStart(u){NET.uid=u.uid;NET.email=u.email||'';
 let cloud=null;try{const s=await NET.db.doc(`data/users/${u.uid}/save`).get();if(s.exists)cloud=s.data()}catch(e){}
 NET.state='online';
 NET.listeners.push(NET.db.collection(`board/${u.uid}/msgs`).orderBy('ts','desc').limit(100).onSnapshot(q=>{NET.boards[u.uid]=q.docs.map(d=>({...d.data(),id:d.id}));fire('out')},()=>{}));
 NET.listeners.push(NET.db.collection('homes').where('friends','array-contains',u.uid).limit(100).onSnapshot(q=>{q.docs.forEach(d=>{NET.homes[d.id]=d.data()});fire('homes')},()=>{}));
 NET.watched[u.uid]=1;NET.listeners.push(NET.db.doc(`homes/${u.uid}`).onSnapshot(d=>{if(d.exists)NET.homes[u.uid]=d.data()},()=>{}));
 return cloud&&cloud.state?cloud:null}
// 只追蹤好友的家，不讀取全部玩家
function netWatchFriends(ids){if(NET.mode!=='firebase'||NET.state!=='online')return;
 for(const id of ids||[])if(!NET.watched[id]){NET.watched[id]=1;NET.listeners.push(NET.db.doc(`homes/${id}`).onSnapshot(d=>{if(d.exists){NET.homes[id]=d.data();fire('homes')}},()=>{}))}}
function netWatchBoard(uid){if(NET.mode!=='firebase'||NET.state!=='online'||NET.boards['w:'+uid])return;NET.boards['w:'+uid]=1;
 NET.listeners.push(NET.db.collection(`board/${uid}/msgs`).orderBy('ts','desc').limit(50).onSnapshot(q=>{NET.boards[uid]=q.docs.map(d=>({...d.data(),id:d.id}));fire('out')},()=>{}))}
async function fbLogin(kind,email,pass){
 try{const fn=kind==='up'?'createUserWithEmailAndPassword':'signInWithEmailAndPassword';const r=await NET.auth[fn](email,pass);if(NET.loginWait){NET.loginWait(r.user);NET.loginWait=null}return ''}
 catch(e){return({'auth/invalid-email':'電子郵件格式不對喔','auth/missing-password':'請輸入密碼','auth/weak-password':'密碼至少要 6 個字','auth/email-already-in-use':'這個電子郵件已經註冊過了，請直接登入',
  'auth/invalid-credential':'電子郵件或密碼不正確','auth/wrong-password':'電子郵件或密碼不正確','auth/user-not-found':'找不到這個帳號，要不要先註冊？','auth/too-many-requests':'嘗試太多次了，請稍後再試',
  'auth/network-request-failed':'網路連線有問題，請稍後再試',
  'auth/operation-not-allowed':'網站還沒開啟「電子郵件/密碼」登入，請到 Firebase 主控台的 Authentication 啟用',
  'auth/configuration-not-found':'網站還沒開啟 Firebase 登入功能，請到 Firebase 主控台的 Authentication 按「開始使用」並啟用「電子郵件/密碼」',
  'auth/unauthorized-domain':'這個網址還沒被 Firebase 允許登入，請到 Authentication 的「設定 → 已授權網域」加入',
  'auth/api-key-not-valid.-please-pass-a-valid-api-key.':'網站的 Firebase 設定不正確（API 金鑰無效）'})[e&&e.code]||`登入失敗（${(e&&e.code)||'未知錯誤'}），請把這段訊息告訴我`}}
async function fbReset(email){try{await NET.auth.sendPasswordResetEmail(email);return '已寄出重設密碼的信，請到信箱收信'}catch(e){return e&&e.code==='auth/invalid-email'?'電子郵件格式不對喔':'寄送失敗，請確認電子郵件是否正確'}}
function fbSkip(){if(NET.loginWait){NET.loginWait(null);NET.loginWait=null}}
async function fbLogout(){try{await NET.auth.signOut()}catch(e){}}

// ---------- 共用 ----------
async function netWrite(ref,data){if(!NET.db||NET.ro)return false;
 try{await ref.set(data);return true}catch(e){const c=e&&e.code;
  if(c==='invalid_argument'||c==='permission-denied'){NET.ro=true;fire('ro')}
  else if(c==='unavailable'){await new Promise(r=>setTimeout(r,800+Math.random()*800));try{await ref.set(data);return true}catch(e2){}}return false}}
// 存檔：合併短時間內的多次修改，一次只寫一筆
function netSave(S){if(NET.state!=='online'||NET.ro)return;clearTimeout(NET.saveTimer);NET.saveTimer=setTimeout(()=>netFlush(S),3000)}
async function netFlush(S){if(NET.state!=='online'||NET.ro)return;if(NET.saveBusy){NET.saveAgain=true;return}NET.saveBusy=true;
 netWatchFriends(S.friends);
 await netWrite(NET.db.doc(`data/users/${NET.uid}/save`),{state:JSON.stringify(S),ts:Date.now()});
 const home={nick:String(S.nick||'').slice(0,12),code:netCode(NET.uid),pets:S.pets.map(p=>({id:p.id,sp:p.sp,name:p.name,aff:p.aff,pers:p.pers||'',e:p.full<30||p.joy<30?'sad':'happy'})),decor:S.decor,friends:(S.friends||[]).slice(0,200),mono:S.mono&&S.mono.props?{pos:S.mono.pos||0,props:S.mono.props}:null,ts:0};
 const key=JSON.stringify(home);if(key!==NET.homeSent){home.ts=Date.now();if(await netWrite(NET.db.doc(`homes/${NET.uid}`),home))NET.homeSent=key}
 NET.saveBusy=false;if(NET.saveAgain){NET.saveAgain=false;netFlush(S)}}
async function netSend(item){if(NET.state!=='online'||NET.ro)return false;
 if(NET.mode==='firebase'){const m={...item,from:NET.uid,ts:Date.now()};if(!m.gift)delete m.gift;if(m.text==null)delete m.text;
  try{await NET.db.collection(`board/${item.to}/msgs`).add(m);return true}catch(e){if(e&&e.code==='permission-denied'){NET.ro=true;fire('ro')}return false}}
 const mine=NET.out[NET.uid]||{};const items=(mine.items||[]).slice(-79);
 items.push({...item,id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),ts:Date.now()});
 const ok=await netWrite(NET.db.doc(`outbox/${NET.uid}`),{items});if(ok)NET.out[NET.uid]={items};return ok}
// 寄給某個家的所有東西
function netInbox(uid){
 if(NET.mode==='firebase')return (NET.boards[uid]||[]).filter(m=>m&&m.to===uid).slice().sort((a,b)=>b.ts-a.ts);
 const r=[];for(const [from,doc] of Object.entries(NET.out))for(const it of (doc&&doc.items)||[])if(it&&it.to===uid)r.push({...it,from});return r.sort((a,b)=>b.ts-a.ts)}
const netHome=uid=>NET.homes[uid]||null;
async function netFindCode(code){code=String(code||'').replace(/\D/g,'');
 if(NET.mode==='firebase'){if(!/^[0-9]{6}$/.test(code))return null;try{const q=await NET.db.collection('homes').where('code','==',code).limit(1).get();if(q.empty)return null;const d=q.docs[0];NET.homes[d.id]=d.data();return d.id}catch(e){return null}}
 for(const [id,h] of Object.entries(NET.homes))if(h&&h.code===code)return id;return null}
