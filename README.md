# Spice Route - Restaurant Web Application

A modern single-restaurant web application built with React, Vite, and Tailwind CSS, featuring a Zomato-inspired glassmorphic interface and a full-featured Partner Admin Dashboard.

---

## Overview

Spice Route is an interactive food ordering platform tailored for single-restaurant operations. The platform provides a complete customer ordering experience combined with a real-time partner management dashboard. The entire application runs client-side with persistent storage, meaning it works out-of-the-box without requiring an external database setup.

---

## Features

### Customer Experience
- **Zomato-Inspired Design**: Glassmorphic layout with translucent containers, backdrop blur, Crimson red accents, and smooth animations.
- **Menu and Exploration**: Categorized menu with authentic food photography, dietary filters (Veg / Non-Veg / Bestsellers / Spicy), search, and quick category jumps.
- **Interactive Cart**: Instant quantity controls (+1/-), cart slide-out drawer, coupon application, upsell suggestions, and subtotal calculation.
- **Checkout and Tracking**: Streamlined checkout workflow with order summary and real-time status tracking.
- **Table Booking and Dine-In**: Reservation booking system and QR-style table ordering.
- **Customer Account**: Profile management, address book, favorites, and past order history.
- **Multi-Theme Support**: Dynamic theme switching (Zomato Glass, Midnight, Warm Amber, Fresh Green, Royal Purple, and more).

### Admin Partner Dashboard
- **Overview Analytics**: Key performance metrics (Revenue, Orders, Average Order Value) paired with interactive sales charts.
- **Live Orders Board**: Real-time Kanban board (Pending, Preparing, Ready, Out for Delivery, Completed) synchronized across browser tabs using the BroadcastChannel API.
- **Menu Manager**: Live menu control allowing restaurant owners to toggle dish availability (In Stock / Out of Stock) and update prices on the fly.
- **Riders & Logistics**: Active driver tracking, delivery counters, and contact status.
- **Customer Directory**: Customer registry showing order frequencies, total spend, and last visit timestamps.
- **Store Controls**: One-click store status switch (Accepting Orders / Closed) that reflects instantly across the customer-facing interface.

---

## Tech Stack

- **Framework**: React 18 (JavaScript / JSX)
- **Bundler & Tooling**: Vite
- **Styling**: Tailwind CSS, CSS variables, glassmorphic backdrop filters
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: Radix UI primitives, custom shadcn-style components
- **Data Visualization**: Recharts
- **State & Data Layer**: React Context API, localStorage persistence, BroadcastChannel API for multi-tab communication

---

## Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sagar190805/Restaurant.git
   cd Restaurant
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser:
   - **Customer Web App**: [http://localhost:3000](http://localhost:3000)
   - **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Project Structure

```
restaurant-platform/
├── apps/
│   └── web/
│       ├── public/
│       │   └── images/          # Food imagery and assets
│       ├── src/
│       │   ├── components/      # UI components, layout, header, drawer
│       │   │   └── ui/          # Primitives (Button, Card, Badge, Stepper)
│       │   ├── context/         # Global AppContext (cart, theme, store state)
│       │   ├── pages/           # Customer pages (Home, Menu, Cart, Profile, etc.)
│       │   │   └── admin/       # Partner dashboard pages (LiveOrders, etc.)
│       │   ├── utils/           # Mock storage engine, API layer, seed data
│       │   ├── App.jsx          # Route configuration
│       │   ├── globals.css      # Theme variables and glassmorphic utilities
│       │   └── main.jsx         # Application entry point
│       ├── index.html
│       ├── package.json
│       ├── tailwind.config.js
│       └── vite.config.js
├── package.json
└── README.md
```

---

## Configuration and Customization

- **Themes**: Available themes can be selected via the Admin Dashboard under Settings > Appearance, or customized directly in `apps/web/src/globals.css`.
- **Menu Data**: Default menu categories, items, and seed configurations can be modified in `apps/web/src/utils/seed.js`.

---

## License

This project is licensed under the MIT License.
