// ===== 雲端：Claude 帳號登入、雲端存檔、好友、留言板 =====
// 資料位置：
//  data/users/<id>/save   自己的完整存檔（只有自己讀得到）
//  homes/<id>             公開的家：暱稱、好友碼、寵物、佈置、好友名單（大家可讀，只能寫自己的）
//  outbox/<id>            我寄出去的留言／禮物／便便（大家可讀，只能寫自己的）
const NET={state:'loading',db:null,user:null,uid:null,ro:false,homes:{},out:{},listeners:[],onChange:null,saveBusy:false,saveAgain:false,homeSent:'',saveTimer:null};
function netCode(uid){let h=2166136261;for(const c of uid)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h.toString(36).toUpperCase().padStart(7,'0').slice(-6)}
async function netInit(getLocal){
 const timeout=new Promise(r=>setTimeout(()=>r(null),10000));
 try{
  if(!window.claude||!window.claude.use){NET.state='offline';return null}
  const [db,user]=await Promise.all([Promise.race([claude.use('db'),timeout]),Promise.race([claude.use('user'),timeout])]);
  if(!db||!user){NET.state='offline';return null}
  const uid=await user.id();if(!uid){NET.state='offline';return null}
  NET.db=db;NET.user=user;NET.uid=uid;
  try{const w=await user.can('data.write');if(w===false)NET.ro=true}catch(e){}
  let cloud=null;try{const s=await db.doc(`data/users/${uid}/save`).get();if(s.exists)cloud=s.data()}catch(e){}
  NET.state='online';
  NET.listeners.push(db.collection('homes').onSnapshot(q=>{NET.homes={};q.docs.forEach(d=>{NET.homes[d.id]=d.data()});NET.onChange&&NET.onChange('homes')},()=>{}));
  NET.listeners.push(db.collection('outbox').onSnapshot(q=>{NET.out={};q.docs.forEach(d=>{NET.out[d.id]=d.data()});NET.onChange&&NET.onChange('out')},()=>{}));
  return cloud&&cloud.state?cloud:null}
 catch(e){NET.state='offline';return null}}
async function netWrite(ref,data){if(!NET.db||NET.ro)return false;
 try{await ref.set(data);return true}catch(e){if(e&&e.code==='invalid_argument'){NET.ro=true;NET.onChange&&NET.onChange('ro')}
  else if(e&&e.code==='unavailable'){await new Promise(r=>setTimeout(r,800+Math.random()*800));try{await ref.set(data);return true}catch(e2){}}return false}}
// 存檔：合併短時間內的多次修改，一次只寫一筆
function netSave(S){if(NET.state!=='online'||NET.ro)return;clearTimeout(NET.saveTimer);NET.saveTimer=setTimeout(()=>netFlush(S),3000)}
async function netFlush(S){if(NET.saveBusy){NET.saveAgain=true;return}NET.saveBusy=true;
 await netWrite(NET.db.doc(`data/users/${NET.uid}/save`),{state:JSON.stringify(S),ts:Date.now()});
 const home={nick:S.nick||'',code:netCode(NET.uid),pets:S.pets.map(p=>({sp:p.sp,name:p.name,aff:p.aff,e:p.full<30||p.joy<30?'sad':'happy'})),decor:S.decor,friends:S.friends||[],ts:0};
 const key=JSON.stringify(home);if(key!==NET.homeSent){home.ts=Date.now();if(await netWrite(NET.db.doc(`homes/${NET.uid}`),home))NET.homeSent=key}
 NET.saveBusy=false;if(NET.saveAgain){NET.saveAgain=false;netFlush(S)}}
async function netSend(item){if(NET.state!=='online'||NET.ro)return false;const mine=NET.out[NET.uid]||{};const items=(mine.items||[]).slice(-79);
 items.push({...item,id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),ts:Date.now()});
 const ok=await netWrite(NET.db.doc(`outbox/${NET.uid}`),{items});if(ok)NET.out[NET.uid]={items};return ok}
// 寄給某個家的所有東西（來自所有人的寄件匣）
function netInbox(uid){const r=[];for(const [from,doc] of Object.entries(NET.out))for(const it of (doc&&doc.items)||[])if(it&&it.to===uid)r.push({...it,from});return r.sort((a,b)=>b.ts-a.ts)}
const netHome=uid=>NET.homes[uid]||null;
function netFindCode(code){code=String(code||'').trim().toUpperCase();for(const [id,h] of Object.entries(NET.homes))if(h&&h.code===code)return id;return null}
