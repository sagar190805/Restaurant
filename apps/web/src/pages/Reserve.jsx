import React, { useState } from 'react';
import { Layout, Breadcrumbs } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock, Users, User, Phone, CheckCircle2 } from 'lucide-react';

const TIME_SLOTS = ['12:00 PM','12:30 PM','1:00 PM','1:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM'];

export default function Reserve() {
  const [form, setForm] = useState({ date: '', time: '', guests: 2, name: '', phone: '' });
  const [confirmed, setConfirmed] = useState(false);
  const [confirmId] = useState('RES-' + Math.random().toString(36).substr(2,6).toUpperCase());

  const handleSubmit = () => {
    if (form.date && form.time && form.name && form.phone.length >= 10) setConfirmed(true);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: 'Reserve a Table' }]} />
        <h1 className="text-4xl font-black font-serif mb-2">🪑 Reserve a Table</h1>
        <p className="text-muted-foreground mb-8">Book your spot in advance. We'll hold it for 15 minutes.</p>

        {confirmed ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-black mb-2">Reservation Confirmed! 🎉</h2>
            <p className="text-muted-foreground mb-4">Booking ID: <span className="font-black text-primary">{confirmId}</span></p>
            <div className="grid grid-cols-2 gap-4 text-sm text-left max-w-xs mx-auto mb-6">
              <div><p className="text-muted-foreground">Date</p><p className="font-bold">{form.date}</p></div>
              <div><p className="text-muted-foreground">Time</p><p className="font-bold">{form.time}</p></div>
              <div><p className="text-muted-foreground">Guests</p><p className="font-bold">{form.guests} people</p></div>
              <div><p className="text-muted-foreground">Name</p><p className="font-bold">{form.name}</p></div>
            </div>
            <p className="text-xs text-muted-foreground">Confirmation SMS sent to +91 {form.phone}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold mb-2 flex items-center gap-2 block"><Calendar size={16} className="text-primary" /> Date</label>
                <input type="date" value={form.date} min={new Date().toISOString().split('T')[0]} onChange={e => setForm({...form, date: e.target.value})}
                  className="w-full border-2 border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="text-sm font-bold mb-2 flex items-center gap-2 block"><Users size={16} className="text-primary" /> Guests</label>
                <div className="flex border-2 border-border rounded-xl overflow-hidden">
                  <button onClick={() => setForm({...form, guests: Math.max(1, form.guests - 1)})} className="px-4 py-3 text-xl font-bold hover:bg-muted transition">−</button>
                  <div className="flex-1 flex items-center justify-center font-black text-xl">{form.guests}</div>
                  <button onClick={() => setForm({...form, guests: Math.min(20, form.guests + 1)})} className="px-4 py-3 text-xl font-bold hover:bg-muted transition">+</button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold mb-3 flex items-center gap-2 block"><Clock size={16} className="text-primary" /> Time Slot</label>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {TIME_SLOTS.map(slot => (
                  <button key={slot} onClick={() => setForm({...form, time: slot})}
                    className={`py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${form.time === slot ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary/50'}`}>
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold mb-2 flex items-center gap-2 block"><User size={16} className="text-primary" /> Full Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name"
                  className="w-full border-2 border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="text-sm font-bold mb-2 flex items-center gap-2 block"><Phone size={16} className="text-primary" /> Mobile Number</label>
                <input type="tel" maxLength={10} value={form.phone} onChange={e => setForm({...form, phone: e.target.value.replace(/\D/g,'')})} placeholder="10-digit number"
                  className="w-full border-2 border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition" />
              </div>
            </div>

            <Button onClick={handleSubmit} className="w-full h-14 text-base font-black rounded-xl">Confirm Reservation</Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
