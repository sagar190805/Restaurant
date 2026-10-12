import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { name: 'Starters', desc: 'Delicious appetizers to begin your meal' },
  { name: 'Tandoor', desc: 'Charcoal grilled kebabs and tikkas' },
  { name: 'Main Course Veg', desc: 'Hearty vegetarian curries' },
  { name: 'Main Course Non-Veg', desc: 'Rich and spicy meat curries' },
  { name: 'Biryani', desc: 'Aromatic basmati rice cooked with spices' },
  { name: 'Breads', desc: 'Fresh Indian breads straight from the tandoor' },
  { name: 'Desserts', desc: 'Sweet treats to end your meal' },
  { name: 'Beverages', desc: 'Refreshing drinks and coolers' }
];

const items = [
  // Starters
  { cat: 'Starters', name: 'Paneer Tikka', price: 25000, desc: 'Cottage cheese marinated in yogurt and spices', isVeg: true, spiceLevel: 2, image: 'https://images.unsplash.com/photo-1599487405702-8e8d89e4745c?w=400&q=80' },
  { cat: 'Starters', name: 'Chicken 65', price: 28000, desc: 'Spicy, deep-fried chicken bites', isVeg: false, spiceLevel: 3, image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400&q=80', tags: 'bestseller' },
  { cat: 'Starters', name: 'Samosa Chaat', price: 12000, desc: 'Crushed samosas topped with yogurt and chutneys', isVeg: true, spiceLevel: 2, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80' },
  { cat: 'Starters', name: 'Gobi Manchurian', price: 18000, desc: 'Crispy cauliflower tossed in Indo-Chinese sauce', isVeg: true, spiceLevel: 2, image: 'https://images.unsplash.com/photo-1599487405702-8e8d89e4745c?w=400&q=80' },
  { cat: 'Starters', name: 'Hara Bhara Kebab', price: 20000, desc: 'Spinach and pea patties packed with greens', isVeg: true, spiceLevel: 1 },
  // Tandoor
  { cat: 'Tandoor', name: 'Tandoori Chicken', price: 35000, desc: 'Classic tandoor roasted chicken (Half/Full)', isVeg: false, spiceLevel: 2, image: 'https://images.unsplash.com/photo-1599487405702-8e8d89e4745c?w=400&q=80', variants: [{name: 'Half', price: 35000}, {name: 'Full', price: 60000}] },
  { cat: 'Tandoor', name: 'Chicken Tikka', price: 32000, desc: 'Boneless chicken chunks marinated in spices', isVeg: false, spiceLevel: 2, tags: 'bestseller' },
  { cat: 'Tandoor', name: 'Malai Soya Chaap', price: 26000, desc: 'Creamy soy chunks roasted in tandoor', isVeg: true, spiceLevel: 1 },
  { cat: 'Tandoor', name: 'Mutton Seekh Kebab', price: 38000, desc: 'Minced lamb skewers grilled to perfection', isVeg: false, spiceLevel: 3 },
  // Main Veg
  { cat: 'Main Course Veg', name: 'Dal Makhani', price: 24000, desc: 'Slow-cooked black lentils in butter and cream', isVeg: true, spiceLevel: 1, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80', tags: 'bestseller' },
  { cat: 'Main Course Veg', name: 'Paneer Butter Masala', price: 29000, desc: 'Cottage cheese in a rich tomato gravy', isVeg: true, spiceLevel: 2, tags: 'chef-special' },
  { cat: 'Main Course Veg', name: 'Palak Paneer', price: 28000, desc: 'Cottage cheese cubes in a smooth spinach curry', isVeg: true, spiceLevel: 2 },
  { cat: 'Main Course Veg', name: 'Mix Veg Curry', price: 22000, desc: 'Seasonal vegetables cooked with Indian spices', isVeg: true, spiceLevel: 2 },
  { cat: 'Main Course Veg', name: 'Kadhai Paneer', price: 29000, desc: 'Paneer cooked with bell peppers and whole spices', isVeg: true, spiceLevel: 3 },
  // Main Non-Veg
  { cat: 'Main Course Non-Veg', name: 'Butter Chicken', price: 36000, desc: 'Creamy, rich, and slightly sweet chicken curry', isVeg: false, spiceLevel: 1, image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80', tags: 'bestseller' },
  { cat: 'Main Course Non-Veg', name: 'Chicken Tikka Masala', price: 36000, desc: 'Roasted chicken chunks in spicy sauce', isVeg: false, spiceLevel: 3 },
  { cat: 'Main Course Non-Veg', name: 'Mutton Rogan Josh', price: 42000, desc: 'Classic Kashmiri lamb curry', isVeg: false, spiceLevel: 3, tags: 'chef-special' },
  { cat: 'Main Course Non-Veg', name: 'Fish Curry', price: 38000, desc: 'Homestyle fish curry with mustard seeds', isVeg: false, spiceLevel: 2 },
  { cat: 'Main Course Non-Veg', name: 'Egg Curry', price: 18000, desc: 'Boiled eggs in an onion-tomato gravy', isVeg: false, spiceLevel: 2 },
  // Biryani
  { cat: 'Biryani', name: 'Hyderabadi Chicken Biryani', price: 32000, desc: 'Dum-cooked spicy chicken and basmati rice', isVeg: false, spiceLevel: 3, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', tags: 'bestseller' },
  { cat: 'Biryani', name: 'Mutton Dum Biryani', price: 45000, desc: 'Tender lamb layered with fragrant rice', isVeg: false, spiceLevel: 3 },
  { cat: 'Biryani', name: 'Veg Dum Biryani', price: 25000, desc: 'Vegetables cooked with saffron rice', isVeg: true, spiceLevel: 2 },
  { cat: 'Biryani', name: 'Paneer Tikka Biryani', price: 28000, desc: 'Grilled paneer mixed with biryani rice', isVeg: true, spiceLevel: 2 },
  // Breads
  { cat: 'Breads', name: 'Garlic Naan', price: 6000, desc: 'Tandoori flatbread topped with garlic and butter', isVeg: true, spiceLevel: 0, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80' },
  { cat: 'Breads', name: 'Butter Naan', price: 5000, desc: 'Soft and fluffy tandoori bread with butter', isVeg: true, spiceLevel: 0 },
  { cat: 'Breads', name: 'Tandoori Roti', price: 3000, desc: 'Whole wheat flatbread baked in tandoor', isVeg: true, spiceLevel: 0 },
  { cat: 'Breads', name: 'Lachha Paratha', price: 7000, desc: 'Multi-layered flaky whole wheat bread', isVeg: true, spiceLevel: 0 },
  { cat: 'Breads', name: 'Cheese Garlic Naan', price: 9000, desc: 'Naan stuffed with cheese and topped with garlic', isVeg: true, spiceLevel: 0 },
  // Desserts
  { cat: 'Desserts', name: 'Gulab Jamun', price: 12000, desc: 'Deep fried milk dumplings in rose syrup', isVeg: true, spiceLevel: 0, image: 'https://images.unsplash.com/photo-1599487405702-8e8d89e4745c?w=400&q=80' },
  { cat: 'Desserts', name: 'Rasmalai', price: 15000, desc: 'Cottage cheese patties in sweetened milk', isVeg: true, spiceLevel: 0 },
  { cat: 'Desserts', name: 'Gajar Ka Halwa', price: 14000, desc: 'Traditional carrot pudding with nuts', isVeg: true, spiceLevel: 0 },
  { cat: 'Desserts', name: 'Moong Dal Halwa', price: 16000, desc: 'Rich lentil pudding cooked in pure ghee', isVeg: true, spiceLevel: 0 },
  // Beverages
  { cat: 'Beverages', name: 'Sweet Lassi', price: 9000, desc: 'Traditional churned yogurt drink', isVeg: true, spiceLevel: 0 },
  { cat: 'Beverages', name: 'Mango Lassi', price: 11000, desc: 'Mango flavored yogurt drink', isVeg: true, spiceLevel: 0 },
  { cat: 'Beverages', name: 'Masala Chaas', price: 7000, desc: 'Spiced buttermilk with coriander and mint', isVeg: true, spiceLevel: 0 },
  { cat: 'Beverages', name: 'Fresh Lime Soda', price: 8000, desc: 'Refreshing lime drink (Sweet/Salted)', isVeg: true, spiceLevel: 0 }
];

async function main() {
  console.log('Seeding rich database...');
  await prisma.staffUser.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.category.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.rider.deleteMany();

  // 1. Settings
  await prisma.setting.create({
    data: {
      isOpen: false,
      openTime: '08:00',
      closeTime: '23:30',
      restaurantName: 'Spice Route',
      baseDeliveryFee: 4000,
      perKmFee: 1000,
      minOrderValue: 15000,
      gstPercentage: 5.0,
      codEnabled: true
    }
  });

  // 2. Staff
  const roles = ['OWNER', 'MANAGER', 'KITCHEN', 'RIDER'];
  for (const role of roles) {
    await prisma.staffUser.create({
      data: {
        name: `Test ${role}`,
        email: `${role.toLowerCase()}@restaurant.com`, // Fixed email as per logs
        password: 'password123',
        role: role
      }
    });
  }

  // 3. Categories & Items
  for (const [idx, cat] of categories.entries()) {
    const category = await prisma.category.create({
      data: { name: cat.name, description: cat.desc, sortOrder: idx + 1 }
    });

    const catItems = items.filter(i => i.cat === cat.name);
    for (const item of catItems) {
      await prisma.menuItem.create({
        data: {
          categoryId: category.id,
          name: item.name,
          description: item.desc,
          price: item.price,
          isAvailable: true,
          image: item.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80',
          isVeg: item.isVeg,
          spiceLevel: item.spiceLevel || 0,
          isBestseller: item.tags === 'bestseller',
          variants: item.variants ? { create: item.variants } : undefined,
        }
      });
    }
  }

  // 4. Coupons
  await prisma.coupon.create({
    data: {
      code: 'WELCOME50',
      type: 'PERCENT',
      value: 50.0,
      maxDiscount: 10000,
      minCartValue: 20000,
      isFirstOrderOnly: true,
      isActive: true,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  });

  console.log('Database richly seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });