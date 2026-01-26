import type { Vendor, Transaction, VendorCategoryName } from './types';

export const vendors: Vendor[] = [
  {
    name: 'Main Cafeteria',
    category: 'School Cafeteria',
    items: [
      { name: 'Jollof Rice & Chicken', price: 1500 },
      { name: 'Fried Rice & Beef', price: 1500 },
      { name: 'Eba & Egusi Soup', price: 1200 },
      { name: 'Yam & Egg Sauce', price: 1000 },
      { name: 'Bottled Water', price: 200 },
      { name: 'Soft Drink', price: 300 },
    ],
  },
  {
    name: 'Mama Put Express',
    category: 'Private Food Vendors',
    items: [
      { name: 'Amala & Gbegiri', price: 1800 },
      { name: 'Pounded Yam & Efo Riro', price: 2000 },
      { name: 'Shawarma', price: 2500 },
      { name: 'Asun (Spicy Goat Meat)', price: 3000 },
    ],
  },
  {
    name: 'Foodies Corner',
    category: 'Private Food Vendors',
    items: [
      { name: 'Pizza Slice', price: 1500 },
      { name: 'Small Chops Platter', price: 2000 },
      { name: 'Ice Cream Cup', price: 800 },
    ],
  },
  {
    name: 'TechHub',
    category: 'Gadget Vendors',
    items: [
      { name: 'USB-C Cable', price: 3500 },
      { name: 'Power Bank (10000mAh)', price: 15000 },
      { name: 'Wireless Mouse', price: 8000 },
      { name: 'Earbuds', price: 12000 },
    ],
  },
  {
    name: 'Campus Meds',
    category: 'Health & Utility Vendors',
    items: [
      { name: 'Painkillers (Pack)', price: 500 },
      { name: 'Hand Sanitizer', price: 1000 },
      { name: 'Notebook & Pen', price: 1500 },
      { name: 'Printing (per page)', price: 50 },
    ],
  },
];

const generateRandomTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);

  for (let i = 0; i < 45; i++) {
    const randomVendor = vendors[Math.floor(Math.random() * vendors.length)];
    const randomItem = randomVendor.items[Math.floor(Math.random() * randomVendor.items.length)];
    const randomDay = Math.floor(Math.random() * today.getDate()) + 1;
    const transactionDate = new Date(today.getFullYear(), today.getMonth(), randomDay);

    const isCafeteria = randomVendor.category === 'School Cafeteria';
    const useCoupon = isCafeteria && Math.random() > 0.7;

    transactions.push({
      id: `txn_${Date.now()}_${i}`,
      amount: randomItem.price,
      vendor: randomVendor.name,
      vendorCategory: randomVendor.category as VendorCategoryName,
      item: randomItem.name,
      couponUsed: useCoupon,
      couponAmount: useCoupon ? Math.min(randomItem.price, Math.random() > 0.5 ? 4000 : 6000) : 0,
      cashUsed: Math.random() > 0.5,
      date: transactionDate.toISOString(),
    });
  }
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const sampleTransactions: Transaction[] = generateRandomTransactions();
