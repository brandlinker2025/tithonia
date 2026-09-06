"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, Menu, Search, ShieldCheck, ShoppingBag, Sparkles, Truck, X } from "lucide-react";
import type { CartItem, Product } from "@/lib/types";

const KEY = "tithonia-cart-v1";
const categories = ["T-Shirt", "Three Piece", "Saree", "Shoes"] as const;
const money = (n:number) => new Intl.NumberFormat("en-BD").format(n);

export default function Storefront(){
  const [products,setProducts]=useState<Product[]>([]);
  const [cart,setCart]=useState<CartItem[]>([]);
  const [menuOpen,setMenuOpen]=useState(false);
  const [active,setActive]=useState("All");

  useEffect(()=>{
    fetch("/api/products").then(r=>r.json()).then(j=>setProducts(j.products||[])).catch(()=>setProducts([]));
    try{setCart(JSON.parse(localStorage.getItem(KEY)||"[]"))}catch{setCart([])}
  },[]);

  const count=cart.reduce((s,x)=>s+x.qty,0);
  const visible=useMemo(()=>active==="All"?products:products.filter(p=>p.category===active),[products,active]);

  function add(p:Product){
    if(p.stock<1)return;
    const next=[...cart];
    const i=next.findIndex(x=>x.id===p.id);
    if(i>=0) next[i]={...next[i],qty:Math.min(next[i].qty+1,p.stock)};
    else next.push({...p,qty:1,selectedSize:p.sizes?.[0],selectedColor:p.colors?.[0]});
    setCart(next); localStorage.setItem(KEY,JSON.stringify(next));
  }

  return <div className="site-shell">
    <div className="announcement"><div className="wrap announcement-inner"><span><Sparkles size={13}/> Premium Quality</span><span>Timeless Style</span><span className="push"/><span><Truck size={13}/> Cash on Delivery Across Bangladesh</span></div></div>

    <header className="site-header"><div className="wrap nav">
      <Link href="/" className="brand-lockup" aria-label="Tithonia home"><img className="brand-logo" src="/tithonia-logo.svg" alt="Tithonia"/><span className="brand-name">TITHONIA</span></Link>
      <nav className={`main-nav ${menuOpen?"open":""}`}><a href="#home">Home</a><a href="#shop">Products</a><a href="#collections">Collections</a><a href="#story">About</a><a href="#contact">Contact</a></nav>
      <div className="nav-actions"><button className="icon-btn" aria-label="Search"><Search size={20}/></button><button className="icon-btn desktop" aria-label="Wishlist"><Heart size={20}/></button><Link className="bag" href="/checkout"><ShoppingBag size={20}/>{count>0&&<span>{count}</span>}</Link><button className="menu-btn" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</button></div>
    </div></header>

    <main>
      <section className="hero" id="home"><div className="wrap hero-grid">
        <div className="hero-copy"><p className="eyebrow">MORE THAN FASHION</p><h1>A Timeless<br/>Expression of <em>You</em></h1><p>Premium essentials crafted with care, confidence and quiet luxury for modern Bangladesh.</p><a className="primary" href="#shop">SHOP NOW <ArrowRight size={17}/></a><div className="hero-points"><span><ShieldCheck/>Premium Quality</span><span><Sparkles/>Refined Craft</span><span><Heart/>Style with Purpose</span></div></div>
        <div className="hero-art"><div className="hero-orb"><img src="/tithonia-logo.svg" alt="Tithonia luxury logo"/></div><div className="silk silk-a"/><div className="silk silk-b"/><p className="signature">Wear<br/>A Better You</p></div>
      </div></section>

      <section className="categories" id="collections"><div className="wrap"><div className="section-title"><h2>Shop by Category</h2><p>DISCOVER YOUR STYLE</p></div><div className="category-grid">{categories.map((c,i)=><button key={c} onClick={()=>{setActive(c);document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})}}><span className={`category-art cat-${i+1}`}>{c==="T-Shirt"?"T":c==="Three Piece"?"3P":c==="Saree"?"S":"SH"}</span><strong>{c}</strong><small>{i===0?"Sophisticated essentials":i===1?"Grace in every detail":i===2?"Heritage, refined":"Complete your look"}</small><em>SHOP NOW →</em></button>)}</div></div></section>

      <section className="services"><div className="wrap service-grid"><div><Truck/><span><b>Cash on Delivery</b><small>Across Bangladesh</small></span></div><div><ShieldCheck/><span><b>Secure Shopping</b><small>Your data, our priority</small></span></div><div><Sparkles/><span><b>Premium Selection</b><small>Curated with care</small></span></div><div><Heart/><span><b>Made with Purpose</b><small>Luxury in every detail</small></span></div></div></section>

      <section className="story" id="story"><div className="story-copy"><p className="eyebrow gold">OUR PHILOSOPHY</p><h2>Details Make<br/>the Difference</h2><p>At Tithonia, true style lives in the details — thoughtful design, premium materials and elegant finishing for a more confident everyday.</p><a href="#shop">EXPLORE TITHONIA <ArrowRight size={15}/></a></div><div className="story-art"><img src="/tithonia-logo.svg" alt="Tithonia emblem"/></div></section>

      <section className="shop wrap" id="shop"><div className="shop-head"><div><h2>Featured Products</h2><p>HANDPICKED JUST FOR YOU</p></div><div className="filters">{["All",...categories].map(c=><button className={active===c?"active":""} key={c} onClick={()=>setActive(c)}>{c}</button>)}</div></div><div className="product-grid">{visible.map((p,i)=><article className="product" key={p.id}><div className={`product-image tone-${i%4+1}`}>{p.image?<img src={p.image} alt={p.name}/>:<img className="product-logo" src="/tithonia-logo.svg" alt=""/>}{p.featured&&<span className="badge">FEATURED</span>}</div><div className="product-body"><small>{p.category}</small><h3>{p.name}</h3><p>{p.description}</p><div className="price"><b>৳{money(p.price)}</b>{p.compareAtPrice&&p.compareAtPrice>p.price?<del>৳{money(p.compareAtPrice)}</del>:null}</div><div className="stock">{p.stock>0?`${p.stock} in stock`:"Sold out"}</div><button disabled={!p.stock} onClick={()=>add(p)}><ShoppingBag size={15}/>{p.stock?"ADD TO BAG":"SOLD OUT"}</button></div></article>)}</div>{visible.length===0&&<div className="empty">Our curated pieces are being prepared. Please check back shortly.</div>}</section>

      <section className="contact" id="contact"><div className="wrap contact-inner"><div><p className="eyebrow gold">THE TITHONIA CIRCLE</p><h2>Stay close to timeless style.</h2></div><div><p>Discover new arrivals, private offers and stories from Tithonia.</p><a href="mailto:hello@tithonia.online">CONTACT US <ArrowRight size={15}/></a></div></div></section>
    </main>

    <footer><div className="wrap footer-grid"><div><img className="footer-logo" src="/tithonia-logo.svg" alt="Tithonia"/><p>Premium fashion, thoughtfully curated and delivered across Bangladesh.</p></div><div><b>Shop</b><a href="#shop">New Arrivals</a><a href="#collections">Collections</a></div><div><b>Help</b><a href="mailto:hello@tithonia.online">Contact</a><Link href="/checkout">Checkout</Link></div><div><b>Official Website</b><a href="https://www.tithonia.online">www.tithonia.online</a><small>Bangladesh</small></div></div><div className="wrap footer-bottom">© {new Date().getFullYear()} TITHONIA. All rights reserved.</div></footer>
  </div>
}
