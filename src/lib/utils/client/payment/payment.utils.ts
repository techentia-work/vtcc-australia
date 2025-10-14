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
        await this.loadRazorpayScript();
        
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
                // Show loading toast
                const loadingToast = toast.loading('Verifying payment...');
                
                try {
                    const verifyResponse = await fetch("/api/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            bookingData,
                        }),
                    });

                    const data = await verifyResponse.json();

                    toast.dismiss(loadingToast);

                    if (data.success) {
                        // Show success message
                        toast.success('🎉 Payment successful! Booking confirmed!', {
                            duration: 5000,
                        });

                        // Show email status
                        if (data.emailStatus?.customerEmailSent) {
                            setTimeout(() => {
                                toast.success('📧 Confirmation email sent to your inbox!', {
                                    duration: 5000,
                                });
                            }, 1000);
                        } else {
                            setTimeout(() => {
                                toast('📞 Confirmation email pending. We will contact you shortly.', {
                                    icon: 'ℹ️',
                                    duration: 5000,
                                });
                            }, 1000);
                        }

                        // Redirect or refresh after delay
                        setTimeout(() => {
                            window.location.href = '/booking-success?id=' + data.booking?.id;
                        }, 3000);
                    } else {
                        toast.error('❌ ' + (data.message || 'Payment verification failed'));
                    }
                } catch (error) {
                    toast.dismiss(loadingToast);
                    toast.error('❌ Payment verification failed. Please contact support.');
                    console.error('Payment verification error:', error);
                }
            },
            modal: {
                ondismiss: function () {
                    toast.error('❌ Payment cancelled by user', {
                        duration: 3000,
                    });
                },
            },
            prefill: {
                email: bookingData.contact.email,
                contact: bookingData.contact.mobile,
            },
            theme: {
                color: "#9c1f24",
            },
        });

        rzp.on('payment.failed', function (response: any) {
            toast.error('❌ Payment failed: ' + response.error.description, {
                duration: 5000,
            });
            console.error('Payment failed:', response.error);
        });

        rzp.open();
    },
};