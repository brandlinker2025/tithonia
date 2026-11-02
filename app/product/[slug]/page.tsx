import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/product-detail";
import JsonLd from "@/components/json-ld";
import { loadProductBySlug, loadProducts, productHref } from "@/lib/products";
import { breadcrumbJsonLd, productJsonLd, productMetadata } from "@/lib/seo";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const products = await loadProducts();
  return products.map((product) => ({ slug: productHref(product).replace("/product/", "") }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProductBySlug(slug);
  if (!product) return { title: "Product not found | Tithonia" };
  return productMetadata(product);
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await loadProductBySlug(slug);
  if (!product) notFound();
  return (
    <main id="main">
      <JsonLd data={productJsonLd(product)} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Shop", path: "/shop" },
        { name: product.name, path: productHref(product) },
      ])} />
      <ProductDetail product={product} />
    </main>
  );
}
