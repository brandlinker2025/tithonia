"use client";
import {FormEvent,ReactNode,useEffect,useState} from "react";
import StaffEditTab from "./staff-edit-tab";
const LOGIN_API="https://rcxzpvqtlvbfwwdbwmcw.supabase.co/functions/v1/tithonia-staff-login";
const KEY="tithonia-staff-access";
export default function StaffLayout({children}:{children:ReactNode}){
 const[checked,setChecked]=useState(false),[allowed,setAllowed]=useState(false),[pin,setPin]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState("");
 useEffect(()=>{setAllowed(Boolean(sessionStorage.getItem(KEY)));setChecked(true)},[]);
 async function login(e:FormEvent<HTMLFormElement>){e.preventDefault();if(busy)return;setBusy(true);setError("");try{const r=await fetch(LOGIN_API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pin})}),j=await r.json().catch(()=>({error:"Login failed"}));if(!r.ok||!j.session)throw new Error(j.error||"Login failed");sessionStorage.setItem(KEY,j.session);setAllowed(true);setPin("")}catch(err:any){setError(err?.message||"Incorrect PIN")}finally{setBusy(false)}}
 if(!checked)return <main style={{maxWidth:460,margin:"80px auto",padding:20,fontFamily:"Arial,sans-serif"}}><p>Opening TITHONIA Staff Panel…</p></main>;
 if(allowed)return <><StaffEditTab/>{children}</>;
 const disabled=busy||pin.length!==6;
 return <main style={{minHeight:"80vh",display:"grid",placeItems:"center",padding:20,fontFamily:"Arial,sans-serif",color:"#2c1914"}}><section style={{width:"100%",maxWidth:420,background:"#fff",border:"1px solid #e5d7c8",borderRadius:16,padding:28,boxShadow:"0 14px 40px rgba(70,30,15,.10)"}}><h1 style={{fontFamily:"Georgia,serif",fontWeight:400,color:"#5b120f",margin:"0 0 8px"}}>TITHONIA Staff Login</h1><p style={{color:"#765f54",margin:"0 0 22px"}}>Enter your staff PIN to continue.</p><form onSubmit={login} style={{display:"grid",gap:12}}><input aria-label="Staff PIN" type="password" inputMode="numeric" autoComplete="current-password" value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="••••••" required style={{width:"100%",boxSizing:"border-box",padding:"14px 12px",border:"1px solid #d8c7b7",borderRadius:9,background:"#fffdf9",fontSize:22,letterSpacing:6,textAlign:"center"}}/><button disabled={disabled} style={{border:0,borderRadius:9,padding:"14px 16px",background:"#5b120f",color:"#fff",fontWeight:700,cursor:busy?"wait":"pointer",opacity:disabled ? 0.65 : 1}}>{busy?"CHECKING...":"OPEN STAFF PANEL"}</button></form>{error&&<p style={{margin:"14px 0 0",color:"#a32828",fontWeight:700}}>{error}</p>}</section></main>;
}
