import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { NotFound } from '@/components/Layout';
import ChatWidget from '@/components/ChatWidget';
import { Privacy, Terms, RefundPolicy, DeliveryPolicy, FAQ } from '@/pages/StaticPages';

// Lazy-load all pages
const Home = lazy(() => import('@/pages/Home'));
const Menu = lazy(() => import('@/pages/Menu'));
const Offers = lazy(() => import('@/pages/Offers'));
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const OrderSuccess = lazy(() => import('@/pages/OrderSuccess'));
const Track = lazy(() => import('@/pages/Track'));
const Orders = lazy(() => import('@/pages/Orders'));
const Favorites = lazy(() => import('@/pages/Favorites'));
const Profile = lazy(() => import('@/pages/Profile'));
const FindUs = lazy(() => import('@/pages/FindUs'));
const Reviews = lazy(() => import('@/pages/Reviews'));
const Gallery = lazy(() => import('@/pages/Gallery'));
const Contact = lazy(() => import('@/pages/Contact'));
const Reserve = lazy(() => import('@/pages/Reserve'));
const TableOrder = lazy(() => import('@/pages/TableOrder'));
const Admin = lazy(() => import('@/pages/Admin'));
const Rider = lazy(() => import('@/pages/Rider'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/track" element={<Track />} />
            <Route path="/track/:id" element={<Track />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<Orders />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/find-us" element={<FindUs />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/reserve" element={<Reserve />} />
            <Route path="/t/:tableNo" element={<TableOrder />} />

            {/* Static Pages */}
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/delivery-policy" element={<DeliveryPolicy />} />
            <Route path="/faq" element={<FAQ />} />

            {/* Admin & Rider */}
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/rider" element={<Rider />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>

        {/* Global floating chatbot - shown on all pages */}
        <ChatWidget />
      </BrowserRouter>
    </AppProvider>
  );
}