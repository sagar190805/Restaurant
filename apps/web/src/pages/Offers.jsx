import React, { useState } from 'react';
import { Layout, Breadcrumbs, EmptyState, LoadingSpinner } from '@/components/Layout';
import { Tag, Copy, Check, Clock, ChevronRight } from 'lucide-react';

const OFFERS = [
  { code: 'WELCOME50', title: '50% Off on First Order', desc: 'Get 50% off up to ₹100 on your first order!', terms: 'Valid for new users only. Minimum order ₹200. Max discount ₹100.', expiry: '31 Oct 2026', bg: 'from-orange-500 to-red-500', emoji: '🎉' },
  { code: 'FREEDEL', title: 'Free Delivery', desc: 'Free delivery on orders above ₹199', terms: 'No minimum for free delivery. Valid all days. Not combinable with other offers.', expiry: '31 Dec 2026', bg: 'from-blue-500 to-cyan-500', emoji: '🚴' },
  { code: 'PRO20', title: '20% Off for VIP Members', desc: 'Exclusive 20% off for loyalty members', terms: 'Valid for users with 500+ loyalty points. Max discount ₹150.', expiry: '30 Nov 2026', bg: 'from-purple-500 to-pink-500', emoji: '⭐' },
  { code: 'WEEKEND30', title: 'Weekend Special 30% Off', desc: 'Enjoy 30% off every Saturday and Sunday', terms: 'Valid Saturdays & Sundays only. Minimum order ₹350.', expiry: '31 Dec 2026', bg: 'from-green-500 to-teal-500', emoji: '🎊' },
  { code: 'BIRYANI15', title: 'Biryani Lover Deal', desc: '15% off on all biryani orders', terms: 'Valid on orders containing at least one biryani. No minimum.', expiry: '15 Nov 2026', bg: 'from-yellow-500 to-orange-500', emoji: '🍚' },
];

function CouponCard({ offer }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(offer.code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className={`bg-gradient-to-r ${offer.bg} p-6 text-white relative overflow-hidden`}>
        <div className="absolute -right-4 -top-4 text-8xl opacity-20">{offer.emoji}</div>
        <h3 className="text-2xl font-black font-serif mb-1">{offer.title}</h3>
        <p className="text-white/90 text-sm">{offer.desc}</p>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 flex items-center gap-2 bg-muted border border-dashed border-border rounded-xl px-4 py-2.5">
            <Tag size={16} className="text-primary" />
            <span className="font-black text-lg tracking-widest">{offer.code}</span>
          </div>
          <button onClick={copy} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${copied ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground hover:opacity-90'}`}>
            {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy</>}
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Clock size={12} /> <span>Expires: {offer.expiry}</span>
        </div>
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer text-primary font-semibold mb-1">Terms & Conditions</summary>
          <p className="mt-1 leading-relaxed">{offer.terms}</p>
        </details>
      </div>
    </div>
  );
}

export default function Offers() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: 'Offers' }]} />
        <div className="mb-8">
          <h1 className="text-4xl font-black font-serif mb-2">🎁 Deals & Offers</h1>
          <p className="text-muted-foreground">Exclusive coupons just for you. Copy and apply at checkout!</p>
        </div>
        <div className="space-y-6">
          {OFFERS.map(o => <CouponCard key={o.code} offer={o} />)}
        </div>
      </div>
    </Layout>
  );
}
