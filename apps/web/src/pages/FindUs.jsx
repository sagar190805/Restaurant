import React, { useState } from 'react';
import { Layout, Breadcrumbs } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { MapPin, Phone, MessageCircle, Navigation, Clock } from 'lucide-react';

const HOURS = [
  { day: 'Monday – Thursday', hours: '11:00 AM – 11:00 PM' },
  { day: 'Friday – Saturday', hours: '11:00 AM – 12:00 AM' },
  { day: 'Sunday', hours: '10:00 AM – 11:00 PM' },
];

const PHOTOS = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=70',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=70',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=70',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=70',
];

export default function FindUs() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: 'Find Us' }]} />
        <h1 className="text-4xl font-black font-serif mb-8">📍 Find Us</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Map */}
          <div className="bg-gray-200 rounded-2xl overflow-hidden h-80 relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80')] bg-cover bg-center opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-2xl px-6 py-4 shadow-xl text-center">
                <div className="text-3xl mb-1">📍</div>
                <p className="font-bold">Spice Route</p>
                <p className="text-xs text-muted-foreground">42, MG Road, Indiranagar</p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black mb-3">Address</h2>
              <div className="flex gap-3 p-4 bg-card border border-border rounded-2xl">
                <MapPin size={20} className="text-primary shrink-0 mt-0.5" />
                <p className="text-muted-foreground">42, MG Road, Indiranagar, Bangalore – 560038, Karnataka, India</p>
              </div>
            </div>

            <div className="flex gap-3">
              <a href="https://maps.google.com/?q=Spice+Route+Bangalore" target="_blank"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition">
                <Navigation size={18} /> Get Directions
              </a>
              <a href="tel:+919876543210"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-card border border-border rounded-xl font-bold hover:bg-muted transition">
                <Phone size={18} /> Call Us
              </a>
              <a href="https://wa.me/919876543210" target="_blank"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition">
                <MessageCircle size={18} /> WhatsApp
              </a>
            </div>

            {/* Hours */}
            <div>
              <h2 className="text-xl font-black mb-3">Opening Hours</h2>
              <div className="space-y-2">
                {HOURS.map(h => (
                  <div key={h.day} className="flex justify-between items-center p-3 bg-card border border-border rounded-xl">
                    <span className="font-semibold text-sm">{h.day}</span>
                    <span className="text-primary font-bold text-sm">{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Photos */}
        <h2 className="text-2xl font-black mb-4">📸 Restaurant Photos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PHOTOS.map((photo, i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden">
              <img src={photo} alt={`Restaurant photo ${i+1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
