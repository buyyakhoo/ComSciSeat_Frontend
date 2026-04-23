import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ locals, fetch }) => {
    const session = await locals.auth();
    if (!session?.user) {
        throw redirect(303, '/auth');
    }

    if (session.user.role !== 'admin') {
        throw redirect(303, '/admin/unauthorized');
    }

    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.backendToken}`
    };

    const endpoints = [
        { key: 'adminStats', url: `${env.BACKEND_API_URL}/api/admin/booking-stats-admin`, fallback: {} },
        { key: 'schedules', url: `${env.BACKEND_API_URL}/api/admin/class_schedule`, fallback: [] },
        { key: 'users', url: `${env.BACKEND_API_URL}/api/admin/users`, fallback: [] },
        { key: 'labs', url: `${env.BACKEND_API_URL}/api/admin/labs`, fallback: [] },
        { key: 'tables', url: `${env.BACKEND_API_URL}/api/admin/tables`, fallback: [] },
        { key: 'bookings', url: `${env.BACKEND_API_URL}/api/admin/bookings`, fallback: [] }
    ] as const;

    const results = await Promise.all(
        endpoints.map(async ({ key, url, fallback }) => {
            try {
                const response = await fetch(url, { headers: authHeaders });
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Admin load failed for ${key}:`, response.status, errorText);
                    return { key, data: fallback, error: `${key} (${response.status})` };
                }

                const payload = await response.json();
                return { key, data: payload.data ?? fallback, error: null };
            } catch (error) {
                console.error(`Admin load error for ${key}:`, error);
                return { key, data: fallback, error: `${key} (network error)` };
            }
        })
    );

    const data = Object.fromEntries(results.map(({ key, data }) => [key, data]));
    const loadErrors = results.flatMap(({ error }) => (error ? [error] : []));

    return {
        session,
        adminStats: data.adminStats,
        schedules: data.schedules,
        users: data.users,
        labs: data.labs,
        tables: data.tables,
        bookings: data.bookings,
        loadErrors
    };
}

