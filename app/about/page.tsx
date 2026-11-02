import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { ADDRESS_FULL, EMAIL, FACEBOOK, MAPS, PHONE_DISPLAY, whatsappHref } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About Tithonia | Women's Fashion Bangladesh",
  description: "Tithonia is a Dhaka-based women's fashion brand for Western Wear and Three-Piece collections, with Cash on Delivery all over Bangladesh.",
  path: "/about",
  keywords: ["women's fashion Bangladesh", "western wear Dhaka", "three-piece online shop", "Tithonia"],
});

export default function AboutPage() {
  return (
    <main id="main">
      <section className="story about-block about-page">
        <div className="story-copy">
          <p className="eyebrow gold">ABOUT TITHONIA</p>
          <h1>Style for every occasion</h1>
          <p>Tithonia is a women's fashion Bangladesh label created for women who want clothes that feel considered — not complicated. From Dhaka we design a two-track wardrobe: polished western wear Dhaka shoppers can wear to work and evenings, and a three-piece online shop with colour, comfort and occasion-ready cuts.</p>
          <p>Western Wear is sourced from China and edited for Bangladeshi weather, modest-to-modern styling, and everyday movement. Three-Piece collections stay trend-aware without losing wearability. We focus on quality stitching, honest prices and Cash on Delivery so customers from Dhaka to district towns can order with confidence.</p>
          <p>If a size or shade question comes up, WhatsApp us. Fashion should feel personal, and Tithonia is built to stay that close.</p>
        </div>
      </section>
      <section className="contact" id="contact">
        <div className="wrap contact-inner">
          <div>
            <p className="eyebrow gold">CONTACT TITHONIA</p>
            <h2>Connect with us.</h2>
            <p>Visit, call, or message — we are here for product help and Cash on Delivery orders.</p>
          </div>
          <div className="contact-links">
            <a href={`tel:${PHONE_DISPLAY}`}><Phone size={16} /> {PHONE_DISPLAY}</a>
            <a href={`mailto:${EMAIL}`}><Mail size={16} /> {EMAIL}</a>
            <a href={whatsappHref()}><MessageCircle size={16} /> WhatsApp {PHONE_DISPLAY}</a>
            <a href={MAPS}><MapPin size={16} /> {ADDRESS_FULL}</a>
            <a href={FACEBOOK}>Facebook</a>
            <Link href="/shop">Shop collections</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
