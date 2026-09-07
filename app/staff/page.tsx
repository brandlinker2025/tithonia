"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const API="https://rcxzpvqtlvbfwwdbwmcw.supabase.co/functions/v1/tithonia-staff";
const box:React.CSSProperties={maxWidth:1120,margin:"34px auto",padding:20,fontFamily:"Arial, sans-serif",color:"#2c1914"};
const card:React.CSSProperties={background:"#fff",border:"1px solid #e5d7c8",borderRadius:14,padding:22,boxShadow:"0 10px 30px rgba(70,30,15,.07)"};
const input:React.CSSProperties={width:"100%",padding:"11px 12px",border:"1px solid #d8c7b7",borderRadius:8,background:"#fffdf9"};
const btn:React.CSSProperties={border:0,borderRadius:8,padding:"12px 16px",background:"#5b120f",color:"white",cursor:"pointer",fontWeight:700};
const grid:React.CSSProperties={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12};
const uploadBox:React.CSSProperties={border:"2px dashed #8f5a4b",borderRadius:12,padding:18,background:"#fff8f2",display:"grid",gap:10};

type Product={id:string;name:string;image_url:string|null;category:string;price:number;stock:number};
type Discount={id:string;code:string;type:"percent"|"fixed";value:number;min_order:number;starts_at:string|null;ends_at:string|null;max_uses:number|null;active:boolean};

