"use client";

import type { CartItem, Product } from "@/lib/types";
import { CART_KEY } from "@/lib/site";

export const CART_EVENT = "tithonia-cart";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function addToCart(product: Product, opts?: { qty?: number; size?: string; color?: string }) {
  if (product.stock < 1) return readCart();
  const size = opts?.size || product.sizes?.[0];
  const color = opts?.color || product.colors?.[0];
  const qty = Math.max(1, opts?.qty || 1);
  const next = readCart();
  const index = next.findIndex((item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color);
  if (index >= 0) {
    next[index] = { ...next[index], qty: Math.min(next[index].qty + qty, product.stock) };
  } else {
    next.push({ ...product, qty: Math.min(qty, product.stock), selectedSize: size, selectedColor: color });
  }
  writeCart(next);
  return next;
}
