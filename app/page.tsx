import HomeView from "@/components/home-view";
import { hasValidImage } from "@/lib/has-valid-image";
import { loadProducts } from "@/lib/products";

export const revalidate = 60;

export default async function Page() {
  const products = (await loadProducts()).filter(hasValidImage);
  return <HomeView products={products} />;
}
