import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Razorpay from 'razorpay';
import { z } from 'zod';
import { MapProvider } from './maps.js';
import { validateCoupon } from './coupons.js';
import { generateInvoice } from './invoice.js';

import { LlmProvider } from './chatbot.js';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const server = http.createServer(app);

// Swagger
const swaggerDoc = JSON.parse(readFileSync(join(__dirname, '../swagger.json'), 'utf8'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
const io = new Server(server, { cors: { origin: '*' } });
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use('/api/webhooks/razorpay', express.raw({ type: 'application/json' }));
app.use(express.json());

io.on('connection', (socket) => {
  socket.on('join_order', (orderId) => socket.join(`order_${orderId}`));
  socket.on('join_admin', () => socket.join('admin'));
  socket.on('join_rider', (riderId) => socket.join(`rider_${riderId}`));

  socket.on('rider:location', async (data) => {
    // { riderId, lat, lng, orderId }
    await prisma.rider.update({
      where: { id: data.riderId },
      data: { currentLat: data.lat, currentLng: data.lng, lastLocationAt: new Date() }
    });
    if (data.orderId) {
      await prisma.deliveryTracking.create({
        data: { orderId: data.orderId, lat: data.lat, lng: data.lng }
      });
      io.to(`order_${data.orderId}`).emit('rider:location', { lat: data.lat, lng: data.lng });
    }
  });
});

const notifyAdmin = (event, data) => io.to('admin').emit(event, data);
const notifyOrder = (orderId, event, data) => io.to(`order_${orderId}`).emit(event, data);

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const requireRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  next();
};

const SmsProvider = {
  async send(phone, text) {
    if (NODE_ENV === 'development') return '123456';
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
};

// Auth
app.post('/api/auth/send-otp', async (req, res) => {
  const { phone } = req.body;
  const otpStr = await SmsProvider.send(phone, 'Your OTP is...');
  await prisma.otp.create({ data: { phone, otp: otpStr, expiresAt: new Date(Date.now() + 300000) } });
  res.json({ message: 'OTP sent', _devOtp: NODE_ENV === 'development' ? otpStr : undefined });
});

app.post('/api/auth/verify-otp', async (req, res) => {
  const { phone, otp, name } = req.body;
  const record = await prisma.otp.findFirst({ where: { phone, otp, expiresAt: { gt: new Date() } }, orderBy: { createdAt: 'desc' } });
  if (!record) return res.status(400).json({ error: 'Invalid OTP' });
  let user = await prisma.user.findUnique({ where: { phone } });
  if (!user) user = await prisma.user.create({ data: { phone, name: name || 'Customer' } });
  res.json({ token: jwt.sign({ id: user.id, role: 'CUSTOMER' }, JWT_SECRET, { expiresIn: '7d' }), user });
});

app.post('/api/auth/staff-login', async (req, res) => {
  const { email, password } = req.body;
  const staff = await prisma.staffUser.findUnique({ where: { email } });
  if (!staff || staff.password !== password) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token: jwt.sign({ id: staff.id, role: staff.role }, JWT_SECRET, { expiresIn: '1d' }), user: { id: staff.id, name: staff.name, role: staff.role } });
});

// Menu
app.get('/api/menu', async (req, res) => {
  res.json(await prisma.category.findMany({ include: { items: { where: { isAvailable: true }, include: { variants: true, addons: true } } }, orderBy: { sortOrder: 'asc' } }));
});

app.get('/api/settings', async (req, res) => {
  const settings = await prisma.setting.findFirst();
  if (!settings) return res.json(null);

  // Time in Asia/Kolkata
  const now = new Date();
  const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const currentTime = formatter.format(now); // e.g., "14:30"
  
  const isWithinHours = currentTime >= settings.openTime && currentTime <= settings.closeTime;
  const isDevForceOpen = process.env.FORCE_STORE_OPEN === 'true';
  
  settings.isOpen = settings.isOpen || isWithinHours || isDevForceOpen;
  
  res.json(settings);
});

// Addresses
app.post('/api/addresses', authenticate, async (req, res) => {
  try { const address = await prisma.address.create({ data: { ...req.body, userId: req.user.id } }); res.json(address); } catch (e) { res.status(400).json({ error: "Failed to create address. Please log out and log in again." }); }
  
});
app.get('/api/addresses', authenticate, async (req, res) => {
  res.json(await prisma.address.findMany({ where: { userId: req.user.id } }));
});

// Maps proxy
app.get('/api/maps/geocode', async (req, res) => {
  res.json(await MapProvider.geocode(req.query.q));
});
app.get('/api/maps/reverse', async (req, res) => {
  res.json(await MapProvider.reverseGeocode(Number(req.query.lat), Number(req.query.lng)));
});

// Orders & Cart
const CartSchema = z.object({
  type: z.enum(['Delivery', 'Takeaway', 'Dine-in']),
  addressId: z.string().optional(),
  tableNo: z.string().optional(),
  couponCode: z.string().optional(),
  items: z.array(z.object({
    menuItemId: z.string(),
    variantId: z.string().optional(),
    addonId: z.string().optional(),
    quantity: z.number().int().positive()
  })),
  paymentMethod: z.enum(['ONLINE', 'COD'])
});

