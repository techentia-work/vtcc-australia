// lib/email.ts
import nodemailer from 'nodemailer';
import { BookingDataType } from '@/lib/types';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Format time for display
const formatTime = (time: { hour: string; minute: string; meridian: string }) => {
  return `${time.hour}:${time.minute} ${time.meridian}`;
};

// Format date for display
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-AU', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Format currency
const formatCurrency = (amount: number, currency: string = 'AUD') => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Send confirmation email to customer
export async function sendCustomerConfirmation(booking: BookingDataType) {
  const hasPricing = booking.pricing?.totalAmount && booking.pricing.totalAmount > 0;

  const mailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.SMTP_FROM}>`,
    to: booking.contact.email,
    subject: `Booking Confirmation - ${booking.eventType} Event`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .section h2 { color: #667eea; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
            .detail-row { display: flex; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; min-width: 150px; color: #555; }
            .detail-value { color: #333; }
            .highlight { background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 15px 0; border-radius: 4px; }
            .price-box { background: #f0f7ff; padding: 20px; border-radius: 8px; border: 2px solid #667eea; margin: 20px 0; }
            .price-row { display: flex; justify-content: space-between; padding: 10px 0; }
            .price-total { font-size: 20px; font-weight: bold; color: #667eea; border-top: 2px solid #667eea; padding-top: 15px; margin-top: 10px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            ul { list-style: none; padding: 0; }
            li { padding: 5px 0; padding-left: 20px; position: relative; }
            li:before { content: "✓"; position: absolute; left: 0; color: #4caf50; font-weight: bold; }
            .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; }
            .status-pending { background: #fff3cd; color: #856404; }
            .status-confirmed { background: #d4edda; color: #155724; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Booking Confirmation</h1>
              <p>Thank you for choosing us!</p>
            </div>
            <div class="content">
              <div class="highlight">
                <strong>Dear ${booking.contact.firstName} ${booking.contact.lastName},</strong>
                <p>Your booking request has been received successfully. 
                ${hasPricing && booking.status === 'advance_paid' 
                  ? 'Your advance payment has been confirmed and your booking is secured!' 
                  : 'We will contact you shortly to confirm availability and finalize the details.'}
                </p>
              </div>

              <div class="section">
                <h2>📋 Booking Summary</h2>
                <div class="detail-row">
                  <span class="detail-label">Booking ID:</span>
                  <span class="detail-value"><strong>${booking.id}</strong></span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value">
                    <span class="status-badge ${booking.status === 'advance_paid' ? 'status-confirmed' : 'status-pending'}">
                      ${booking.status === 'advance_paid' ? 'Confirmed' : 'Pending'}
                    </span>
                  </span>
                </div>
              </div>

              <div class="section">
                <h2>📅 Event Details</h2>
                <div class="detail-row">
                  <span class="detail-label">Booking Type:</span>
                  <span class="detail-value">${booking.bookingType === 'private' ? 'Private' : 'Organization / Public'}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Event Type:</span>
                  <span class="detail-value"><strong>${booking.eventType}</strong></span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span class="detail-value">${formatDate(booking.date)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span>
                  <span class="detail-value">${formatTime(booking.timeFrom)} - ${formatTime(booking.timeTo)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Number of Guests:</span>
                  <span class="detail-value">${booking.guests}</span>
                </div>
              </div>

              <div class="section">
                <h2>🏛️ Selected Venues</h2>
                <ul>
                  ${booking.hallSelection.map(hall => `<li>${hall}</li>`).join('')}
                </ul>
              </div>

              ${booking.services && booking.services.length > 0 ? `
                <div class="section">
                  <h2>✨ Additional Services</h2>
                  <ul>
                    ${booking.services.map(service => `<li>${service}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}

              ${hasPricing ? `
                <div class="section">
                  <h2>💰 Pricing Details</h2>
                  <div class="price-box">
                    <div class="price-row">
                      <span>Number of Guests:</span>
                      <span>${booking.guests || 0}</span>
                    </div>
                    <div class="price-row">
                      <span>Rate per Guest:</span>
                      <span>${formatCurrency((booking.pricing?.totalAmount || 0) / (booking.guests || 1), booking.pricing?.currency || 'AUD')}</span>
                    </div>
                    <div class="price-row price-total">
                      <span>Total Amount:</span>
                      <span>${formatCurrency(booking.pricing?.totalAmount || 0, booking.pricing?.currency || 'AUD')}</span>
                    </div>
                    ${(booking.pricing?.advanceAmount || 0) > 0 ? `
                      <div class="price-row" style="margin-top: 15px; color: #4caf50;">
                        <span>Advance Paid (${booking.pricing?.advancePercentage || 0}%):</span>
                        <span><strong>${formatCurrency(booking.pricing?.advanceAmount || 0, booking.pricing?.currency || 'AUD')}</strong></span>
                      </div>
                      <div class="price-row" style="color: #ff9800;">
                        <span>Remaining Amount:</span>
                        <span><strong>${formatCurrency(booking.pricing?.remainingAmount || 0, booking.pricing?.currency || 'AUD')}</strong></span>
                      </div>
                    ` : ''}
                  </div>
                  ${booking.payment?.orderId ? `
                    <p style="font-size: 12px; color: #666; margin-top: 10px;">
                      Order ID: ${booking.payment.orderId}
                    </p>
                  ` : ''}
                </div>
              ` : ''}

              ${booking.info ? `
                <div class="section">
                  <h2>📝 Additional Information</h2>
                  <p style="margin: 0;">${booking.info}</p>
                </div>
              ` : ''}

              <div class="section">
                <h2>📞 Your Contact Details</h2>
                <div class="detail-row">
                  <span class="detail-label">Name:</span>
                  <span class="detail-value">${booking.contact.firstName} ${booking.contact.lastName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">${booking.contact.email}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Mobile:</span>
                  <span class="detail-value">${booking.contact.mobile}</span>
                </div>
                ${booking.contact.address ? `
                  <div class="detail-row">
                    <span class="detail-label">Address:</span>
                    <span class="detail-value">
                      ${booking.contact.address}
                      ${booking.contact.city ? `, ${booking.contact.city}` : ''}
                      ${booking.contact.state ? `, ${booking.contact.state}` : ''}
                      ${booking.contact.postcode ? ` ${booking.contact.postcode}` : ''}
                    </span>
                  </div>
                ` : ''}
              </div>

              <div class="footer">
                <p><strong>What's Next?</strong></p>
                ${booking.status === 'advance_paid' 
                  ? `<p>Your booking is confirmed! Our team will contact you 2-3 days before the event to finalize arrangements. ${(booking.pricing?.remainingAmount || 0) > 0 ? `Please pay the remaining amount of ${formatCurrency(booking.pricing?.remainingAmount || 0, booking.pricing?.currency || 'AUD')} by ${booking.payment?.fullPaymentDueDate ? formatDate(booking.payment.fullPaymentDueDate) : 'the due date'}.` : ''}</p>`
                  : `<p>Our team will review your booking request and contact you within 24 hours to confirm availability and discuss payment details.</p>`
                }
                <p>If you have any questions, please don't hesitate to contact us.</p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="font-size: 12px; color: #999;">
                  This is an automated confirmation email. Please do not reply directly.<br>
                  Booking Reference: ${booking.id}
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Booking Confirmation - ${booking.eventType} Event

Dear ${booking.contact.firstName} ${booking.contact.lastName},

Your booking has been ${booking.status === 'advance_paid' ? 'CONFIRMED' : 'RECEIVED'}!
Booking ID: ${booking.id}

EVENT DETAILS:
- Booking Type: ${booking.bookingType === 'private' ? 'Private' : 'Organization / Public'}
- Event Type: ${booking.eventType}
- Date: ${formatDate(booking.date)}
- Time: ${formatTime(booking.timeFrom)} - ${formatTime(booking.timeTo)}
- Number of Guests: ${booking.guests}

SELECTED VENUES:
${booking.hallSelection.map(hall => `- ${hall}`).join('\n')}

${booking.services && booking.services.length > 0 ? `
ADDITIONAL SERVICES:
${booking.services.map(service => `- ${service}`).join('\n')}
` : ''}

${hasPricing ? `
PRICING DETAILS:
- Total Amount: ${formatCurrency(booking.pricing?.totalAmount || 0, booking.pricing?.currency || 'AUD')}
${(booking.pricing?.advanceAmount || 0) > 0 ? `- Advance Paid: ${formatCurrency(booking.pricing?.advanceAmount || 0, booking.pricing?.currency || 'AUD')}
- Remaining Amount: ${formatCurrency(booking.pricing?.remainingAmount || 0, booking.pricing?.currency || 'AUD')}` : ''}
${booking.payment?.orderId ? `- Order ID: ${booking.payment.orderId}` : ''}
` : ''}

${booking.info ? `ADDITIONAL INFORMATION:\n${booking.info}\n` : ''}

YOUR CONTACT DETAILS:
- Name: ${booking.contact.firstName} ${booking.contact.lastName}
- Email: ${booking.contact.email}
- Mobile: ${booking.contact.mobile}
${booking.contact.address ? `- Address: ${booking.contact.address}${booking.contact.city ? `, ${booking.contact.city}` : ''}${booking.contact.state ? `, ${booking.contact.state}` : ''}${booking.contact.postcode ? ` ${booking.contact.postcode}` : ''}` : ''}

${booking.status === 'advance_paid' 
  ? `Your booking is confirmed! We'll contact you before the event to finalize arrangements.`
  : `Our team will contact you within 24 hours to confirm details.`
}

Thank you for choosing ${process.env.APP_NAME}!
    `,
  };

  return await transporter.sendMail(mailOptions);
}

// Send notification email to admin
export async function sendAdminNotification(booking: BookingDataType) {
  const hasPricing = booking.pricing?.totalAmount && booking.pricing.totalAmount > 0;

  const mailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.SMTP_FROM}>`,
    to: process.env.SMTP_USER,
    subject: `🔔 New Booking: ${booking.eventType} - ${booking.contact.firstName} ${booking.contact.lastName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #d32f2f; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f5f5f5; padding: 20px; border-radius: 0 0 8px 8px; }
            .section { background: white; padding: 15px; margin-bottom: 15px; border-radius: 6px; }
            .section h3 { margin-top: 0; color: #d32f2f; border-bottom: 2px solid #d32f2f; padding-bottom: 8px; }
            .detail { padding: 8px 0; border-bottom: 1px solid #eee; display: flex; }
            .label { font-weight: bold; color: #555; min-width: 160px; }
            .value { color: #333; flex: 1; }
            .urgent { background: #fff3cd; border-left: 4px solid #ff9800; padding: 12px; margin: 15px 0; }
            .price-highlight { background: #e8f5e9; padding: 15px; border-radius: 6px; margin: 10px 0; }
            .status-badge { display: inline-block; padding: 5px 12px; border-radius: 15px; font-size: 11px; font-weight: bold; }
            .status-confirmed { background: #4caf50; color: white; }
            .status-pending { background: #ff9800; color: white; }
            .contact-link { color: #2196f3; text-decoration: none; }
            .contact-link:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🔔 New Booking Alert</h2>
              <span class="status-badge ${booking.status === 'advance_paid' ? 'status-confirmed' : 'status-pending'}">
                ${booking.status === 'advance_paid' ? 'PAID & CONFIRMED' : 'PENDING CONFIRMATION'}
              </span>
            </div>
            <div class="content">
              <div class="urgent">
                <strong>⚡ Action Required:</strong> New ${booking.status === 'advance_paid' ? 'confirmed' : ''} booking received. 
                ${booking.status === 'advance_paid' ? 'Payment confirmed - Please prepare for event.' : 'Please contact customer to confirm availability.'}
              </div>

              <div class="section">
                <h3>👤 Customer Information</h3>
                <div class="detail">
                  <span class="label">Name:</span>
                  <span class="value"><strong>${booking.contact.firstName} ${booking.contact.lastName}</strong></span>
                </div>
                <div class="detail">
                  <span class="label">Email:</span>
                  <span class="value"><a href="mailto:${booking.contact.email}" class="contact-link">${booking.contact.email}</a></span>
                </div>
                <div class="detail">
                  <span class="label">Mobile:</span>
                  <span class="value"><a href="tel:${booking.contact.mobile}" class="contact-link">${booking.contact.mobile}</a></span>
                </div>
                ${booking.contact.address ? `
                  <div class="detail">
                    <span class="label">Address:</span>
                    <span class="value">${booking.contact.address}${booking.contact.city ? `, ${booking.contact.city}` : ''}${booking.contact.state ? `, ${booking.contact.state}` : ''}${booking.contact.postcode ? ` ${booking.contact.postcode}` : ''}</span>
                  </div>
                ` : ''}
              </div>

              <div class="section">
                <h3>📅 Booking Details</h3>
                <div class="detail">
                  <span class="label">Booking ID:</span>
                  <span class="value"><strong>${booking.id}</strong></span>
                </div>
                <div class="detail">
                  <span class="label">Status:</span>
                  <span class="value">${booking.status || 'pending'}</span>
                </div>
                <div class="detail">
                  <span class="label">Booking Type:</span>
                  <span class="value">${booking.bookingType === 'private' ? 'Private' : 'Organization / Public'}</span>
                </div>
                <div class="detail">
                  <span class="label">Event Type:</span>
                  <span class="value"><strong>${booking.eventType}</strong></span>
                </div>
                <div class="detail">
                  <span class="label">Event Date:</span>
                  <span class="value"><strong>${formatDate(booking.date)}</strong></span>
                </div>
                <div class="detail">
                  <span class="label">Event Time:</span>
                  <span class="value">${formatTime(booking.timeFrom)} - ${formatTime(booking.timeTo)}</span>
                </div>
                <div class="detail">
                  <span class="label">Guests:</span>
                  <span class="value"><strong>${booking.guests}</strong></span>
                </div>
                <div class="detail">
                  <span class="label">Halls:</span>
                  <span class="value">${booking.hallSelection.join(', ')}</span>
                </div>
              </div>

              ${booking.services && booking.services.length > 0 ? `
                <div class="section">
                  <h3>✨ Additional Services</h3>
                  <ul style="margin: 0; padding-left: 20px;">
                    ${booking.services.map(service => `<li>${service}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}

              ${hasPricing ? `
                <div class="section">
                  <h3>💰 Payment Information</h3>
                  <div class="price-highlight">
                    <div class="detail">
                      <span class="label">Total Amount:</span>
                      <span class="value"><strong>${formatCurrency(booking.pricing?.totalAmount || 0, booking.pricing?.currency || 'AUD')}</strong></span>
                    </div>
                    ${(booking.pricing?.advanceAmount || 0) > 0 ? `
                      <div class="detail">
                        <span class="label">Advance Paid:</span>
                        <span class="value" style="color: #4caf50;"><strong>${formatCurrency(booking.pricing?.advanceAmount || 0, booking.pricing?.currency || 'AUD')}</strong></span>
                      </div>
                      <div class="detail">
                        <span class="label">Remaining:</span>
                        <span class="value" style="color: #ff9800;"><strong>${formatCurrency(booking.pricing?.remainingAmount || 0, booking.pricing?.currency || 'AUD')}</strong></span>
                      </div>
                    ` : ''}
                  </div>
                  ${booking.payment?.orderId ? `
                    <div class="detail">
                      <span class="label">Order ID:</span>
                      <span class="value"><code>${booking.payment.orderId}</code></span>
                    </div>
                  ` : ''}
                  ${booking.payment?.paymentId ? `
                    <div class="detail">
                      <span class="label">Payment ID:</span>
                      <span class="value"><code>${booking.payment.paymentId}</code></span>
                    </div>
                  ` : ''}
                </div>
              ` : ''}

              ${booking.info ? `
                <div class="section">
                  <h3>📝 Additional Information</h3>
                  <p style="margin: 0; padding: 10px; background: #f9f9f9; border-radius: 4px;">${booking.info}</p>
                </div>
              ` : ''}

              <div class="section" style="background: #e3f2fd; border-left: 4px solid #2196f3;">
                <h3 style="color: #1976d2;">📋 Next Steps</h3>
                <ol style="margin: 0; padding-left: 20px;">
                  ${booking.status === 'advance_paid' 
                    ? `
                      <li>Review the booking details above</li>
                      <li>Verify venue availability for the date and time</li>
                      <li>Prepare the selected halls and services</li>
                      <li>Contact customer 2-3 days before event</li>
                      ${(booking.pricing?.remainingAmount || 0) > 0 ? `<li>Collect remaining payment: ${formatCurrency(booking.pricing?.remainingAmount || 0, booking.pricing?.currency || 'AUD')}</li>` : ''}
                    `
                    : `
                      <li>Contact customer within 24 hours</li>
                      <li>Confirm venue availability</li>
                      <li>Discuss payment arrangements</li>
                      <li>Send payment link if required</li>
                    `
                  }
                </ol>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
NEW BOOKING ALERT ${booking.status === 'advance_paid' ? '- PAID & CONFIRMED' : '- PENDING'}

Booking ID: ${booking.id}

CUSTOMER DETAILS:
Name: ${booking.contact.firstName} ${booking.contact.lastName}
Email: ${booking.contact.email}
Mobile: ${booking.contact.mobile}
${booking.contact.address ? `Address: ${booking.contact.address}${booking.contact.city ? `, ${booking.contact.city}` : ''}${booking.contact.state ? `, ${booking.contact.state}` : ''}${booking.contact.postcode ? ` ${booking.contact.postcode}` : ''}` : ''}

BOOKING DETAILS:
- Type: ${booking.bookingType === 'private' ? 'Private' : 'Organization / Public'}
- Event: ${booking.eventType}
- Date: ${formatDate(booking.date)}
- Time: ${formatTime(booking.timeFrom)} - ${formatTime(booking.timeTo)}
- Guests: ${booking.guests}
- Halls: ${booking.hallSelection.join(', ')}

${booking.services && booking.services.length > 0 ? `SERVICES:\n${booking.services.map(s => `- ${s}`).join('\n')}\n` : ''}

${hasPricing ? `
PAYMENT INFO:
- Total: ${formatCurrency(booking.pricing?.totalAmount || 0, booking.pricing?.currency || 'AUD')}
${(booking.pricing?.advanceAmount || 0) > 0 ? `- Advance Paid: ${formatCurrency(booking.pricing?.advanceAmount || 0, booking.pricing?.currency || 'AUD')}
- Remaining: ${formatCurrency(booking.pricing?.remainingAmount || 0, booking.pricing?.currency || 'AUD')}` : ''}
${booking.payment?.orderId ? `- Order ID: ${booking.payment.orderId}` : ''}
` : ''}

${booking.info ? `ADDITIONAL INFO:\n${booking.info}\n` : ''}

ACTION: ${booking.status === 'advance_paid' ? 'Prepare for confirmed event' : 'Contact customer to confirm'}
    `,
  };

  return await transporter.sendMail(mailOptions);
}

// Verify email configuration
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    return { success: true, message: 'Email configuration is valid' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}