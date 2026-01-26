'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Coupon } from '@/lib/types';
import { useUserProfile } from './use-user-profile';

const COUPON_KEY = 'tracksmart_coupon';

const getCouponValue = (mealPlan: 'two-meal' | 'three-meal'): number => {
  return mealPlan === 'two-meal' ? 4000 : 6000;
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

    try {
      const item = window.localStorage.getItem(COUPON_KEY);
      const today = getTodayDateString();
      let currentCoupon: Coupon | null = item ? JSON.parse(item) : null;

      if (!currentCoupon || currentCoupon.date !== today) {
        currentCoupon = {
          value: getCouponValue(profile.mealPlan),
          isValid: true,
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

  const useCoupon = useCallback(() => {
    try {
      setCoupon(prevCoupon => {
        if (!prevCoupon || !prevCoupon.isValid) return prevCoupon;

        const updatedCoupon = { ...prevCoupon, isValid: false };
        window.localStorage.setItem(COUPON_KEY, JSON.stringify(updatedCoupon));
        return updatedCoupon;
      });
    } catch (error) {
      console.error('Failed to use coupon', error);
    }
  }, []);

  return { coupon, isLoading, useCouponValue: useCoupon };
}
