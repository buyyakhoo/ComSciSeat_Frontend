import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth();

    // Redirect if no session
    if (!session?.user?.email) {
        throw redirect(302, '/auth');
    }

    try {
        // Extract user_id from email
        const email = session.user.email;
        const userId = email.split('@')[0].substring(0, 8);

        const backendToken = (session as any).backendToken;

        // Fetch profile data from backend
        const response = await fetch(`${env.BACKEND_API_URL}/user_service/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${backendToken}`
            }
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            console.error('Failed to fetch profile data:', data.error);
            return {
                session,
                profileData: null,
                error: data.error || 'ไม่สามารถโหลดข้อมูลได้'
            };
        }

        return {
            session,
            profileData: data,
            error: null
        };

    } catch (err) {
        console.error('Error fetching profile:', err);
        return {
            session,
            profileData: null,
            error: 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
        };
    }
};