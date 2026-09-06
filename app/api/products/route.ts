import { NextResponse } from "next/server";
import { hasSupabase, supabaseRest } from "@/lib/supabase-rest";
export async function GET(){
 if(!hasSupabase()) return NextResponse.json({error:"Store database is not configured"},{status:503});
 const r=await supabaseRest("products?select=id,slug,name,category,description,price,compare_at_price,stock,sizes,colors,image_url,featured&active=eq.true&order=featured.desc,created_at.desc");
 if(!r.ok) return NextResponse.json({error:"Could not load products"},{status:502});
 const rows=await r.json();
 return NextResponse.json({products:rows.map((p:any)=>({id:p.id,slug:p.slug,name:p.name,category:p.category,description:p.description,price:Number(p.price),compareAtPrice:p.compare_at_price==null?null:Number(p.compare_at_price),stock:p.stock,sizes:p.sizes||[],colors:p.colors||[],image:p.image_url||null,featured:p.featured}))});
}
