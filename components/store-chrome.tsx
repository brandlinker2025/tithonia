"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, MessageCircle, ShoppingBag, X } from "lucide-react";
import { cartCount, CART_EVENT, readCart } from "@/lib/cart";
import {
  ADDRESS_FULL,
  EMAIL,
  FACEBOOK,
  LOGO_SRC,
  MAPS,
  PHONE_DISPLAY,
  SITE_NAME,
  SITE_TAGLINE,
  whatsappHref,
} from "@/lib/site";

function AnnouncementBar() {
  return (
    <div className="announcement" role="region" aria-label="Store announcement">
      <div className="wrap announcement-inner">
        <p>Cash on Delivery Available All Over Bangladesh</p>
      </div>
    </div>
  );
}

function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(cartCount(readCart()));
    sync();
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setCollectionsOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="wrap nav">
        <Link href="/" className="brand-lockup" aria-label="Tithonia home">
          <Image className="brand-logo" src={LOGO_SRC} alt="Tithonia logo" width={86} height={86} priority />
          <span className="brand-word">
            <b>{SITE_NAME.toUpperCase()}</b>
            <small>{SITE_TAGLINE}</small>
          </span>
        </Link>
        <nav className={`main-nav ${open ? "open" : ""}`} aria-label="Primary">
          <Link href="/" className={pathname === "/" ? "active" : ""}>Home</Link>
          <Link href="/shop" className={pathname === "/shop" ? "active" : ""}>Products</Link>
          <div className={`nav-dropdown ${collectionsOpen ? "open" : ""}`}>
            <button
              type="button"
              className="nav-dropdown-btn"
              aria-expanded={collectionsOpen}
              aria-haspopup="true"
              onClick={() => setCollectionsOpen((value) => !value)}
            >
              Collections <ChevronDown size={16} />
            </button>
            <div className="nav-dropdown-menu" role="menu">
              <Link href="/shop?category=western" role="menuitem">Western Wear</Link>
              <Link href="/shop?category=three-piece" role="menuitem">Three-Piece</Link>
            </div>
          </div>
          <Link href="/about">About</Link>
          <Link href="/about#contact">Contact</Link>
        </nav>
        <div className="nav-actions">
          <Link className="bag" href="/checkout" aria-label={`Cart, ${count} items`}>
            <ShoppingBag size={22} aria-hidden="true" />
            <span className="bag-count">{count}</span>
          </Link>
          <button className="menu-btn" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer>
      <div className="wrap footer-grid">
        <div>
          <div className="footer-brand">
            <Image src={LOGO_SRC} alt="Tithonia logo" width={55} height={55} />
            <span>TITHONIA</span>
          </div>
          <p>Premium Western Wear and Three-Piece collections for women in Bangladesh, with Cash on Delivery nationwide.</p>
        </div>
        <div>
          <b>Contact</b>
          <a href={`tel:${PHONE_DISPLAY}`}>{PHONE_DISPLAY}</a>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <a href={whatsappHref()}>WhatsApp</a>
        </div>
        <div>
          <b>Location</b>
          <a href={MAPS}>Google Maps</a>
          <small>{ADDRESS_FULL}</small>
        </div>
        <div>
          <b>Social</b>
          <a href={FACEBOOK}>Facebook</a>
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
        </div>
      </div>
      <div className="wrap footer-bottom">© {new Date().getFullYear()} TITHONIA. All rights reserved.</div>
    </footer>
  );
}

export default function StoreChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/staff")) return <>{children}</>;
  return (
    <div className="site-shell">
      <div className="site-top">
        <AnnouncementBar />
        <SiteHeader />
      </div>
      {children}
      <SiteFooter />
      <a className="wa-fab" href={whatsappHref()} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={22} aria-hidden="true" />
        <span>WhatsApp</span>
      </a>
    </div>
  );
}
