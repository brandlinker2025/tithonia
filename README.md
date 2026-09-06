# Tithonia

Luxury e-commerce storefront for Bangladesh, built with Next.js and Supabase.

Production domain: `tithonia.online`

Core features include live product inventory, cart and checkout, Cash on Delivery, discounts, atomic stock deduction, inventory movement tracking, and a scaffold for SSLCOMMERZ online payments.

## Environment

Copy `.env.example` to `.env.local` and configure the required values before local development or deployment.

## Development

```bash
npm install
npm run dev
```

## Deployment

Designed for Vercel with Supabase as the database/backend. The Namecheap domain should be connected to the Vercel production project after deployment.
