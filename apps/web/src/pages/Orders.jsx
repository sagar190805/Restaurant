import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Breadcrumbs, EmptyState } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Package, Clock, CheckCircle2, Bike, RefreshCw, FileText, Star } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const MOCK_ORDERS = [
  { id: 'ORD-ABC123', date: '28 Sep 2026', items: ['Butter Chicken', 'Garlic Naan x2'], total: 52000, status: 'PREPARING', payment: 'UPI' },
  { id: 'ORD-DEF456', date: '25 Sep 2026', items: ['Hyderabadi Biryani', 'Dal Makhani', 'Lassi'], total: 71000, status: 'DELIVERED', payment: 'COD' },
  { id: 'ORD-GHI789', date: '20 Sep 2026', items: ['Paneer Tikka', 'Tandoori Chicken', 'Roti x3'], total: 85000, status: 'DELIVERED', payment: 'Card' },
];

const STATUS_STYLES = {
  PENDING: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-purple-100 text-purple-700',
  PREPARING: 'bg-yellow-100 text-yellow-700',
  READY: 'bg-orange-100 text-orange-700',
  OUT_FOR_DELIVERY: 'bg-primary/10 text-primary',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const { token, setLoginOpen } = useAppContext();
  const [tab, setTab] = useState('active');

  if (!token) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <Package size={64} className="text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Track your orders</h2>
          <p className="text-muted-foreground mb-6">Login to view your order history and reorder your favorites.</p>
          <Button onClick={() => setLoginOpen(true)} className="px-8 rounded-full">Login to Continue</Button>
        </div>
      </Layout>
    );
  }

  const active = MOCK_ORDERS.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
  const past = MOCK_ORDERS.filter(o => o.status === 'DELIVERED' || o.status === 'CANCELLED');
  const shown = tab === 'active' ? active : past;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: 'My Orders' }]} />
        <h1 className="text-3xl font-black font-serif mb-6">My Orders</h1>

        {/* Tabs */}
        <div className="flex bg-muted rounded-xl p-1 mb-6">
          {[{ id: 'active', label: `Active (${active.length})` }, { id: 'past', label: `Past (${past.length})` }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${tab === t.id ? 'bg-card shadow text-foreground' : 'text-muted-foreground'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <EmptyState icon="📦" title={tab === 'active' ? 'No active orders' : 'No past orders'} description="Your orders will appear here." actionLabel="Order Now" onAction={() => window.location.href='/menu'} />
        ) : (
          <div className="space-y-4">
            {shown.map(order => (
              <div key={order.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-black">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.date} · {order.payment}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[order.status]}`}>{order.status.replace('_', ' ')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{order.items.join(', ')}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-lg">₹{(order.total/100).toFixed(0)}</span>
                    <div className="flex gap-2">
                      {order.status !== 'DELIVERED' && (
                        <Link to={`/track/${order.id}`}>
                          <button className="flex items-center gap-1.5 text-xs font-bold text-primary px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition">
                            <Bike size={14} /> Track
                          </button>
                        </Link>
                      )}
                      <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/70 transition">
                        <RefreshCw size={14} /> Reorder
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/70 transition">
                        <FileText size={14} /> Invoice
                      </button>
                      {order.status === 'DELIVERED' && (
                        <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition">
                          <Star size={14} /> Rate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
