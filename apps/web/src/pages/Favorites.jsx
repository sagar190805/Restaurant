import React, { useState } from 'react';
import { Layout, Breadcrumbs, EmptyState } from '@/components/Layout';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Heart } from 'lucide-react';

const MOCK_FAVS = [
  { id: '1', name: 'Butter Chicken', category: 'Main Course', price: 36000, image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300&q=70', isVeg: false },
  { id: '2', name: 'Dal Makhani', category: 'Main Course', price: 24000, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&q=70', isVeg: true },
  { id: '3', name: 'Hyderabadi Biryani', category: 'Biryani', price: 32000, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&q=70', isVeg: false },
];

export default function Favorites() {
  const { addToCart, token, setLoginOpen } = useAppContext();
  const [favs, setFavs] = useState(MOCK_FAVS);

  if (!token) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <Heart size={64} className="text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your Favorites</h2>
          <p className="text-muted-foreground mb-6">Login to save and access your favorite dishes.</p>
          <Button onClick={() => setLoginOpen(true)} className="px-8 rounded-full">Login</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: 'Favorites' }]} />
        <h1 className="text-3xl font-black font-serif mb-8">❤️ Your Favorites</h1>
        {favs.length === 0 ? (
          <EmptyState icon="💔" title="No favorites yet" description="Tap the heart icon on any dish to save it here." actionLabel="Browse Menu" onAction={() => window.location.href='/menu'} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favs.map(fav => (
              <div key={fav.id} className="bg-card border border-border rounded-2xl overflow-hidden group">
                <div className="relative">
                  <img src={fav.image} alt={fav.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <button onClick={() => setFavs(f => f.filter(x => x.id !== fav.id))}
                    className="absolute top-2 right-2 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Heart size={18} className="text-red-500 fill-red-500" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-bold">{fav.name}</h3>
                      <p className="text-xs text-muted-foreground">{fav.category}</p>
                    </div>
                    <span className="font-black text-primary">₹{fav.price/100}</span>
                  </div>
                  <Button onClick={() => addToCart({ menuItemId: fav.id, name: fav.name, price: fav.price, image: fav.image, isVeg: fav.isVeg, quantity: 1 })}
                    className="w-full mt-3 h-9 text-sm font-bold rounded-xl">Add to Cart</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
