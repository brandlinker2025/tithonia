"use client";

import {useEffect,useState} from "react";

const targets:Record<string,string>={
  Home:"/",
  Products:"/shop",
  Collections:"/shop#shop",
};

export default function NavFix(){
  const[infoOpen,setInfoOpen]=useState<"about"|"contact"|null>(null);

  useEffect(()=>{
    document.documentElement.setAttribute("data-tithonia-path",window.location.pathname);
    const cleanups:Array<()=>void>=[];
    const apply=()=>{
      document.querySelectorAll<HTMLAnchorElement>(".main-nav a").forEach(a=>{
        const label=(a.textContent||"").trim();
        const href=targets[label];
        if(href){
          a.setAttribute("href",href);
          if(a.dataset.tithoniaNavFixed==="1")return;
          a.dataset.tithoniaNavFixed="1";
          const click=(e:MouseEvent)=>{e.preventDefault();window.location.assign(href)};
          a.addEventListener("click",click);
          cleanups.push(()=>a.removeEventListener("click",click));
          return;
        }
        if(label==="About"||label==="Contact"){
          a.setAttribute("href","#");
          if(a.dataset.tithoniaPopupFixed==="1")return;
          a.dataset.tithoniaPopupFixed="1";
          const click=(e:MouseEvent)=>{e.preventDefault();setInfoOpen(label==="About"?"about":"contact")};
          a.addEventListener("click",click);
          cleanups.push(()=>a.removeEventListener("click",click));
        }
      });
    };
    apply();
    const observer=new MutationObserver(apply);
    observer.observe(document.body,{childList:true,subtree:true});
    return()=>{observer.disconnect();cleanups.forEach(fn=>fn())};
  },[]);

  return <>
    <style>{`
      html[data-tithonia-path="/"] .story,html[data-tithonia-path="/"] .contact{display:none!important}
      .main-nav{display:flex;align-items:center;gap:10px}
      .main-nav a{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:9px 16px;border:1px solid #dfc5aa;border-radius:999px;background:linear-gradient(180deg,#fffaf3,#f7eadc);color:#5b120f!important;text-decoration:none!important;font-weight:800;letter-spacing:.02em;box-shadow:0 6px 16px rgba(91,18,15,.08);transition:transform .18s ease,box-shadow .18s ease,background .18s ease,color .18s ease,border-color .18s ease;cursor:pointer;white-space:nowrap}
      .main-nav a:hover{transform:translateY(-1px);background:linear-gradient(135deg,#5b120f,#7a201b);color:#fff!important;border-color:#5b120f;box-shadow:0 10px 22px rgba(91,18,15,.18)}
      @media(max-width:760px){
        .main-nav{display:none!important;position:absolute;top:84px;left:14px;right:14px;z-index:60;padding:14px;background:#fffaf3;border:1px solid #eadfd2;border-radius:18px;box-shadow:0 18px 40px rgba(70,30,15,.16);flex-direction:column;align-items:stretch;gap:8px}
        .main-nav.open{display:flex!important}
        .main-nav a{width:100%;min-height:44px}
      }
    `}</style>
    {infoOpen&&<div role="dialog" aria-modal="true" onClick={()=>setInfoOpen(null)} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(32,14,10,.72)",display:"grid",placeItems:"center",padding:18,overflowY:"auto"}}>
      <section onClick={e=>e.stopPropagation()} style={{width:"min(940px,100%)",maxHeight:"90vh",overflowY:"auto",background:"#fffaf4",border:"1px solid #e4d2c0",borderRadius:22,boxShadow:"0 28px 90px rgba(0,0,0,.32)",color:"#2c1914",position:"relative"}}>
        <button onClick={()=>setInfoOpen(null)} aria-label="Close" style={{position:"sticky",top:16,float:"right",margin:"16px 16px 0 0",zIndex:2,border:0,borderRadius:999,padding:"10px 16px",background:"#5b120f",color:"#fff",fontWeight:800,cursor:"pointer"}}>CLOSE</button>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",clear:"both"}}>
          <div style={{padding:"34px",background:"#5b120f",color:"#fff"}}>
            <p style={{margin:"0 0 18px",color:"#e0b66e",fontWeight:700}}>ABOUT TITHONIA</p>
            <h2 style={{margin:"0 0 18px",fontFamily:"Georgia,serif",fontWeight:400,fontSize:32}}>Style for Every Occasion</h2>
            <p style={{lineHeight:1.6}}>Tithonia is a Bangladesh-based fashion business offering stylish Western Wear sourced from China and trendy Three-Piece collections available in Bangladesh.</p>
            <p style={{lineHeight:1.6}}>We focus on quality, style and affordable fashion for every occasion.</p>
          </div>
          <div style={{padding:"34px",background:"#321a13",display:"grid",placeItems:"center"}}><img src="/tithonia-logo.jpg" alt="Tithonia" style={{width:"min(280px,80%)",border:"18px solid #dec4a5",transform:"rotate(-7deg)",boxShadow:"0 16px 34px rgba(0,0,0,.25)"}}/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24,padding:"34px",background:"#741713",color:"#fff"}}>
          <div><p style={{margin:"0 0 18px",color:"#e0b66e",fontWeight:700}}>CONTACT TITHONIA</p><h2 style={{margin:0,fontFamily:"Georgia,serif",fontWeight:400,fontSize:30}}>Connect with us.</h2></div>
          <div style={{display:"grid",gap:12,fontSize:17}}>
            <a href="tel:01626896050" style={{color:"#e0b66e",textDecoration:"none"}}>☎ 01626896050</a>
            <a href="mailto:tithonia.online@gmail.com" style={{color:"#e0b66e",textDecoration:"none"}}>✉ tithonia.online@gmail.com</a>
            <a href="https://wa.me/8801626896050" style={{color:"#e0b66e",textDecoration:"none"}}>◯ WhatsApp 01626896050</a>
            <a href="https://maps.app.goo.gl/KEg8Bh58sTDGFGBz5?g_st=iwb" style={{color:"#e0b66e",textDecoration:"none"}}>⌖ Head Office: 1254, East Monipur, Dhaka, Bangladesh</a>
            <a href="https://www.facebook.com/share/1ESoX24JPy/?mibextid=wwXIfr" style={{color:"#e0b66e",textDecoration:"none"}}>Facebook</a>
          </div>
        </div>
      </section>
    </div>}
  </>;
}
