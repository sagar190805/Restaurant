import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Layout, Breadcrumbs } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { fetchAddresses } from '@/utils/api';
import AddressModal from '@/components/AddressModal';
import { MapPin, Clock, CreditCard, CheckCircle2, ChevronRight, Navigation, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  { id: 1, title: 'Address', icon: MapPin },
  { id: 2, title: 'Time', icon: Clock },
  { id: 3, title: 'Payment', icon: CreditCard },
];

const TIME_SLOTS = ['12:00 PM - 12:30 PM', '12:30 PM - 1:00 PM', '7:00 PM - 7:30 PM', '7:30 PM - 8:00 PM', '8:00 PM - 8:30 PM'];

export default function Checkout() {
  const { cart, cartTotal, clearCart, token, requireLogin, setLoginOpen } = useAppContext();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState('now');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [payment, setPayment] = useState('upi');
  const [loading, setLoading] = useState(false);

  const gst = Math.round(cartTotal * 0.05);
  const delivery = cartTotal >= 49900 ? 0 : 4000;
  const total = cartTotal + gst + delivery + 500;

  useEffect(() => {
    if (cart.length === 0) navigate('/cart');
    if (!token) { 
      setLoginOpen(true); 
    } else {
      fetchAddresses(token).then(data => {
        setAddresses(data);
        if (data.length > 0) setSelectedAddress(data[0].id);
      }).catch(console.error);
    }
  }, [token]);

  const handlePlaceOrder = async () => {
    setLoading(true);
    setTimeout(() => {
      clearCart();
      navigate('/order-success/ORD-' + Date.now().toString(36).toUpperCase());
    }, 1500);
  };

  const handleAddressSuccess = (newAddr) => {
    setAddresses(prev => [...prev, newAddr]);
    setSelectedAddress(newAddr.id);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ to: '/cart', label: 'Cart' }, { label: 'Checkout' }]} />
        <h1 className="text-3xl font-black font-serif mb-8">Checkout</h1>

        {/* Stepper */}
        <div className="flex items-center mb-10 px-4">
          {STEPS.map((s, idx) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                  step > s.id ? 'bg-primary border-primary text-primary-foreground' :
                  step === s.id ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'
                }`}>
                  {step > s.id ? <CheckCircle2 size={20} /> : <s.icon size={18} />}
                </div>
                <span className={`text-xs font-bold mt-1 ${step >= s.id ? 'text-primary' : 'text-muted-foreground'}`}>{s.title}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 transition-colors ${step > s.id ? 'bg-primary' : 'bg-border'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-black mb-6">Delivery Address</h2>
                  <div className="space-y-3 mb-6">
                    {addresses.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <p>No addresses found.</p>
                      </div>
                    ) : (
                      addresses.map(addr => (
                        <label key={addr.id} className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40'}`}>
                          <input type="radio" name="address" checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} className="mt-1 accent-primary w-4 h-4" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-black text-sm">{addr.type}</span>
                              {selectedAddress === addr.id && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Selected</span>}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city} – {addr.pincode}
                            </p>
                          </div>
                          <MapPin size={18} className={selectedAddress === addr.id ? 'text-primary' : 'text-muted-foreground'} />
                        </label>
                      ))
                    )}
                    <button onClick={() => setAddressModalOpen(true)} className="w-full py-3 border-2 border-dashed border-border rounded-2xl font-bold text-primary text-sm flex items-center justify-center gap-2 hover:border-primary transition">
                      <Plus size={16} /> Add New Address
                    </button>
                    <button className="w-full py-3 bg-muted rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-muted/80 transition">
                      <Navigation size={16} className="text-primary" /> Use Current Location
                    </button>
                  </div>
                  <Button onClick={() => setStep(2)} disabled={!selectedAddress} className="w-full h-12 font-black rounded-xl">
                    Continue to Time <ChevronRight size={18} />
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-black mb-6">Delivery Time</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { id: 'now', emoji: '⚡', title: 'Deliver ASAP', sub: '30–45 minutes' },
                      { id: 'schedule', emoji: '📅', title: 'Schedule', sub: 'Pick a date & slot' },
                    ].map(opt => (
                      <button key={opt.id} onClick={() => setDeliveryTime(opt.id)}
                        className={`p-5 rounded-2xl border-2 text-left transition-all ${deliveryTime === opt.id ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40'}`}>
                        <div className="text-3xl mb-2">{opt.emoji}</div>
                        <div className="font-bold">{opt.title}</div>
                        <div className="text-sm text-muted-foreground">{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                  {deliveryTime === 'schedule' && (
                    <div className="mb-6 p-4 bg-muted rounded-2xl">
                      <p className="font-bold mb-3 text-sm">Select a Time Slot</p>
                      <div className="grid grid-cols-2 gap-2">
                        {TIME_SLOTS.map(slot => (
                          <button key={slot} onClick={() => setSelectedSlot(slot)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${selectedSlot === slot ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary'}`}>
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="h-12 px-6 font-bold rounded-xl">Back</Button>
                    <Button onClick={() => setStep(3)} className="flex-1 h-12 font-black rounded-xl">Continue to Payment <ChevronRight size={18} /></Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-black mb-6">Payment Method</h2>
                  <div className="space-y-3 mb-6">
                    {[
                      { id: 'upi', emoji: '📲', label: 'UPI (GPay, PhonePe, Paytm)', sub: 'Instant payment' },
                      { id: 'card', emoji: '💳', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
                      { id: 'netbanking', emoji: '🏦', label: 'Net Banking', sub: 'All major banks' },
                      { id: 'wallet', emoji: '👛', label: 'Wallets', sub: 'Paytm, Mobikwik, Amazon Pay' },
                      { id: 'cod', emoji: '💵', label: 'Cash on Delivery', sub: 'Pay when order arrives' },
                    ].map(method => (
                      <label key={method.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${payment === method.id ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40'}`}>
                        <input type="radio" name="payment" checked={payment === method.id} onChange={() => setPayment(method.id)} className="accent-primary w-4 h-4" />
                        <span className="text-2xl">{method.emoji}</span>
                        <div>
                          <div className="font-bold">{method.label}</div>
                          <div className="text-xs text-muted-foreground">{method.sub}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(2)} className="h-12 px-6 font-bold rounded-xl">Back</Button>
                    <Button onClick={handlePlaceOrder} disabled={loading} className="flex-1 h-14 text-lg font-black rounded-xl">
                      {loading ? '⏳ Placing Order...' : `Place Order · ₹${(total/100).toFixed(0)}`}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-24">
              <h3 className="font-black mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm mb-4 max-h-48 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.menuItemId} className="flex justify-between gap-2">
                    <span className="text-muted-foreground truncate">{item.name} × {item.quantity}</span>
                    <span className="font-semibold shrink-0">₹{((item.price*item.quantity)/100).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{(cartTotal/100).toFixed(0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">GST</span><span>₹{(gst/100).toFixed(0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className={delivery === 0 ? 'text-green-600' : ''}>{delivery === 0 ? 'FREE' : `₹${delivery/100}`}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Packing</span><span>₹5</span></div>
                <div className="flex justify-between font-black text-base border-t border-border pt-2 mt-2">
                  <span>Total</span><span>₹{(total/100).toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddressModal 
        open={addressModalOpen} 
        onClose={() => setAddressModalOpen(false)} 
        onSuccess={handleAddressSuccess}
      />
    </Layout>
  );
}
