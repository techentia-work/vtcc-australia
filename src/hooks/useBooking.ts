// @/hooks/useBooking.ts
"use client";

import { useCallback } from "react";
import { bookingClientUtils, paymentClientUtils } from "@/lib/utils";
import { BookingDataType, EventType } from "@/lib/types";
import { PLANS } from "@/lib/consts";
import { useBookingStore } from "@/lib/store";
import toast from "react-hot-toast";

export function useBooking() {
    const { bookingData, order, step, loading, error, setBookingData, setOrder, setStep, setLoading, setError, reset, } = useBookingStore();

    const createBookingWithAdvance = useCallback(async (data: BookingDataType) => {
        setLoading(true);
        setError(null);

        try {
            const validation = bookingClientUtils.validateBooking(data);
            if (!validation.valid) throw new Error(validation.errors[0]);

            const pricing = bookingClientUtils.calculatePricing(data.eventType as EventType, data.guests);

            const result = await bookingClientUtils.submitBookingWithAdvance({
                ...data,
                pricing,
                status: "advance_pending",
                createdAt: new Date().toISOString(),
                payment: { advanceStatus: "pending", paymentStatus: "pending" },
            });

            if (!result.success || !result.data) throw new Error("Booking failed");

            const { booking, order } = result.data;

            setBookingData(booking);
            setOrder(order);

            try {
                await paymentClientUtils.startPayment(order, booking);
                setStep("payment");
            } catch (paymentError: any) {
                setStep("payment"); // still show payment step
                setError(paymentError.message || "Payment failed. You can retry below.");
            }

            return result;
        } catch (err: any) {
            setError(err.message || "Booking failed");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setBookingData, setOrder, setStep, setLoading, setError]);

    const resetBooking = useCallback(() => reset(), [reset]);

    const clearError = useCallback(() => setError(null), [setError]);

    return { bookingData, order, step, loading, error, createBookingWithAdvance, setStep, resetBooking, clearError, };
}
