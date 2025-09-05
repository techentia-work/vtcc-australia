import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const razorpayServerUtils = {
    async createOrder(amount: number, notes?: string): Promise<any> {
        return await razorpay.orders.create({
            amount: Math.round(amount * 100),
            currency: "AUD",
            receipt: "receipt_" + Date.now(),
            notes: notes ? { description: notes } : undefined
        });
    },

    async getOrderDetails(orderId: string): Promise<any> {
        return await razorpay.orders.fetch(orderId);
    },

    async getPaymentDetails(paymentId: string): Promise<any> {
        return await razorpay.payments.fetch(paymentId);
    }
};