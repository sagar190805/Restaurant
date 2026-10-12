import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMenu } from '@/utils/api';
import { useAppContext } from '@/context/AppContext';
import { Search, Leaf, Flame, Star, ShoppingBag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';

import { Layout, Breadcrumbs } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { VegIcon } from '@/components/ui/VegIcon';
import { QuantityStepper } from '@/components/ui/QuantityStepper';

const DEFAULT_ITEM_IMG = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80";

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, veg, nonveg, bestseller, spicy
  const [sortBy, setSortBy] = useState('popular'); // popular, price-low, price-high
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  
  const { cart, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal } = useAppContext();
  const navigate = useNavigate();
  const observerRefs = useRef({});

  useEffect(() => {
    setIsLoading(true);
    fetchMenu().then(data => {
      setCategories(data || []);
      if (data && data.length > 0) setActiveCategory(data[0].name);
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  // Scroll spy effect
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveCategory(entry.target.id);
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    Object.values(observerRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [categories, searchQuery, activeFilter, sortBy]);

  const scrollToCategory = (catName) => {
    const el = document.getElementById(catName);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const getQuantity = (id) => {
    return cart.filter(i => i.menuItemId === id).reduce((acc, curr) => acc + curr.quantity, 0);
  };

  const handleAdd = (item) => {
    addToCart({ menuItemId: item.id, name: item.name, price: item.price, image: item.image, isVeg: item.isVeg });
  };
  
  const handleDecrease = (id) => {
    const existing = cart.find(i => i.menuItemId === id);
    if (existing) {
      if (existing.quantity > 1) {
        updateQuantity(existing.menuItemId, existing.quantity - 1);
      } else {
        removeFromCart(existing.menuItemId);
      }
    }
  };

  // Filter & Sort Logic
  const processedCategories = useMemo(() => {
    return categories.map(cat => {
      let filteredItems = cat.items.filter(item => {
        if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (activeFilter === 'veg' && item.isVeg === false) return false;
        if (activeFilter === 'nonveg' && item.isVeg !== false) return false;
        if (activeFilter === 'bestseller' && !item.isBestseller) return false;
        if (activeFilter === 'spicy' && !item.spiceLevel) return false;
        return true;
      });

      if (sortBy === 'price-low') filteredItems.sort((a, b) => a.price - b.price);
      if (sortBy === 'price-high') filteredItems.sort((a, b) => b.price - a.price);
      
      return { ...cat, items: filteredItems };
    }).filter(cat => cat.items.length > 0);
  }, [categories, searchQuery, activeFilter, sortBy]);

  return (
    <Layout>
      {/* Sub-Header for Menu Filters */}
      <div className="sticky top-[64px] z-40 glass backdrop-blur-md border-b border-border py-4 px-4 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search for dishes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-muted rounded-full text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          
          <div className="flex w-full md:w-auto overflow-x-auto scrollbar-hide pb-2 md:pb-0 gap-2 items-center">
            <Button variant={activeFilter === 'all' ? 'default' : 'outline'} size="sm" className="rounded-full shrink-0" onClick={() => setActiveFilter('all')}>
              All
            </Button>
            <Button variant={activeFilter === 'veg' ? 'default' : 'outline'} size="sm" className={`rounded-full shrink-0 gap-1 ${activeFilter === 'veg' ? 'bg-green-600 text-white' : 'text-green-600 border-green-200'}`} onClick={() => setActiveFilter('veg')}>
              <Leaf size={14} /> Veg
            </Button>
            <Button variant={activeFilter === 'nonveg' ? 'default' : 'outline'} size="sm" className={`rounded-full shrink-0 gap-1 ${activeFilter === 'nonveg' ? 'bg-red-600 text-white' : 'text-red-600 border-red-200'}`} onClick={() => setActiveFilter('nonveg')}>
              <Flame size={14} /> Non-Veg
            </Button>
            <Button variant={activeFilter === 'bestseller' ? 'default' : 'outline'} size="sm" className={`rounded-full shrink-0 gap-1 ${activeFilter === 'bestseller' ? 'bg-amber-500 text-white' : 'text-amber-600 border-amber-200'}`} onClick={() => setActiveFilter('bestseller')}>
              <Star size={14} /> Bestseller
            </Button>
            
            <div className="ml-auto flex items-center gap-2 border-l border-border pl-2">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm bg-transparent font-semibold text-muted-foreground outline-none cursor-pointer">
                <option value="popular">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row relative">
        {/* Sidebar */}
        <div className="sticky z-30 glass border-b border-border md:border-b-0 md:border-r md:w-64 md:h-[calc(100vh-140px)] md:overflow-y-auto top-[125px]">
          <ul className="flex md:flex-col overflow-x-auto scrollbar-hide px-2 md:px-4 py-2 md:py-6 gap-2 md:gap-1">
            {processedCategories.map((cat) => (
              <li key={cat.id} className="shrink-0 md:shrink">
                <button 
                  onClick={() => scrollToCategory(cat.name)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    activeCategory === cat.name 
                      ? 'bg-primary/10 text-primary border-l-4 border-primary shadow-sm' 
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {cat.name} ({cat.items.length})
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-8 pb-32">
          {isLoading && (
            <div className="space-y-8">
              {[1, 2].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-8 bg-muted rounded w-1/4 mb-6" />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(j => <div key={j} className="h-40 bg-muted rounded-2xl" />)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {processedCategories.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingBag size={48} className="text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-bold mb-2">No dishes found</h3>
              <p className="text-muted-foreground">Try changing your filters or search query.</p>
            </div>
          )}

          {processedCategories.map(cat => (
            <div key={cat.id} id={cat.name} ref={el => observerRefs.current[cat.id] = el} className="mb-12 scroll-mt-36">
              <h2 className="text-2xl font-black mb-6 font-serif tracking-tight">{cat.name}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {cat.items.map(item => {
                  const count = getQuantity(item.id);
                  return (
                    <div key={item.id} className="glass-panel p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex gap-4 group cursor-pointer" onClick={() => setSelectedItem(item)}>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <VegIcon isVeg={item.isVeg !== false} />
                            {item.isBestseller && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded flex items-center gap-0.5"><Star size={10} className="fill-amber-700" /> Bestseller</span>}
                          </div>
                          <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                          <p className="font-semibold mb-2">₹{(item.price / 100).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                      <div className="relative w-32 h-32 shrink-0">
                        <img src={item.image || DEFAULT_ITEM_IMG} alt={item.name} className="w-full h-full object-cover rounded-xl shadow-sm" />
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 shadow-lg rounded-xl bg-card" onClick={e => e.stopPropagation()}>
                          {item.inStock === false ? (
                              <button disabled className="bg-gray-100 text-gray-400 font-black px-6 py-2 rounded-xl shadow-sm text-sm border-2 border-gray-200 whitespace-nowrap cursor-not-allowed">
                                OUT OF STOCK
                              </button>
                            ) : count === 0 ? (
                            <button onClick={() => handleAdd(item)} className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-black px-6 py-2 rounded-xl transition-all shadow-sm text-sm border-2 border-primary/20 whitespace-nowrap">
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
            </div>
          ))}
        </div>
      </div>

      {/* Floating Bottom Cart (replaces old monolithic one) */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            className="fixed bottom-0 md:bottom-6 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:w-[400px] z-[60] p-4 md:p-0">
            <div className="bg-primary text-primary-foreground p-4 rounded-2xl shadow-2xl flex justify-between items-center cursor-pointer hover:bg-primary/90 transition" onClick={() => navigate('/cart')}>
              <div className="flex flex-col">
                <span className="font-bold text-sm">{cartCount} ITEM{cartCount > 1 ? 'S' : ''} | ₹{(cartTotal/100).toFixed(2)}</span>
                <span className="text-xs opacity-80">Extra charges may apply</span>
              </div>
              <div className="flex items-center gap-2 font-black text-sm">
                View Cart <ShoppingBag size={18} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Radix Dialog for Item Details */}
      <Dialog.Root open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-[200] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-card p-0 shadow-2xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {selectedItem && (
              <>
                <div className="relative h-64 shrink-0 bg-muted">
                  <img src={selectedItem?.image || DEFAULT_ITEM_IMG} alt={selectedItem.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Dialog.Close asChild>
                    <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur p-2 rounded-full text-white transition">
                      <X size={20} />
                    </button>
                  </Dialog.Close>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                  <VegIcon isVeg={selectedItem.isVeg !== false} className="mb-2" />
                  <Dialog.Title className="text-2xl font-black mb-1">{selectedItem.name}</Dialog.Title>
                  <p className="font-bold text-lg mb-4">₹{(selectedItem.price / 100).toFixed(2)}</p>
                  <div className="bg-muted p-4 rounded-xl mb-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedItem.description}</p>
                  </div>
                </div>
                <div className="p-4 border-t border-border flex justify-between items-center bg-card">
                  <div className="flex items-center gap-4">
                    <QuantityStepper 
                      quantity={getQuantity(selectedItem.id) || 1} 
                      onIncrease={() => handleAdd(selectedItem)}
                      onDecrease={() => handleDecrease(selectedItem.id)}
                    />
                  </div>
                  <Button disabled={selectedItem.inStock === false} className="font-black px-8" onClick={() => {
                    if (getQuantity(selectedItem.id) === 0) handleAdd(selectedItem);
                    setSelectedItem(null);
                  }}>
                    Add Item
                  </Button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Layout>
  );
}





