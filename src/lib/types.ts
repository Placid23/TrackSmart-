export type MealPlan = 'two-meal' | 'three-meal';

export interface UserProfile {
  fullName: string;
  studentId?: string;
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
