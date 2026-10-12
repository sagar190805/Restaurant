import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { sendOtp, loginOtp } from '@/utils/api';
import { Button } from '@/components/ui/Button';

export default function LoginModal({ open, onClose }) {
  const { login, loginRedirect, setLoginRedirect } = useAppContext();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=phone, 2=otp
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputsRef = React.useRef([]);

  useEffect(() => {
    if (!open) { setStep(1); setPhone(''); setOtp(['','','','','','']); setName(''); setError(''); setDevOtp(''); }
  }, [open]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleSendOtp = async () => {
    if (phone.length < 10) return setError('Enter a valid 10-digit mobile number');
    setLoading(true); setError('');
    try {
      const res = await sendOtp(phone);
      if (res._devOtp) setDevOtp(res._devOtp);
      setStep(2);
      setResendTimer(30);
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const handleOtpChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[idx] = val;
    setOtp(next);
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) inputsRef.current[idx - 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) return setError('Enter the 6-digit OTP');
    setLoading(true); setError('');
    try {
      const res = await loginOtp(phone, code, name);
      if (res.token) {
        login(res.token, res.user);
        onClose();
        if (loginRedirect) { navigate(loginRedirect); setLoginRedirect(null); }
      } else { setError(res.error || 'Invalid OTP'); }
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
            className="glass-panel w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative" onClick={e => e.stopPropagation()}>
            
            <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={20} /></button>

            <div className="bg-primary p-8 text-center text-primary-foreground">
              <div className="text-4xl mb-2">🍛</div>
              <h2 className="text-2xl font-black font-serif">Welcome Back!</h2>
              <p className="text-sm opacity-80 mt-1">Sign in to track orders & earn rewards</p>
            </div>

            <div className="p-6">
              {step === 1 ? (
                <>
                  <label className="block text-sm font-bold mb-2">Mobile Number</label>
                  <div className="flex items-center border-2 border-border rounded-xl overflow-hidden focus-within:border-primary transition mb-4">
                    <span className="px-3 py-3 bg-muted text-sm font-bold text-muted-foreground">+91</span>
                    <input type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,''))}
                      onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                      placeholder="Enter mobile number" className="flex-1 px-3 py-3 bg-transparent outline-none text-base font-semibold" />
                  </div>
                  {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
                  <Button onClick={handleSendOtp} disabled={loading} className="w-full h-12 text-base font-black rounded-xl">
                    {loading ? 'Sending...' : 'Get OTP'}
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold">OTP sent to <span className="text-primary">+91 {phone}</span></p>
                    <button onClick={() => setStep(1)} className="text-xs text-primary font-bold">Change</button>
                  </div>
                  
                  <label className="block text-sm font-bold mb-2">Enter OTP</label>
                  <div className="flex gap-2 mb-4">
                    {otp.map((d, i) => (
                      <input key={i} ref={el => inputsRef.current[i] = el}
                        type="text" inputMode="numeric" maxLength={1} value={d}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        className="w-full aspect-square text-center text-xl font-black border-2 border-border rounded-xl focus:border-primary outline-none transition bg-muted" />
                    ))}
                  </div>
                  {devOtp && <p className="text-green-600 text-xs mb-3 font-mono bg-green-50 p-2 rounded-lg">Dev OTP: {devOtp}</p>}

                  <label className="block text-sm font-bold mb-2">Your Name (first time)</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Optional - for new users"
                    className="w-full border-2 border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition mb-4" />

                  {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
                  <Button onClick={handleVerify} disabled={loading} className="w-full h-12 text-base font-black rounded-xl">
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </Button>
                  <div className="text-center mt-3">
                    {resendTimer > 0
                      ? <p className="text-xs text-muted-foreground">Resend in {resendTimer}s</p>
                      : <button onClick={handleSendOtp} className="text-xs text-primary font-bold">Resend OTP</button>}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
