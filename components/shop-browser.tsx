"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { matchesShopGroup, shopGroupLabel } from "@/lib/products";
import ProductCard from "@/components/product-card";

type SortKey = "newest" | "price-asc" | "price-desc";

export default function ShopBrowser({
  products,
  initialCategory,
}: {
  products: Product[];
  initialCategory?: string;
}) {
  const router = useRouter();
  const [category, setCategory] = useState(initialCategory || "all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [size, setSize] = useState("all");

  useEffect(() => {
    setCategory(initialCategory || "all");
  }, [initialCategory]);

  const grouped = useMemo(() => products.filter((product) => matchesShopGroup(product, category === "all" ? undefined : category)), [products, category]);
  const sizes = useMemo(() => Array.from(new Set(grouped.flatMap((product) => product.sizes || []))), [grouped]);
  const visible = useMemo(() => {
    const next = grouped.filter((product) => size === "all" || (product.sizes || []).includes(size));
    next.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return Date.parse(b.createdAt || "") - Date.parse(a.createdAt || "");
    });
    return next;
  }, [grouped, size, sort]);

  function changeCategory(next: string) {
    setCategory(next);
    setSize("all");
    const href = next === "all" ? "/shop" : `/shop?category=${next}`;
    router.replace(href, { scroll: false });
  }

  return (
    <section className="shop wrap" id="shop">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> / <span>{shopGroupLabel(category === "all" ? undefined : category)}</span>
      </nav>
      <div className="section-title">
        <p className="eyebrow">TITHONIA SHOP</p>
        <h1>{shopGroupLabel(category === "all" ? undefined : category)}</h1>
        <p>Premium Western Wear and Three-Piece collections with Cash on Delivery across Bangladesh.</p>
      </div>
      <div className="shop-toolbar">
        <div className="filters" role="group" aria-label="Category filter">
          {[
            ["all", "All"],
            ["western", "Western Wear"],
            ["three-piece", "Three-Piece"],
          ].map(([value, label]) => (
            <button key={value} type="button" className={category === value ? "active" : ""} onClick={() => changeCategory(value)}>
              {label}
            </button>
          ))}
        </div>
        <div className="shop-controls">
          {sizes.length > 0 && (
            <label>
              Size
              <select value={size} onChange={(e) => setSize(e.target.value)} aria-label="Filter by size">
                <option value="all">All sizes</option>
                {sizes.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>
          )}
          <label>
            Sort
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort products">
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
        </div>
      </div>
      {visible.length ? (
        <div className="product-grid">{visible.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 4} />)}</div>
      ) : (
        <p className="empty-note">No products in this filter yet. Check back soon or browse all collections.</p>
      )}
    </section>
  );
}
