"use client";

import {useEffect} from "react";

const targets:Record<string,string>={
  Home:"/",
  Products:"/shop",
  Collections:"/shop#shop",
  About:"/about",
  Contact:"/about#contact",
};

export default function NavFix(){
  useEffect(()=>{
    const cleanups:Array<()=>void>=[];
    const apply=()=>{
      document.querySelectorAll<HTMLAnchorElement>(".main-nav a").forEach(a=>{
        const label=(a.textContent||"").trim();
        const href=targets[label];
        if(!href)return;
        a.setAttribute("href",href);
        if(a.dataset.tithoniaNavFixed==="1")return;
        a.dataset.tithoniaNavFixed="1";
        const click=(e:MouseEvent)=>{
          e.preventDefault();
          window.location.assign(href);
        };
        a.addEventListener("click",click);
        cleanups.push(()=>a.removeEventListener("click",click));
      });
    };
    apply();
    const observer=new MutationObserver(apply);
    observer.observe(document.body,{childList:true,subtree:true});
    return()=>{observer.disconnect();cleanups.forEach(fn=>fn())};
  },[]);

  return <style>{`
    .main-nav{display:flex;align-items:center;gap:10px}
    .main-nav a{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:9px 16px;border:1px solid #dfc5aa;border-radius:999px;background:linear-gradient(180deg,#fffaf3,#f7eadc);color:#5b120f!important;text-decoration:none!important;font-weight:800;letter-spacing:.02em;box-shadow:0 6px 16px rgba(91,18,15,.08);transition:transform .18s ease,box-shadow .18s ease,background .18s ease,color .18s ease,border-color .18s ease;cursor:pointer;white-space:nowrap}
    .main-nav a:hover{transform:translateY(-1px);background:linear-gradient(135deg,#5b120f,#7a201b);color:#fff!important;border-color:#5b120f;box-shadow:0 10px 22px rgba(91,18,15,.18)}
    @media(max-width:760px){
      .main-nav{display:none!important;position:absolute;top:84px;left:14px;right:14px;z-index:60;padding:14px;background:#fffaf3;border:1px solid #eadfd2;border-radius:18px;box-shadow:0 18px 40px rgba(70,30,15,.16);flex-direction:column;align-items:stretch;gap:8px}
      .main-nav.open{display:flex!important}
      .main-nav a{width:100%;min-height:44px}
    }
  `}</style>;
}
