import React, { useState } from 'react';
import { Layout, Breadcrumbs } from '@/components/Layout';
import { X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', caption: 'Our Restaurant', cat: 'ambiance' },
  { src: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&q=80', caption: 'Butter Chicken', cat: 'food' },
  { src: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80', caption: 'Hyderabadi Biryani', cat: 'food' },
  { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80', caption: 'Our Kitchen', cat: 'kitchen' },
  { src: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80', caption: 'Dal Makhani', cat: 'food' },
  { src: 'https://images.unsplash.com/photo-1599487405702-8e8d89e4745c?w=600&q=80', caption: 'Paneer Tikka', cat: 'food' },
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', caption: 'Fine Dining Area', cat: 'ambiance' },
  { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', caption: 'Chef\'s Special', cat: 'food' },
  { src: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80', caption: 'Samosa Chaat', cat: 'food' },
];

const CATS = ['all', 'food', 'ambiance', 'kitchen'];

export default function Gallery() {
  const [active, setActive] = useState('all');
  const [lightbox, setLightbox] = useState(null);
  const shown = active === 'all' ? PHOTOS : PHOTOS.filter(p => p.cat === active);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: 'Gallery' }]} />
        <h1 className="text-4xl font-black font-serif mb-8">📸 Gallery</h1>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6">
          {CATS.map(c => (
            <button key={c} onClick={() => setActive(c)}
              className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${active === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70'}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {shown.map((photo, i) => (
            <motion.div key={photo.src} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={() => setLightbox(i)} className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group">
              <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="text-white text-xs font-bold">{photo.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}>
            <button className="absolute top-4 right-4 text-white" onClick={() => setLightbox(null)}><X size={28} /></button>
            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              src={shown[lightbox]?.src} alt={shown[lightbox]?.caption}
              className="max-w-full max-h-[85vh] rounded-2xl object-contain"
              onClick={e => e.stopPropagation()} />
            <p className="absolute bottom-6 text-white font-bold text-lg">{shown[lightbox]?.caption}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
