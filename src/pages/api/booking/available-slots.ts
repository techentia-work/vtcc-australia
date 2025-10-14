import type { NextApiRequest, NextApiResponse } from "next";

interface TimeSlot {
    hour: string;
    minute: string;
    meridian: "AM" | "PM";
}

interface BookingDataType {
    id: string;
    date: string;
    hallSelection: string[];
    timeFrom: TimeSlot;
    timeTo: TimeSlot;
    status: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }

    try {
        const { date, hallSelection } = req.body;

        if (!date || !hallSelection) {
            return res.status(400).json({ 
                success: false,
                message: "Missing required fields: date, hallSelection" 
            });
        }

        console.log("\n========== AVAILABLE SLOTS DEBUG ==========");
        console.log("📅 Input date:", date);
        console.log("🏛️ Input halls:", hallSelection);

        // Fetch all bookings from Google Sheets
        const spreadsheetUrl = process.env.SPREADSHEET_URL;
        if (!spreadsheetUrl) {
            throw new Error('SPREADSHEET_URL not configured');
        }

        const url = new URL(spreadsheetUrl);
        url.searchParams.append('action', 'list_bookings');

        const response = await fetch(url.toString(), {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Google Sheets API responded with status: ${response.status}`);
        }

        const result = await response.json();

        if (result.status !== 'success') {
            throw new Error(result.message || 'Failed to fetch bookings');
        }

        const allBookings: BookingDataType[] = result.bookings || [];
        console.log("📚 Total bookings fetched:", allBookings.length);

        // Print ALL bookings with their dates
        console.log("\n===== ALL BOOKINGS IN SHEETS =====");
        allBookings.forEach((booking, idx) => {
            console.log(`Booking ${idx + 1}:`, {
                id: booking.id,
                date: booking.date,
                status: booking.status,
                halls: booking.hallSelection,
                timeFrom: `${booking.timeFrom?.hour}:${booking.timeFrom?.minute} ${booking.timeFrom?.meridian}`,
                timeTo: `${booking.timeTo?.hour}:${booking.timeTo?.minute} ${booking.timeTo?.meridian}`
            });
        });

        // SIMPLE date comparison - just use the date string as-is
        const searchDate = date.trim();
        console.log("\n🔍 Searching for date:", searchDate);

        // Filter bookings for the same date
        const dateBookings = allBookings.filter((booking) => {
            const bookingDate = booking.date?.trim() || '';
            const dateMatch = bookingDate === searchDate;
            const isActive = booking.status !== "cancelled" && booking.status !== "draft";
            
            console.log(`\n📅 Comparing booking ${booking.id}:`, {
                bookingDate: bookingDate,
                searchDate: searchDate,
                dateMatch: dateMatch,
                status: booking.status,
                isActive: isActive,
                willInclude: dateMatch && isActive
            });
            
            return dateMatch && isActive;
        });

        console.log("\n✅ Bookings found for this date:", dateBookings.length);

        if (dateBookings.length > 0) {
            console.log("These bookings matched:");
            dateBookings.forEach(b => {
                console.log(`  - ${b.id}: ${b.hallSelection.join(', ')} from ${b.timeFrom.hour}:${b.timeFrom.minute}${b.timeFrom.meridian} to ${b.timeTo.hour}:${b.timeTo.minute}${b.timeTo.meridian}`);
            });
        }

        // Get booked time ranges for selected halls
        const bookedRanges: { start: number; end: number; bookingId: string }[] = [];

        for (const booking of dateBookings) {
            // Check if any hall overlaps
            const hallsOverlap = booking.hallSelection.some(hall => 
                hallSelection.includes(hall)
            );

            console.log(`\n🏛️ Hall check for booking ${booking.id}:`, {
                bookingHalls: booking.hallSelection,
                selectedHalls: hallSelection,
                overlap: hallsOverlap
            });

            if (hallsOverlap) {
                const start = timeToMinutes(booking.timeFrom);
                const end = timeToMinutes(booking.timeTo);
                bookedRanges.push({ start, end, bookingId: booking.id });
                console.log(`⏰ BOOKED TIME ADDED: ${start} to ${end} minutes (${booking.timeFrom.hour}:${booking.timeFrom.minute} ${booking.timeFrom.meridian} - ${booking.timeTo.hour}:${booking.timeTo.minute} ${booking.timeTo.meridian})`);
            }
        }

        console.log("\n🚫 Total booked time ranges:", bookedRanges.length);
        if (bookedRanges.length > 0) {
            console.log("Booked ranges:");
            bookedRanges.forEach(r => {
                console.log(`  - ${r.start} to ${r.end} minutes (Booking: ${r.bookingId})`);
            });
        }

        // Generate all possible time slots (8 AM to 11 PM, hourly)
        const allSlots = generateTimeSlots();
        console.log("\n⏰ Total time slots generated:", allSlots.length);
        
        // Filter out unavailable slots
        const availableSlots = allSlots.filter(slot => {
            const slotTime = timeToMinutes(slot);
            
            // Check if this slot falls within any booked range
            for (const range of bookedRanges) {
                if (slotTime >= range.start && slotTime < range.end) {
                    console.log(`❌ REMOVING slot ${slot.hour}:${slot.minute} ${slot.meridian} (${slotTime} min) - conflicts with booking ${range.bookingId} (${range.start}-${range.end})`);
                    return false; // This slot is booked
                }
            }
            
            return true; // This slot is available
        });

        console.log("\n✅ Available slots after filtering:", availableSlots.length);
        console.log("Available slots:", availableSlots.map(s => `${s.hour}:${s.minute} ${s.meridian}`).join(', '));
        console.log("========================================\n");

        res.status(200).json({
            success: true,
            slots: availableSlots,
            message: availableSlots.length > 0 
                ? "Available slots retrieved successfully" 
                : "No slots available for the selected date and halls",
            debug: {
                inputDate: date,
                searchDate: searchDate,
                totalBookings: allBookings.length,
                dateBookings: dateBookings.length,
                bookedRanges: bookedRanges.length,
                totalSlots: allSlots.length,
                availableSlots: availableSlots.length,
                allBookingDates: allBookings.map(b => b.date)
            }
        });

    } catch (error: any) {
        console.error("💥 Error getting available slots:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get available slots",
            error: error.message
        });
    }
}

// Helper function to convert time to minutes
function timeToMinutes(time: TimeSlot): number {
    let hours = parseInt(time.hour) || 0;
    const minutes = parseInt(time.minute) || 0;
    
    // Convert to 24-hour format
    if (time.meridian === "PM" && hours !== 12) {
        hours += 12;
    } else if (time.meridian === "AM" && hours === 12) {
        hours = 0;
    }
    
    return hours * 60 + minutes;
}

// Helper function to generate time slots
function generateTimeSlots(): TimeSlot[] {
    const slots: TimeSlot[] = [];
    
    // Generate from 8 AM to 11 AM
    for (let hour = 8; hour <= 11; hour++) {
        slots.push({ 
            hour: hour.toString().padStart(2, '0'), 
            minute: "00", 
            meridian: "AM" 
        });
    }
    
    // Add 12 PM
    slots.push({ hour: "12", minute: "00", meridian: "PM" });
    
    // Generate from 1 PM to 11 PM
    for (let hour = 1; hour <= 11; hour++) {
        slots.push({ 
            hour: hour.toString().padStart(2, '0'), 
            minute: "00", 
            meridian: "PM" 
        });
    }
    
    return slots;
}