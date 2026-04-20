import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ locals, fetch }) => {
    const session = await locals.auth();
    if (!session) {
        redirect(302, '/auth');
    }

    let user = session.user;

    const userDataResponse = await fetch(`${env.BACKEND_API_URL}/api/user/${session.user.student_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.backendToken}`
        }
    });
    if (userDataResponse.ok) {
        const userData = await userDataResponse.json();
        if (userData.success && userData.user_type) {
            user = {
                ...user,
                name: userData.name,
                image: userData.image
            };
        }
    }

    const roomResponse = await fetch(`${env.BACKEND_API_URL}/api/labs`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.backendToken}`
        }
    });
    let labRooms = [];
    if (roomResponse.ok) {
        const roomResponseData = await roomResponse.json();
        labRooms = roomResponseData.success ? roomResponseData.data : [];
    } else {
        console.error('Failed to fetch labs:', roomResponse.status, roomResponse.statusText);
    }

    const bookingStatsResponse = await fetch(`${env.BACKEND_API_URL}/api/reservations/booking-stats`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.backendToken}`
        }
    });
    let bookingStats = {
        userUpcoming: 0,
        userTotal: 0,
        allTotal: 0,
        percentage: 0
    };
    if (bookingStatsResponse.ok) {
        const bookingStatsResponseData = await bookingStatsResponse.json();
        if (bookingStatsResponseData.success) {
            bookingStats = bookingStatsResponseData.data;
        }
    } else {
        console.error('Failed to fetch booking stats:', bookingStatsResponse.status, bookingStatsResponse.statusText);
    }
    
    return {
        user: session.user,
        labRooms,
        bookingStats
    }
}