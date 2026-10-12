import { validateCoupon } from './coupons.js';
import { expect, test } from 'vitest';

test('validateCoupon validates simple flat discount', async () => {
  const cartTotal = 50000; // 500 INR
  const userOrderCount = 0;
  const coupon = {
    code: 'FLAT100',
    isActive: true,
    type: 'FLAT',
    discountValue: 10000,
    minCartValue: 20000,
    isFirstOrderOnly: false
  };

  const { discount, error } = validateCoupon(coupon, cartTotal, userOrderCount);
  expect(error).toBeUndefined();
  expect(discount).toBe(10000);
});
