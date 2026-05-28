import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ locals, fetch }) => {
    const session = await locals.auth();
    if (!session?.user) {
        throw redirect(303, '/auth');
    }
    const backendToken = session.backendToken;
    try {
        const response = await fetch(`${env.BACKEND_API_URL}/api/bookings/my-bookings`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${backendToken}`
            }
        });
        
        if (!response.ok) {
            return {
                session,
                reservedTables: [],
                error: `Failed to load Bookings: ${response.status}`
            }
        }

        const responseData = await response.json();
        const Bookings = responseData.data;

        const reservedTables = Bookings.map((Booking: any) => ({
            booking_id: Booking.booking_id,
            table_id: Booking.table_id,
            table_code: Booking.tables.table_code,
            lab_id: Booking.tables.lab_id,
            lab_name: Booking.tables.labs.lab_name,
            date: Booking.booking_date.slice(0, 10),
            slot: Booking.slot
        }))

        return {
            session,
            reservedTables,
            error: ''
        }
    } catch (error) {
        console.error('SSR load error:', error);
        return {
            session,
            reservedTables: [],
            error: 'An error occurred while loading Bookings.'
        }
    }
}

export const actions: Actions = {
    cancel: async ({ request, locals, fetch }) => {
        const session = await locals.auth();
        if (!session?.user) {
            throw redirect(303, '/auth');
        }

        const formData = await request.formData();
        const bookingId = formData.get('bookingId');

        const response = await fetch(`${env.BACKEND_API_URL}/api/bookings/cancel/${bookingId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.backendToken}`
            }
        });

        if (!response.ok) {
            return { success: false, error: 'ยกเลิกไม่สำเร็จ' };
        }

        return { success: true };
    }
};
