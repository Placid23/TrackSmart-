'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Coupon, MealPlan } from '@/lib/types';
import { useUserProfile } from './use-user-profile';

const COUPON_KEY = 'tracksmart_coupon';

const getInitialCouponValue = (mealPlan: MealPlan): number => {
  switch (mealPlan) {
    case 'two-meal':
      return 4000;
    case 'three-meal':
      return 6000;
    case 'pay-to-eat':
      return 0;
    default:
      return 0;
  }
};

const getTodayDateString = () => new Date().toISOString().split('T')[0];

export function useCoupon() {
  const { profile } = useUserProfile();
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!profile) {
      setIsLoading(false);
      return;
    }

    if (profile.mealPlan === 'pay-to-eat') {
      setCoupon(null);
      // Ensure no old coupon is lingering
      window.localStorage.removeItem(COUPON_KEY);
      setIsLoading(false);
      return;
    }

    try {
      const item = window.localStorage.getItem(COUPON_KEY);
      const today = getTodayDateString();
      let currentCoupon: Coupon | null = item ? JSON.parse(item) : null;

      if (!currentCoupon || currentCoupon.date !== today) {
        const initialValue = getInitialCouponValue(profile.mealPlan);
        currentCoupon = {
          value: initialValue,
          initialValue: initialValue,
          isValid: initialValue > 0,
          date: today,
        };
        window.localStorage.setItem(COUPON_KEY, JSON.stringify(currentCoupon));
      }
      setCoupon(currentCoupon);
    } catch (error) {
      console.error('Failed to load or generate coupon', error);
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  const useCouponValue = useCallback((purchaseAmount: number) => {
    let amountLeft = purchaseAmount;
    try {
      setCoupon(prevCoupon => {
        if (!prevCoupon || !prevCoupon.isValid || prevCoupon.value <= 0) return prevCoupon;

        const couponDeduction = Math.min(purchaseAmount, prevCoupon.value);
        amountLeft = purchaseAmount - couponDeduction;
        
        const updatedCoupon: Coupon = { 
          ...prevCoupon,
          value: prevCoupon.value - couponDeduction,
          isValid: (prevCoupon.value - couponDeduction) > 0,
        };

        window.localStorage.setItem(COUPON_KEY, JSON.stringify(updatedCoupon));
        return updatedCoupon;
      });
    } catch (error) {
      console.error('Failed to use coupon', error);
    }
    return { amountLeft };
  }, []);

  return { coupon, isLoading, useCouponValue };
}
