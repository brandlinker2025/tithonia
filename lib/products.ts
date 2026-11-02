import { supabaseRest, hasSupabase } from "@/lib/supabase-rest";
import type { Category, Product } from "@/lib/types";
import { THREE_PIECE_CATEGORIES, WESTERN_CATEGORIES, slugify, type ShopGroup } from "@/lib/site";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  description: string;
  price: number | string;
  compare_at_price?: number | string | null;
  dealer_price?: number | string | null;
  dealer_min_qty?: number | string | null;
  stock: number;
  sizes?: string[] | null;
  colors?: string[] | null;
  image_url?: string | null;
  featured?: boolean;
  created_at?: string | null;
  active?: boolean;
};

function mapProduct(row: ProductRow): Product {
  const image = row.image_url || null;
  return {
    id: row.id,
    slug: row.slug || slugify(row.name),
    name: row.name,
    category: row.category,
    description: row.description,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price == null ? null : Number(row.compare_at_price),
    dealerPrice: row.dealer_price == null ? null : Number(row.dealer_price),
    dealerMinQty: Number(row.dealer_min_qty || 10),
    stock: row.stock,
    sizes: row.sizes || [],
    colors: row.colors || [],
    image,
    images: image ? [image] : [],
    featured: row.featured,
    createdAt: row.created_at || undefined,
    active: row.active !== false,
  };
}

export function productHref(product: Product) {
  return `/product/${slugify(product.slug || product.name)}`;
}

export function matchesProductSlug(product: Product, slug: string) {
  const wanted = slugify(slug);
  return slugify(product.slug) === wanted || slugify(product.name) === wanted;
}

export function matchesShopGroup(product: Product, group?: string | null) {
  if (!group || group === "all") return true;
  if (group === "western") return (WESTERN_CATEGORIES as readonly string[]).includes(product.category);
  if (group === "three-piece") return (THREE_PIECE_CATEGORIES as readonly string[]).includes(product.category);
  return product.category.toLowerCase() === group.toLowerCase();
}

export function shopGroupLabel(group?: string | null) {
  if (group === "western") return "Western Wear";
  if (group === "three-piece") return "Three-Piece";
  return "All Products";
}

export function isShopGroup(value?: string | null): value is ShopGroup {
  return value === "western" || value === "three-piece";
}

export async function loadProducts(): Promise<Product[]> {
  if (!hasSupabase()) return [];
  const r = await supabaseRest("products?select=id,slug,name,category,description,price,compare_at_price,dealer_price,dealer_min_qty,stock,sizes,colors,image_url,featured,created_at,active&active=eq.true&order=featured.desc,created_at.desc");
  if (!r.ok) return [];
  const rows = (await r.json()) as ProductRow[];
  return rows.map(mapProduct);
}

export async function loadProductBySlug(slug: string): Promise<Product | null> {
  const products = await loadProducts();
  return products.find((product) => matchesProductSlug(product, slug)) || null;
}
