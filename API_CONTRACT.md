# API Contract

This document outlines the REST endpoints and Socket.IO events used by the Spice Route frontend. The backend (Express + Prisma) implements these exactly as specified.

## Base URL
`http://localhost:3001` (Dev)

## Authentication
Most endpoints require a Bearer token in the `Authorization` header.
`Authorization: Bearer <JWT_TOKEN>`

---

## REST API Endpoints

### 1. Settings & Config
- **GET `/api/settings`**
  - **Auth:** None required
  - **Response:** `{ isOpen: boolean, openTime: string, closeTime: string, restaurantName: string, baseDeliveryFee: number, perKmFee: number, minOrderValue: number, gstPercentage: number, codEnabled: boolean }`
  - **Notes:** Dynamically calculates `isOpen` based on server timezone (Asia/Kolkata) and business hours.

### 2. Menu & Categories
- **GET `/api/menu`**
  - **Auth:** None required
  - **Response:** `Array<{ id, name, items: Array<{ id, name, description, price, image, isVeg, spiceLevel, isBestseller, isAvailable }> }>`

### 3. Auth & Users
- **POST `/api/auth/send-otp`**
  - **Body:** `{ phone: string }`
  - **Response:** `{ success: true, _devOtp: string }`
- **POST `/api/auth/login`**
  - **Body:** `{ phone: string, otp: string, name?: string }`
  - **Response:** `{ token: string, user: { id, phone, name, email } }`

### 4. Addresses
- **GET `/api/addresses`**
  - **Auth:** Required (User)
  - **Response:** `Array<{ id, type, line1, line2, city, state, pincode, lat, lng }>`
- **POST `/api/addresses`**
  - **Auth:** Required (User)
  - **Body:** `{ type, line1, line2, city, state, pincode, lat, lng }`
  - **Response:** Address object

### 5. Orders
- **POST `/api/orders`**
  - **Auth:** Required (User)
  - **Body:** `{ type, paymentMethod, addressId, items: [{ menuItemId, quantity }] }`
  - **Response:** `{ id, status, total, ...OrderObject }`
- **GET `/api/orders`**
  - **Auth:** Required (User)
  - **Response:** `Array<OrderObject>`
- **GET `/api/orders/:id`**
  - **Auth:** Required (User/Admin)
  - **Response:** Order object with populated `items`, `statusLogs`, `address`, `rider`.

### 6. Admin
- **GET `/api/admin/stats`**
  - **Auth:** Required (Admin)
  - **Response:** `{ totalOrders, revenue, activeOrders, newCustomers }`
- **GET `/api/admin/orders`**
  - **Auth:** Required (Admin)
  - **Response:** `Array<OrderObject>` (all orders for Kanban)
- **PATCH `/api/admin/orders/:id/status`**
  - **Auth:** Required (Admin)
  - **Body:** `{ status: string }`
  - **Response:** Updated Order object

---

## WebSocket Events (Socket.IO)

Clients connect to `http://localhost:3001` with `auth: { token: JWT_TOKEN }`.

### Emitted by Server
- **`order:new`**
  - Sent to `admin` room when a new order is placed.
  - **Payload:** `{ order: OrderObject }`
- **`order:update`**
  - Sent to `user_<userId>` and `admin` rooms when an order status changes.
  - **Payload:** `{ orderId, status, timestamp }`
- **`rider:location`**
  - Sent to `user_<userId>` tracking an order.
  - **Payload:** `{ orderId, lat, lng }`

### Emitted by Client
- **`join:order`**
  - Sent by customer on the Tracking page to subscribe to updates.
  - **Payload:** `{ orderId }`
- **`admin:join`**
  - Sent by admin dashboard to receive all live order alerts.
