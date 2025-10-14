// pages/api/payment/verify.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { sendCustomerConfirmation, sendAdminNotification } from '@/lib/email';
import { BookingDataType } from '@/lib/types';

type ResponseData = {
  success: boolean;
  message: string;
  booking?: {
    id: string;
    paymentId: string;
  };
  emailStatus?: {
    customerEmailSent: boolean;
    adminEmailSent: boolean;
  };
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingData,
    } = req.body;

    // Verify Razorpay signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!secret) {
      throw new Error('Razorpay secret key not configured');
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed - Invalid signature",
      });
    }

    // Payment verified successfully
    console.log('✓ Payment verified successfully');
    console.log('Order ID:', razorpay_order_id);
    console.log('Payment ID:', razorpay_payment_id);

    // Update booking data with payment info
    const bookingWithPayment: BookingDataType = {
      ...bookingData,
      status: 'advance_paid',
      payment: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        status: 'paid',
        paidAt: new Date().toISOString(),
      }
    };

    // TODO: Save booking to database with payment details
    // await saveBookingToDatabase(bookingWithPayment);

    // Send confirmation emails AFTER successful payment
    const emailResults = {
      customer: false,
      admin: false,
    };

    try {
      // Send customer confirmation email
      try {
        await sendCustomerConfirmation(bookingWithPayment);
        emailResults.customer = true;
        console.log('✓ Customer confirmation email sent');
      } catch (error: any) {
        console.error('✗ Customer email failed:', error.message);
      }

      // Send admin notification email
      try {
        await sendAdminNotification(bookingWithPayment);
        emailResults.admin = true;
        console.log('✓ Admin notification email sent');
      } catch (error: any) {
        console.error('✗ Admin email failed:', error.message);
      }
    } catch (emailError: any) {
      console.error('Email system error:', emailError);
      // Don't fail the payment verification if emails fail
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and booking confirmed!',
      booking: {
        id: bookingWithPayment.id || razorpay_order_id,
        paymentId: razorpay_payment_id,
      },
      emailStatus: {
        customerEmailSent: emailResults.customer,
        adminEmailSent: emailResults.admin,
      }
    });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}