import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useAppContext } from '@/context/AppContext';
import { addAddress } from '@/utils/api';

export default function AddressModal({ open, onClose, onSuccess }) {
  const { token } = useAppContext();
  const [form, setForm] = useState({
    type: 'Home',
    line1: '',
    line2: '',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.line1 || !form.city || !form.pincode) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const newAddress = await addAddress({
        ...form,
        lat: 12.9716, // dummy coords for now
        lng: 77.5946
      }, token);
      onSuccess(newAddress);
      setForm({ type: 'Home', line1: '', line2: '', city: 'Bangalore', state: 'Karnataka', pincode: '' });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="glass-panel w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative z-10">
            <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
              <h2 className="text-xl font-black">Add New Address</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-bold mb-2 block">Address Type</label>
                <div className="flex gap-2">
                  {['Home', 'Work', 'Other'].map(t => (
                    <button key={t} type="button" onClick={() => setForm({...form, type: t})}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all border-2 ${form.type === t ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold mb-1 block">Flat / House No / Building *</label>
                <input value={form.line1} onChange={e => setForm({...form, line1: e.target.value})}
                  placeholder="e.g. 42-B, 5th Main" className="w-full border-2 border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition" />
              </div>

              <div>
                <label className="text-sm font-bold mb-1 block">Landmark / Area (Optional)</label>
                <input value={form.line2} onChange={e => setForm({...form, line2: e.target.value})}
                  placeholder="e.g. Near Indiranagar Metro" className="w-full border-2 border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold mb-1 block">City *</label>
                  <input value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                    className="w-full border-2 border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="text-sm font-bold mb-1 block">Pincode *</label>
                  <input value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value.replace(/\D/g, '')})} maxLength={6}
                    placeholder="e.g. 560038" className="w-full border-2 border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition" />
                </div>
              </div>

              {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full h-12 font-black rounded-xl mt-4">
                {loading ? 'Saving...' : 'Save Address'}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
