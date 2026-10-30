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

## Demo behavior

- Product catalog edits are stored in browser `localStorage` and appear in the storefront in that browser.
- Checkout opens WhatsApp with a prefilled order message for the configured demo number.
- Admin analytics count WhatsApp checkout handoffs as inquiries; they do not confirm completed or paid orders.
- This frontend-only demo has no server, authentication, or shared database. Add those before using it as a live store.
