export type Category = "T-Shirt" | "Three Piece" | "Saree" | "Shoes" | "Western" | "Tops" | "Skirt" | "Formal" | "Kurti" | "Dress" | "Gown" | "Co-ord Set" | "Jeans" | "Pants" | "Panjabi" | "Abaya" | "Hijab" | "Bags" | "Accessories";
export type Product = { id:string; slug:string; name:string; category:Category; description:string; price:number; compareAtPrice?:number|null; stock:number; featured?:boolean; sizes?:string[]; colors?:string[]; image?:string|null; };
export type CartItem = Product & { qty:number; selectedSize?:string; selectedColor?:string };
