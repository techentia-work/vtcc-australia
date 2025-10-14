// @/lib/types/booking.ts

import { PLANS } from "@/lib/consts";

export type EventType =
    | "arangetram"
    | "birthday"
    | "community"
    | "concert"
    | "musical"
    | "puberty"
    | "reception"
    | "social"
    | "wedding"
    | "other";

export type BookingDataType = {
    id?: string;
    bookingType: "private" | "organization";
    eventType: keyof typeof PLANS | "";
    hallSelection: string[];
    guests: number;
    date: string;
    timeFrom: { hour: string; minute: string; meridian: "AM" | "PM" };
    timeTo: { hour: string; minute: string; meridian: "AM" | "PM" };
    services: string[];
    info?: string;
    contact: {
        firstName: string;
        lastName: string;
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        postcode?: string;
        email: string;
        mobile: string;
    };
    pricing?: {
        totalAmount: number;
        advanceAmount: number;
        remainingAmount: number;
        advancePercentage: number;
        currency: string;
    };
    payment?: {
        orderId?: string;
        paymentId?: string;
        advanceOrderId?: string;
        advancePaymentId?: string;
        advanceStatus: "pending" | "paid" | "failed" | "expired";
        paymentStatus: "pending" | "partial" | "paid" | "failed" | "expired";
        advancePaidAt?: string;
        fullPaymentDueDate?: string;
    };
    status: "draft" | "advance_pending" | "advance_paid" | "confirmed" | "completed" | "cancelled"|"pending";
    createdAt: string;
    updatedAt?: string;
};