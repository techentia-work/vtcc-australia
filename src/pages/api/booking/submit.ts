// pages/api/booking/submit.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { BookingDataType } from '@/lib/types';

type ResponseData = {
  success: boolean;
  message: string;
  booking?: {
    id: string;
    customerEmail: string;
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
    const booking: BookingDataType = req.body;

    // Validate required fields
    if (!booking.contact?.email || !booking.contact?.firstName || !booking.contact?.lastName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required contact information hai'
      });
    }

    if (!booking.date || !booking.hallSelection || booking.hallSelection.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking information'
      });
    }

    // Generate booking ID
    const bookingId = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Add booking ID and pending status
    const bookingWithId: BookingDataType = {
      ...booking,
      id: bookingId,
      status: 'pending' // Status will be updated to 'advance_paid' after payment
    };

    // TODO: Save booking to database with 'pending' status
    // const savedBooking = await saveBookingToDatabase(bookingWithId);
    
    console.log('Booking saved with pending status:', {
      id: bookingId,
      email: bookingWithId.contact.email,
      date: bookingWithId.date,
      halls: bookingWithId.hallSelection,
      status: 'pending'
    });

    // NOTE: Emails will be sent AFTER payment verification
    // NOT sending emails here - they will be sent in /api/payment/verify

    return res.status(200).json({
      success: true,
      message: 'Booking saved. Please complete payment to confirm.',
      booking: {
        id: bookingId,
        customerEmail: bookingWithId.contact.email,
      }
    });

  } catch (error: any) {
    console.error('Booking submission error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to submit booking. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
}