import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async ({ locals, fetch }) => {
    const session = await locals.auth();
    if (!session?.user) redirect(303, '/auth');

    const [statsResponse, schedulesResponse, usersResponse, labsResponse, tablesResponse] = await Promise.all([
        fetch(`${env.BACKEND_API_URL}/api/admin/booking-stats-admin`, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.backendToken}` 
            }
        }),
        fetch(`${env.BACKEND_API_URL}/api/admin/class_schedule`, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.backendToken}` 
            }
        }),
        fetch(`${env.BACKEND_API_URL}/api/admin/users`, {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${session.backendToken}` 
            }
        }),
        fetch(`${env.BACKEND_API_URL}/api/admin/labs`, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.backendToken}` 
            }
        }),
        fetch(`${env.BACKEND_API_URL}/api/admin/tables`, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.backendToken}` 
            }
        })
    ]);

    const adminStats = statsResponse.ok ? (await statsResponse.json()).data : {};
    const schedules = schedulesResponse.ok ? (await schedulesResponse.json()).data : [];
    const users = usersResponse.ok ? (await usersResponse.json()).data : [];
    const labs = labsResponse.ok ? (await labsResponse.json()).data : [];
    const tables = tablesResponse.ok ? (await tablesResponse.json()).data : [];

    return { session, adminStats, schedules, users, labs, tables }
}

export const actions: Actions = {
    changeUserType: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user) {
            redirect(303, '/auth');
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
            redirect(303, '/auth')
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
            const result = await response.json()
            return { success: false, message: result.error ?? 'เพิ่มไม่สำเร็จ' }
        }

        return { success: true, message: 'เพิ่มตารางเรียนสำเร็จ' }
    },

    deleteClassSchedule: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user) redirect(303, '/auth')

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
            const result = await response.json()
            return { success: false, message: result.error ?? 'ลบไม่สำเร็จ' }
        }

        return { success: true, message: 'ลบตารางเรียนสำเร็จ' }
    },
    addTable: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user) redirect(303, '/auth')

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
            const result = await response.json()
            return { success: false, message: result.error ?? 'เพิ่มไม่สำเร็จ' }
        }

        return { success: true, message: 'เพิ่มโต๊ะสำเร็จ' }
    },
    deleteTable: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user) redirect(303, '/auth')

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
            const result = await response.json()
            return { success: false, message: result.error ?? 'ลบไม่สำเร็จ' }
        }

        return { success: true, message: 'ลบโต๊ะสำเร็จ' }
    },
}