export const actions: Actions = {
    changeUserType: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user) {
            throw redirect(303, '/auth');
        }
        const formData = await request.formData();
        const userId = formData.get('userId');
        const userType = formData.get('userType');

        const changeUserTypeResponse = await fetch(`${env.BACKEND_API_URL}/api/admin/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.backendToken}`
            },
            body: JSON.stringify({
                userId,
                userType
            })
        })

        if (!changeUserTypeResponse.ok) {
            return {
                success: false,
                message: 'Failed to change user type'
            }
        }

        return {
            success: true,
            message: 'User type changed successfully'
        }
    },

    addClassSchedule: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user) {
            throw redirect(303, '/auth')
        }
        const formData = await request.formData();
        const labId = formData.get('labId');
        const day_of_week = formData.get('day_of_week');
        const slot = formData.get('slot');
        const subject = formData.get('subject');

        const response = await fetch(`${env.BACKEND_API_URL}/api/admin/add_class_schedule`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.backendToken}`
            },
            body: JSON.stringify({ labId, day_of_week, slot, subject })
        })

        if (!response.ok) {
            try {
                const result = await response.json()
                return { success: false, message: result.error ?? 'เพิ่มไม่สำเร็จ' }
            } catch {
                return { success: false, message: 'เพิ่มไม่สำเร็จ' }
            }
        }

        return { success: true, message: 'เพิ่มตารางเรียนสำเร็จ' }
    },

    deleteClassSchedule: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user) throw redirect(303, '/auth')

        const formData = await request.formData()
        const classId = formData.get('classId')

        const response = await fetch(`${env.BACKEND_API_URL}/api/admin/class_schedule/${classId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.backendToken}`
            }
        })

        if (!response.ok) {
            try {
                const result = await response.json()
                return { success: false, message: result.error ?? 'ลบไม่สำเร็จ' }
            } catch {
                return { success: false, message: 'ลบไม่สำเร็จ' }
            }
        }

        return { success: true, message: 'ลบตารางเรียนสำเร็จ' }
    },
    addTable: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user) throw redirect(303, '/auth')

        const formData = await request.formData()
        const labId = formData.get('labId')
        const table_code = formData.get('table_code')

        const response = await fetch(`${env.BACKEND_API_URL}/api/admin/add_table`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.backendToken}`
            },
            body: JSON.stringify({ labId, table_code })
        })

        if (!response.ok) {
            try {
                const result = await response.json()
                return { success: false, message: result.error ?? 'เพิ่มไม่สำเร็จ' }
            } catch {
                return { success: false, message: 'เพิ่มไม่สำเร็จ' }
            }
        }

        return { success: true, message: 'เพิ่มโต๊ะสำเร็จ' }
    },
    deleteTable: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user) throw redirect(303, '/auth')

        const formData = await request.formData()
        const tableId = formData.get('tableId')

        const response = await fetch(`${env.BACKEND_API_URL}/api/admin/tables/${tableId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.backendToken}`
            }
        })

        if (!response.ok) {
            try {
                const result = await response.json()
                return { success: false, message: result.error ?? 'ลบไม่สำเร็จ' }
            } catch {
                return { success: false, message: 'ลบไม่สำเร็จ' }
            }
        }

        return { success: true, message: 'ลบโต๊ะสำเร็จ' }
    },
    addLab: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user) throw redirect(303, '/auth')

        const formData = await request.formData()
        const lab_name = formData.get('lab_name')
        const lab_code = formData.get('lab_code')

        const response = await fetch(`${env.BACKEND_API_URL}/api/admin/add_lab`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.backendToken}`
            },
            body: JSON.stringify({ lab_name, lab_code })
        })

        if (!response.ok) {
            try {
                const result = await response.json()
                return { success: false, message: result.error ?? 'เพิ่มไม่สำเร็จ' }
            } catch {
                return { success: false, message: 'เพิ่มไม่สำเร็จ' }
            }
        }

        return { success: true, message: 'เพิ่มห้องแลปสำเร็จ' }
    },

    deleteLab: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user) throw redirect(303, '/auth')

        const formData = await request.formData()
        const labId = formData.get('labId')

        const response = await fetch(`${env.BACKEND_API_URL}/api/admin/labs/${labId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.backendToken}`
            }
        })

        if (!response.ok) {
            try {
                const result = await response.json()
                return { success: false, message: result.error ?? 'ลบไม่สำเร็จ' }
            } catch {
                return { success: false, message: 'ลบไม่สำเร็จ' }
            }
        }

        return { success: true, message: 'ลบห้องแลปสำเร็จ' }
    },
    deleteBooking: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user) throw redirect(303, '/auth')

        const formData = await request.formData()
        const bookingId = formData.get('bookingId')

        const response = await fetch(`${env.BACKEND_API_URL}/api/admin/bookings/${bookingId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.backendToken}`
            }
        })

        if (!response.ok) {
            try {
                const result = await response.json()
                return { success: false, message: result.error ?? 'ยกเลิกไม่สำเร็จ' }
            } catch {
                return { success: false, message: 'ยกเลิกไม่สำเร็จ' }
            }
        }

        return { success: true, message: 'ยกเลิกการจองสำเร็จ' }
    },
    addBooking: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user) throw redirect(303, '/auth')

        const formData = await request.formData()
        const userId = formData.get('userId')
        const tableId = formData.get('tableId')
        const booking_date = formData.get('booking_date')
        const slot = formData.get('slot')

        const response = await fetch(`${env.BACKEND_API_URL}/api/admin/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.backendToken}`
            },
            body: JSON.stringify({ userId, tableId, booking_date, slot })
        })

        if (!response.ok) {
            try {
                const result = await response.json()
                return { success: false, message: result.error ?? 'เพิ่มไม่สำเร็จ' }
            } catch {
                return { success: false, message: 'เพิ่มไม่สำเร็จ' }
            }
        }

        return { success: true, message: 'เพิ่มการจองสำเร็จ' }
    },
}
