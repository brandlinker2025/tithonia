import { NextResponse } from "next/server";
import { z } from "zod";
import { hasSupabase, supabaseRest } from "@/lib/supabase-rest";
const schema=z.object({customer:z.object({name:z.string().min(2).max(120),phone:z.string().min(10).max(20),email:z.union([z.string().email(),z.literal("")]).optional(),address:z.string().min(5).max(500),city:z.string().min(2).max(120)}),payment_method:z.enum(["cod","online"]),delivery_zone:z.enum(["inside","outside"]),discount_code:z.string().max(40).optional(),items:z.array(z.object({product_id:z.string().uuid(),qty:z.number().int().min(1).max(999),size:z.string().max(30).optional(),color:z.string().max(40).optional()})).min(1).max(30)});
export async function POST(req:Request){
 const parsed=schema.safeParse(await req.json()); if(!parsed.success)return NextResponse.json({error:"Invalid checkout data"},{status:400});
 if(!hasSupabase())return NextResponse.json({error:"Store database is not configured"},{status:503});
 if(parsed.data.payment_method==="online" && !(process.env.SSLCOMMERZ_STORE_ID&&process.env.SSLCOMMERZ_STORE_PASSWORD&&process.env.SUPABASE_SECRET_KEY)) return NextResponse.json({error:"Online payment is not live yet. Please use Cash on Delivery."},{status:503});
 const orderNo=`TIT-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0,4).toUpperCase()}`;
 const r=await supabaseRest("rpc/place_order",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify({p_order_no:orderNo,p_customer:parsed.data.customer,p_payment_method:parsed.data.payment_method,p_items:parsed.data.items,p_discount_code:parsed.data.discount_code?.trim()||null,p_delivery_zone:parsed.data.delivery_zone})});
 const raw=await r.text(); if(!r.ok){let message="Could not place order";try{message=JSON.parse(raw)?.message||message}catch{}return NextResponse.json({error:message},{status:400})}
 const orderId=JSON.parse(raw); return NextResponse.json({ok:true,order_id:orderId,order_no:orderNo});
}
