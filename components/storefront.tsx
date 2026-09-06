"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Headphones,
  Menu,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import type { CartItem, Product } from "@/lib/types";

const KEY = "tithonia-cart-v1";
const categories = ["T-Shirt", "Three Piece", "Saree", "Shoes"] as const;

function money(value: number) {
  return new Intl.NumberFormat("en-BD").format(value);
}

export default function Storefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((j) => setProducts(j.products || []))
      .catch(() => setProducts([]));

    try {
      setCart(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {
      setCart([]);
    }
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const visibleProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((product) => product.category === activeCategory);
  }, [products, activeCategory]);

  function add(product: Product) {
    if (product.stock < 1) return;
    const next = [...cart];
    const index = next.findIndex((item) => item.id === product.id);

    if (index >= 0) {
      next[index] = {
        ...next[index],
        qty: Math.min(next[index].qty + 1, product.stock),
      };
    } else {
      next.push({
        ...product,
        qty: 1,
        selectedSize: product.sizes?.[0],
        selectedColor: product.colors?.[0],
      });
    }

    setCart(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  return (
    <div className="site-shell">
      <div className="announcement">
        <div className="wrap announcement-inner">
          <span><Sparkles size={13} /> Premium Quality</span>
          <span className="announcement-divider">Timeless Style</span>
          <span className="announcement-divider">Made for a Better You</span>
          <span className="announcement-spacer" />
          <span><Truck size={13} /> Cash on Delivery Across Bangladesh</span>
        </div>
      </div>

      <header className="site-header">
        <div className="wrap nav">
          <Link href="/" className="brand-lockup" aria-label="Tithonia home">
            <span className="brand-mark">T</span>
            <span className="brand">TITHONIA</span>
          </Link>

          <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#shop" onClick={() => setMenuOpen(false)}>Products</a>
            <a href="#collections" onClick={() => setMenuOpen(false)}>Collections</a>
            <a href="#story" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#support" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>

          <div className="nav-actions">
            <button className="icon-button desktop-icon" aria-label="Search"><Search size={20} /></button>
            <button className="icon-button desktop-icon" aria-label="Wishlist"><Heart size={20} /></button>
            <Link href="/checkout" className="bag-link" aria-label={`Shopping bag with ${cartCount} items`}>
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="bag-count">{cartCount}</span>}
            </Link>
            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">MORE THAN FASHION</p>
              <h1>A Timeless<br />Expression of <em>You</em></h1>
              <p className="hero-text">Premium fashion essentials crafted with care, confidence and quiet luxury for modern Bangladesh.</p>
              <a href="#shop" className="button primary-button">SHOP NOW <ArrowRight size={17} /></a>
              <div className="hero-points">
                <span><ShieldCheck size={24} /> Premium<br />Quality</span>
                <span><Sparkles size={24} /> Refined<br />Craft</span>
                <span><Heart size={24} /> Style with<br />Purpose</span>
              </div>
            </div>

            <div className="hero-art" aria-hidden="true">
              <div className="fabric-fold fabric-fold-one" />
              <div className="fabric-fold fabric-fold-two" />
              <div className="label-card">
                <span className="label-monogram">T</span>
                <span className="label-name">TITHONIA</span>
              </div>
              <span className="hero-script">Wear<br />A Better You</span>
            </div>
          </div>
        </section>

        <section className="category-section" id="collections">
          <div className="wrap">
            <div className="section-heading centered">
              <h2>Shop by Category</h2>
              <p className="eyebrow">DISCOVER YOUR STYLE</p>
            </div>
            <div className="category-grid">
              {categories.map((category, index) => (
                <button
                  key={category}
                  className="category-card"
                  onClick={() => {
                    setActiveCategory(category);
                    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <span className={`category-image category-image-${index + 1}`}>
                    <span>{category === "T-Shirt" ? "TS" : category === "Three Piece" ? "3P" : category === "Saree" ? "SR" : "SH"}</span>
                  </span>
                  <strong>{category}</strong>
                  <small>{category === "T-Shirt" ? "Sophisticated essentials" : category === "Three Piece" ? "Grace in every detail" : category === "Saree" ? "Heritage, refined" : "Complete your look"}</small>
                  <span className="category-link">SHOP NOW <ArrowRight size={13} /></span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="service-strip" id="support">
          <div className="wrap service-grid">
            <div><Truck size={28} /><span><strong>Cash on Delivery</strong><small>Available across Bangladesh</small></span></div>
            <div><ShieldCheck size={28} /><span><strong>Secure Shopping</strong><small>Your data, our priority</small></span></div>
            <div><PackageCheck size={28} /><span><strong>Easy Experience</strong><small>Thoughtful from cart to door</small></span></div>
            <div><Headphones size={28} /><span><strong>Dedicated Support</strong><small>We’re here to help</small></span></div>
          </div>
        </section>

        <section className="story-section" id="story">
          <div className="story-copy">
            <p className="eyebrow gold">OUR PHILOSOPHY</p>
            <h2>Details<br />Make the Difference</h2>
            <p>At Tithonia, true style lives in the details — thoughtful design, premium materials, beautiful finishing and a commitment to a better everyday.</p>
            <a href="#shop" className="button outline-button">EXPLORE TITHONIA <ArrowRight size={15} /></a>
          </div>
          <div className="story-visual" aria-hidden="true">
            <div className="gift-box">
              <span className="gift-mark">T</span>
              <span>TITHONIA</span>
            </div>
            <div className="thank-card">Thank you<br />for being part of<br />our journey.</div>
          </div>
        </section>

        <section className="shop wrap" id="shop">
          <div className="shop-header">
            <div>
              <h2>Featured Products</h2>
              <p className="eyebrow">HANDPICKED JUST FOR YOU</p>
            </div>
            <div className="filters" aria-label="Product categories">
              {["All", ...categories].map((category) => (
                <button key={category} className={activeCategory === category ? "active" : ""} onClick={() => setActiveCategory(category)}>{category}</button>
              ))}
            </div>
          </div>

          <div className="grid">
            {visibleProducts.map((product, index) => (
              <article key={product.id} className="card">
                <div className={`product-visual product-tone-${(index % 4) + 1}`}>
                  {product.image ? <img src={product.image} alt={product.name} /> : <span className="product-monogram">T</span>}
                  {product.compareAtPrice && product.compareAtPrice > product.price && <span className="badge">SALE</span>}
                  {product.featured && <span className="badge secondary-badge">FEATURED</span>}
                </div>
                <div className="card-body">
                  <small>{product.category}</small>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="price-row">
                    <strong>৳{money(product.price)}</strong>
                    {product.compareAtPrice && product.compareAtPrice > product.price && <del>৳{money(product.compareAtPrice)}</del>}
                  </div>
                  <div className="stock-row">
                    <span>{product.stock > 0 ? `${product.stock} in stock` : "Sold out"}</span>
                    {product.stock > 0 && product.stock <= 5 && <span className="low-stock">Limited</span>}
                  </div>
                  <button className="add-button" disabled={!product.stock} onClick={() => add(product)}>
                    {product.stock ? <><ShoppingBag size={16} /> ADD TO BAG</> : "SOLD OUT"}
                  </button>
                </div>
              </article>
            ))}
          </div>

          {visibleProducts.length === 0 && <div className="empty-products">Our curated pieces are being prepared. Please check back shortly.</div>}
        </section>

        <section className="newsletter">
          <div className="wrap newsletter-inner">
            <div>
              <p className="eyebrow gold">THE TITHONIA CIRCLE</p>
              <h2>Stay close to timeless style.</h2>
            </div>
            <div className="newsletter-copy">
              <p>Discover new arrivals, private offers and stories from Tithonia.</p>
              <a className="button light-button" href="mailto:hello@tithonia.online">CONTACT US <ArrowRight size={15} /></a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap footer-grid">
          <div>
            <div className="brand-lockup footer-brand"><span className="brand-mark">T</span><span className="brand">TITHONIA</span></div>
            <p>Premium fashion, thoughtfully curated and delivered across Bangladesh.</p>
          </div>
          <div><strong>Shop</strong><a href="#shop">New Arrivals</a><a href="#collections">Collections</a><a href="#shop">Featured</a></div>
          <div><strong>Help</strong><a href="mailto:hello@tithonia.online">Contact</a><a href="#support">Delivery</a><Link href="/checkout">Checkout</Link></div>
          <div><strong>Official Website</strong><a href="https://www.tithonia.online">www.tithonia.online</a><small>Bangladesh</small></div>
        </div>
        <div className="wrap footer-bottom">© {new Date().getFullYear()} TITHONIA. All rights reserved.</div>
      </footer>
    </div>
  );
}
