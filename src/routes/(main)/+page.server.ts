import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ locals, fetch }) => {
    const session = await locals.auth();
    if (!session) {
        redirect(302, '/auth');
    }

    const roomResponse = await fetch(`${env.BACKEND_API_URL}/api/labs`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.backendToken}`
        }
    });
    const roomResponseData = await roomResponse.json();
    const labRooms = roomResponseData.success ? roomResponseData.data : [];

    const bookingStatsResponse = await fetch(`${env.BACKEND_API_URL}/api/reservations/booking-stats`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.backendToken}`
        }
    });
    const bookingStatsResponseData = await bookingStatsResponse.json();
    const bookingStats = bookingStatsResponseData.success ? bookingStatsResponseData.data : {};
    
    return {
        session,
        labRooms,
        bookingStats
    }
}