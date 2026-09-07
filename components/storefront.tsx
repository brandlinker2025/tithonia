"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, Menu, Search, ShieldCheck, ShoppingBag, Sparkles, Truck, X, Headphones, Gem, Phone, MapPin } from "lucide-react";
import type { CartItem, Product } from "@/lib/types";

const KEY = "tithonia-cart-v1";
const categories = ["T-Shirt", "Three Piece", "Saree", "Shoes"] as const;
const money = (n:number) => new Intl.NumberFormat("en-BD").format(n);
const LOGO = "/tithonia-logo.jpg";

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
    setCart(next);
    localStorage.setItem(KEY,JSON.stringify(next));
  }

  return <div className="site-shell">
    <div className="announcement"><div className="wrap announcement-inner"><span><Sparkles size={13}/> Premium Quality</span><i/> <span>Timeless Style</span><i/> <span>Made for a Better You</span><span className="announcement-spacer"/><span><Truck size={13}/> Cash on Delivery Available</span><i/> <span>Bangladesh</span></div></div>

    <header className="site-header"><div className="wrap nav">
      <Link href="/" className="brand-lockup" aria-label="Tithonia home"><img className="brand-logo" src={LOGO} alt="Tithonia"/><span className="brand-word"><b>TITHONIA</b><small>MORE THAN FASHION</small></span></Link>
      <nav className={`main-nav ${menuOpen?"open":""}`}><a className="active-link" href="#home">Home</a><a href="#shop">Products</a><a href="#collections">Collections</a><a href="#story">About</a><a href="#contact">Contact</a></nav>
      <div className="nav-actions"><button className="icon-btn" aria-label="Search"><Search size={20}/></button><button className="icon-btn desktop" aria-label="Wishlist"><Heart size={20}/></button><Link className="bag" href="/checkout"><ShoppingBag size={20}/>{count>0&&<span>{count}</span>}</Link><button className="menu-btn" aria-label="Menu" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</button></div>
    </div></header>

    <main>
      <section className="hero" id="home"><div className="wrap hero-grid">
        <div className="hero-copy"><p className="eyebrow">MORE THAN FASHION</p><h1>A Timeless<br/>Expression of <em>You</em></h1><p className="hero-lead">Premium essentials crafted with care,<br/>for a more confident everyday.</p><a className="primary" href="#shop">SHOP NOW <ArrowRight size={17}/></a><div className="hero-dots"><b/><span/><span/></div></div>
        <div className="hero-art"><div className="silk silk-one"/><div className="silk silk-two"/><div className="label-card"><img src={LOGO} alt="Tithonia luxury emblem"/><div className="label-domain">www.tithonia.online</div></div><p className="signature">Wear<br/>A Better You</p><div className="hero-box">GOOD<br/>STYLE<br/>BRIGHTER<br/>DAYS</div></div>
      </div></section>

      <section className="service-band"><div className="wrap service-grid">
        <div><Gem/><span><b>Premium Quality</b><small>Carefully Selected</small></span></div>
        <div><Sparkles/><span><b>Everyday Comfort</b><small>Feel Good, Always</small></span></div>
        <div><Heart/><span><b>Thoughtful Design</b><small>Made for a Better You</small></span></div>
        <div><Truck/><span><b>Cash on Delivery</b><small>Available Across Bangladesh</small></span></div>
        <div><ShieldCheck/><span><b>Secure Shopping</b><small>Your Data, Our Priority</small></span></div>
        <div><Headphones/><span><b>Dedicated Support</b><small>We're Here to Help</small></span></div>
      </div></section>

      <section className="categories" id="collections"><div className="wrap"><div className="section-title"><h2>Shop by Category</h2><p>DISCOVER YOUR STYLE</p></div><div className="category-grid">
        {categories.map((c,i)=><button key={c} className={`category-card cat-${i+1}`} onClick={()=>{setActive(c);document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})}}><div className="category-overlay"/><div className="category-content"><strong>{c==="T-Shirt"?"Men":c==="Three Piece"?"Women":c==="Saree"?"Accessories":"Gifts"}</strong><small>{i===0?"Sophisticated Essentials":i===1?"Grace in Every Detail":i===2?"Complete Your Look":"Thoughtful & Timeless"}</small><em>SHOP NOW <ArrowRight size={13}/></em></div></button>)}
      </div></div></section>

      <section className="shop wrap" id="shop"><div className="shop-head"><div><h2>Featured Products</h2><p>HANDPICKED JUST FOR YOU</p></div><button className="view-all" onClick={()=>setActive("All")}>View All <ArrowRight size={14}/></button></div>
        <div className="filters">{["All",...categories].map(c=><button className={active===c?"active":""} key={c} onClick={()=>setActive(c)}>{c}</button>)}</div>
        <div className="product-grid">{visible.map((p,i)=><article className="product" key={p.id}><div className={`product-image tone-${i%4+1}`}>{p.image?<img src={p.image} alt={p.name}/>:<div className="product-fallback"><img src={LOGO} alt=""/></div>}{p.featured&&<span className="badge">{i%3===0?"New":i%3===1?"Bestseller":"Featured"}</span>}</div><div className="product-body"><small>{p.category}</small><h3>{p.name}</h3><p>{p.description}</p><div className="price"><b>৳{money(p.price)}</b>{p.compareAtPrice&&p.compareAtPrice>p.price?<del>৳{money(p.compareAtPrice)}</del>:null}</div><div className="stock">{p.stock>0?`${p.stock} in stock`:"Sold out"}</div><button disabled={!p.stock} onClick={()=>add(p)}><ShoppingBag size={15}/>{p.stock?"ADD TO BAG":"SOLD OUT"}</button></div></article>)}</div>
        {visible.length===0&&<div className="empty">Our curated pieces are being prepared. Please check back shortly.</div>}
      </section>

      <section className="story" id="story"><div className="story-copy"><p className="eyebrow gold">OUR PHILOSOPHY</p><h2>Details Make<br/>the Difference</h2><p>At Tithonia, true style lives in the details — thoughtful design, premium materials and elegant finishing for a more confident everyday.</p><a href="#shop">OUR STORY <ArrowRight size={15}/></a></div><div className="story-art"><div className="gift-box"><img src={LOGO} alt="Tithonia"/></div><div className="thank-card">Thank you<br/>for being part of<br/>our journey. ♡</div></div></section>

      <section className="contact" id="contact"><div className="wrap contact-inner"><div><p className="eyebrow gold">THE TITHONIA CIRCLE</p><h2>Stay close to timeless style.</h2></div><div><p>Discover new arrivals, private offers and stories from Tithonia.</p><a href="tel:01626896050">CALL 01626896050 <ArrowRight size={15}/></a></div></div></section>
    </main>

    <footer><div className="wrap footer-grid"><div><div className="footer-brand"><img src={LOGO} alt="Tithonia"/><span>TITHONIA</span></div><p>Premium fashion, thoughtfully curated and delivered across Bangladesh.</p></div><div><b>Shop</b><a href="#shop">New Arrivals</a><a href="#collections">Collections</a></div><div><b>Help</b><a href="tel:01626896050">01626896050</a><Link href="/checkout">Checkout</Link></div><div><b>Official Website</b><a href="https://www.tithonia.online">www.tithonia.online</a><small>East Monipur, Mirpur-10, Dhaka</small></div></div><div className="wrap footer-bottom">© {new Date().getFullYear()} TITHONIA. All rights reserved.</div></footer>

    <a className="wa-fab" href="https://wa.me/8801626896050" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Tithonia">
      <span className="wa-fab-pulse" aria-hidden/>
      <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden>
        <path fill="#fff" d="M19.11 17.3c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"/>
        <path fill="#fff" d="M16.02 3C9.39 3 4 8.39 4 15.02c0 2.12.55 4.19 1.6 6.02L4 29l8.15-1.56A12 12 0 0 0 16.02 27C22.65 27 28 21.61 28 15.02 28 8.39 22.65 3 16.02 3zm0 21.96c-1.88 0-3.72-.5-5.33-1.45l-.38-.23-4.84.93.98-4.72-.25-.4A9.9 9.9 0 0 1 6.06 15c0-5.5 4.47-9.96 9.96-9.96S25.98 9.5 25.98 15s-4.46 9.96-9.96 9.96z"/>
      </svg>
      <span className="wa-fab-label">WhatsApp</span>
    </a>
    <div className="contact-bar"><div className="wrap contact-bar-inner"><span><Phone size={14}/>01626896050</span><i/><span><MapPin size={14}/>East Monipur, Mirpur-10, Dhaka, Bangladesh</span><b>TITHONIA</b><span className="contact-domain">www.tithonia.online</span></div></div>
  </div>
}
