const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export function hasSupabase(){ return Boolean(url && key); }
export async function supabaseRest(path:string, init:RequestInit={}) {
  if(!url || !key) throw new Error("Supabase is not configured");
  const headers = new Headers(init.headers);
  headers.set("apikey", key);
  headers.set("Authorization", `Bearer ${key}`);
  if(!headers.has("Content-Type") && init.body) headers.set("Content-Type","application/json");
  return fetch(`${url}/rest/v1/${path}`, {...init, headers, cache:"no-store"});
}
