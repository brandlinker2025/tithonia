import { NextResponse } from "next/server";
import { hasSupabase } from "@/lib/supabase-rest";
import { loadProducts } from "@/lib/products";

export async function GET() {
  if (!hasSupabase()) return NextResponse.json({ error: "Store database is not configured" }, { status: 503 });
  const products = await loadProducts();
  return NextResponse.json({ products });
}
