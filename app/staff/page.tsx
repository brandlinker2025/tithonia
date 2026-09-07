"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient, Session } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

const STAFF_EMAIL = "tithonia.online@gmail.com";
const box: React.CSSProperties = {maxWidth:1100,margin:"40px auto",padding:24,fontFamily:"Arial, sans-serif",color:"#2c1914"};
const card: React.CSSProperties = {background:"#fff",border:"1px solid #e5d7c8",borderRadius:14,padding:22,boxShadow:"0 10px 30px rgba(70,30,15,.07)"};
const input: React.CSSProperties = {width:"100%",padding:"11px 12px",border:"1px solid #d8c7b7",borderRadius:8,background:"#fffdf9"};
const btn: React.CSSProperties = {border:0,borderRadius:8,padding:"12px 16px",background:"#5b120f",color:"white",cursor:"pointer",fontWeight:700};
const grid: React.CSSProperties = {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12};
const uploadBox: React.CSSProperties = {border:"2px dashed #8f5a4b",borderRadius:12,padding:"18px",background:"#fff8f2",display:"grid",gap:8};

export default function StaffPage(){
  const [session,setSession]=useState<Session|null>(null);
  const [allowed,setAllowed]=useState(false);
  const [msg,setMsg]=useState("");
  const [busy,setBusy]=useState(false);
  const [authMode,setAuthMode]=useState<"signin"|"signup">("signup");
  const [email,setEmail]=useState(STAFF_EMAIL);
  const [password,setPassword]=useState("");
  const [invite,setInvite]=useState("");
  const [image,setImage]=useState<File|null>(null);

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>setSession(data.session));
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));
    return()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{
    if(!session){setAllowed(false);return;}
    supabase.from("contributors").select("user_id").eq("user_id",session.user.id).maybeSingle()
      .then(({data})=>setAllowed(Boolean(data)));
  },[session]);

  const categories=useMemo(()=>["T-Shirt","Three Piece","Saree","Shoes"],[]);

  async function authSubmit(e:FormEvent){
    e.preventDefault(); setBusy(true); setMsg("");
    const res=authMode==="signin"
      ? await supabase.auth.signInWithPassword({email,password})
      : await supabase.auth.signUp({email,password});
    setBusy(false);
    if(res.error){setMsg(res.error.message);return;}
    if(authMode==="signup" && !res.data.session) setMsg("Account created. Please confirm the email once, then return here and sign in. Staff permission is already prepared for this email.");
    else setMsg("Signed in. Staff access is ready.");
  }

  async function claim(){
    setBusy(true); setMsg("");
    const {data,error}=await supabase.rpc("claim_contributor_access",{p_code:invite.trim()});
    setBusy(false);
    if(error){setMsg(error.message);return;}
    if(!data){setMsg("Invalid, expired, or already-used access code.");return;}
    setAllowed(true); setInvite(""); setMsg("Contributor access activated.");
  }

  async function addProduct(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); if(!session||!allowed)return;
    setBusy(true); setMsg("");
    const f=new FormData(e.currentTarget);
    let image_url:string|null=null;
    if(image){
      const ext=image.name.split(".").pop()?.toLowerCase()||"jpg";
      const path=`${session.user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const up=await supabase.storage.from("product-images").upload(path,image,{upsert:false,contentType:image.type||undefined});
      if(up.error){setBusy(false);setMsg(up.error.message);return;}
      image_url=supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
    }
    const payload={
      slug:String(f.get("slug")||"").trim(), name:String(f.get("name")||"").trim(), category:String(f.get("category")||""),
      description:String(f.get("description")||"").trim(), price:Number(f.get("price")||0),
      compare_at_price:f.get("compare_at_price")?Number(f.get("compare_at_price")):null, stock:Number(f.get("stock")||0),
      sku:String(f.get("sku")||"").trim()||null, sizes:String(f.get("sizes")||"").split(",").map(x=>x.trim()).filter(Boolean),
      colors:String(f.get("colors")||"").split(",").map(x=>x.trim()).filter(Boolean), image_url,
      featured:f.get("featured")==="on", active:true
    };
    const {error}=await supabase.from("products").insert(payload);
    setBusy(false);
    if(error){setMsg(error.message);return;}
    e.currentTarget.reset(); setImage(null); setMsg("Product added successfully. Existing products cannot be edited from this access.");
  }

  async function addDiscount(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); if(!allowed)return;
    setBusy(true); setMsg("");
    const f=new FormData(e.currentTarget);
    const payload={
      code:String(f.get("code")||"").trim().toUpperCase(), type:String(f.get("type")||"percent"), value:Number(f.get("value")||0),
      min_order:Number(f.get("min_order")||0), starts_at:f.get("starts_at")?new Date(String(f.get("starts_at"))).toISOString():null,
      ends_at:f.get("ends_at")?new Date(String(f.get("ends_at"))).toISOString():null,
      max_uses:f.get("max_uses")?Number(f.get("max_uses")):null, used_count:0, active:true
    };
    const {error}=await supabase.from("discounts").insert(payload);
    setBusy(false);
    if(error){setMsg(error.message);return;}
    e.currentTarget.reset(); setMsg("Discount added successfully. Existing discounts cannot be edited from this access.");
  }

  if(!session) return <main style={box}>
    <h1 style={{fontFamily:"Georgia,serif",fontWeight:400}}>TITHONIA Staff Access</h1>
    <div style={{...card,maxWidth:460}}>
      <form onSubmit={authSubmit} style={{display:"grid",gap:12}}>
        <input style={input} type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <input style={input} type="password" placeholder="Choose password (minimum 8 characters)" value={password} onChange={e=>setPassword(e.target.value)} minLength={8} required/>
        <button style={btn} disabled={busy}>{busy?"Please wait...":authMode==="signin"?"Sign in":"Create staff account"}</button>
      </form>
      <button onClick={()=>setAuthMode(authMode==="signin"?"signup":"signin")} style={{marginTop:12,border:0,background:"transparent",cursor:"pointer",color:"#5b120f"}}>{authMode==="signin"?"First time? Create account":"Already created? Sign in"}</button>
      {msg&&<p>{msg}</p>}
    </div>
  </main>;

  if(!allowed) return <main style={box}>
    <h1 style={{fontFamily:"Georgia,serif",fontWeight:400}}>Activating Staff Access</h1>
    <div style={{...card,maxWidth:520}}>
      <p>If this is the approved staff email, permission should appear automatically after sign-in. If not, the backup one-time access code can still be used.</p>
      <div style={{display:"flex",gap:10}}><input style={input} value={invite} onChange={e=>setInvite(e.target.value)} placeholder="Backup one-time access code"/><button style={btn} onClick={claim} disabled={busy}>Activate</button></div>
      <button onClick={()=>supabase.auth.signOut()} style={{marginTop:14,border:0,background:"transparent",cursor:"pointer"}}>Sign out</button>
      {msg&&<p>{msg}</p>}
    </div>
  </main>;

  return <main style={box}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:20,flexWrap:"wrap"}}>
      <div><h1 style={{fontFamily:"Georgia,serif",fontWeight:400,marginBottom:4}}>TITHONIA Contributor Panel</h1><p style={{marginTop:0,color:"#765f54"}}>Add-only access: product, image and discount creation only. No edit or delete permission.</p></div>
      <button style={btn} onClick={()=>supabase.auth.signOut()}>Sign out</button>
    </div>
    {msg&&<div style={{...card,marginBottom:16,padding:14}}>{msg}</div>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(360px,1fr))",gap:18}}>
      <section style={card}><h2>Add Product</h2><form onSubmit={addProduct} style={{display:"grid",gap:12}}>
        <div style={grid}><input style={input} name="name" placeholder="Product name" required/><input style={input} name="slug" placeholder="product-slug" required/></div>
        <div style={grid}><select style={input} name="category" required>{categories.map(c=><option key={c}>{c}</option>)}</select><input style={input} name="sku" placeholder="SKU (optional)"/></div>
        <textarea style={{...input,minHeight:90}} name="description" placeholder="Description" required/>

        <div style={uploadBox}>
          <strong style={{fontSize:18,color:"#5b120f"}}>Product Picture Upload</strong>
          <span style={{fontSize:13,color:"#765f54"}}>Tap below to choose a product photo from your phone or computer.</span>
          <input style={{...input,padding:14,background:"#fff"}} type="file" accept="image/*" onChange={e=>setImage(e.target.files?.[0]||null)} />
          {image&&<small style={{color:"#5b120f",fontWeight:700}}>Selected: {image.name}</small>}
        </div>

        <div style={grid}><input style={input} name="price" type="number" min="0" step="0.01" placeholder="Price" required/><input style={input} name="compare_at_price" type="number" min="0" step="0.01" placeholder="Old price (optional)"/><input style={input} name="stock" type="number" min="0" placeholder="Stock" required/></div>
        <div style={grid}><input style={input} name="sizes" placeholder="Sizes: S, M, L"/><input style={input} name="colors" placeholder="Colors: Black, Maroon"/></div>
        <label><input type="checkbox" name="featured"/> Featured product</label>
        <button style={btn} disabled={busy}>Add Product</button>
      </form></section>

      <section style={card}><h2>Add Discount</h2><form onSubmit={addDiscount} style={{display:"grid",gap:12}}>
        <div style={grid}><input style={input} name="code" placeholder="CODE" required/><select style={input} name="type"><option value="percent">Percent</option><option value="fixed">Fixed amount</option></select></div>
        <div style={grid}><input style={input} name="value" type="number" min="0" step="0.01" placeholder="Value" required/><input style={input} name="min_order" type="number" min="0" step="0.01" placeholder="Minimum order" defaultValue="0"/></div>
        <div style={grid}><label>Starts at<input style={input} name="starts_at" type="datetime-local"/></label><label>Ends at<input style={input} name="ends_at" type="datetime-local"/></label></div>
        <input style={input} name="max_uses" type="number" min="1" placeholder="Maximum uses (optional)"/>
        <button style={btn} disabled={busy}>Add Discount</button>
      </form></section>
    </div>
  </main>;
}
