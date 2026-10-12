import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Layout, Breadcrumbs } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { VegIcon } from '@/components/ui/VegIcon';
import { Minus, Plus, Tag, Trash2, ShoppingBag, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UPSELL = [
  { menuItemId: 'u1', name: 'Sweet Lassi', price: 9000, image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=80&q=60', isVeg: true },
  { menuItemId: 'u2', name: 'Gulab Jamun', price: 12000, image: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=80&q=60', isVeg: true },
  { menuItemId: 'u3', name: 'Masala Chaas', price: 7000, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=80&q=60', isVeg: true },
];

export default function Cart() {
  const { cart, addToCart, updateQuantity, removeFromCart, cartTotal, requireLogin } = useAppContext();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [orderType, setOrderType] = useState('delivery');
  const navigate = useNavigate();

  const gst = Math.round(cartTotal * 0.05);
  const delivery = orderType === 'delivery' ? (cartTotal >= 49900 ? 0 : 4000) : 0;
  const packing = cart.length > 0 ? 500 : 0;
  const total = cartTotal + gst + delivery + packing - discount;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'WELCOME50') {
      const d = Math.min(Math.round(cartTotal * 0.5), 10000);
      setDiscount(d); setCouponMsg(`🎉 WELCOME50 applied! You saved ₹${d/100}`);
    } else { setCouponMsg('❌ Invalid coupon code'); }
  };

  const handleCheckout = () => {
    if (!requireLogin('/checkout')) return;
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-10">
          <Breadcrumbs items={[{ label: 'Cart' }]} />
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag size={80} className="text-muted-foreground/20 mb-6" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet!</p>
            <Button onClick={() => navigate('/menu')} className="px-8 rounded-full">Browse Menu</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: 'Cart' }]} />
        <h1 className="text-3xl font-black font-serif mb-8">🛒 Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Order Type */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <h3 className="font-bold mb-3">Order Type</h3>
              <div className="flex gap-3">
                {[
                  { id: 'delivery', emoji: '🛵', label: 'Delivery' },
                  { id: 'takeaway', emoji: '🧑‍🍳', label: 'Takeaway' },
                  { id: 'dine-in', emoji: '🍽️', label: 'Dine-in' },
                ].map(type => (
                  <button key={type.id} onClick={() => setOrderType(type.id)}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border-2 ${orderType === type.id ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}>
                    {type.emoji} {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border font-bold">Items ({cart.length})</div>
              <AnimatePresence>
                {cart.map(item => (
                  <motion.div key={item.menuItemId} layout exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-4 p-4 border-b border-border last:border-0">
                    {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <VegIcon isVeg={item.isVeg !== false} />
                        <h4 className="font-bold truncate">{item.name}</h4>
                      </div>
                      <p className="text-primary font-bold">₹{(item.price/100).toFixed(0)} × {item.quantity} = ₹{((item.price * item.quantity)/100).toFixed(0)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => removeFromCart(item.menuItemId)} className="text-muted-foreground hover:text-red-500 transition p-1">
                        <Trash2 size={14} />
                      </button>
                      <div className="flex items-center border border-primary rounded-lg">
                        <button onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 transition">
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 transition">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Upsell */}
            <div className="bg-card border border-dashed border-border rounded-2xl p-4">
              <h3 className="font-bold mb-3">🍹 Complete your meal</h3>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {UPSELL.map(u => (
                  <button key={u.menuItemId} onClick={() => addToCart({ ...u, quantity: 1 })}
                    className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2 text-sm hover:bg-primary/10 transition shrink-0">
                    <img src={u.image} alt={u.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="text-left"><div className="font-semibold">{u.name}</div><div className="text-primary font-bold">₹{u.price/100}</div></div>
                    <Plus size={16} className="text-primary" />
                  </button>
                ))}
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <h3 className="font-bold mb-3">Have a Coupon?</h3>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 bg-muted rounded-xl px-3">
                  <Tag size={16} className="text-primary" />
                  <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code" className="flex-1 bg-transparent py-2.5 text-sm font-semibold outline-none" />
                </div>
                <Button onClick={applyCoupon} variant="outline" className="px-5 font-bold border-primary text-primary">Apply</Button>
              </div>
              {couponMsg && (
                <p className={`text-sm mt-2 font-semibold ${discount > 0 ? 'text-green-600' : 'text-red-500'}`}>{couponMsg}</p>
              )}
            </div>
          </div>

          {/* Right: Bill Breakdown */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-24">
              <h3 className="font-black text-lg mb-4">Bill Summary</h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Subtotal', val: cartTotal },
                  { label: 'GST (5%)', val: gst },
                  { label: orderType === 'delivery' ? (delivery === 0 ? 'Delivery (FREE 🎉)' : 'Delivery Fee') : 'Delivery (Pickup)', val: delivery, green: delivery === 0 },
                  { label: 'Packing Charge', val: packing },
                  discount > 0 ? { label: 'Coupon Discount', val: -discount, green: true } : null,
                ].filter(Boolean).map(row => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className={`font-semibold ${row.green ? 'text-green-600' : ''}`}>
                      {row.val < 0 ? '−' : ''}₹{(Math.abs(row.val)/100).toFixed(0)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between font-black text-lg pt-3 border-t border-border">
                  <span>Grand Total</span><span>₹{(total/100).toFixed(0)}</span>
                </div>
              </div>
              {cartTotal < 49900 && orderType === 'delivery' && (
                <p className="text-xs text-muted-foreground mt-3 bg-muted rounded-lg p-2">
                  Add ₹{((49900 - cartTotal)/100).toFixed(0)} more for <span className="text-green-600 font-bold">FREE delivery!</span>
                </p>
              )}
              <Button onClick={handleCheckout} className="w-full h-14 text-base font-black rounded-xl mt-4 flex items-center justify-center gap-2">
                Proceed to Checkout <ChevronRight size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
