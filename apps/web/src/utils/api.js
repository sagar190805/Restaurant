import { SEED_CATEGORIES, SEED_SETTINGS, SEED_COUPONS } from './seed';

// Mock DB Initialization
const initDB = () => {
  if (!localStorage.getItem('mock_db_init_v5')) {
    localStorage.setItem('db_menu', JSON.stringify(SEED_CATEGORIES));
    localStorage.setItem('db_settings', JSON.stringify(SEED_SETTINGS));
    localStorage.setItem('db_coupons', JSON.stringify(SEED_COUPONS));
    localStorage.setItem('db_orders', JSON.stringify([]));
    localStorage.setItem('db_addresses', JSON.stringify([]));
    localStorage.setItem('db_users', JSON.stringify([]));
    localStorage.setItem('mock_db_init_v5', 'true');
  }
};
initDB();

// Simulated Network Delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const getDb = (key) => JSON.parse(localStorage.getItem(`db_${key}`) || '[]');
const setDb = (key, data) => localStorage.setItem(`db_${key}`, JSON.stringify(data));

// -------------------------------------------------------------
// Mock API Implementations
// -------------------------------------------------------------

export const fetchMenu = async () => {
  await delay();
  return getDb('menu');
};

export const fetchSettings = async () => {
  await delay();
  return JSON.parse(localStorage.getItem('db_settings'));
};

export const fetchCoupons = async () => {
  await delay();
  return getDb('coupons');
};

export const fetchReviews = async () => {
  await delay();
  return []; // Mock empty reviews for now
};

export const sendOtp = async (phone) => {
  await delay(500);
  return { success: true, _devOtp: '123456' };
};

export const loginOtp = async (phone, otp, name) => {
  await delay(600);
  if (otp !== '123456') throw new Error('Invalid OTP');
  
  let users = getDb('users');
  let user = users.find(u => u.phone === phone);
  if (!user) {
    user = { id: `usr_${Date.now()}`, phone, name: name || 'Guest' };
    users.push(user);
    setDb('users', users);
  }
  
  const token = btoa(JSON.stringify(user)); // Mock JWT
  return { token, user };
};

const getUserFromToken = (token) => {
  try {
    return JSON.parse(atob(token));
  } catch(e) {
    throw new Error('Invalid token');
  }
};

export const fetchAddresses = async (token) => {
  await delay();
  const user = getUserFromToken(token);
  return getDb('addresses').filter(a => a.userId === user.id);
};

export const addAddress = async (data, token) => {
  await delay();
  const user = getUserFromToken(token);
  const addresses = getDb('addresses');
  const newAddress = { id: `addr_${Date.now()}`, userId: user.id, ...data };
  addresses.push(newAddress);
  setDb('addresses', addresses);
  return newAddress;
};

export const createOrder = async (data, token) => {
  await delay();
  const user = getUserFromToken(token);
  const orders = getDb('orders');
  
  // Calculate mock total
  let total = 0;
  
  const newOrder = {
    id: `ord_${Date.now()}`,
    userId: user.id,
    status: 'CREATED',
    createdAt: new Date().toISOString(),
    items: data.items,
    addressId: data.addressId,
    paymentMethod: data.paymentMethod || 'COD',
    total: 50000, // Mock total for now
    type: data.type || 'Delivery'
  };
  
  orders.push(newOrder);
  setDb('orders', orders);
  
  // Mock event emit (broadcast channel for other tabs)
  const bc = new BroadcastChannel('restaurant_events');
  bc.postMessage({ type: 'order:new', payload: newOrder });
  
  return newOrder;
};

export const fetchOrders = async (token) => {
  await delay();
  const user = getUserFromToken(token);
  return getDb('orders').filter(o => o.userId === user.id).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const fetchOrder = async (id, token) => {
  await delay();
  const user = getUserFromToken(token);
  const order = getDb('orders').find(o => o.id === id);
  if (!order || order.userId !== user.id) throw new Error('Order not found');
  
  // Hydrate address
  if (order.addressId) {
    order.address = getDb('addresses').find(a => a.id === order.addressId);
  }
  
  return order;
};

export const validateCouponCode = async (code, cartTotal, token) => {
  await delay();
  const coupons = getDb('coupons');
  const coupon = coupons.find(c => c.code === code);
  
  if (!coupon) throw new Error('Invalid coupon code');
  if (cartTotal < coupon.minOrderValue) throw new Error(`Minimum order value is ₹${coupon.minOrderValue/100}`);
  
  let discountAmount = 0;
  if (coupon.discountType === 'PERCENTAGE') {
    discountAmount = (cartTotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) discountAmount = coupon.maxDiscount;
  } else {
    discountAmount = coupon.discountValue;
  }
  
  return { valid: true, discountAmount };
};

export const verifyPayment = async (data, token) => {
  await delay();
  return { success: true };
};

export const createReservation = async (data) => {
  await delay();
  return { success: true, id: `res_${Date.now()}` };
};

export const submitReview = async (data, token) => {
  await delay();
  return { success: true };
};
export const fetchAdminOrders = async (token) => { await delay(); return getDb('orders').sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)); };
export const updateOrderStatus = async (id, status, token) => { await delay(); let orders = getDb('orders'); let o = orders.find(x => x.id === id); if(o) o.status = status; setDb('orders', orders); const bc = new BroadcastChannel('restaurant_events'); bc.postMessage({ type: 'order:update', payload: { orderId: id, status } }); return o; };

export const riderLogin = async (email, password) => { await delay(); if(email && password === 'rider') return { token: 'mock-rider-token', user: { id: 'rider_1', role: 'RIDER', name: 'Mock Rider' } }; throw new Error('Invalid credentials'); };
export const fetchRiderOrders = async (token) => { await delay(); return getDb('orders').filter(o => o.status === 'OUT_FOR_DELIVERY'); };

export const API_URL = 'http://localhost:3001/api';





export const toggleMenuItemStock = async (itemId) => {
  await delay(300);
  const menu = getDb('menu');
  let found = false;
  for (const cat of menu) {
    const item = cat.items.find(i => i.id === itemId);
    if (item) {
      item.inStock = item.inStock === false ? true : false;
      found = true;
      break;
    }
  }
  if (found) {
    saveDb('menu', menu);
    return menu;
  }
  throw new Error('Item not found');
};

export const updateSettings = async (updates) => {
  await delay(200);
  const current = getDb('settings');
  const updated = { ...current, ...updates };
  saveDb('settings', updated);
  
  // Broadcast the update so other tabs (frontend) know immediately
  if (window.channel) {
    window.channel.postMessage({ type: 'SETTINGS_UPDATE', payload: updated });
  }
  return updated;
};

export const updateMenuItem = async (itemId, updates) => {
  await delay(200);
  const menu = getDb('menu');
  let found = false;
  let updatedItem = null;
  for (const cat of menu) {
    const idx = cat.items.findIndex(i => i.id === itemId);
    if (idx >= 0) {
      cat.items[idx] = { ...cat.items[idx], ...updates };
      updatedItem = cat.items[idx];
      found = true;
      break;
    }
  }
  if (found) {
    saveDb('menu', menu);
    if (window.channel) {
      window.channel.postMessage({ type: 'MENU_UPDATE', payload: menu });
    }
    return updatedItem;
  }
  throw new Error('Item not found');
};
