// @/lib/consts/index.ts
import { BookingDataType, EventType } from "../types";

export const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' }
];

export const PLANS: Record<EventType, { name: string, price: number, minGuests: number, advancePercentage: number, currency: string }> = {
    arangetram: { name: "Arangetram", price: 35, minGuests: 75, advancePercentage: 25, currency: "AUD" },
    birthday: { name: "Birthdays", price: 25, minGuests: 50, advancePercentage: 25, currency: "AUD" },
    community: { name: "Community gathering", price: 30, minGuests: 80, advancePercentage: 20, currency: "AUD" },
    concert: { name: "Concerts", price: 60, minGuests: 200, advancePercentage: 40, currency: "AUD" },
    musical: { name: "Musical Event", price: 20, minGuests: 40, advancePercentage: 20, currency: "AUD" },
    puberty: { name: "Puberty Ceremony", price: 30, minGuests: 60, advancePercentage: 25, currency: "AUD" },
    reception: { name: "Receptions", price: 45, minGuests: 100, advancePercentage: 30, currency: "AUD" },
    social: { name: "Social gatherings", price: 20, minGuests: 40, advancePercentage: 20, currency: "AUD" },
    wedding: { name: "Weddings", price: 1, minGuests: 100, advancePercentage: 30, currency: "AUD" },
    other: { name: "others", price: 30, minGuests: 50, advancePercentage: 30, currency: "AUD" }
};

export const BOOKING_CONFIG = {
    minAdvanceAmount: 30,
    maxAdvanceAmount: 1000000,
    advanceValidityDays: 7,
    cancellationPolicy: {
        fullRefund: 30,
        partialRefund: 15,
        refundPercentage: 50
    }
};

// @/lib/consts/index.ts

// export const DEFAULT_FORM_DATA: BookingDataType = {
//     id: "test-123",
//     bookingType: "private",
//     eventType: "wedding",
//     hallSelection: ["Main Hall", "Garden Area"],
//     guests: 120,
//     date: "2025-09-15",
//     timeFrom: { hour: "06", minute: "30", meridian: "PM" },
//     timeTo: { hour: "11", minute: "00", meridian: "PM" },
//     services: ["catering", "decoration", "photography"],
//     info: "This is a test booking for demonstration purposes.",
//     contact: {
//         firstName: "John",
//         lastName: "Doe",
//         address: "123 Main Street",
//         city: "Sydney",
//         state: "NSW",
//         country: "Australia",
//         postcode: "2000",
//         email: "john.doe@example.com",
//         mobile: "+61400123456",
//     },
//     pricing: {
//         totalAmount: 300,
//         advanceAmount: 90,
//         remainingAmount: 4200,
//         advancePercentage: 30,
//         currency: "AUD",
//     },
//     payment: {
//         orderId: "ORD123456",
//         paymentId: "PAY987654",
//         advanceOrderId: "ADV123456",
//         advancePaymentId: "ADVPAY987654",
//         advanceStatus: "paid",
//         paymentStatus: "partial",
//         advancePaidAt: new Date().toISOString(),
//         fullPaymentDueDate: "2025-09-20",
//     },
//     status: "advance_paid",
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
// };

export const DEFAULT_FORM_DATA: BookingDataType = {
    id: "",
    bookingType: "private",
    eventType: "",
    hallSelection: [],
    guests: 0,
    date: "",
    timeFrom: { hour: "", minute: "", meridian: "AM" },
    timeTo: { hour: "", minute: "", meridian: "PM" },
    services: [],
    info: "",
    contact: {
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postcode: "",
        email: "",
        mobile: "",
    },
    pricing: {
        totalAmount: 0,
        advanceAmount: 0,
        remainingAmount: 0,
        advancePercentage: 0,
        currency: "AUD",
    },
    payment: {
        orderId: "",
        paymentId: "",
        advanceOrderId: "",
        advancePaymentId: "",
        advanceStatus: "pending",
        paymentStatus: "pending",
        advancePaidAt: "",
        fullPaymentDueDate: "",
    },
    status: "draft",
    createdAt: "",
    updatedAt: "",
};