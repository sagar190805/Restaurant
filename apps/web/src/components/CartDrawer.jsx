import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Minus, Plus, Tag, ShoppingBag, ChevronRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { VegIcon } from '@/components/ui/VegIcon';

const UPSELL = [
  { id: 'u1', name: 'Sweet Lassi', price: 9000, image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=80&q=60', isVeg: true },
  { id: 'u2', name: 'Gulab Jamun', price: 12000, image: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=80&q=60', isVeg: true },
];

export default function CartDrawer({ open, onClose }) {
  const { cart, addToCart, updateQuantity, removeFromCart, cartTotal, token, requireLogin } = useAppContext();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  const gst = Math.round(cartTotal * 0.05);
  const delivery = cartTotal >= 49900 ? 0 : 4000;
  const packing = cart.length > 0 ? 500 : 0;
  const total = cartTotal + gst + delivery + packing - discount;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'WELCOME50') {
      setDiscount(Math.min(Math.round(cartTotal * 0.5), 10000));
    }
  };

  const handleCheckout = () => {
    if (!requireLogin('/checkout')) return;
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="w-full max-w-md glass-panel flex flex-col shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2 className="text-xl font-black font-serif">Your Cart</h2>
                <p className="text-xs text-muted-foreground">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
              </div>
              <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition">
                <X size={20} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <ShoppingBag size={64} className="text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground text-sm mb-6">Add some delicious items to get started!</p>
                <Button onClick={() => { onClose(); navigate('/menu'); }} className="rounded-full px-8">Browse Menu</Button>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.map(item => (
                    <div key={item.menuItemId} className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                      {item.image && <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <VegIcon isVeg={item.isVeg !== false} className="w-3 h-3" />
                          <h4 className="font-bold text-sm truncate">{item.name}</h4>
                        </div>
                        <p className="text-primary font-bold text-sm">₹{(item.price / 100).toFixed(0)}</p>
                      </div>
                      <div className="flex items-center border border-primary rounded-lg overflow-hidden">
                        <button onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 transition">
                          {item.quantity === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
                        </button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => addToCart(item)}
                          className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 transition">
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Upsell */}
                  <div className="border border-dashed border-border rounded-xl p-3">
                    <p className="text-xs font-bold text-muted-foreground mb-2">🍹 Add a drink?</p>
                    <div className="flex gap-2">
                      {UPSELL.map(u => (
                        <button key={u.id} onClick={() => addToCart({ menuItemId: u.id, name: u.name, price: u.price, image: u.image, isVeg: u.isVeg, quantity: 1 })}
                          className="flex items-center gap-2 bg-muted rounded-lg px-2 py-1.5 text-xs font-semibold hover:bg-primary/10 transition">
                          <img src={u.image} alt={u.name} className="w-7 h-7 rounded object-cover" />
                          <div className="text-left"><div>{u.name}</div><div className="text-primary font-bold">₹{u.price/100}</div></div>
                          <Plus size={14} className="text-primary" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Coupon */}
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2 glass-input rounded-xl px-3 border">
                      <Tag size={16} className="text-primary" />
                      <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code" className="flex-1 bg-transparent py-2.5 text-sm font-semibold outline-none" />
                    </div>
                    <Button onClick={applyCoupon} variant="outline" className="px-4 font-bold border-primary text-primary">Apply</Button>
                  </div>
                  {discount > 0 && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-xl text-sm font-bold">
                      🎉 Coupon applied! You saved ₹{(discount/100).toFixed(0)}
                    </motion.div>
                  )}
                </div>

                {/* Bill Breakdown */}
                <div className="border-t border-border p-4 space-y-2">
                  <h3 className="font-bold text-sm mb-3">Bill Details</h3>
                  {[
                    { label: 'Subtotal', val: cartTotal },
                    { label: 'GST (5%)', val: gst },
                    { label: delivery === 0 ? 'Delivery (FREE!)' : 'Delivery Fee', val: delivery, green: delivery === 0 },
                    { label: 'Packing Charge', val: packing },
                    discount > 0 ? { label: 'Coupon Discount', val: -discount, green: true } : null,
                  ].filter(Boolean).map(row => (
                    <div key={row.label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className={`font-semibold ${row.green ? 'text-green-600' : ''}`}>
                        {row.val < 0 ? '−' : ''}₹{(Math.abs(row.val)/100).toFixed(0)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between font-black text-base pt-3 border-t border-border">
                    <span>To Pay</span><span>₹{(total/100).toFixed(0)}</span>
                  </div>
                  <Button onClick={handleCheckout} className="w-full h-14 text-base font-black rounded-xl mt-2 flex items-center justify-center gap-2">
                    Proceed to Checkout <ChevronRight size={20} />
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
