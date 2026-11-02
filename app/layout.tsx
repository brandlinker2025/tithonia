import type { Metadata, Viewport } from "next";
import { DM_Sans, Hind_Siliguri, Playfair_Display } from "next/font/google";
import StoreChrome from "@/components/store-chrome";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import "./globals.css";
import "./product-image-standard.css";

const heading = Playfair_Display({ subsets: ["latin"], variable: "--font-heading", display: "swap" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const bangla = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "600", "700"], variable: "--font-bn", display: "swap" });

export const viewport: Viewport = {
  themeColor: "#5b120f",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({
    title: "Tithonia | Premium Western Wear & Three-Piece in Bangladesh",
    description: "Shop premium Western Wear and trendy Three-Piece collections at Tithonia. Quality fashion at affordable prices with Cash on Delivery all over Bangladesh.",
    path: "/",
    keywords: ["women's fashion Bangladesh", "three-piece online shop", "western wear Dhaka", "cash on delivery", "Tithonia"],
  }),
  icons: {
    icon: [{ url: "/favicon.jpg", type: "image/jpeg" }],
    apple: [{ url: "/apple-touch-icon.jpg" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable} ${bangla.variable}`}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <StoreChrome>{children}</StoreChrome>
      </body>
    </html>
  );
}
