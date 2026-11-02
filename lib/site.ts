export const SITE_NAME = "Tithonia";
export const SITE_TAGLINE = "MORE THAN FASHION";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.tithonia.online").replace(/\/$/, "");
export const PHONE_DISPLAY = "01626896050";
export const PHONE_E164 = "+8801626896050";
export const WHATSAPP_E164 = "8801626896050";
export const EMAIL = "tithonia.online@gmail.com";
export const ADDRESS_LINE = "1254 East Monipur, Dhaka, Bangladesh";
export const ADDRESS_FULL = "Head Office: 1254, East Monipur, Dhaka, Bangladesh";
export const FACEBOOK = "https://www.facebook.com/share/1ESoX24JPy/?mibextid=wwXIfr";
export const MAPS = "https://maps.app.goo.gl/KEg8Bh58sTDGFGBz5?g_st=iwb";
export const LOGO_SRC = "/tithonia-logo.jpg";
export const HERO_SRC = "/hero-placeholder.jpg";
export const OG_IMAGE = "/og-default.jpg";
export const CART_KEY = "tithonia-cart-v1";
export const DELIVERY_KEY = "tithonia-delivery-zone";

export const WHATSAPP_ORDER_TEXT = "Hi Tithonia, I want to order";
export function whatsappHref(text = WHATSAPP_ORDER_TEXT) {
  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(text)}`;
}

export const WESTERN_CATEGORIES = ["Western", "T-Shirt", "Tops", "Skirt", "Formal", "Dress", "Gown", "Co-ord Set", "Jeans", "Pants", "Shoes", "Bags", "Accessories"] as const;
export const THREE_PIECE_CATEGORIES = ["Three Piece", "Kurti", "Saree", "Panjabi", "Abaya", "Hijab"] as const;

export type ShopGroup = "western" | "three-piece";

export function money(n: number) {
  return new Intl.NumberFormat("en-BD").format(n);
}

export function slugify(value: string) {
  const slug = value
    .normalize("NFKD")
    .replace(/['’]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "product";
}

export function isNewProduct(createdAt?: string | null) {
  if (!createdAt) return false;
  const created = Date.parse(createdAt);
  if (Number.isNaN(created)) return false;
  return Date.now() - created < 1000 * 60 * 60 * 24 * 30;
}
