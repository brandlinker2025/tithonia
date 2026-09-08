"use client";

import Link from "next/link";
import {useState} from "react";
import {Heart,Mail,MapPin,Menu,MessageCircle,Phone,Search,ShoppingBag,Sparkles,Truck,X} from "lucide-react";

const LOGO="/tithonia-logo.jpg",PHONE="01626896050",EMAIL="tithonia.online@gmail.com",ADDRESS="Head Office: 1254, East Monipur, Dhaka, Bangladesh",FACEBOOK="https://www.facebook.com/share/1ESoX24JPy/?mibextid=wwXIfr",MAPS="https://maps.app.goo.gl/KEg8Bh58sTDGFGBz5?g_st=iwb";

export default function AboutPage(){
  const[menuOpen,setMenuOpen]=useState(false);
  return <div className="site-shell">
    <div className="announcement"><div className="wrap announcement-inner"><span><Sparkles size={13}/> Premium Quality</span><i/><span>Timeless Style</span><i/><span>Made for a Better You</span><span className="announcement-spacer"/><span><Truck size={13}/> Cash on Delivery Available</span><i/><span>Bangladesh</span></div></div>
    <header className="site-header"><div className="wrap nav"><Link href="/" className="brand-lockup"><img className="brand-logo" src={LOGO} alt="Tithonia"/><span className="brand-word"><b>TITHONIA</b><small>MORE THAN FASHION</small></span></Link><nav className={`main-nav ${menuOpen?"open":""}`}><Link href="/">Home</Link><Link href="/shop">Products</Link><Link href="/shop#shop">Collections</Link><Link href="/about">About</Link><Link href="/about#contact">Contact</Link></nav><div className="nav-actions"><button className="icon-btn" aria-label="Search"><Search size={20}/></button><button className="icon-btn desktop" aria-label="Wishlist"><Heart size={20}/></button><Link className="bag" href="/checkout"><ShoppingBag size={20}/></Link><button className="menu-btn" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</button></div></div></header>
    <main>
      <section className="story" id="story"><div className="story-copy"><p className="eyebrow gold">ABOUT TITHONIA</p><h2>Style for Every Occasion</h2><p>Tithonia is a Bangladesh-based fashion business offering stylish Western Wear sourced from China and trendy Three-Piece collections available in Bangladesh.</p><p>We focus on quality, style and affordable fashion for every occasion.</p></div><div className="story-art"><div className="gift-box"><img src={LOGO} alt="Tithonia"/></div></div></section>
      <section className="contact" id="contact"><div className="wrap contact-inner"><div><p className="eyebrow gold">CONTACT TITHONIA</p><h2>Connect with us.</h2></div><div style={{display:"grid",gap:10}}><a href={`tel:${PHONE}`}><Phone size={16}/> {PHONE}</a><a href={`mailto:${EMAIL}`}><Mail size={16}/> {EMAIL}</a><a href="https://wa.me/8801626896050"><MessageCircle size={16}/> WhatsApp {PHONE}</a><a href={MAPS}><MapPin size={16}/> {ADDRESS}</a><a href={FACEBOOK}>Facebook</a></div></div></section>
    </main>
    <footer><div className="wrap footer-grid"><div><div className="footer-brand"><img src={LOGO} alt="Tithonia"/><span>TITHONIA</span></div><p>Quality, style and affordable fashion for every occasion.</p></div><div><b>Contact</b><a href={`tel:${PHONE}`}>{PHONE}</a><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div><div><b>Location</b><a href={MAPS}>Google Maps</a><small>{ADDRESS}</small></div><div><b>Social</b><a href={FACEBOOK}>Facebook</a></div></div><div className="wrap footer-bottom">© {new Date().getFullYear()} TITHONIA. All rights reserved.</div></footer>
  </div>;
}
