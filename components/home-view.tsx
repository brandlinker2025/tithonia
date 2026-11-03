import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Headphones, ShieldCheck, Sparkles, Truck } from "lucide-react";
import type { Product } from "@/lib/types";
import { HERO_SRC } from "@/lib/site";
import { FAQS } from "@/lib/seo";
import ProductCard from "@/components/product-card";
import JsonLd from "@/components/json-ld";
import { faqJsonLd, organizationJsonLd } from "@/lib/seo";
import { hasValidImage, validImageUrls } from "@/lib/has-valid-image";

function productKeys(product: Product) {
  const name = product.name.trim().toLowerCase().replace(/\s+/g, " ");
  return [product.id, `name:${name}`];
}

function uniqueProducts(products: Product[], blocked = new Set<string>()) {
  const seen = new Set(blocked);
  const unique: Product[] = [];
  for (const product of products) {
    const keys = productKeys(product);
    if (keys.some((key) => seen.has(key))) continue;
    keys.forEach((key) => seen.add(key));
    unique.push(product);
  }
  return unique;
}

function withDisplayImages(product: Product): Product {
  const images = validImageUrls(product);
  return { ...product, image: images[0] ?? null, images };
}

function ProductSection({
  eyebrow,
  title,
  href,
  linkLabel,
  products,
  keyPrefix = "",
  priority = false,
}: {
  eyebrow: string;
  title: string;
  href: string;
  linkLabel: string;
  products: Product[];
  keyPrefix?: string;
  priority?: boolean;
}) {
  if (!products.length) return null;
  return (
    <section className="home-section wrap">
      <div className="section-head">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <Link className="view-all" href={href}>{linkLabel} <ArrowRight size={14} /></Link>
      </div>
      <div className="product-grid">
        {products.map((product, index) => (
          <ProductCard key={`${keyPrefix}${product.id}`} product={product} priority={priority && index < 4} />
        ))}
      </div>
    </section>
  );
}

export default function HomeView({ products }: { products: Product[] }) {
  const pictured = products.filter(hasValidImage).map(withDisplayImages);
  const byFeatured = [...pictured].sort((a, b) => {
    const featuredRank = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    if (featuredRank) return featuredRank;
    return Date.parse(b.createdAt || "") - Date.parse(a.createdAt || "");
  });
  const featured = uniqueProducts(byFeatured).slice(0, 8);
  const featuredKeys = new Set(featured.flatMap(productKeys));
  const byNewest = [...pictured].sort((a, b) => Date.parse(b.createdAt || "") - Date.parse(a.createdAt || ""));
  const otherArrivals = uniqueProducts(byNewest, featuredKeys);
  const arrivals = otherArrivals.length ? otherArrivals.slice(0, 8) : [];
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

      <ProductSection
        eyebrow="FEATURED"
        title="Featured Products"
        href="/shop"
        linkLabel="View all"
        products={featured}
        priority
      />

      <ProductSection
        eyebrow="JUST IN"
        title="New Arrivals"
        href="/shop"
        linkLabel="Shop new"
        products={arrivals}
        keyPrefix="new-"
      />

      <section className="story about-block" id="story">
        <div className="story-copy">
          <p className="eyebrow gold">ABOUT TITHONIA</p>
          <h2>Women's fashion from Dhaka, made for every day</h2>
          <p>Tithonia is a women's fashion Bangladesh brand built for real wardrobes — not just occasion photos. From our Dhaka studio we curate premium Western Wear sourced from China and a trendy three-piece online shop that feels current, comfortable and well finished for workdays, weekends and family events.</p>
          <p>Whether you are dressing for the office in western wear Dhaka style or choosing a three-piece for celebrations, we keep prices honest and quality visible in the fabric, stitching and fit. Every order is packed for Cash on Delivery across Bangladesh, so you can shop online with the same ease as your neighbourhood store and pay when the parcel arrives.</p>
          <Link className="ghost light" href="/about">Read our story</Link>
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
