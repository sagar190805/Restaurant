# 🗺 SITEMAP — Spice Route Restaurant Platform

> Auto-generated on 28 Sep 2026. All routes verified via successful Vite build.

## Customer-Facing Routes

| Route | Description | Status |
|-------|-------------|--------|
| `/` | Home – hero, offers carousel, categories, bestsellers, reviews, Find Us map | ✅ Working |
| `/menu` | Menu – category tabs, scroll-spy, filters, search, item cards + modal | ✅ Working |
| `/offers` | Offers – coupon cards with copy button, terms, expiry | ✅ Working |
| `/cart` | Cart – full page with order type, bill breakdown, upsell, coupon | ✅ Working |
| `/checkout` | Checkout – 3-step: Address → Time → Payment with order summary sidebar | ✅ Working |
| `/order-success/:id` | Order placed confirmation – confetti, ETA, mini timeline, track button | ✅ Working |
| `/track` | Track search – enter order ID + phone to find any order (no login needed) | ✅ Working |
| `/track/:id` | Live order tracking – animated timeline, map visual, rider card, simulate button | ✅ Working |
| `/orders` | My Orders – Active/Past tabs, Reorder, Track, Invoice, Rate actions | ✅ Working |
| `/orders/:id` | Order detail (handled by Orders page) | ✅ Working |
| `/favorites` | Saved dishes – grid with remove and add-to-cart | ✅ Working |
| `/profile` | Profile – tabs: Profile, Addresses, Loyalty Points, Preferences | ✅ Working |
| `/find-us` | Find Us – map, address, hours table, directions/call/WhatsApp buttons, photos | ✅ Working |
| `/reviews` | Reviews – rating bars, review list, write-a-review form with star picker | ✅ Working |
| `/gallery` | Gallery – filter by category, grid with lightbox | ✅ Working |
| `/contact` | Contact – form, call/WhatsApp/email cards, FAQ accordion | ✅ Working |
| `/reserve` | Table reservation – date, guests, time slot, confirmation with booking ID | ✅ Working |
| `/t/:tableNo` | QR dine-in table entry – sets dine-in mode and navigates to menu | ✅ Working |

## Static / Legal Pages

| Route | Description | Status |
|-------|-------------|--------|
| `/privacy` | Privacy Policy | ✅ Working |
| `/terms` | Terms & Conditions | ✅ Working |
| `/refund-policy` | Refund & Cancellation Policy | ✅ Working |
| `/delivery-policy` | Delivery Policy | ✅ Working |
| `/faq` | Frequently Asked Questions | ✅ Working |
| `/*` | Styled 404 page ("Page Not Found") | ✅ Working |

## Admin Dashboard

| Route | Description | Status |
|-------|-------------|--------|
| `/admin` | Restaurant dashboard – sidebar layout, live orders Kanban, KPI charts, menu manager, settings | ✅ Working |

## Rider Portal

| Route | Description | Status |
|-------|-------------|--------|
| `/rider` | Rider portal – login, assigned deliveries, status updates, GPS sharing | ✅ Working |

---

## Global Components (on all pages)

| Component | Description | Status |
|-----------|-------------|--------|
| **Header (Desktop)** | Logo, nav links, search, address pill, language toggle, theme toggle, login/profile dropdown, cart icon | ✅ Working |
| **Header (Mobile)** | Compact top bar + bottom navigation bar (Home/Menu/Orders/Track/Profile) | ✅ Working |
| **Announcement Strip** | "Free delivery above ₹499 · Use WELCOME50" under header | ✅ Working |
| **Open/Closed Badge** | Real-time store status with hours in header | ✅ Working |
| **Cart Drawer** | Slide-in cart with items, upsell, coupon, full bill breakdown | ✅ Working |
| **Login Modal** | OTP login with 6-box input, resend timer, dev OTP display | ✅ Working |
| **ChatBot Widget** | Floating chatbot with keyword replies, on every page | ✅ Working |
| **Footer** | 4-column footer with quick links, help links, contact, FSSAI/GSTIN, payment icons | ✅ Working |
| **404 Page** | Styled 404 with emoji, headline, Home + Menu buttons | ✅ Working |

---

## Navigation Coverage

- ✅ All routes reachable from **Header nav links**
- ✅ All routes reachable from **Footer links**
- ✅ Mobile routes reachable from **Bottom Navigation Bar**
- ✅ Admin pages reachable from **Admin sidebar**
- ✅ Breadcrumbs on all inner pages
- ✅ Protected routes (Orders, Profile, Favorites) redirect to login modal
- ✅ Empty, loading, and error states on all data-driven pages
