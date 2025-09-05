// @/lib/utils/server/spreadsheet.utils.ts
import { BookingDataType } from "@/lib/types";

export const spreadsheetServerUtils = {
    /**
     * Fetch a single booking from Google Sheets
     */
    async getBookingFromSheets(bookingId: string): Promise<BookingDataType | null> {
        const spreadsheetUrl = process.env.SPREADSHEET_URL;
        
        if (!spreadsheetUrl) {
            throw new Error('SPREADSHEET_URL not configured');
        }
        
        try {
            const url = new URL(spreadsheetUrl);
            url.searchParams.append('action', 'get_booking');
            url.searchParams.append('id', bookingId);
            
            const response = await fetch(url.toString(), {
                method: 'GET',
            });
            
            if (!response.ok) {
                throw new Error(`Google Sheets API responded with status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.status === 'success') {
                return result.booking;
            } else {
                console.error('Failed to fetch booking from Google Sheets:', result.message);
                return null;
            }
            
        } catch (error) {
            console.error('Error fetching booking from Google Sheets:', error);
            return null;
        }
    },

    /**
     * Fetch all bookings from Google Sheets
     */
    async getAllBookingsFromSheets(): Promise<BookingDataType[]> {
        const spreadsheetUrl = process.env.SPREADSHEET_URL;
        
        if (!spreadsheetUrl) {
            throw new Error('SPREADSHEET_URL not configured');
        }
        
        try {
            const url = new URL(spreadsheetUrl);
            url.searchParams.append('action', 'list_bookings');
            
            const response = await fetch(url.toString(), {
                method: 'GET',
            });
            
            if (!response.ok) {
                throw new Error(`Google Sheets API responded with status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.status === 'success') {
                return result.bookings || [];
            } else {
                console.error('Failed to fetch bookings from Google Sheets:', result.message);
                return [];
            }
            
        } catch (error) {
            console.error('Error fetching bookings from Google Sheets:', error);
            return [];
        }
    },

    /**
     * Search bookings in Google Sheets
     */
    async searchBookingsInSheets(query: string): Promise<BookingDataType[]> {
        const spreadsheetUrl = process.env.SPREADSHEET_URL;
        
        if (!spreadsheetUrl) {
            throw new Error('SPREADSHEET_URL not configured');
        }
        
        try {
            const url = new URL(spreadsheetUrl);
            url.searchParams.append('action', 'search_bookings');
            url.searchParams.append('query', query);
            
            const response = await fetch(url.toString(), {
                method: 'GET',
            });
            
            if (!response.ok) {
                throw new Error(`Google Sheets API responded with status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.status === 'success') {
                return result.bookings || [];
            } else {
                console.error('Failed to search bookings in Google Sheets:', result.message);
                return [];
            }
            
        } catch (error) {
            console.error('Error searching bookings in Google Sheets:', error);
            return [];
        }
    },

    /**
     * Get booking statistics from Google Sheets
     */
    async getBookingStatsFromSheets() {
        const spreadsheetUrl = process.env.SPREADSHEET_URL;
        
        if (!spreadsheetUrl) {
            throw new Error('SPREADSHEET_URL not configured');
        }
        
        try {
            const url = new URL(spreadsheetUrl);
            url.searchParams.append('action', 'get_stats');
            
            const response = await fetch(url.toString(), {
                method: 'GET',
            });
            
            if (!response.ok) {
                throw new Error(`Google Sheets API responded with status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.status === 'success') {
                return result.stats;
            } else {
                console.error('Failed to fetch booking stats from Google Sheets:', result.message);
                return null;
            }
            
        } catch (error) {
            console.error('Error fetching booking stats from Google Sheets:', error);
            return null;
        }
    },

    /**
     * Delete a booking from Google Sheets
     */
    async deleteBookingFromSheets(bookingId: string): Promise<boolean> {
        const spreadsheetUrl = process.env.SPREADSHEET_URL;
        
        if (!spreadsheetUrl) {
            throw new Error('SPREADSHEET_URL not configured');
        }
        
        try {
            const formData = new URLSearchParams();
            formData.append('action', 'delete_booking');
            formData.append('id', bookingId);
            
            const response = await fetch(spreadsheetUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString()
            });
            
            if (!response.ok) {
                throw new Error(`Google Sheets API responded with status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.status === 'success') {
                console.log('Booking successfully deleted from Google Sheets:', bookingId);
                return true;
            } else {
                console.error('Failed to delete booking from Google Sheets:', result.message);
                return false;
            }
            
        } catch (error) {
            console.error('Error deleting booking from Google Sheets:', error);
            return false;
        }
    }
};