export default function StaffPage(){
  const [key,setKey]=useState("");
  const [ready,setReady]=useState(false);
  const [denied,setDenied]=useState(false);
  const [busy,setBusy]=useState(false);
  const [msg,setMsg]=useState("");
  const [image,setImage]=useState<File|null>(null);
  const [preview,setPreview]=useState<string|null>(null);
  const [replacementImage,setReplacementImage]=useState<File|null>(null);
  const [replaceProductId,setReplaceProductId]=useState("");
  const [products,setProducts]=useState<Product[]>([]);
  const [discounts,setDiscounts]=useState<Discount[]>([]);
  const categories=useMemo(()=>["T-Shirt","Three Piece","Saree","Shoes"],[]);

  useEffect(()=>{
    const q=new URLSearchParams(window.location.search).get("access")||sessionStorage.getItem("tithonia-staff-access")||"";
    if(q){sessionStorage.setItem("tithonia-staff-access",q);setKey(q);}else setDenied(true);
  },[]);
  useEffect(()=>{if(key)loadAll(true)},[key]);
  useEffect(()=>{if(!image){setPreview(null);return;}const u=URL.createObjectURL(image);setPreview(u);return()=>URL.revokeObjectURL(u)},[image]);

  async function call(body:any){
    const r=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json","x-staff-key":key},body:JSON.stringify(body)});
    const j=await r.json().catch(()=>({error:"Unexpected response"}));
    if(!r.ok)throw new Error(j.error||"Request failed");
    return j;
  }
  async function loadAll(initial=false){
    try{
      const j=await call({action:"list"});
      const p=j.products||[];setProducts(p);setDiscounts(j.discounts||[]);
      if(p.length&&!replaceProductId)setReplaceProductId(p[0].id);
      setReady(true);setDenied(false);
    }catch(e:any){if(initial)setDenied(true);setReady(false);setMsg(e?.message||"Access denied");}
  }
  async function addProduct(e:FormEvent<HTMLFormElement>){
    e.preventDefault();if(!image)return setMsg("Please choose a product picture first.");
    setBusy(true);setMsg("Uploading picture and saving product...");
    const form=e.currentTarget;const f=new FormData(form);f.set("action","add_product");f.set("image",image);f.set("featured",f.get("featured")?"true":"false");
    try{
      const r=await fetch(API,{method:"POST",headers:{"x-staff-key":key},body:f});const j=await r.json();if(!r.ok)throw new Error(j.error||"Upload failed");
      form.reset();setImage(null);setMsg("✅ Product added successfully with picture.");await loadAll();
    }catch(e:any){setMsg(`❌ ${e?.message||"Could not add product."}`);}setBusy(false);
  }
  async function replaceImage(e:FormEvent<HTMLFormElement>){
    e.preventDefault();if(!replacementImage||!replaceProductId)return setMsg("Choose a product and new picture.");
    setBusy(true);setMsg("Replacing picture...");const f=new FormData();f.set("action","replace_image");f.set("product_id",replaceProductId);f.set("image",replacementImage);
    try{const r=await fetch(API,{method:"POST",headers:{"x-staff-key":key},body:f});const j=await r.json();if(!r.ok)throw new Error(j.error||"Replace failed");setReplacementImage(null);setMsg("✅ Product image updated.");await loadAll();}catch(e:any){setMsg(`❌ ${e?.message||"Could not update image."}`);}setBusy(false);
  }
  async function addDiscount(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setBusy(true);const form=e.currentTarget;const f=new FormData(form);
    const discount={code:String(f.get("code")||""),type:String(f.get("type")||"percent"),value:Number(f.get("value")||0),min_order:Number(f.get("min_order")||0),starts_at:f.get("starts_at")?new Date(String(f.get("starts_at"))).toISOString():null,ends_at:f.get("ends_at")?new Date(String(f.get("ends_at"))).toISOString():null,max_uses:f.get("max_uses")?Number(f.get("max_uses")):null};
    try{await call({action:"add_discount",discount});form.reset();setMsg("✅ Discount added.");await loadAll();}catch(e:any){setMsg(`❌ ${e?.message||"Could not add discount."}`);}setBusy(false);
  }
  async function editDiscount(e:FormEvent<HTMLFormElement>,id:string){
    e.preventDefault();setBusy(true);const f=new FormData(e.currentTarget);const discount={code:String(f.get("code")||""),type:String(f.get("type")||"percent"),value:Number(f.get("value")||0),min_order:Number(f.get("min_order")||0),starts_at:f.get("starts_at")?new Date(String(f.get("starts_at"))).toISOString():null,ends_at:f.get("ends_at")?new Date(String(f.get("ends_at"))).toISOString():null,max_uses:f.get("max_uses")?Number(f.get("max_uses")):null,active:f.get("active")==="on"};
    try{await call({action:"update_discount",id,discount});setMsg("✅ Discount updated.");await loadAll();}catch(e:any){setMsg(`❌ ${e?.message||"Could not update discount."}`);}setBusy(false);
  }
  const dt=(v:string|null)=>v?new Date(v).toISOString().slice(0,16):"";

  if(denied&&!ready)return <main style={box}><div style={{...card,maxWidth:540,margin:"70px auto"}}><h1 style={{fontFamily:"Georgia,serif",fontWeight:400}}>Access denied</h1><p>Use the private TITHONIA staff link. No email, password or OTP is required when the correct private link is used.</p></div></main>;
  if(!ready)return <main style={box}><div style={{...card,maxWidth:540,margin:"70px auto"}}><h1 style={{fontFamily:"Georgia,serif",fontWeight:400}}>Opening TITHONIA Staff Panel…</h1></div></main>;

  return <main style={box}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:20,flexWrap:"wrap"}}><div><h1 style={{fontFamily:"Georgia,serif",fontWeight:400,marginBottom:4}}>TITHONIA Staff Panel</h1><p style={{marginTop:0,color:"#765f54"}}>Direct private-link access. No email, password or OTP.</p></div><button style={{...btn,background:"#765f54"}} onClick={()=>{sessionStorage.removeItem("tithonia-staff-access");window.location.href="/staff"}}>Lock Panel</button></div>
    {msg&&<div style={{...card,marginBottom:16,padding:14,fontWeight:600}}>{msg}</div>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:18}}>
      <section style={card}><h2>Add Product</h2><form onSubmit={addProduct} style={{display:"grid",gap:12}}>
        <input style={input} name="name" placeholder="Product name" required/>
        <div style={grid}><select style={input} name="category" required>{categories.map(c=><option key={c}>{c}</option>)}</select><input style={input} name="sku" placeholder="SKU (optional)"/></div>
        <textarea style={{...input,minHeight:110}} name="description" placeholder="Description" required/>
        <div style={grid}><input style={input} name="price" type="number" min="0" step="0.01" placeholder="Price" required/><input style={input} name="compare_at_price" type="number" min="0" step="0.01" placeholder="Old price (optional)"/><input style={input} name="stock" type="number" min="0" placeholder="Stock" required/></div>
        <div style={grid}><input style={input} name="sizes" placeholder="Sizes: S, M, L, XL"/><input style={input} name="colors" placeholder="Colors: Off White, Maroon"/></div>
        <div style={uploadBox}><strong style={{fontSize:18,color:"#5b120f"}}>Product Picture *</strong><span style={{fontSize:13,color:"#765f54"}}>Recommended portrait photo. Website displays it in a standard 4:5 frame, centered and cropped to fill.</span><input style={{...input,padding:14,background:"#fff"}} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" required onChange={e=>setImage(e.target.files?.[0]||null)}/>{preview&&<div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:14,alignItems:"center"}}><img src={preview} alt="Product preview" style={{width:120,height:150,objectFit:"cover",objectPosition:"center",borderRadius:10,border:"1px solid #d8c7b7",background:"#eee"}}/><div><b>Website preview</b><p style={{margin:"6px 0",fontSize:12,color:"#765f54"}}>4:5 portrait • centered crop</p><small>{image?.name} · {image?`${(image.size/1024/1024).toFixed(2)} MB`:""}</small></div></div>}</div>
        <label><input type="checkbox" name="featured"/> Featured product</label>
        <button style={{...btn,opacity:(busy||!image)?.6:1}} disabled={busy||!image}>{busy?"Uploading & saving...":"Add Product"}</button>
      </form></section>

      <section style={card}><h2>Change Product Image</h2><p style={{color:"#765f54"}}>Only products created through this private staff link can be changed.</p><form onSubmit={replaceImage} style={{display:"grid",gap:12}}><select style={input} value={replaceProductId} onChange={e=>setReplaceProductId(e.target.value)} required><option value="">Select product</option>{products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select><div style={uploadBox}><strong>New Product Picture</strong><input style={{...input,padding:14,background:"#fff"}} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" onChange={e=>setReplacementImage(e.target.files?.[0]||null)} required/></div><button style={btn} disabled={busy||!products.length}>Replace Image</button></form></section>

      <section style={card}><h2>Add Discount</h2><form onSubmit={addDiscount} style={{display:"grid",gap:12}}><div style={grid}><input style={input} name="code" placeholder="CODE" required/><select style={input} name="type"><option value="percent">Percent</option><option value="fixed">Fixed amount</option></select></div><div style={grid}><input style={input} name="value" type="number" min="0" step="0.01" placeholder="Value" required/><input style={input} name="min_order" type="number" min="0" step="0.01" placeholder="Minimum order" defaultValue="0"/></div><div style={grid}><label>Starts at<input style={input} name="starts_at" type="datetime-local"/></label><label>Ends at<input style={input} name="ends_at" type="datetime-local"/></label></div><input style={input} name="max_uses" type="number" min="1" placeholder="Maximum uses (optional)"/><button style={btn} disabled={busy}>Add Discount</button></form></section>

      <section style={card}><h2>Edit Your Discounts</h2>{discounts.length===0?<p>No editable discounts yet.</p>:<div style={{display:"grid",gap:14}}>{discounts.map(d=><form key={d.id} onSubmit={e=>editDiscount(e,d.id)} style={{border:"1px solid #eadfd4",borderRadius:10,padding:14,display:"grid",gap:10}}><div style={grid}><input style={input} name="code" defaultValue={d.code} required/><select style={input} name="type" defaultValue={d.type}><option value="percent">Percent</option><option value="fixed">Fixed amount</option></select></div><div style={grid}><input style={input} name="value" type="number" min="0" step="0.01" defaultValue={d.value} required/><input style={input} name="min_order" type="number" min="0" step="0.01" defaultValue={d.min_order}/></div><div style={grid}><label>Starts at<input style={input} name="starts_at" type="datetime-local" defaultValue={dt(d.starts_at)}/></label><label>Ends at<input style={input} name="ends_at" type="datetime-local" defaultValue={dt(d.ends_at)}/></label></div><input style={input} name="max_uses" type="number" min="1" defaultValue={d.max_uses??""} placeholder="Maximum uses"/><label><input type="checkbox" name="active" defaultChecked={d.active}/> Active</label><button style={btn} disabled={busy}>Save Discount Changes</button></form>)}</div>}</section>
    </div>
  </main>;
}
