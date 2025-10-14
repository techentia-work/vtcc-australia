// @/lib/utils/client/booking.client.utils.ts
import { PLANS, BOOKING_CONFIG } from "@/lib/consts";
import { ApiResponse, BookingDataType, OrderType, EventType } from "@/lib/types";
import { toast } from "react-hot-toast"; // or your custom toast

export const bookingClientUtils = {
    calculatePricing(eventType: EventType, guests: number) {
        const plan = PLANS[eventType];
        if (!plan) {
            throw new Error(`Invalid event type: ${eventType}`);
        }

        const finalGuests = Math.max(guests, plan.minGuests);
        const totalAmount = finalGuests * plan.price;
        const advanceAmount = Math.max(
            Math.ceil((totalAmount * plan.advancePercentage) / 100),
            BOOKING_CONFIG.minAdvanceAmount
        );
        const remainingAmount = totalAmount - advanceAmount;

        return {
            totalAmount,
            advanceAmount: Math.min(advanceAmount, BOOKING_CONFIG.maxAdvanceAmount),
            remainingAmount,
            advancePercentage: plan.advancePercentage,
            currency: plan.currency,
        };
    },

    calculateBookingCost(eventType: EventType, guests: number) {
        return this.calculatePricing(eventType, guests);
    },

    async submitBookingWithAdvance(
        data: BookingDataType
    ): Promise<ApiResponse<{ booking: BookingDataType; order: OrderType }>> {
        const validation = this.validateBooking(data);
        if (!validation.valid) {
            throw new Error("Validation failed: " + validation.errors.join(", "));
        }

        const res = await fetch("/api/booking/create-with-advance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            let errorMessage = `HTTP error! status: ${res.status}`;
            try {
                const error = await res.json();
                if (error?.message) errorMessage = error.message;
            } catch { }
            throw new Error(errorMessage);
        }

        return res.json();
    },

    validateBooking(data: BookingDataType): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Contact validation
        if (!data.contact?.firstName?.trim()) errors.push("First name is required");
        if (!data.contact?.lastName?.trim()) errors.push("Last name is required");
        if (!data.contact?.email?.trim()) errors.push("Email is required");
        if (!data.contact?.mobile?.trim()) errors.push("Mobile is required");
        if (!data.contact?.address?.trim()) errors.push("Address is required");
        if (!data.contact?.city?.trim()) errors.push("City is required");
        if (!data.contact?.state?.trim()) errors.push("State is required");
        if (!data.contact?.postcode?.trim()) errors.push("Postcode is required");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.contact?.email && !emailRegex.test(data.contact.email)) {
            errors.push("Please enter a valid email address");
        }

        // Only +61 format, no spaces/dashes, exactly 9 digits after +61
        const mobileRegex = /^\+61\d{9}$/;
        if (data.contact?.mobile && !mobileRegex.test(data.contact.mobile)) {
            errors.push("Please enter a valid Australian mobile number starting with +61");
        }

        // Booking validation
        if (!data.hallSelection || data.hallSelection.length === 0) errors.push("Hall selection is required");
        if (!data.eventType) errors.push("Event type is required");
        else if (!PLANS[data.eventType as EventType]) errors.push("Invalid event type");

        if (!data.guests || data.guests <= 0) errors.push("Valid guest count is required");
        // Minimum guests validation
        if (data.eventType && data.guests) {
            const plan = PLANS[data.eventType as EventType];
            if (plan && data.guests < plan.minGuests) {
                errors.push(
                    `The minimum number of guests for ${plan.name} is ${plan.minGuests}.`
                );
            }
        }

        // Time validation
        if (!data.date) errors.push("Date is required");
        if (!data.timeFrom?.hour || !data.timeFrom?.minute || !data.timeFrom?.meridian)
            errors.push("Start time is required");
        if (!data.timeTo?.hour || !data.timeTo?.minute || !data.timeTo?.meridian)
            errors.push("End time is required");

        if (data.date && new Date(data.date) <= new Date()) {
            errors.push("Event date must be in the future");
        }

        if (!data.services || data.services.length === 0)
            errors.push("At least one service must be selected");


        if (
            data.timeFrom?.hour &&
            data.timeFrom?.minute &&
            data.timeFrom?.meridian &&
            data.timeTo?.hour &&
            data.timeTo?.minute &&
            data.timeTo?.meridian
        ) {
            const fromTime = this.convertTo24Hour(data.timeFrom);
            const toTime = this.convertTo24Hour(data.timeTo);
            if (fromTime >= toTime) errors.push("End time must be after start time");
        }

        return { valid: errors.length === 0, errors };
    },


    convertTo24Hour(time: { hour: string; minute: string; meridian: "AM" | "PM" }): number {
        let hour = parseInt(time.hour, 10);
        const minute = parseInt(time.minute, 10);

        if (time.meridian === "PM" && hour !== 12) hour += 12;
        if (time.meridian === "AM" && hour === 12) hour = 0;

        return hour * 60 + minute;
    },

    formatCurrency(amount: number, currency: string = "AUD"): string {
        return new Intl.NumberFormat("en-AU", { style: "currency", currency }).format(amount);
    },

    formatTime(time: BookingDataType["timeFrom"]): string {
        if (!time) return "";
        return `${time.hour.padStart(2, "0")}:${time.minute.padStart(2, "0")} ${time.meridian}`;
    },

    formatDate(dateStr: string): string {
        try {
            return new Date(dateStr).toLocaleDateString("en-AU", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return dateStr;
        }
    },

    getBookingSummary(data: BookingDataType) {
        return {
            eventType: data.eventType,
            date: this.formatDate(data.date),
            time: `${this.formatTime(data.timeFrom)} - ${this.formatTime(data.timeTo)}`,
            halls: data.hallSelection?.join(", ") || "",
            guests: data.guests,
            services: data.services?.join(", ") || "None",
            contact: `${data.contact?.firstName ?? ""} ${data.contact?.lastName ?? ""}`.trim(),
            email: data.contact?.email ?? "",
            mobile: data.contact?.mobile ?? "",
            ...(data.pricing && {
                totalAmount: this.formatCurrency(data.pricing.totalAmount, data.pricing.currency),
                advanceAmount: this.formatCurrency(data.pricing.advanceAmount, data.pricing.currency),
                remainingAmount: this.formatCurrency(data.pricing.remainingAmount, data.pricing.currency),
            }),
        };
    },
};