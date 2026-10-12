export const SEED_SETTINGS = {
  isOpen: true,
  restaurantName: "Spice Route",
  baseDeliveryFee: 4000, // in paise, so 40.00
  perKmFee: 1000,
  minOrderValue: 14900,
  gstPercentage: 5,
  codEnabled: true
};

export const SEED_CATEGORIES = [
  {
    id: "cat_1",
    name: "Biryani",
    items: [
      { id: "item_1", name: "Hyderabadi Chicken Biryani", description: "Classic dum biryani with succulent chicken.", price: 35000, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80", isVeg: false, isBestseller: true, isSpicy: true },
      { id: "item_2", name: "Mutton Dum Biryani", description: "Tender lamb cooked with fragrant rice.", price: 45000, image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80", isVeg: false, isBestseller: true, isSpicy: true },
      { id: "item_3", name: "Paneer Tikka Biryani", description: "Vegetarian delight with marinated paneer.", price: 29000, image: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=400&q=80", isVeg: true, isBestseller: false, isSpicy: false },
    ]
  },
  {
    id: "cat_2",
    name: "Curries",
    items: [
      { id: "item_4", name: "Butter Chicken", description: "Rich and creamy tomato gravy.", price: 32000, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80", isVeg: false, isBestseller: true, isSpicy: false },
      { id: "item_5", name: "Palak Paneer", description: "Cottage cheese in smooth spinach curry.", price: 28000, image: "/images/palak_paneer.jpg", isVeg: true, isBestseller: true, isSpicy: false },
      { id: "item_6", name: "Dal Makhani", description: "Slow-cooked black lentils.", price: 22000, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80", isVeg: true, isBestseller: false, isSpicy: false },
    ]
  },
  {
    id: "cat_3",
    name: "Breads",
    items: [
      { id: "item_7", name: "Garlic Naan", description: "Soft bread with garlic and butter.", price: 6000, image: "/images/garlic_naan.jpg", isVeg: true, isBestseller: true, isSpicy: false },
      { id: "item_8", name: "Tandoori Roti", description: "Whole wheat bread baked in tandoor.", price: 3000, image: "/images/tandoori_roti.jpg", isVeg: true, isBestseller: false, isSpicy: false },
    ]
  }
];

export const SEED_COUPONS = [
  { code: 'WELCOME50', discountType: 'PERCENTAGE', discountValue: 50, maxDiscount: 10000, minOrderValue: 19900 },
  { code: 'FLAT100', discountType: 'FLAT', discountValue: 10000, minOrderValue: 39900 }
];




