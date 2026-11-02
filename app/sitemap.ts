import type { MetadataRoute } from "next";
import { loadProducts, productHref } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await loadProducts();
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/shop?category=western`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/shop?category=three-piece`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/checkout`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];
  const productRoutes = products.map((product) => ({
    url: `${SITE_URL}${productHref(product)}`,
    lastModified: product.createdAt ? new Date(product.createdAt) : now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  return [...staticRoutes, ...productRoutes];
}
