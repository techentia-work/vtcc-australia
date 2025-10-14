// @/lib/utils/server/booking.server.utils.ts
import { BookingDataType, EventType } from "@/lib/types";
import { PLANS } from "@/lib/consts";

export const bookingServerUtils = {
    async saveBooking(booking: BookingDataType, orderId?: string): Promise<BookingDataType> {
        const errors: string[] = [];

        // Contact validation
        if (!booking.contact?.firstName?.trim()) errors.push("First name is required");
        if (!booking.contact?.lastName?.trim()) errors.push("Last name is required");
        if (!booking.contact?.email?.trim()) errors.push("Email is required");
        if (!booking.contact?.mobile?.trim()) errors.push("Mobile is required");

        // Event type validation
        if (!booking.eventType || !(booking.eventType in PLANS)) {
            errors.push("Valid event type is required");
        }

        // Required fields
        if (!booking.date) errors.push("Event date is required");
        if (!booking.hallSelection?.length) errors.push("Hall selection is required");
        if (!booking.guests || booking.guests <= 0) errors.push("Valid guest count is required");
        if (!booking.services?.length) errors.push("At least one service must be selected");

        // Time validation
        if (!booking.timeFrom?.hour || !booking.timeFrom?.minute || !booking.timeFrom?.meridian) {
            errors.push("Start time is required");
        }
        if (!booking.timeTo?.hour || !booking.timeTo?.minute || !booking.timeTo?.meridian) {
            errors.push("End time is required");
        }

        if (errors.length > 0) {
            throw new Error(`Booking validation failed: ${errors.join(", ")}`);
        }

        // Safe narrowing
        const eventType = booking.eventType as EventType;
        const plan = PLANS[eventType];

        // Minimum guest validation
        if ((booking.guests ?? 0) < plan.minGuests) {
            throw new Error(
                `Minimum guest requirement not met for ${plan.name}. At least ${plan.minGuests} guests are required.`
            );
        }

        // Pricing calculation
        const guests = booking.guests ?? 0;
        const totalAmount = guests * plan.price;
        const advanceAmount = Math.round((totalAmount * plan.advancePercentage) / 100);
        const remainingAmount = totalAmount - advanceAmount;

        const payload: BookingDataType = {
            ...booking,
            pricing: {
                totalAmount,
                advanceAmount,
                remainingAmount,
                advancePercentage: plan.advancePercentage,
                currency: plan.currency,
            },
            payment: {
                orderId: orderId ?? "",
                advanceStatus: "paid",
                paymentStatus: "paid",
                fullPaymentDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
            status: "advance_paid",
        };

        // Assign ID & timestamps
        const id = payload.id || Date.now().toString();
        return {
            ...payload,
            id,
            createdAt: payload.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    },

    bookingToFormData(booking: BookingDataType): URLSearchParams {
        const formData = new URLSearchParams();
        formData.append("action", "create_booking");

        formData.append("id", booking.id || Date.now().toString());
        formData.append("bookingType", booking.bookingType || "");
        formData.append("eventType", booking.eventType || "");
        formData.append("hallSelection", booking.hallSelection?.join(",") || "");
        formData.append("guests", booking.guests?.toString() || "0");
        formData.append("date", booking.date || "");

        formData.append("timeFromHour", booking.timeFrom?.hour || "");
        formData.append("timeFromMinute", booking.timeFrom?.minute || "");
        formData.append("timeFromMeridian", booking.timeFrom?.meridian || "AM");
        formData.append("timeToHour", booking.timeTo?.hour || "");
        formData.append("timeToMinute", booking.timeTo?.minute || "");
        formData.append("timeToMeridian", booking.timeTo?.meridian || "AM");
        formData.append("services", booking.services?.join(",") || "");
        formData.append("info", booking.info || "");

        // Contact info
        formData.append("contactFirstName", booking.contact?.firstName || "");
        formData.append("contactLastName", booking.contact?.lastName || "");
        formData.append("contactAddress", booking.contact?.address || "");
        formData.append("contactCity", booking.contact?.city || "");
        formData.append("contactState", booking.contact?.state || "");
        formData.append("contactCountry", booking.contact?.country || "");
        formData.append("contactPostcode", booking.contact?.postcode || "");
        formData.append("contactEmail", booking.contact?.email || "");
        formData.append("contactMobile", booking.contact?.mobile || "");

        // Pricing
        formData.append("pricingTotalAmount", booking.pricing?.totalAmount?.toString() || "0");
        formData.append("pricingAdvanceAmount", booking.pricing?.advanceAmount?.toString() || "0");
        formData.append("pricingRemainingAmount", booking.pricing?.remainingAmount?.toString() || "0");
        formData.append("pricingAdvancePercentage", booking.pricing?.advancePercentage?.toString() || "0");
        formData.append("pricingCurrency", booking.pricing?.currency || "AUD");

        // Payment
        formData.append("paymentOrderId", booking.payment?.orderId || "");
        formData.append("paymentPaymentId", booking.payment?.paymentId || "");
        formData.append("paymentAdvanceOrderId", booking.payment?.advanceOrderId || "");
        formData.append("paymentAdvancePaymentId", booking.payment?.advancePaymentId || "");
        formData.append("paymentAdvanceStatus", booking.payment?.advanceStatus || "pending");
        formData.append("paymentPaymentStatus", booking.payment?.paymentStatus || "pending");
        formData.append("paymentAdvancePaidAt", booking.payment?.advancePaidAt || "");
        formData.append("paymentFullPaymentDueDate", booking.payment?.fullPaymentDueDate || "");

        formData.append("status", booking.status || "draft");

        return formData;
    },

    async saveToGoogleSheets(booking: BookingDataType): Promise<void> {
        const spreadsheetUrl = process.env.SPREADSHEET_URL;
        if (!spreadsheetUrl) return;

        try {
            const formData = this.bookingToFormData(booking);
            const response = await fetch(spreadsheetUrl, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData.toString(),
            });

            if (!response.ok) throw new Error(`Google Sheets API status: ${response.status}`);
            const result = await response.json();
            if (result.status !== "success") throw new Error(`Google Sheets API error: ${result.message || "Unknown error"}`);
        } catch (err) {
            console.error("Failed to save booking to Google Sheets:", err);
            throw err; // Throw to client, client can show toast
        }
    },

    async updateInGoogleSheets(booking: BookingDataType): Promise<void> {
        const spreadsheetUrl = process.env.SPREADSHEET_URL;
        if (!spreadsheetUrl) return;

        try {
            const formData = this.bookingToFormData(booking);
            formData.set("action", "update_booking");

            const response = await fetch(spreadsheetUrl, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData.toString(),
            });

            if (!response.ok) throw new Error(`Google Sheets API status: ${response.status}`);
            const result = await response.json();
            if (result.status !== "success") throw new Error(`Google Sheets API error: ${result.message || "Unknown error"}`);
        } catch (err) {
            console.error("Failed to update booking in Google Sheets:", err);
            throw err; // Throw to client
        }
    },
};