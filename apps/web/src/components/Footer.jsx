import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Twitter, ArrowUp } from 'lucide-react';

const QUICK_LINKS = [
  { to: '/', label: 'Home' }, { to: '/menu', label: 'Menu' }, { to: '/offers', label: 'Offers' },
  { to: '/track', label: 'Track Order' }, { to: '/reviews', label: 'Reviews' }, { to: '/gallery', label: 'Gallery' },
  { to: '/reserve', label: 'Reserve a Table' },
];

const HELP_LINKS = [
  { to: '/contact', label: 'Contact Us' }, { to: '/faq', label: 'FAQs' },
  { to: '/privacy', label: 'Privacy Policy' }, { to: '/terms', label: 'Terms & Conditions' },
  { to: '/refund-policy', label: 'Refund & Cancellation' }, { to: '/delivery-policy', label: 'Delivery Policy' },
];

export default function Footer({ settings }) {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const name = settings?.restaurantName || 'Spice Route';
  const phone = settings?.phone || '+91 98765 43210';
  const email = settings?.email || 'hello@spiceroute.in';

  return (
    <footer className="bg-foreground text-background/80 mt-20">
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1: Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">🍛</span>
            <span className="text-2xl font-black font-serif text-background">{name}</span>
          </div>
          <p className="text-sm leading-relaxed mb-4 text-background/60">
            Bringing authentic flavours of India to your doorstep. Every dish crafted with love, spices, and decades of tradition.
          </p>
          <div className="flex gap-3">
            {[Facebook, Instagram, Youtube, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 bg-background/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <Icon size={16} className="text-background" />
              </a>
            ))}
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-background font-black text-sm uppercase tracking-widest mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {QUICK_LINKS.map(link => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-background/60 hover:text-primary transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Help */}
        <div>
          <h4 className="text-background font-black text-sm uppercase tracking-widest mb-4">Help & Policies</h4>
          <ul className="space-y-2">
            {HELP_LINKS.map(link => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-background/60 hover:text-primary transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Contact */}
        <div>
          <h4 className="text-background font-black text-sm uppercase tracking-widest mb-4">Find Us</h4>
          <div className="space-y-3 text-sm text-background/60">
            <div className="flex gap-2">
              <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
              <span>{settings?.address || '42, MG Road, Indiranagar, Bangalore – 560038'}</span>
            </div>
            <a href={`tel:${phone}`} className="flex gap-2 hover:text-primary transition-colors">
              <Phone size={16} className="text-primary shrink-0" /> {phone}
            </a>
            <a href={`https://wa.me/${phone.replace(/\D/g, '')}`} className="flex gap-2 hover:text-primary transition-colors">
              <span className="text-primary font-bold text-xs">WA</span> WhatsApp Us
            </a>
            <a href={`mailto:${email}`} className="flex gap-2 hover:text-primary transition-colors">
              <Mail size={16} className="text-primary shrink-0" /> {email}
            </a>
            <div className="pt-2 border-t border-background/10">
              <p className="font-bold text-background/80 mb-1">Opening Hours</p>
              <p>Mon – Sun: {settings?.openTime || '8:00 AM'} – {settings?.closeTime || '11:30 PM'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-background/40">
          <div className="flex flex-wrap gap-4">
            <span>FSSAI: {settings?.fssaiNumber || '10012345678901'}</span>
            <span>GSTIN: {settings?.gstNumber || '29ABCDE1234F1Z5'}</span>
          </div>
          <div className="flex items-center gap-2">
            {['UPI', 'VISA', 'MC', 'RuPay', 'COD'].map(p => (
              <span key={p} className="px-2 py-1 bg-background/10 rounded font-bold text-[10px] text-background/60">{p}</span>
            ))}
          </div>
          <span>© {new Date().getFullYear()} {name}. All rights reserved.</span>
          <button onClick={scrollTop} className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:opacity-80 transition">
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
