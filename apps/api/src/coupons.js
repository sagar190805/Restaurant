import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const validateCoupon = async (code, cartTotal, userId) => {
  const coupon = await prisma.coupon.findUnique({ where: { code } });

  if (!coupon || !coupon.isActive) throw new Error('Invalid coupon');
  if (new Date() < coupon.validFrom || new Date() > coupon.validTo) throw new Error('Coupon expired');
  if (cartTotal < coupon.minCartValue) throw new Error(`Minimum cart value must be ₹${coupon.minCartValue / 100}`);

  if (coupon.isFirstOrderOnly) {
    const orders = await prisma.order.count({ where: { userId, status: 'DELIVERED' } });
    if (orders > 0) throw new Error('Valid for first order only');
  }

  if (coupon.perUserLimit) {
    const redemptions = await prisma.couponRedemption.count({ where: { couponId: coupon.id, userId } });
    if (redemptions >= coupon.perUserLimit) throw new Error('Usage limit reached');
  }

  let discount = 0;
  if (coupon.type === 'PERCENT') {
    discount = cartTotal * coupon.value / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.value;
  }

  return { coupon, discount };
};