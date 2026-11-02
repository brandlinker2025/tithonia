"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { addToCart } from "@/lib/cart";
import { isNewProduct, money } from "@/lib/site";
import { productHref } from "@/lib/products";

function ProductImg({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={600}
      height={800}
      sizes="(max-width: 760px) 50vw, 25vw"
      className="product-photo"
      loading={priority ? "eager" : "lazy"}
      priority={priority}
    />
  );
}

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [added, setAdded] = useState(false);
  const href = productHref(product);
  const gallery = product.images?.length ? product.images : product.image ? [product.image] : [];
  const primary = gallery[0];
  const hover = gallery[1];
  const soldOut = product.stock < 1;
  const showNew = !soldOut && (product.featured || isNewProduct(product.createdAt));
  const alt = `${product.name} ${product.category.toLowerCase()} for women - Tithonia`;

  function quickAdd() {
    if (soldOut) return;
    addToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <article className="product">
      <Link href={href} className="product-image-link">
        <div className={`product-image ${hover ? "has-hover" : ""}`}>
          {primary ? (
            <>
              <ProductImg src={primary} alt={alt} priority={priority} />
              {hover ? <Image src={hover} alt="" width={600} height={800} className="product-photo hover-photo" sizes="(max-width: 760px) 50vw, 25vw" /> : null}
            </>
          ) : (
            <div className="product-fallback" aria-hidden="true">Image coming soon</div>
          )}
          {soldOut ? <span className="badge sold">Sold out</span> : showNew ? <span className="badge">New</span> : null}
        </div>
      </Link>
      <div className="product-body">
        <small>{product.category}</small>
        <h3><Link href={href}>{product.name}</Link></h3>
        <div className="price">
          <b>৳{money(product.price)}</b>
          {product.compareAtPrice && product.compareAtPrice > product.price ? <del>৳{money(product.compareAtPrice)}</del> : null}
        </div>
        <button type="button" disabled={soldOut} onClick={quickAdd}>
          <ShoppingBag size={16} aria-hidden="true" />
          {soldOut ? "Sold out" : added ? "Added" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}
