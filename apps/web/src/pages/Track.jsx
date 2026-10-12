import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout, Breadcrumbs } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ChefHat, Package, Bike, MapPin, Phone, MessageCircle, Clock, XCircle, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUSES = [
  { id: 'PENDING', label: 'Order Placed', icon: CheckCircle2, color: 'bg-blue-500', ts: '7:30 PM' },
  { id: 'ACCEPTED', label: 'Order Accepted', icon: CheckCircle2, color: 'bg-purple-500', ts: '7:32 PM' },
  { id: 'PREPARING', label: 'Being Prepared', icon: ChefHat, color: 'bg-yellow-500', ts: '7:35 PM' },
  { id: 'READY', label: 'Ready for Pickup', icon: Package, color: 'bg-orange-500', ts: '' },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Bike, color: 'bg-primary', ts: '' },
  { id: 'DELIVERED', label: 'Delivered 🎉', icon: CheckCircle2, color: 'bg-green-500', ts: '' },
];

function TrackSearch() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛵</div>
        <h1 className="text-3xl font-black font-serif mb-2">Track Your Order</h1>
        <p className="text-muted-foreground mb-8">Enter your order ID and mobile number to track your order in real time.</p>
        <div className="bg-card border border-border rounded-2xl p-6 text-left space-y-4">
          <div>
            <label className="text-sm font-bold mb-1 block">Order ID</label>
            <input value={orderId} onChange={e => setOrderId(e.target.value.toUpperCase())}
              placeholder="e.g. ORD-ABC123" className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-primary transition" />
          </div>
          <div>
            <label className="text-sm font-bold mb-1 block">Mobile Number</label>
            <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,''))} maxLength={10}
              placeholder="10-digit number" className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-primary transition" />
          </div>
          <Button onClick={() => orderId && navigate(`/track/${orderId}`)} className="w-full h-12 font-bold rounded-xl">Track Order</Button>
        </div>
      </div>
    </Layout>
  );
}

function LiveTracker({ id }) {
  const [currentStatus, setCurrentStatus] = useState('PREPARING');
  const currentIdx = STATUSES.findIndex(s => s.id === currentStatus);
  const eta = new Date(Date.now() + 22 * 60000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const simulate = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < STATUSES.length) setCurrentStatus(STATUSES[nextIdx].id);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ to: '/track', label: 'Track Order' }, { label: id }]} />

        {/* ETA Banner */}
        <div className="bg-primary text-primary-foreground rounded-2xl p-6 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80 mb-1">Estimated Delivery</p>
            <p className="text-3xl font-black">~22 mins</p>
            <p className="text-sm opacity-80">by {eta}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80 mb-1">Order ID</p>
            <p className="font-black">{id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Timeline */}
          <div className="space-y-6">
            {/* Rider Card */}
            {currentIdx >= 4 && (
              <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&q=80" alt="Rider" className="w-14 h-14 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="font-black">Rahul Kumar</p>
                  <p className="text-sm text-muted-foreground">⭐ 4.8 · KA 01 AB 1234</p>
                </div>
                <a href="tel:+919876543210" className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <Phone size={18} />
                </a>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-black text-lg mb-6 font-serif">Order Status</h3>
              <div className="relative">
                {STATUSES.map((status, idx) => {
                  const done = idx <= currentIdx;
                  const active = idx === currentIdx;
                  return (
                    <div key={status.id} className="flex gap-4 pb-6 last:pb-0 relative">
                      {idx < STATUSES.length - 1 && (
                        <div className={`absolute left-4 top-8 w-0.5 h-full transition-colors ${done ? 'bg-primary' : 'bg-border'}`} />
                      )}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                        active ? `${status.color} text-white ring-4 ring-primary/20 scale-110` :
                        done ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        <status.icon size={15} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className={`font-bold ${active ? 'text-primary text-base' : done ? '' : 'text-muted-foreground'}`}>{status.label}</p>
                        {status.ts && done && <p className="text-xs text-muted-foreground mt-0.5">{status.ts}</p>}
                        {active && <p className="text-xs text-muted-foreground mt-0.5 animate-pulse">In progress...</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-card border border-border rounded-xl font-bold text-sm hover:bg-muted transition">
                <MessageCircle size={16} className="text-primary" /> Need Help?
              </button>
              {currentIdx === 0 && (
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 border border-red-200 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100 transition">
                  <XCircle size={16} /> Cancel Order
                </button>
              )}
            </div>

            {/* Dev Simulate Button */}
            {process.env.NODE_ENV !== 'production' && (
              <button onClick={simulate} className="w-full py-2 border border-dashed border-border rounded-xl text-xs text-muted-foreground font-mono hover:bg-muted transition">
                🧪 [DEV] Simulate next status → {STATUSES[Math.min(currentIdx + 1, STATUSES.length - 1)].label}
              </button>
            )}
          </div>

          {/* Right: Map */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl overflow-hidden h-80 lg:h-auto lg:flex-1 relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80')] bg-cover bg-center opacity-40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 text-center shadow-lg">
                  <p className="font-black text-primary text-xl">Live Map</p>
                  <p className="text-sm text-muted-foreground">Rider is 2.3 km away</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg"><MapPin size={20} className="text-white" /></div>
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg animate-bounce"><Bike size={20} className="text-white" /></div>
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg"><Navigation size={20} className="text-white" /></div>
                </div>
                <p className="text-xs text-white/80 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">🗺 Live tracking via Socket.IO</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function Track() {
  const { id } = useParams();
  return id ? <LiveTracker id={id} /> : <TrackSearch />;
}