app.post('/api/orders', authenticate, async (req, res) => {
  try {
    const data = CartSchema.parse(req.body);
    const settings = await prisma.setting.findFirst();
    if (!settings?.isOpen) return res.status(400).json({ error: 'Restaurant is closed' });

    let subtotal = 0;
    const orderItemsData = [];
    for (const item of data.items) {
      const dbItem = await prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
      if (!dbItem) throw new Error('Item not found');
      let price = dbItem.price;
      if (item.variantId) {
        const v = await prisma.variant.findUnique({ where: { id: item.variantId } });
        if (v) price = v.price;
      }
      if (item.addonId) {
        const a = await prisma.addon.findUnique({ where: { id: item.addonId } });
        if (a) price += a.price;
      }
      subtotal += price * item.quantity;
      orderItemsData.push({ menuItemId: dbItem.id, name: dbItem.name, price, quantity: item.quantity, variantId: item.variantId, addonId: item.addonId });
    }

    let discount = 0;
    let couponId = null;
    if (data.couponCode) {
      const vRes = await validateCoupon(data.couponCode, subtotal, req.user.id);
      discount = vRes.discount;
      couponId = vRes.coupon.id;
    }

    const gst = Math.round((subtotal - discount) * (settings.gstPercentage / 100));
    let deliveryFee = 0;

    if (data.type === 'Delivery') {
      if (!data.addressId) throw new Error('Address required for delivery');
      const address = await prisma.address.findUnique({ where: { id: data.addressId } });
      if (!address) throw new Error('Address not found');

      // Calculate distance from hardcoded restaurant lat/lng for MVP
      const restCoord = { latitude: 12.9716, longitude: 77.5946 }; // Bangalore
      const inZone = MapProvider.isInZone({ latitude: address.lat, longitude: address.lng }, restCoord, settings.deliveryRadiusKm);
      if (!inZone) throw new Error('Sorry, we don\'t deliver to this area');

      const dist = MapProvider.calculateDistance(restCoord, { latitude: address.lat, longitude: address.lng });
      deliveryFee = settings.baseDeliveryFee + Math.max(0, dist / 1000 - 1) * settings.perKmFee;
      if (settings.freeDeliveryOver && subtotal - discount > settings.freeDeliveryOver) deliveryFee = 0;
    }

    const total = subtotal - discount + gst + deliveryFee + settings.packingCharge;

    if (data.paymentMethod === 'COD' && (!settings.codEnabled || total > settings.codLimit)) {
      throw new Error('COD not available for this order');
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.id, type: data.type, addressId: data.addressId, tableNo: data.tableNo,
        subtotal, gst, deliveryFee, packingCharge: settings.packingCharge, discount, total,
        paymentMethod: data.paymentMethod, paymentStatus: 'PENDING',
        status: data.paymentMethod === 'COD' ? 'PLACED' : 'PAYMENT_PENDING',
        items: { create: orderItemsData }
      },
      include: { items: true, user: true }
    });

    if (couponId) {
      await prisma.couponRedemption.create({ data: { couponId, userId: req.user.id, orderId: order.id } });
    }

    if (data.paymentMethod === 'COD') {
      notifyAdmin('order:new', order);
      return res.json({ order });
    }

    const mockRazorpayOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    await prisma.order.update({ where: { id: order.id }, data: { razorpayOrderId: mockRazorpayOrderId } });
    res.json({ order, razorpayOrderId: mockRazorpayOrderId, amount: total });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/payments/verify', authenticate, async (req, res) => {
  const { orderId } = req.body;
  const order = await prisma.order.update({ where: { id: orderId }, data: { status: 'PLACED', paymentStatus: 'PAID' }, include: { items: true, user: true } });
  notifyAdmin('order:new', order);
  notifyOrder(order.id, 'order:update', order);
  res.json({ success: true });
});

