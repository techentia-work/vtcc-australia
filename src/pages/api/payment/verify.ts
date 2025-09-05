import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { bookingServerUtils } from "@/lib/utils";
import { BookingDataType } from "@/lib/types";

// Response types for better type safety
type PaymentVerificationResponse =
    | { success: true; booking: BookingDataType }
    | { success: false; error: string; message?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<PaymentVerificationResponse>) {
    // Only allow POST requests
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
    }

    try {
        // Extract and validate request body
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingData } = req.body

        // Validate required payment fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, error: "Missing payment verification data", message: "Order ID, Payment ID, and Signature are required" });
        }

        // Validate booking data
        if (!bookingData) {
            return res.status(400).json({ success: false, error: "Missing booking data" });
        }

        // Validate environment variables
        const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!razorpaySecret) {
            console.error("RAZORPAY_KEY_SECRET not configured");
            return res.status(500).json({ success: false, error: "Payment gateway configuration error" });
        }

        // Verify payment signature
        const expectedSignature = crypto
            .createHmac("sha256", razorpaySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        // Use timing-safe comparison to prevent timing attacks
        const isValidSignature = crypto.timingSafeEqual(
            Buffer.from(expectedSignature, 'hex'),
            Buffer.from(razorpay_signature, 'hex')
        );

        if (!isValidSignature) {
            console.error("Invalid payment signature", { orderId: razorpay_order_id, paymentId: razorpay_payment_id, expected: expectedSignature, received: razorpay_signature });

            return res.status(400).json({ success: false, error: "Invalid payment signature", message: "Payment verification failed. Please contact support if this persists." });
        }

        // Determine payment status based on booking flow
        const isAdvancePayment = bookingData.status === "advance_pending";
        const newStatus = isAdvancePayment ? "advance_paid" : "confirmed";

        // Prepare updated booking data
        const updatedBookingData = {
            ...bookingData,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            payment: {
                ...bookingData.payment,
                ...(isAdvancePayment ? {
                    advanceOrderId: razorpay_order_id,
                    advancePaymentId: razorpay_payment_id,
                    advanceStatus: "paid" as const,
                    advancePaidAt: new Date().toISOString(),
                    fullPaymentDueDate: calculateDueDate(bookingData.date)
                } : {
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    paymentStatus: "paid" as const
                })
            }
        } as BookingDataType;

        // Save the booking with payment details
        const savedBooking = await bookingServerUtils.saveBooking(updatedBookingData);

        // Save to Google Sheets (async, won't block the response)
        bookingServerUtils.saveToGoogleSheets(savedBooking).catch(error => {
            console.error('Google Sheets save failed for booking:', savedBooking.id, error);
        });

        // Log successful payment
        console.log("Payment verified successfully", {
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            bookingId: savedBooking.id,
            isAdvancePayment,
            newStatus
        });

        // Send success response
        return res.status(200).json({
            success: true,
            booking: savedBooking
        });

    } catch (error: any) {
        // Log detailed error information
        console.error("Payment verification error:", {
            error: error.message,
            stack: error.stack,
            body: req.body
        });

        // Handle specific error types
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: "Invalid booking data",
                message: error.message
            });
        }

        if (error.name === 'DatabaseError') {
            return res.status(500).json({
                success: false,
                error: "Database operation failed",
                message: "Unable to save booking. Please try again."
            });
        }

        // Generic error response
        return res.status(500).json({
            success: false,
            error: "Payment verification failed",
            message: "An unexpected error occurred. Please contact support."
        });
    }
}

// Helper function to calculate payment due date
function calculateDueDate(eventDate: string, daysBeforeEvent: number = 7): string {
    try {
        const event = new Date(eventDate);
        const dueDate = new Date(event);
        dueDate.setDate(event.getDate() - daysBeforeEvent);

        // Ensure due date is not in the past
        const now = new Date();
        if (dueDate < now) {
            // Set due date to 7 days from now if event is too soon
            const nearTermDue = new Date(now);
            nearTermDue.setDate(now.getDate() + 7);
            return nearTermDue.toISOString();
        }

        return dueDate.toISOString();
    } catch (error) {
        // Fallback: 30 days from now
        const fallbackDate = new Date();
        fallbackDate.setDate(fallbackDate.getDate() + 30);
        return fallbackDate.toISOString();
    }
}

// Additional utility function for webhook verification (if needed)
export function verifyRazorpayWebhook(
    payload: string,
    signature: string,
    secret: string
): boolean {
    try {
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(payload)
            .digest("hex");

        return crypto.timingSafeEqual(
            Buffer.from(expectedSignature, 'hex'),
            Buffer.from(signature, 'hex')
        );
    } catch (error) {
        console.error("Webhook verification error:", error);
        return false;
    }
}