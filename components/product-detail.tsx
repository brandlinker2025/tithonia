"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MessageCircle, Ruler, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { addToCart } from "@/lib/cart";
import { money, whatsappHref } from "@/lib/site";
import { validImageUrls } from "@/lib/has-valid-image";

export default function ProductDetail({ product }: { product: Product }) {
  const [size, setSize] = useState(product.sizes?.[0] || "");
  const [color, setColor] = useState(product.colors?.[0] || "");
  const [guideOpen, setGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const gallery = validImageUrls(product);
  const soldOut = product.stock < 1;
  const alt = `${product.name} ${product.category.toLowerCase()} for women - Tithonia`;
  const waText = `Hi Tithonia, I want to order ${product.name}${size ? `, size ${size}` : ""}`;

  function add() {
    if (soldOut) return;
    addToCart(product, { size, color });
    setAdded(true);
  }

  return (
    <article className="product-page wrap">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / <span>{product.name}</span>
      </nav>
      <div className="product-page-grid">
        <div className="product-page-media">
          {gallery[0] ? (
            <Image src={gallery[0]} alt={alt} width={900} height={1200} className="product-hero-photo" priority />
          ) : (
            <div className="product-fallback tall">Product image coming soon</div>
          )}
        </div>
        <div className="product-page-copy">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <div className="price lg"><b>৳{money(product.price)}</b>{product.compareAtPrice && product.compareAtPrice > product.price ? <del>৳{money(product.compareAtPrice)}</del> : null}</div>
          <p>{product.description}</p>
          <p className="delivery-line">Inside Dhaka 1-2 days, Outside Dhaka 3-5 days — Cash on Delivery</p>
          {product.sizes?.length ? (
            <div>
              <div className="inline-head">
                <b>Size</b>
                <button type="button" className="text-btn" onClick={() => setGuideOpen(true)}><Ruler size={16} /> Size guide</button>
              </div>
              <div className="filters left">
                {product.sizes.map((value) => (
                  <button type="button" key={value} className={size === value ? "active" : ""} onClick={() => setSize(value)}>{value}</button>
                ))}
              </div>
            </div>
          ) : null}
          {product.colors?.length ? (
            <label className="field">
              Color
              <select value={color} onChange={(e) => setColor(e.target.value)}>
                {product.colors.map((value) => <option key={value}>{value}</option>)}
              </select>
            </label>
          ) : null}
          <div className="product-actions">
            <button type="button" className="primary" disabled={soldOut} onClick={add}>
              <ShoppingBag size={18} /> {soldOut ? "Sold out" : added ? "Added to bag" : "Add to Cart"}
            </button>
            <a className="wa-btn" href={whatsappHref(waText)} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} /> Order on WhatsApp
            </a>
          </div>
          {added ? <p><Link href="/checkout">Go to checkout</Link></p> : null}
        </div>
      </div>
      {guideOpen && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="size-guide-title" onClick={() => setGuideOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 id="size-guide-title">Size guide</h2>
            <table className="size-table">
              <thead><tr><th>Size</th><th>Bust</th><th>Waist</th><th>Hip</th></tr></thead>
              <tbody>
                <tr><td>S</td><td>34&quot;</td><td>26&quot;</td><td>36&quot;</td></tr>
                <tr><td>M</td><td>36&quot;</td><td>28&quot;</td><td>38&quot;</td></tr>
                <tr><td>L</td><td>38&quot;</td><td>30&quot;</td><td>40&quot;</td></tr>
                <tr><td>XL</td><td>40&quot;</td><td>32&quot;</td><td>42&quot;</td></tr>
              </tbody>
            </table>
            <button type="button" className="primary" onClick={() => setGuideOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </article>
  );
}
