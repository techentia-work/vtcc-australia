// @/app/booking/page.tsx
"use client";

import { useState, useEffect } from "react";
import { BookingForm } from "@/components";
import { useBooking } from "@/hooks/useBooking";
import { bookingClientUtils, paymentClientUtils } from "@/lib/utils";
import type { BookingDataType } from "@/lib/types";
import toast from "react-hot-toast";

export default function BookingPage() {
    const { bookingData, order, step, createBookingWithAdvance, resetBooking, loading: bookingLoading, error, clearError } = useBooking();

    const handleSubmit = async (data: BookingDataType) => {
        try {
            const result = await createBookingWithAdvance(data);
            console.log(result)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to book")
            console.log("Booking submission failed:", error);
        }
    };

    const handleStartOver = () => {
        resetBooking();
    };

    const bookingSummary = bookingData ? bookingClientUtils.getBookingSummary(bookingData) : null;

    return (
        <div className="min-h-[calc(100vh-var(--header-height))] bg-background">
            {step === 'form' && (
                <BookingForm
                    onSubmit={handleSubmit}
                    isLoading={bookingLoading}
                    error={error}
                    onClearError={clearError}
                />
            )}

            {step === 'payment' && bookingData && order && (
                <div className="container mx-auto py-8">
                    {/* Booking Summary ... */}
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={async () => {
                                try {
                                    await paymentClientUtils.startPayment(order, bookingData);
                                } catch (err: any) {
                                    toast.error(err instanceof Error ? err.message : "Payment failed. Please retry.");
                                }
                            }}
                            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90"
                        >
                            Pay Now
                        </button>
                        <button
                            onClick={resetBooking}
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            ← Back to form
                        </button>
                    </div>
                </div>
            )}


            {step === 'confirmation' && bookingData && (
                <div className="container mx-auto py-8">
                    <div className="bg-card rounded-lg p-8 text-center">
                        <h2 className="text-2xl font-bold text-green-600 mb-4">
                            Booking Confirmed! 🎉
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            Your booking has been successfully confirmed.
                            You will receive a confirmation email shortly.
                        </p>
                        {bookingSummary && (
                            <div className="bg-muted rounded-lg p-4 mb-6">
                                <h3 className="font-semibold mb-2">Booking Details</h3>
                                <div className="text-sm space-y-1">
                                    <p><strong>Booking ID:</strong> {bookingData.id}</p>
                                    <p><strong>Event:</strong> {bookingSummary.eventType}</p>
                                    <p><strong>Date:</strong> {bookingSummary.date}</p>
                                    <p><strong>Status:</strong> {bookingData.status}</p>
                                    {bookingSummary.remainingAmount && (
                                        <p><strong>Remaining Amount:</strong> {bookingSummary.remainingAmount}</p>
                                    )}
                                </div>
                            </div>
                        )}
                        <button
                            onClick={handleStartOver}
                            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90"
                        >
                            Make Another Booking
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}