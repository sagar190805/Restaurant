import React, { useState } from 'react';
import { Layout, Breadcrumbs } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Phone, Mail, MapPin, MessageCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  { q: 'What are your delivery hours?', a: 'We deliver Monday to Sunday from 11:00 AM to 10:30 PM.' },
  { q: 'Do you offer vegan/Jain food?', a: 'Yes! We have many vegan and Jain options. Filter by "Veg" on the menu page and look for the Jain badge.' },
  { q: 'How do I track my order?', a: 'After placing an order, you\'ll receive an SMS with your order ID. Visit /track and enter your order ID and mobile number.' },
  { q: 'What is your cancellation policy?', a: 'Orders can be cancelled within 2 minutes of placing. After that, the food is already being prepared.' },
  { q: 'Do you accept cash on delivery?', a: 'Yes! We accept COD for orders up to ₹1000. For larger orders, please use digital payment.' },
  { q: 'Is there a minimum order value?', a: 'Yes, the minimum order value for delivery is ₹150. There is no minimum for takeaway orders.' },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between p-4 text-left font-bold hover:bg-muted/50 transition">
        {q}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={20} className="text-muted-foreground shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <p className="px-4 pb-4 text-muted-foreground text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: 'Contact' }]} />
        <h1 className="text-4xl font-black font-serif mb-8">📞 Contact Us</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Form */}
          <div>
            <h2 className="text-xl font-black mb-4">Send a Message</h2>
            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-2">✅</div>
                <h3 className="font-bold text-green-700">Message Sent!</h3>
                <p className="text-sm text-green-600 mt-1">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { key: 'name', label: 'Your Name', placeholder: 'Rahul Kumar', type: 'text' },
                  { key: 'email', label: 'Email Address', placeholder: 'rahul@example.com', type: 'email' },
                  { key: 'phone', label: 'Mobile Number', placeholder: '9876543210', type: 'tel' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-sm font-bold mb-1.5 block">{field.label}</label>
                    <input type={field.type} placeholder={field.placeholder} value={form[field.key]} onChange={e => setForm({...form, [field.key]: e.target.value})}
                      className="w-full border-2 border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition" />
                  </div>
                ))}
                <div>
                  <label className="text-sm font-bold mb-1.5 block">Your Message</label>
                  <textarea rows={4} placeholder="How can we help you?" value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                    className="w-full border-2 border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition resize-none" />
                </div>
                <Button onClick={() => form.name && form.message && setSent(true)} className="w-full h-12 font-bold rounded-xl">Send Message</Button>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-black mb-4">Get in Touch</h2>
            <div className="space-y-4">
              <a href="tel:+919876543210" className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary transition group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition">
                  <Phone size={22} className="text-primary group-hover:text-primary-foreground" />
                </div>
                <div>
                  <p className="font-black">Call Us</p>
                  <p className="text-muted-foreground text-sm">+91 98765 43210</p>
                </div>
              </a>
              <a href="mailto:hello@spiceroute.in" className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary transition group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition">
                  <Mail size={22} className="text-primary group-hover:text-primary-foreground" />
                </div>
                <div>
                  <p className="font-black">Email Us</p>
                  <p className="text-muted-foreground text-sm">hello@spiceroute.in</p>
                </div>
              </a>
              <a href="https://wa.me/919876543210" target="_blank" className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-green-500 transition group">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition">
                  <MessageCircle size={22} className="text-green-600 group-hover:text-white" />
                </div>
                <div>
                  <p className="font-black">WhatsApp</p>
                  <p className="text-muted-foreground text-sm">Chat with us instantly</p>
                </div>
              </a>
              <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-2xl">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <MapPin size={22} className="text-primary" />
                </div>
                <div>
                  <p className="font-black">Visit Us</p>
                  <p className="text-muted-foreground text-sm">42, MG Road, Indiranagar, Bangalore 560038</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-black mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map(faq => <FaqItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </div>
    </Layout>
  );
}
