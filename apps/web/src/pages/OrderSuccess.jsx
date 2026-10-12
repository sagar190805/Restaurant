import React, { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Bike, ChefHat, Package, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/Button';

function Confetti() {
  const colors = ['#ff5200','#ffd700','#22c55e','#3b82f6','#ec4899'];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({length: 40}).map((_, i) => (
        <motion.div key={i}
          initial={{ y: -20, x: Math.random() * 100 + '%', opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: 0, rotate: Math.random() * 360 }}
          transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 1, ease: 'easeIn' }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ background: colors[Math.floor(Math.random() * colors.length)], left: `${Math.random() * 100}%` }}
        />
      ))}
    </div>
  );
}

export default function OrderSuccess() {
  const { id } = useParams();
  const eta = new Date(Date.now() + 35 * 60000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <Layout noFooter>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative">
        <Confetti />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} className="text-green-500" strokeWidth={2.5} />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-4xl font-black font-serif mb-2">Order Placed! 🎉</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="text-muted-foreground text-lg mb-6">Thank you! We're preparing your food right now.</motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full mb-8 shadow-lg">
          <div className="text-sm text-muted-foreground mb-1">Order ID</div>
          <div className="font-black text-2xl text-primary mb-4">{id}</div>
          <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
            <Clock size={18} /><span>Estimated delivery by {eta}</span>
          </div>
        </motion.div>

        {/* Mini Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="flex items-center gap-3 mb-8 text-sm">
          {[
            { icon: CheckCircle2, label: 'Order Placed', done: true },
            { icon: ChefHat, label: 'Preparing', done: false },
            { icon: Bike, label: 'Out for Delivery', done: false },
            { icon: MapPin, label: 'Delivered', done: false },
          ].map((s, i) => (
            <React.Fragment key={s.label}>
              <div className={`flex flex-col items-center gap-1 ${s.done ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${s.done ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <s.icon size={16} />
                </div>
                <span className="text-xs">{s.label}</span>
              </div>
              {i < 3 && <div className={`flex-1 h-0.5 ${s.done ? 'bg-primary' : 'bg-border'}`} />}
            </React.Fragment>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex gap-4">
          <Link to={`/track/${id}`}>
            <Button className="px-8 rounded-full font-bold">Track Order</Button>
          </Link>
          <Link to="/menu">
            <Button variant="outline" className="px-8 rounded-full font-bold border-primary text-primary">Order More</Button>
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
}
