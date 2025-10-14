// pages/api/booking/create-with-advance.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { bookingServerUtils, razorpayServerUtils } from "@/lib/utils";
import { BookingDataType } from "@/lib/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }

    try {
        const bookingData: BookingDataType = req.body;

        // Validate required fields
        if (!bookingData.contact.firstName || !bookingData.contact.email || !bookingData.eventType) {
            return res.status(400).json({ message: "Missing required booking information" });
        }

        if (!bookingData.pricing?.advanceAmount) {
            return res.status(400).json({ message: "Advance amount calculation missing" });
        }

        // Create Razorpay order for advance payment
        const order = await razorpayServerUtils.createOrder(
            bookingData.pricing.advanceAmount,
            `Advance payment for ${bookingData.eventType} event`
        );

        // Save booking with advance order details
        const savedBooking = await bookingServerUtils.saveBooking(bookingData, order.id);

        res.status(200).json({
            success: true,
            data: {
                booking: savedBooking,
                order,
            },
            message: "Booking created successfully. Please complete advance payment to confirm."
        });

    } catch (error: any) {
        console.error("Create booking with advance error:", error);
        res.status(500).json({
            message: "Failed to create booking with advance payment",
            error
        });
    }
}