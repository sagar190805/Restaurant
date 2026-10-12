import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [settings, setSettings] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'default');
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginRedirect, setLoginRedirect] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const addToCart = (item) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.menuItemId === item.menuItemId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        return updated;
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (menuItemId, qty) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.menuItemId !== menuItemId));
    } else {
      setCart(prev => prev.map(i => i.menuItemId === menuItemId ? { ...i, quantity: qty } : i));
    }
  };

  const removeFromCart = (menuItemId) => {
    setCart(prev => prev.filter(i => i.menuItemId !== menuItemId));
  };

  const clearCart = () => setCart([]);

  const login = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setLoginOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const requireLogin = (redirectPath) => {
    if (!token) {
      setLoginRedirect(redirectPath);
      setLoginOpen(true);
      return false;
    }
    return true;
  };

  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const cartTotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <AppContext.Provider value={{
      cart, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal,
      user, token, login, logout, requireLogin,
      settings, setSettings,
      theme, setTheme,
      lang, setLang,
      loginOpen, setLoginOpen, loginRedirect, setLoginRedirect
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);