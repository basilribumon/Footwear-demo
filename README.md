# ATHMAN Footwear Storefront

A responsive footwear storefront demo with a browser-based admin page and WhatsApp order handoff.

## Run locally

Install dependencies and start Vite:

```bash
npm install
npm run dev
```

On Windows PowerShell, use `npm.cmd install` and `npm.cmd run dev` if PowerShell blocks the `npm.ps1` script.

Open the storefront at the local URL printed by Vite. Open the admin page at `/admin.html` on that same origin.

## Connect shared products and admin access

The storefront can use Supabase so catalog changes and checkout inquiry analytics are shared across visitors.

1. Create a Supabase project and run [`supabase/schema.sql`](supabase/schema.sql) in **SQL Editor**.
2. In **Authentication → Users**, create the store admin user. Copy its user UUID, then run the final `insert into public.admin_users` statement shown in the SQL file with that UUID.
3. Copy the project's **Project URL** and **anon/publishable key** from Supabase API settings. For local development, copy `.env.example` to `.env.local` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. In Vercel, add those two environment variables under **Project → Settings → Environment Variables** for Production (and Preview if needed), then redeploy.
5. Open `/admin.html` on your Vercel domain and sign in with the admin account. Product photos can be selected from the device gallery, pasted from the clipboard, or entered as an image URL.

Only use the public anon/publishable key in Vercel. Never put a Supabase `service_role` key in browser environment variables.

## Store behavior

- With Supabase configured, product edits and uploaded images are shared with all visitors. Storefronts refresh the shared catalog every 30 seconds.
- Without Supabase configuration, the admin remains in local demo mode and saves changes only in that browser.
- Checkout opens WhatsApp with a prefilled order message. Analytics record checkout handoffs as inquiries, not confirmed or paid orders.
- Admin product writes and inquiry reads require an authenticated user listed in `public.admin_users`.
## Product sizes and colour variants

The admin product form now stores a numeric size list and colour variants for each product. On the existing Supabase project, run `supabase/migrations/20261031_product_variants.sql` once in the Supabase SQL Editor before deploying this version. Fresh project setup includes these columns in `supabase/schema.sql`.
