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
const uploadBox: React.CSSProperties = {border:"2px dashed #8f5a4b",borderRadius:12,padding:18,background:"#fff8f2",display:"grid",gap:10};

type OwnProduct={id:string;name:string;image_url:string|null};
type OwnDiscount={id:string;code:string;type:"percent"|"fixed";value:number;min_order:number;starts_at:string|null;ends_at:string|null;max_uses:number|null;active:boolean};

function slugify(v:string){
  return v.toLowerCase().trim().replace(/['’]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,70)||"product";
}

export default function StaffPage(){
  const [session,setSession]=useState<Session|null>(null);
  const [allowed,setAllowed]=useState(false);
  const [msg,setMsg]=useState("");
  const [busy,setBusy]=useState(false);
  const [invite,setInvite]=useState("");
  const [image,setImage]=useState<File|null>(null);
  const [preview,setPreview]=useState<string|null>(null);
  const [replacementImage,setReplacementImage]=useState<File|null>(null);
  const [replaceProductId,setReplaceProductId]=useState("");
  const [ownProducts,setOwnProducts]=useState<OwnProduct[]>([]);
  const [ownDiscounts,setOwnDiscounts]=useState<OwnDiscount[]>([]);

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>setSession(data.session));
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));
    return()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{
    if(!session){setAllowed(false);return;}
    supabase.from("contributors").select("user_id").eq("user_id",session.user.id).maybeSingle().then(({data})=>setAllowed(Boolean(data)));
  },[session]);

  useEffect(()=>{ if(allowed) loadManageable(); },[allowed]);
  useEffect(()=>{
    if(!image){setPreview(null);return;}
    const u=URL.createObjectURL(image); setPreview(u); return()=>URL.revokeObjectURL(u);
  },[image]);

  const categories=useMemo(()=>["T-Shirt","Three Piece","Saree","Shoes"],[]);

  async function loadManageable(){
    const [p,d]=await Promise.all([
      supabase.from("products").select("id,name,image_url").order("created_at",{ascending:false}),
      supabase.from("discounts").select("id,code,type,value,min_order,starts_at,ends_at,max_uses,active").order("created_at",{ascending:false})
    ]);
    if(!p.error){setOwnProducts((p.data||[]) as OwnProduct[]);if(!replaceProductId&&p.data?.[0]?.id)setReplaceProductId(p.data[0].id);}
    if(!d.error)setOwnDiscounts((d.data||[]) as OwnDiscount[]);
  }

  async function passwordlessLogin(){
    setBusy(true);setMsg("");
    const redirectTo=`${window.location.origin}/staff`;
    const {error}=await supabase.auth.signInWithOtp({
      email:STAFF_EMAIL,
      options:{emailRedirectTo:redirectTo,shouldCreateUser:true}
    });
    setBusy(false);
    if(error){setMsg(`Could not send access link: ${error.message}`);return;}
    setMsg("Access link sent to tithonia.online@gmail.com. Open that email and tap the login link. No password is required.");
  }

  async function claim(){
    setBusy(true);setMsg("");
    const {data,error}=await supabase.rpc("claim_contributor_access",{p_code:invite.trim()});
    setBusy(false);
    if(error){setMsg(error.message);return;}if(!data){setMsg("Invalid, expired, or already-used access code.");return;}
    setAllowed(true);setInvite("");setMsg("Contributor access activated.");
  }

  async function uploadToProductImages(file:File){
    if(!session)throw new Error("Not signed in");
    if(file.size>8*1024*1024)throw new Error("Image is too large. Maximum 8 MB.");
    const allowedTypes=["image/jpeg","image/png","image/webp","image/heic","image/heif",""];
    if(!allowedTypes.includes(file.type))throw new Error("Use JPG, PNG, WEBP or HEIC image.");
    const rawExt=file.name.split(".").pop()?.toLowerCase()||"jpg";
    const ext=rawExt==="jpeg"?"jpg":rawExt.replace(/[^a-z0-9]/g,"")||"jpg";
    const path=`${session.user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const contentType=file.type||"image/jpeg";
    const {data,error}=await supabase.storage.from("product-images").upload(path,file,{upsert:false,contentType,cacheControl:"31536000"});
    if(error)throw new Error(`Picture upload failed: ${error.message}`);
    if(!data?.path)throw new Error("Picture upload failed. Please try again.");
    const publicUrl=supabase.storage.from("product-images").getPublicUrl(data.path).data.publicUrl;
    if(!publicUrl)throw new Error("Could not create picture URL.");
    return publicUrl;
  }

  async function addProduct(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    if(!session||!allowed)return;
    if(!image){setMsg("Please choose a product picture first.");return;}
    setBusy(true);setMsg("1/2 Uploading product picture...");
    const form=e.currentTarget;const f=new FormData(form);
    try{
      const name=String(f.get("name")||"").trim();
      if(!name)throw new Error("Product name is required.");
      const image_url=await uploadToProductImages(image);
      setMsg("2/2 Picture uploaded. Saving product...");
      const slug=`${slugify(name)}-${Date.now().toString(36)}-${crypto.randomUUID().slice(0,8)}`;
      const payload={slug,name,category:String(f.get("category")||""),description:String(f.get("description")||"").trim(),price:Number(f.get("price")||0),compare_at_price:f.get("compare_at_price")?Number(f.get("compare_at_price")):null,stock:Number(f.get("stock")||0),sku:String(f.get("sku")||"").trim()||null,sizes:String(f.get("sizes")||"").split(",").map(x=>x.trim()).filter(Boolean),colors:String(f.get("colors")||"").split(",").map(x=>x.trim()).filter(Boolean),image_url,featured:f.get("featured")==="on",active:true,created_by:session.user.id};
      const {error}=await supabase.from("products").insert(payload);
      if(error)throw new Error(`Product save failed: ${error.message}`);
      form.reset();setImage(null);await loadManageable();setMsg("✅ Product added successfully with picture.");
    }catch(err:any){setMsg(`❌ ${String(err?.message||"Could not add product.")}`);}
    setBusy(false);
  }

  async function replaceOwnProductImage(e:FormEvent<HTMLFormElement>){
    e.preventDefault();if(!session||!allowed||!replaceProductId||!replacementImage){setMsg("Select your product and choose a new image first.");return;}
    setBusy(true);setMsg("Uploading replacement picture...");
    try{
      const imageUrl=await uploadToProductImages(replacementImage);
      const {data,error}=await supabase.rpc("update_own_product_image",{p_product_id:replaceProductId,p_image_url:imageUrl});
      if(error)throw error;if(!data)throw new Error("You can only change images on products created by this staff account.");
      setReplacementImage(null);await loadManageable();setMsg("Product image updated successfully.");
    }catch(err:any){setMsg(err?.message||"Could not update image.");}setBusy(false);
  }

  async function addDiscount(e:FormEvent<HTMLFormElement>){
    e.preventDefault();if(!session||!allowed)return;setBusy(true);setMsg("");const form=e.currentTarget;const f=new FormData(form);
    const payload={code:String(f.get("code")||"").trim().toUpperCase(),type:String(f.get("type")||"percent"),value:Number(f.get("value")||0),min_order:Number(f.get("min_order")||0),starts_at:f.get("starts_at")?new Date(String(f.get("starts_at"))).toISOString():null,ends_at:f.get("ends_at")?new Date(String(f.get("ends_at"))).toISOString():null,max_uses:f.get("max_uses")?Number(f.get("max_uses")):null,used_count:0,active:true,created_by:session.user.id};
    const {error}=await supabase.from("discounts").insert(payload);setBusy(false);if(error){setMsg(error.message);return;}form.reset();await loadManageable();setMsg("Discount added successfully.");
  }

  async function editDiscount(e:FormEvent<HTMLFormElement>,discountId:string){
    e.preventDefault();setBusy(true);setMsg("");const f=new FormData(e.currentTarget);
    const args={p_discount_id:discountId,p_code:String(f.get("code")||"").trim().toUpperCase(),p_type:String(f.get("type")||"percent"),p_value:Number(f.get("value")||0),p_min_order:Number(f.get("min_order")||0),p_starts_at:f.get("starts_at")?new Date(String(f.get("starts_at"))).toISOString():null,p_ends_at:f.get("ends_at")?new Date(String(f.get("ends_at"))).toISOString():null,p_max_uses:f.get("max_uses")?Number(f.get("max_uses")):null,p_active:f.get("active")==="on"};
    const {data,error}=await supabase.rpc("update_own_discount",args);setBusy(false);if(error){setMsg(error.message);return;}if(!data){setMsg("You can only edit discounts created by this staff account.");return;}await loadManageable();setMsg("Discount updated successfully.");
  }

  const dt=(v:string|null)=>v?new Date(v).toISOString().slice(0,16):"";

  if(!session)return <main style={box}>
    <h1 style={{fontFamily:"Georgia,serif",fontWeight:400}}>TITHONIA Staff Access</h1>
    <div style={{...card,maxWidth:520}}>
      <p style={{marginTop:0,color:"#765f54"}}>Password লাগবে না। নিচের button চাপলে শুধু approved Gmail-এ secure login link যাবে।</p>
      <div style={{...input,marginBottom:12,color:"#2c1914",fontWeight:700}}>{STAFF_EMAIL}</div>
      <button style={{...btn,width:"100%"}} onClick={passwordlessLogin} disabled={busy}>{busy?"Sending access link...":"Continue with this Gmail"}</button>
      {msg&&<p style={{lineHeight:1.5}}>{msg}</p>}
    </div>
  </main>;

  if(!allowed)return <main style={box}><h1 style={{fontFamily:"Georgia,serif",fontWeight:400}}>Activating Staff Access</h1><div style={{...card,maxWidth:520}}><p>Approved staff email gets limited permissions only.</p><div style={{display:"flex",gap:10}}><input style={input} value={invite} onChange={e=>setInvite(e.target.value)} placeholder="Backup one-time access code"/><button style={btn} onClick={claim} disabled={busy}>Activate</button></div><button onClick={()=>supabase.auth.signOut()} style={{marginTop:14,border:0,background:"transparent"}}>Sign out</button>{msg&&<p>{msg}</p>}</div></main>;

  return <main style={box}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:20,flexWrap:"wrap"}}><div><h1 style={{fontFamily:"Georgia,serif",fontWeight:400,marginBottom:4}}>TITHONIA Contributor Panel</h1><p style={{marginTop:0,color:"#765f54"}}>Product/image/discount management with limited permissions.</p></div><button style={btn} onClick={()=>supabase.auth.signOut()}>Sign out</button></div>
    {msg&&<div style={{...card,marginBottom:16,padding:14,fontWeight:600}}>{msg}</div>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:18}}>
      <section style={card}><h2>Add Product</h2><form onSubmit={addProduct} style={{display:"grid",gap:12}}>
        <input style={input} name="name" placeholder="Product name" required/>
        <div style={grid}><select style={input} name="category" required>{categories.map(c=><option key={c}>{c}</option>)}</select><input style={input} name="sku" placeholder="SKU (optional)"/></div>
        <textarea style={{...input,minHeight:120}} name="description" placeholder="Description" required/>
        <div style={grid}><input style={input} name="price" type="number" min="0" step="0.01" placeholder="Price" required/><input style={input} name="compare_at_price" type="number" min="0" step="0.01" placeholder="Old price (optional)"/><input style={input} name="stock" type="number" min="0" placeholder="Stock" required/></div>
        <div style={grid}><input style={input} name="sizes" placeholder="Sizes: S, M, L, XL"/><input style={input} name="colors" placeholder="Colors: Off White, Maroon"/></div>
        <div style={uploadBox}><strong style={{fontSize:18,color:"#5b120f"}}>Product Picture *</strong><span style={{fontSize:13,color:"#765f54"}}>Recommended: portrait photo. Website shows it in a clean 4:5 frame with center crop.</span><input style={{...input,padding:14,background:"#fff"}} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" required onChange={e=>setImage(e.target.files?.[0]||null)}/>{preview&&<div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:14,alignItems:"center"}}><img src={preview} alt="Product preview" style={{width:120,height:150,objectFit:"cover",objectPosition:"center",borderRadius:10,border:"1px solid #d8c7b7",background:"#eee"}}/><div><b>Website preview</b><p style={{margin:"6px 0",fontSize:12,color:"#765f54"}}>4:5 portrait • centered • cropped to fill</p><small>{image?.name} · {image?`${(image.size/1024/1024).toFixed(2)} MB`:""}</small></div></div>}</div>
        <label><input type="checkbox" name="featured"/> Featured product</label>
        <button style={{...btn,opacity:(busy||!image)?0.6:1}} disabled={busy||!image}>{busy?"Uploading & saving...":"Add Product"}</button>
      </form></section>

      <section style={card}><h2>Change Product Image</h2><p style={{color:"#765f54"}}>Only products uploaded by this staff account are listed.</p><form onSubmit={replaceOwnProductImage} style={{display:"grid",gap:12}}><select style={input} value={replaceProductId} onChange={e=>setReplaceProductId(e.target.value)} required><option value="">Select product</option>{ownProducts.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select><div style={uploadBox}><strong>New Product Picture</strong><input style={{...input,padding:14,background:"#fff"}} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" onChange={e=>setReplacementImage(e.target.files?.[0]||null)} required/></div><button style={btn} disabled={busy||!ownProducts.length}>Replace Image</button></form></section>

      <section style={card}><h2>Add Discount</h2><form onSubmit={addDiscount} style={{display:"grid",gap:12}}><div style={grid}><input style={input} name="code" placeholder="CODE" required/><select style={input} name="type"><option value="percent">Percent</option><option value="fixed">Fixed amount</option></select></div><div style={grid}><input style={input} name="value" type="number" min="0" step="0.01" placeholder="Value" required/><input style={input} name="min_order" type="number" min="0" step="0.01" placeholder="Minimum order" defaultValue="0"/></div><div style={grid}><label>Starts at<input style={input} name="starts_at" type="datetime-local"/></label><label>Ends at<input style={input} name="ends_at" type="datetime-local"/></label></div><input style={input} name="max_uses" type="number" min="1" placeholder="Maximum uses (optional)"/><button style={btn} disabled={busy}>Add Discount</button></form></section>

      <section style={card}><h2>Edit Your Discounts</h2><p style={{color:"#765f54"}}>Only discounts created by this staff account can be changed.</p>{ownDiscounts.length===0?<p>No editable discounts yet.</p>:<div style={{display:"grid",gap:14}}>{ownDiscounts.map(d=><form key={d.id} onSubmit={e=>editDiscount(e,d.id)} style={{border:"1px solid #eadfd4",borderRadius:10,padding:14,display:"grid",gap:10}}><div style={grid}><input style={input} name="code" defaultValue={d.code} required/><select style={input} name="type" defaultValue={d.type}><option value="percent">Percent</option><option value="fixed">Fixed amount</option></select></div><div style={grid}><input style={input} name="value" type="number" min="0" step="0.01" defaultValue={d.value} required/><input style={input} name="min_order" type="number" min="0" step="0.01" defaultValue={d.min_order}/></div><div style={grid}><label>Starts at<input style={input} name="starts_at" type="datetime-local" defaultValue={dt(d.starts_at)}/></label><label>Ends at<input style={input} name="ends_at" type="datetime-local" defaultValue={dt(d.ends_at)}/></label></div><input style={input} name="max_uses" type="number" min="1" defaultValue={d.max_uses??""} placeholder="Maximum uses"/><label><input type="checkbox" name="active" defaultChecked={d.active}/> Active</label><button style={btn} disabled={busy}>Save Discount Changes</button></form>)}</div>}</section>
    </div>
  </main>;
}