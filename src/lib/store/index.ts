// @/stores/bookingStore.ts
import { create } from "zustand";
import { BookingDataType, OrderType } from "@/lib/types";

interface BookingStore {
  bookingData: BookingDataType | null;
  order: OrderType | null;
  step: 'form' | 'payment' | 'confirmation' | 'failed';
  loading: boolean;
  error: string | null;
  setBookingData: (data: BookingDataType) => void;
  setOrder: (order: OrderType) => void;
  setStep: (step: BookingStore['step']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  bookingData: null,
  order: null,
  step: 'form',
  loading: false,
  error: null,
  setBookingData: (data) => set({ bookingData: data }),
  setOrder: (order) => set({ order }),
  setStep: (step) => set({ step }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set({ bookingData: null, order: null, step: 'form', loading: false, error: null }),
}));
