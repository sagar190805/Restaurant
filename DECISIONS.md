# Decisions Log

## Phase 1: Foundation and MVP
- **Monorepo**: Used npm workspaces manually initialized to avoid interactive prompts. Directories: `apps/web`, `apps/api`, `packages/shared`.
- **Database**: Started with PostgreSQL schema but temporarily switched provider to `sqlite` in Prisma so the user can easily test the MVP without having Docker or Postgres running locally on Windows. `dev.db` is used.
- **Mock SMS**: Built an `SmsProvider` that always logs to console, but in `NODE_ENV=development`, it returns the actual OTP in a debug property `_devOtp` for easy UI testing.
- **Next.js**: Setup App Router with manual `page.tsx` for both Home (menu/cart) and Admin dashboard.
- **Admin Realtime**: Implemented Socket.IO. The web UI attempts to play `/alert.mp3` when `order:new` is triggered (this file can be added later or silently fails).
- **Cart/Pricing**: Server handles all the calculations based on DB prices; client just shows subtotal visually.


## Phase 2: Maps and Delivery
- **Address & Geocoding**: Implemented /api/maps/geocode and /api/maps/reverse using Nominatim (OpenStreetMap). No API keys needed. Used Haversine formula via geolib to calculate distance.
- **Maps**: Next.js uses eact-leaflet to display maps on the tracking page, dynamically imported to avoid SSR issues.
- **Delivery Zone/Fee**: The API validates address coordinates against the restaurant location, throws error if outside deliveryRadiusKm, and calculates fee (Base + PerKm).
- **Rider App**: Mocked Rider login at /rider. The app polls and emits mock GPS coordinates to /api/orders via Socket.IO, updating the map.
- **Coupons**: Validates first-order only, minimum cart, per-user limits, flat/percent and max discount limits. Applies to 	otal.
- **Invoices**: Uses pdfkit to generate A4 PDF invoice files containing GST/FSSAI info. It supports ?token= parameter for easy download.

## Phase 3: Intelligence and Growth
- **Chatbot**: Integrated Anthropic Claude 3 Haiku API with a rule-based fallback if the API key is missing. Context provided includes the full menu and store status. Handoff to human is triggered if 'human' is typed.
- **Reviews & Reorder**: Customer tracking page now allows rating the order after it is DELIVERED and provides a 'Reorder' button.
- **Analytics**: Admin route added for calculating total revenue, total orders, and average order value.
- **Loyalty**: Earns 10% of subtotal as points upon DELIVERED status transition.
- **Abandoned Cart**: Added a node setInterval cron job that checks for abandoned carts every hour.
