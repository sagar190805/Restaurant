import React, { useState, useEffect } from 'react';
import { Layout, Breadcrumbs } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { useAppContext } from '@/context/AppContext';
import { fetchAddresses } from '@/utils/api';
import AddressModal from '@/components/AddressModal';
import { User, MapPin, Phone, Mail, Star, Gift, Plus, Edit, Trash2, Sun, Moon, Globe } from 'lucide-react';

const LOYALTY_HISTORY = [
  { date: '28 Sep', desc: 'Order ORD-ABC123', pts: +50 },
  { date: '25 Sep', desc: 'Order ORD-DEF456', pts: +70 },
  { date: '20 Sep', desc: 'Redeemed discount', pts: -100 },
];

export default function Profile() {
  const { user, logout, token, setLoginOpen, theme, setTheme, lang, setLang } = useAppContext();
  const [tab, setTab] = useState('profile');
  const [addresses, setAddresses] = useState([]);
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  useEffect(() => {
    if (token && tab === 'addresses') {
      fetchAddresses(token).then(setAddresses).catch(console.error);
    }
  }, [token, tab]);

  if (!token || !user) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <User size={64} className="text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">My Profile</h2>
          <p className="text-muted-foreground mb-6">Login to manage your profile, addresses and loyalty points.</p>
          <Button onClick={() => setLoginOpen(true)} className="px-8 rounded-full">Login</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: 'Profile' }]} />

        {/* Profile Header */}
        <div className="flex items-center gap-5 mb-8 p-5 bg-card border border-border rounded-2xl">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-black">
            {(user.name || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black">{user.name || 'Customer'}</h2>
            <p className="text-muted-foreground text-sm">{user.phone}</p>
          </div>
          <button className="px-4 py-2 rounded-xl border border-border text-sm font-bold hover:bg-muted transition flex items-center gap-2">
            <Edit size={14} /> Edit
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-muted rounded-xl p-1 mb-6 overflow-x-auto gap-1">
          {[
            { id: 'profile', label: 'Profile' },
            { id: 'addresses', label: 'Addresses' },
            { id: 'loyalty', label: '🎁 Loyalty' },
            { id: 'preferences', label: 'Preferences' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${tab === t.id ? 'bg-card shadow text-foreground' : 'text-muted-foreground'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <div className="space-y-4">
            {[
              { icon: User, label: 'Full Name', value: user.name || 'Not set' },
              { icon: Phone, label: 'Mobile', value: user.phone },
              { icon: Mail, label: 'Email', value: user.email || 'Not set' },
            ].map(row => (
              <div key={row.label} className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
                <row.icon size={20} className="text-primary" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{row.label}</p>
                  <p className="font-semibold">{row.value}</p>
                </div>
                <button className="text-xs text-primary font-bold">Edit</button>
              </div>
            ))}
            <Button variant="outline" onClick={logout} className="w-full border-red-200 text-red-500 hover:bg-red-50 mt-4">Logout</Button>
          </div>
        )}

        {tab === 'addresses' && (
          <div className="space-y-3">
            {addresses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin size={48} className="mx-auto mb-3 opacity-30" />
                <p>No addresses saved yet.</p>
              </div>
            ) : (
              addresses.map((addr) => (
                <div key={addr.id} className="flex items-start gap-4 p-4 bg-card border border-border rounded-2xl">
                  <MapPin size={20} className="text-primary mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold">{addr.type}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))
            )}
            <button onClick={() => setAddressModalOpen(true)} className="w-full py-3 border-2 border-dashed border-border rounded-2xl font-bold text-primary flex items-center justify-center gap-2 hover:border-primary transition">
              <Plus size={16} /> Add New Address
            </button>
          </div>
        )}

        {tab === 'loyalty' && (
          <div>
            <div className="bg-gradient-to-r from-primary to-orange-400 text-primary-foreground rounded-2xl p-6 mb-6 text-center">
              <Gift size={32} className="mx-auto mb-2" />
              <p className="text-sm opacity-80 mb-1">Your Loyalty Points</p>
              <p className="text-5xl font-black">320 pts</p>
              <p className="text-sm opacity-80 mt-2">≈ ₹32 reward value</p>
            </div>
            <h3 className="font-bold mb-4">Points History</h3>
            <div className="space-y-3">
              {LOYALTY_HISTORY.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
                  <div>
                    <p className="font-semibold text-sm">{h.desc}</p>
                    <p className="text-xs text-muted-foreground">{h.date}</p>
                  </div>
                  <span className={`font-black ${h.pts > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {h.pts > 0 ? '+' : ''}{h.pts} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'preferences' && (
          <div className="space-y-4">
            <div className="p-4 bg-card border border-border rounded-2xl">
              <p className="font-bold mb-3">Theme</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'default', name: 'Classic Saffron', color: '#ff5200' },
                  { id: 'midnight', name: 'Midnight Gold', color: '#1e293b' },
                  { id: 'fresh-green', name: 'Fresh Green', color: '#16a34a' },
                  { id: 'royal-maroon', name: 'Royal Maroon', color: '#9f1239' },
                ].map(t => (
                  <button key={t.id} onClick={() => setTheme(t.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${theme === t.id ? 'border-primary' : 'border-border'}`}>
                    <div className="w-6 h-6 rounded-full" style={{ background: t.color }} />
                    <span className="font-semibold text-sm">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 bg-card border border-border rounded-2xl flex items-center justify-between">
              <p className="font-bold">Language</p>
              <button onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
                className="flex items-center gap-2 bg-muted px-4 py-2 rounded-xl font-bold text-sm">
                <Globe size={16} /> {lang === 'en' ? 'English' : 'हिंदी'}
              </button>
            </div>
          </div>
        )}
      </div>

      <AddressModal 
        open={addressModalOpen} 
        onClose={() => setAddressModalOpen(false)} 
        onSuccess={(newAddr) => setAddresses(prev => [...prev, newAddr])}
      />
    </Layout>
  );
}
