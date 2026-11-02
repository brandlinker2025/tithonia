import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Checkout | Tithonia",
  description: "Complete your Tithonia order with Cash on Delivery across Bangladesh.",
  path: "/checkout",
});

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
