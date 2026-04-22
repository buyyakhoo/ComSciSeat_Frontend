import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ locals, fetch, params }) => {
    const session = await locals.auth();
    if (!session?.user) {
        redirect(303, '/auth');
    }

    const roomId = Number.parseInt(params.roomId || '0');
    const backendToken = session.backendToken;

    const [bookingRes, classScheduleRes, labsRes] = await Promise.all([
        fetch(`${env.BACKEND_API_URL}/api/reservations/my-bookings`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${backendToken}`
            }
        }),

        fetch(`${env.BACKEND_API_URL}/api/labs/${roomId}/class_schedule`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${backendToken}`
            }
        }),

        fetch(`${env.BACKEND_API_URL}/api/labs`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${backendToken}`
            }
        })
    ])

    let bookings = [];
    if (bookingRes.ok) {
        const bookingsData = await bookingRes.json();
        if (bookingsData.success) {
            bookings = bookingsData.data.map((reservation: any) => ({
                booking_id: reservation.booking_id,
                table_id: reservation.table_id,
                table_code: reservation.tables.table_code,
                lab_id: reservation.tables.lab_id,
                lab_name: reservation.tables.labs.lab_name,
                date: reservation.booking_date.slice(0, 10),
                slot: reservation.slot
            }))
        }
    }

    let classPeriods = [];
    if (classScheduleRes.ok) {
        const classData = await classScheduleRes.json();
        classPeriods = classData.data ?? [];
    }

    let roomCode = '';
    if (labsRes.ok) {
        const labsData = await labsRes.json();
        const lab = labsData.data?.find((l: any) => l.lab_id === roomId);
        roomCode = lab?.lab_code ?? '';
    } else {
        console.error('Lab API Error:', labsRes.status);
    }

    return {
        session,
        roomId,
        roomCode,
        bookings,
        classPeriods
    }
}

export const actions: Actions = {
    checkAvailability: async ({ request, locals, fetch }) => {
        const session = await locals.auth();
        if (!session?.user) redirect(303, '/auth');

        const formData = await request.formData();
        const lab_id = formData.get('lab_id');
        const date = formData.get('date');
        const slot = formData.get('slot');

        const response = await fetch(
            `${env.BACKEND_API_URL}/api/reservations/check-table-availability?lab_id=${lab_id}&date=${date}&slot=${slot}`,
            { 
                headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.backendToken}`
                    } 
            }
        );

        if (!response.ok) {
            const text = await response.text();
            console.error('Check availability failed:', text);
            return { tables: [], status: 'CLOSED', statusDescribe: 'ไม่สามารถตรวจสอบได้', isReserved: false};
        }

        const result = await response.json();
        return {
            tables: result.data,
            status: result.status,
            statusDescribe: result.message,
            isReserved: result.isReserved
        };
    },

    reserve: async ({ request, locals, fetch }) => {
        const session = await locals.auth();
        if (!session?.user) redirect(303, '/auth');

        const formData = await request.formData();

        const bookRes = await fetch(`${env.BACKEND_API_URL}/api/reservations/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.backendToken}`
            },
            body: JSON.stringify({
                table_id: Number(formData.get('table_id')),
                table_code: formData.get('table_code'),
                date: formData.get('date'),
                slot: formData.get('slot'),
                lab_id: Number(formData.get('lab_id'))
            })
        });

        if (!bookRes.ok) {
            const text = await bookRes.text();
            console.error('Book failed:', text);
            return { success: false, error: 'การจองล้มเหลว กรุณาลองใหม่' };
        }

        const response = await fetch(
            `${env.BACKEND_API_URL}/api/reservations/check-table-availability?lab_id=${formData.get('lab_id')}&date=${formData.get('date')}&slot=${formData.get('slot')}`,
            { 
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.backendToken}`
                } 
            }
        );
        const result = await response.json();
        return {
            tables: result.data,
            status: result.status,
            statusDescribe: result.message,
            isReserved: result.isReserved
        };
    }
};