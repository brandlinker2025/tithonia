import type { Product } from "@/lib/types";

type ImageCarrier = Pick<Product, "image" | "images">;

const PLACEHOLDER_IMAGE =
  /(?:placeholder|placehold\.|coming[-_\s]?soon|no[-_\s]?image|image[-_\s]?not[-_\s]?available|dummyimage|default[-_\s]?(?:image|photo|product))/i;

/** A real image URL the storefront can render. Empty values and placeholder art do not count. */
export function isValidImageUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const url = value.trim();
  if (!url) return false;
  const lower = url.toLowerCase();
  if (lower === "null" || lower === "undefined" || lower === "none" || lower === "n/a" || lower === "#") return false;
  if (PLACEHOLDER_IMAGE.test(url)) return false;
  if (lower.startsWith("data:image/")) return true;
  return lower.startsWith("/") || lower.startsWith("http://") || lower.startsWith("https://");
}

/** Every usable image on a product, in gallery order, with the single `image` field included. */
export function validImageUrls(product: ImageCarrier): string[] {
  const listed = Array.isArray(product.images) ? product.images : [];
  const pool = [...listed, product.image];
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const value of pool) {
    if (!isValidImageUrl(value)) continue;
    const url = value.trim();
    if (seen.has(url)) continue;
    seen.add(url);
    urls.push(url);
  }
  return urls;
}

/** True when the product has at least one real image URL. */
export function hasValidImage(product: ImageCarrier): boolean {
  return validImageUrls(product).length > 0;
}
