import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMenu, fetchSettings } from '@/utils/api';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { VegIcon } from '@/components/ui/VegIcon';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { useAppContext } from '@/context/AppContext';
import { Search, MapPin, ChevronRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const HERO_BG = "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2000&auto=format&fit=crop";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const { cart, addToCart, removeFromCart, updateQuantity } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchMenu(), fetchSettings()])
      .then(([cats, sets]) => {
        setCategories(cats || []);
        setSettings(sets || null);
      })
      .catch(console.error);
  }, []);

  const bestsellers = useMemo(() => {
    return categories.flatMap(cat => cat.items).filter(item => item.isBestseller).slice(0, 8);
  }, [categories]);

  const getItemCount = (id) => {
    return cart.filter(i => i.menuItemId === id).reduce((acc, curr) => acc + curr.quantity, 0);
  };

  const handleAdd = (item) => {
    addToCart(item.id, null, null, item.price, item.name, item.isVeg, item.image);
  };

  const handleDecrease = (id) => {
    const existing = cart.find(i => i.menuItemId === id);
    if (existing) {
      if (existing.quantity > 1) {
        updateQuantity(existing.id, existing.quantity - 1);
      } else {
        removeFromCart(existing.id);
      }
    }
  };

  return (
    <Layout>
      {/* ZOMATO-STYLE HERO */}
      <section className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center flex-col">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_BG})` }} />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        
        <div className="relative z-10 text-center px-4 w-full max-w-4xl flex flex-col items-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
            className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 font-serif italic">
            {settings?.restaurantName || 'Spice Route'}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl text-white font-medium mb-10 tracking-wide shadow-black drop-shadow-md">
            Discover the best food & drinks
          </motion.p>
          
          {/* Search Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="w-full max-w-3xl glass-panel rounded-2xl flex items-center p-2 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-r border-white/20 text-white/90">
              <MapPin size={20} className="text-primary" />
              <span className="font-semibold text-sm">Bangalore</span>
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 py-2">
              <Search size={20} className="text-white/60" />
              <input type="text" placeholder="Search for dishes..." 
                className="w-full bg-transparent outline-none text-white placeholder:text-white/60 font-medium"
                onClick={() => navigate('/menu')}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-12 relative z-20">
        
        {/* TABS (Delivery / Dining Out) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 -mt-24 relative z-30 px-2 md:px-10">
          <motion.div whileHover={{ y: -5 }} onClick={() => navigate('/menu')}
            className="glass-panel cursor-pointer rounded-2xl overflow-hidden flex items-end h-48 relative group border border-white/30 shadow-xl">
            <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80" alt="Delivery" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 p-5 text-white w-full">
              <h3 className="text-2xl font-black mb-1">Order Online</h3>
              <p className="text-white/80 font-medium text-sm flex items-center justify-between">
                Stay home and order to your door <ChevronRight size={16} />
              </p>
            </div>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} onClick={() => navigate('/reserve')}
            className="glass-panel cursor-pointer rounded-2xl overflow-hidden flex items-end h-48 relative group border border-white/30 shadow-xl">
            <img src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80" alt="Dining" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 p-5 text-white w-full">
              <h3 className="text-2xl font-black mb-1">Dining Out</h3>
              <p className="text-white/80 font-medium text-sm flex items-center justify-between">
                View the menu and reserve a table <ChevronRight size={16} />
              </p>
            </div>
          </motion.div>
        </div>

        {/* INSPIRATION CATEGORIES */}
        <section className="mb-16">
          <h2 className="text-3xl font-black mb-8 text-foreground">Inspiration for your first order</h2>
          <div className="flex gap-8 overflow-x-auto pb-4 snap-x scrollbar-hide">
            {categories.map(cat => (
              <div key={cat.id} onClick={() => navigate('/menu')}
                className="flex flex-col items-center gap-4 cursor-pointer group snap-start shrink-0">
                <div className="w-36 h-36 rounded-full overflow-hidden shadow-lg border-4 border-card group-hover:border-primary transition-all relative">
                  <img src={cat.items?.[0]?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80"} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* BESTSELLERS */}
        <section className="mb-16">
          <h2 className="text-3xl font-black mb-8 text-foreground">Best Food in Bangalore</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bestsellers.map(item => {
              const count = getItemCount(item.id);
              return (
                <div key={item.id} className="glass-panel rounded-2xl overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 group flex flex-col border border-white/20">
                  <div className="relative h-64 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 glass px-2 py-1 rounded shadow-sm">
                      <VegIcon isVeg={item.isVeg !== false} />
                    </div>
                    {item.isBestseller && (
                      <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Bestseller
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1 bg-card/40 backdrop-blur-md">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-xl truncate pr-2 text-foreground">{item.name}</h4>
                      <div className="flex items-center gap-1 bg-green-700 text-white px-2 py-0.5 rounded text-xs font-bold shrink-0">
                        4.5 <Star size={10} className="fill-current" />
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">{item.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                      <div className="flex flex-col">
                        <span className="font-black text-xl text-foreground">₹{(item.price / 100).toFixed(0)}</span>
                        <span className="text-xs text-muted-foreground">for one</span>
                      </div>
                      {count === 0 ? (
                        <button onClick={() => handleAdd(item)} className="bg-primary/10 text-primary hover:bg-primary hover:text-white font-black px-8 py-2.5 rounded-xl transition shadow-sm text-sm border border-primary/30 active:scale-95">
                          ADD
                        </button>
                      ) : (
                        <QuantityStepper quantity={count} onIncrease={() => handleAdd(item)} onDecrease={() => handleDecrease(item.id)} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </Layout>
  );
}


