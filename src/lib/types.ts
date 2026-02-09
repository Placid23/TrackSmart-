
export type MealPlan = 'two-meal' | 'three-meal' | 'pay-to-eat';

export interface NotificationSettings {
  mealReminders: boolean;
  paymentAlerts: boolean;
  orderStatus: boolean;
  freeMealReminder: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  studentId: string;
  monthlyAllowance: number;
  mealPlan: MealPlan;
  financialGoal: string;
  financialGoalAmount?: number;
  notificationSettings?: NotificationSettings;
  isAdmin?: boolean;
  status?: 'Active' | 'Suspended';
}

export type OrderStatus = 'Placed' | 'In Preparation' | 'Ready for Pickup' | 'Picked Up';

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
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
  items: OrderItem[];
  status: OrderStatus;
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
  id: string;
  name: string;
  category: VendorCategoryName;
  items: VendorItem[];
  status: 'Active' | 'Inactive';
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

export type SpendingStatus = 'Good' | 'Moderate' | 'Poor';

export interface SpendingInsight {
  status: SpendingStatus;
  advice: string[];
}
