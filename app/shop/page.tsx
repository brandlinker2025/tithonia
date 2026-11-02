import type { Metadata } from "next";
import ShopBrowser from "@/components/shop-browser";
import JsonLd from "@/components/json-ld";
import { loadProducts } from "@/lib/products";
import { breadcrumbJsonLd, shopMetadata } from "@/lib/seo";

export const revalidate = 60;

type Search = Promise<{ category?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: Search }): Promise<Metadata> {
  const { category } = await searchParams;
  return shopMetadata(category);
}

export default async function ShopPage({ searchParams }: { searchParams: Search }) {
  const { category } = await searchParams;
  const products = await loadProducts();
  const label = category === "western" ? "Western Wear" : category === "three-piece" ? "Three-Piece" : "Shop";
  return (
    <main id="main">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: label, path: category ? `/shop?category=${category}` : "/shop" }])} />
      <ShopBrowser products={products} initialCategory={category} />
    </main>
  );
}
