export type MealPlan = 'two-meal' | 'three-meal' | 'pay-to-eat';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  studentId: string;
  monthlyAllowance: number;
  mealPlan: MealPlan;
  financialGoal: string;
}

export interface Transaction {
  id: string;
  amount: number;
  vendor: string;
  vendorCategory: VendorCategoryName;
  couponUsed: boolean;
  couponAmount?: number;
  cashUsed: boolean;
  date: string; // ISO string for date
  item: string;
}

export interface VendorItem {
  name: string;
  price: number;
  mealTime?: ('Breakfast' | 'Lunch' | 'Dinner')[];
  description: string;
  ingredients: string[];
  allergens: string[];
  imageUrl: string;
  imageHint: string;
}

export type VendorCategoryName =
  | 'School Cafeteria'
  | 'Private Food Vendors'
  | 'Gadget Vendors'
  | 'Health & Utility Vendors';

export interface Vendor {
  name: string;
  category: VendorCategoryName;
  items: VendorItem[];
}

export interface Coupon {
  initialValue: number;
  value: number;
  isValid: boolean;
  date: string; // YYYY-MM-DD
}

export interface CartItem {
  id: string; // item name
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  vendorName: string;
}
