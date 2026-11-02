import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Headphones, ShieldCheck, Sparkles, Truck } from "lucide-react";
import type { Product } from "@/lib/types";
import { HERO_SRC } from "@/lib/site";
import { FAQS } from "@/lib/seo";
import ProductCard from "@/components/product-card";
import JsonLd from "@/components/json-ld";
import { faqJsonLd, organizationJsonLd } from "@/lib/seo";

const TESTIMONIALS = [
  { name: "Ayesha R.", city: "Dhaka", quote: "The co-ord set felt premium and the Cash on Delivery was easy. TODO: replace with a real customer review." },
  { name: "Nusrat K.", city: "Chattogram", quote: "Loved the three-piece colour and fit. TODO: replace with a real customer review." },
  { name: "Mahiya S.", city: "Sylhet", quote: "Quick delivery outside Dhaka and lovely finishing. TODO: replace with a real customer review." },
];

export default function HomeView({ products }: { products: Product[] }) {
  const featured = [...products].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 8);
  const arrivals = [...products].sort((a, b) => Date.parse(b.createdAt || "") - Date.parse(a.createdAt || "")).slice(0, 8);
  return (
    <main id="main">
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={faqJsonLd()} />
      <section className="hero" id="home">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">WOMEN'S FASHION BANGLADESH</p>
            <h1>Premium Western Wear & Three-Piece in Bangladesh</h1>
            <p className="hero-lead">A timeless expression of you — quality fashion at affordable prices, with Cash on Delivery all over Bangladesh.</p>
            <div className="hero-actions">
              <Link className="primary" href="/shop">Shop now <ArrowRight size={17} /></Link>
              <Link className="ghost" href="/shop?category=three-piece">Three-Piece</Link>
            </div>
          </div>
          <div className="hero-art">
            {/* TODO: Replace /public/hero-placeholder.jpg with a real Tithonia lifestyle or campaign photograph. */}
            <Image src={HERO_SRC} alt="Tithonia premium western wear lifestyle look" width={1200} height={675} className="hero-photo" priority />
          </div>
        </div>
      </section>

      <section className="trust-row" aria-label="Store promises">
        <div className="wrap trust-grid">
          <div><Sparkles size={22} aria-hidden="true" /><span>Premium Quality</span></div>
          <div><Truck size={22} aria-hidden="true" /><span>Cash on Delivery</span></div>
          <div><ShieldCheck size={22} aria-hidden="true" /><span>Secure Shopping</span></div>
          <div><Headphones size={22} aria-hidden="true" /><span>Support</span></div>
        </div>
      </section>

      <section className="home-section wrap">
        <div className="section-title">
          <p className="eyebrow">SHOP BY CATEGORY</p>
          <h2>Shop by Category</h2>
        </div>
        <div className="category-cards">
          <Link href="/shop?category=western" className="category-card">
            <span className="eyebrow">WESTERN WEAR</span>
            <strong>Modern sets sourced with care</strong>
            <em>Shop Western Wear</em>
          </Link>
          <Link href="/shop?category=three-piece" className="category-card two">
            <span className="eyebrow">THREE-PIECE</span>
            <strong>Trendy three-piece online shop</strong>
            <em>Shop Three-Piece</em>
          </Link>
        </div>
      </section>

      <section className="home-section wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">FEATURED</p>
            <h2>Featured Products</h2>
          </div>
          <Link className="view-all" href="/shop">View all <ArrowRight size={14} /></Link>
        </div>
        <div className="product-grid">{featured.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 4} />)}</div>
      </section>

      <section className="home-section wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">JUST IN</p>
            <h2>New Arrivals</h2>
          </div>
          <Link className="view-all" href="/shop">Shop new <ArrowRight size={14} /></Link>
        </div>
        <div className="product-grid">{arrivals.map((product) => <ProductCard key={`new-${product.id}`} product={product} />)}</div>
      </section>

      <section className="story about-block" id="story">
        <div className="story-copy">
          <p className="eyebrow gold">ABOUT TITHONIA</p>
          <h2>Women's fashion from Dhaka, made for every day</h2>
          <p>Tithonia is a women's fashion Bangladesh brand built for real wardrobes — not just occasion photos. From our Dhaka studio we curate premium Western Wear sourced from China and a trendy three-piece online shop that feels current, comfortable and well finished for workdays, weekends and family events.</p>
          <p>Whether you are dressing for the office in western wear Dhaka style or choosing a three-piece for celebrations, we keep prices honest and quality visible in the fabric, stitching and fit. Every order is packed for Cash on Delivery across Bangladesh, so you can shop online with the same ease as your neighbourhood store and pay when the parcel arrives.</p>
          <Link className="ghost light" href="/about">Read our story</Link>
        </div>
      </section>

      <section className="home-section wrap">
        <div className="section-title">
          <p className="eyebrow">LOVED BY CUSTOMERS</p>
          <h2>What women are saying</h2>
        </div>
        {/* TODO: Replace these three placeholder testimonials with real customer names, cities, and quotes. */}
        <div className="testimonial-grid">
          {TESTIMONIALS.map((item) => (
            <blockquote key={item.name} className="testimonial">
              <p>“{item.quote}”</p>
              <cite>{item.name}, {item.city}</cite>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="home-section wrap faq" id="faq">
        <div className="section-title">
          <p className="eyebrow">NEED TO KNOW</p>
          <h2>Frequently asked questions</h2>
        </div>
        <div className="faq-list">
          {FAQS.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
