import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, MapPin, Globe, Sun, Moon, User, ChevronDown, LogOut, Heart, Package, Star, Menu as MenuIcon, X, Home, Utensils, ClipboardList, Navigation, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import LoginModal from './LoginModal';
import CartDrawer from './CartDrawer';

const NAV_LINKS = [
  { to: '/', label: 'Home', hiLabel: 'होम' },
  { to: '/menu', label: 'Menu', hiLabel: 'मेनू' },
  { to: '/offers', label: 'Offers', hiLabel: 'ऑफर्स' },
  { to: '/track', label: 'Track Order', hiLabel: 'ट्रैक' },
  { to: '/find-us', label: 'Find Us', hiLabel: 'हमें खोजें' },
  { to: '/contact', label: 'Contact', hiLabel: 'संपर्क' },
];

const BOTTOM_NAV = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/menu', icon: Utensils, label: 'Menu' },
  { to: '/orders', icon: ClipboardList, label: 'Orders' },
  { to: '/track', icon: Navigation, label: 'Track' },
  { to: '/profile', icon: UserCircle, label: 'Profile' },
];

export default function Header({ settings }) {
  const { cart, cartCount, user, logout, lang, setLang, theme, setTheme, setLoginOpen, loginOpen } = useAppContext();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isOpen = settings?.isOpen;
  const t = (en, hi) => lang === 'hi' ? hi : en;

  return (
    <>
      {/* Desktop Header */}
      <header className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass shadow-sm`}>
        {/* Announcement Strip */}
        <div className="bg-primary text-primary-foreground text-center text-xs py-1.5 font-medium tracking-wide">
          🎉 Free delivery above ₹499 · Use <span className="font-black">WELCOME50</span> for 50% off your first order!
        </div>

        {/* Main Nav */}
        <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍛</span>
            <div>
              <div className="text-xl font-black font-serif text-primary leading-none">{settings?.restaurantName || 'Spice Route'}</div>
              <div className="text-[10px] text-muted-foreground tracking-widest uppercase">Premium Indian Cuisine</div>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link key={link.to} to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${location.pathname === link.to ? 'text-primary bg-primary/10' : 'text-foreground/70 hover:text-primary hover:bg-primary/5'}`}>
                {t(link.label, link.hiLabel)}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button onClick={() => setSearchOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition">
              <Search size={18} />
            </button>

            {/* Address Pill */}
            <button className="hidden lg:flex items-center gap-1.5 bg-muted rounded-full px-3 py-1.5 text-sm font-medium hover:bg-muted/80 transition max-w-[160px]">
              <MapPin size={14} className="text-primary shrink-0" />
              <span className="truncate text-foreground/70">Bangalore, KA</span>
            </button>

            {/* Language */}
            <button onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition text-sm font-bold">
              {lang === 'en' ? 'हिं' : 'EN'}
            </button>

            {/* Theme Toggle */}
            <button onClick={() => setTheme(t => t === 'midnight' ? 'default' : 'midnight')}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition">
              {theme === 'midnight' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User / Login */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button onClick={() => setProfileOpen(p => !p)}
                  className="flex items-center gap-2 bg-muted rounded-full px-3 py-1.5 hover:bg-muted/80 transition">
                  <User size={16} className="text-primary" />
                  <span className="text-sm font-semibold max-w-[80px] truncate">{user.name || 'Profile'}</span>
                  <ChevronDown size={14} />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50">
                      {[
                        { to: '/orders', icon: Package, label: 'My Orders' },
                        { to: '/favorites', icon: Heart, label: 'Favorites' },
                        { to: '/profile', icon: User, label: 'Profile & Addresses' },
                        { to: '/profile#loyalty', icon: Star, label: 'Loyalty Points' },
                      ].map(item => (
                        <Link key={item.to} to={item.to}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-muted transition">
                          <item.icon size={16} className="text-primary" /> {item.label}
                        </Link>
                      ))}
                      <button onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition border-t border-border">
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button onClick={() => setLoginOpen(true)}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 transition shadow-sm">
                Login
              </button>
            )}

            {/* Cart */}
            <button onClick={() => setCartOpen(true)}
              className="relative w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition">
              <ShoppingCart size={20} className="text-primary" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span key={cartCount} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-black rounded-full flex items-center justify-center">
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className={`px-6 py-1.5 flex items-center gap-3 text-xs border-t border-border ${isOpen ? 'bg-green-50' : 'bg-red-50'}`}>
          <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
          <span className="font-bold" style={{ color: isOpen ? '#16a34a' : '#dc2626' }}>
            {isOpen ? `Open Now · ${settings?.openTime || '8:00 AM'} – ${settings?.closeTime || '11:30 PM'}` : 'Closed · You can schedule an order for later'}
          </span>
          <span className="ml-auto text-muted-foreground">⭐ 4.8 · 2.3k reviews · 30–45 min delivery</span>
        </div>
      </header>

      {/* Mobile Header */}
      <header className={`md:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass shadow-sm`}>
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="font-black font-serif text-xl text-primary">🍛 {settings?.restaurantName?.split(' ')[0] || 'Spice'}</Link>
          <button className="flex items-center gap-1 bg-muted rounded-full px-3 py-1.5 text-xs font-medium">
            <MapPin size={12} className="text-primary" /> Bangalore
          </button>
          <button onClick={() => setCartOpen(true)} className="relative w-9 h-9 flex items-center justify-center rounded-full bg-primary/10">
            <ShoppingCart size={18} className="text-primary" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-black rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass flex justify-around items-center h-16 safe-pb shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-white/20">
        {BOTTOM_NAV.map(item => {
          const active = location.pathname === item.to;
          return (
            <Link key={item.to} to={item.to} className={`flex flex-col items-center gap-0.5 transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}>
              <item.icon size={22} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Login Modal */}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
            onClick={() => setSearchOpen(false)}>
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
              className="bg-card w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <Search size={20} className="text-muted-foreground" />
                <input autoFocus placeholder="Search for dishes, categories..." className="flex-1 bg-transparent outline-none text-base font-medium"
                  onKeyDown={e => { if (e.key === 'Enter') { navigate(`/menu?search=${e.target.value}`); setSearchOpen(false); } }} />
                <button onClick={() => setSearchOpen(false)}><X size={20} /></button>
              </div>
              <div className="p-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {['Butter Chicken', 'Biryani', 'Paneer Tikka', 'Garlic Naan', 'Gulab Jamun'].map(q => (
                    <button key={q} onClick={() => { navigate(`/menu?search=${q}`); setSearchOpen(false); }}
                      className="px-3 py-1.5 bg-muted rounded-full text-sm font-medium hover:bg-primary/10 hover:text-primary transition">{q}</button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

