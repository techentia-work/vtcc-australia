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
        const { date, hallSelection, timeFrom, timeTo } = req.body;

        if (!date || !hallSelection || !timeFrom || !timeTo) {
            return res.status(400).json({ 
                success: false,
                message: "Missing required fields: date, hallSelection, timeFrom, timeTo" 
            });
        }

        // Validate date is not in the past
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            return res.status(400).json({
                success: false,
                available: false,
                message: "Cannot book for past dates"
            });
        }

        console.log("🔍 Checking availability for:", {
            date,
            halls: hallSelection,
            timeFrom,
            timeTo
        });

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
        console.log("📋 Total bookings fetched:", allBookings.length);

        // Normalize date for comparison - FIXED timezone issue
        const normalizeDate = (dateStr: string): string => {
            // Parse the date string and format as YYYY-MM-DD
            const parts = dateStr.split(/[-/]/);
            if (parts.length === 3) {
                // Handle YYYY-MM-DD or DD-MM-YYYY or MM-DD-YYYY
                if (parts[0].length === 4) {
                    // YYYY-MM-DD format
                    return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
                } else {
                    // Try to parse as date
                    const d = new Date(dateStr);
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }
            }
            // Fallback
            const d = new Date(dateStr + 'T00:00:00');
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const searchDate = normalizeDate(date);
        console.log("🔍 Search date input:", date);
        console.log("🔍 Normalized search date:", searchDate);

        // Filter bookings for the same date and active status
        const dateBookings = allBookings.filter((booking) => {
            const bookingDate = normalizeDate(booking.date);
            console.log(`📅 Comparing: search=${searchDate} vs booking=${bookingDate} (original: ${booking.date})`);
            return bookingDate === searchDate && 
                   booking.status !== "cancelled" && 
                   booking.status !== "draft";
        });

        console.log("📅 Bookings on this date:", dateBookings.length);

        if (dateBookings.length === 0) {
            console.log("✅ No bookings found - AVAILABLE");
            return res.status(200).json({
                success: true,
                available: true,
                conflicts: [],
                message: "Time slot is available"
            });
        }

        // Convert times to minutes
        const requestStart = timeToMinutes(timeFrom);
        const requestEnd = timeToMinutes(timeTo);

        // Validate time range
        if (requestEnd <= requestStart) {
            return res.status(400).json({
                success: false,
                available: false,
                message: "End time must be after start time"
            });
        }

        console.log(`⏰ Requested: ${timeFrom.hour}:${timeFrom.minute} ${timeFrom.meridian} to ${timeTo.hour}:${timeTo.minute} ${timeTo.meridian}`);
        console.log(`   Minutes: ${requestStart} to ${requestEnd}`);

        // Check for conflicts
        const conflicts: BookingDataType[] = [];

        for (const booking of dateBookings) {
            // Check if halls overlap
            const hallsOverlap = booking.hallSelection.some(hall => 
                hallSelection.includes(hall)
            );

            console.log(`🏛️  Checking booking ${booking.id}:`, {
                halls: booking.hallSelection,
                overlap: hallsOverlap
            });

            if (!hallsOverlap) {
                console.log("   ✓ No hall overlap - skip");
                continue;
            }

            const bookingStart = timeToMinutes(booking.timeFrom);
            const bookingEnd = timeToMinutes(booking.timeTo);

            console.log(`⏰  Booked: ${booking.timeFrom.hour}:${booking.timeFrom.minute} ${booking.timeFrom.meridian} to ${booking.timeTo.hour}:${booking.timeTo.minute} ${booking.timeTo.meridian}`);
            console.log(`   Minutes: ${bookingStart} to ${bookingEnd}`);

            // FIXED: Improved time overlap logic
            // Two time ranges [A_start, A_end] and [B_start, B_end] overlap if:
            // A_start < B_end AND A_end > B_start
            const timesOverlap = requestStart < bookingEnd && requestEnd > bookingStart;

            console.log(`⚠️  Times overlap: ${timesOverlap}`);

            if (timesOverlap) {
                console.log("   ❌ CONFLICT!");
                conflicts.push(booking);
            }
        }

        const isAvailable = conflicts.length === 0;
        console.log(`${isAvailable ? '✅ AVAILABLE' : '❌ NOT AVAILABLE'} - Conflicts: ${conflicts.length}`);

        res.status(200).json({
            success: true,
            available: isAvailable,
            conflicts: conflicts.map(c => ({
                id: c.id,
                timeFrom: c.timeFrom,
                timeTo: c.timeTo,
                halls: c.hallSelection
            })),
            message: isAvailable ? "Time slot is available" : "Time slot is not available - conflicts found"
        });

    } catch (error: any) {
        console.error("💥 Error checking availability:", error);
        res.status(500).json({
            success: false,
            available: false, // Changed: safer to assume unavailable on error
            message: "Failed to check availability",
            error: error.message
        });
    }
}

// Helper function
function timeToMinutes(time: TimeSlot): number {
    let hours = parseInt(time.hour) || 0;
    const minutes = parseInt(time.minute) || 0;
    
    if (time.meridian === "PM" && hours !== 12) {
        hours += 12;
    } else if (time.meridian === "AM" && hours === 12) {
        hours = 0;
    }
    
    return hours * 60 + minutes;
}