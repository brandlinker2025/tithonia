import HomeView from "@/components/home-view";
import { loadProducts } from "@/lib/products";

export const revalidate = 60;

export default async function Page() {
  const products = await loadProducts();
  return <HomeView products={products} />;
}