app.get('/api/orders/:id/invoice', async (req, res) => {
  const token = req.query.token;
  let userId = null;
  let role = null;
  if (!token) return res.status(401).send('Unauthorized');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    userId = payload.id;
    role = payload.role;
  } catch {
    return res.status(401).send('Invalid token');
  }

  const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { user: true, items: true } });
  if (!order || role === 'CUSTOMER' && order.userId !== userId) return res.status(403).send('Forbidden');
  const settings = await prisma.setting.findFirst();
  const pdfBuffer = await generateInvoice(order, settings);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.id}.pdf`);
  res.send(pdfBuffer);
});

app.get('/api/orders/:id', authenticate, async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { items: true, statusLogs: true, rider: true, address: true } });
  if (order?.userId !== req.user.id) return res.status(403).send('Forbidden');
  res.json(order);
});

app.post('/api/chat', async (req, res) => {
  const { sessionId, message } = req.body;
  // If human handoff requested
  if (message.toLowerCase().includes('human')) {
    let session = await prisma.chatSession.findUnique({ where: { id: sessionId } });
    if (!session) session = await prisma.chatSession.create({ data: { id: sessionId, status: 'HUMAN_HANDOFF' } });else
    await prisma.chatSession.update({ where: { id: sessionId }, data: { status: 'HUMAN_HANDOFF' } });
    notifyAdmin('chat:handoff', { sessionId, message });
    return res.json({ reply: 'I have notified a human agent. They will join the chat shortly.' });
  }

  const reply = await LlmProvider.processMessage(sessionId, message);
  res.json({ reply });
});

app.post('/api/orders/:id/review', authenticate, async (req, res) => {
  const { rating, comment } = req.body;
  const review = await prisma.review.create({ data: { orderId: req.params.id, userId: req.user.id, rating, comment } });
  res.json(review);
});

app.post('/api/menu/:id/favorite', authenticate, async (req, res) => {
  const existing = await prisma.favorite.findFirst({ where: { userId: req.user.id, menuItemId: req.params.id } });
  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return res.json({ status: 'removed' });
  }
  const fav = await prisma.favorite.create({ data: { userId: req.user.id, menuItemId: req.params.id } });
  res.json({ status: 'added', fav });
});

// Admin
app.get('/api/admin/orders', authenticate, requireRole(['OWNER', 'MANAGER', 'KITCHEN']), async (req, res) => {
  res.json(await prisma.order.findMany({ where: { status: { notIn: ['CREATED', 'PAYMENT_PENDING'] } }, include: { items: true, user: true, address: true }, orderBy: { createdAt: 'desc' } }));
});

app.get('/api/admin/analytics', authenticate, requireRole(['OWNER']), async (req, res) => {
  const orders = await prisma.order.findMany({ where: { status: 'DELIVERED' } });
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  res.json({ totalOrders: orders.length, totalRevenue, averageOrderValue: orders.length ? totalRevenue / orders.length : 0 });
});

app.get('/api/admin/riders', authenticate, requireRole(['OWNER', 'MANAGER']), async (req, res) => {
  res.json(await prisma.rider.findMany());
});

app.post('/api/admin/orders/:id/status', authenticate, requireRole(['OWNER', 'MANAGER', 'KITCHEN', 'RIDER']), async (req, res) => {
  const { status } = req.body;
  const order = await prisma.order.update({ where: { id: req.params.id }, data: { status }, include: { user: true, items: true } });
  await prisma.orderStatusLog.create({ data: { orderId: order.id, status } });

  // Loyalty points on delivery (e.g., 10% of subtotal)
  if (status === 'DELIVERED') {
    await prisma.loyaltyLedger.create({ data: { userId: order.userId, points: Math.floor(order.subtotal / 10), type: 'EARN', orderId: order.id } });
  }

  notifyOrder(order.id, 'order:update', order);
  notifyAdmin('order:update', order);
  res.json(order);
});

app.post('/api/admin/orders/:id/assign-rider', authenticate, requireRole(['OWNER', 'MANAGER']), async (req, res) => {
  const { riderId } = req.body;
  const order = await prisma.order.update({ where: { id: req.params.id }, data: { riderId, status: 'OUT_FOR_DELIVERY' }, include: { user: true, items: true } });
  await prisma.orderStatusLog.create({ data: { orderId: order.id, status: 'OUT_FOR_DELIVERY' } });
  notifyOrder(order.id, 'order:update', order);
  notifyAdmin('order:update', order);
  io.to(`rider_${riderId}`).emit('rider:new_order', order);
  res.json(order);
});

app.post('/api/admin/orders/:id/refund', authenticate, requireRole(['OWNER', 'MANAGER']), async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order || order.paymentStatus !== 'PAID') return res.status(400).json({ error: 'Cannot refund' });
  await prisma.refund.create({ data: { orderId: order.id, razorpayRefundId: 'mock_refund_123', amount: order.total, reason: req.body.reason } });
  const uOrder = await prisma.order.update({ where: { id: order.id }, data: { status: 'REFUNDED', paymentStatus: 'REFUNDED' } });
  notifyOrder(uOrder.id, 'order:update', uOrder);
  notifyAdmin('order:update', uOrder);
  res.json(uOrder);
});

// Rider API
app.get('/api/rider/orders', authenticate, requireRole(['RIDER']), async (req, res) => {
  // Find rider based on staff profile (In real world, mapping Rider model to StaffUser. Since we have separate models, we use StaffUser's phone to link or just rely on RIDER role having access to all, but here we'll just return OUT_FOR_DELIVERY orders)
  const orders = await prisma.order.findMany({ where: { status: 'OUT_FOR_DELIVERY' }, include: { address: true, user: true } });
  res.json(orders);
});

// Abandoned Cart Job
setInterval(async () => {
  // Find carts older than 2 hours that haven't been modified
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const abandoned = await prisma.cart.findMany({ where: { updatedAt: { lt: twoHoursAgo } }, include: { items: true } });
  if (abandoned.length > 0) {
    console.log(`[Job] Found ${abandoned.length} abandoned carts. Sending mock notifications...`);
    // Mock notify
  }
}, 60 * 60 * 1000); // 1 hour

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// trigger restart
