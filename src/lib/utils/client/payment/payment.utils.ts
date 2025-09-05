"use client";

import { BookingDataType, OrderType } from "@/lib/types";
import toast from "react-hot-toast";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export const paymentClientUtils = {
    async loadRazorpayScript() {
        if (typeof window !== 'undefined' && !window.Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        }
    },
    async startPayment(order: OrderType, bookingData: BookingDataType) {
        this.loadRazorpayScript();
        if (!window.Razorpay) {
            await new Promise((resolve) => {
                const checkRazorpay = () => {
                    if (window.Razorpay) {
                        resolve(true);
                    } else {
                        setTimeout(checkRazorpay, 100);
                    }
                };
                checkRazorpay();
            });
        }

        const rzp = new window.Razorpay({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: "AUD",
            name: "Event Booking",
            description: bookingData.eventType,
            order_id: order.id,
            handler: async function (response: any) {
                try {
                    await fetch("/api/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            bookingData,
                        }),
                    });
                    toast.success("✅ Payment successful & booking saved!");
                } catch {
                    toast.error("Payment verification failed");
                }
            },
            modal: {
                ondismiss: function () {
                    toast.error("Payment popup closed by user");
                },
            },
            prefill: {
                email: bookingData.contact.email,
                // contact: bookingData.contact.mobile,
            },
            theme: {
                color: "#9c1f24",
            },
        });

        rzp.open();
    },
};
