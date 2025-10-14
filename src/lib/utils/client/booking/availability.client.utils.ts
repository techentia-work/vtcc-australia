export const availabilityClientUtils = {
    /**
     * Check if a time slot is available
     */
    async checkAvailability(
        date: string,
        hallSelection: string[],
        timeFrom: { hour: string; minute: string; meridian: "AM" | "PM" },
        timeTo: { hour: string; minute: string; meridian: "AM" | "PM" }
    ) {
        const response = await fetch("/api/booking/check-availability", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date, hallSelection, timeFrom, timeTo })
        });

        if (!response.ok) {
            throw new Error("Failed to check availability");
        }

        return await response.json();
    },

    /**
     * Get available time slots for a date and hall
     */
    async getAvailableSlots(date: string, hallSelection: string[]) {
        const response = await fetch("/api/booking/available-slots", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date, hallSelection })
        });

        if (!response.ok) {
            throw new Error("Failed to get available slots");
        }

        return await response.json();
    }
};