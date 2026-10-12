import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ChefHat, Bike, Package, Phone, MessageSquare, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const STATUSES = [
  { id: 'PENDING', label: 'Order Placed', icon: CheckCircle2, time: '12:00 PM' },
  { id: 'ACCEPTED', label: 'Order Accepted', icon: ChefHat, time: '12:02 PM' },
  { id: 'PREPARING', label: 'Preparing Food', icon: ChefHat, time: '12:15 PM' },
  { id: 'READY', label: 'Ready for Pickup', icon: Package, time: '' },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Bike, time: '' },
  { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle2, time: '' },
];

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState('PREPARING');
  
  const currentIdx = STATUSES.findIndex(s => s.id === currentStatus);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white p-4 sticky top-0 z-50 flex items-center shadow-sm">
        <button onClick={() => navigate('/')} className="mr-4 text-gray-800">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold font-serif">Track Order</h1>
      </header>
      
      {/* Confetti / Success header */}
      <div className="bg-primary text-white p-6 rounded-b-3xl shadow-md text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block bg-white/20 p-4 rounded-full mb-4">
          <CheckCircle2 size={40} className="text-white" />
        </motion.div>
        <h2 className="text-3xl font-black font-serif mb-1">Arriving in 25 mins</h2>
        <p className="opacity-90">Order #{id?.split('-')[0] || '1234'}</p>
      </div>

      <main className="max-w-xl mx-auto p-4 -mt-4">
        {/* Map Placeholder */}
        <Card className="h-48 mb-6 bg-gray-200 overflow-hidden relative border-2 border-white shadow-lg">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80')] bg-cover bg-center opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-black/50 text-white px-4 py-2 rounded-full font-bold backdrop-blur-md">Live Map Tracking</span>
          </div>
        </Card>

        {/* Rider Info */}
        {currentIdx >= 3 && (
          <Card className="p-4 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80" alt="Rider" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">Rahul Kumar</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1"><Star size={12} className="text-orange-500 fill-orange-500"/> 4.8 Delivery Partner</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="w-10 h-10 p-0 rounded-full text-primary border-primary"><Phone size={18} /></Button>
            </div>
          </Card>
        )}

        {/* Timeline */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-6 font-serif">Order Status</h3>
          <div className="space-y-6">
            {STATUSES.map((status, idx) => {
              const isCompleted = idx <= currentIdx;
              const isCurrent = idx === currentIdx;
              
              return (
                <div key={status.id} className="flex gap-4 relative">
                  {idx !== STATUSES.length - 1 && (
                    <div className={`absolute top-8 left-3.5 w-0.5 h-10 ${idx < currentIdx ? 'bg-primary' : 'bg-gray-200'}`} />
                  )}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                    isCurrent ? 'bg-primary text-white shadow-lg shadow-primary/30 ring-4 ring-primary/20' :
                    isCompleted ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <status.icon size={16} strokeWidth={isCompleted ? 3 : 2} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold ${isCurrent ? 'text-primary text-lg' : isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                      {status.label}
                    </h4>
                    {status.time && <p className="text-xs text-gray-500 mt-1">{status.time}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </main>
    </div>
  );
}

function Star(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}
function ChevronLeft(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
}