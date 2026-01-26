import type { Vendor, Transaction } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImageProps = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  return {
    imageUrl: image?.imageUrl || 'https://picsum.photos/seed/default/600/400',
    imageHint: image?.imageHint || 'food'
  }
}

export const vendors: Vendor[] = [
  {
    name: 'Main Cafeteria',
    category: 'School Cafeteria',
    items: [
      { name: 'Jollof Rice & Chicken', price: 1500, mealTime: ['Lunch', 'Dinner'], ...getImageProps('food-jollof-rice'), description: 'A classic Nigerian party dish, featuring smoky and savory long-grain rice cooked in a rich tomato and pepper sauce, served with a piece of seasoned grilled chicken.', ingredients: ['Rice', 'Chicken', 'Tomato', 'Pepper', 'Onion', 'Spices'], allergens: ['None'] },
      { name: 'Fried Rice & Beef', price: 1500, mealTime: ['Lunch', 'Dinner'], ...getImageProps('food-fried-rice'), description: 'Flavorful fried rice with mixed vegetables and tender beef chunks.', ingredients: ['Rice', 'Beef', 'Carrots', 'Peas', 'Sweet Corn', 'Soy Sauce'], allergens: ['Soy'] },
      { name: 'Eba & Egusi Soup', price: 1200, mealTime: ['Lunch', 'Dinner'], ...getImageProps('food-eba-egusi'), description: 'A hearty swallow meal featuring smooth, tangy eba made from cassava, served with a rich and nutty melon seed soup with leafy greens.', ingredients: ['Garri (Cassava)', 'Melon Seeds', 'Spinach', 'Palm Oil', 'Stockfish'], allergens: ['Seeds'] },
      { name: 'Yam & Egg Sauce', price: 1000, mealTime: ['Breakfast'], ...getImageProps('food-yam-egg'), description: 'Comforting boiled yam served with a delicious and simple scrambled egg sauce, sautéed with tomatoes and onions.', ingredients: ['Yam', 'Egg', 'Tomato', 'Onion', 'Vegetable Oil'], allergens: ['Egg'] },
      { name: 'Bottled Water', price: 200, mealTime: ['Breakfast', 'Lunch', 'Dinner'], imageUrl: 'https://picsum.photos/seed/water/600/400', imageHint: 'water bottle', description: 'Pure, refreshing bottled water.', ingredients: ['Water'], allergens: ['None'] },
      { name: 'Soft Drink', price: 300, mealTime: ['Breakfast', 'Lunch', 'Dinner'], imageUrl: 'https://picsum.photos/seed/soda/600/400', imageHint: 'soda can', description: 'A can of your favorite soft drink.', ingredients: ['Carbonated Water', 'Sugar', 'Flavoring'], allergens: ['None'] },
    ],
  },
  {
    name: 'Mama Put Express',
    category: 'Private Food Vendors',
    items: [
      { name: 'Amala & Gbegiri', price: 1800, mealTime: ['Lunch', 'Dinner'], imageUrl: 'https://picsum.photos/seed/amala/600/400', imageHint: 'amala gbegiri', description: 'A traditional Yoruba delicacy of smooth yam flour dough with a savory bean soup.', ingredients: ['Yam Flour', 'Beans', 'Palm Oil', 'Pepper'], allergens: ['Beans'] },
      { name: 'Pounded Yam & Efo Riro', price: 2000, mealTime: ['Lunch', 'Dinner'], imageUrl: 'https://picsum.photos/seed/poundedyam/600/400', imageHint: 'pounded yam', description: 'Soft, stretchy pounded yam served with a rich vegetable soup.', ingredients: ['Yam', 'Spinach', 'Bell Peppers', 'Palm Oil'], allergens: ['None'] },
      { name: 'Shawarma', price: 2500, mealTime: ['Lunch', 'Dinner'], ...getImageProps('food-shawarma'), description: 'A delicious wrap filled with spiced grilled chicken, fresh vegetables, and creamy sauce in a warm flatbread.', ingredients: ['Chicken', 'Flatbread', 'Cabbage', 'Sausage', 'Cream'], allergens: ['Gluten', 'Dairy'] },
      { name: 'Asun (Spicy Goat Meat)', price: 3000, mealTime: ['Dinner'], imageUrl: 'https://picsum.photos/seed/asun/600/400', imageHint: 'spicy meat', description: 'Smoky, spicy grilled goat meat, a perfect evening treat.', ingredients: ['Goat Meat', 'Scotch Bonnet', 'Onion'], allergens: ['None'] },
    ],
  },
  {
    name: 'Foodies Corner',
    category: 'Private Food Vendors',
    items: [
      { name: 'Pizza Slice', price: 1500, mealTime: ['Lunch', 'Dinner'], ...getImageProps('food-pizza'), description: 'A classic slice of pepperoni pizza with mozzarella cheese.', ingredients: ['Flour', 'Tomato Sauce', 'Cheese', 'Pepperoni'], allergens: ['Gluten', 'Dairy'] },
      { name: 'Small Chops Platter', price: 2000, mealTime: ['Lunch', 'Dinner'], imageUrl: 'https://picsum.photos/seed/chops/600/400', imageHint: 'small chops', description: 'A delightful assortment of finger foods including samosa, spring rolls, and puff-puff.', ingredients: ['Flour', 'Meat', 'Vegetables', 'Oil'], allergens: ['Gluten'] },
      { name: 'Ice Cream Cup', price: 800, mealTime: ['Lunch', 'Dinner'], imageUrl: 'https://picsum.photos/seed/icecream/600/400', imageHint: 'ice cream', description: 'A refreshing cup of vanilla ice cream.', ingredients: ['Milk', 'Sugar', 'Cream'], allergens: ['Dairy'] },
    ],
  },
  {
    name: 'TechHub',
    category: 'Gadget Vendors',
    items: [
      { name: 'USB-C Cable', price: 3500, description: 'A durable 1-meter USB-C to USB-C cable.', ingredients: [], allergens: [], imageUrl: 'https://picsum.photos/seed/cable/600/400', imageHint: 'usb cable' },
      { name: 'Power Bank (10000mAh)', price: 15000, description: 'A slim and powerful power bank to keep your devices charged.', ingredients: [], allergens: [], imageUrl: 'https://picsum.photos/seed/powerbank/600/400', imageHint: 'power bank' },
      { name: 'Wireless Mouse', price: 8000, description: 'An ergonomic wireless mouse with long battery life.', ingredients: [], allergens: [], imageUrl: 'https://picsum.photos/seed/mouse/600/400', imageHint: 'computer mouse' },
      { name: 'Earbuds', price: 12000, description: 'Bluetooth 5.2 wireless earbuds with noise cancellation.', ingredients: [], allergens: [], imageUrl: 'https://picsum.photos/seed/earbuds/600/400', imageHint: 'earbuds' },
    ],
  },
  {
    name: 'Campus Meds',
    category: 'Health & Utility Vendors',
    items: [
      { name: 'Painkillers (Pack)', price: 500, description: 'A pack of 16 paracetamol tablets.', ingredients: [], allergens: [], imageUrl: 'https://picsum.photos/seed/pills/600/400', imageHint: 'medicine pack' },
      { name: 'Hand Sanitizer', price: 1000, description: 'A 100ml bottle of alcohol-based hand sanitizer.', ingredients: [], allergens: [], imageUrl: 'https://picsum.photos/seed/sanitizer/600/400', imageHint: 'sanitizer' },
      { name: 'Notebook & Pen', price: 1500, description: 'A 200-page notebook and a ballpoint pen.', ingredients: [], allergens: [], imageUrl: 'https://picsum.photos/seed/notebook/600/400', imageHint: 'notebook pen' },
      { name: 'Printing (per page)', price: 50, description: 'A4 black and white printing service.', ingredients: [], allergens: [], imageUrl: 'https://picsum.photos/seed/printer/600/400', imageHint: 'paper printing' },
    ],
  },
];


const generateRandomTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const today = new Date();

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
      vendorCategory: randomVendor.category,
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
