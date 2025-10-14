// @/lib/utils/server/availability.server.utils.ts
import { BookingDataType } from "@/lib/types";
import { spreadsheetServerUtils } from "../spreadsheet/spreadsheet.utils";

export const availabilityServerUtils = {
    /**
     * Check if a specific date and time slot is available
     */
    async checkAvailability(
        date: string,
        hallSelection: string[],
        timeFrom: { hour: string; minute: string; meridian: "AM" | "PM" },
        timeTo: { hour: string; minute: string; meridian: "AM" | "PM" }
    ): Promise<{ available: boolean; conflicts: BookingDataType[] }> {
        try {
            // Get all bookings for the date
            const allBookings = await spreadsheetServerUtils.getAllBookingsFromSheets();
            
            console.log("📋 Total bookings:", allBookings.length);
            
            // Filter bookings for the same date
            const dateBookings = allBookings.filter(
                (booking) => booking.date === date && 
                booking.status !== "cancelled" && 
                booking.status !== "draft"
            );

            console.log("📅 Bookings on this date:", dateBookings.length);

            // Convert times to comparable format (minutes from midnight)
            const requestStart = this.timeToMinutes(timeFrom);
            const requestEnd = this.timeToMinutes(timeTo);

            console.log(`⏰ Requested time: ${requestStart} to ${requestEnd} minutes`);

            // Check for conflicts
            const conflicts: BookingDataType[] = [];

            for (const booking of dateBookings) {
                // Check if halls overlap
                const hallsOverlap = booking.hallSelection.some(hall => 
                    hallSelection.includes(hall)
                );

                console.log(`🏛️ Booking hall overlap: ${hallsOverlap}`, booking.hallSelection, hallSelection);

                if (!hallsOverlap) continue;

                const bookingStart = this.timeToMinutes(booking.timeFrom);
                const bookingEnd = this.timeToMinutes(booking.timeTo);

                console.log(`⏰ Existing booking time: ${bookingStart} to ${bookingEnd} minutes`);

                // Check if times overlap
                // Two time ranges overlap if:
                // 1. New start is during existing booking: requestStart >= bookingStart && requestStart < bookingEnd
                // 2. New end is during existing booking: requestEnd > bookingStart && requestEnd <= bookingEnd
                // 3. New booking completely covers existing: requestStart <= bookingStart && requestEnd >= bookingEnd
                const timesOverlap = 
                    (requestStart >= bookingStart && requestStart < bookingEnd) ||
                    (requestEnd > bookingStart && requestEnd <= bookingEnd) ||
                    (requestStart <= bookingStart && requestEnd >= bookingEnd);

                console.log(`⚠️ Times overlap: ${timesOverlap}`);

                if (timesOverlap) {
                    conflicts.push(booking);
                }
            }

            console.log(`✅ Conflicts found: ${conflicts.length}`);

            return {
                available: conflicts.length === 0,
                conflicts
            };
        } catch (error) {
            console.error("Error checking availability:", error);
            return { available: true, conflicts: [] }; // Allow booking if check fails
        }
    },

    /**
     * Get available time slots for a specific date and hall
     */
    async getAvailableSlots(
        date: string,
        hallSelection: string[]
    ): Promise<{ hour: string; minute: string; meridian: "AM" | "PM" }[]> {
        try {
            // Get all bookings for the date
            const allBookings = await spreadsheetServerUtils.getAllBookingsFromSheets();
            
            const dateBookings = allBookings.filter(
                (booking) => booking.date === date && 
                booking.status !== "cancelled" && 
                booking.status !== "draft"
            );

            // Get booked time ranges for selected halls
            const bookedRanges: { start: number; end: number }[] = [];

            for (const booking of dateBookings) {
                const hallsOverlap = booking.hallSelection.some(hall => 
                    hallSelection.includes(hall)
                );

                if (hallsOverlap) {
                    bookedRanges.push({
                        start: this.timeToMinutes(booking.timeFrom),
                        end: this.timeToMinutes(booking.timeTo)
                    });
                }
            }

            // Generate all possible time slots (e.g., 8 AM to 11 PM, hourly)
            const allSlots = this.generateTimeSlots();
            
            // Filter out unavailable slots
            const availableSlots = allSlots.filter(slot => {
                const slotTime = this.timeToMinutes(slot);
                
                // Check if this slot falls within any booked range
                return !bookedRanges.some(range => 
                    slotTime >= range.start && slotTime < range.end
                );
            });

            return availableSlots;
        } catch (error) {
            console.error("Error getting available slots:", error);
            return this.generateTimeSlots(); // Return all slots if check fails
        }
    },

    /**
     * Convert time object to minutes from midnight
     */
    timeToMinutes(time: { hour: string; minute: string; meridian: "AM" | "PM" }): number {
        let hours = parseInt(time.hour) || 0;
        const minutes = parseInt(time.minute) || 0;
        
        // Convert to 24-hour format
        if (time.meridian === "PM" && hours !== 12) {
            hours += 12;
        } else if (time.meridian === "AM" && hours === 12) {
            hours = 0;
        }
        
        return hours * 60 + minutes;
    },

    /**
     * Generate all possible time slots (hourly from 8 AM to 11 PM)
     */
    generateTimeSlots(): { hour: string; minute: string; meridian: "AM" | "PM" }[] {
        const slots: { hour: string; minute: string; meridian: "AM" | "PM" }[] = [];
        
        for (let hour = 8; hour <= 23; hour++) {
            const meridian = hour >= 12 ? "PM" : "AM";
            const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
            
            slots.push({
                hour: displayHour.toString().padStart(2, '0'),
                minute: "00",
                meridian
            });
        }
        
        return slots;
    }
};
