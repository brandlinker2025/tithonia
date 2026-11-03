import type { Metadata } from "next";
import type { Product } from "@/lib/types";
import { EMAIL, FACEBOOK, OG_IMAGE, PHONE_E164, SITE_NAME, SITE_URL, slugify } from "@/lib/site";
import { shopGroupLabel } from "@/lib/products";

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function imageUrl(src?: string | null) {
  if (!src) return absoluteUrl(OG_IMAGE);
  if (src.startsWith("http")) return src;
  return absoluteUrl(src);
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = imageUrl(image);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  return {
    title: fullTitle,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url,
      locale: "en_BD",
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

export function productMetadata(product: Product): Metadata {
  return pageMetadata({
    title: `${product.name} | ${product.category} | ৳${product.price} | ${SITE_NAME}`,
    description: `Buy ${product.name} (${product.category}) at Tithonia for ৳${product.price}. Premium women's fashion Bangladesh with Cash on Delivery across the country.`,
    path: `/product/${slugify(product.slug || product.name)}`,
    image: product.image,
    keywords: [product.name, product.category, "Tithonia", "women's fashion Bangladesh", "cash on delivery"],
  });
}

export function shopMetadata(category?: string | null): Metadata {
  const label = shopGroupLabel(category);
  if (category === "western") {
    return pageMetadata({
      title: "Western Wear in Dhaka | Tithonia",
      description: "Shop premium Western Wear in Dhaka at Tithonia. Stylish sets sourced with quality in mind, affordable prices, and Cash on Delivery all over Bangladesh.",
      path: "/shop?category=western",
      keywords: ["western wear Dhaka", "western wear Bangladesh", "Tithonia"],
    });
  }
  if (category === "three-piece") {
    return pageMetadata({
      title: "Three-Piece Online Shop | Tithonia",
      description: "Browse Tithonia's three-piece online shop for trendy women's three-piece collections in Bangladesh. Quality fashion with Cash on Delivery nationwide.",
      path: "/shop?category=three-piece",
      keywords: ["three-piece online shop", "three piece Bangladesh", "Tithonia"],
    });
  }
  return pageMetadata({
    title: `${label} | Premium Fashion Bangladesh`,
    description: "Shop Western Wear and Three-Piece collections at Tithonia. Filter by category, size and price. Cash on Delivery available all over Bangladesh.",
    path: "/shop",
    keywords: ["women's fashion Bangladesh", "western wear Dhaka", "three-piece online shop"],
  });
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: SITE_NAME,
    url: SITE_URL,
    image: imageUrl(OG_IMAGE),
    logo: imageUrl("/tithonia-logo.jpg"),
    telephone: PHONE_E164,
    email: EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: "1254 East Monipur",
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
    areaServed: "Bangladesh",
    sameAs: [FACEBOOK],
    priceRange: "৳৳",
  };
}

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image ? [imageUrl(product.image)] : [imageUrl(OG_IMAGE)],
    sku: product.slug,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${slugify(product.slug || product.name)}`),
      priceCurrency: "BDT",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export const FAQS = [
  {
    q: "How long does delivery take?",
    a: "Inside Dhaka 1–2 days, outside Dhaka 3–5 days. Timing can vary during festivals or weather delays.",
  },
  {
    q: "How much is the delivery charge?",
    a: "Delivery is ৳80 inside Dhaka and ৳150 outside Dhaka.",
  },
  {
    q: "What is the return or exchange policy?",
    a: "Contact Tithonia on WhatsApp for size issues as soon as the parcel arrives.",
  },
  {
    q: "How do I order?",
    a: "Choose your product, add it to the bag, then complete Cash on Delivery checkout — or tap Order on WhatsApp and send us the item name and size.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Cash on Delivery is available all over Bangladesh. Online payment is not live yet.",
  },
];

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
